"use client";
import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setWidth(scrolled);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-[3px] z-[9999] transition-all duration-100"
      style={{
        width: `${width}%`,
        background: "linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)",
      }}
    />
  );
}
