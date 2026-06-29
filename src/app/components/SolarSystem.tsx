"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────
   PLANET DATA — compact HUD scale
   Container = 360px. Neptune fits at r=155px.
   Real Kepler periods preserved (Earth = 16s).
───────────────────────────────────────────── */
const EARTH_BASE = 16;

const PLANETS = [
  {
    id: "mercury", label: "Mercury",
    size: 4, orbitR: 28,
    period: +(EARTH_BASE * 0.241).toFixed(2),
    color: "#b5b5b5", glow: "rgba(181,181,181,0.9)",
    initialAngle: 20, moons: [],
  },
  {
    id: "venus", label: "Venus",
    size: 5, orbitR: 44,
    period: +(EARTH_BASE * 0.615).toFixed(2),
    color: "#e8cda0", glow: "rgba(232,205,160,0.9)",
    initialAngle: 110, moons: [],
  },
  {
    id: "earth", label: "Earth",
    size: 5, orbitR: 60,
    period: EARTH_BASE,
    color: "#4fa3e0", glow: "rgba(79,163,224,1)",
    initialAngle: 200,
    moons: [{ size: 2, orbitR: 9, period: 1.2, color: "#c8c8c8" }],
    hasAtmosphere: true,
  },
  {
    id: "mars", label: "Mars",
    size: 4, orbitR: 78,
    period: +(EARTH_BASE * 1.881).toFixed(2),
    color: "#c1440e", glow: "rgba(193,68,14,0.9)",
    initialAngle: 300, moons: [],
  },
  {
    id: "jupiter", label: "Jupiter",
    size: 10, orbitR: 102,
    period: +(EARTH_BASE * 11.86).toFixed(2),
    color: "#c88b3a", glow: "rgba(200,139,58,0.8)",
    initialAngle: 45, moons: [], hasStripes: true,
  },
  {
    id: "saturn", label: "Saturn",
    size: 9, orbitR: 120,
    period: +(EARTH_BASE * 29.46).toFixed(2),
    color: "#e4d191", glow: "rgba(228,209,145,0.8)",
    initialAngle: 160, moons: [], hasRings: true,
  },
  {
    id: "uranus", label: "Uranus",
    size: 7, orbitR: 137,
    period: +(EARTH_BASE * 84.01).toFixed(2),
    color: "#7de8e8", glow: "rgba(125,232,232,0.8)",
    initialAngle: 270, moons: [],
  },
  {
    id: "neptune", label: "Neptune",
    size: 7, orbitR: 153,
    period: +(EARTH_BASE * 164.8).toFixed(2),
    color: "#3f54ba", glow: "rgba(63,84,186,0.9)",
    initialAngle: 350, moons: [],
  },
] as const;

/* ── Star data generated once ── */
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1.2 + 0.3,
  opacity: Math.random() * 0.5 + 0.15,
  twinkleDelay: Math.random() * 4,
  twinkleDuration: Math.random() * 2 + 1.5,
}));

const DUST = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1.5 + 0.5,
  opacity: Math.random() * 0.2 + 0.04,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 6,
}));

