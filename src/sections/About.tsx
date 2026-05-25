"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper, { SectionTitle } from "@/components/SectionWrapper";

const stats = [
  { value: "5+", label: "Years Experience" },
  { value: "3+", label: "AI/ML Projects" },
  { value: "5+", label: "Companies" },
  { value: "10+", label: "Technologies" },
];

export default function About() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <SectionWrapper id="about">
      <SectionTitle
        title="About Me"
        subtitle="Passionate about building intelligent systems"
      />
      <div ref={ref} className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="glass rounded-2xl p-8 gradient-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-2xl">
                👨‍💻
              </div>
              <div>
                <h3 className="font-sora font-bold text-lg text-white">Akash Singh</h3>
                <p className="text-[#9CA3AF] text-sm">Computer Science Graduate</p>
              </div>
            </div>
            <p className="text-[#9CA3AF] leading-relaxed text-base mb-6">
              Motivated Computer Science graduate with hands-on experience in{" "}
              <span className="text-[#3B82F6] font-medium">AI/ML</span>,{" "}
              <span className="text-[#8B5CF6] font-medium">NLP</span>,{" "}
              <span className="text-[#EC4899] font-medium">predictive modeling</span>, and{" "}
              <span className="text-[#3B82F6] font-medium">Python development</span>. Passionate about building
              intelligent systems and solving real-world problems through Data Science.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Python", "TensorFlow", "NLP", "Scikit-Learn", "Flask", "SQL"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="glass rounded-2xl p-6 text-center gradient-border hover:scale-105 transition-transform duration-300"
            >
              <div className="font-sora font-extrabold text-4xl gradient-text mb-2">{stat.value}</div>
              <div className="text-[#9CA3AF] text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
