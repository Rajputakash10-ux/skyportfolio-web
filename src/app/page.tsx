import dynamic from "next/dynamic";
import Hero from "@/sections/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";

const ScrollProgress  = dynamic(() => import("@/components/ScrollProgress"),  { ssr: false });
const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), { ssr: false });
const BackToTop       = dynamic(() => import("@/components/BackToTop"),        { ssr: false });
const ChatWidget      = dynamic(() => import("@/components/ChatWidget"),       { ssr: false });

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
