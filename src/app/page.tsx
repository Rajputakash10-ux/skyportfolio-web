import dynamic from "next/dynamic";
import Hero from "@/sections/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";

// Above-fold: eager
const ScrollProgress = dynamic(() => import("@/components/ScrollProgress"), { ssr: false });
const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), { ssr: false });
const BackToTop = dynamic(() => import("@/components/BackToTop"), { ssr: false });

// Below-fold: lazy — each becomes its own chunk, parsed only when needed
const About      = dynamic(() => import("@/sections/About"));
const Skills     = dynamic(() => import("@/sections/Skills"));
const Projects   = dynamic(() => import("@/sections/Projects"));
const Experience = dynamic(() => import("@/sections/Experience"));
const Education  = dynamic(() => import("@/sections/Education"));
const Learning   = dynamic(() => import("@/sections/Learning"));
const Contact    = dynamic(() => import("@/sections/Contact"));

export default function Home() {
  return (
    <MotionProvider>
      <ScrollProgress />
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Learning />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </MotionProvider>
  );
}
