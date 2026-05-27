import dynamic from "next/dynamic";
import Hero from "@/sections/Hero";
import MotionProvider from "@/components/MotionProvider";

// Navbar SSR'd but JS deferred — renders HTML immediately, hydrates after
const Navbar  = dynamic(() => import("@/components/Navbar"),  { ssr: true });
const Footer  = dynamic(() => import("@/components/Footer"),  { ssr: true });

// Client-only, non-critical — fully deferred
const ScrollProgress     = dynamic(() => import("@/components/ScrollProgress"),     { ssr: false });
const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), { ssr: false });
const BackToTop          = dynamic(() => import("@/components/BackToTop"),          { ssr: false });
const ChatWidget         = dynamic(() => import("@/components/ChatWidget"),         { ssr: false });

// Below-fold sections — each is its own chunk, parsed on demand
const About      = dynamic(() => import("@/sections/About"));
const Skills     = dynamic(() => import("@/sections/Skills"));
const Projects   = dynamic(() => import("@/sections/Projects"));
const Experience = dynamic(() => import("@/sections/Experience"));
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
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <ChatWidget />
    </MotionProvider>
  );
}
