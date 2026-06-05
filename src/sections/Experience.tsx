"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper, { SectionTitle } from "@/components/SectionWrapper";
import { experience } from "@/data";

export default function Experience() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <SectionWrapper id="experience">
      <SectionTitle title="Experience" subtitle="Professional journey across industries." />
      <div ref={ref} className="space-y-3">
        {experience.map((e, i) => (
          <motion.div
            key={e.company}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="border border-white/8 p-6 hover:border-purple-500/40 hover:bg-purple-900/5 transition-all duration-300 group"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-white font-bold text-base tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>{e.company}</h3>
                <p className="text-purple-400/70 text-xs mt-0.5 tracking-wide font-medium">{e.role}</p>
              </div>
              <span className="text-white/25 text-xs tracking-widest border border-white/8 px-2 py-1 rounded-sm">{e.period}</span>
            </div>
            <p className="text-white/45 text-sm font-light leading-relaxed">{e.description}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
