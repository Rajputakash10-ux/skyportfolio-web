"use client";

import { m as motion } from "framer-motion";

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeader({ label, title, subtitle, align = "center" }: SectionHeaderProps) {
  const isCenter = align === "center";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-16 ${isCenter ? "text-center" : "text-left"}`}
    >
      <p className="section-label mb-3">{label}</p>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">{title}</h2>
      {subtitle && (
        <p className={`mt-3 text-fg-muted text-base leading-relaxed max-w-lg ${isCenter ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
