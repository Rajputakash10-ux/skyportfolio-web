"use client";
import { m } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper, { SectionTitle } from "@/components/SectionWrapper";
import { experience } from "@/data";

function TimelineItem({ item, index }: { item: typeof experience[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.25 });
  const isLeft = index % 2 === 0;

  const card = (
    <div className="glass rounded-2xl p-6 gradient-border hover:scale-[1.02] transition-transform duration-300 group">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h3 className="font-sora font-bold text-white text-base group-hover:text-[#60a5fa] transition-colors">{item.company}</h3>
          <p className="text-[#3B82F6] text-sm font-semibold mt-0.5">{item.role}</p>
          <p className="text-[#6B7280] text-xs mt-0.5">{item.type}</p>
        </div>
        <span className={`flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r ${item.color} text-white shadow-sm`}>
          {item.period}
        </span>
      </div>
      <p className="text-[#9CA3AF] text-sm leading-relaxed mt-3">{item.description}</p>
    </div>
  );

  return (
    <div ref={ref} className="relative flex items-center justify-center">
      <div className="hidden md:grid md:grid-cols-2 md:gap-10 w-full items-center">
        <m.div
          initial={{ opacity: 0, x: -32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55 }}
          className={isLeft ? "flex justify-end" : ""}
        >
          {isLeft && card}
        </m.div>
        <m.div
          initial={{ opacity: 0, x: 32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          {!isLeft && card}
        </m.div>
      </div>

      <m.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={inView ? { opacity: 1, translateY: 0 } : {}}
        transition={{ duration: 0.45 }}
        className="md:hidden w-full"
      >
        {card}
      </m.div>

      <m.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] border-[3px] border-[#0B0F19] z-10 shadow-lg shadow-blue-500/30"
        aria-hidden="true"
      />
    </div>
  );
}

export default function Experience() {
  return (
    <SectionWrapper id="experience">
      <SectionTitle title="Work Experience" subtitle="My professional journey across industries" />
      <div className="relative">
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-[#3B82F6] via-[#8B5CF6] to-transparent opacity-40" aria-hidden="true" />
        <div className="flex flex-col gap-8">
          {experience.map((item, i) => (
            <TimelineItem key={item.company} item={item} index={i} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
