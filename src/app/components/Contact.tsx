"use client";

import { useState, useRef } from "react";
import { m as motion } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import SectionHeader from "@/app/components/ui/SectionHeader";

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "rajputakash1656@gmail.com", href: "mailto:rajputakash1656@gmail.com" },
  { icon: MapPin, label: "Location", value: "Mumbai, India", href: undefined },
  { icon: GitHubIcon, label: "GitHub", value: "Rajputakash10-ux", href: "https://github.com/Rajputakash10-ux" },
  { icon: LinkedInIcon, label: "LinkedIn", value: "akash-rajput-9433aa368", href: "https://www.linkedin.com/in/akash-rajput-9433aa368/" },
];

const EJS_SERVICE  = process.env.NEXT_PUBLIC_EJS_SERVICE  ?? "";
const EJS_TEMPLATE = process.env.NEXT_PUBLIC_EJS_TEMPLATE ?? "";
const EJS_PUBLIC   = process.env.NEXT_PUBLIC_EJS_PUBLIC   ?? "";

const RATE_LIMIT_MS = 60_000; // 1 submission per minute

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const lastSubmitRef = useRef<number>(0);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "ratelimit">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const now = Date.now();
    if (now - lastSubmitRef.current < RATE_LIMIT_MS) {
      setStatus("ratelimit");
      return;
    }

    // Basic input length guards
    if (form.name.length > 100 || form.email.length > 200 || form.message.length > 2000) {
      setStatus("error");
      return;
    }

    lastSubmitRef.current = now;
    setStatus("sending");
    try {
      // Dynamic import — emailjs only loads when user actually submits
      const emailjs = (await import("@emailjs/browser")).default;
      await emailjs.sendForm(EJS_SERVICE, EJS_TEMPLATE, formRef.current, EJS_PUBLIC);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const update = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm text-fg placeholder:text-fg-subtle focus:outline-none transition-all duration-200"
    + " bg-bg border focus:ring-1 focus:ring-[#D4A5FF]/30";

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
            {CONTACT_INFO.map(({ icon: Icon, label, value, href }, i) => (
              <div
                key={label}
                className="card p-4 flex items-center gap-4 transition-all duration-300"
                style={{ borderColor: i % 2 === 0 ? "rgba(212,165,255,0.15)" : "rgba(0,229,204,0.15)" }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #D4A5FF, #00E5CC)" }}
                >
                  <Icon size={15} className="text-white" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-fg-subtle uppercase tracking-wider mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-fg hover:text-[#00E5CC] transition-colors truncate block focus-ring rounded">
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
            {status === "ratelimit" ? (
              <div className="card p-8 flex flex-col items-center justify-center gap-4 min-h-[320px] text-center">
                <AlertCircle size={48} className="text-yellow-400" />
                <div>
                  <p className="text-lg font-semibold text-fg mb-1">Slow down!</p>
                  <p className="text-sm text-fg-muted">Please wait a moment before sending another message.</p>
                </div>
                <button onClick={() => setStatus("idle")}
                  className="text-xs text-fg-muted hover:text-fg underline underline-offset-2 transition-colors focus-ring rounded">
                  Try again
                </button>
              </div>
            ) : status === "sent" ? (
              <div className="card p-8 flex flex-col items-center justify-center gap-4 min-h-[320px] text-center">
                <CheckCircle size={48} style={{ color: "#00E5CC" }} />
                <div>
                  <p className="text-lg font-semibold text-fg mb-1">Message sent!</p>
                  <p className="text-sm text-fg-muted">I&apos;ll get back to you within 24 hours.</p>
                </div>
                <button onClick={() => setStatus("idle")}
                  className="text-xs text-fg-muted hover:text-fg underline underline-offset-2 transition-colors focus-ring rounded">
                  Send another message
                </button>
              </div>
            ) : status === "error" ? (
              <div className="card p-8 flex flex-col items-center justify-center gap-4 min-h-[320px] text-center">
                <AlertCircle size={48} className="text-red-400" />
                <div>
                  <p className="text-lg font-semibold text-fg mb-1">Something went wrong</p>
                  <p className="text-sm text-fg-muted">Email me directly at<br />
                    <a href="mailto:rajputakash1656@gmail.com" style={{ color: "#00E5CC" }} className="hover:underline">
                      rajputakash1656@gmail.com
                    </a>
                  </p>
                </div>
                <button onClick={() => setStatus("idle")}
                  className="text-xs text-fg-muted hover:text-fg underline underline-offset-2 transition-colors focus-ring rounded">
                  Try again
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="card p-6 space-y-4" noValidate
                style={{ borderColor: "rgba(212,165,255,0.15)" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="from_name" className="section-label block">Name</label>
                    <input id="from_name" type="text" name="from_name" required placeholder="Your name" value={form.name}
                      onChange={update("name")} maxLength={100}
                      className={inputClass}
                      style={{ borderColor: "rgba(212,165,255,0.15)" }} />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="reply_to" className="section-label block">Email</label>
                    <input id="reply_to" type="email" name="reply_to" required placeholder="your@email.com" value={form.email}
                      onChange={update("email")} maxLength={200}
                      className={inputClass}
                      style={{ borderColor: "rgba(212,165,255,0.15)" }} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="message" className="section-label block">Message</label>
                  <textarea id="message" required name="message" rows={5} maxLength={2000}
                    placeholder="Tell me about your project or opportunity..."
                    value={form.message} onChange={update("message")}
                    className={`${inputClass} resize-none`}
                    style={{ borderColor: "rgba(212,165,255,0.15)" }} />
                </div>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-85 hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:scale-100 disabled:cursor-wait focus-ring"
                  style={{ background: "linear-gradient(135deg, #D4A5FF, #00E5CC)" }}
                >
                  <Send size={14} aria-hidden="true" />
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
