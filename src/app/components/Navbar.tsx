"use client";

import { useState, useEffect } from "react";
import { Menu, X, Download } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0f]/90 backdrop-blur-md border-b border-[var(--border-subtle)]"
          : "bg-transparent"
      }`}
    >
      <nav className="container-max flex items-center justify-between px-6 md:px-12 lg:px-20 py-4">
        {/* Logo */}
        <a href="#" className="text-lg font-bold gradient-text">
          Akash Singh
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Resume Button (desktop) */}
        <a
          href="/assets/Akash_Singh_Resume.pdf"
          download
          className="hidden md:flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:opacity-90 hover:scale-105 transition-all duration-200"
        >
          <Download size={15} />
          Resume
        </a>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-[var(--foreground-secondary)] hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-md border-b border-[var(--border-subtle)] px-6 pb-6">
          <ul className="flex flex-col gap-4 pt-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-base text-[var(--foreground-secondary)] hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/assets/Akash_Singh_Resume.pdf"
            download
            className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-sm"
          >
            <Download size={15} />
            Download Resume
          </a>
        </div>
      )}
    </header>
  );
}
