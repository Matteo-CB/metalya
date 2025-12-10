import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    ppr: "incremental",
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
