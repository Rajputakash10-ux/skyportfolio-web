"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

// ── Football logo points ──────────────────────────────────────────────────────
// Outer circle + classic hexagon/pentagon patch pattern
const FOOTBALL_POINTS = (() => {
  const pts: [number, number][] = [];
  const R = 1.6;   // outer radius
  const s = 0.022; // step

  // Outer circle
  for (let a = 0; a < Math.PI * 2; a += s) {
    pts.push([R * Math.cos(a), R * Math.sin(a)]);
  }

  // Central pentagon (black patch)
  const pr = 0.38;
  for (let a = 0; a < Math.PI * 2; a += s * 1.6) {
    pts.push([pr * Math.cos(a), pr * Math.sin(a)]);
  }
  // Fill center patch
  for (let r = 0; r < pr; r += 0.07) {
    for (let a = 0; a < Math.PI * 2; a += s * 3) {
      pts.push([r * Math.cos(a), r * Math.sin(a)]);
    }
  }

  // 5 surrounding hexagon patches
  const patchR = 0.82;
  const patchInner = 0.28;
  for (let p = 0; p < 5; p++) {
    const pa = (p / 5) * Math.PI * 2 - Math.PI / 2;
    const cx = patchR * Math.cos(pa);
    const cy = patchR * Math.sin(pa);
    for (let a = 0; a < Math.PI * 2; a += s * 1.8) {
      pts.push([cx + patchInner * Math.cos(a), cy + patchInner * Math.sin(a)]);
    }
    for (let r = 0; r < patchInner; r += 0.07) {
      for (let a = 0; a < Math.PI * 2; a += s * 3.5) {
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
      }
    }
  }

  // 6 outer hexagon patches
  const outerR = 1.28;
  const outerInner = 0.22;
  for (let p = 0; p < 6; p++) {
    const pa = (p / 6) * Math.PI * 2;
    const cx = outerR * Math.cos(pa);
    const cy = outerR * Math.sin(pa);
    for (let a = 0; a < Math.PI * 2; a += s * 2.2) {
      pts.push([cx + outerInner * Math.cos(a), cy + outerInner * Math.sin(a)]);
    }
  }

  // Seam lines connecting patches
  for (let p = 0; p < 5; p++) {
    const pa  = (p / 5) * Math.PI * 2 - Math.PI / 2;
    const pa2 = ((p + 1) / 5) * Math.PI * 2 - Math.PI / 2;
    const x1 = patchR * Math.cos(pa),  y1 = patchR * Math.sin(pa);
    const x2 = patchR * Math.cos(pa2), y2 = patchR * Math.sin(pa2);
    for (let t = 0; t <= 1; t += 0.04) {
      pts.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]);
    }
    // Seam to center
    for (let t = 0.1; t <= 0.85; t += 0.04) {
      pts.push([x1 * t * 0.6, y1 * t * 0.6]);
    }
  }

  return pts;
})();

const PARTICLE_COUNT = typeof window !== "undefined" && window.innerWidth < 768 ? 2000 : 5000;

