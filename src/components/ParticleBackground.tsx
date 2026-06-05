"use client";
import { useEffect, useRef } from "react";

interface P {
  x: number; y: number;       // current position
  ox: number; oy: number;     // original/home position
  vx: number; vy: number;     // velocity
  size: number;
  opacity: number;
  baseOpacity: number;
}

const CONNECT_DIST  = 140;   // px — line connection radius
const MOUSE_ATTRACT = 180;   // px — attraction radius
const MOUSE_REPEL   = 70;    // px — repulsion on click
const ATTRACT_STR   = 0.022; // pull strength toward cursor
const RETURN_STR    = 0.018; // spring back to home
const DAMPING       = 0.88;  // velocity damping

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let particles: P[] = [];
    const mouse = { x: -9999, y: -9999, clicking: false };

    // ── sizing ──────────────────────────────────────────────────────────────
    const getCount = () => {
      const area = window.innerWidth * window.innerHeight;
      if (area > 1_800_000) return 160;
      if (area > 900_000)   return 110;
      return 70;
    };

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    // ── particle factory ────────────────────────────────────────────────────
    const make = (x?: number, y?: number): P => {
      const px = x ?? Math.random() * canvas.width;
      const py = y ?? Math.random() * canvas.height;
      const op = 0.18 + Math.random() * 0.42;
      return {
        x: px, y: py, ox: px, oy: py,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: 1.2 + Math.random() * 2.0,
        opacity: op, baseOpacity: op,
      };
    };

    const init = () => {
      particles = Array.from({ length: getCount() }, () => make());
    };

    // ── mouse events ─────────────────────────────────────────────────────────
    const onMove  = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onDown  = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.clicking = true; };
    const onUp    = () => { mouse.clicking = false; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    window.addEventListener("mousemove",  onMove,  { passive: true });
    window.addEventListener("mousedown",  onDown,  { passive: true });
    window.addEventListener("mouseup",    onUp,    { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });
    window.addEventListener("resize",     resize,  { passive: true });

    // ── draw loop ────────────────────────────────────────────────────────────
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        // ── mouse interaction ───────────────────────────────────────────────
        const dx   = mouse.x - p.x;
        const dy   = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (mouse.clicking && dist < MOUSE_REPEL * 2.5) {
          // Repel on click
          const str = (1 - dist / (MOUSE_REPEL * 2.5)) * 3.8;
          p.vx -= (dx / dist) * str;
          p.vy -= (dy / dist) * str;
        } else if (dist < MOUSE_ATTRACT && dist > 1) {
          // Smooth attraction
          const str = (1 - dist / MOUSE_ATTRACT) * ATTRACT_STR * 60;
          p.vx += (dx / dist) * str * 0.016;
          p.vy += (dy / dist) * str * 0.016;
          // Brighten nearby particles
          p.opacity = Math.min(1, p.baseOpacity + (1 - dist / MOUSE_ATTRACT) * 0.5);
        } else {
          p.opacity += (p.baseOpacity - p.opacity) * 0.06;
        }

        // Spring back to home position
        const hx = p.ox - p.x;
        const hy = p.oy - p.y;
        p.vx += hx * RETURN_STR * 0.016 * 60;
        p.vy += hy * RETURN_STR * 0.016 * 60;

        // Ambient drift (slow wander of home position)
        p.ox += p.vx * 0.08;
        p.oy += p.vy * 0.08;
        // Clamp home to screen
        p.ox = Math.max(0, Math.min(canvas.width,  p.ox));
        p.oy = Math.max(0, Math.min(canvas.height, p.oy));

        // Integrate
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x  += p.vx;
        p.y  += p.vy;

        // Soft wrap at edges
        if (p.x < -20)             { p.x = canvas.width  + 20; p.ox = p.x; }
        if (p.x > canvas.width+20) { p.x = -20;                p.ox = p.x; }
        if (p.y < -20)             { p.y = canvas.height + 20; p.oy = p.y; }
        if (p.y > canvas.height+20){ p.y = -20;                p.oy = p.y; }

        // Draw dot — neutral color works on both light + dark sections
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,100,110,${p.opacity})`;
        ctx.fill();
      });

      // ── connecting lines ──────────────────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a  = particles[i];
          const b  = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT_DIST) {
            const alpha = (1 - d / CONNECT_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(100,100,110,${alpha})`;
            ctx.lineWidth   = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mousedown",  onDown);
      window.removeEventListener("mouseup",    onUp);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize",     resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        background: "transparent",
        display: "block",
      }}
    />
  );
}
