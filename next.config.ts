import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Default API URL - production server
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.cvibe.dev/api/v1',
  },
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },
};

export default nextConfig;
