"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/app/components/ui/SectionHeader";
import { SKILLS } from "@/constants/data";

// Map each skill's gradient to the new palette
const SKILL_GRADIENTS: Record<string, string> = {
  "from-indigo-500 to-violet-500": "linear-gradient(135deg, #D4A5FF, #A855F7)",
  "from-cyan-500 to-blue-500":     "linear-gradient(135deg, #00E5CC, #0EA5E9)",
  "from-cyan-400 to-teal-500":     "linear-gradient(135deg, #00E5CC, #00B8A3)",
  "from-violet-500 to-indigo-500": "linear-gradient(135deg, #D4A5FF, #00E5CC)",
  "from-orange-400 to-amber-500":  "linear-gradient(135deg, #FFB700, #F59E0B)",
  "from-indigo-500 to-cyan-500":   "linear-gradient(135deg, #D4A5FF, #00E5CC)",
};

export default function Skills() {
  return (
    <section id="skills" className="section-padding bg-bg-secondary">
      <div className="container-max">
        <SectionHeader
          label="What I bring"
          title="Skills & Expertise"
          subtitle="Built through consistent daily practice and shipping real-world projects."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILLS.map((skill, i) => {
            const Icon = skill.icon;
            const gradient = SKILL_GRADIENTS[skill.color] ?? "linear-gradient(135deg, #D4A5FF, #00E5CC)";
            const isGold = i === 4; // Data Engineering gets gold accent
            const borderColor = isGold
              ? "rgba(255,183,0,0.2)"
              : i % 2 === 0
              ? "rgba(212,165,255,0.15)"
              : "rgba(0,229,204,0.15)";

            return (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="card p-6 flex flex-col gap-4 transition-all duration-300 group"
                style={{ borderColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = isGold
                    ? "rgba(255,183,0,0.45)"
                    : i % 2 === 0 ? "rgba(212,165,255,0.4)" : "rgba(0,229,204,0.4)";
                }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = borderColor; }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300"
                    style={{ background: gradient }}
                    aria-hidden
                  >
                    <Icon size={17} className="text-white" />
                  </div>
                  <span className="text-xs text-fg-subtle font-mono">{skill.level}%</span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-fg">{skill.title}</h3>
                  <p className="text-xs text-fg-subtle mt-0.5">{skill.category}</p>
                </div>

                {/* Proficiency bar — scaleX avoids layout reflow, GPU composited */}
                <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.07 + 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{
                      background: gradient,
                      width: `${skill.level}%`,
                      transformOrigin: "left center",
                      willChange: "transform",
                    }}
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {skill.tools.map((tool) => (
                    <span
                      key={tool}
                      className="text-[11px] px-2 py-0.5 rounded text-fg-subtle hover:text-fg-muted transition-colors cursor-default"
                      style={{ border: "1px solid rgba(212,165,255,0.12)" }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
