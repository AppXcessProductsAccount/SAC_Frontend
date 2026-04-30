import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  output: "standalone",
  // @ts-ignore - Turbopack config to fix workspace root issues on Windows
  turbopack: {
    root: ".",
  },
};

export default nextConfig;
