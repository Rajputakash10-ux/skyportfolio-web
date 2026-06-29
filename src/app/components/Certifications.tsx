"use client";

import { useEffect, useRef, useState } from "react";
import { Code2, Brain, Database, Globe, BarChart2, Cpu } from "lucide-react";

const skills = [
  {
    icon: Brain,
    title: "Machine Learning",
    color: "from-indigo-500 to-purple-500",
    border: "border-indigo-500/20",
    badge: "bg-indigo-500/10 text-indigo-300",
    category: "ML / DL",
    points: [
      "Built end-to-end ML pipelines from data ingestion to deployment",
      "Hands-on with supervised, unsupervised & reinforcement learning",
      "Model evaluation, hyperparameter tuning, cross-validation",
    ],
    tools: ["scikit-learn", "TensorFlow", "Keras", "XGBoost"],
  },
  {
    icon: Code2,
    title: "Natural Language Processing",
    color: "from-cyan-500 to-blue-500",
    border: "border-cyan-500/20",
    badge: "bg-cyan-500/10 text-cyan-300",
    category: "NLP",
    points: [
      "Built real-time NLP chatbot with intent classification",
      "Text preprocessing, tokenization, embeddings (Word2Vec, BERT)",
      "Sentiment analysis, named entity recognition",
    ],
    tools: ["NLTK", "spaCy", "HuggingFace", "Transformers"],
  },
  {
    icon: BarChart2,
    title: "Data Science & Analysis",
    color: "from-cyan-500 to-teal-500",
    border: "border-cyan-500/20",
    badge: "bg-cyan-500/10 text-cyan-300",
    category: "Data Science",
    points: [
      "Exploratory data analysis on real-world datasets",
      "Data cleaning, feature engineering, visualization",
      "Statistical analysis and hypothesis testing",
    ],
    tools: ["Pandas", "NumPy", "Matplotlib", "Seaborn"],
  },
  {
    icon: Globe,
    title: "Full-Stack Development",
    color: "from-violet-500 to-indigo-500",
    border: "border-violet-500/20",
    badge: "bg-violet-500/10 text-violet-300",
    category: "Web Dev",
    points: [
      "Built Stock Talks — live stock analysis & trading platform",
      "REST API design and integration with ML backends",
      "Responsive UI with React, Next.js, Tailwind CSS",
    ],
    tools: ["Next.js", "React", "FastAPI", "PostgreSQL"],
  },
  {
    icon: Database,
    title: "Data Engineering",
    color: "from-orange-500 to-amber-500",
    border: "border-orange-500/20",
    badge: "bg-orange-500/10 text-orange-300",
    category: "Data Eng",
    points: [
      "Designed and queried relational databases for ML projects",
      "Data pipeline automation and preprocessing scripts",
      "Experience with structured and unstructured data formats",
    ],
    tools: ["SQL", "PostgreSQL", "MongoDB", "Pandas"],
  },
  {
    icon: Cpu,
    title: "MLOps & Deployment",
    color: "from-indigo-500 to-cyan-500",
    border: "border-indigo-500/20",
    badge: "bg-indigo-500/10 text-indigo-300",
    category: "MLOps",
    points: [
      "Model versioning, packaging and serving via APIs",
      "Docker basics for containerizing ML applications",
      "Deployed ML models to cloud and local environments",
    ],
    tools: ["Docker", "FastAPI", "GitHub Actions", "Vercel"],
  },
];

function SkillCard({
  skill,
  index,
}: {
  skill: (typeof skills)[0];
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

  const Icon = skill.icon;

  return (
    <div
      ref={ref}
      className={`card-base card-hover p-6 flex flex-col gap-4 transition-all duration-600 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${skill.color} flex items-center justify-center shadow-md`}>
          <Icon size={18} className="text-white" />
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full border ${skill.border} ${skill.badge} font-medium`}>
          {skill.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-[var(--foreground)]">{skill.title}</h3>

      {/* Points */}
      <ul className="space-y-1.5 flex-1">
        {skill.points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-[var(--foreground-secondary)]">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0" />
            {p}
          </li>
        ))}
      </ul>

      {/* Tools */}
      <div className="flex flex-wrap gap-2 pt-1">
        {skill.tools.map((t) => (
          <span
            key={t}
            className={`text-xs px-2.5 py-0.5 rounded-full border ${skill.border} ${skill.badge}`}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Certifications() {
  return (
    <section id="certifications" className="section-padding bg-[var(--background-secondary)]">
      <div className="container-max">
        {/* Section Title */}
        <div className="text-center mb-14">
          <p className="text-sm text-[var(--accent-cyan)] tracking-widest uppercase mb-2">What I bring</p>
          <h2 className="text-3xl font-bold">Hands-On Skills</h2>
          <p className="text-[var(--foreground-secondary)] mt-3 max-w-md mx-auto text-sm">
            No certificates — just real projects, consistent practice, and depth built from actually building things.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill, i) => (
            <SkillCard key={skill.title} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
