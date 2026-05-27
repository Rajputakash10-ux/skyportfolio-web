"use client";
import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";

const links = ["About", "Skills", "Projects", "Experience", "Contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section detection
  useEffect(() => {
    const ids = links.map((l) => l.toLowerCase());
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-nav-in ${
        scrolled ? "glass border-b border-white/5 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="font-sora font-bold text-lg gradient-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] rounded"
        >
          AS
        </button>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = active === link.toLowerCase();
            return (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] ${
                  isActive ? "text-white" : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                {isActive && (
                  <m.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/[0.08] rounded-lg"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link}</span>
              </button>
            );
          })}
          <a
            href="/resume.pdf"
            download
            className="ml-3 px-4 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
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
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
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
            <div className="flex flex-col px-5 py-3 gap-1">
              {links.map((link) => (
                <button
                  key={link}
                  onClick={() => scrollTo(link)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    active === link.toLowerCase() ? "text-white bg-white/[0.06]" : "text-[#9CA3AF] hover:text-white"
                  }`}
                >
                  {link}
                </button>
              ))}
              <a
                href="/resume.pdf"
                download
                className="mt-1 px-3 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white text-center"
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
