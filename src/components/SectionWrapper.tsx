"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionWrapper({ id, children, className = "" }: SectionWrapperProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto ${className}`}
    >
      {children}
    </motion.section>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-16">
      <h2 className="font-sora font-bold text-3xl sm:text-4xl gradient-text mb-3">{title}</h2>
      {subtitle && <p className="text-[#9CA3AF] text-base max-w-xl mx-auto">{subtitle}</p>}
      <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]" />
    </div>
  );
}
