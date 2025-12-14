/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'strapi.tamirhanem.com', 'api.tamirhanem.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    STRAPI_URL: process.env.STRAPI_URL || 'https://api.tamirhanem.net',
    SITE_URL: process.env.SITE_URL || 'https://tamirhanem.com',
  },
}

module.exports = nextConfig
