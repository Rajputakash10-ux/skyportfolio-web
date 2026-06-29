"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/hooks/useTheme";

/* Half-filled circle icon for B&W / Classic mode */
function ClassicIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6.5 1a5.5 5.5 0 0 1 0 11V1z" fill="currentColor" />
    </svg>
  );
}

const MODES: { id: Theme; icon: React.ReactNode; label: string }[] = [
  { id: "dark",  icon: <Moon size={13} />,   label: "Dark"  },
  { id: "light", icon: <Sun  size={13} />,   label: "Light" },
  { id: "bold",  icon: <ClassicIcon />,       label: "B&W"   },
];

/* Active pill colour per theme */
const PILL_BG: Record<Theme, string> = {
  dark:  "linear-gradient(135deg, #D4A5FF, #00E5CC)",
  light: "#0D0D15",
  bold:  "#000000",
};

const PILL_TEXT: Record<Theme, string> = {
  dark:  "#0D0D15",
  light: "#FFFFFF",
  bold:  "#FFFFFF",
};

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <div
      className="relative flex items-center rounded-full p-0.5 gap-0.5"
      style={{
        background: theme === "bold" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
        border: theme === "bold" ? "1px solid rgba(0,0,0,0.15)" : "1px solid rgba(212,165,255,0.15)",
      }}
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
            style={{ color: active ? PILL_TEXT[theme] : "var(--fg-muted)" }}
          >
            {active && (
              <motion.span
                layoutId="theme-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: PILL_BG[theme] }}
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
