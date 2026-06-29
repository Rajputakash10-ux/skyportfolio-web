"use client";

import { motion } from "framer-motion";
import { ExternalLink, ArrowUpRight } from "lucide-react";

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}
import SectionHeader from "@/app/components/ui/SectionHeader";
import { PROJECTS } from "@/constants/data";

const accentMap: Record<string, string> = {
  indigo: "from-indigo-500/20 to-indigo-600/5 border-indigo-500/20 hover:border-indigo-400/40",
  violet: "from-violet-500/20 to-violet-600/5 border-violet-500/20 hover:border-violet-400/40",
  cyan: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 hover:border-cyan-400/40",
  orange: "from-orange-500/20 to-orange-600/5 border-orange-500/20 hover:border-orange-400/40",
};

const tagColorMap: Record<string, string> = {
  indigo: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  violet: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  orange: "bg-orange-500/10 text-orange-300 border-orange-500/20",
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

        {/* Featured — bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {featured.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} featured />
          ))}
        </div>

        {/* Secondary — 2-col grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {rest.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i + 2} />
          ))}
        </div>

        {/* GitHub CTA */}
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-[var(--border)] text-fg-muted hover:text-fg hover:border-[var(--border-hover)] text-sm transition-all duration-200 focus-ring"
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

function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  featured?: boolean;
}) {
  const accent = accentMap[project.accentColor] ?? accentMap.indigo;
  const tagColor = tagColorMap[project.accentColor] ?? tagColorMap.indigo;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative rounded-2xl border bg-bg-secondary overflow-hidden transition-all duration-300 ${accent} ${
        featured ? "p-7" : "p-6"
      }`}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div className="relative z-10 flex flex-col h-full gap-4">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${tagColor}`}>
            {project.category}
          </span>
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} on GitHub`}
            className="p-1.5 rounded-lg text-fg-subtle hover:text-fg hover:bg-white/10 transition-all duration-200 focus-ring"
          >
            <ExternalLink size={15} />
          </a>
        </div>

        {/* Title */}
        <div>
          <h3 className={`font-bold text-fg tracking-tight mb-2 ${featured ? "text-xl" : "text-lg"}`}>
            {project.title}
          </h3>
          <p className="text-sm text-fg-muted leading-relaxed">{project.description}</p>
        </div>

        {/* Metrics */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {project.metrics.map((m) => (
            <span key={m} className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-fg-subtle border border-white/5">
              {m}
            </span>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className={`text-xs px-2.5 py-0.5 rounded-full border ${tagColor}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
