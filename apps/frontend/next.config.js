/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001']
    }
  },
  env: {
    API_GATEWAY_URL: process.env.API_GATEWAY_URL || 'http://localhost:3001'
  }
}

module.exports = nextConfig