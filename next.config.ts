import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Confirmation URLs contain one-time credentials; do not log request URLs.
  logging: false,
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
};

export default nextConfig;
