"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper, { SectionTitle } from "@/components/SectionWrapper";

const stats = [
  { value: "5+", label: "Years Experience", icon: "💼" },
  { value: "3+", label: "AI/ML Projects",   icon: "🤖" },
  { value: "5+", label: "Companies",        icon: "🏢" },
  { value: "10+", label: "Technologies",    icon: "⚡" },
];

const highlights = [
  { icon: "🎓", text: "B.Sc Computer Science — JVM Mehta Degree College" },
  { icon: "🤖", text: "Hands-on AI/ML, NLP & Predictive Modeling experience" },
  { icon: "🐍", text: "Python-first developer with Flask & REST API expertise" },
  { icon: "📊", text: "Data storytelling with Power BI, Pandas & Streamlit" },
  { icon: "🚀", text: "Currently learning Deep Learning, Transformers & MLOps" },
];

export default function About() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <SectionWrapper id="about">
      <SectionTitle title="About Me" subtitle="Passionate about building intelligent systems" />
      <div ref={ref} className="grid lg:grid-cols-5 gap-10 items-start">

        {/* Left — bio */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3 space-y-6"
        >
          <div className="glass rounded-2xl p-7 gradient-border">
            {/* Avatar row */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20 flex-shrink-0">
                👨‍💻
              </div>
              <div>
                <h3 className="font-sora font-bold text-white text-lg">Akash Singh</h3>
                <p className="text-[#9CA3AF] text-sm">Computer Science Graduate · India</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs font-medium">Open to Work</span>
                </div>
              </div>
            </div>

            <p className="text-[#9CA3AF] leading-relaxed text-sm sm:text-base mb-6">
              Motivated Computer Science graduate with hands-on experience in{" "}
              <span className="text-[#60a5fa] font-medium">AI/ML</span>,{" "}
              <span className="text-[#a78bfa] font-medium">NLP</span>,{" "}
              <span className="text-[#f472b6] font-medium">predictive modeling</span>, and{" "}
              <span className="text-[#60a5fa] font-medium">Python development</span>. Passionate about building
              intelligent systems and solving real-world problems through Data Science.
            </p>

            {/* Highlights */}
            <div className="space-y-3">
              {highlights.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3 text-sm text-[#9CA3AF]"
                >
                  <span className="text-base flex-shrink-0" aria-hidden="true">{h.icon}</span>
                  <span>{h.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right — stats */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 grid grid-cols-2 gap-4"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: 0.35 + i * 0.1 }}
              className="glass rounded-2xl p-5 text-center gradient-border group hover:scale-105 transition-transform duration-300"
            >
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-sora font-extrabold text-3xl gradient-text mb-1">{s.value}</div>
              <div className="text-[#9CA3AF] text-xs leading-tight">{s.label}</div>
            </motion.div>
          ))}

          {/* Currently learning card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.45, delay: 0.75 }}
            className="col-span-2 glass rounded-2xl p-5 gradient-border"
          >
            <p className="text-xs font-semibold text-[#3B82F6] uppercase tracking-wider mb-3">Currently Learning</p>
            <div className="flex flex-wrap gap-2">
              {["Deep Learning", "PyTorch", "Transformers", "CNNs", "RNNs", "MLOps"].map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#3B82F6]/10 text-[#60a5fa] border border-[#3B82F6]/20">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
