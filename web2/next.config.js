/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.tamirhanem.net', pathname: '/**' },
      { protocol: 'https', hostname: 'api.tamirhanem.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    STRAPI_URL: process.env.STRAPI_URL || 'https://api.tamirhanem.net',
    SITE_URL: process.env.SITE_URL || 'https://tamirhanem.com',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

module.exports = nextConfig
