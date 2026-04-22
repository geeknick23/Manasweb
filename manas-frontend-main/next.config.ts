import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/uploads/**',
      },
      // Railway backend (production)
      {
        protocol: 'https',
        hostname: '*.up.railway.app',
        pathname: '/**',
      },
      // Vercel backend (production)
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/**',
      },
      // Cloudinary (profile photos)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      // External image hosts
      {
        protocol: 'https',
        hostname: 'iili.io',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
