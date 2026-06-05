/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
    allowedOrigin: 'http://localhost:3000',
    },
  },
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
