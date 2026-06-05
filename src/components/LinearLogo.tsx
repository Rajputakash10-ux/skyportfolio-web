"use client";
import { useEffect, useRef, useCallback } from "react";
import { motion, useDragControls } from "framer-motion";

interface Dot {
  x: number; y: number;         // normalised [-1,1]
  phase: number;
  speed: number;
  baseSize: number;
  brightness: number;
  flashTimer: number;
  flashDur: number;
  flashing: boolean;
  gray: number;                  // 0=white 0.5=silver 1=dim
  // velocity for mouse interaction
  vx: number; vy: number;
}

// ── simplex-ish 2D hash noise (cheap, no import) ────────────────────────────
function noise2(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

// ── stripe mask: 3 diagonal bands ───────────────────────────────────────────
function inStripe(nx: number, ny: number): boolean {
  const cosA = Math.cos(Math.PI / 5.2);
  const sinA = Math.sin(Math.PI / 5.2);
  const proj = nx * cosA + ny * sinA;
  const period = 0.52, width = 0.155;
  const p = ((proj % period) + period) % period;
  return p < width;
}

// ── build sphere dots via Fibonacci lattice ──────────────────────────────────
function buildDots(S: number): Dot[] {
  const dots: Dot[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < S; i++) {
    const y  = 1 - (i / (S - 1)) * 2;
    const r  = Math.sqrt(Math.max(0, 1 - y * y));
    const th = phi * i;
    const nx = Math.cos(th) * r;
    if (inStripe(nx, y)) continue;
    const jx = (Math.random() - 0.5) * 0.032;
    const jy = (Math.random() - 0.5) * 0.032;
    const bx = nx + jx, by = y + jy;
    if (bx * bx + by * by > 0.97) continue;
    const cr = Math.random();
    // density: more dots near centre — accept/reject by distance
    const distC = Math.sqrt(bx * bx + by * by);
    if (distC > 0.5 && Math.random() > 1.2 - distC) continue;
    dots.push({
      x: bx, y: by, vx: 0, vy: 0,
      phase: Math.random() * Math.PI * 2,
      speed: 0.35 + Math.random() * 2.4,
      baseSize: 0.7 + Math.random() * 1.6,
      brightness: 0.45 + Math.random() * 0.55,
      flashTimer: Math.random() * 10,
      flashDur: 0.35 + Math.random() * 1.1,
      flashing: false,
      gray: cr < 0.78 ? 0 : cr < 0.93 ? 0.5 : 1,
    });
  }
  return dots;
}

// ── background scatter dots (behind sphere, inside circle) ──────────────────
function buildBg(N: number): Dot[] {
  const dots: Dot[] = [];
  for (let i = 0; i < N; i++) {
    // polar placement so density is even inside circle
    const angle = Math.random() * Math.PI * 2;
    const rad   = Math.sqrt(Math.random()) * 0.97;
    dots.push({
      x: Math.cos(angle) * rad,
      y: Math.sin(angle) * rad,
      vx: 0, vy: 0,
      phase: Math.random() * Math.PI * 2,
      speed: 0.1 + Math.random() * 0.45,
      baseSize: 0.3 + Math.random() * 0.55,
      brightness: 0.05 + Math.random() * 0.1,
      flashTimer: Math.random() * 15,
      flashDur: 1.5 + Math.random() * 2.5,
      flashing: false,
      gray: 1,
    });
  }
  return dots;
}

// ── draw 4+6 point star spark ────────────────────────────────────────────────
function drawSpark(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  r: number, intensity: number,
) {
  // glow halo
  const grd = ctx.createRadialGradient(px, py, 0, px, py, r * 5);
  grd.addColorStop(0,   `rgba(255,255,255,${(intensity * 0.55).toFixed(3)})`);
  grd.addColorStop(0.4, `rgba(220,235,255,${(intensity * 0.22).toFixed(3)})`);
  grd.addColorStop(1,   "rgba(180,210,255,0)");
  ctx.beginPath();
  ctx.arc(px, py, r * 5, 0, Math.PI * 2);
  ctx.fillStyle = grd;
  ctx.fill();

  // 4-point long spikes
  ctx.save();
  ctx.translate(px, py);
  ctx.globalAlpha = intensity * 0.75;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth   = 0.6;
  ctx.lineCap     = "round";
  const arms4 = [[r * 7, 0], [0, r * 7], [-r * 7, 0], [0, -r * 7]];
  for (const [ex, ey] of arms4) {
    const g = ctx.createLinearGradient(0, 0, ex, ey);
    g.addColorStop(0,   "rgba(255,255,255,1)");
    g.addColorStop(1,   "rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = g;
    ctx.stroke();
  }
  // 6-point short spikes (rotated 30°)
  ctx.globalAlpha = intensity * 0.35;
  ctx.lineWidth   = 0.4;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
    const ex = Math.cos(a + Math.PI / 6) * r * 4;
    const ey = Math.sin(a + Math.PI / 6) * r * 4;
    const g2 = ctx.createLinearGradient(0, 0, ex, ey);
    g2.addColorStop(0, "rgba(200,220,255,1)");
    g2.addColorStop(1, "rgba(200,220,255,0)");
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = g2;
    ctx.stroke();
  }
  ctx.restore();
}

// ── main hook ────────────────────────────────────────────────────────────────
function useLinearCanvas(size: number) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const mouse      = useRef<[number, number]>([9999, 9999]);
  const frameRef   = useRef(0);
  const hoverRef   = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    const DPR    = Math.min(window.devicePixelRatio || 1, 2);
    const isMob  = size < 200;
    const SPHERE = isMob ? 3500  : 12000;
    const BG     = isMob ?  400  :  1000;

    canvas.width  = size * DPR;
    canvas.height = size * DPR;
    canvas.style.width  = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(DPR, DPR);

    const dots   = buildDots(SPHERE);
    const bgDots = buildBg(BG);
    const cx     = size / 2;
    const cy     = size / 2;
    const sR     = size * 0.46;   // sphere radius — fills most of circle
    let   t      = 0;

    const toX = (n: number) => cx + n * sR;
    const toY = (n: number) => cy + n * sR;

    // Breathing: triple-frequency
    const breath = (time: number) =>
      1 + Math.sin(time * 0.58) * 0.013
        + Math.sin(time * 0.22) * 0.006
        + Math.sin(time * 0.09) * 0.003;

    // ── circle clip ─────────────────────────────────────────────────────────
    const clipCircle = () => {
      ctx.beginPath();
      ctx.arc(cx, cy, size / 2 - 0.5, 0, Math.PI * 2);
      ctx.clip();
    };

    const draw = (ts: number) => {
      t = ts * 0.001;

      // fully transparent every frame — shows hero bg through
      ctx.clearRect(0, 0, size, size);

      ctx.save();
      clipCircle();

      // ── translucent dark fill so dots read on light bg ───────────────────
      const hover  = hoverRef.current;
      const alpha  = hover ? 0.72 : 0.88;   // more transparent on hover
      ctx.fillStyle = `rgba(0,0,0,${alpha})`;
      ctx.fillRect(0, 0, size, size);

      // subtle radial: slightly lighter in centre
      const radGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, sR);
      radGrd.addColorStop(0,   "rgba(30,30,35,0.18)");
      radGrd.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = radGrd;
      ctx.fillRect(0, 0, size, size);

      const br = breath(t);
      const [mx, my] = mouse.current;

      // ── background ambient dots ──────────────────────────────────────────
      for (const d of bgDots) {
        const px = toX(d.x + Math.sin(t * d.speed * 0.28 + d.phase) * 0.04);
        const py = toY(d.y + Math.cos(t * d.speed * 0.22 + d.phase * 1.4) * 0.04);
        const fl = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * d.speed * 2.2 + d.phase * 5));
        ctx.beginPath();
        ctx.arc(px, py, d.baseSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${(d.brightness * fl).toFixed(3)})`;
        ctx.fill();
      }

      // ── sphere dots ──────────────────────────────────────────────────────
      for (const d of dots) {
        // ── flash timer ──────────────────────────────────────────────────
        d.flashTimer += 0.016 * d.speed;
        if (!d.flashing && d.flashTimer > 4 + noise2(d.x, d.y) * 8) {
          d.flashing   = true;
          d.flashTimer = 0;
        }
        let flashBoost = 0;
        if (d.flashing) {
          const fp = Math.min(1, d.flashTimer / d.flashDur);
          flashBoost = fp < 0.5 ? fp * 2 : 2 - fp * 2;
          if (d.flashTimer >= d.flashDur) { d.flashing = false; d.flashTimer = 0; }
        }

        // ── organic multi-freq drift ──────────────────────────────────────
        const amp  = 0.45 + d.baseSize * 0.7;
        const dx   = Math.sin(t * d.speed * 0.38 + d.phase * 2.1) * amp
                   + Math.sin(t * d.speed * 0.16 + d.phase * 5.7) * amp * 0.35
                   + Math.cos(t * d.speed * 0.09 + d.phase * 9.1) * amp * 0.15;
        const dy   = Math.cos(t * d.speed * 0.34 + d.phase * 3.3) * amp
                   + Math.cos(t * d.speed * 0.14 + d.phase * 7.2) * amp * 0.35
                   + Math.sin(t * d.speed * 0.07 + d.phase * 11.) * amp * 0.15;

        const bx = d.x * br;
        const by = d.y * br;
        let px = toX(bx) + dx;
        let py = toY(by) + dy;

        // ── mouse interaction: attract toward cursor ──────────────────────
        const mdx = mx - px;
        const mdy = my - py;
        const md  = Math.sqrt(mdx * mdx + mdy * mdy);
        const mRadius = size * 0.38;
        if (md < mRadius && md > 1) {
          // attraction (pull toward cursor)
          const str = Math.pow(1 - md / mRadius, 1.6) * 9;
          d.vx += (mdx / md) * str * 0.016;
          d.vy += (mdy / md) * str * 0.016;
        }
        // dampen + apply velocity
        d.vx *= 0.82;
        d.vy *= 0.82;
        px += d.vx;
        py += d.vy;

        // ── sparkle brightness ────────────────────────────────────────────
        const sp     = Math.pow(0.5 + 0.5 * Math.sin(t * d.speed * 0.82 + d.phase * 6.28), 2.4);
        const bright = Math.min(1, 0.3 + 0.7 * sp + flashBoost * 0.75);

        // ── edge + depth fade ─────────────────────────────────────────────
        const distC = Math.sqrt(bx * bx + by * by);
        const edge  = 1 - Math.max(0, Math.min(1, (distC - 0.52) / 0.48));
        if (edge <= 0.01) continue;

        // centre bloom: dots near centre slightly larger
        const centreBoost = Math.max(0, 1 - distC * 1.4);
        const sz = d.baseSize * (1 + centreBoost * 0.5) * (1 + flashBoost * 0.6);

        // ── color ─────────────────────────────────────────────────────────
        const lum = d.gray === 0
          ? Math.round(bright * 255)
          : d.gray === 0.5
          ? Math.round(bright * 210)
          : Math.round(bright * 105);
        const a = (bright * edge * 0.96).toFixed(3);

        // dot body
        ctx.beginPath();
        ctx.arc(px, py, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${lum},${lum},${lum},${a})`;
        ctx.fill();

        // ── spark effect ──────────────────────────────────────────────────
        if (flashBoost > 0.55 && sz > 1.1) {
          drawSpark(ctx, px, py, sz, flashBoost * edge);
        }

        // ── micro glow on all bright dots ─────────────────────────────────
        if (bright > 0.75 && edge > 0.4) {
          const gr = ctx.createRadialGradient(px, py, 0, px, py, sz * 2.8);
          gr.addColorStop(0,   `rgba(255,255,255,${(bright * 0.18 * edge).toFixed(3)})`);
          gr.addColorStop(1,   "rgba(255,255,255,0)");
          ctx.beginPath();
          ctx.arc(px, py, sz * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = gr;
          ctx.fill();
        }
      }

      // ── circle border ring ────────────────────────────────────────────────
      const shimmer = (t * 0.18) % 1;
      // conic gradient for sweeping shimmer, linear as fallback
      const ctxConic = ctx as CanvasRenderingContext2D & {
        createConicGradient?: (a: number, x: number, y: number) => CanvasGradient;
      };
      const bGrd = ctxConic.createConicGradient
        ? (() => {
            const cg = ctxConic.createConicGradient!(shimmer * Math.PI * 2, cx, cy);
            cg.addColorStop(0,    "rgba(255,255,255,0.0)");
            cg.addColorStop(0.08, "rgba(255,255,255,0.35)");
            cg.addColorStop(0.16, "rgba(255,255,255,0.0)");
            cg.addColorStop(1,    "rgba(255,255,255,0.0)");
            return cg;
          })()
        : (() => {
            const lg = ctx.createLinearGradient(0, 0, size, size);
            lg.addColorStop(Math.max(0, shimmer - 0.12), "rgba(255,255,255,0)");
            lg.addColorStop(shimmer,                      "rgba(255,255,255,0.28)");
            lg.addColorStop(Math.min(1, shimmer + 0.12), "rgba(255,255,255,0)");
            return lg;
          })();

      ctx.strokeStyle = bGrd;
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, size / 2 - 1, 0, Math.PI * 2);
      ctx.stroke();

      // inner subtle ring
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth   = 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, size / 2 - 3, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [size]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return;
    mouse.current = [e.clientX - r.left, e.clientY - r.top];
  }, []);

  const onMouseEnter = useCallback(() => { hoverRef.current = true;  }, []);
  const onMouseLeave = useCallback(() => {
    hoverRef.current = false;
    mouse.current    = [9999, 9999];
  }, []);

  return { canvasRef, onMouseMove, onMouseEnter, onMouseLeave };
}

// ── exported component ────────────────────────────────────────────────────────
export default function LinearLogo({ size = 280 }: { size?: number }) {
  const dragControls = useDragControls();
  const { canvasRef, onMouseMove, onMouseEnter, onMouseLeave } = useLinearCanvas(size);

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragMomentum
      dragElastic={0.1}
      dragTransition={{ power: 0.15, timeConstant: 200 }}
      whileDrag={{ scale: 1.04, cursor: "grabbing" }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: size, height: size,
        borderRadius: "50%",
        position: "relative",
        userSelect: "none",
        cursor: "grab",
        touchAction: "none",
        zIndex: 10,
        flexShrink: 0,
        filter: "drop-shadow(0 0 32px rgba(255,255,255,0.08)) drop-shadow(0 20px 48px rgba(0,0,0,0.4))",
      }}
      onPointerDown={(e) => dragControls.start(e)}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          display: "block",
          borderRadius: "50%",
          width: size,
          height: size,
        }}
      />
    </motion.div>
  );
}
