"use client";
import { useState } from "react";
import { m } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper, { SectionTitle } from "@/components/SectionWrapper";

const faqs = [
  { q: "Are you available for full-time roles?", a: "Yes! I'm actively looking for full-time opportunities in Data Science, AI/ML Engineering, and Python Development." },
  { q: "What's your preferred tech stack?", a: "Python is my primary language. I work with TensorFlow, Scikit-Learn, Pandas, Flask, and Power BI for end-to-end ML pipelines." },
  { q: "Are you open to remote work?", a: "Absolutely. I'm open to remote, hybrid, or on-site roles across India and internationally." },
  { q: "Can you share your resume?", a: "Yes — you can download it directly from the Resume button in the navbar or the hero section." },
  { q: "What kind of projects have you built?", a: "NLP chatbots, stock prediction platforms, and end-to-end ML pipelines. Check the Projects section for details." },
];

export default function Contact() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
      <SectionTitle title="Get In Touch" subtitle="Let's build something intelligent together" />
      <div ref={ref} className="grid lg:grid-cols-2 gap-8">

        {/* Left — FAQ accordion */}
        <m.div
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <p className="text-[#9CA3AF] text-sm leading-relaxed mb-5">
            I&apos;m actively looking for opportunities in{" "}
            <span className="text-white font-medium">Data Science</span>,{" "}
            <span className="text-white font-medium">AI/ML Engineering</span>, and{" "}
            <span className="text-white font-medium">Python Development</span>.
          </p>

          {/* Quick contact links */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { label: "Email", href: "mailto:rajputakash1656@gmail.com", icon: "✉️" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/akash-rajput-9433aa368/", icon: "💼" },
              { label: "GitHub", href: "https://github.com/Rajputakash10-ux", icon: "🐙" },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={c.label}
                className="flex items-center gap-2 px-3 py-2 glass rounded-xl border border-white/[0.08] text-xs text-[#9CA3AF] hover:text-white hover:border-[#3B82F6]/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
              >
                <span aria-hidden="true">{c.icon}</span>{c.label}
              </a>
            ))}
          </div>

          {/* FAQ accordion */}
          <p className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider mb-3">Frequently Asked</p>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="glass rounded-xl border border-white/[0.06] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-inset"
                >
                  <span className="text-white text-xs font-medium">{faq.q}</span>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    className={`text-[#9CA3AF] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {openFaq === i && (
                  <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-3 text-[#9CA3AF] text-xs leading-relaxed border-t border-white/[0.05] pt-2">{faq.a}</p>
                  </m.div>
                )}
              </div>
            ))}
          </div>
        </m.div>

        {/* Right — quick contact form */}
        <m.div
          initial={{ opacity: 0, x: 24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 gradient-border space-y-4">
            <h3 className="font-sora font-bold text-white text-base mb-1">Send a Message</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="contact-name" className="block text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Name</label>
                <input
                  id="contact-name"
                  type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#3B82F6]/60 transition-all"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Email</label>
                <input
                  id="contact-email"
                  type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#3B82F6]/60 transition-all"
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Message</label>
              <textarea
                id="contact-message"
                required rows={5} value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about the opportunity..."
                className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#3B82F6]/60 transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED] hover:scale-[1.02] disabled:opacity-60 transition-all duration-200 shadow-lg shadow-blue-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              {status === "sending" ? "Sending..." : status === "sent" ? "✅ Message Sent!" : status === "error" ? "❌ Failed — Try Again" : "Send Message →"}
            </button>
          </form>
        </m.div>
      </div>
    </SectionWrapper>
  );
}
