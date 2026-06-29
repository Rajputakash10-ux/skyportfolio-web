"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "3+", label: "ML Projects Deployed" },
  { value: "2+", label: "Years Professional Experience" },
  { value: "8.50", label: "CGPA" },
];

const highlights = [
  "Daily ML practice — consistent self-learner",
  "Ships fast with a code-first mentality",
  "Technical depth + strong client communication",
  "Real projects on GitHub, not just tutorials",
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="section-padding bg-[var(--background-secondary)]">
      <div className="container-max">
        {/* Section Title */}
        <div className="text-center mb-14">
          <p className="text-sm text-[var(--accent-cyan)] tracking-widest uppercase mb-2">Get to know me</p>
          <h2 className="text-3xl font-bold">About Me</h2>
        </div>

        <div
          ref={ref}
          className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Left — Text */}
          <div className="flex-1 space-y-5">
            <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed">
              I&apos;m a B.Sc. Computer Science graduate (2026) passionate about building
              intelligent systems that solve real-world problems. My focus is on
              Python, Machine Learning, NLP, and full-stack web development.
            </p>
            <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed">
              From deploying ML pipelines to building NLP chatbots and a live
              stock analysis platform, I combine technical depth with a
              ship-fast mindset. Every project on my GitHub is production-grade
              — built to learn, built to last.
            </p>
            <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed">
              I&apos;m currently seeking a full-time Data Science role where I can
              go deeper into MLOps, model deployment, and real-time data systems.
            </p>

            {/* Highlights */}
            <ul className="space-y-2 pt-2">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[var(--foreground-secondary)]">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="pt-4">
              <a
                href="#projects"
                className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-medium hover:opacity-90 hover:scale-105 transition-all duration-200"
              >
                View My Work →
              </a>
            </div>
          </div>

          {/* Right — Stats + Visual */}
          <div className="flex-shrink-0 w-full lg:w-80 space-y-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="card-base card-hover p-6 flex items-center gap-5 cursor-default"
              >
                <span className="text-3xl font-bold gradient-text">{stat.value}</span>
                <span className="text-sm text-[var(--foreground-secondary)] leading-snug">{stat.label}</span>
              </div>
            ))}

            {/* Tech tags */}
            <div className="card-base p-5">
              <p className="text-xs text-[var(--foreground-secondary)] uppercase tracking-widest mb-3">Core Stack</p>
              <div className="flex flex-wrap gap-2">
                {["Python", "ML/DL", "NLP", "React", "Next.js", "SQL", "FastAPI", "TensorFlow"].map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-3 py-1 rounded-full border border-[var(--border-subtle)] text-[var(--foreground-secondary)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
