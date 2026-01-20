import type { NextConfig } from "next";
import webpack from "webpack";

const nextConfig = {
  transpilePackages: [
    "@reown/appkit",
    "@reown/appkit-adapter-wagmi",
    "@reown/appkit-common",
    "@reown/appkit-core",
    "@reown/appkit-ui",
    "wagmi",
    "viem",
    "@wagmi/core",
    "@wagmi/connectors",
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        assert: require.resolve("assert"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        os: require.resolve("os-browserify/browser"),
        url: require.resolve("url"),
        zlib: require.resolve("browserify-zlib"),
        path: require.resolve("path-browserify"),
        fs: false,
        net: false,
        tls: false,
        readline: false,
        child_process: false,
        "@react-native-async-storage/async-storage": false,
      };

      config.plugins.push(
        new webpack.ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        })
      );
    }

    return config;
  },
  typescript: {
    ignoreBuildErrors: true, 
  }
} satisfies NextConfig;

export default nextConfig;
