"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Menu } from "lucide-react";
import { NAV_LINKS } from "@/constants/data";
import ThemeToggle from "@/app/components/ui/ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }); },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "glass border-b border-[var(--border)]" : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="container-max flex items-center justify-between px-6 md:px-10 lg:px-16 py-4">
          {/* Logo */}
          <a href="#" className="text-base font-bold tracking-tight focus-ring rounded gradient-text" aria-label="Akash Singh — home">
            AS<span className="text-fg-subtle">/</span>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1" role="menubar">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.href.replace("#", "");
              return (
                <li key={link.href} role="none">
                  <a
                    href={link.href}
                    role="menuitem"
                    className={`relative px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 focus-ring ${
                      isActive ? "text-fg" : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: "rgba(212,165,255,0.08)", border: "1px solid rgba(212,165,255,0.2)" }}
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/assets/Akash_Singh_Resume.pdf"
              download
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white hover:opacity-85 hover:scale-105 transition-all duration-200 focus-ring"
              style={{ background: "linear-gradient(135deg, var(--brand-purple), var(--brand-teal))", boxShadow: "0 0 20px -5px rgba(212,165,255,0.4)" }}
            >
              <Download size={14} aria-hidden />
              Resume
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-white/5 transition-colors focus-ring"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col md:hidden"
              style={{ background: "#12121E", borderLeft: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
                <span className="font-bold gradient-text text-base">Menu</span>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-fg-muted hover:text-fg hover:bg-white/5 transition-colors focus-ring" aria-label="Close menu">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-fg-muted hover:text-fg hover:bg-white/5 transition-colors text-sm focus-ring"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
              <div className="px-4 pb-8">
                <a
                  href="/assets/Akash_Singh_Resume.pdf"
                  download
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-white text-sm font-medium focus-ring"
                  style={{ background: "linear-gradient(135deg, #D4A5FF, #00E5CC)" }}
                >
                  <Download size={15} aria-hidden />
                  Download Resume
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
