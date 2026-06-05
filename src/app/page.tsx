import dynamic from "next/dynamic";
import MotionProvider from "@/components/MotionProvider";

const Navbar  = dynamic(() => import("@/components/Navbar"),  { ssr: true });
const Footer  = dynamic(() => import("@/components/Footer"),  { ssr: true });

const ScrollProgress     = dynamic(() => import("@/components/ScrollProgress"),     { ssr: false });
const BackToTop          = dynamic(() => import("@/components/BackToTop"),          { ssr: false });
const ChatWidget         = dynamic(() => import("@/components/ChatWidget"),         { ssr: false });
const HeroAnimation      = dynamic(() => import("@/components/HeroAnimation"),      { ssr: false });

const About      = dynamic(() => import("@/sections/About"));
const Skills     = dynamic(() => import("@/sections/Skills"));
const Projects   = dynamic(() => import("@/sections/Projects"));
const Experience = dynamic(() => import("@/sections/Experience"));
const Contact    = dynamic(() => import("@/sections/Contact"));

export default function Home() {
  return (
    <MotionProvider>
      <ScrollProgress />
      <Navbar />
      <main className="relative z-10">
        <HeroAnimation />
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
