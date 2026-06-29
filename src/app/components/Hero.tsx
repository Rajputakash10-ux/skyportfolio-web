"use client";

import { Download, Mail } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center section-padding overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/3 w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[100px]" />
      </div>

      <div className="container-max w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-sm text-[var(--accent-cyan)] font-medium tracking-widest uppercase mb-4">
              Data Scientist & AI/ML Engineer
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Hi, I&apos;m{" "}
              <span className="gradient-text">Akash Singh</span>
            </h1>

            <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              B.Sc. CS graduate (2026) building intelligent systems with Python,
              ML, and full-stack web tech. I ship real projects — not just
              tutorials.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
              <a
                href="#projects"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-medium hover:opacity-90 hover:scale-105 transition-all duration-200"
              >
                View My Work
              </a>
              <a
                href="/assets/Akash_Singh_Resume.pdf"
                download
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--border-subtle)] text-[var(--foreground-secondary)] hover:border-[var(--border-hover)] hover:text-white transition-all duration-200"
              >
                <Download size={16} />
                Download Resume
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-5 justify-center lg:justify-start">
              {/* GitHub */}
              <a
                href="https://github.com/akashrajput"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--foreground-secondary)] hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/akashrajput"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--foreground-secondary)] hover:text-[var(--accent-cyan)] transition-colors"
                aria-label="LinkedIn"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              {/* Email */}
              <a
                href="mailto:akash@example.com"
                className="text-[var(--foreground-secondary)] hover:text-[var(--accent-cyan)] transition-colors"
                aria-label="Email"
              >
                <Mail size={22} />
              </a>
            </div>
          </div>

          {/* AI Orb Visual */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="relative w-64 h-64 lg:w-80 lg:h-80">
              <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-spin" style={{ animationDuration: "12s" }} />
              <div className="absolute inset-4 rounded-full border border-cyan-500/20 animate-spin" style={{ animationDuration: "8s", animationDirection: "reverse" }} />
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-indigo-600/30 to-cyan-500/30 blur-sm" />
              <div className="absolute inset-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-400/20 animate-pulse" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl lg:text-4xl font-bold gradient-text">AI</span>
                <span className="text-xs text-[var(--foreground-secondary)] tracking-widest mt-1">ML · NLP · DATA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
