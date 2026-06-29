"use client";

import { useState, useRef, useEffect } from "react";
import { Mail, Send, MapPin } from "lucide-react";

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Replace with your form submission logic (e.g. Formspree, EmailJS)
    setTimeout(() => setStatus("sent"), 1500);
  };

  return (
    <section id="contact" className="section-padding">
      <div className="container-max">
        {/* Section Title */}
        <div className="text-center mb-14">
          <p className="text-sm text-[var(--accent-cyan)] tracking-widest uppercase mb-2">Get in touch</p>
          <h2 className="text-3xl font-bold">Contact Me</h2>
          <p className="text-[var(--foreground-secondary)] mt-3 max-w-md mx-auto text-sm">
            Open to full-time Data Science roles, freelance ML projects, and collaborations.
          </p>
        </div>

        <div
          ref={ref}
          className={`flex flex-col lg:flex-row gap-10 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Left — Info */}
          <div className="lg:w-72 space-y-6 flex-shrink-0">
            <div className="card-base p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-widest mb-1">Email</p>
                  <a
                    href="mailto:akash@example.com"
                    className="text-sm text-[var(--foreground)] hover:text-[var(--accent-cyan)] transition-colors"
                  >
                    akash@example.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-widest mb-1">Location</p>
                  <p className="text-sm text-[var(--foreground)]">Mumbai, India</p>
                </div>
              </div>

              {/* GitHub */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-widest mb-1">GitHub</p>
                  <a
                    href="https://github.com/Rajputakash10-ux"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--foreground)] hover:text-[var(--accent-cyan)] transition-colors"
                  >
                    Rajputakash10-ux
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="card-base p-6 space-y-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="text-xs text-[var(--foreground-secondary)] uppercase tracking-widest">Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[var(--background)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)] focus:outline-none focus:border-[var(--border-hover)] transition-colors"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-xs text-[var(--foreground-secondary)] uppercase tracking-widest">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[var(--background)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)] focus:outline-none focus:border-[var(--border-hover)] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[var(--foreground-secondary)] uppercase tracking-widest">Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell me about your project or opportunity..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)] focus:outline-none focus:border-[var(--border-hover)] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status !== "idle"}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-sm font-medium hover:opacity-90 hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:scale-100"
              >
                <Send size={15} />
                {status === "sending" ? "Sending..." : status === "sent" ? "Message Sent ✓" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
