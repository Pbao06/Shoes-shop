/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5293', // Backend .NET
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', // Frontend Next.js
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;