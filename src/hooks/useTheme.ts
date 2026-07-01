"use client";

import { useEffect, useState } from "react";

export type Theme = "dark" | "light" | "bw";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored && ["dark", "light", "bw"].includes(stored)) {
      applyTheme(stored);
      setTheme(stored);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial: Theme = prefersDark ? "dark" : "light";
      applyTheme(initial);
      setTheme(initial);
    }
  }, []);

  const toggle = (next: Theme) => {
    applyTheme(next);
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  return { theme, toggle };
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}
