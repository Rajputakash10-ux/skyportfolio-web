"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper, { SectionTitle } from "@/components/SectionWrapper";

const subjects = ["Algorithms", "Data Structures", "Mathematics", "Software Engineering", "Databases", "Python", "OOP", "Computer Networks"];

export default function Education() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.25 });

  return (
    <SectionWrapper id="education">
      <SectionTitle title="Education" subtitle="Academic foundation in Computer Science" />
      <div ref={ref} className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="glass rounded-2xl p-8 max-w-2xl w-full gradient-border hover:scale-[1.01] transition-transform duration-300"
        >
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-4xl flex-shrink-0 shadow-xl shadow-blue-500/20 animate-pulse-glow">
              🎓
            </div>

            <div className="flex-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white mb-3">
                Graduated
              </span>
              <h3 className="font-sora font-extrabold text-2xl text-white mb-1">B.Sc Computer Science</h3>
              <p className="text-[#60a5fa] font-semibold text-base mb-4">JVM Mehta Degree College</p>
              <p className="text-[#9CA3AF] text-sm leading-relaxed mb-5">
                Studied core Computer Science fundamentals including algorithms, data structures, software engineering,
                and applied mathematics — building the foundation for AI/ML expertise.
              </p>

              {/* Subjects */}
              <div className="flex flex-wrap gap-2">
                {subjects.map((s, i) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[#3B82F6]/10 text-[#60a5fa] border border-[#3B82F6]/20 hover:bg-[#3B82F6]/20 transition-colors cursor-default"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
