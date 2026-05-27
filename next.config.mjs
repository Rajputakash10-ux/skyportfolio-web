/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    // Tree-shake framer-motion & react-intersection-observer to only import used exports
    optimizePackageImports: ["framer-motion", "react-intersection-observer"],
    // Target modern browsers via .browserslistrc — eliminates
    // Array.prototype.at/flat, Object.fromEntries, Array.prototype.at polyfills
    browsersListForSwc: true,
  },
  // SWC-only (no Babel) — prevents legacy class/spread/optional-chaining transforms
  swcMinify: true,
  compiler: {
    // Strip data-testid and React dev props in production
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },
  // Split large vendor chunks so each route only loads what it needs
  webpack(config, { isServer }) {
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: "framer-motion",
            chunks: "all",
            priority: 30,
          },
          emailjs: {
            test: /[\\/]node_modules[\\/]@emailjs[\\/]/,
            name: "emailjs",
            chunks: "async",   // only loaded when contact form submits
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

export default nextConfig;
