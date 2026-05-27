import HeroAnimated from "./HeroAnimated";
import HeroStats from "./HeroStats";

export default function Hero() {
  return (
    <section className="relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden pt-16">

      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="orb-blue absolute top-1/4 left-1/4">
          <div className="w-[400px] h-[400px] bg-[#3B82F6] rounded-full blur-[120px] opacity-[0.18]" />
        </div>
        <div className="orb-purple absolute bottom-1/4 right-1/4">
          <div className="w-[400px] h-[400px] bg-[#8B5CF6] rounded-full blur-[120px] opacity-[0.15]" />
        </div>
      </div>

      <div className="relative z-10 text-center px-5 max-w-3xl mx-auto w-full">
        <h1 className="font-sora font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.08] mb-4">
          <span className="gradient-text animate-gradient">Akash Singh</span>
        </h1>
        <HeroAnimated />
        <HeroStats />
      </div>
    </section>
  );
}
