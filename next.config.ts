import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  serverExternalPackages: ["mongoose"], // Updated key for external server packages
  webpack: (config) => {
    config.experiments = {
      topLevelAwait: true, // Enables top-level await
      layers: true, // Enables Layers
    };
    return config;
  },
  async redirects() {
      return [
        // Basic redirect
        {
          source: '/podcasts',
          destination: '/',
          permanent: true,
        },
      ]
    },

};

export default nextConfig;

module.exports = nextConfig;
