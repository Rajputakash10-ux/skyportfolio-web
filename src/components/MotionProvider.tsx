"use client";
import { LazyMotion } from "framer-motion";

// Async loader — framer-motion features load in a separate chunk
// after hydration, not blocking the initial JS parse
const loadFeatures = () =>
  import("framer-motion").then((mod) => mod.domAnimation);

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={loadFeatures} strict>{children}</LazyMotion>;
}
