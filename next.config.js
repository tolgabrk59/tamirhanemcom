const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Production'da console.log'ları kaldır
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },
  images: {
    // Modern formatları etkinleştir
    formats: ['image/avif', 'image/webp'],
    // Cihaz boyutları
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache süresi (saniye)
    minimumCacheTTL: 60 * 60 * 24, // 24 saat
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.tamirhanem.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
    ],
  },
  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/(.*).(jpg|jpeg|png|gif|ico|svg|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  env: {
    STRAPI_URL: process.env.STRAPI_URL || 'https://api.tamirhanem.net',
    SITE_URL: process.env.SITE_URL || 'https://tamirhanem.com',
  },
}

// Sentry configuration
const sentryWebpackPluginOptions = {
  org: 'next-ai-teknoloji-yazlm-san-ve',
  project: 'javascript-nextjs',

  // Only enable Sentry in production or when DSN is set
  silent: !process.env.SENTRY_DSN,

  // Upload source maps for better error tracking
  widenClientFileUpload: true,

  // Hide source maps from users
  hideSourceMaps: true,

  // Disable logger during build
  disableLogger: true,

  // Automatically tree-shake Sentry logger
  automaticVercelMonitors: true,
};

// Only wrap with Sentry if DSN is configured
module.exports = process.env.SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig;
