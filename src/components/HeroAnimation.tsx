"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

// ─── Sample "A S" initials as particle targets ────────────────────────────────
function buildLogoTargets(): [number, number][] {
  const pts: [number, number][] = [];
  const step = 0.038;

  /* ── Letter A ── */
  for (let t = 0; t <= 1; t += step) {
    pts.push([-0.92 + t * 0.44, -0.88 + t * 1.76]);       // left leg
    pts.push([-0.92 + (1 - t) * 0.44 + 0.88, -0.88 + t * 1.76]); // right leg
  }
  for (let t = 0.28; t <= 0.72; t += step * 1.4) {
    pts.push([-0.92 + t * 0.88, -0.88 + t * 0.96]);        // crossbar
  }

  /* ── Letter S ── */
  const sx = 0.52, sr = 0.34;
  for (let a = 0; a <= Math.PI; a += step * 1.1) {
    pts.push([sx + sr * Math.cos(a + 0.18),  0.44 + sr * 0.7 * Math.sin(a)]);
    pts.push([sx - sr * Math.cos(a + 0.18), -0.44 - sr * 0.7 * Math.sin(a)]);
  }
  for (let t = -0.08; t <= 1.08; t += step * 0.9) {
    pts.push([sx + (t - 0.5) * sr * 1.8, (t - 0.5) * 1.0]);
  }

  return pts;
}

const LOGO_PTS = buildLogoTargets();
const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

