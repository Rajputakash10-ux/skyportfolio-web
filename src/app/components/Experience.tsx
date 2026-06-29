"use client";

import { useEffect, useRef, useState } from "react";
import { Briefcase, GraduationCap } from "lucide-react";

const experiences = [
  {
    type: "education",
    company: "JVM Mehta Degree College, Airoli",
    role: "B.Sc. Computer Science",
    grade: "Grade A · 8.50 CGPA",
    period: "Jul 2023 – May 2026",
    highlights: [
      "Coding Club member · Placement Cell volunteer · Tech Fest organizer",
      "Specialized in Python, ML, NLP, and full-stack development",
      "Completed 3 production-grade ML projects during coursework",
    ],
    skills: ["Python", "Machine Learning", "NLP", "React", "SQL"],
  },
  {
    type: "work",
    company: "Freelance AI/ML Projects",
    role: "Data Science & ML Developer",
    grade: null,
    period: "2023 – Present",
    highlights: [
      "Built and deployed NLP chatbot with real-time intent classification",
      "Developed end-to-end ML pipeline for predictive analytics",
      "Created Stock Talks — a live stock analysis & trading platform",
    ],
    skills: ["Python", "TensorFlow", "FastAPI", "Next.js", "PostgreSQL"],
  },
  {
    type: "work",
    company: "Professional Experience",
    role: "Client-Facing Roles (BPO / Support)",
    grade: null,
    period: "2021 – 2023",
    highlights: [
      "Strong client communication and problem-solving under pressure",
      "Managed high-volume interactions with consistent quality delivery",
    ],
    skills: ["Communication", "Problem-solving", "Team Collaboration"],
  },
];

function TimelineCard({
  exp,
  index,
}: {
  exp: (typeof experiences)[0];
  index: number;
}) {
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

  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-6 lg:gap-0 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Desktop: alternating layout */}
      <div className={`hidden lg:flex w-full items-start gap-8 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
        {/* Card */}
        <div className="w-[calc(50%-2rem)]">
          <div className="card-base card-hover p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-[var(--foreground)]">{exp.company}</h3>
                <p className="text-sm text-[var(--accent-cyan)]">{exp.role}</p>
                {exp.grade && (
                  <p className="text-xs text-[var(--foreground-secondary)] mt-0.5">{exp.grade}</p>
                )}
              </div>
              <span className="text-xs text-[var(--foreground-secondary)] whitespace-nowrap border border-[var(--border-subtle)] px-2 py-1 rounded-md">
                {exp.period}
              </span>
            </div>

            <ul className="space-y-1.5">
              {exp.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-[var(--foreground-secondary)]">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2 pt-1">
              {exp.skills.map((s) => (
                <span
                  key={s}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Center dot */}
        <div className="flex flex-col items-center w-16 flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 z-10">
            {exp.type === "education" ? (
              <GraduationCap size={18} className="text-white" />
            ) : (
              <Briefcase size={18} className="text-white" />
            )}
          </div>
        </div>

        {/* Empty side */}
        <div className="w-[calc(50%-2rem)]" />
      </div>

      {/* Mobile: single column */}
      <div className="flex lg:hidden items-start gap-4 w-full">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-md">
            {exp.type === "education" ? (
              <GraduationCap size={16} className="text-white" />
            ) : (
              <Briefcase size={16} className="text-white" />
            )}
          </div>
          {index < experiences.length - 1 && (
            <div className="w-px flex-1 min-h-[1.5rem] bg-gradient-to-b from-indigo-500/40 to-cyan-500/20 mt-2" />
          )}
        </div>

        <div className="flex-1 pb-8">
          <div className="card-base card-hover p-5 space-y-3">
            <div>
              <h3 className="font-semibold text-[var(--foreground)]">{exp.company}</h3>
              <p className="text-sm text-[var(--accent-cyan)]">{exp.role}</p>
              {exp.grade && (
                <p className="text-xs text-[var(--foreground-secondary)] mt-0.5">{exp.grade}</p>
              )}
              <p className="text-xs text-[var(--foreground-secondary)] mt-1">{exp.period}</p>
            </div>
            <ul className="space-y-1.5">
              {exp.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-[var(--foreground-secondary)]">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 pt-1">
              {exp.skills.map((s) => (
                <span
                  key={s}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="section-padding">
      <div className="container-max">
        {/* Section Title */}
        <div className="text-center mb-14">
          <p className="text-sm text-[var(--accent-cyan)] tracking-widest uppercase mb-2">My journey</p>
          <h2 className="text-3xl font-bold">Experience & Education</h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line (desktop only) */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/40 via-cyan-500/30 to-transparent" />

          <div className="space-y-10 lg:space-y-12">
            {experiences.map((exp, i) => (
              <TimelineCard key={exp.company} exp={exp} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
