const withNextIntl = require('next-intl/plugin')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: true, // For static export compatibility
  },
  // For Hostinger deployment
  output: 'standalone',
  poweredByHeader: false,
}

module.exports = withNextIntl(nextConfig)

