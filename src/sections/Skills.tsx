"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper, { SectionTitle } from "@/components/SectionWrapper";
import { skills } from "@/data";

const allSkills = ["Python", "SQL", "TensorFlow", "Scikit-Learn", "NLP", "Pandas", "NumPy", "Flask", "REST APIs", "Power BI", "Git", "GitHub", "Streamlit", "VS Code"];

export default function Skills() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <SectionWrapper id="skills">
      <SectionTitle title="Skills" subtitle="Technologies I work with to build intelligent systems." />
      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.category}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="bg-[#050508] p-6 group hover:bg-purple-900/10 transition-all duration-300 cursor-default"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xl">{skill.icon}</span>
              <h3 className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "'Sora', sans-serif" }}>{skill.category}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skill.items.map((item) => (
                <span key={item} className="px-2.5 py-1 text-xs text-white/40 border border-white/10 group-hover:text-white/70 group-hover:border-purple-500/40 transition-all rounded-sm">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-10 pt-10 border-t border-white/8"
      >
        <p className="text-purple-400/50 text-xs tracking-widest uppercase mb-5">All Technologies</p>
        <div className="flex flex-wrap gap-2">
          {allSkills.map((s) => (
            <span key={s} className="px-3 py-1.5 text-xs text-white/40 border border-white/10 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all cursor-default rounded-sm">
              {s}
            </span>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
