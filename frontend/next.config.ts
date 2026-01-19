import type { NextConfig } from "next";

const nextConfig = {
  transpilePackages: [
    "@reown/appkit",
    "@reown/appkit-adapter-wagmi",
    "@reown/appkit-common",
    "@reown/appkit-core",
    "@reown/appkit-ui",
    "@coinbase/cdp-sdk",
    "@base-org/account"
  ],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
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
