"use client";

import { useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, GitBranch, Zap, Star } from "lucide-react";
import SectionHeader from "@/app/components/ui/SectionHeader";
import { PROJECTS } from "@/constants/data";

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

const ACCENT = {
  indigo: {
    border: "rgba(212,165,255,0.25)",
    hoverBorder: "rgba(212,165,255,0.6)",
    tagBg: "rgba(212,165,255,0.1)",
    tagText: "#D4A5FF",
    gradient: "linear-gradient(135deg, rgba(212,165,255,0.14), rgba(0,229,204,0.08))",
    spotlight: "rgba(212,165,255,0.12)",
    glow: "rgba(212,165,255,0.35)",
    topBar: "linear-gradient(90deg, #D4A5FF, #00E5CC)",
    numColor: "rgba(212,165,255,0.12)",
    numText: "rgba(212,165,255,0.5)",
  },
  violet: {
    border: "rgba(255,183,0,0.2)",
    hoverBorder: "rgba(255,183,0,0.55)",
    tagBg: "rgba(255,183,0,0.1)",
    tagText: "#FFB700",
    gradient: "linear-gradient(135deg, rgba(255,183,0,0.12), rgba(212,165,255,0.08))",
    spotlight: "rgba(255,183,0,0.1)",
    glow: "rgba(255,183,0,0.3)",
    topBar: "linear-gradient(90deg, #FFB700, #D4A5FF)",
    numColor: "rgba(255,183,0,0.1)",
    numText: "rgba(255,183,0,0.45)",
  },
  cyan: {
    border: "rgba(0,229,204,0.2)",
    hoverBorder: "rgba(0,229,204,0.55)",
    tagBg: "rgba(0,229,204,0.1)",
    tagText: "#00E5CC",
    gradient: "linear-gradient(135deg, rgba(0,229,204,0.12), rgba(212,165,255,0.06))",
    spotlight: "rgba(0,229,204,0.1)",
    glow: "rgba(0,229,204,0.3)",
    topBar: "linear-gradient(90deg, #00E5CC, #D4A5FF)",
    numColor: "rgba(0,229,204,0.1)",
    numText: "rgba(0,229,204,0.45)",
  },
  orange: {
    border: "rgba(255,183,0,0.2)",
    hoverBorder: "rgba(255,183,0,0.5)",
    tagBg: "rgba(255,183,0,0.08)",
    tagText: "#FFB700",
    gradient: "linear-gradient(135deg, rgba(255,183,0,0.1), rgba(0,229,204,0.06))",
    spotlight: "rgba(255,183,0,0.08)",
    glow: "rgba(255,183,0,0.25)",
    topBar: "linear-gradient(90deg, #FFB700, #00E5CC)",
    numColor: "rgba(255,183,0,0.08)",
    numText: "rgba(255,183,0,0.4)",
  },
};

const FILTERS = ["All", "Featured", "NLP / AI", "MLOps", "Data Science", "Full-Stack + ML"] as const;
type Filter = (typeof FILTERS)[number];

