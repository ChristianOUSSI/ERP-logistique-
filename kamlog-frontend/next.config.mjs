/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['http://localhost:3000', 'localhost:3000'],
    },
  },
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
