import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

// Lazy-load everything below the fold — keeps initial bundle to Hero + Navbar only
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
      <About />
      <Projects />
      <Experience />
      <Skills />
      <Contact />
      <Footer />
    </main>
  );
}
