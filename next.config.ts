import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'duunitori.fi' },
      { protocol: 'https', hostname: 't0.gstatic.com' },
      // Lisää tarvittaessa muita domainejasi
    ],
  },
};

export default nextConfig;
