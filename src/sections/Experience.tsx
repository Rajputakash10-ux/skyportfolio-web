"use client";
import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper, { SectionTitle } from "@/components/SectionWrapper";
import { experience } from "@/data";

export default function Experience() {
  const [open, setOpen] = useState<number | null>(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <SectionWrapper id="experience">
      <SectionTitle title="Work Experience" subtitle="My professional journey across industries" />
      <div ref={ref} className="max-w-3xl mx-auto space-y-2">
        {experience.map((item, i) => (
          <m.div
            key={item.company}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="glass rounded-2xl gradient-border overflow-hidden"
          >
            {/* Accordion header */}
            <button
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-inset"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color} flex-shrink-0`} aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-sora font-bold text-white text-sm truncate">{item.company}</p>
                  <p className="text-[#3B82F6] text-xs font-medium truncate">{item.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r ${item.color} text-white`}>
                  {item.period}
                </span>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  className={`text-[#9CA3AF] transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </button>

            {/* Accordion body */}
            <AnimatePresence initial={false}>
              {open === i && (
                <m.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2 mt-3 mb-2">
                      <span className="text-[#6B7280] text-xs">{item.type}</span>
                      <span className={`sm:hidden px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r ${item.color} text-white`}>
                        {item.period}
                      </span>
                    </div>
                    <p className="text-[#9CA3AF] text-sm leading-relaxed">{item.description}</p>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </m.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
