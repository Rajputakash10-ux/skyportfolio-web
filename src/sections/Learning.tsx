"use client";
import { m } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper, { SectionTitle } from "@/components/SectionWrapper";

const learning = [
  { title: "Deep Learning",  icon: "🧬", desc: "Neural architectures & optimization",  progress: 70 },
  { title: "CNNs",           icon: "👁️", desc: "Vision tasks & image recognition",      progress: 60 },
  { title: "RNNs",           icon: "🔄", desc: "Sequential data & time series",         progress: 55 },
  { title: "Transformers",   icon: "⚡", desc: "BERT, GPT & attention mechanisms",      progress: 65 },
  { title: "MLOps",          icon: "🚀", desc: "Deployment, monitoring & CI/CD",        progress: 50 },
  { title: "PyTorch",        icon: "🔥", desc: "Dynamic graphs & research",             progress: 60 },
];

export default function Learning() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <SectionWrapper id="learning">
      <SectionTitle title="Currently Learning" subtitle="Continuously expanding my AI/ML expertise" />
      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {learning.map((item, i) => (
          <m.div
            key={item.title}
            initial={{ opacity: 0, translateY: 24, scale: 0.95 }}
            animate={inView ? { opacity: 1, translateY: 0, scale: 1 } : {}}
            transition={{ duration: 0.45, delay: i * 0.09 }}
            className="glass rounded-2xl p-5 gradient-border group hover:scale-[1.03] transition-transform duration-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <m.span
                animate={{ translateY: [0, -5, 0] }}
                transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                className="text-3xl will-change-transform"
                aria-hidden="true"
              >
                {item.icon}
              </m.span>
              <div>
                <h3 className="font-sora font-semibold text-white text-sm">{item.title}</h3>
                <p className="text-[#9CA3AF] text-xs">{item.desc}</p>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Progress</span>
                <span className="text-[10px] font-bold text-[#60a5fa]">{item.progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <m.div
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ duration: 1.2, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                  style={{ transformOrigin: "left", width: `${item.progress}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] will-change-transform"
                />
              </div>
            </div>
          </m.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
