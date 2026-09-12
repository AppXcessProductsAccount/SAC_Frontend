import type { NextConfig } from "next";
import path from "path";

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
  // Pin the workspace root to this folder so Turbopack doesn't guess a parent
  // directory when several lockfiles exist up the tree. Must be absolute.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
