import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vbkykstqxkwizycbwpxw.supabase.co',
        pathname: '/storage/v1/object/public/products/**',
      },
         {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;
