"use client";
import { useEffect, useRef, useCallback } from "react";
import { motion, useDragControls } from "framer-motion";

interface Dot {
  x: number; y: number;   // normalised [-1, 1]
  vx: number; vy: number;
  phase: number;
  speed: number;
  size: number;
  opacity: number;
  gray: number;           // 0=white  0.5=silver  1=dim
}

// ── stripe mask ──────────────────────────────────────────────────────────────
function inStripe(nx: number, ny: number): boolean {
  const proj   = nx * Math.cos(Math.PI / 5.2) + ny * Math.sin(Math.PI / 5.2);
  const period = 0.52, width = 0.16;
  const p = ((proj % period) + period) % period;
  return p < width;
}

// ── Fibonacci sphere sample → flat 2D projection ────────────────────────────
function buildDots(count: number): Dot[] {
  const dots: Dot[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  // oversample so after rejection we land near `count`
  const S = Math.round(count * 1.9);
  for (let i = 0; i < S && dots.length < count; i++) {
    const y  = 1 - (i / (S - 1)) * 2;
    const r  = Math.sqrt(Math.max(0, 1 - y * y));
    const th = phi * i;
    const nx = Math.cos(th) * r;
    if (inStripe(nx, y)) continue;
    const bx = nx  + (Math.random() - 0.5) * 0.028;
    const by = y   + (Math.random() - 0.5) * 0.028;
    if (bx * bx + by * by > 0.97) continue;
    const cr = Math.random();
    dots.push({
      x: bx, y: by, vx: 0, vy: 0,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 1.8,
      size:  0.55 + Math.random() * 1.1,
      opacity: 0.4 + Math.random() * 0.6,
      gray: cr < 0.75 ? 0 : cr < 0.92 ? 0.5 : 1,
    });
  }
  return dots;
}

// ── hook ─────────────────────────────────────────────────────────────────────
function useCanvas(size: number) {
  const ref      = useRef<HTMLCanvasElement>(null);
  const mouse    = useRef<[number, number]>([9999, 9999]);
  const hovering = useRef(false);
  const frameId  = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    const DPR   = Math.min(window.devicePixelRatio || 1, 2);
    const COUNT = window.innerWidth < 768 ? 420 : 1000;

    canvas.width  = size * DPR;
    canvas.height = size * DPR;
    canvas.style.width  = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(DPR, DPR);

    const dots = buildDots(COUNT);
    const cx = size / 2, cy = size / 2;
    const sR = size * 0.44;   // sphere radius

    const toX = (n: number) => cx + n * sR;
    const toY = (n: number) => cy + n * sR;

    // subtle breathing
    const breath = (t: number) =>
      1 + Math.sin(t * 0.55) * 0.012 + Math.sin(t * 0.21) * 0.005;

    const draw = (ts: number) => {
      const t = ts * 0.001;
      ctx.clearRect(0, 0, size, size);

      ctx.save();
      // ── circle clip — ONLY thing visible ──────────────────────────────────
      ctx.beginPath();
      ctx.arc(cx, cy, size / 2 - 0.5, 0, Math.PI * 2);
      ctx.clip();

      // ── NO background fill — fully transparent ────────────────────────────

      const br       = breath(t);
      const [mx, my] = mouse.current;
      const isHover  = hovering.current;

      for (const d of dots) {
        // ── organic drift (3 harmonics) ─────────────────────────────────────
        const amp = 0.35 + d.size * 0.5;
        const ox  = Math.sin(t * d.speed * 0.36 + d.phase * 2.0) * amp
                  + Math.sin(t * d.speed * 0.14 + d.phase * 5.3) * amp * 0.3;
        const oy  = Math.cos(t * d.speed * 0.31 + d.phase * 3.1) * amp
                  + Math.cos(t * d.speed * 0.11 + d.phase * 7.0) * amp * 0.3;

        const bx = d.x * br;
        const by = d.y * br;
        let px = toX(bx) + ox;
        let py = toY(by) + oy;

        // ── mouse / touch interaction (only while hovering) ──────────────────
        if (isHover) {
          const ddx = mx - px, ddy = my - py;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          const R = size * 0.35;
          if (dist < R && dist > 0.5) {
            const str = Math.pow(1 - dist / R, 1.8) * 8;
            d.vx += (ddx / dist) * str * 0.016;
            d.vy += (ddy / dist) * str * 0.016;
          }
        }
        d.vx *= 0.80;
        d.vy *= 0.80;
        px += d.vx;
        py += d.vy;

        // ── brightness shimmer (no flash, no spark) ──────────────────────────
        const shimmer = 0.28 + 0.72 * Math.pow(
          0.5 + 0.5 * Math.sin(t * d.speed * 0.78 + d.phase * 6.28), 2.0
        );

        // ── edge fade ────────────────────────────────────────────────────────
        const dc   = Math.sqrt(bx * bx + by * by);
        const edge = 1 - Math.max(0, Math.min(1, (dc - 0.50) / 0.47));
        if (edge < 0.02) continue;

        // centre density boost
        const centreBoost = Math.max(0, 1 - dc * 1.5);
        const sz = d.size * (1 + centreBoost * 0.4);

        // ── color ────────────────────────────────────────────────────────────
        const bright = shimmer;
        const lum = d.gray === 0
          ? Math.round(bright * 255)
          : d.gray === 0.5
          ? Math.round(bright * 205)
          : Math.round(bright * 100);
        const alpha = (d.opacity * bright * edge).toFixed(3);

        ctx.beginPath();
        ctx.arc(px, py, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${lum},${lum},${lum},${alpha})`;
        ctx.fill();
      }

      // ── sweeping border ring ──────────────────────────────────────────────
      const sw = (t * 0.16) % 1;
      const ctxC = ctx as CanvasRenderingContext2D & {
        createConicGradient?: (a: number, x: number, y: number) => CanvasGradient;
      };
      const ring = ctxC.createConicGradient
        ? (() => {
            const cg = ctxC.createConicGradient!(sw * Math.PI * 2, cx, cy);
            cg.addColorStop(0,    "rgba(255,255,255,0)");
            cg.addColorStop(0.07, "rgba(255,255,255,0.28)");
            cg.addColorStop(0.14, "rgba(255,255,255,0)");
            cg.addColorStop(1,    "rgba(255,255,255,0)");
            return cg;
          })()
        : (() => {
            const lg = ctx.createLinearGradient(0, 0, size, size);
            lg.addColorStop(Math.max(0, sw - 0.1), "rgba(255,255,255,0)");
            lg.addColorStop(sw,                     "rgba(255,255,255,0.22)");
            lg.addColorStop(Math.min(1, sw + 0.1),  "rgba(255,255,255,0)");
            return lg;
          })();

      ctx.strokeStyle = ring;
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, size / 2 - 1, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
      frameId.current = requestAnimationFrame(draw);
    };

    frameId.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId.current);
  }, [size]);

  const onMouseMove  = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (r) mouse.current = [e.clientX - r.left, e.clientY - r.top];
  }, []);

  const onTouchMove  = useCallback((e: React.TouchEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const t = e.touches[0];
    mouse.current = [t.clientX - r.left, t.clientY - r.top];
  }, []);

  const onEnter = useCallback(() => { hovering.current = true;  }, []);
  const onLeave = useCallback(() => {
    hovering.current = false;
    mouse.current    = [9999, 9999];
  }, []);

  return { ref, onMouseMove, onTouchMove, onEnter, onLeave };
}

// ── component ─────────────────────────────────────────────────────────────────
export default function LinearLogo({ size = 220 }: { size?: number }) {
  const drag = useDragControls();
  const { ref, onMouseMove, onTouchMove, onEnter, onLeave } = useCanvas(size);

  return (
    <motion.div
      drag
      dragControls={drag}
      dragMomentum={false}        // fixed where released
      dragElastic={0}
      whileDrag={{ scale: 1.03 }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: size, height: size,
        borderRadius: "50%",
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
        flexShrink: 0,
        position: "relative",
        zIndex: 10,
      }}
      onPointerDown={(e) => drag.start(e)}
    >
      <canvas
        ref={ref}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onTouchStart={onEnter}
        onTouchEnd={onLeave}
        style={{ display: "block", borderRadius: "50%", width: size, height: size }}
      />
    </motion.div>
  );
}
