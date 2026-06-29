import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MotionProvider from "./components/MotionProvider";

// Lazy-load everything below the fold
const About      = dynamic(() => import("./components/About"));
const Projects   = dynamic(() => import("./components/Projects"));
const Experience = dynamic(() => import("./components/Experience"));
const Skills     = dynamic(() => import("./components/Skills"));
const Contact    = dynamic(() => import("./components/Contact"));
const Footer     = dynamic(() => import("./components/Footer"));

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <MotionProvider>
        <About />
        <Projects />
        <Experience />
        <Skills />
        <Contact />
        <Footer />
      </MotionProvider>
    </main>
  );
}
