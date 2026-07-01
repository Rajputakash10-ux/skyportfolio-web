"use client";

import { m as motion } from "framer-motion";
import SectionHeader from "@/app/components/ui/SectionHeader";
import { SKILLS } from "@/constants/data";

export default function Skills() {
  return (
    <section id="skills" className="section-padding" style={{ background: "var(--bg-secondary)" }}>
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
                className="card p-6 flex flex-col gap-4 group"
                style={{ borderColor: "var(--border)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.boxShadow = "0 0 30px -10px var(--glow-1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "var(--card-shadow)"; }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300"
                    style={{ background: "var(--gradient-brand)" }}
                    aria-hidden
                  >
                    <Icon size={17} className="text-white" />
                  </div>
                  <span className="text-xs font-mono" style={{ color: "var(--fg-subtle)" }}>{skill.level}%</span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>{skill.title}</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--fg-subtle)" }}>{skill.category}</p>
                </div>

                {/* Proficiency bar */}
                <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.07 + 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{
                      background: "var(--gradient-brand)",
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
                      className="text-[11px] px-2 py-0.5 rounded cursor-default transition-colors duration-200"
                      style={{ border: "1px solid var(--border)", color: "var(--fg-subtle)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--fg-muted)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "var(--fg-subtle)"; }}
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
