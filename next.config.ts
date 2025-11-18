import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Turbopack config (Next.js 16 default)
  turbopack: {},
};

export default nextConfig;
