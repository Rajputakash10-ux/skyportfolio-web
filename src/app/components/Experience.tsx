"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, MapPin, Calendar } from "lucide-react";
import SectionHeader from "@/app/components/ui/SectionHeader";
import { EXPERIENCES } from "@/constants/data";

export default function Experience() {
  return (
    <section id="experience" className="section-padding">
      <div className="container-max">
        <SectionHeader
          label="My journey"
          title="Experience & Education"
          align="center"
        />

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-5 top-6 bottom-6 w-px"
              style={{ background: "linear-gradient(to bottom, rgba(99,102,241,0.5), rgba(6,182,212,0.3), transparent)" }}
              aria-hidden
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
                  {/* Node */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-glow-sm z-10 flex-shrink-0">
                      {exp.type === "education" ? (
                        <GraduationCap size={17} className="text-white" aria-hidden />
                      ) : (
                        <Briefcase size={17} className="text-white" aria-hidden />
                      )}
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 card p-6 space-y-4 mb-2 hover:border-[var(--border-hover)] transition-all duration-300">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-fg leading-tight">{exp.company}</h3>
                        <p className="text-sm text-brand-cyan mt-0.5">{exp.role}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-xs text-fg-muted flex-shrink-0">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} aria-hidden />
                          {exp.period}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={11} aria-hidden />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <ul className="space-y-2" aria-label={`Highlights for ${exp.role}`}>
                      {exp.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5 text-sm text-fg-muted">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-brand-indigo flex-shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
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
