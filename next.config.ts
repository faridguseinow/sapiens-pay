import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uysvfwckavidzpdqzigh.supabase.co",
        pathname: "/storage/v1/object/public/blog-images/**",
      },
    ],
  },
};

export default nextConfig;
