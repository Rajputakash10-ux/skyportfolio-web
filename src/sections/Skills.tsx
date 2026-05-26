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
      <SectionTitle title="Skills & Expertise" subtitle="Technologies I work with to build intelligent systems" />

      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.category}
            initial={{ opacity: 0, translateY: 28 }}
            animate={inView ? { opacity: 1, translateY: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.09 }}
            className="glass rounded-2xl p-6 gradient-border group hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden"
          >
            {/* Background glow on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 rounded-2xl`} />

            {/* Header */}
            <div className="flex items-center gap-3 mb-5 relative z-10">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center text-xl shadow-lg flex-shrink-0`}>
                {skill.icon}
              </div>
              <h3 className="font-sora font-semibold text-white text-sm">{skill.category}</h3>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 relative z-10">
              {skill.items.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-[#9CA3AF] border border-white/8 group-hover:border-white/15 group-hover:text-white/80 transition-all duration-200"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Bottom gradient bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.09 }}
              style={{ transformOrigin: "left" }}
              className={`mt-5 h-[2px] rounded-full bg-gradient-to-r ${skill.color} opacity-50 relative z-10`}
            />
          </motion.div>
        ))}
      </div>

      {/* All skills pill cloud */}
      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={inView ? { opacity: 1, translateY: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.65 }}
        className="mt-12"
      >
        <p className="text-center text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest mb-5">All Technologies</p>
        <div className="flex flex-wrap justify-center gap-2.5">
          {allSkills.map((s, i) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.7 + i * 0.04 }}
              className="px-4 py-2 rounded-full text-sm font-medium glass border border-white/8 text-[#9CA3AF] hover:text-white hover:border-[#3B82F6]/50 hover:bg-[#3B82F6]/5 transition-all duration-200 cursor-default"
            >
              {s}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