/* ── Asteroid belt (between Mars r=78 and Jupiter r=102) ── */
const ASTEROIDS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  r: 88 + Math.random() * 10,
  angle: (i / 28) * 360 + Math.random() * 8,
  size: Math.random() * 1.2 + 0.4,
  opacity: Math.random() * 0.35 + 0.1,
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
    @keyframes sun-corona {
      0%,100% { transform: scale(1); opacity: 0.4 }
      50%      { transform: scale(1.15); opacity: 0.7 }
    }
    @keyframes moon-orbit { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
    @keyframes radar-sweep { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
    @keyframes energy-pulse {
      0%   { transform: scale(0.5); opacity: 0.8 }
      80%  { transform: scale(4);   opacity: 0 }
      100% { transform: scale(4);   opacity: 0 }
    }
    @keyframes orbit-particle {
      from { transform: rotate(0deg) }
      to   { transform: rotate(360deg) }
    }
    @keyframes hud-blink { 0%,100% { opacity:1 } 50% { opacity:0.3 } }
    @keyframes sun-pulse {
      0%,100% { box-shadow: 0 0 10px 4px rgba(255,200,50,0.8), 0 0 22px 8px rgba(255,140,0,0.4), 0 0 40px 16px rgba(255,80,0,0.15) }
      50%      { box-shadow: 0 0 14px 6px rgba(255,220,80,1),   0 0 30px 12px rgba(255,160,20,0.5), 0 0 55px 22px rgba(255,100,0,0.2) }
    }
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
      if (w < 400)       setScale(0.7);
      else if (w < 640)  setScale(0.82);
      else if (w < 768)  setScale(0.9);
      else               setScale(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const SIZE = 360;
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

        {/* ── Orbit rings with glow ── */}
        {PLANETS.map((p) => (
          <div key={`orbit-${p.id}`} className="absolute rounded-full pointer-events-none"
            style={{
              left: cx - p.orbitR, top: cx - p.orbitR,
              width: p.orbitR * 2, height: p.orbitR * 2,
              border: hoveredPlanet === p.id
                ? "1px solid rgba(0,229,204,0.4)"
                : "1px solid rgba(255,255,255,0.07)",
              boxShadow: hoveredPlanet === p.id
                ? `0 0 6px rgba(0,229,204,0.15)`
                : "none",
              transition: "border-color 0.3s, box-shadow 0.3s",
            }}
          />
        ))}

        {/* ── Orbit particle dots (one bright dot per orbit) ── */}
        {PLANETS.map((p) => (
          <div key={`particle-${p.id}`} className="absolute pointer-events-none"
            style={{
              left: cx, top: cx,
              width: 0, height: 0,
              animation: `orbit ${p.period * 0.7}s linear infinite`,
              animationDelay: `-${(p.initialAngle / 360) * p.period * 0.7}s`,
              willChange: "transform",
              zIndex: 1,
            }}
          >
            <div style={{
              position: "absolute",
              left: p.orbitR - 1, top: -1,
              width: 2, height: 2,
              borderRadius: "50%",
              background: p.color,
              opacity: 0.6,
              boxShadow: `0 0 3px 1px ${p.glow}`,
            }} />
          </div>
        ))}

        {/* ── Sun ── */}
        <div
          className="absolute rounded-full"
          style={{
            left: cx - 10,
            top: cx - 10,
            width: 20,
            height: 20,
            background: "radial-gradient(circle at 38% 38%, #fff7a0, #ffd020 30%, #ff8c00 65%, #ff4500 100%)",
            animation: "sun-pulse 3s ease-in-out infinite",
            zIndex: 20,
          }}
        >
          <div className="absolute -inset-2 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,200,50,0.35), transparent 70%)", animation: "sun-corona 3s ease-in-out infinite" }} />
          <div className="absolute -inset-4 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,140,0,0.15), transparent 70%)", animation: "sun-corona 3s 0.5s ease-in-out infinite" }} />
          <div className="absolute -inset-7 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,80,0,0.07), transparent 70%)", animation: "sun-corona 4s 1s ease-in-out infinite" }} />

          {/* Chromatic aberration */}
          <div className="absolute rounded-full pointer-events-none"
            style={{ inset: -1, border: "1px solid rgba(255,0,80,0.22)", borderRadius: "50%", transform: "translate(0.6px,0)" }} />
          <div className="absolute rounded-full pointer-events-none"
            style={{ inset: -1, border: "1px solid rgba(0,200,255,0.18)", borderRadius: "50%", transform: "translate(-0.6px,0)" }} />
        </div>

        {/* ── Energy pulse rings (staggered every 9s) ── */}
        {[0, 3, 6].map((delay) => (
          <div key={delay} className="absolute rounded-full pointer-events-none"
            style={{
              left: cx - 10, top: cx - 10,
              width: 20, height: 20,
              border: "1px solid rgba(255,180,0,0.6)",
              animation: `energy-pulse 9s ${delay}s ease-out infinite`,
              zIndex: 19,
            }}
          />
        ))}

        {/* ── Lens flare streak ── */}
        <div className="absolute pointer-events-none"
          style={{
            left: cx - 40, top: cx - 1,
            width: 80, height: 2,
            background: "linear-gradient(to right, transparent, rgba(255,230,100,0.1), rgba(255,255,200,0.22), rgba(255,230,100,0.1), transparent)",
            filter: "blur(0.5px)",
            zIndex: 21,
          }}
        />

        {/* ── Asteroid belt (Mars r=78 → Jupiter r=102) ── */}
        {ASTEROIDS.map((a) => {
          const rad = (a.angle * Math.PI) / 180;
          return (
            <div
              key={a.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: cx + a.r * Math.cos(rad) - a.size / 2,
                top:  cx + a.r * Math.sin(rad) - a.size / 2,
                width: a.size, height: a.size,
                background: "rgba(160,140,120,0.7)",
                opacity: a.opacity,
                boxShadow: "0 0 2px rgba(200,180,140,0.4)",
              }}
            />
          );
        })}

        {/* ── HUD outer ring with tick marks ── */}
        <div className="absolute rounded-full pointer-events-none"
          style={{
            left: 4, top: 4,
            width: SIZE - 8, height: SIZE - 8,
            border: "1px solid rgba(0,229,204,0.12)",
          }}
        />
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i / 36) * 360;
          const isMain = i % 9 === 0;
          const isMed  = i % 3 === 0;
          const rad = (angle * Math.PI) / 180;
          const r = SIZE / 2 - 4;
          const len = isMain ? 8 : isMed ? 5 : 3;
          const x1 = cx + r * Math.cos(rad);
          const y1 = cx + r * Math.sin(rad);
          const x2 = cx + (r - len) * Math.cos(rad);
          const y2 = cx + (r - len) * Math.sin(rad);
          return (
            <svg key={i} className="absolute inset-0 pointer-events-none"
              width={SIZE} height={SIZE} style={{ overflow: "visible" }}>
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isMain ? "rgba(0,229,204,0.5)" : "rgba(0,229,204,0.2)"}
                strokeWidth={isMain ? 1.2 : 0.7} />
            </svg>
          );
        })}

        {/* ── Degree labels at cardinal points ── */}
        {[{ a: 0, l: "0°" }, { a: 90, l: "90°" }, { a: 180, l: "180°" }, { a: 270, l: "270°" }].map(({ a, l }) => {
          const rad = (a * Math.PI) / 180;
          const r = SIZE / 2 - 16;
          return (
            <div key={a} className="absolute pointer-events-none"
              style={{
                left: cx + r * Math.cos(rad),
                top:  cx + r * Math.sin(rad),
                transform: "translate(-50%,-50%)",
                fontSize: 7,
                fontFamily: "monospace",
                color: "rgba(0,229,204,0.45)",
                letterSpacing: "0.05em",
              }}
            >{l}</div>
          );
        })}

        {/* ── Radar sweep ── */}
        <div className="absolute pointer-events-none"
          style={{
            left: cx, top: cx,
            width: 0, height: 0,
            animation: "radar-sweep 6s linear infinite",
            willChange: "transform",
            zIndex: 2,
          }}
        >
          <div style={{
            position: "absolute",
            top: -(SIZE / 2 - 10),
            left: -1,
            width: 2,
            height: SIZE / 2 - 10,
            background: "linear-gradient(to top, rgba(0,229,204,0.55), transparent)",
            transformOrigin: "bottom center",
          }} />
          {/* Sweep arc fade */}
          <div style={{
            position: "absolute",
            top: -(SIZE / 2 - 10),
            left: -(SIZE / 2 - 10),
            width: (SIZE / 2 - 10) * 2,
            height: (SIZE / 2 - 10) * 2,
            borderRadius: "50%",
            background: "conic-gradient(from -15deg, transparent 0deg, rgba(0,229,204,0.07) 15deg, transparent 25deg)",
            pointerEvents: "none",
          }} />
        </div>

        {/* ── Crosshair at center ── */}
        <svg className="absolute inset-0 pointer-events-none" width={SIZE} height={SIZE}>
          <line x1={cx - 14} y1={cx} x2={cx - 6} y2={cx} stroke="rgba(0,229,204,0.3)" strokeWidth="0.8" />
          <line x1={cx + 6}  y1={cx} x2={cx + 14} y2={cx} stroke="rgba(0,229,204,0.3)" strokeWidth="0.8" />
          <line x1={cx} y1={cx - 14} x2={cx} y2={cx - 6} stroke="rgba(0,229,204,0.3)" strokeWidth="0.8" />
          <line x1={cx} y1={cx + 6}  x2={cx} y2={cx + 14} stroke="rgba(0,229,204,0.3)" strokeWidth="0.8" />
          <circle cx={cx} cy={cx} r="3" fill="none" stroke="rgba(0,229,204,0.25)" strokeWidth="0.8" />
        </svg>

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
