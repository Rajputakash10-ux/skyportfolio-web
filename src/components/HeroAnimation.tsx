"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { gsap } from "gsap";

// "AS" logo points — sampled from letter paths
const LOGO_POINTS = (() => {
  const pts: [number, number][] = [];
  const H = 1.8, s = 0.045;

  // Letter "A"
  for (let t = 0; t <= 1; t += s) {
    // left stroke
    pts.push([-0.85 + t * 0.42, -H / 2 + t * H]);
    // right stroke
    pts.push([-0.85 + (1 - t) * 0.42 + 0.84, -H / 2 + t * H]);
  }
  for (let t = 0.3; t <= 0.7; t += s * 1.5) {
    pts.push([-0.85 + t * 0.84, -H / 2 + t * H * 0.55]);
  }

  // Letter "S"
  const cx = 0.55;
  for (let a = 0; a <= Math.PI; a += s * 1.2) {
    pts.push([cx + 0.32 * Math.cos(a + Math.PI * 0.1), 0.42 + 0.32 * Math.sin(a)]);
    pts.push([cx - 0.32 * Math.cos(a + Math.PI * 0.1), -0.42 - 0.32 * Math.sin(a)]);
  }
  for (let t = -0.05; t <= 1.05; t += s) {
    pts.push([cx + (t - 0.5) * 0.62, (t - 0.5) * 0.85]);
  }

  return pts;
})();

const PARTICLE_COUNT = typeof window !== "undefined" && window.innerWidth < 768 ? 1800 : 4000;

export default function HeroAnimation() {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [phase, setPhase] = useState<"logo" | "content">("logo");
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.z = 5;

    // ── Particle geometry ─────────────────────────────────────
    const geometry = new THREE.BufferGeometry();
    const positions  = new Float32Array(PARTICLE_COUNT * 3);
    const targets    = new Float32Array(PARTICLE_COUNT * 3);
    const randoms    = new Float32Array(PARTICLE_COUNT * 3);
    const opacities  = new Float32Array(PARTICLE_COUNT);

    // Assign logo targets (cycle through logo pts)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const [lx, ly] = LOGO_POINTS[i % LOGO_POINTS.length];
      const jitter = 0.04;
      targets[i * 3]     = lx + (Math.random() - 0.5) * jitter;
      targets[i * 3 + 1] = ly + (Math.random() - 0.5) * jitter;
      targets[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

      // Start: scattered from center
      const r = Math.random() * 6 + 1;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.random() * Math.PI;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      randoms[i * 3]     = Math.random();
      randoms[i * 3 + 1] = Math.random();
      randoms[i * 3 + 2] = Math.random();
      opacities[i] = 0;
    }

    geometry.setAttribute("position",  new THREE.BufferAttribute(positions,  3));
    geometry.setAttribute("aTarget",   new THREE.BufferAttribute(targets,    3));
    geometry.setAttribute("aRandom",   new THREE.BufferAttribute(randoms,    3));
    geometry.setAttribute("aOpacity",  new THREE.BufferAttribute(opacities,  1));

    // ── Shader material ───────────────────────────────────────
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime:     { value: 0 },
        uProgress: { value: 0 },
        uMouse:    { value: new THREE.Vector2(0, 0) },
        uSize:     { value: renderer.getPixelRatio() * 90 },
      },
      vertexShader: `
        attribute vec3 aTarget;
        attribute vec3 aRandom;
        attribute float aOpacity;

        uniform float uTime;
        uniform float uProgress;
        uniform vec2  uMouse;
        uniform float uSize;

        varying float vOpacity;
        varying float vDist;

        void main() {
          // Lerp toward logo target
          vec3 pos = mix(position, aTarget, uProgress);

          // Idle breathing
          float breathe = sin(uTime * 0.8 + aRandom.x * 6.28) * 0.018 * uProgress;
          pos += breathe;

          // Mouse parallax (subtle)
          float mouseDist = length(uMouse - pos.xy);
          float mouseStr  = smoothstep(1.2, 0.0, mouseDist) * 0.12 * uProgress;
          pos.xy += normalize(pos.xy - uMouse) * mouseStr;

          vOpacity = aOpacity * uProgress + (1.0 - uProgress) * aOpacity * 0.3;
          vDist    = length(pos.xy);

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = uSize / -mv.z;
          gl_Position  = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        varying float vDist;

        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;

          // Soft circle with glow
          float core  = 1.0 - smoothstep(0.0, 0.25, d);
          float glow  = 1.0 - smoothstep(0.0, 0.5,  d);
          float alpha = (core * 0.9 + glow * 0.4) * vOpacity;

          gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
        }
      `,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // ── GSAP Timeline ─────────────────────────────────────────
    const tl = gsap.timeline();

    // Phase 1 — particles appear (opacity 0 → 1)
    tl.to(opacities, {
      duration: 1.2,
      endArray: Array(PARTICLE_COUNT).fill(1),
      ease: "power2.inOut",
      onUpdate: () => geometry.attributes.aOpacity.needsUpdate = true,
    }, 0.2);

    // Phase 2 + 3 + 4 — converge to logo
    tl.to(material.uniforms.uProgress, {
      value: 1,
      duration: 3.5,
      ease: "power3.inOut",
    }, 0.8);

    // Phase 5 — transition to hero content
    tl.call(() => {
      setShowContent(true);
      setTimeout(() => setPhase("content"), 1200);
    }, [], 5.2);

    // ── Animation loop ─────────────────────────────────────────
    let raf: number;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      material.uniforms.uTime.value  = clock.getElapsedTime();
      material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      geometry.attributes.aOpacity.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    // ── Mouse tracking ────────────────────────────────────────
    const onMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth)  * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current = {
        x: x * camera.position.z * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect,
        y: y * camera.position.z * Math.tan((camera.fov * Math.PI) / 360),
      };
    };
    window.addEventListener("mousemove", onMouse);

    // ── Resize ────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
      material.uniforms.uSize.value = renderer.getPixelRatio() * 90;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      tl.kill();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* WebGL canvas mount */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Phase: logo label */}
      <AnimatePresence>
        {phase === "logo" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
          >
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-px h-8 bg-white/30"
            />
            <span className="text-white/30 text-xs tracking-[0.3em] uppercase font-light">
              Loading
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase: hero content fades in */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-5"
          >
            {/* Subtle radial glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,255,255,0.04), transparent)" }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
              className="text-center"
            >
              {/* Status */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white/50 mb-8 backdrop-blur-sm"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                </span>
                Available for new opportunities
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tight leading-none mb-4"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Akash Singh
              </motion.h1>

              {/* Role */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="text-white/40 text-lg sm:text-xl font-light tracking-wide mb-10"
              >
                Data Scientist &nbsp;·&nbsp; AI/ML Engineer &nbsp;·&nbsp; NLP Engineer
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="flex flex-wrap items-center justify-center gap-3"
              >
                <a
                  href="/sky.pdf"
                  download
                  className="px-6 py-2.5 rounded-full text-sm font-medium bg-white text-black hover:bg-white/90 transition-colors"
                >
                  Download Resume
                </a>
                <button
                  onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-6 py-2.5 rounded-full text-sm font-medium border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-all backdrop-blur-sm"
                >
                  View Projects
                </button>
                <a
                  href="https://github.com/Rajputakash10-ux"
                  target="_blank" rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-full text-sm font-medium border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-all backdrop-blur-sm flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/akash-rajput-9433aa368/"
                  target="_blank" rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-full text-sm font-medium border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-all backdrop-blur-sm flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
              </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="w-4 h-7 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
              >
                <div className="w-0.5 h-1.5 rounded-full bg-white/40" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
