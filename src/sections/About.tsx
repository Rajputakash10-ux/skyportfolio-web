"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper, { SectionTitle } from "@/components/SectionWrapper";

const info = [
  { label: "Degree",   value: "B.Sc Computer Science" },
  { label: "College",  value: "JVM Mehta Degree College" },
  { label: "Focus",    value: "AI · ML · NLP · Python" },
  { label: "Email",    value: "rajputakash1656@gmail.com" },
  { label: "Location", value: "India" },
  { label: "Status",   value: "Open to Work" },
];

const stats = [
  { value: "5+",  label: "Years Experience" },
  { value: "3+",  label: "AI/ML Projects" },
  { value: "5+",  label: "Companies" },
  { value: "10+", label: "Technologies" },
];

export default function About() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <SectionWrapper id="about">
      <SectionTitle title="About" subtitle="Computer Science graduate passionate about AI/ML and intelligent systems." />
      <div ref={ref} className="grid lg:grid-cols-2 gap-16">

        <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
          <p className="text-white/60 text-base leading-loose font-light mb-6">
            Motivated Computer Science graduate with hands-on experience in AI/ML, NLP, predictive modeling,
            and Python development. Passionate about building intelligent systems and solving real-world
            problems through Data Science.
          </p>
          <p className="text-white/60 text-base leading-loose font-light mb-8">
            Currently deepening expertise in Deep Learning, Transformers, and MLOps — always learning, always building.
          </p>
          <div className="border-t border-white/8">
            {info.map((item) => (
              <div key={item.label} className="flex items-center gap-6 py-3.5 border-b border-white/8 group hover:bg-white/[0.02] transition-colors px-1 -mx-1">
                <span className="text-purple-400/70 text-xs tracking-widest uppercase w-20 flex-shrink-0">{item.label}</span>
                <span className="text-white/80 text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.15 }} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-px bg-white/8">
            {stats.map((s) => (
              <div key={s.label} className="bg-[#050508] p-8 flex flex-col justify-between group hover:bg-purple-900/10 transition-colors cursor-default">
                <span className="text-5xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>{s.value}</span>
                <span className="text-purple-400/60 text-xs tracking-widest uppercase mt-3">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="border border-white/8 p-6 hover:border-purple-500/30 transition-colors">
            <p className="text-purple-400/60 text-xs tracking-widest uppercase mb-4">Currently Learning</p>
            <div className="flex flex-wrap gap-2">
              {["Deep Learning", "PyTorch", "Transformers", "CNNs", "RNNs", "MLOps"].map((t) => (
                <span key={t} className="px-3 py-1.5 text-xs text-white/50 border border-white/10 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all cursor-default rounded-sm">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
