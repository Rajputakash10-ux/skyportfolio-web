"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper, { SectionTitle } from "@/components/SectionWrapper";

const contactLinks = [
  { label: "Email",    value: "rajputakash1656@gmail.com",       href: "mailto:rajputakash1656@gmail.com" },
  { label: "LinkedIn", value: "linkedin.com/in/akash-rajput",    href: "https://www.linkedin.com/in/akash-rajput-9433aa368/" },
  { label: "GitHub",   value: "github.com/Rajputakash10-ux",     href: "https://github.com/Rajputakash10-ux" },
  { label: "Location", value: "India",                           href: "#" },
];

export default function Contact() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const emailjs = (await import("@emailjs/browser")).default;
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        { from_name: form.name, from_email: form.email, message: form.message },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <SectionWrapper id="contact">
      <SectionTitle title="Contact" subtitle="Open to Data Science, AI/ML, and Python roles." />
      <div ref={ref} className="grid lg:grid-cols-2 gap-16">

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-white/50 text-sm font-light leading-loose mb-10">
            I&apos;m actively looking for opportunities in Data Science, AI/ML Engineering,
            and Python Development. Feel free to reach out.
          </p>
          <div className="space-y-0 border-t border-white/8">
            {contactLinks.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-6 py-4 border-b border-white/8 group hover:bg-white/[0.02] transition-colors px-1"
              >
                <span className="text-white/25 text-xs tracking-widest uppercase w-20 flex-shrink-0">{c.label}</span>
                <span className="text-white/60 text-sm font-light group-hover:text-white transition-colors">{c.value}</span>
                <svg className="ml-auto text-white/20 group-hover:text-white/50 transition-colors" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="border border-white/8 p-8 space-y-6">
            <div>
              <label className="block text-xs text-white/30 tracking-widest uppercase mb-2">Name</label>
              <input
                type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                className="w-full bg-transparent border border-white/10 px-4 py-3 text-white text-sm font-light placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/30 tracking-widest uppercase mb-2">Email</label>
              <input
                type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full bg-transparent border border-white/10 px-4 py-3 text-white text-sm font-light placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/30 tracking-widest uppercase mb-2">Message</label>
              <textarea
                required rows={5} value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about the opportunity..."
                className="w-full bg-transparent border border-white/10 px-4 py-3 text-white text-sm font-light placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-3 text-sm tracking-widest uppercase bg-white text-black hover:bg-white/90 disabled:opacity-50 transition-colors"
            >
              {status === "sending" ? "Sending..." : status === "sent" ? "Message Sent" : status === "error" ? "Failed — Try Again" : "Send Message"}
            </button>
          </form>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
