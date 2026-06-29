"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────
   PLANET DATA — real Kepler orbital periods
   Earth = 16s baseline. All others scaled by
   true sidereal year ratios from NASA data.
   Earth=1yr, Mercury=0.241yr, Venus=0.615yr,
   Mars=1.881yr, Jupiter=11.86yr, Saturn=29.46yr,
   Uranus=84.01yr, Neptune=164.8yr
───────────────────────────────────────────── */
const EARTH_BASE = 16; // seconds on screen = 1 Earth year

const PLANETS = [
  {
    id: "mercury",
    label: "Mercury",
    size: 6,
    orbitR: 68,
    period: +(EARTH_BASE * 0.241).toFixed(2),   // 3.86s
    color: "#b5b5b5",
    glow: "rgba(181,181,181,0.8)",
    initialAngle: 20,
    moons: [],
  },
  {
    id: "venus",
    label: "Venus",
    size: 10,
    orbitR: 96,
    period: +(EARTH_BASE * 0.615).toFixed(2),   // 9.84s
    color: "#e8cda0",
    glow: "rgba(232,205,160,0.8)",
    initialAngle: 110,
    moons: [],
  },
  {
    id: "earth",
    label: "Earth",
    size: 11,
    orbitR: 128,
    period: EARTH_BASE,                          // 16s
    color: "#4fa3e0",
    glow: "rgba(79,163,224,0.9)",
    initialAngle: 200,
    moons: [{ size: 3, orbitR: 18, period: 1.2, color: "#c8c8c8" }],
    hasAtmosphere: true,
  },
  {
    id: "mars",
    label: "Mars",
    size: 8,
    orbitR: 162,
    period: +(EARTH_BASE * 1.881).toFixed(2),   // 30.1s
    color: "#c1440e",
    glow: "rgba(193,68,14,0.8)",
    initialAngle: 300,
    moons: [],
  },
  {
    id: "jupiter",
    label: "Jupiter",
    size: 28,
    orbitR: 212,
    period: +(EARTH_BASE * 11.86).toFixed(2),   // 189.8s
    color: "#c88b3a",
    glow: "rgba(200,139,58,0.7)",
    initialAngle: 45,
    moons: [],
    hasStripes: true,
  },
  {
    id: "saturn",
    label: "Saturn",
    size: 23,
    orbitR: 268,
    period: +(EARTH_BASE * 29.46).toFixed(2),   // 471.4s
    color: "#e4d191",
    glow: "rgba(228,209,145,0.7)",
    initialAngle: 160,
    moons: [],
    hasRings: true,
  },
  {
    id: "uranus",
    label: "Uranus",
    size: 16,
    orbitR: 316,
    period: +(EARTH_BASE * 84.01).toFixed(2),   // 1344s
    color: "#7de8e8",
    glow: "rgba(125,232,232,0.7)",
    initialAngle: 270,
    moons: [],
  },
  {
    id: "neptune",
    label: "Neptune",
    size: 15,
    orbitR: 356,
    period: +(EARTH_BASE * 164.8).toFixed(2),   // 2636.8s
    color: "#3f54ba",
    glow: "rgba(63,84,186,0.8)",
    initialAngle: 350,
    moons: [],
  },
] as const;

/* ── Star data generated once ── */
const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1.8 + 0.4,
  opacity: Math.random() * 0.6 + 0.2,
  twinkleDelay: Math.random() * 4,
  twinkleDuration: Math.random() * 2 + 1.5,
}));

const DUST = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  opacity: Math.random() * 0.3 + 0.05,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 6,
}));

/* ── Inject CSS keyframes once ── */
function injectKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById("solar-keyframes")) return;
  const style = document.createElement("style");
  style.id = "solar-keyframes";
  style.textContent = `
    @keyframes orbit { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
    @keyframes orbit-rev { from { transform: rotate(360deg) } to { transform: rotate(0deg) } }
    @keyframes planet-spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
    @keyframes twinkle { 0%,100% { opacity: 0.2 } 50% { opacity: 1 } }
    @keyframes dust-float {
      0%   { transform: translate(0,0) scale(1); opacity: 0.15 }
      50%  { transform: translate(6px,-8px) scale(1.2); opacity: 0.35 }
      100% { transform: translate(-4px,4px) scale(0.9); opacity: 0.1 }
    }
    @keyframes sun-pulse {
      0%,100% { box-shadow: 0 0 40px 16px rgba(255,200,50,0.5), 0 0 80px 32px rgba(255,140,0,0.3), 0 0 120px 60px rgba(255,80,0,0.15) }
      50%      { box-shadow: 0 0 55px 22px rgba(255,220,80,0.7), 0 0 100px 45px rgba(255,160,20,0.4), 0 0 160px 80px rgba(255,100,0,0.2) }
    }
    @keyframes sun-corona {
      0%,100% { transform: scale(1); opacity: 0.4 }
      50%      { transform: scale(1.15); opacity: 0.7 }
    }
    @keyframes moon-orbit { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
  `;
  document.head.appendChild(style);
}

