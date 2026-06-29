import { Code2, Brain, Database, Globe, BarChart2, Cpu } from "lucide-react";

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

export const STATS = [
  { value: "3+", label: "ML Projects Deployed" },
  { value: "2+", label: "Years Experience" },
  { value: "8.5", label: "CGPA" },
  { value: "∞", label: "Curiosity" },
] as const;

export const TECH_STACK = [
  "Python", "TensorFlow", "PyTorch", "scikit-learn",
  "HuggingFace", "FastAPI", "Next.js", "PostgreSQL",
  "Docker", "React", "SQL", "NLTK",
] as const;

export const PROJECTS = [
  {
    id: "stock-talks",
    title: "Stock Talks",
    description: "Live stock analysis & trading intelligence platform. Real-time data ingestion, NLP-powered news sentiment, and predictive price modeling.",
    tags: ["Python", "NLP", "Next.js", "PostgreSQL", "WebSocket"],
    category: "Full-Stack + ML",
    href: "https://github.com/Rajputakash10-ux",
    featured: true,
    gradient: "from-indigo-600/20 to-cyan-600/20",
    accentColor: "indigo",
    metrics: ["Real-time data", "NLP sentiment", "Predictive ML"],
  },
  {
    id: "nlp-chatbot",
    title: "NLP Intent Classifier",
    description: "Real-time conversational AI with intent classification, entity extraction, and context-aware response generation using transformer models.",
    tags: ["HuggingFace", "BERT", "FastAPI", "Python"],
    category: "NLP / AI",
    href: "https://github.com/Rajputakash10-ux",
    featured: true,
    gradient: "from-violet-600/20 to-indigo-600/20",
    accentColor: "violet",
    metrics: ["BERT-based", "Intent detection", "FastAPI served"],
  },
  {
    id: "ml-pipeline",
    title: "ML Pipeline Engine",
    description: "End-to-end automated ML pipeline from raw data ingestion to model deployment. Feature engineering, hyperparameter tuning, and model versioning.",
    tags: ["scikit-learn", "XGBoost", "Docker", "MLflow"],
    category: "MLOps",
    href: "https://github.com/Rajputakash10-ux",
    featured: false,
    gradient: "from-cyan-600/20 to-teal-600/20",
    accentColor: "cyan",
    metrics: ["Auto feature eng.", "Model versioning", "Containerized"],
  },
  {
    id: "sentiment-analysis",
    title: "Sentiment Analytics",
    description: "Multi-class sentiment analysis on financial news and social media data, providing actionable market signals.",
    tags: ["NLTK", "spaCy", "Pandas", "Matplotlib"],
    category: "Data Science",
    href: "https://github.com/Rajputakash10-ux",
    featured: false,
    gradient: "from-orange-600/20 to-amber-600/20",
    accentColor: "orange",
    metrics: ["Multi-class", "Financial NLP", "Visualization"],
  },
] as const;

export const EXPERIENCES = [
  {
    type: "work" as const,
    company: "Freelance",
    role: "Data Science & ML Developer",
    period: "2023 – Present",
    location: "Mumbai, India",
    highlights: [
      "Built and deployed NLP chatbot with real-time intent classification",
      "Developed end-to-end ML pipeline for predictive analytics",
      "Created Stock Talks — live stock analysis & trading platform",
    ],
    skills: ["Python", "TensorFlow", "FastAPI", "Next.js", "PostgreSQL"],
  },
  {
    type: "education" as const,
    company: "JVM Mehta Degree College",
    role: "B.Sc. Computer Science",
    period: "Jul 2023 – May 2026",
    location: "Airoli, Mumbai",
    highlights: [
      "Grade A · 8.50 CGPA — consistently top performer",
      "Coding Club member · Placement Cell volunteer · Tech Fest organizer",
      "3 production-grade ML projects during coursework",
    ],
    skills: ["Python", "Machine Learning", "NLP", "React", "SQL"],
  },
] as const;

export const SKILLS = [
  {
    icon: Brain,
    title: "Machine Learning",
    category: "ML / DL",
    color: "from-indigo-500 to-violet-500",
    tools: ["scikit-learn", "TensorFlow", "Keras", "XGBoost"],
    level: 85,
  },
  {
    icon: Code2,
    title: "Natural Language Processing",
    category: "NLP",
    color: "from-cyan-500 to-blue-500",
    tools: ["NLTK", "spaCy", "HuggingFace", "BERT"],
    level: 80,
  },
  {
    icon: BarChart2,
    title: "Data Science & Analysis",
    category: "Data Science",
    color: "from-cyan-400 to-teal-500",
    tools: ["Pandas", "NumPy", "Matplotlib", "Seaborn"],
    level: 90,
  },
  {
    icon: Globe,
    title: "Full-Stack Development",
    category: "Web Dev",
    color: "from-violet-500 to-indigo-500",
    tools: ["Next.js", "React", "FastAPI", "PostgreSQL"],
    level: 75,
  },
  {
    icon: Database,
    title: "Data Engineering",
    category: "Data Eng",
    color: "from-orange-400 to-amber-500",
    tools: ["SQL", "PostgreSQL", "MongoDB", "Pandas"],
    level: 70,
  },
  {
    icon: Cpu,
    title: "MLOps & Deployment",
    category: "MLOps",
    color: "from-indigo-500 to-cyan-500",
    tools: ["Docker", "FastAPI", "GitHub Actions", "Vercel"],
    level: 65,
  },
] as const;
