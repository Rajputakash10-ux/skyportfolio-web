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
      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/8">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.category}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="bg-white p-6 group hover:bg-black/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-lg">{skill.icon}</span>
              <h3 className="text-black text-sm font-light tracking-wide">{skill.category}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skill.items.map((item) => (
                <span key={item} className="px-2.5 py-1 text-xs text-black/40 border border-black/10 group-hover:text-black/60 group-hover:border-black/20 transition-colors">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-10 pt-10 border-t border-black/8"
      >
        <p className="text-black/25 text-xs tracking-widest uppercase mb-5">All Technologies</p>
        <div className="flex flex-wrap gap-2">
          {allSkills.map((s) => (
            <span key={s} className="px-3 py-1.5 text-xs text-black/40 border border-black/10 hover:text-black hover:border-black/25 transition-colors cursor-default">
              {s}
            </span>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
