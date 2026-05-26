import HeroAnimated from "./HeroAnimated";
import HeroStats from "./HeroStats";

// Server component — renders as static HTML, no JS hydration needed
// HeroStats (LCP element) is also a server component: paints immediately
export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* Grid background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Gradient orbs — wrapper animates via CSS, blurred inner div is static */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="orb-blue absolute top-1/4 left-1/4">
          <div className="w-[500px] h-[500px] bg-[#3B82F6] rounded-full blur-[140px] opacity-[0.18]" />
        </div>
        <div className="orb-purple absolute bottom-1/4 right-1/4">
          <div className="w-[500px] h-[500px] bg-[#8B5CF6] rounded-full blur-[140px] opacity-[0.15]" />
        </div>
        <div className="orb-pink absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-72 h-72 bg-[#EC4899] rounded-full blur-[120px] opacity-[0.10]" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-5 max-w-4xl mx-auto w-full">

        {/* h1 — server rendered, visible immediately */}
        <h1 className="font-sora font-extrabold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] mb-5">
          <span className="gradient-text animate-gradient">Akash Singh</span>
        </h1>

        {/* Animated client elements: badge, typing, description, CTAs */}
        <HeroAnimated />

        {/* LCP element — pure server HTML, zero JS, paints on first render */}
        <HeroStats />
      </div>
    </section>
  );
}
