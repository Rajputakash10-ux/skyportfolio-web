"use client";

import { ArrowUp, Download } from "lucide-react";
import { NAV_LINKS } from "@/constants/data";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
      <div className="container-max px-6 md:px-10 lg:px-16 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div className="space-y-3">
            <span className="text-lg font-bold gradient-text">Akash Singh</span>
            <p className="text-sm leading-relaxed max-w-[220px]" style={{ color: "var(--fg-muted)" }}>
              Building intelligent systems with Python, ML, and full-stack web tech.
            </p>
            <a
              href="/assets/Akash_Singh_Resume.pdf"
              download
              className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg text-white hover:opacity-85 transition-opacity focus-ring"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Download size={12} aria-hidden="true" />
              Download Resume
            </a>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--fg)" }}>Navigation</p>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors focus-ring rounded"
                    style={{ color: "var(--fg-muted)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--fg)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--fg-muted)"; }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--fg)" }}>Connect</p>
            <div className="space-y-2">
              {[
                { label: "rajputakash1656@gmail.com",      href: "mailto:rajputakash1656@gmail.com" },
                { label: "github.com/Rajputakash10-ux",    href: "https://github.com/Rajputakash10-ux" },
                { label: "linkedin.com/in/akash-rajput",   href: "https://www.linkedin.com/in/akash-rajput-9433aa368/" },
              ].map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="block text-sm truncate focus-ring rounded transition-colors duration-200"
                  style={{ color: "var(--fg-muted)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent-2)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--fg-muted)"; }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="text-xs" style={{ color: "var(--fg-subtle)" }}>
            © {new Date().getFullYear()} Akash Singh — Built with Next.js &amp; Tailwind CSS
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 text-xs transition-colors focus-ring rounded"
            style={{ color: "var(--fg-subtle)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--fg)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--fg-subtle)"; }}
            aria-label="Scroll to top"
          >
            <ArrowUp size={12} aria-hidden="true" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
