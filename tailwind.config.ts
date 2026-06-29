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
          DEFAULT: "#0D0D15",
          secondary: "#12121E",
          tertiary: "#17172A",
        },
        fg: {
          DEFAULT: "#F5F5F5",
          muted: "#B8B8B8",
          subtle: "#6A6A8A",
        },
        brand: {
          purple: "#D4A5FF",
          teal: "#00E5CC",
          gold: "#FFB700",
          "purple-dim": "#A855F7",
          "teal-dim": "#00B8A3",
        },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #D4A5FF, #00E5CC)",
        "gradient-brand-gold": "linear-gradient(135deg, #D4A5FF, #FFB700)",
        "gradient-subtle": "linear-gradient(135deg, rgba(212,165,255,0.15), rgba(0,229,204,0.15))",
      },
      boxShadow: {
        "glow-purple": "0 0 40px -10px rgba(212,165,255,0.45)",
        "glow-teal": "0 0 40px -10px rgba(0,229,204,0.45)",
        "glow-gold": "0 0 40px -10px rgba(255,183,0,0.35)",
        "glow-sm": "0 0 20px -5px rgba(212,165,255,0.35)",
        "card": "0 1px 3px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.4)",
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
