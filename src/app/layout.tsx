import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
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
  themeColor: "#080810",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

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
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg text-fg`}
      >
        {children}
      </body>
    </html>
  );
}
