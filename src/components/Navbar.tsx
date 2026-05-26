"use client";
import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";

const links = ["About", "Skills", "Projects", "Experience", "Education", "Contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    // CSS animation instead of motion.nav — saves JS for above-fold element
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-nav-in ${
        scrolled ? "glass border-b border-white/5 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="font-sora font-bold text-xl gradient-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] rounded"
        >
          AS
        </button>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className="text-sm text-[#9CA3AF] hover:text-[#3B82F6] transition-colors duration-200 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] rounded px-1"
            >
              {link}
            </button>
          ))}
          <a
            href="/resume.pdf"
            download
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Resume
          </a>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] rounded"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/5"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {links.map((link) => (
                <button
                  key={link}
                  onClick={() => scrollTo(link)}
                  className="text-left text-[#9CA3AF] hover:text-white transition-colors py-1"
                >
                  {link}
                </button>
              ))}
              <a
                href="/resume.pdf"
                download
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white text-center"
              >
                Download Resume
              </a>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
