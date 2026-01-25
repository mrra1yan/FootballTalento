import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gxbabato.footballtalento.com",
      },
      {
        protocol: "https",
        hostname: "docstec.site",
        // You can make it stricter (more secure) like this if you want:
        // pathname: "/wp-content/uploads/**",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;