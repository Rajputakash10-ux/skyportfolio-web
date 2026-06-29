"use client";

import { motion } from "framer-motion";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import SectionHeader from "@/app/components/ui/SectionHeader";
import { PROJECTS } from "@/constants/data";

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

// Per-project accent: border, tag bg, tag text, gradient overlay
const ACCENT = {
  indigo: {
    border: "rgba(212,165,255,0.25)",
    hoverBorder: "rgba(212,165,255,0.5)",
    tagBg: "rgba(212,165,255,0.1)",
    tagText: "#D4A5FF",
    gradient: "linear-gradient(135deg, rgba(212,165,255,0.12), rgba(0,229,204,0.08))",
  },
  violet: {
    border: "rgba(255,183,0,0.2)",
    hoverBorder: "rgba(255,183,0,0.45)",
    tagBg: "rgba(255,183,0,0.1)",
    tagText: "#FFB700",
    gradient: "linear-gradient(135deg, rgba(255,183,0,0.1), rgba(212,165,255,0.08))",
  },
  cyan: {
    border: "rgba(0,229,204,0.2)",
    hoverBorder: "rgba(0,229,204,0.45)",
    tagBg: "rgba(0,229,204,0.1)",
    tagText: "#00E5CC",
    gradient: "linear-gradient(135deg, rgba(0,229,204,0.1), rgba(212,165,255,0.06))",
  },
  orange: {
    border: "rgba(255,183,0,0.2)",
    hoverBorder: "rgba(255,183,0,0.4)",
    tagBg: "rgba(255,183,0,0.08)",
    tagText: "#FFB700",
    gradient: "linear-gradient(135deg, rgba(255,183,0,0.08), rgba(0,229,204,0.06))",
  },
};

export default function Projects() {
  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <section id="projects" className="section-padding">
      <div className="container-max">
        <SectionHeader
          label="What I've built"
          title="Projects"
          subtitle="Real-world systems built with production-grade thinking, not tutorial rewrites."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {featured.map((project, i) => <ProjectCard key={project.id} project={project} index={i} featured />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {rest.map((project, i) => <ProjectCard key={project.id} project={project} index={i + 2} />)}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 text-center"
        >
          <a
            href="https://github.com/Rajputakash10-ux"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-fg-muted hover:text-fg text-sm transition-all duration-200 focus-ring"
            style={{ borderColor: "rgba(212,165,255,0.2)" }}
          >
            <GitHubIcon />
            View all projects on GitHub
            <ArrowUpRight size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index, featured = false }: {
  project: (typeof PROJECTS)[number]; index: number; featured?: boolean;
}) {
  const accent = ACCENT[project.accentColor as keyof typeof ACCENT] ?? ACCENT.indigo;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 bg-bg-secondary ${featured ? "p-7" : "p-6"}`}
      style={{ border: `1px solid ${accent.border}` }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent.hoverBorder)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = accent.border)}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: accent.gradient }} />

      <div className="relative z-10 flex flex-col h-full gap-4">
        <div className="flex items-start justify-between">
          <span className="text-xs px-2.5 py-1 rounded-full border font-medium"
            style={{ background: accent.tagBg, color: accent.tagText, borderColor: accent.border }}>
            {project.category}
          </span>
          <a
            href={project.href} target="_blank" rel="noopener noreferrer"
            aria-label={`View ${project.title} on GitHub`}
            className="p-1.5 rounded-lg text-fg-subtle hover:text-fg hover:bg-white/10 transition-all duration-200 focus-ring"
          >
            <ExternalLink size={15} />
          </a>
        </div>

        <div>
          <h3 className={`font-bold text-fg tracking-tight mb-2 ${featured ? "text-xl" : "text-lg"}`}>
            {project.title}
          </h3>
          <p className="text-sm text-fg-muted leading-relaxed">{project.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {project.metrics.map((m) => (
            <span key={m} className="text-[11px] px-2 py-0.5 rounded border text-fg-subtle"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.07)" }}>
              {m}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full border"
              style={{ background: accent.tagBg, color: accent.tagText, borderColor: accent.border }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
