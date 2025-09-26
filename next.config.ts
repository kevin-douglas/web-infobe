// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'proposta-infobe.yqxicu.easypanel.host',
      },
    ],
  },
};

module.exports = nextConfig;
