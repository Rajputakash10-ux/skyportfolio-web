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
      <div ref={ref} className="space-y-px">
        {experience.map((e, i) => (
          <motion.div
            key={e.company}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="border border-black/8 p-6 hover:border-black/20 transition-colors group"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="text-black font-light text-base tracking-tight">{e.company}</h3>
                <p className="text-black/40 text-xs mt-0.5 tracking-wide">{e.role}</p>
              </div>
              <span className="text-black/25 text-xs tracking-widest">{e.period}</span>
            </div>
            <p className="text-black/45 text-sm font-light leading-relaxed">{e.description}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