export default function HeroAnimation() {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse    = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const N = isMobile() ? 2200 : 5500;

    /* ── Renderer ─────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0xf5f5f5, 1);
    el.appendChild(renderer.domElement);

    /* ── Scene / Camera ───────────────────────────────────── */
    const scene  = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    const camera = new THREE.PerspectiveCamera(52, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.z = 5.2;

    /* ── Particle buffers ─────────────────────────────────── */
    const pos     = new Float32Array(N * 3);  // current positions
    const target  = new Float32Array(N * 3);  // logo target positions
    const origin  = new Float32Array(N * 3);  // scatter positions
    const rand    = new Float32Array(N * 4);  // random seeds
    const sizes   = new Float32Array(N);      // per-particle size
    const opacity = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      // Logo target — jittered halftone
      const [lx, ly] = LOGO_PTS[i % LOGO_PTS.length];
      const jit = 0.032 + Math.random() * 0.018;
      target[i*3]   = lx + (Math.random()-0.5)*jit;
      target[i*3+1] = ly + (Math.random()-0.5)*jit;
      target[i*3+2] = (Math.random()-0.5)*0.06;

      // Scatter origin — organic cloud
      const r     = 1.5 + Math.pow(Math.random(), 0.5) * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      origin[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      origin[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      origin[i*3+2] = r * Math.cos(phi) * 0.3;

      pos[i*3]   = origin[i*3];
      pos[i*3+1] = origin[i*3+1];
      pos[i*3+2] = origin[i*3+2];

      rand[i*4]   = Math.random();
      rand[i*4+1] = Math.random();
      rand[i*4+2] = Math.random();
      rand[i*4+3] = Math.random();

      // Halftone-style varied sizes
      const halftone = 0.4 + Math.random() * 0.6;
      sizes[i]   = halftone;
      opacity[i] = 0;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos,     3));
    geo.setAttribute("aTarget",  new THREE.BufferAttribute(target,  3));
    geo.setAttribute("aOrigin",  new THREE.BufferAttribute(origin,  3));
    geo.setAttribute("aRand",    new THREE.BufferAttribute(rand,     4));
    geo.setAttribute("aSize",    new THREE.BufferAttribute(sizes,    1));
    geo.setAttribute("aOpacity", new THREE.BufferAttribute(opacity,  1));

    /* ── GLSL Shader ──────────────────────────────────────── */
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite:  false,
      blending:    THREE.NormalBlending,
      uniforms: {
        uTime:     { value: 0 },
        uProgress: { value: 0 },   // 0=scatter → 1=logo
        uMouse:    { value: new THREE.Vector2(0, 0) },
        uMouseV:   { value: new THREE.Vector2(0, 0) },
        uBaseSize: { value: renderer.getPixelRatio() * 52 },
      },
      vertexShader: /* glsl */`
        attribute vec3  aTarget;
        attribute vec3  aOrigin;
        attribute vec4  aRand;
        attribute float aSize;
        attribute float aOpacity;

        uniform float uTime;
        uniform float uProgress;
        uniform vec2  uMouse;
        uniform vec2  uMouseV;
        uniform float uBaseSize;

        varying float vOpacity;
        varying float vRand;
        varying vec2  vUV;

        // Smooth noise helper
        float hash(float n) { return fract(sin(n) * 43758.5453); }
        float noise(vec3 p) {
          vec3 i = floor(p); vec3 f = fract(p);
          f = f*f*(3.0-2.0*f);
          float n = i.x + i.y*57.0 + i.z*113.0;
          return mix(mix(mix(hash(n),hash(n+1.0),f.x),
                         mix(hash(n+57.0),hash(n+58.0),f.x),f.y),
                     mix(mix(hash(n+113.0),hash(n+114.0),f.x),
                         mix(hash(n+170.0),hash(n+171.0),f.x),f.y),f.z);
        }

        void main() {
          // ── Organic scatter → logo lerp ──
          // Use per-particle delay for staggered arrival (ink diffusion)
          float delay   = aRand.x * 0.35;
          float localP  = clamp((uProgress - delay) / (1.0 - delay + 0.001), 0.0, 1.0);
          // Ease: smootherstep
          localP = localP * localP * localP * (localP * (localP * 6.0 - 15.0) + 10.0);

          vec3 pos = mix(aOrigin, aTarget, localP);

          // ── Procedural noise displacement (morphing/breathing) ──
          float noiseScale = 1.8;
          float noiseTime  = uTime * 0.22;
          vec3  noisePos   = vec3(pos.x * noiseScale + noiseTime,
                                  pos.y * noiseScale + noiseTime * 0.7,
                                  aRand.z * 4.0 + noiseTime * 0.5);
          float nx = noise(noisePos) - 0.5;
          float ny = noise(noisePos + vec3(3.1, 7.3, 1.7)) - 0.5;
          float noiseAmp = 0.055 * (1.0 - localP * 0.65); // more noise while scattering
          pos.x += nx * noiseAmp;
          pos.y += ny * noiseAmp;

          // ── Idle breathing ──
          float breathe = sin(uTime * 0.55 + aRand.y * 6.28) * 0.010 * localP;
          pos.xy += breathe;

          // ── Mouse magnetic repulsion ──
          vec2  toM   = pos.xy - uMouse;
          float mDist = length(toM);
          float mStr  = smoothstep(0.9, 0.0, mDist) * 0.14 * localP;
          pos.xy += normalize(toM + 0.0001) * mStr;
          // velocity trail
          pos.xy += uMouseV * smoothstep(1.2, 0.0, mDist) * 0.04 * localP;

          vOpacity = aOpacity * (0.15 + localP * 0.85);
          vRand    = aRand.w;
          vUV      = vec2(0.5);

          vec4 mv      = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = uBaseSize * aSize / -mv.z;
          gl_Position  = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */`
        varying float vOpacity;
        varying float vRand;

        // Dither/grain noise
        float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

        void main() {
          vec2  uv = gl_PointCoord - 0.5;
          float d  = length(uv);
          if (d > 0.5) discard;

          // Halftone-style soft disc
          float core  = 1.0 - smoothstep(0.0, 0.30, d);
          float rim   = 1.0 - smoothstep(0.20, 0.50, d);
          float alpha = (core * 0.92 + rim * 0.28) * vOpacity;

          // Monochrome: mix #111 and #555 based on vRand (halftone feel)
          float shade = mix(0.07, 0.38, vRand);
          vec3  col   = vec3(shade);

          // Procedural grain on each particle
          float grain = hash2(gl_FragCoord.xy * 0.5) * 0.06 - 0.03;
          col = clamp(col + grain, 0.0, 1.0);

          gl_FragColor = vec4(col, alpha);
        }
      `,
    });

    const mesh = new THREE.Points(geo, mat);
    scene.add(mesh);

    /* ── Ink-bloom plane (top-left highlight) ─────────────── */
    const bloomGeo = new THREE.PlaneGeometry(6, 6);
    const bloomMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime:    { value: 0 },
        uOpacity: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform float uOpacity;

        float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
        float noise(vec2 p){
          vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
                     mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
        }
        void main(){
          vec2 uv = vUv;
          // bloom origin: top-left
          vec2 origin = vec2(0.12, 0.88);
          float dist  = length(uv - origin);

          // animated noise displacement
          float t  = uTime * 0.18;
          float n  = noise(uv * 3.5 + t) * 0.5 + noise(uv * 7.0 - t * 0.6) * 0.25;
          float displaced = length(uv - origin + (n - 0.4) * 0.22);

          float bloom = smoothstep(0.7, 0.0, displaced);
          bloom *= smoothstep(0.0, 0.3, uOpacity); // fade-in

          // soft white-on-light ink diffusion
          float alpha = bloom * 0.08 * uOpacity;
          gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
        }
      `,
    });
    const bloomMesh = new THREE.Mesh(bloomGeo, bloomMat);
    bloomMesh.position.z = -0.1;
    scene.add(bloomMesh);

    /* ── GSAP animation timeline ──────────────────────────── */
    const tl = gsap.timeline();

    // Phase 1: particles fade in
    tl.to(opacity, {
      duration: 1.4,
      endArray: Array(N).fill(1),
      ease: "power2.inOut",
      onUpdate: () => { geo.attributes.aOpacity.needsUpdate = true; },
    }, 0.2);

    // Phase 2: bloom fades in
    tl.to(bloomMat.uniforms.uOpacity, { value: 1, duration: 2.5, ease: "power2.inOut" }, 0.5);

    // Phase 3: converge to logo
    tl.to(mat.uniforms.uProgress, {
      value: 1,
      duration: 4.2,
      ease: "power4.inOut",
    }, 0.8);

    /* ── Render loop ──────────────────────────────────────── */
    let raf: number;
    const clock = new THREE.Clock();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      mat.uniforms.uTime.value      = t;
      bloomMat.uniforms.uTime.value = t;

      // smooth mouse velocity
      mouse.current.vx = mouse.current.x - prevMouse.current.x;
      mouse.current.vy = mouse.current.y - prevMouse.current.y;
      prevMouse.current.x = mouse.current.x;
      prevMouse.current.y = mouse.current.y;

      mat.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
      mat.uniforms.uMouseV.value.set(mouse.current.vx, mouse.current.vy);

      renderer.render(scene, camera);
    };
    tick();

    /* ── Mouse tracking ───────────────────────────────────── */
    const onMouse = (e: MouseEvent) => {
      const x =  (e.clientX / window.innerWidth)  * 2 - 1;
      const y = -(e.clientY / window.innerHeight)  * 2 + 1;
      const vfov = (camera.fov * Math.PI) / 360;
      mouse.current.x = x * camera.position.z * Math.tan(vfov) * camera.aspect;
      mouse.current.y = y * camera.position.z * Math.tan(vfov);
    };
    window.addEventListener("mousemove", onMouse);

    /* ── Resize ───────────────────────────────────────────── */
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
      mat.uniforms.uBaseSize.value = renderer.getPixelRatio() * 52;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      tl.kill();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      bloomMat.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "#f5f5f5" }}
    >
      {/* Procedural grain overlay — CSS-level, zero GPU cost */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
          mixBlendMode: "multiply",
          opacity: 0.6,
        }}
      />
      {/* WebGL canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0" />
    </div>
  );
}
