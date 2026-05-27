"use client";
import { m } from "framer-motion";
import dynamic from "next/dynamic";

const TypeAnimation = dynamic(
  () => import("react-type-animation").then((mod) => mod.TypeAnimation),
  { ssr: false, loading: () => <span className="text-[#60a5fa]">Aspiring Data Scientist</span> }
);

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, translateY: 14 },
  animate: { opacity: 1, translateY: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" } as const,
});

export default function HeroAnimated() {
  return (
    <>
      {/* Status badge */}
      <m.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-[#3B82F6]/25 text-xs text-[#9CA3AF] mb-5 shimmer">
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
        </span>
        Available for new opportunities
      </m.div>

      {/* Typing role */}
      <m.div {...fadeUp(0.12)} className="text-lg sm:text-xl lg:text-2xl font-sora font-semibold text-[#9CA3AF] mb-4 h-8 flex items-center justify-center gap-2">
        <span className="text-white/60" aria-hidden="true">{">"}</span>
        <TypeAnimation
          sequence={[
            "Aspiring Data Scientist", 2000,
            "AI / ML Engineer",        2000,
            "NLP Engineer",            2000,
            "Python Developer",        2000,
          ]}
          wrapper="span"
          speed={60}
          repeat={Infinity}
          className="text-[#60a5fa]"
        />
        <m.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="text-[#8B5CF6]"
          aria-hidden="true"
        >|</m.span>
      </m.div>

      {/* One-line description */}
      <m.p {...fadeUp(0.2)} className="text-[#9CA3AF] text-sm sm:text-base max-w-xl mx-auto mb-7 leading-relaxed">
        Building intelligent systems through <span className="text-white font-medium">Data Science</span>, <span className="text-white font-medium">ML</span> & <span className="text-white font-medium">NLP</span>.
      </m.p>

      {/* CTA Buttons — primary + secondary only */}
      <m.div {...fadeUp(0.28)} className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <a
          href="#contact"
          onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
          className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED] hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-500/20 animate-pulse-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          Hire Me →
        </a>
        <a
          href="/resume.pdf"
          download
          aria-label="Download resume PDF"
          className="px-6 py-3 rounded-xl font-semibold glass border border-white/10 hover:border-[#3B82F6]/50 hover:scale-105 transition-all duration-200 flex items-center gap-2 text-[#9CA3AF] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Resume
        </a>
        <a
          href="https://github.com/Rajputakash10-ux"
          target="_blank" rel="noopener noreferrer"
          aria-label="GitHub profile"
          className="px-4 py-3 rounded-xl font-semibold glass border border-white/10 hover:border-white/25 hover:scale-105 transition-all duration-200 flex items-center gap-2 text-[#9CA3AF] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/akash-rajput-9433aa368/"
          target="_blank" rel="noopener noreferrer"
          aria-label="LinkedIn profile"
          className="px-4 py-3 rounded-xl font-semibold glass border border-white/10 hover:border-[#3B82F6]/50 hover:scale-105 transition-all duration-200 flex items-center gap-2 text-[#9CA3AF] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          LinkedIn
        </a>
      </m.div>
    </>
  );
}
