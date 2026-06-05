"use client";
import { useState, useEffect } from "react";

const links = ["About", "Skills", "Projects", "Experience", "Contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const ids = links.map((l) => l.toLowerCase());
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-black/95 backdrop-blur-sm border-b border-white/8" : "bg-transparent"}`}>
      <div className="max-w-5xl mx-auto px-6 sm:px-8 flex items-center justify-between h-14">

        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-light text-sm tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors"
        >
          Akash Singh
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              className={`text-xs tracking-widest uppercase transition-colors ${active === l.toLowerCase() ? "text-white" : "text-white/40 hover:text-white/80"}`}
            >
              {l}
            </button>
          ))}
          <a
            href="/sky.pdf"
            download
            className="text-xs tracking-widest uppercase text-black bg-white px-4 py-1.5 hover:bg-white/90 transition-colors"
          >
            Resume
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-white transition-all duration-200 ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block w-5 h-px bg-white transition-all duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-white transition-all duration-200 ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-white/8 px-6 py-5 flex flex-col gap-4">
          {links.map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              className="text-left text-xs tracking-widest uppercase text-white/50 hover:text-white transition-colors"
            >
              {l}
            </button>
          ))}
          <a href="/sky.pdf" download className="text-xs tracking-widest uppercase text-black bg-white px-4 py-2 text-center mt-1">
            Download Resume
          </a>
        </div>
      )}
    </nav>
  );
}