export default function SolarSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const animFrameRef = useRef<number>();
  const targetTilt = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });

  useEffect(() => { injectKeyframes(); }, []);

  /* Smooth parallax tilt with lerp */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    targetTilt.current = {
      x: ((e.clientY - cy) / rect.height) * 5,
      y: ((e.clientX - cx) / rect.width) * -5,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetTilt.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      currentTilt.current.x = lerp(currentTilt.current.x, targetTilt.current.x, 0.06);
      currentTilt.current.y = lerp(currentTilt.current.y, targetTilt.current.y, 0.06);
      setTilt({ x: currentTilt.current.x, y: currentTilt.current.y });
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [handleMouseMove, handleMouseLeave]);

  /* Responsive orbit scale */
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 400)       setScale(0.42);
      else if (w < 640)  setScale(0.52);
      else if (w < 768)  setScale(0.65);
      else if (w < 1024) setScale(0.78);
      else               setScale(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const SIZE = 760; // base canvas size in px
  const cx = SIZE / 2;

  return (
    <div
      ref={containerRef}
      className="relative select-none"
      style={{
        width: SIZE * scale,
        height: SIZE * scale,
        flexShrink: 0,
      }}
    >
      {/* Perspective wrapper for tilt */}
      <div
        style={{
          width: SIZE,
          height: SIZE,
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${scale})`,
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          willChange: "transform",
          transition: "transform 0.05s linear",
          position: "relative",
        }}
      >
        {/* ── Stars ── */}
        {STARS.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              background: "white",
              opacity: s.opacity,
              animation: `twinkle ${s.twinkleDuration}s ${s.twinkleDelay}s ease-in-out infinite`,
            }}
          />
        ))}

        {/* ── Floating dust ── */}
        {DUST.map((d) => (
          <div
            key={d.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: d.size,
              height: d.size,
              background: "rgba(180,160,255,0.6)",
              opacity: d.opacity,
              animation: `dust-float ${d.duration}s ${d.delay}s ease-in-out infinite`,
            }}
          />
        ))}

        {/* ── Orbit rings ── */}
        {PLANETS.map((p) => (
          <div
            key={`orbit-${p.id}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: cx - p.orbitR,
              top: cx - p.orbitR,
              width: p.orbitR * 2,
              height: p.orbitR * 2,
              border: hoveredPlanet === p.id
                ? `1px solid rgba(255,255,255,0.35)`
                : `1px solid rgba(255,255,255,0.08)`,
              boxShadow: hoveredPlanet === p.id
                ? `0 0 8px rgba(255,255,255,0.15)`
                : "none",
              transition: "border-color 0.3s, box-shadow 0.3s",
            }}
          />
        ))}

        {/* ── Sun ── */}
        <div
          className="absolute rounded-full"
          style={{
            left: cx - 22,
            top: cx - 22,
            width: 44,
            height: 44,
            background: "radial-gradient(circle at 38% 38%, #fff7a0, #ffd020 30%, #ff8c00 65%, #ff4500 100%)",
            animation: "sun-pulse 3s ease-in-out infinite",
            zIndex: 20,
          }}
        >
          {/* Corona layers */}
          <div className="absolute -inset-3 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,200,50,0.3), transparent 70%)", animation: "sun-corona 3s ease-in-out infinite" }} />
          <div className="absolute -inset-6 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,140,0,0.15), transparent 70%)", animation: "sun-corona 3s 0.5s ease-in-out infinite" }} />
          <div className="absolute -inset-10 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,80,0,0.08), transparent 70%)", animation: "sun-corona 4s 1s ease-in-out infinite" }} />
        </div>

        {/* ── Planets ── */}
        {PLANETS.map((p) => {
          const isHovered = hoveredPlanet === p.id;
          const orbitDuration = `${p.period}s`;

          return (
            /* Orbit arm — rotates around sun */
            <div
              key={p.id}
              className="absolute pointer-events-none"
              style={{
                left: cx,
                top: cx,
                width: 0,
                height: 0,
                animation: `orbit ${orbitDuration} linear infinite`,
                animationDelay: `-${(p.initialAngle / 360) * p.period}s`,
                willChange: "transform",
              }}
            >
              {/* Planet position arm */}
              <div
                className="absolute"
                style={{
                  left: p.orbitR,
                  top: -p.size / 2,
                  pointerEvents: "all",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredPlanet(p.id)}
                onMouseLeave={() => setHoveredPlanet(null)}
              >
                {/* Counter-rotate so label stays upright */}
                <div style={{ animation: `orbit-rev ${orbitDuration} linear infinite`, animationDelay: `-${(p.initialAngle / 360) * p.period}s` }}>

                  {/* Planet body */}
                  <div
                    style={{
                      width: p.size,
                      height: p.size,
                      borderRadius: "50%",
                      background: getPlanetGradient(p.id, p.color),
                      boxShadow: isHovered
                        ? `0 0 ${p.size * 2}px ${p.size}px ${p.glow}, 0 0 ${p.size * 4}px ${p.size * 1.5}px ${p.glow.replace("0.8", "0.3")}`
                        : `0 0 ${p.size}px ${p.size * 0.6}px ${p.glow.replace("0.8", "0.5")}`,
                      transform: isHovered ? "scale(1.35)" : "scale(1)",
                      transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease",
                      willChange: "transform",
                      position: "relative",
                      zIndex: 10,
                      overflow: "hidden",
                    }}
                  >
                    {/* Jupiter stripes */}
                    {"hasStripes" in p && p.hasStripes && (
                      <>
                        {[20, 38, 52, 65, 78].map((y, i) => (
                          <div key={i} className="absolute w-full"
                            style={{
                              top: `${y}%`, height: i % 2 === 0 ? "8%" : "6%",
                              background: i % 2 === 0
                                ? "rgba(160,80,20,0.5)"
                                : "rgba(220,180,100,0.3)",
                            }} />
                        ))}
                        {/* Great Red Spot */}
                        <div className="absolute rounded-full"
                          style={{ width: "28%", height: "18%", background: "rgba(180,50,30,0.7)", top: "52%", left: "55%", transform: "translate(-50%,-50%)" }} />
                      </>
                    )}

                    {/* Earth atmosphere shimmer */}
                    {"hasAtmosphere" in p && p.hasAtmosphere && (
                      <div className="absolute inset-0 rounded-full"
                        style={{ background: "linear-gradient(135deg, rgba(100,200,255,0.4) 0%, transparent 60%)" }} />
                    )}
                  </div>

                  {/* Saturn rings */}
                  {"hasRings" in p && p.hasRings && (
                    <div className="absolute pointer-events-none"
                      style={{
                        left: "50%", top: "50%",
                        width: p.size * 2.8,
                        height: p.size * 0.6,
                        transform: "translate(-50%, -50%) rotateX(70deg)",
                        borderRadius: "50%",
                        border: `${p.size * 0.18}px solid rgba(228,209,145,0.55)`,
                        boxShadow: `0 0 8px rgba(228,209,145,0.3), inset 0 0 6px rgba(228,209,145,0.2)`,
                        zIndex: 5,
                      }}
                    />
                  )}

                  {/* Moon */}
                  {"moons" in p && p.moons.map((moon, mi) => (
                    <div
                      key={mi}
                      className="absolute pointer-events-none"
                      style={{
                        left: p.size / 2,
                        top: p.size / 2,
                        width: 0, height: 0,
                        animation: `moon-orbit ${moon.period}s linear infinite`,
                      }}
                    >
                      <div style={{
                        position: "absolute",
                        left: moon.orbitR,
                        top: -moon.size / 2,
                        width: moon.size,
                        height: moon.size,
                        borderRadius: "50%",
                        background: moon.color,
                        boxShadow: `0 0 4px rgba(200,200,200,0.6)`,
                      }} />
                    </div>
                  ))}

                  {/* Hover label */}
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.15 }}
                      className="absolute text-[9px] font-semibold tracking-wider whitespace-nowrap px-2 py-0.5 rounded-full"
                      style={{
                        top: p.size + 6,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(13,13,21,0.85)",
                        border: "1px solid rgba(212,165,255,0.3)",
                        color: "#D4A5FF",
                        backdropFilter: "blur(8px)",
                        zIndex: 50,
                      }}
                    >
                      {p.label}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Radial depth vignette ── */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, transparent 35%, rgba(13,13,21,0.4) 75%, rgba(13,13,21,0.85) 100%)",
            zIndex: 30,
          }}
        />
      </div>
    </div>
  );
}

