import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'www.culture.go.kr',
        port: '',
        pathname: '/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'www.culture.go.kr',
        port: '',
        pathname: '/upload/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@public': path.resolve(__dirname, 'public'),
    };
    return config;
  },
};

export default nextConfig;
