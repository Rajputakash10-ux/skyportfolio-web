"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper, { SectionTitle } from "@/components/SectionWrapper";
import { skills } from "@/data";

export default function Skills() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <SectionWrapper id="skills">
      <SectionTitle title="Skills & Expertise" subtitle="Technologies I work with to build intelligent systems" />
      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.category}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass rounded-2xl p-6 gradient-border group hover:scale-[1.02] transition-transform duration-300"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center text-xl shadow-lg`}>
                {skill.icon}
              </div>
              <h3 className="font-sora font-semibold text-white text-base">{skill.category}</h3>
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-2">
              {skill.items.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-[#9CA3AF] border border-white/8 group-hover:border-white/15 transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Gradient bar */}
            <div className={`mt-5 h-1 rounded-full bg-gradient-to-r ${skill.color} opacity-60`} />
          </motion.div>
        ))}
      </div>

      {/* All skills pill row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="mt-12 flex flex-wrap justify-center gap-3"
      >
        {["Python", "SQL", "TensorFlow", "Scikit-Learn", "NLP", "Pandas", "NumPy", "Flask", "REST APIs", "Power BI", "Git", "GitHub", "Streamlit", "VS Code"].map((s) => (
          <span
            key={s}
            className="px-4 py-2 rounded-full text-sm font-medium glass border border-white/10 text-[#9CA3AF] hover:text-white hover:border-[#3B82F6]/50 transition-all duration-200 cursor-default"
          >
            {s}
          </span>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
