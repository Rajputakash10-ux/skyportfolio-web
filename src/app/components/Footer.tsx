"use client";

import { ArrowUp, Download } from "lucide-react";
import { NAV_LINKS } from "@/constants/data";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-bg-secondary">
      <div className="container-max px-6 md:px-10 lg:px-16 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <span className="text-lg font-bold gradient-text">Akash Singh</span>
            <p className="text-sm text-fg-muted leading-relaxed max-w-[220px]">
              Building intelligent systems with Python, ML, and full-stack web tech.
            </p>
            <a
              href="/assets/Akash_Singh_Resume.pdf"
              download
              className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:opacity-85 transition-opacity focus-ring"
            >
              <Download size={12} aria-hidden />
              Download Resume
            </a>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-fg uppercase tracking-widest">Navigation</p>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-fg-muted hover:text-fg transition-colors focus-ring rounded"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-fg uppercase tracking-widest">Connect</p>
            <div className="space-y-2">
              {[
                { label: "rajputakash1656@gmail.com", href: "mailto:rajputakash1656@gmail.com" },
                { label: "github.com/Rajputakash10-ux", href: "https://github.com/Rajputakash10-ux" },
                { label: "linkedin.com/in/akash-rajput", href: "https://www.linkedin.com/in/akash-rajput-9433aa368/" },
              ].map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="block text-sm text-fg-muted hover:text-brand-cyan transition-colors truncate focus-ring rounded"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-fg-subtle">
            © {new Date().getFullYear()} Akash Singh — Built with Next.js & Tailwind CSS
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 text-xs text-fg-subtle hover:text-fg transition-colors focus-ring rounded"
            aria-label="Scroll to top"
          >
            <ArrowUp size={12} aria-hidden />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
