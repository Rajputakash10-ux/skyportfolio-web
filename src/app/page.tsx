"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import Hero from "@/sections/Hero";
import About from "@/sections/About";
import Skills from "@/sections/Skills";
import Projects from "@/sections/Projects";
import Experience from "@/sections/Experience";
import Education from "@/sections/Education";
import Learning from "@/sections/Learning";
import Contact from "@/sections/Contact";

// Dynamically import particle background to avoid SSR issues
const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), { ssr: false });

function Loader() {
  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] bg-[#0B0F19] flex flex-col items-center justify-center gap-6"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 rounded-full border-4 border-transparent border-t-[#3B82F6] border-r-[#8B5CF6]"
      />
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="font-sora font-semibold text-lg gradient-text"
      >
        Akash Singh
      </motion.p>
    </motion.div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>

      {!loading && (
        <>
          <ScrollProgress />
          <ParticleBackground />
          <Navbar />
          <main className="relative z-10">
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Education />
            <Learning />
            <Contact />
          </main>
          <Footer />
          <BackToTop />
        </>
      )}
    </>
  );
}
