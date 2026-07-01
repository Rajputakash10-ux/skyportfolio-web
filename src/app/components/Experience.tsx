"use client";

import { m as motion } from "framer-motion";
import { Briefcase, GraduationCap, MapPin, Calendar } from "lucide-react";
import SectionHeader from "@/app/components/ui/SectionHeader";
import { EXPERIENCES } from "@/constants/data";

export default function Experience() {
  return (
    <section id="experience" className="section-padding" style={{ background: "var(--bg)" }}>
      <div className="container-max">
        <SectionHeader label="My journey" title="Experience & Education" align="center" />

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute left-5 top-6 bottom-6 w-px"
              style={{ background: "linear-gradient(to bottom, var(--accent-1), var(--accent-2), transparent)" }}
              aria-hidden="true"
            />

            <div className="space-y-6">
              {EXPERIENCES.map((exp, i) => (
                <motion.div
                  key={exp.company}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-6"
                >
                  {/* Node icon */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center z-10 flex-shrink-0"
                      style={{
                        background: "var(--gradient-brand)",
                        boxShadow: "0 0 20px -5px var(--glow-1)",
                      }}
                    >
                      {exp.type === "education"
                        ? <GraduationCap size={17} className="text-white" aria-hidden="true" />
                        : <Briefcase size={17} className="text-white" aria-hidden="true" />}
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className="flex-1 card p-6 space-y-4 mb-2"
                    style={{ borderColor: i === 0 ? "var(--border-hover)" : "var(--border-gold)" }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold leading-tight" style={{ color: "var(--fg)" }}>{exp.company}</h3>
                        <p className="text-sm mt-0.5" style={{ color: "var(--accent-2)" }}>{exp.role}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-xs flex-shrink-0" style={{ color: "var(--fg-muted)" }}>
                        <span className="flex items-center gap-1"><Calendar size={11} aria-hidden="true" />{exp.period}</span>
                        <span className="flex items-center gap-1"><MapPin size={11} aria-hidden="true" />{exp.location}</span>
                      </div>
                    </div>

                    <ul className="space-y-2" aria-label={`Highlights for ${exp.role}`}>
                      {exp.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--fg-muted)" }}>
                          <span
                            className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                            style={{ background: "var(--accent-1)" }}
                          />
                          {h}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2.5 py-0.5 rounded-full"
                          style={{
                            background: "var(--gradient-subtle)",
                            border: "1px solid var(--border)",
                            color: "var(--accent-1)",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
