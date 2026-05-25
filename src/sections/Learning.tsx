"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper, { SectionTitle } from "@/components/SectionWrapper";
import { learning } from "@/data";

export default function Learning() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <SectionWrapper id="learning">
      <SectionTitle
        title="Currently Learning"
        subtitle="Continuously expanding my AI/ML expertise"
      />
      <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {learning.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass rounded-2xl p-5 text-center gradient-border group hover:scale-105 transition-transform duration-300 cursor-default"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl mb-3"
            >
              {item.icon}
            </motion.div>
            <h4 className="font-sora font-semibold text-white text-sm mb-2">{item.title}</h4>
            <p className="text-[#9CA3AF] text-xs leading-relaxed hidden sm:block">{item.desc}</p>

            {/* Progress indicator */}
            <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${60 + i * 5}%` } : {}}
                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
