"use client";

import { useState, useEffect, type ReactNode } from "react";

// Dynamically import LazyMotion only after hydration
// This breaks the static module graph so webpack cannot trace
// framer-motion into the eager shared chunk
let LazyMotionComponent: React.ComponentType<{ children: ReactNode }> | null = null;

export default function MotionProvider({ children }: { children: ReactNode }) {
  const [Wrapper, setWrapper] = useState<React.ComponentType<{ children: ReactNode }> | null>(null);

  useEffect(() => {
    if (LazyMotionComponent) {
      setWrapper(() => LazyMotionComponent);
      return;
    }
    // Import framer-motion only after first paint
    import("framer-motion").then(({ LazyMotion, domAnimation }) => {
      const Comp = ({ children }: { children: ReactNode }) => (
        <LazyMotion features={domAnimation} strict>{children}</LazyMotion>
      );
      LazyMotionComponent = Comp;
      setWrapper(() => Comp);
    });
  }, []);

  // Render children immediately without wrapper — animations activate once loaded
  if (!Wrapper) return <>{children}</>;
  return <Wrapper>{children}</Wrapper>;
}
