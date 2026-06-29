"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Download, Mail, ArrowRight } from "lucide-react";

// Lazy-load the heavy SolarSystem — not part of LCP, deferred safely
const SolarSystem = dynamic(() => import("@/app/components/SolarSystem"), {
  ssr: false,
  loading: () => (
    <div
      className="flex-shrink-0"
      style={{ width: 360, height: 360 }}
      aria-hidden="true"
    />
  ),
});

/* ── Static SVG icons — no client overhead ── */
function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    href: "https://github.com/Rajputakash10-ux",
    label: "GitHub",
    icon: <GitHubIcon />,
    gradient: "linear-gradient(135deg, rgba(212,165,255,0.15), rgba(212,165,255,0.05))",
    hoverGradient: "linear-gradient(135deg, rgba(212,165,255,0.3), rgba(212,165,255,0.1))",
    borderColor: "rgba(212,165,255,0.25)",
    textColor: "var(--brand-purple)",
  },
  {
    href: "https://www.linkedin.com/in/akash-rajput-9433aa368/",
    label: "LinkedIn",
    icon: <LinkedInIcon />,
    gradient: "linear-gradient(135deg, rgba(0,229,204,0.15), rgba(0,229,204,0.05))",
    hoverGradient: "linear-gradient(135deg, rgba(0,229,204,0.3), rgba(0,229,204,0.1))",
    borderColor: "rgba(0,229,204,0.25)",
    textColor: "var(--brand-teal)",
  },
  {
    href: "mailto:rajputakash1656@gmail.com",
    label: "Email",
    icon: <Mail size={18} aria-hidden="true" />,
    gradient: "linear-gradient(135deg, rgba(255,183,0,0.15), rgba(255,183,0,0.05))",
    hoverGradient: "linear-gradient(135deg, rgba(255,183,0,0.3), rgba(255,183,0,0.1))",
    borderColor: "rgba(255,183,0,0.25)",
    textColor: "var(--brand-gold)",
  },
  {
    href: "/assets/Akash_Singh_Resume.pdf",
    label: "Resume",
    download: true,
    icon: <Download size={18} aria-hidden="true" />,
    gradient: "linear-gradient(135deg, rgba(212,165,255,0.1), rgba(0,229,204,0.1))",
    hoverGradient: "linear-gradient(135deg, rgba(212,165,255,0.25), rgba(0,229,204,0.2))",
    borderColor: "rgba(212,165,255,0.2)",
    textColor: "var(--fg-muted)",
  },
];

export default function Hero() {
  // Animations start after first paint — content is visible immediately
  const [ready, setReady] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // rAF ensures we're past first paint before starting animations
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const noMotion = !ready || reducedMotion.current;

  return (
    <section className="relative min-h-screen flex items-center section-padding overflow-hidden">

      {/* Grid background — pure CSS, no JS */}
      <div
        className="hero-grid absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* Ambient glows — CSS only, no JS animation cost */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-[15%] w-96 h-96 rounded-full blur-[120px] animate-pulse-slow"
          style={{ background: "radial-gradient(circle, rgba(212,165,255,0.12), transparent 70%)" }} />
        <div className="absolute top-1/2 right-[10%] w-80 h-80 rounded-full blur-[100px] animate-pulse-slow"
          style={{ background: "radial-gradient(circle, rgba(0,229,204,0.1), transparent 70%)", animationDelay: "1.5s" }} />
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 rounded-full blur-[80px]"
          style={{ background: "radial-gradient(circle, rgba(255,183,0,0.07), transparent 70%)" }} />
      </div>

      <div className="container-max w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* ── Text content — visible immediately, no opacity:0 on LCP ── */}
          <div className="flex-1 text-center lg:text-left">

            {/* Label chip */}
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full hero-fade-in"
              style={{
                background: "rgba(0,229,204,0.08)",
                border: "1px solid rgba(0,229,204,0.25)",
                animationDelay: "0ms",
                opacity: noMotion ? 1 : undefined,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--brand-teal)" }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--brand-teal)" }}>
                Data Scientist &amp; AI/ML Engineer
              </span>
            </div>

            {/* ── LCP ELEMENT — fully visible on server render, no animation delay ── */}
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6 hero-fade-in"
              style={{ animationDelay: "80ms", opacity: noMotion ? 1 : undefined }}
            >
              Hi, I&apos;m{" "}
              <span className="gradient-text">Akash</span>
              <br />
              <span style={{ color: "var(--fg)", opacity: 0.85 }}>Singh</span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 hero-fade-in"
              style={{ color: "var(--fg-muted)", animationDelay: "160ms", opacity: noMotion ? 1 : undefined }}
            >
              B.Sc. CS graduate building{" "}
              <span style={{ color: "var(--fg)", fontWeight: 600 }}>intelligent systems</span>{" "}
              with Python, ML &amp; full-stack web tech. I ship real projects —
              not just tutorials.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10 hero-fade-in"
              style={{ animationDelay: "240ms", opacity: noMotion ? 1 : undefined }}
            >
              <a
                href="#projects"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity duration-200 focus-ring"
                style={{
                  background: "linear-gradient(135deg, var(--brand-purple), var(--brand-teal))",
                  boxShadow: "0 0 30px -8px rgba(212,165,255,0.5)",
                }}
              >
                View My Work
                <ArrowRight size={15} aria-hidden="true" />
              </a>
              <a
                href="/assets/Akash_Singh_Resume.pdf"
                download
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-opacity duration-200 focus-ring"
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--border-gold)",
                  color: "var(--fg-muted)",
                }}
              >
                <Download size={14} aria-hidden="true" />
                Download Resume
              </a>
            </div>

            {/* Social links */}
            <div
              className="flex flex-wrap items-center gap-2 justify-center lg:justify-start hero-fade-in"
              style={{ animationDelay: "320ms", opacity: noMotion ? 1 : undefined }}
            >
              {SOCIAL_LINKS.map(({ href, label, icon, gradient, hoverGradient, borderColor, textColor, download: dl }) => (
                <a
                  key={label}
                  href={href}
                  download={dl || undefined}
                  target={!dl && href.startsWith("http") ? "_blank" : undefined}
                  rel={!dl && href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors duration-200 focus-ring"
                  style={{ background: gradient, border: `1px solid ${borderColor}`, color: textColor }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = hoverGradient; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = gradient; }}
                >
                  {icon}
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* ── Solar System — lazy loaded, deferred, never blocks LCP ── */}
          <div
            className="flex-shrink-0 flex items-center justify-center hero-fade-in"
            style={{ animationDelay: "400ms", opacity: noMotion ? 1 : undefined }}
          >
            <SolarSystem />
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hero-fade-in"
          aria-hidden="true"
          style={{ animationDelay: "1200ms", opacity: noMotion ? 1 : undefined }}
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: "var(--fg-subtle)" }}>Scroll</span>
          <div className="w-px h-8 scroll-line" style={{ background: "linear-gradient(to bottom, var(--brand-purple), transparent)" }} />
        </div>
      </div>
    </section>
  );
}
