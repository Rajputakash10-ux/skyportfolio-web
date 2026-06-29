"use client";

import { m as motion } from "framer-motion";
import SectionHeader from "@/app/components/ui/SectionHeader";
import { STATS, TECH_STACK } from "@/constants/data";

const HIGHLIGHTS = [
  "Daily ML practice — consistent, disciplined self-learner",
  "Ships fast with a code-first, production-minded mentality",
  "Technical depth with strong client communication skills",
  "Every GitHub project is real-world grade, not tutorial clones",
];

export default function About() {
  return (
    <section id="about" className="section-padding bg-bg-secondary">
      <div className="container-max">
        <SectionHeader label="Get to know me" title="About Me" align="center" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — Prose */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            <p className="text-base text-fg-muted leading-relaxed">
              I&apos;m a <span className="text-fg font-medium">B.Sc. Computer Science</span> graduate (2026)
              passionate about building intelligent systems that solve real-world problems.
              My core focus is Python, Machine Learning, NLP, and full-stack web development.
            </p>
            <p className="text-base text-fg-muted leading-relaxed">
              From deploying ML pipelines to building NLP chatbots and a live stock analysis
              platform, I combine technical depth with a ship-fast mindset. I&apos;m currently
              seeking a full-time <span className="text-fg font-medium">Data Science role</span> where
              I can go deeper into MLOps, model deployment, and real-time data systems.
            </p>

            <ul className="space-y-2.5 pt-2" aria-label="Key highlights">
              {HIGHLIGHTS.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="flex items-start gap-3 text-sm text-fg-muted"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, var(--brand-purple), var(--brand-teal))" }} />
                  {item}
                </motion.li>
              ))}
            </ul>

            <div className="pt-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-85 hover:scale-105 transition-all duration-200 focus-ring"
                style={{ background: "linear-gradient(135deg, var(--brand-purple), var(--brand-teal))" }}
              >
                View My Projects →
              </a>
            </div>
          </motion.div>

          {/* Right — Stats + Stack */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="space-y-4"
          >
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="card p-5 flex flex-col gap-1 transition-all duration-300"
                  style={{ borderColor: i % 2 === 0 ? "rgba(212,165,255,0.2)" : "rgba(255,183,0,0.2)" }}
                >
                  <span className="text-3xl font-bold leading-none gradient-text">{stat.value}</span>
                  <span className="text-xs text-fg-muted leading-snug">{stat.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Tech stack */}
            <div className="card p-5 space-y-3">
              <p className="section-label">Core Stack</p>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="text-xs px-3 py-1.5 rounded-full text-fg-muted hover:text-fg transition-colors duration-200 cursor-default"
                    style={{ border: "1px solid rgba(212,165,255,0.15)" }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Availability badge */}
            <div className="card p-4 flex items-center gap-3" style={{ borderColor: "rgba(0,229,204,0.2)" }}>
              <div className="relative flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--brand-teal)" }} />
                <div className="absolute inset-0 rounded-full animate-ping opacity-60" style={{ background: "var(--brand-teal)" }} />
              </div>
              <div>
                <p className="text-sm font-medium text-fg">Available for opportunities</p>
                <p className="text-xs text-fg-muted">Open to full-time Data Science / ML roles</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
