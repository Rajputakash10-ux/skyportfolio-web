"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/hooks/useTheme";

function BWIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6.5 1a5.5 5.5 0 0 1 0 11V1z" fill="currentColor" />
    </svg>
  );
}

const MODES: { id: Theme; icon: React.ReactNode; label: string }[] = [
  { id: "dark",  icon: <Moon size={13} />, label: "Dark"  },
  { id: "light", icon: <Sun  size={13} />, label: "Light" },
  { id: "bw",    icon: <BWIcon />,         label: "B&W"   },
];

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <div
      className="relative flex items-center rounded-full p-0.5 gap-0.5"
      style={{
        background: "var(--glass-bg)",
        border: "1px solid var(--border)",
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
            className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium focus-ring z-10"
            style={{
              color: active ? (theme === "light" ? "#ffffff" : "var(--bg)") : "var(--fg-muted)",
              transition: "color 300ms ease-in-out",
            }}
          >
            {active && (
              <span
                className="absolute inset-0 rounded-full"
                style={{ background: "var(--gradient-brand)" }}
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
