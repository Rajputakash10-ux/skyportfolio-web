"use client";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

const floatingIcons = [
  { icon: "🐍", label: "Python", delay: 0, x: "10%", y: "20%" },
  { icon: "🤖", label: "AI", delay: 1, x: "85%", y: "15%" },
  { icon: "📊", label: "Data", delay: 2, x: "8%", y: "70%" },
  { icon: "🧠", label: "ML", delay: 0.5, x: "88%", y: "65%" },
  { icon: "⚡", label: "NLP", delay: 1.5, x: "50%", y: "85%" },
  { icon: "🔬", label: "Research", delay: 2.5, x: "20%", y: "45%" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3B82F6]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#EC4899]/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Floating tech icons */}
      {floatingIcons.map((item) => (
        <motion.div
          key={item.label}
          className="absolute hidden lg:flex flex-col items-center gap-1 pointer-events-none"
          style={{ left: item.x, top: item.y }}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4 + item.delay, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
        >
          <div className="glass rounded-xl p-3 text-2xl shadow-lg border border-white/10">
            {item.icon}
          </div>
          <span className="text-xs text-[#9CA3AF] font-medium">{item.label}</span>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#3B82F6]/30 text-sm text-[#9CA3AF] mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Open to opportunities
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-sora font-extrabold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-4 leading-tight"
        >
          <span className="gradient-text">Akash Singh</span>
        </motion.h1>

        {/* Typing animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-xl sm:text-2xl lg:text-3xl font-poppins text-[#9CA3AF] mb-6 h-10"
        >
          <TypeAnimation
            sequence={[
              "Aspiring Data Scientist",
              2000,
              "AI / ML Engineer",
              2000,
              "NLP Engineer",
              2000,
              "Python Developer",
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="text-[#3B82F6] font-semibold"
          />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-[#9CA3AF] text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Building intelligent systems that solve real-world problems through Data Science, Machine Learning, and NLP.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="/resume.pdf"
            download
            className="px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg animate-pulse-glow flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Download Resume
          </a>
          <a
            href="https://github.com/akashsingh"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-xl font-semibold glass border border-white/10 hover:border-[#3B82F6]/50 hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/akashsingh"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-xl font-semibold glass border border-white/10 hover:border-[#3B82F6]/50 hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-[#9CA3AF]">Scroll down</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-[#9CA3AF]/40 flex items-start justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
