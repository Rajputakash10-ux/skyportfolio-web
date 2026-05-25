"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper, { SectionTitle } from "@/components/SectionWrapper";

export default function Education() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <SectionWrapper id="education">
      <SectionTitle title="Education" subtitle="Academic foundation in Computer Science" />
      <div ref={ref} className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="glass rounded-2xl p-8 max-w-2xl w-full gradient-border hover:scale-[1.02] transition-transform duration-300"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-4xl flex-shrink-0 shadow-lg animate-pulse-glow">
              🎓
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white">
                  Graduated
                </span>
              </div>
              <h3 className="font-sora font-bold text-2xl text-white mb-1">
                B.Sc Computer Science
              </h3>
              <p className="text-[#3B82F6] font-semibold text-base mb-3">
                JVM Mehta Degree College
              </p>
              <p className="text-[#9CA3AF] text-sm leading-relaxed">
                Studied core Computer Science fundamentals including algorithms, data structures, software engineering,
                and applied mathematics — building the foundation for AI/ML expertise.
              </p>

              {/* Subjects */}
              <div className="mt-4 flex flex-wrap gap-2">
                {["Algorithms", "Data Structures", "Mathematics", "Software Engineering", "Databases", "Python"].map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
