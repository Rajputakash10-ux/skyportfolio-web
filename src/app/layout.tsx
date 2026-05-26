import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["400","600","700","800"], display: "swap" });

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0F19",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${sora.variable}`}>
      <body className="bg-[#0B0F19] text-[#F9FAFB] font-inter antialiased">{children}</body>
    </html>
  );
}
