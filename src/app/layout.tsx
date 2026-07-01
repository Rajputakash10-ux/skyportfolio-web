import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

/* ── Load only the weights we actually use (400 + 700) ── */
const geistSans = localFont({
  src: [
    { path: "./fonts/GeistVF.woff", weight: "400", style: "normal" },
    { path: "./fonts/GeistVF.woff", weight: "700", style: "normal" },
  ],
  variable: "--font-geist-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "400",
  display: "swap",
  preload: false, // mono only used in skill level badges — not critical
  fallback: ["monospace"],
});

const siteUrl = "https://akashsingh.dev";
const description =
  "Akash Singh — Data Scientist & AI/ML Engineer. Building intelligent systems with Python, TensorFlow, NLP, and full-stack web technologies.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Akash Singh — Data Scientist & AI/ML Engineer",
    template: "%s | Akash Singh",
  },
  description,
  keywords: [
    "Data Scientist", "Machine Learning Engineer", "AI Engineer",
    "Python Developer", "NLP", "TensorFlow", "Next.js", "Portfolio",
    "Mumbai", "India", "Full-Stack Developer",
  ],
  authors: [{ name: "Akash Singh", url: siteUrl }],
  creator: "Akash Singh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Akash Singh",
    title: "Akash Singh — Data Scientist & AI/ML Engineer",
    description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Akash Singh Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akash Singh — Data Scientist & AI/ML Engineer",
    description,
    creator: "@akashsingh",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0D15",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

/* ── Anti-flash theme script — runs synchronously before paint ── */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='bw'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}else{var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',d?'dark':'light');}}catch(e){}})();`;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Akash Singh",
  url: siteUrl,
  jobTitle: "Data Scientist & AI/ML Engineer",
  description,
  address: { "@type": "PostalAddress", addressLocality: "Mumbai", addressCountry: "IN" },
  sameAs: [
    "https://github.com/Rajputakash10-ux",
    "https://www.linkedin.com/in/akash-rajput-9433aa368/",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Removed scroll-smooth — causes forced reflow on every scroll event
    <html lang="en">
      <head>
        {/* Preconnect for EmailJS API — critical for contact form */}
        <link rel="preconnect" href="https://api.emailjs.com" />
        <link rel="dns-prefetch" href="https://api.emailjs.com" />
        {/* Anti-flash theme — must execute before first paint, keep it tiny */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg text-fg`}>
        {children}
      </body>
    </html>
  );
}