/* ── Planet gradient helper ── */
function getPlanetGradient(id: string, base: string): string {
  const g: Record<string, string> = {
    mercury: "radial-gradient(circle at 35% 35%, #d4d4d4, #888 50%, #555 100%)",
    venus:   "radial-gradient(circle at 35% 35%, #f5e6c0, #c9a84c 55%, #8b6914 100%)",
    earth:   "radial-gradient(circle at 35% 35%, #6ec6ff, #2271b5 45%, #1a4a7a 75%, #0d2b4e 100%)",
    mars:    "radial-gradient(circle at 35% 35%, #e87040, #c1440e 55%, #7a2008 100%)",
    jupiter: "radial-gradient(circle at 35% 35%, #f0c070, #c88b3a 45%, #a05a10 100%)",
    saturn:  "radial-gradient(circle at 35% 35%, #f5e8a0, #d4b840 45%, #9a7a10 100%)",
    uranus:  "radial-gradient(circle at 35% 35%, #b0f4f4, #7de8e8 45%, #3aacac 100%)",
    neptune: "radial-gradient(circle at 35% 35%, #6080e0, #3f54ba 50%, #1a2870 100%)",
  };
  return g[id] ?? `radial-gradient(circle at 35% 35%, ${base}, ${base}88)`;
}
