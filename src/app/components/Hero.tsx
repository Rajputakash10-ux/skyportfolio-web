"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Download, Mail, ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease, delay } },
});

function GitHubIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function LinkedInIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { href: "https://github.com/Rajputakash10-ux", label: "GitHub", Icon: GitHubIcon },
  { href: "https://www.linkedin.com/in/akash-rajput-9433aa368/", label: "LinkedIn", Icon: LinkedInIcon },
  { href: "mailto:rajputakash1656@gmail.com", label: "Email", Icon: ({ size }: { size: number }) => <Mail size={size} /> },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center section-padding overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/3 left-[15%] w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-1/2 right-[10%] w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 rounded-full bg-violet-600/8 blur-[80px]" />
      </div>

      <div className="container-max w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* ── Text content ── */}
          <div className="flex-1 text-center lg:text-left">
            {/* Label chip */}
            <motion.div
              variants={fadeUp(0)}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full glass border border-brand-cyan/20"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
              <span className="text-xs font-medium text-brand-cyan/90 tracking-widest uppercase">
                Data Scientist & AI/ML Engineer
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp(0.1)}
              initial="hidden"
              animate="show"
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
            >
              Hi, I&apos;m{" "}
              <span className="gradient-text">Akash</span>
              <br />
              <span className="text-fg/80">Singh</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeUp(0.2)}
              initial="hidden"
              animate="show"
              className="text-lg text-fg-muted leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8"
            >
              B.Sc. CS graduate building{" "}
              <span className="text-fg font-medium">intelligent systems</span>{" "}
              with Python, ML &amp; full-stack web tech. I ship real projects —
              not just tutorials.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp(0.3)}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10"
            >
              <a
                href="#projects"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-glow-indigo focus-ring"
              >
                View My Work
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="/assets/Akash_Singh_Resume.pdf"
                download
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-fg-muted hover:text-fg hover:border-white/20 text-sm font-medium transition-all duration-200 focus-ring"
              >
                <Download size={14} aria-hidden />
                Download Resume
              </a>
            </motion.div>

            {/* Socials */}
            <motion.div
              variants={fadeUp(0.4)}
              initial="hidden"
              animate="show"
              className="flex items-center gap-1 justify-center lg:justify-start"
            >
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="p-2.5 rounded-xl text-fg-muted hover:text-fg hover:bg-white/5 transition-all duration-200 focus-ring"
                >
                  <Icon size={19} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* ── Visual Orb ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0 flex items-center justify-center"
            aria-hidden
          >
            <div className="relative w-72 h-72 lg:w-[360px] lg:h-[360px]">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border border-indigo-500/15 animate-spin-slow" />
              {/* Orbital dots */}
              <OrbitalRing size="inset-[12px]" duration="20s" color="border-cyan-500/20" dotColor="bg-cyan-400" reverse />
              <OrbitalRing size="inset-[40px]" duration="14s" color="border-violet-500/20" dotColor="bg-violet-400" />

              {/* Core glow */}
              <div className="absolute inset-[64px] rounded-full bg-gradient-to-br from-indigo-600/30 via-violet-600/20 to-cyan-500/30 blur-xl animate-pulse-slow" />

              {/* Core surface */}
              <div className="absolute inset-[72px] rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-400/20 backdrop-blur-sm border border-white/10 flex flex-col items-center justify-center gap-1">
                <span className="text-2xl font-bold gradient-text">AI</span>
                <span className="text-[10px] text-fg-muted tracking-[0.25em] uppercase">ML · NLP · DATA</span>
              </div>

              {/* Floating metric chips */}
              <FloatingChip top="8%" left="-10%" value="95%" label="Model Accuracy" delay={0.8} />
              <FloatingChip bottom="10%" right="-8%" value="3+" label="ML Projects" delay={1.1} />
              <FloatingChip top="55%" left="-18%" value="8.5" label="CGPA" delay={1.4} />
            </div>
          </motion.div>

        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          aria-hidden
        >
          <span className="text-xs text-fg-subtle tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-brand-indigo/40 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

function OrbitalRing({
  size, duration, color, dotColor, reverse,
}: {
  size: string; duration: string; color: string; dotColor: string; reverse?: boolean;
}) {
  return (
    <div
      className={`absolute ${size} rounded-full border ${color}`}
      style={{
        animation: `${reverse ? "spin-reverse" : "spin"} ${duration} linear infinite`,
      }}
    >
      <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${dotColor} shadow-lg`} />
    </div>
  );
}

function FloatingChip({
  top, bottom, left, right, value, label, delay,
}: {
  top?: string; bottom?: string; left?: string; right?: string;
  value: string; label: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="absolute px-2.5 py-1.5 rounded-xl glass border border-white/10 text-center"
      style={{ top, bottom, left, right }}
    >
      <p className="text-xs font-bold gradient-text-subtle">{value}</p>
      <p className="text-[9px] text-fg-subtle leading-none mt-0.5">{label}</p>
    </motion.div>
  );
}
