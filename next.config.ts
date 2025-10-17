import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    domains: [
      'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      // Add other domains you use for images
    ],
    // Alternatively, you can use remotePatterns for more control (recommended)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      // Add other image hosts as needed
    ],
  },
};

export default nextConfig;
