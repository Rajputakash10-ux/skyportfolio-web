"use client";

import { Mail, Download, ArrowUp } from "lucide-react";

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[#07070c]">
      <div className="container-max section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Left — Brand */}
          <div className="space-y-4">
            <span className="text-xl font-bold gradient-text">Akash Singh</span>
            <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed max-w-xs">
              Building intelligent systems with Python, ML, and full-stack web tech.
            </p>
            <a
              href="/assets/Akash_Singh_Resume.pdf"
              download
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:opacity-90 transition-opacity"
            >
              <Download size={14} />
              Download Resume
            </a>
          </div>

          {/* Center — Quick Links */}
          <div className="space-y-4">
            <p className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-widest">Quick Links</p>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--foreground-secondary)] hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Contact & Social */}
          <div className="space-y-4">
            <p className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-widest">Connect</p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:akash@example.com"
                className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)] hover:text-[var(--accent-cyan)] transition-colors"
              >
                <Mail size={15} />
                akash@example.com
              </a>
              {/* GitHub */}
              <a
                href="https://github.com/akashrajput"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)] hover:text-white transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                github.com/akashrajput
              </a>
              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/akashrajput"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)] hover:text-[var(--accent-cyan)] transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                linkedin.com/in/akashrajput
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--border-subtle)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--foreground-secondary)]">
            © {new Date().getFullYear()} Akash Singh. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-[var(--foreground-secondary)] hover:text-white transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp size={13} />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
