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
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="bg-black p-6 group hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-lg">{skill.icon}</span>
              <h3 className="text-white text-sm font-light tracking-wide">{skill.category}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skill.items.map((item) => (
                <span key={item} className="px-2.5 py-1 text-xs text-white/40 border border-white/8 group-hover:text-white/60 group-hover:border-white/15 transition-colors">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* All skills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-10 pt-10 border-t border-white/8"
      >
        <p className="text-white/25 text-xs tracking-widest uppercase mb-5">All Technologies</p>
        <div className="flex flex-wrap gap-2">
          {allSkills.map((s) => (
            <span key={s} className="px-3 py-1.5 text-xs text-white/40 border border-white/8 hover:text-white hover:border-white/25 transition-colors cursor-default">
              {s}
            </span>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
