const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security: Hide X-Powered-By header
  poweredByHeader: false,
  experimental: {
    missingSuspenseWithCSRBailout: false,
    // Enable optimizePackageImports for better tree-shaking
    optimizePackageImports: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'lucide-react',
      'framer-motion',
    ],
  },
  // Production'da console.log'ları kaldır
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },
  // Transpile Three.js packages for better tree-shaking
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
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
        hostname: 'api.tamirhanem.com',
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
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://vercel.live https://static.cloudflareinsights.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com https://vercel.live data:",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' blob: https://api.tamirhanem.net https://api.tamirhanem.com https://generativelanguage.googleapis.com https://www.google-analytics.com https://vitals.vercel-insights.com https://raw.githack.com https://*.sentry.io https://basemaps.cartocdn.com https://*.basemaps.cartocdn.com https://*.carto.com wss:",
              "worker-src 'self' blob:",
              "frame-src 'self' https://www.google.com https://vercel.live https://mcp.tamirhanem.net",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
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
  async redirects() {
    return [
      {
        source: '/obd-kodlari',
        destination: '/obd',
        permanent: true,
      },
      {
        source: '/obd-kodlari/:code',
        destination: '/obd/:code',
        permanent: true,
      },
      {
        source: '/ariza-kodlari',
        destination: '/obd',
        permanent: true,
      },
      {
        source: '/ariza-kodlari/:code',
        destination: '/obd/:code',
        permanent: true,
      },
      // Ariza rehberi Türkçe karakterli URL'ler
      { source: '/ariza-rehberi/egzoz-muayenesi-başarısız', destination: '/ariza-bul', permanent: false },
      { source: '/ariza-rehberi/araçtan-sıvı-sızıntısı', destination: '/ariza-bul', permanent: false },
      { source: '/ariza-rehberi/buğu-açıcı-çalışmıyor', destination: '/ariza-bul', permanent: false },
      { source: '/ariza-rehberi/frenlerim-ses-çıkarıyor', destination: '/ariza-bul', permanent: false },
      { source: '/ariza-rehberi/cam-suyu-çalışmıyor', destination: '/ariza-bul', permanent: false },
      { source: '/ariza-rehberi/fren-yaparken-araç-titriyor', destination: '/ariza-bul', permanent: false },
      { source: '/ariza-rehberi/akü-değişimi-sonrası-elektrik-sorunları', destination: '/ariza-bul', permanent: false },
      { source: '/ariza-rehberi/yeni-akü-sonrası-motor-duruyor', destination: '/ariza-bul', permanent: false },
      { source: '/ariza-rehberi/egzozdan-duman-çıkıyor', destination: '/ariza-bul', permanent: false },
      { source: '/ariza-rehberi/vakum-kaçağı-belirtileri', destination: '/ariza-bul', permanent: false },
      { source: '/ariza-rehberi/araç-titriyor', destination: '/ariza-bul', permanent: false },
      { source: '/ariza-rehberi/araçtan-garip-ses-geliyor', destination: '/ariza-bul', permanent: false },
      { source: '/ariza-rehberi/kalorifer-calismıyor', destination: '/ariza-bul', permanent: false },
      { source: '/ariza-rehberi/klima-calismıyor', destination: '/ariza-bul', permanent: false },
      { source: '/ariza-rehberi/arac-yag-sizdiriyor', destination: '/ariza-bul', permanent: false },
      { source: '/ariza-rehberi/motor-asiri-isiniyor', destination: '/ariza-bul', permanent: false },
      { source: '/ariza-rehberi/rolanti-duzensiz', destination: '/ariza-bul', permanent: false },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/ref/:code',
        destination: '/ref/index.html',
      },
      // Arıza rehberi Türkçe karakterli URL'leri /ariza-bul'a yönlendir
      {
        source: '/ariza-rehberi/:slug((?!check-engine-lambasi).*)',
        destination: '/ariza-bul',
      },
    ];
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
