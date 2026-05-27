"use client";
import { useState, useRef, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";

const quickReplies = [
  "Are you available for work?",
  "Can I see your resume?",
  "What's your tech stack?",
  "Let's collaborate!",
];

type Msg = { from: "user" | "bot"; text: string };

const botReply = (msg: string): string => {
  const m = msg.toLowerCase();
  if (m.includes("available") || m.includes("work") || m.includes("hire"))
    return "Yes! I'm actively looking for Data Science & AI/ML roles. Feel free to reach out via the contact form or email me directly.";
  if (m.includes("resume") || m.includes("cv"))
    return "You can download my resume using the Resume button in the navbar. It's always up to date!";
  if (m.includes("stack") || m.includes("tech") || m.includes("skill"))
    return "My core stack: Python, TensorFlow, Scikit-Learn, Pandas, Flask, SQL, Power BI. Check the Skills section for the full list!";
  if (m.includes("collaborat") || m.includes("project"))
    return "I'd love to collaborate! Drop me a message in the contact form with your project idea and I'll get back to you.";
  return "Thanks for reaching out! For detailed queries, please use the contact form below or email rajputakash1656@gmail.com.";
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "👋 Hi! I&apos;m Akash&apos;s assistant. Ask me anything or pick a quick reply below." },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { from: "user", text };
    setMsgs((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      setMsgs((prev) => [...prev, { from: "bot", text: botReply(text) }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, translateY: 16, scale: 0.95 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            exit={{ opacity: 0, translateY: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-[320px] glass rounded-2xl border border-white/[0.1] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#3B82F6]/20 to-[#8B5CF6]/20 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-sm">🤖</div>
                <div>
                  <p className="text-white text-xs font-semibold">Akash&apos;s Assistant</p>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" aria-hidden="true" />
                    <span className="text-green-400 text-[10px]">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-[#9CA3AF] hover:text-white transition-colors p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] rounded"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Messages */}
            <div className="h-52 overflow-y-auto px-3 py-3 space-y-2 scrollbar-thin">
              {msgs.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    msg.from === "user"
                      ? "bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white"
                      : "bg-white/[0.06] text-[#D1D5DB]"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-[#3B82F6]/10 text-[#60a5fa] border border-[#3B82F6]/20 hover:bg-[#3B82F6]/20 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3B82F6]"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex gap-2 px-3 pb-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                aria-label="Chat message"
                className="flex-1 bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs placeholder-[#4B5563] focus:outline-none focus:border-[#3B82F6]/60 transition-all"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 flex-shrink-0"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" aria-hidden="true"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
              </button>
            </form>
          </m.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <m.button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : "Open chat"}
        whileTap={{ scale: 0.92 }}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow animate-pulse-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <m.svg key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></m.svg>
          ) : (
            <m.svg key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" aria-hidden="true"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></m.svg>
          )}
        </AnimatePresence>
      </m.button>
    </div>
  );
}
