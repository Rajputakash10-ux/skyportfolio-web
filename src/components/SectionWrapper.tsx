"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function SectionWrapper({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.07 });
  return (
    <motion.section
      id={id} ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`py-28 px-6 sm:px-8 max-w-5xl mx-auto ${className}`}
    >
      {children}
    </motion.section>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-8 h-px bg-gradient-to-r from-purple-500 to-blue-500" />
        <span className="text-xs tracking-[0.3em] uppercase text-purple-400 font-medium">{title}</span>
      </div>
      <h2 className="font-bold text-4xl sm:text-5xl text-white tracking-tight mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>{title}</h2>
      {subtitle && <p className="text-white/40 text-base font-light max-w-lg leading-relaxed">{subtitle}</p>}
    </div>
  );
}
