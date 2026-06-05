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

        <motion.div initial={{ opacity: 0, x: -16 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5 }}>
          <p className="text-black/55 text-sm leading-loose font-light mb-8">
            Motivated Computer Science graduate with hands-on experience in AI/ML, NLP, predictive modeling,
            and Python development. Passionate about building intelligent systems and solving real-world
            problems through Data Science.
          </p>
          <p className="text-black/55 text-sm leading-loose font-light mb-8">
            Currently deepening expertise in Deep Learning, Transformers, and MLOps — always learning, always building.
          </p>
          <div className="border-t border-black/8">
            {info.map((item) => (
              <div key={item.label} className="flex items-center gap-6 py-3 border-b border-black/8">
                <span className="text-black/30 text-xs tracking-widest uppercase w-20 flex-shrink-0">{item.label}</span>
                <span className="text-black text-sm font-light">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 16 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-px bg-black/8">
            {stats.map((s) => (
              <div key={s.label} className="bg-white p-8 flex flex-col justify-between">
                <span className="text-4xl font-thin text-black">{s.value}</span>
                <span className="text-black/30 text-xs tracking-widest uppercase mt-3">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="border border-black/8 p-6">
            <p className="text-black/30 text-xs tracking-widest uppercase mb-4">Currently Learning</p>
            <div className="flex flex-wrap gap-2">
              {["Deep Learning", "PyTorch", "Transformers", "CNNs", "RNNs", "MLOps"].map((t) => (
                <span key={t} className="px-3 py-1 text-xs text-black/40 border border-black/10 hover:text-black hover:border-black/30 transition-colors cursor-default">
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
