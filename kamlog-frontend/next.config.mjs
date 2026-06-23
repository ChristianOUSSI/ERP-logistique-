/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'http://localhost:3000',
        'localhost:3000',
        'https://kamlog.vercel.app',
        '*.up.railway.app',
      ],
    },
  },
  images: {
    domains: ['localhost', 'kamlog.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.railway.app',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
    ],
  },
  // Permettre les requêtes vers le backend Railway
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};

export default nextConfig;
