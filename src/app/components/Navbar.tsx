"use client";

import { useState, useEffect, useRef } from "react";
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
  </svg>
);
const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);
const DownloadIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
import { NAV_LINKS } from "@/constants/data";
import ThemeToggle from "@/app/components/ui/ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const drawerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={`navbar-enter fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "glass border-b" : "bg-transparent border-b border-transparent"
        }`}
        style={scrolled ? { borderBottomColor: "var(--border)" } : undefined}
      >
        <nav className="container-max flex items-center justify-between px-6 md:px-10 lg:px-16 py-4">
          {/* Logo */}
          <a
            href="#"
            className="text-base font-bold tracking-tight focus-ring rounded gradient-text"
            aria-label="Akash Singh — home"
          >
            AS<span style={{ color: "var(--fg-subtle)" }}>/</span>
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
                    className="relative px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 focus-ring"
                    style={{ color: isActive ? "var(--fg)" : "var(--fg-muted)" }}
                  >
                    <span
                      className="absolute inset-0 rounded-lg transition-opacity duration-200"
                      style={{
                        background: "var(--gradient-subtle)",
                        border: "1px solid var(--border-hover)",
                        opacity: isActive ? 1 : 0,
                      }}
                    />
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
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg hover:opacity-85 hover:scale-105 transition-all duration-200 focus-ring"
              style={{
                background: "var(--gradient-brand)",
                color: "#ffffff",
                boxShadow: "0 0 20px -5px var(--glow-1)",
              }}
            >
              <DownloadIcon size={14} />
              Resume
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg transition-colors focus-ring"
            style={{ color: "var(--fg-muted)" }}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-drawer"
          >
            <span className="relative block w-5 h-5">
              <span className="absolute inset-0 transition-all duration-200" style={{ opacity: open ? 0 : 1, transform: open ? "rotate(90deg)" : "rotate(0deg)" }}><MenuIcon /></span>
              <span className="absolute inset-0 transition-all duration-200" style={{ opacity: open ? 1 : 0, transform: open ? "rotate(0deg)" : "rotate(-90deg)" }}><XIcon size={20} /></span>
            </span>
          </button>
        </nav>
      </header>

      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 z-40 backdrop-blur-sm md:hidden transition-opacity duration-200"
        style={{
          background: "rgba(0,0,0,0.6)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        className="fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col md:hidden transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          background: "var(--bg-secondary)",
          borderLeft: "1px solid var(--border)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
        aria-label="Mobile navigation"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span className="font-bold gradient-text text-base">Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg transition-colors focus-ring"
            style={{ color: "var(--fg-muted)" }}
            aria-label="Close menu"
          >
            <XIcon size={18} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-colors focus-ring drawer-link"
              style={{
                color: "var(--fg-muted)",
                animationDelay: `${i * 40}ms`,
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="px-4 pb-8 space-y-3">
          <ThemeToggle />
          <a
            href="/assets/Akash_Singh_Resume.pdf"
            download
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium focus-ring"
            style={{ background: "var(--gradient-brand)", color: "#ffffff" }}
          >
            <DownloadIcon size={15} />
            Download Resume
          </a>
        </div>
      </div>
    </>
  );
}
