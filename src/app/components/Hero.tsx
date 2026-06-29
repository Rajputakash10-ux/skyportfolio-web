"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Download, Mail, ArrowRight } from "lucide-react";
import SolarSystem from "@/app/components/SolarSystem";

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease, delay } },
});

/* ── Social icon SVGs ── */
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

/* ── Enhanced social links with gradient pill style ── */
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
    icon: <Mail size={18} />,
    gradient: "linear-gradient(135deg, rgba(255,183,0,0.15), rgba(255,183,0,0.05))",
    hoverGradient: "linear-gradient(135deg, rgba(255,183,0,0.3), rgba(255,183,0,0.1))",
    borderColor: "rgba(255,183,0,0.25)",
    textColor: "var(--brand-gold)",
  },
  {
    href: "/assets/Akash_Singh_Resume.pdf",
    label: "Resume",
    download: true,
    icon: <Download size={18} />,
    gradient: "linear-gradient(135deg, rgba(212,165,255,0.1), rgba(0,229,204,0.1))",
    hoverGradient: "linear-gradient(135deg, rgba(212,165,255,0.25), rgba(0,229,204,0.2))",
    borderColor: "rgba(212,165,255,0.2)",
    textColor: "var(--fg-muted)",
  },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center section-padding overflow-hidden">

      {/* Grid background */}
      <div
        className="hero-grid absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* Ambient glows */}
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

          {/* ── Text content ── */}
          <div className="flex-1 text-center lg:text-left">

            {/* Label chip */}
            <motion.div
              variants={fadeUp(0)} initial="hidden" animate="show"
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
              style={{ background: "rgba(0,229,204,0.08)", border: "1px solid rgba(0,229,204,0.25)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--brand-teal)" }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--brand-teal)" }}>
                Data Scientist & AI/ML Engineer
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp(0.1)} initial="hidden" animate="show"
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
            >
              Hi, I&apos;m{" "}
              <span className="gradient-text">Akash</span>
              <br />
              <span style={{ color: "var(--fg)", opacity: 0.85 }}>Singh</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeUp(0.2)} initial="hidden" animate="show"
              className="text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8"
              style={{ color: "var(--fg-muted)" }}
            >
              B.Sc. CS graduate building{" "}
              <span style={{ color: "var(--fg)", fontWeight: 600 }}>intelligent systems</span>{" "}
              with Python, ML &amp; full-stack web tech. I ship real projects —
              not just tutorials.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp(0.3)} initial="hidden" animate="show"
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10"
            >
              <a
                href="#projects"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 hover:scale-105 transition-all duration-200 focus-ring"
                style={{
                  background: "linear-gradient(135deg, var(--brand-purple), var(--brand-teal))",
                  boxShadow: "0 0 30px -8px rgba(212,165,255,0.5)",
                }}
              >
                View My Work
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="/assets/Akash_Singh_Resume.pdf"
                download
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus-ring hover:scale-105"
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--border-gold)",
                  color: "var(--fg-muted)",
                }}
              >
                <Download size={14} aria-hidden="true" />
                Download Resume
              </a>
            </motion.div>

            {/* ── Enhanced Social Icons ── */}
            <motion.div
              variants={fadeUp(0.4)} initial="hidden" animate="show"
              className="flex flex-wrap items-center gap-2 justify-center lg:justify-start"
            >
              {SOCIAL_LINKS.map(({ href, label, icon, gradient, hoverGradient, borderColor, textColor, download: dl }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  download={dl || undefined}
                  target={!dl && href.startsWith("http") ? "_blank" : undefined}
                  rel={!dl && href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.07, duration: 0.4, ease }}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors duration-200 focus-ring"
                  style={{
                    background: gradient,
                    border: `1px solid ${borderColor}`,
                    color: textColor,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = hoverGradient; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = gradient; }}
                >
                  {icon}
                  <span>{label}</span>
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* ── Solar System ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0 flex items-center justify-center"
          >
            <SolarSystem />
          </motion.div>

        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          aria-hidden
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: "var(--fg-subtle)" }}>Scroll</span>
          <motion.div
            animate={{ scaleY: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8"
            style={{ background: "linear-gradient(to bottom, var(--brand-purple), transparent)" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
