import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        bg: {
          DEFAULT: "#080810",
          secondary: "#0d0d1a",
          tertiary: "#12121f",
        },
        fg: {
          DEFAULT: "#eeeef5",
          muted: "#8080a0",
          subtle: "#4a4a6a",
        },
        brand: {
          indigo: "#6366f1",
          cyan: "#06b6d4",
          "indigo-light": "#a5b4fc",
          "cyan-light": "#67e8f9",
          violet: "#8b5cf6",
        },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #6366f1, #06b6d4)",
        "gradient-brand-subtle": "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.15))",
        "noise": "url('/noise.png')",
      },
      boxShadow: {
        "glow-indigo": "0 0 40px -10px rgba(99,102,241,0.4)",
        "glow-cyan": "0 0 40px -10px rgba(6,182,212,0.4)",
        "glow-sm": "0 0 20px -5px rgba(99,102,241,0.3)",
        "card": "0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)",
      },
      animation: {
        "spin-slow": "spin 15s linear infinite",
        "spin-reverse": "spin-reverse 10s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
        "scan": "scan 3s ease-in-out infinite",
      },
      keyframes: {
        "spin-reverse": { to: { transform: "rotate(-360deg)" } },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        scan: {
          "0%, 100%": { transform: "translateY(-100%)" },
          "50%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
