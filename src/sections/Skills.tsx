"use client";
import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper, { SectionTitle } from "@/components/SectionWrapper";
import { skills } from "@/data";

const learning = [
  { title: "Deep Learning",  icon: "🧬", desc: "Neural architectures & optimization",  progress: 70 },
  { title: "CNNs",           icon: "👁️", desc: "Vision tasks & image recognition",      progress: 60 },
  { title: "RNNs",           icon: "🔄", desc: "Sequential data & time series",         progress: 55 },
  { title: "Transformers",   icon: "⚡", desc: "BERT, GPT & attention mechanisms",      progress: 65 },
  { title: "MLOps",          icon: "🚀", desc: "Deployment, monitoring & CI/CD",        progress: 50 },
  { title: "PyTorch",        icon: "🔥", desc: "Dynamic graphs & research",             progress: 60 },
];

export default function Skills() {
  const [tab, setTab] = useState<"skills" | "learning">("skills");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <SectionWrapper id="skills">
      <SectionTitle title="Skills & Learning" subtitle="Technologies I use and currently mastering" />

      {/* Tab switcher */}
      <div className="flex justify-center mb-8">
        <div className="glass rounded-xl p-1 flex gap-1 border border-white/[0.08]">
          {(["skills", "learning"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] ${
                tab === t
                  ? "bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white shadow-lg"
                  : "text-[#9CA3AF] hover:text-white"
              }`}
            >
              {t === "skills" ? "🛠 Skills" : "📚 Learning"}
            </button>
          ))}
        </div>
      </div>

      <div ref={ref}>
        <AnimatePresence mode="wait">
          {tab === "skills" ? (
            <m.div
              key="skills"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {skills.map((skill, i) => (
                <m.div
                  key={skill.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="glass rounded-2xl p-5 gradient-border group hover:scale-[1.03] transition-transform duration-200 relative overflow-hidden cursor-default"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 rounded-2xl`} aria-hidden="true" />

                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center text-lg shadow-lg flex-shrink-0`} aria-hidden="true">
                      {skill.icon}
                    </div>
                    <h3 className="font-sora font-semibold text-white text-sm">{skill.category}</h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5 relative z-10">
                    {skill.items.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 text-[#9CA3AF] border border-white/[0.08] group-hover:border-white/[0.18] group-hover:text-white/85 transition-all duration-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <m.div
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.7, delay: 0.3 + i * 0.07 }}
                    style={{ transformOrigin: "left" }}
                    className={`mt-4 h-[2px] rounded-full bg-gradient-to-r ${skill.color} opacity-40 relative z-10`}
                  />
                </m.div>
              ))}
            </m.div>
          ) : (
            <m.div
              key="learning"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {learning.map((item, i) => (
                <m.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className="glass rounded-2xl p-5 gradient-border group hover:scale-[1.03] transition-transform duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <m.span
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                      className="text-2xl will-change-transform"
                      aria-hidden="true"
                    >
                      {item.icon}
                    </m.span>
                    <div>
                      <h3 className="font-sora font-semibold text-white text-sm">{item.title}</h3>
                      <p className="text-[#9CA3AF] text-xs">{item.desc}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Progress</span>
                      <span className="text-[10px] font-bold text-[#60a5fa]">{item.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <m.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.2 + i * 0.08, ease: "easeOut" }}
                        style={{ transformOrigin: "left", width: `${item.progress}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] will-change-transform"
                      />
                    </div>
                  </div>
                </m.div>
              ))}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}
