import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1:3000", "localhost:3000"],
  serverExternalPackages: ["pdf-parse", "@napi-rs/canvas"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "duunitori.fi" },
      { protocol: "https", hostname: "t0.gstatic.com" },
      // Lisää tarvittaessa muita domainejasi
    ],
  },
};

export default nextConfig;