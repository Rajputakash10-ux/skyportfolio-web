"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const LinearLogo = dynamic(() => import("@/components/LinearLogo"), { ssr: false });

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#050508] grid-bg flex flex-col items-center justify-center px-6 overflow-hidden">

      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Logo */}
      <div className="mb-12">
        <LinearLogo size={290} />
      </div>

      {/* Text content */}
      <div className="text-center max-w-2xl">
        <motion.div {...fade(0.3)} className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 border border-purple-500/30 bg-purple-500/10 text-xs text-purple-300 tracking-widest uppercase rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-glow" />
          Open to opportunities
        </motion.div>

        <motion.h1
          {...fade(0.45)}
          className="text-6xl sm:text-7xl font-bold text-white tracking-tight leading-[1.0] mb-4 glow"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Akash Singh
        </motion.h1>

        <motion.p {...fade(0.55)} className="text-lg text-white/60 font-light tracking-widest uppercase mb-4">
          Data Scientist &nbsp;·&nbsp; AI/ML Engineer &nbsp;·&nbsp; NLP
        </motion.p>

        <motion.p {...fade(0.62)} className="text-sm text-white/35 max-w-md mx-auto mb-10 leading-relaxed">
          Building intelligent systems that learn, predict, and adapt — powered by Python, TensorFlow & Deep Learning.
        </motion.p>

        <motion.div {...fade(0.75)} className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/sky.pdf"
            download
            className="px-7 py-3 text-sm tracking-widest uppercase text-white font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 rounded-sm shadow-lg shadow-purple-900/40"
          >
            Resume
          </a>
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="px-7 py-3 text-sm tracking-widest uppercase text-white/70 border border-white/15 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 rounded-sm"
          >
            Projects
          </button>
          <a
            href="https://github.com/Rajputakash10-ux"
            target="_blank" rel="noopener noreferrer"
            className="px-7 py-3 text-sm tracking-widest uppercase text-white/50 border border-white/10 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all duration-300 rounded-sm"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/akash-rajput-9433aa368/"
            target="_blank" rel="noopener noreferrer"
            className="px-7 py-3 text-sm tracking-widest uppercase text-white/50 border border-white/10 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 rounded-sm"
          >
            LinkedIn
          </a>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-purple-500/60 to-transparent"
        />
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">Scroll</span>
      </motion.div>
    </section>
  );
}
