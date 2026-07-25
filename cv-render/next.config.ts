import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: [
    "10.96.175.79",
    "10.96.175.79:3000",
  ],
};

export default nextConfig;
