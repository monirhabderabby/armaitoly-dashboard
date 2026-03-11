import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "avatar.iran.liara.run",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