export default function Projects() {
  const [active, setActive] = useState<Filter>("All");

  const filtered = PROJECTS.filter((p) => {
    if (active === "All") return true;
    if (active === "Featured") return p.featured;
    return p.category === active;
  });

  const featured = PROJECTS.filter((p) => p.featured);

  return (
    <section id="projects" className="section-padding">
      <div className="container-max">
        <SectionHeader
          label="What I've built"
          title="Projects"
          subtitle="Real-world systems built with production-grade thinking, not tutorial rewrites."
        />

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-6 mb-8 px-1"
        >
          {[
            { icon: GitBranch, label: `${PROJECTS.length} Projects`, color: "#D4A5FF" },
            { icon: Star,      label: `${featured.length} Featured`,  color: "#FFB700" },
            { icon: Zap,       label: "Production-grade",             color: "#00E5CC" },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-fg-muted">
              <Icon size={13} style={{ color }} aria-hidden="true" />
              <span>{label}</span>
            </div>
          ))}

          {/* Divider */}
          <div className="hidden sm:block flex-1 h-px" style={{ background: "rgba(212,165,255,0.1)" }} />

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const isActive = active === f;
              return (
                <button
                  key={f}
                  onClick={() => setActive(f)}
                  className="text-[11px] px-3 py-1.5 rounded-full font-medium transition-all duration-200 focus-ring"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, rgba(212,165,255,0.25), rgba(0,229,204,0.15))"
                      : "rgba(255,255,255,0.04)",
                    border: isActive
                      ? "1px solid rgba(212,165,255,0.4)"
                      : "1px solid rgba(255,255,255,0.08)",
                    color: isActive ? "#D4A5FF" : "var(--fg-muted)",
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Project grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Featured row — 2 col */}
            {(active === "All" || active === "Featured") && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                {PROJECTS.filter((p) => p.featured && (active === "All" || active === "Featured")).map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} featured />
                ))}
              </div>
            )}

            {/* Rest / filtered grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 ${active === "All" ? "" : "lg:grid-cols-2"}`}>
              {(active === "All"
                ? PROJECTS.filter((p) => !p.featured)
                : filtered.filter((p) => !(active === "Featured") || p.featured)
              ).map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i + 2} featured={active !== "All" && project.featured} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20 text-fg-subtle text-sm">
                No projects in this category yet.
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── GitHub CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/Rajputakash10-ux"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus-ring hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(212,165,255,0.2)",
              color: "var(--fg-muted)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(212,165,255,0.5)";
              e.currentTarget.style.color = "var(--fg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(212,165,255,0.2)";
              e.currentTarget.style.color = "var(--fg-muted)";
            }}
          >
            <GitHubIcon size={15} />
            View all projects on GitHub
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  featured?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const accent = ACCENT[project.accentColor as keyof typeof ACCENT] ?? ACCENT.indigo;
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 bg-bg-secondary ${featured ? "p-7" : "p-6"}`}
      style={{
        border: `1px solid ${hovered ? accent.hoverBorder : accent.border}`,
        boxShadow: hovered ? `0 0 40px -12px ${accent.glow}` : "none",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animated top border glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500"
        style={{
          background: accent.topBar,
          opacity: hovered ? 1 : 0.3,
        }}
      />

      {/* Corner spotlight on hover */}
      <div
        className="absolute -top-20 -right-20 w-48 h-48 rounded-full pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${accent.spotlight}, transparent 70%)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: accent.gradient,
          opacity: hovered ? 1 : 0.6,
        }}
      />

      {/* Large background number */}
      <div
        className="absolute bottom-3 right-4 text-7xl font-black pointer-events-none select-none leading-none transition-opacity duration-300"
        style={{
          color: accent.numColor,
          opacity: hovered ? 0.8 : 0.4,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {num}
      </div>

      <div className="relative z-10 flex flex-col h-full gap-4">
        {/* Top row — category + featured pill + link */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs px-2.5 py-1 rounded-full border font-medium"
              style={{ background: accent.tagBg, color: accent.tagText, borderColor: accent.border }}
            >
              {project.category}
            </span>
            {project.featured && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"
                style={{ background: "rgba(255,183,0,0.12)", color: "#FFB700", border: "1px solid rgba(255,183,0,0.25)" }}
              >
                <Star size={9} aria-hidden="true" />
                Featured
              </span>
            )}
          </div>
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} on GitHub`}
            className="flex-shrink-0 p-1.5 rounded-lg text-fg-subtle hover:text-fg transition-colors duration-200 focus-ring"
            style={{ background: hovered ? "rgba(255,255,255,0.08)" : "transparent" }}
          >
            <GitHubIcon size={15} />
          </a>
        </div>

        {/* Title + description */}
        <div>
          <h3 className={`font-bold text-fg tracking-tight mb-2 ${featured ? "text-xl" : "text-lg"}`}>
            {project.title}
          </h3>
          <p className="text-sm text-fg-muted leading-relaxed">{project.description}</p>
        </div>

        {/* Metrics */}
        <div className="flex flex-wrap gap-2 mt-auto pt-1">
          {project.metrics.map((m) => (
            <span
              key={m}
              className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg text-fg-subtle"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span
                className="w-1 h-1 rounded-full flex-shrink-0"
                style={{ background: accent.tagText }}
              />
              {m}
            </span>
          ))}
        </div>

        {/* Tags + GitHub button row */}
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-0.5 rounded-full border"
                style={{ background: accent.tagBg, color: accent.tagText, borderColor: accent.border }}
              >
                {tag}
              </span>
            ))}
          </div>

          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all duration-200 focus-ring hover:scale-105"
            style={{
              background: hovered
                ? `linear-gradient(135deg, ${accent.tagText}22, ${accent.tagText}11)`
                : "rgba(255,255,255,0.05)",
              border: `1px solid ${hovered ? accent.hoverBorder : "rgba(255,255,255,0.1)"}`,
              color: hovered ? accent.tagText : "var(--fg-subtle)",
            }}
          >
            <GitHubIcon size={11} />
            View Code
          </a>
        </div>
      </div>
    </motion.article>
  );
}
