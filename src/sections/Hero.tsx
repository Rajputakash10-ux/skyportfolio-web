"use client";
import { m } from "framer-motion";
import dynamic from "next/dynamic";

const TypeAnimation = dynamic(
  () => import("react-type-animation").then((mod) => mod.TypeAnimation),
  { ssr: false, loading: () => <span className="text-[#60a5fa]">Aspiring Data Scientist</span> }
);

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, translateY: 20 },
  animate: { opacity: 1, translateY: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" } as const,
});

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* Grid background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Gradient orbs — wrapper animates, blurred inner div is static */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="orb-blue absolute top-1/4 left-1/4">
          <div className="w-[500px] h-[500px] bg-[#3B82F6] rounded-full blur-[140px] opacity-[0.18]" />
        </div>
        <div className="orb-purple absolute bottom-1/4 right-1/4">
          <div className="w-[500px] h-[500px] bg-[#8B5CF6] rounded-full blur-[140px] opacity-[0.15]" />
        </div>
        <div className="orb-pink absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-72 h-72 bg-[#EC4899] rounded-full blur-[120px] opacity-[0.10]" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-5 max-w-4xl mx-auto w-full">

        {/* Status badge */}
        <m.div {...fadeUp(0.1)} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass border border-[#3B82F6]/25 text-sm text-[#9CA3AF] mb-8 shimmer">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          Available for new opportunities
        </m.div>

        {/* Name — plain h1, no opacity:0, renders immediately for LCP */}
        <h1 className="font-sora font-extrabold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] mb-5">
          <span className="gradient-text animate-gradient">Akash Singh</span>
        </h1>

        {/* Typing role */}
        <m.div {...fadeUp(0.3)} className="text-xl sm:text-2xl lg:text-3xl font-sora font-semibold text-[#9CA3AF] mb-5 h-10 flex items-center justify-center gap-2">
          <span className="text-white/60" aria-hidden="true">{">"}</span>
          <TypeAnimation
            sequence={[
              "Aspiring Data Scientist", 2200,
              "AI / ML Engineer",        2200,
              "NLP Engineer",            2200,
              "Python Developer",        2200,
            ]}
            wrapper="span"
            speed={55}
            repeat={Infinity}
            className="text-[#60a5fa]"
          />
          <m.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-[#8B5CF6] font-light"
            aria-hidden="true"
          >|</m.span>
        </m.div>

        {/* Description */}
        <m.p {...fadeUp(0.45)} className="text-[#9CA3AF] text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Building intelligent systems that solve real-world problems through{" "}
          <span className="text-white font-medium">Data Science</span>,{" "}
          <span className="text-white font-medium">Machine Learning</span>, and{" "}
          <span className="text-white font-medium">NLP</span>.
        </m.p>

        {/* CTA Buttons */}
        <m.div {...fadeUp(0.55)} className="flex flex-wrap items-center justify-center gap-3 mb-16">
          <a
            href="/resume.pdf"
            download
            aria-label="Download resume PDF"
            className="group px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED] hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-500/20 animate-pulse-glow flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Download Resume
          </a>
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            aria-label="Scroll to projects section"
            className="px-7 py-3.5 rounded-xl font-semibold glass border border-white/10 hover:border-[#3B82F6]/50 hover:bg-[#3B82F6]/5 hover:scale-105 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
          >
            View Projects
          </button>
          <a
            href="https://github.com/Rajputakash10-ux"
            target="_blank" rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="px-5 py-3.5 rounded-xl font-semibold glass border border-white/10 hover:border-white/25 hover:scale-105 transition-all duration-200 flex items-center gap-2 text-[#9CA3AF] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/akash-rajput-9433aa368/"
            target="_blank" rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="px-5 py-3.5 rounded-xl font-semibold glass border border-white/10 hover:border-[#3B82F6]/50 hover:scale-105 transition-all duration-200 flex items-center gap-2 text-[#9CA3AF] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </a>
        </m.div>

        {/* Stats row — plain HTML, no animation, renders immediately */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {[
            { value: "5+", label: "Years Experience" },
            { value: "3+", label: "AI/ML Projects" },
            { value: "5+", label: "Companies" },
            { value: "10+", label: "Technologies" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-sora font-extrabold text-3xl gradient-text">{s.value}</div>
              <div className="text-[#9CA3AF] text-xs mt-1 tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-[#9CA3AF] tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-9 rounded-full border border-[#9CA3AF]/30 flex items-start justify-center pt-1.5">
          <m.div
            animate={{ translateY: [0, 14, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1.5 rounded-full bg-[#3B82F6] will-change-transform"
          />
        </div>
      </m.div>
    </section>
  );
}
