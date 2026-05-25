"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper, { SectionTitle } from "@/components/SectionWrapper";
import { experience } from "@/data";

function TimelineItem({ item, index }: { item: typeof experience[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative flex items-center justify-center">
      {/* Desktop: alternating layout */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-8 w-full items-center">
        {/* Left side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={isLeft ? "flex justify-end" : ""}
        >
          {isLeft && (
            <div className="glass rounded-2xl p-6 max-w-sm gradient-border hover:scale-[1.02] transition-transform duration-300">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${item.color} text-white mb-3`}>
                {item.period}
              </div>
              <h3 className="font-sora font-bold text-white text-lg mb-1">{item.company}</h3>
              <p className="text-[#3B82F6] text-sm font-medium mb-3">{item.role}</p>
              <p className="text-[#9CA3AF] text-sm leading-relaxed">{item.description}</p>
            </div>
          )}
        </motion.div>

        {/* Right side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {!isLeft && (
            <div className="glass rounded-2xl p-6 max-w-sm gradient-border hover:scale-[1.02] transition-transform duration-300">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${item.color} text-white mb-3`}>
                {item.period}
              </div>
              <h3 className="font-sora font-bold text-white text-lg mb-1">{item.company}</h3>
              <p className="text-[#3B82F6] text-sm font-medium mb-3">{item.role}</p>
              <p className="text-[#9CA3AF] text-sm leading-relaxed">{item.description}</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Mobile: single column */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="md:hidden glass rounded-2xl p-6 w-full gradient-border"
      >
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${item.color} text-white mb-3`}>
          {item.period}
        </div>
        <h3 className="font-sora font-bold text-white text-lg mb-1">{item.company}</h3>
        <p className="text-[#3B82F6] text-sm font-medium mb-3">{item.role}</p>
        <p className="text-[#9CA3AF] text-sm leading-relaxed">{item.description}</p>
      </motion.div>

      {/* Center dot (desktop) */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] border-2 border-[#0B0F19] z-10 shadow-lg" />
    </div>
  );
}

export default function Experience() {
  return (
    <SectionWrapper id="experience">
      <SectionTitle title="Work Experience" subtitle="My professional journey across industries" />
      <div className="relative">
        {/* Vertical line (desktop) */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#3B82F6] via-[#8B5CF6] to-transparent" />

        <div className="flex flex-col gap-10">
          {experience.map((item, i) => (
            <TimelineItem key={item.company} item={item} index={i} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
