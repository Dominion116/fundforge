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
  // Ignore linting and type checking for faster builds/deployment if needed
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, 
  }
} satisfies NextConfig;

export default nextConfig;
