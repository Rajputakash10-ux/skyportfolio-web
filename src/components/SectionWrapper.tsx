"use client";
import { m } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function SectionWrapper({
  id, children, className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.07 });
  return (
    <m.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, translateY: 32 }}
      animate={inView ? { opacity: 1, translateY: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`py-24 px-5 sm:px-8 max-w-6xl mx-auto ${className}`}
    >
      {children}
    </m.section>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-16">
      <h2 className="font-sora font-extrabold text-3xl sm:text-4xl gradient-text mb-3">{title}</h2>
      {subtitle && <p className="text-[#9CA3AF] text-sm sm:text-base max-w-lg mx-auto">{subtitle}</p>}
      <div className="mt-4 mx-auto w-14 h-[3px] rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]" />
    </div>
  );
}
