"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const LinearLogo = dynamic(() => import("@/components/LinearLogo"), { ssr: false });

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-6 overflow-hidden">

      {/* Subtle radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(0,0,0,0.03) 100%)" }}
      />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-14"
      >
        <LinearLogo />
      </motion.div>

      {/* Text content */}
      <div className="text-center max-w-xl">
        <motion.div {...fade(0.3)} className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 border border-black/10 bg-white/60 backdrop-blur-sm text-xs text-black/40 tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Open to opportunities
        </motion.div>

        <motion.h1
          {...fade(0.45)}
          className="text-5xl sm:text-6xl font-light text-black tracking-tight leading-[1.05] mb-5"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Akash Singh
        </motion.h1>

        <motion.p {...fade(0.6)} className="text-sm text-black/40 tracking-widest uppercase mb-10 font-light">
          Data Scientist &nbsp;·&nbsp; AI/ML Engineer &nbsp;·&nbsp; NLP
        </motion.p>

        <motion.div {...fade(0.75)} className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/sky.pdf"
            download
            className="px-6 py-2.5 text-sm tracking-widest uppercase text-white bg-black hover:bg-black/80 transition-colors"
          >
            Resume
          </a>
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-2.5 text-sm tracking-widest uppercase text-black/50 border border-black/15 hover:text-black hover:border-black/30 transition-colors bg-transparent"
          >
            Projects
          </button>
          <a
            href="https://github.com/Rajputakash10-ux"
            target="_blank" rel="noopener noreferrer"
            className="px-6 py-2.5 text-sm tracking-widest uppercase text-black/40 border border-black/10 hover:text-black hover:border-black/25 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/akash-rajput-9433aa368/"
            target="_blank" rel="noopener noreferrer"
            className="px-6 py-2.5 text-sm tracking-widest uppercase text-black/40 border border-black/10 hover:text-black hover:border-black/25 transition-colors"
          >
            LinkedIn
          </a>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-black/20"
        />
        <span className="text-[10px] tracking-[0.25em] uppercase text-black/25">Scroll</span>
      </motion.div>
    </section>
  );
}