export default function HeroAnimation() {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 1);
    el.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060608);
    const camera = new THREE.PerspectiveCamera(55, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.z = 5.5;

    // ── Particle buffers ──────────────────────────────────────
    const geometry  = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const targets   = new Float32Array(PARTICLE_COUNT * 3);
    const randoms   = new Float32Array(PARTICLE_COUNT * 3);
    const colors    = new Float32Array(PARTICLE_COUNT * 3);
    const opacities = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Target: football shape
      const [fx, fy] = FOOTBALL_POINTS[i % FOOTBALL_POINTS.length];
      const jitter = 0.025;
      targets[i * 3]     = fx + (Math.random() - 0.5) * jitter;
      targets[i * 3 + 1] = fy + (Math.random() - 0.5) * jitter;
      targets[i * 3 + 2] = (Math.random() - 0.5) * 0.08;

      // Start: burst from center
      const r     = Math.random() * 5 + 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.random() * Math.PI;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      randoms[i * 3]     = Math.random();
      randoms[i * 3 + 1] = Math.random();
      randoms[i * 3 + 2] = Math.random();

      // Color: white with subtle green tint on outer ring
      const distFromCenter = Math.sqrt(fx * fx + fy * fy);
      const isOuter = distFromCenter > 1.4;
      colors[i * 3]     = isOuter ? 0.85 : 1.0;
      colors[i * 3 + 1] = isOuter ? 1.0  : 1.0;
      colors[i * 3 + 2] = isOuter ? 0.85 : 1.0;

      opacities[i] = 0;
    }

    geometry.setAttribute("position",  new THREE.BufferAttribute(positions,  3));
    geometry.setAttribute("aTarget",   new THREE.BufferAttribute(targets,    3));
    geometry.setAttribute("aRandom",   new THREE.BufferAttribute(randoms,    3));
    geometry.setAttribute("aColor",    new THREE.BufferAttribute(colors,     3));
    geometry.setAttribute("aOpacity",  new THREE.BufferAttribute(opacities,  1));

    // ── Shader ────────────────────────────────────────────────
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime:     { value: 0 },
        uProgress: { value: 0 },
        uMouse:    { value: new THREE.Vector2(0, 0) },
        uSize:     { value: renderer.getPixelRatio() * 80 },
        uRotation: { value: 0 },
      },
      vertexShader: `
        attribute vec3  aTarget;
        attribute vec3  aRandom;
        attribute float aOpacity;
        attribute vec3  aColor;

        uniform float uTime;
        uniform float uProgress;
        uniform vec2  uMouse;
        uniform float uSize;
        uniform float uRotation;

        varying float vOpacity;
        varying vec3  vColor;

        void main() {
          // Rotate target around Z
          float c = cos(uRotation);
          float s = sin(uRotation);
          vec3 rotTarget = vec3(
            aTarget.x * c - aTarget.y * s,
            aTarget.x * s + aTarget.y * c,
            aTarget.z
          );

          vec3 pos = mix(position, rotTarget, uProgress);

          // Gentle breathing
          float breath = sin(uTime * 0.6 + aRandom.x * 6.28) * 0.014 * uProgress;
          pos.x += breath;
          pos.y += cos(uTime * 0.5 + aRandom.y * 6.28) * 0.014 * uProgress;

          // Mouse ripple — particles near cursor gently push away
          vec2 toMouse = pos.xy - uMouse;
          float mDist  = length(toMouse);
          float mStr   = smoothstep(1.0, 0.0, mDist) * 0.18 * uProgress;
          pos.xy      += normalize(toMouse + 0.001) * mStr;

          vOpacity = aOpacity;
          vColor   = aColor;

          vec4 mv      = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = uSize / -mv.z;
          gl_Position  = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        varying vec3  vColor;

        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;

          float core  = 1.0 - smoothstep(0.0, 0.22, d);
          float glow  = 1.0 - smoothstep(0.0, 0.5,  d);
          float alpha = (core * 1.0 + glow * 0.35) * vOpacity;

          gl_FragColor = vec4(vColor, alpha);
        }
      `,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // ── GSAP timeline ─────────────────────────────────────────
    const tl = gsap.timeline();

    // Particles fade in
    tl.to(opacities, {
      duration: 1.0,
      endArray: Array(PARTICLE_COUNT).fill(0.9),
      ease: "power2.inOut",
      onUpdate: () => { geometry.attributes.aOpacity.needsUpdate = true; },
    }, 0.3);

    // Converge into football
    tl.to(material.uniforms.uProgress, {
      value: 1,
      duration: 3.8,
      ease: "power3.inOut",
    }, 0.6);

    // Slow idle rotation
    tl.to(material.uniforms.uRotation, {
      value: Math.PI * 2,
      duration: 18,
      ease: "none",
      repeat: -1,
    }, 4.5);

    // ── Render loop ───────────────────────────────────────────
    let raf: number;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      material.uniforms.uTime.value = clock.getElapsedTime();
      material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      renderer.render(scene, camera);
    };
    animate();

    // ── Mouse tracking ────────────────────────────────────────
    const onMouse = (e: MouseEvent) => {
      const x =  (e.clientX / window.innerWidth)  * 2 - 1;
      const y = -(e.clientY / window.innerHeight)  * 2 + 1;
      const vfov = (camera.fov * Math.PI) / 360;
      mouseRef.current = {
        x: x * camera.position.z * Math.tan(vfov) * camera.aspect,
        y: y * camera.position.z * Math.tan(vfov),
      };
    };
    window.addEventListener("mousemove", onMouse);

    // ── Resize ────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
      material.uniforms.uSize.value = renderer.getPixelRatio() * 80;
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
    <div className="relative w-full h-screen overflow-hidden" style={{ background: "#060608" }}>
      {/* Grain */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />
      {/* Subtle radial glow behind ball */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(80,200,120,0.04), transparent 70%)" }}
      />
      {/* WebGL mount */}
      <div ref={mountRef} className="absolute inset-0 z-0" />
    </div>
  );
}
