"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function SectionWrapper({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.07 });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`py-24 px-6 sm:px-8 max-w-5xl mx-auto ${className}`}
    >
      {children}
    </motion.section>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-14">
      <div className="w-8 h-px bg-white mb-6" />
      <h2 className="font-light text-3xl sm:text-4xl text-white tracking-tight mb-3">{title}</h2>
      {subtitle && <p className="text-white/40 text-sm font-light max-w-md">{subtitle}</p>}
    </div>
  );
}
