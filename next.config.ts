import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    domains: ["img.buymeacoffee.com"],
  },
};

export default nextConfig;
