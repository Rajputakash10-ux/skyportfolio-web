import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Akash Singh | Data Scientist & AI/ML Engineer",
  description:
    "Portfolio of Akash Singh — Aspiring Data Scientist, AI/ML Engineer, NLP Engineer, and Python Developer. Explore projects, skills, and experience.",
  keywords: [
    "Akash Singh",
    "Data Scientist",
    "AI Engineer",
    "ML Engineer",
    "NLP Engineer",
    "Python Developer",
    "Machine Learning",
    "Portfolio",
  ],
  authors: [{ name: "Akash Singh" }],
  openGraph: {
    title: "Akash Singh | Data Scientist & AI/ML Engineer",
    description: "Premium portfolio showcasing AI/ML projects, NLP systems, and data science expertise.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#0B0F19] text-[#F9FAFB] font-inter antialiased">{children}</body>
    </html>
  );
}
