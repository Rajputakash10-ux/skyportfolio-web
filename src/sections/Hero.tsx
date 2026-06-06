"use client";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const LinearLogo = dynamic(() => import("@/components/LinearLogo"), { ssr: false });

const TITLES = ["Data Scientist", "AI/ML Engineer", "NLP Engineer", "Python Developer"];

function useTypewriter(words: string[], speed = 80, pause = 1800) {
  const [text, setText] = useState("");
  const [wIdx, setWIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[wIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(word.slice(0, text.length + 1));
        if (text.length + 1 === word.length) setTimeout(() => setDeleting(true), pause);
      } else {
        setText(word.slice(0, text.length - 1));
        if (text.length - 1 === 0) { setDeleting(false); setWIdx((wIdx + 1) % words.length); }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, wIdx, words, speed, pause]);
  return text;
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

export default function Hero() {
  const typed = useTypewriter(TITLES);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen bg-[#050508] flex items-center justify-center px-6 overflow-hidden">

      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* Radial gradient center */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(139,92,246,0.07) 0%, transparent 70%)" }} />

      {/* Animated scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent pointer-events-none"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      <motion.div style={{ y, opacity }} className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* LEFT — text */}
          <div className="flex-1 text-center lg:text-left">

            {/* Badge */}
            <motion.div {...fade(0.2)} className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-white/10 bg-white/[0.03] text-[11px] text-white/40 tracking-[0.2em] uppercase rounded-full backdrop-blur-sm">
              <span className="relative flex w-1.5 h-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative rounded-full w-1.5 h-1.5 bg-green-400" />
              </span>
              Available for hire
            </motion.div>

            {/* Name */}
            <motion.h1 {...fade(0.35)}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.0] mb-3"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              <span className="text-white">Akash</span>
              <br />
              <span style={{ background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #f0abfc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Singh
              </span>
            </motion.h1>

            {/* Typewriter */}
            <motion.div {...fade(0.5)} className="h-7 mb-6 flex items-center gap-2 justify-center lg:justify-start">
              <span className="text-base text-white/50 font-light tracking-wide">{typed}</span>
              <motion.span
                className="inline-block w-0.5 h-5 bg-purple-400"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
            </motion.div>

            {/* Description */}
            <motion.p {...fade(0.6)} className="text-sm text-white/30 max-w-sm leading-relaxed mb-10 mx-auto lg:mx-0">
              Building intelligent systems that learn, predict, and adapt — powered by Python, TensorFlow & Deep Learning.
            </motion.p>

            {/* CTA buttons */}
            <motion.div {...fade(0.7)} className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <a href="/sky.pdf" download
                className="group relative px-6 py-2.5 text-xs tracking-widest uppercase font-semibold text-white overflow-hidden rounded-sm"
                style={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)" }}
              >
                <motion.span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(135deg,#6d28d9,#1d4ed8)" }}
                />
                <span className="relative">Resume ↓</span>
              </a>
              <button
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                className="px-6 py-2.5 text-xs tracking-widest uppercase text-white/50 border border-white/10 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all rounded-sm"
              >
                View Projects
              </button>
              <a href="https://github.com/Rajputakash10-ux" target="_blank" rel="noopener noreferrer"
                className="px-6 py-2.5 text-xs tracking-widest uppercase text-white/40 border border-white/8 hover:text-white hover:border-purple-500/40 hover:bg-purple-500/8 transition-all rounded-sm"
              >
                GitHub ↗
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div {...fade(0.85)} className="flex gap-8 mt-12 justify-center lg:justify-start">
              {[["5+", "Years Exp"], ["3+", "AI Projects"], ["10+", "Technologies"]].map(([v, l]) => (
                <div key={l} className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Sora',sans-serif" }}>{v}</div>
                  <div className="text-[10px] tracking-widest uppercase text-white/25 mt-0.5">{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0"
          >
            <LinearLogo size={320} />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center pt-1.5"
        >
          <motion.div
            className="w-0.5 h-2 rounded-full bg-white/40"
            animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
