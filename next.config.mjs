import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    // Tree-shake to only the exports actually imported
    optimizePackageImports: [
      "framer-motion",
      "react-intersection-observer",
      "react-type-animation",
    ],
    // Target last 2 modern browsers — eliminates Array.flat/at,
    // Object.fromEntries, optional-chaining polyfills
    browsersListForSwc: true,
  },
  // SWC-only, no Babel — prevents legacy class/spread transforms
  swcMinify: true,
  compiler: {
    // Strip console.* in production builds
    removeConsole: process.env.NODE_ENV === "production",
    // Strip data-testid and React dev-only props in production
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          // Isolate framer-motion into its own named async chunk.
          // All dynamic() imports of framer-motion components share this
          // single chunk — downloaded once, cached forever.
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: "framer-motion",
            chunks: "async",   // async-only: never in the initial bundle
            priority: 30,
          },
          // emailjs only loads when the contact form is submitted
          emailjs: {
            test: /[\\/]node_modules[\\/]@emailjs[\\/]/,
            name: "emailjs",
            chunks: "async",
            priority: 20,
          },
        },
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/resume.pdf",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
