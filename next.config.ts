import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['static.usernames.app-backend.toolsforhumanity.com','gindbc-ip-174-160-246-170.tunnelmole.net'],
  },
  allowedDevOrigins: ['inspired-hopefully-raven.ngrok-free.app'], // Add your dev origin here
  reactStrictMode: false,
  eslint:{
    ignoreDuringBuilds:true
  },
  typescript:{
    ignoreBuildErrors:true
  }
};

export default nextConfig;
