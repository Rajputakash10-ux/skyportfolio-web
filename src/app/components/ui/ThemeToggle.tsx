"use client";

import { motion } from "framer-motion";
import { Moon, Sun, Zap } from "lucide-react";
import { useTheme, type Theme } from "@/hooks/useTheme";

const MODES: { id: Theme; icon: React.ReactNode; label: string }[] = [
  { id: "dark",  icon: <Moon  size={13} />, label: "Dark"  },
  { id: "light", icon: <Sun   size={13} />, label: "Light" },
  { id: "bold",  icon: <Zap   size={13} />, label: "Bold"  },
];

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <div
      className="relative flex items-center rounded-full p-0.5 gap-0.5"
      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(212,165,255,0.15)" }}
      role="group"
      aria-label="Theme switcher"
    >
      {MODES.map(({ id, icon, label }) => {
        const active = theme === id;
        return (
          <button
            key={id}
            onClick={() => toggle(id)}
            aria-pressed={active}
            aria-label={`${label} mode`}
            className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-colors duration-200 focus-ring z-10"
            style={{ color: active ? "#0D0D15" : "var(--fg-muted)" }}
          >
            {active && (
              <motion.span
                layoutId="theme-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: "linear-gradient(135deg, #D4A5FF, #00E5CC)" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-1">
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
