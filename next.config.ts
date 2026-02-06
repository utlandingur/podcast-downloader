import type { NextConfig } from "next";

const isElectronBuild =
  process.env.ELECTRON_BUILD === "1" ||
  process.env.NEXT_PUBLIC_ELECTRON === "1";

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
    if (isElectronBuild) {
      const existing = config.resolve?.extensions ?? [];
      const electronExts = [
        ".electron.tsx",
        ".electron.ts",
        ".electron.jsx",
        ".electron.js",
      ];
      const merged = [...electronExts, ...existing].filter(
        (value, index, self) => self.indexOf(value) === index,
      );
      config.resolve = config.resolve || {};
      config.resolve.extensions = merged;
    }
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