"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/app/components/ui/SectionHeader";
import { SKILLS } from "@/constants/data";

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
            return (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="card p-6 flex flex-col gap-4 hover:border-[var(--border-hover)] transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
                    aria-hidden
                  >
                    <Icon size={17} className="text-white" />
                  </div>
                  <span className="text-xs text-fg-subtle font-mono">{skill.level}%</span>
                </div>

                {/* Title & category */}
                <div>
                  <h3 className="text-sm font-semibold text-fg">{skill.title}</h3>
                  <p className="text-xs text-fg-subtle mt-0.5">{skill.category}</p>
                </div>

                {/* Proficiency bar */}
                <div className="space-y-1.5">
                  <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.07 + 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                    />
                  </div>
                </div>

                {/* Tools */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {skill.tools.map((tool) => (
                    <span
                      key={tool}
                      className="text-[11px] px-2 py-0.5 rounded border border-[var(--border)] text-fg-subtle hover:text-fg-muted transition-colors"
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
