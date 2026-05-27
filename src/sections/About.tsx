"use client";
import { m } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper, { SectionTitle } from "@/components/SectionWrapper";

const highlights = [
  { icon: "🤖", text: "Hands-on AI/ML, NLP & Predictive Modeling" },
  { icon: "🐍", text: "Python · Flask · REST APIs · SQL" },
  { icon: "📊", text: "Power BI · Pandas · Streamlit" },
  { icon: "🚀", text: "Learning Deep Learning, Transformers & MLOps" },
];

const subjects = ["Algorithms", "Data Structures", "Software Engineering", "Databases", "Python", "OOP", "Networks", "Mathematics"];

export default function About() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <SectionWrapper id="about">
      <SectionTitle title="About Me" subtitle="CS graduate passionate about building intelligent systems" />
      <div ref={ref} className="grid lg:grid-cols-2 gap-8 items-start">

        {/* Left — bio */}
        <m.div
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="glass rounded-2xl p-6 gradient-border"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-xl flex-shrink-0" aria-hidden="true">👨💻</div>
            <div>
              <h3 className="font-sora font-bold text-white">Akash Singh</h3>
              <p className="text-[#9CA3AF] text-xs">CS Graduate · India</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
                <span className="text-green-400 text-xs font-medium">Open to Work</span>
              </div>
            </div>
          </div>

          <p className="text-[#9CA3AF] text-sm leading-relaxed mb-5">
            Motivated CS graduate with hands-on experience in{" "}
            <span className="text-[#60a5fa] font-medium">AI/ML</span>,{" "}
            <span className="text-[#a78bfa] font-medium">NLP</span>, and{" "}
            <span className="text-[#60a5fa] font-medium">Python development</span>. Passionate about solving real-world problems through Data Science.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {highlights.map((h, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.35, delay: 0.2 + i * 0.07 }}
                className="flex items-center gap-2 text-xs text-[#9CA3AF] bg-white/[0.03] rounded-lg px-3 py-2"
              >
                <span aria-hidden="true">{h.icon}</span>
                <span>{h.text}</span>
              </m.div>
            ))}
          </div>
        </m.div>

        {/* Right — education + stats */}
        <m.div
          initial={{ opacity: 0, x: 24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="space-y-4"
        >
          {/* Education card */}
          <div className="glass rounded-2xl p-5 gradient-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-xl flex-shrink-0 animate-pulse-glow" aria-hidden="true">🎓</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white">Graduated</span>
                </div>
                <h3 className="font-sora font-bold text-white text-sm">B.Sc Computer Science</h3>
                <p className="text-[#60a5fa] text-xs font-medium">JVM Mehta Degree College</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {subjects.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#3B82F6]/10 text-[#60a5fa] border border-[#3B82F6]/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "5+", label: "Years Experience", icon: "💼" },
              { value: "3+", label: "AI/ML Projects",   icon: "🤖" },
              { value: "5+", label: "Companies",        icon: "🏢" },
              { value: "10+", label: "Technologies",    icon: "⚡" },
            ].map((s, i) => (
              <m.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                className="glass rounded-xl p-4 text-center gradient-border hover:scale-105 transition-transform duration-200"
              >
                <div className="text-xl mb-1" aria-hidden="true">{s.icon}</div>
                <div className="font-sora font-extrabold text-2xl gradient-text">{s.value}</div>
                <div className="text-[#9CA3AF] text-[10px] mt-0.5">{s.label}</div>
              </m.div>
            ))}
          </div>

          {/* Currently learning pills */}
          <div className="glass rounded-xl p-4 gradient-border">
            <p className="text-[10px] font-bold text-[#3B82F6] uppercase tracking-wider mb-2">Currently Learning</p>
            <div className="flex flex-wrap gap-1.5">
              {["Deep Learning", "PyTorch", "Transformers", "CNNs", "RNNs", "MLOps"].map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#3B82F6]/10 text-[#60a5fa] border border-[#3B82F6]/20">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </m.div>
      </div>
    </SectionWrapper>
  );
}
