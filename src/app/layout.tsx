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
    <html lang="en" className={`scroll-smooth ${inter.variable} ${sora.variable} bg-[#050508]`}>
      <head>
        {/* Preconnect to Google Fonts CDN — reduces font TTFB */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        {/* Preconnect to EmailJS — warms TCP before contact form submit */}
        <link rel="dns-prefetch" href="https://api.emailjs.com" />
        {/* Preload Sora 800 (h1 — LCP element). Eliminates render-blocking font swap. */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/sora/v12/xMQOuFFYT72X5wkB_18qmnndmSdSn3-KIwNhBti0.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Preload Inter 400 — body text, prevents FOUT on first paint */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-[#050508] text-[#f0f0f0] font-inter antialiased">{children}</body>
    </html>
  );
}
