"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import emailjs from "@emailjs/browser";
import SectionWrapper, { SectionTitle } from "@/components/SectionWrapper";

const contactInfo = [
  {
    icon: "✉️",
    label: "Email",
    value: "rajputakash1656@gmail.com",
    href: "mailto:rajputakash1656@gmail.com",
    color: "from-blue-500 to-purple-500",
  },
  {
    icon: "💼",
    label: "LinkedIn",
    value: "linkedin.com/in/akash-rajput",
    href: "https://www.linkedin.com/in/akash-rajput-9433aa368/",
    color: "from-blue-600 to-blue-400",
  },
  {
    icon: "🐙",
    label: "GitHub",
    value: "github.com/Rajputakash10-ux",
    href: "https://github.com/Rajputakash10-ux",
    color: "from-gray-600 to-gray-400",
  },
  {
    icon: "📍",
    label: "Location",
    value: "India",
    href: "#",
    color: "from-green-500 to-teal-500",
  },
];

export default function Contact() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(false);
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        { from_name: form.name, from_email: form.email, message: form.message },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    } catch {
      setError(true);
      setTimeout(() => setError(false), 4000);
    } finally {
      setSending(false);
    }
  };

  return (
    <SectionWrapper id="contact">
      <SectionTitle title="Get In Touch" subtitle="Let's build something intelligent together" />
      <div ref={ref} className="grid lg:grid-cols-2 gap-12">
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="space-y-4"
        >
          <p className="text-[#9CA3AF] text-base leading-relaxed mb-8">
            I&apos;m actively looking for opportunities in Data Science, AI/ML Engineering, and Python Development.
            Feel free to reach out — I&apos;d love to connect!
          </p>
          {contactInfo.map((info, i) => (
            <motion.a
              key={info.label}
              href={info.href}
              target={info.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-center gap-4 glass rounded-xl p-4 gradient-border hover:scale-[1.02] transition-transform duration-200 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center text-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                {info.icon}
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF] font-medium uppercase tracking-wider">{info.label}</p>
                <p className="text-white font-medium text-sm">{info.value}</p>
              </div>
              <svg className="ml-auto text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </motion.a>
          ))}
        </motion.div>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 gradient-border space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#4B5563] focus:outline-none focus:border-[#3B82F6]/50 focus:bg-white/8 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#4B5563] focus:outline-none focus:border-[#3B82F6]/50 focus:bg-white/8 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about the opportunity..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#4B5563] focus:outline-none focus:border-[#3B82F6]/50 focus:bg-white/8 transition-all text-sm resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              {sending ? "Sending..." : sent ? "✅ Message Sent!" : error ? "❌ Failed, try again" : "Send Message"}
            </button>
          </form>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
