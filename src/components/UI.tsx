"use client";
import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      setW((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div className="fixed top-0 left-0 h-px z-[9999] transition-all duration-75"
      style={{ width: `${w}%`, background: "linear-gradient(90deg, #8b5cf6, #3b82f6)" }}
    />
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 z-50 w-10 h-10 border border-purple-500/30 text-purple-400 hover:text-white hover:border-purple-500 hover:bg-purple-500/20 transition-all flex items-center justify-center text-xs rounded-sm"
      aria-label="Back to top"
    >
      ↑
    </button>
  );
}
