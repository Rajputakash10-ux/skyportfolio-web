"use client";
import { useEffect, useRef, useCallback } from "react";
import { motion, useDragControls } from "framer-motion";

interface Dot {
  x: number; y: number;       // base position (logo-local, 0–1)
  px: number; py: number;     // current canvas pixel position
  phase: number;
  speed: number;
  size: number;
  brightness: number;         // 0–1
  flashTimer: number;
  flashDuration: number;
  isFlashing: boolean;
  gray: number;               // 0=white, 0.5=light-gray, 1=dark-gray
}

// ── Stripe mask: 3 diagonal cutouts at ~34° ─────────────────────────────────
function inStripe(nx: number, ny: number): boolean {
  // nx, ny in [-1, 1] (normalised sphere coords)
  const angle = Math.PI / 5.2;
  const proj  = nx * Math.cos(angle) + ny * Math.sin(angle);
  const period = 0.52;
  const width  = 0.16;
  const p = ((proj % period) + period) % period;
  return p < width;
}

// ── Fibonacci sphere surface sample ─────────────────────────────────────────
function buildDots(S: number): Dot[] {
  const dots: Dot[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < S; i++) {
    const y   = 1 - (i / (S - 1)) * 2;
    const r   = Math.sqrt(Math.max(0, 1 - y * y));
    const th  = phi * i;
    const nx  = Math.cos(th) * r;
    const nz  = Math.sin(th) * r;
    if (inStripe(nx, y)) continue;
    // Project to 2D — use nx, y as logo coords
    const jx = (Math.random() - 0.5) * 0.04;
    const jy = (Math.random() - 0.5) * 0.04;
    const bx = nx + jx;
    const by = y  + jy;
    // edge falloff — skip dots too far from circle
    if (bx * bx + by * by > 0.98) continue;
    const cr = Math.random();
    dots.push({
      x: bx, y: by,
      px: 0, py: 0,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 2.2,
      size:  0.8 + Math.random() * 1.4,
      brightness: 0.5 + Math.random() * 0.5,
      flashTimer: Math.random() * 8,
      flashDuration: 0.4 + Math.random() * 1.2,
      isFlashing: false,
      gray: cr < 0.78 ? 0 : cr < 0.93 ? 0.5 : 1,
    });
    void nz; // suppress unused warning
  }
  return dots;
}

// ── Background dots inside black square ─────────────────────────────────────
function buildBgDots(N: number): Dot[] {
  const dots: Dot[] = [];
  for (let i = 0; i < N; i++) {
    dots.push({
      x: (Math.random() - 0.5) * 1.9,
      y: (Math.random() - 0.5) * 1.9,
      px: 0, py: 0,
      phase: Math.random() * Math.PI * 2,
      speed: 0.15 + Math.random() * 0.6,
      size:  0.4 + Math.random() * 0.7,
      brightness: 0.08 + Math.random() * 0.15,
      flashTimer: Math.random() * 12,
      flashDuration: 1 + Math.random() * 2,
      isFlashing: false,
      gray: 1,
    });
  }
  return dots;
}

