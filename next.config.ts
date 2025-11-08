import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "3.142.93.125",
        port: "5050",
        pathname: "/uploads/**",
      },

      {
        protocol: "http",
        hostname: "localhost",
        port: "5050",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "vipformalwear.s3.us-east-2.amazonaws.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**", 
      },
      {
        protocol: "https",
        hostname: "gentux.imgix.net",
        pathname: "/**",
      },
    ],
    domains: [
      "example.com",
      "vipformalwear.s3.us-east-2.amazonaws.com"
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
