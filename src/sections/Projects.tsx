"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper, { SectionTitle } from "@/components/SectionWrapper";
import { projects } from "@/data";

export default function Projects() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <SectionWrapper id="projects">
      <SectionTitle title="Featured Projects" subtitle="AI/ML systems built to solve real-world problems" />
      <div ref={ref} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="glass rounded-2xl overflow-hidden gradient-border group flex flex-col"
          >
            {/* Card header with gradient */}
            <div className={`bg-gradient-to-br ${project.gradient} p-8 flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent)]" />
              <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                {project.icon}
              </span>
            </div>

            {/* Card body */}
            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-sora font-bold text-xl text-white mb-3">{project.title}</h3>
              <p className="text-[#9CA3AF] text-sm leading-relaxed mb-5">{project.description}</p>

              {/* Features */}
              <div className="mb-5 flex-1">
                <p className="text-xs font-semibold text-[#3B82F6] uppercase tracking-wider mb-3">Key Features</p>
                <ul className="space-y-1.5">
                  {project.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 mb-5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 text-[#9CA3AF] border border-white/8"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* GitHub link */}
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/10 text-sm font-medium text-[#9CA3AF] hover:text-white hover:border-[#3B82F6]/50 hover:bg-[#3B82F6]/5 transition-all duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                View on GitHub
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
