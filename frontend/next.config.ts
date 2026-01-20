import type { NextConfig } from "next";

const nextConfig = {
  transpilePackages: [
    "@reown/appkit",
    "@reown/appkit-adapter-wagmi",
    "@reown/appkit-common",
    "@reown/appkit-core",
    "@reown/appkit-ui",
  ],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      os: false,
      path: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      readline: false,
      child_process: false,
      "@solana/kit": false,
      "@solana-program/system": false
    };
    return config;
  },
  typescript: {
    ignoreBuildErrors: true, 
  }
} satisfies NextConfig;

export default nextConfig;
