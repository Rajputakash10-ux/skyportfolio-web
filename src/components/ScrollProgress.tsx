"use client";
import { useEffect, useRef } from "react";

// Uses a CSS custom property updated via direct DOM mutation (no React re-render)
// and transform:scaleX instead of width — fully composited, zero layout cost
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight);
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${pct})`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-[3px] z-[9999] origin-left will-change-transform"
      style={{
        transform: "scaleX(0)",
        background: "linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)",
      }}
      aria-hidden="true"
    />
  );
}
