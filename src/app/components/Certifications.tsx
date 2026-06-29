"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Award } from "lucide-react";

const certifications = [
  {
    title: "TensorFlow Developer Certificate",
    issuer: "Google / Coursera",
    date: "In Progress",
    link: "https://coursera.org",
    category: "ML / Deep Learning",
    color: "from-indigo-500 to-purple-500",
    border: "border-indigo-500/20",
    badge: "bg-indigo-500/10 text-indigo-300",
  },
  {
    title: "Python for Data Science & AI",
    issuer: "IBM / Coursera",
    date: "2023",
    link: "https://coursera.org",
    category: "Data Science",
    color: "from-cyan-500 to-blue-500",
    border: "border-cyan-500/20",
    badge: "bg-cyan-500/10 text-cyan-300",
  },
  {
    title: "Machine Learning Specialization",
    issuer: "DeepLearning.AI / Coursera",
    date: "2023",
    link: "https://coursera.org",
    category: "ML / Deep Learning",
    color: "from-indigo-500 to-cyan-500",
    border: "border-indigo-500/20",
    badge: "bg-indigo-500/10 text-indigo-300",
  },
  {
    title: "Natural Language Processing",
    issuer: "DeepLearning.AI",
    date: "2024",
    link: "https://coursera.org",
    category: "NLP",
    color: "from-violet-500 to-indigo-500",
    border: "border-violet-500/20",
    badge: "bg-violet-500/10 text-violet-300",
  },
  {
    title: "SQL for Data Science",
    issuer: "UC Davis / Coursera",
    date: "2023",
    link: "https://coursera.org",
    category: "Data Science",
    color: "from-cyan-500 to-teal-500",
    border: "border-cyan-500/20",
    badge: "bg-cyan-500/10 text-cyan-300",
  },
  {
    title: "MLOps Fundamentals",
    issuer: "Google Cloud",
    date: "In Progress",
    link: "https://cloud.google.com",
    category: "MLOps",
    color: "from-orange-500 to-amber-500",
    border: "border-orange-500/20",
    badge: "bg-orange-500/10 text-orange-300",
  },
];

function CertCard({
  cert,
  index,
}: {
  cert: (typeof certifications)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`card-base card-hover p-6 flex flex-col gap-4 transition-all duration-600 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Top row: icon + category badge */}
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cert.color} flex items-center justify-center shadow-md`}>
          <Award size={18} className="text-white" />
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full border ${cert.border} ${cert.badge} font-medium`}>
          {cert.category}
        </span>
      </div>

      {/* Title + issuer */}
      <div className="flex-1">
        <h3 className="font-semibold text-[var(--foreground)] leading-snug mb-1">{cert.title}</h3>
        <p className="text-sm text-[var(--foreground-secondary)]">{cert.issuer}</p>
        <p className="text-xs text-[var(--foreground-secondary)] mt-1 opacity-70">{cert.date}</p>
      </div>

      {/* Link */}
      <a
        href={cert.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-sm text-[var(--accent-cyan)] hover:text-white transition-colors w-fit"
      >
        <ExternalLink size={13} />
        View Certificate
      </a>
    </div>
  );
}

export default function Certifications() {
  return (
    <section id="certifications" className="section-padding bg-[var(--background-secondary)]">
      <div className="container-max">
        {/* Section Title */}
        <div className="text-center mb-14">
          <p className="text-sm text-[var(--accent-cyan)] tracking-widest uppercase mb-2">Credentials</p>
          <h2 className="text-3xl font-bold">Certifications</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certifications.map((cert, i) => (
            <CertCard key={cert.title} cert={cert} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