function useLinearCanvas(size: number) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse     = useRef<[number, number]>([9999, 9999]);
  const frameRef  = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const DPR    = Math.min(window.devicePixelRatio || 1, 2);
    const isMob  = size < 200;
    const SPHERE = isMob ? 2800 : 7000;
    const BG     = isMob ?  300 :  800;

    canvas.width  = size * DPR;
    canvas.height = size * DPR;
    canvas.style.width  = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(DPR, DPR);

    const dots   = buildDots(SPHERE);
    const bgDots = buildBgDots(BG);
    const radius = size * 0.108;
    const cx     = size / 2;
    const cy     = size / 2;
    const sR     = size * 0.36; // sphere radius in px
    let   t      = 0;

    // ── map logo-local [-1,1] → canvas px ──────────────────────────────────
    const toX = (n: number) => cx + n * sR;
    const toY = (n: number) => cy + n * sR;

    // ── rounded rect clip path ──────────────────────────────────────────────
    const clipRounded = () => {
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, radius);
      ctx.clip();
    };

    // ── breathing scale ─────────────────────────────────────────────────────
    const breath = (time: number) =>
      1 + Math.sin(time * 0.58) * 0.013
        + Math.sin(time * 0.22) * 0.006;

    const draw = (ts: number) => {
      t = ts * 0.001;
      ctx.clearRect(0, 0, size, size);

      ctx.save();
      clipRounded();

      // ── black background ─────────────────────────────────────────────────
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, size, size);

      const br = breath(t);
      const [mx, my] = mouse.current;

      // ── background dots ──────────────────────────────────────────────────
      for (const d of bgDots) {
        const driftX = Math.sin(t * d.speed * 0.3 + d.phase) * 2.5;
        const driftY = Math.cos(t * d.speed * 0.25 + d.phase * 1.3) * 2.5;
        const px = toX(d.x) + driftX;
        const py = toY(d.y) + driftY;
        // only draw inside square
        if (px < 0 || px > size || py < 0 || py > size) continue;

        const flicker = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * d.speed * 2.5 + d.phase * 5));
        const a = d.brightness * flicker;
        ctx.beginPath();
        ctx.arc(px, py, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
        ctx.fill();
      }

      // ── sphere dots ──────────────────────────────────────────────────────
      for (const d of dots) {
        // flash timer
        d.flashTimer += 0.016 * d.speed;
        if (!d.isFlashing && d.flashTimer > 6 + Math.random() * 6) {
          d.isFlashing  = true;
          d.flashTimer  = 0;
        }
        const flashProgress = d.isFlashing
          ? Math.min(1, d.flashTimer / d.flashDuration)
          : 0;
        if (d.isFlashing && d.flashTimer >= d.flashDuration) {
          d.isFlashing = false;
          d.flashTimer = 0;
        }
        const flashBoost = flashProgress < 0.5
          ? flashProgress * 2
          : 2 - flashProgress * 2;

        // organic noise drift (0.5–3px)
        const dAmp   = 0.5 + d.size * 0.8;
        const driftX = Math.sin(t * d.speed * 0.4  + d.phase * 2.1) * dAmp
                     + Math.sin(t * d.speed * 0.17 + d.phase * 5.3) * dAmp * 0.4;
        const driftY = Math.cos(t * d.speed * 0.35 + d.phase * 3.3) * dAmp
                     + Math.cos(t * d.speed * 0.13 + d.phase * 7.1) * dAmp * 0.4;

        const bx = d.x * br;
        const by = d.y * br;

        let px = toX(bx) + driftX;
        let py = toY(by) + driftY;

        // mouse subtle push
        const mdx = px - mx;
        const mdy = py - my;
        const md  = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < size * 0.22 && md > 0.5) {
          const str = (1 - md / (size * 0.22)) * 4;
          px += (mdx / md) * str;
          py += (mdy / md) * str;
        }

        // sparkle brightness
        const sparkle = 0.3 + 0.7 * Math.pow(0.5 + 0.5 * Math.sin(
          t * d.speed * 0.85 + d.phase * 6.28
        ), 2.2);
        const bright = Math.min(1, sparkle + flashBoost * 0.7);

        // edge fade
        const dist = Math.sqrt(bx * bx + by * by);
        const edge = 1 - Math.max(0, Math.min(1, (dist - 0.55) / 0.5));
        if (edge <= 0) continue;

        // color
        const shade = d.gray === 0
          ? `${Math.round(bright * 255)},${Math.round(bright * 255)},${Math.round(bright * 255)}`
          : d.gray === 0.5
          ? `${Math.round(bright * 217)},${Math.round(bright * 217)},${Math.round(bright * 217)}`
          : `${Math.round(bright * 112)},${Math.round(bright * 112)},${Math.round(bright * 112)}`;
        const alpha = (bright * edge * 0.95).toFixed(3);

        ctx.beginPath();
        ctx.arc(px, py, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${shade},${alpha})`;
        ctx.fill();

        // star spike on strong flash
        if (flashBoost > 0.7 && d.size > 1.4) {
          const spk = d.size * 2.5 * flashBoost;
          ctx.save();
          ctx.translate(px, py);
          ctx.globalAlpha = flashBoost * 0.5;
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 0.5;
          for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a) * spk, Math.sin(a) * spk);
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      // ── shimmer border ───────────────────────────────────────────────────
      const shimmerPos = (t * 0.15) % 1;
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(Math.max(0, shimmerPos - 0.15), "rgba(255,255,255,0)");
      grad.addColorStop(shimmerPos,                      "rgba(255,255,255,0.18)");
      grad.addColorStop(Math.min(1, shimmerPos + 0.15), "rgba(255,255,255,0)");

      ctx.strokeStyle = grad;
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.roundRect(0.5, 0.5, size - 1, size - 1, radius);
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

  const onMouseLeave = useCallback(() => {
    mouse.current = [9999, 9999];
  }, []);

  return { canvasRef, onMouseMove, onMouseLeave };
}

// ── Exported component ────────────────────────────────────────────────────────
export default function LinearLogo({ size = 260 }: { size?: number }) {
  const dragControls              = useDragControls();
  const { canvasRef, onMouseMove, onMouseLeave } = useLinearCanvas(size);

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragMomentum
      dragElastic={0.1}
      dragTransition={{ power: 0.15, timeConstant: 200 }}
      whileDrag={{ scale: 1.05, cursor: "grabbing" }}
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: size, height: size,
        position: "relative",
        userSelect: "none",
        cursor: "grab",
        touchAction: "none",
        zIndex: 10,
        borderRadius: size * 0.108,
        filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.35))",
        flexShrink: 0,
      }}
      onPointerDown={(e) => dragControls.start(e)}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          display: "block",
          borderRadius: size * 0.108,
          width: size,
          height: size,
        }}
      />
    </motion.div>
  );
}
