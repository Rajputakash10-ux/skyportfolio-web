"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
import SectionHeader from "@/app/components/ui/SectionHeader";

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "akash@example.com", href: "mailto:akash@example.com" },
  { icon: MapPin, label: "Location", value: "Mumbai, India", href: undefined },
  { icon: GitHubIcon, label: "GitHub", value: "Rajputakash10-ux", href: "https://github.com/Rajputakash10-ux" },
  { icon: LinkedInIcon, label: "LinkedIn", value: "akashrajput", href: "https://linkedin.com/in/akashrajput" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => { setStatus("sent"); setForm({ name: "", email: "", message: "" }); }, 1500);
  };

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section id="contact" className="section-padding">
      <div className="container-max">
        <SectionHeader
          label="Get in touch"
          title="Contact Me"
          subtitle="Open to full-time Data Science roles, freelance ML projects, and collaborations."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 space-y-3"
          >
            {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="card p-4 flex items-center gap-4 hover:border-[var(--border-hover)] transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-white" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-fg-subtle uppercase tracking-wider mb-0.5">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-fg hover:text-brand-cyan transition-colors truncate block focus-ring rounded"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm text-fg truncate">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            {status === "sent" ? (
              <div className="card p-8 flex flex-col items-center justify-center gap-4 min-h-[320px] text-center">
                <CheckCircle size={48} className="text-emerald-400" />
                <div>
                  <p className="text-lg font-semibold text-fg mb-1">Message sent!</p>
                  <p className="text-sm text-fg-muted">I&apos;ll get back to you within 24 hours.</p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-xs text-fg-muted hover:text-fg underline underline-offset-2 transition-colors focus-ring rounded"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card p-6 space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Name" type="text" placeholder="Your name" value={form.name} onChange={update("name")} required />
                  <FormField label="Email" type="email" placeholder="your@email.com" value={form.email} onChange={update("email")} required />
                </div>
                <div className="space-y-1.5">
                  <label className="section-label block">Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell me about your project or opportunity..."
                    value={form.message}
                    onChange={update("message")}
                    className="w-full bg-bg border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-[var(--border-hover)] focus:ring-1 focus:ring-brand-indigo/30 transition-all duration-200 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-sm font-semibold hover:opacity-85 hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:scale-100 disabled:cursor-wait focus-ring"
                >
                  <Send size={14} aria-hidden />
                  {status === "sending" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FormField({
  label, type, placeholder, value, onChange, required,
}: {
  label: string; type: string; placeholder: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="section-label block">{label}</label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-bg border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-[var(--border-hover)] focus:ring-1 focus:ring-brand-indigo/30 transition-all duration-200"
      />
    </div>
  );
}
