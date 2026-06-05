"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";

// ── Sphere surface sampler (Fibonacci lattice + noise jitter) ──────────────
function spherePoints(n: number, r: number, jitter: number): Float32Array {
  const pts = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y   = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const th  = golden * i;
    const jx  = (Math.random() - 0.5) * jitter;
    const jy  = (Math.random() - 0.5) * jitter;
    const jz  = (Math.random() - 0.5) * jitter;
    pts[i*3]   = (Math.cos(th) * rad + jx) * r;
    pts[i*3+1] = (y + jy) * r;
    pts[i*3+2] = (Math.sin(th) * rad + jz) * r;
  }
  return pts;
}

// ── Particle system ────────────────────────────────────────────────────────
function SparkleParticles({ mouse }: { mouse: React.MutableRefObject<[number,number]> }) {
  const SPHERE_N = 4800;
  const BG_N     = 600;
  const CIRCLE_N = 800;  // new: white circle-orbit particles
  const TOTAL    = SPHERE_N + BG_N + CIRCLE_N;

  const matRef  = useRef<THREE.ShaderMaterial>(null);
  const geoRef  = useRef<THREE.BufferGeometry>(null);

  // Per-particle data
  const { positions, phases, speeds, sizes, isSphere, stripeExclude, orbitR, orbitSpeed, isCircle } = useMemo(() => {
    const positions     = new Float32Array(TOTAL * 3);
    const phases        = new Float32Array(TOTAL);
    const speeds        = new Float32Array(TOTAL);
    const sizes         = new Float32Array(TOTAL);
    const isSphere      = new Float32Array(TOTAL);
    const stripeExclude = new Float32Array(TOTAL);
    const orbitR        = new Float32Array(TOTAL);  // orbit radius for circle particles
    const orbitSpeed    = new Float32Array(TOTAL);  // orbit speed direction +/-
    const isCircle      = new Float32Array(TOTAL);  // 1=circle orbit particle

    // Sphere dots
    const spts = spherePoints(SPHERE_N, 1.0, 0.045);
    for (let i = 0; i < SPHERE_N; i++) {
      positions[i*3]   = spts[i*3];
      positions[i*3+1] = spts[i*3+1];
      positions[i*3+2] = spts[i*3+2];

      phases[i]  = Math.random() * Math.PI * 2;
      speeds[i]  = 0.6 + Math.random() * 2.2;
      sizes[i]   = 0.012 + Math.random() * 0.022;
      isSphere[i] = 1.0;

      // Diagonal stripe mask in UV space
      // Project to view-facing UV: x in [-1,1], y in [-1,1]
      const px = spts[i*3];
      const py = spts[i*3+1];
      // Three diagonal black stripes (like Linear logo)
      const d = px - py * 0.5 + 0.1;
      const stripe = Math.abs(((d / 2.5) % 1 + 1) % 1 - 0.5);
      stripeExclude[i] = stripe < 0.13 ? 1.0 : 0.0;
    }

    // Background dots
    for (let i = 0; i < BG_N; i++) {
      const idx = SPHERE_N + i;
      // Random positions in a box behind/around sphere
      positions[idx*3]   = (Math.random() - 0.5) * 2.6;
      positions[idx*3+1] = (Math.random() - 0.5) * 2.6;
      positions[idx*3+2] = -0.3 + Math.random() * 0.2;
      phases[idx]  = Math.random() * Math.PI * 2;
      speeds[idx]  = 0.3 + Math.random() * 0.8;
      sizes[idx]   = 0.006 + Math.random() * 0.01;
      isSphere[idx] = 0.0;
      stripeExclude[idx] = 0.0;
    }

    // Circle-orbit white particles — multiple rings
    const rings = [
      { r: 1.28, count: 160, size: 0.009, spd: 0.28 },
      { r: 1.52, count: 200, size: 0.007, spd: -0.18 },
      { r: 1.78, count: 240, size: 0.006, spd: 0.12 },
      { r: 2.05, count: 200, size: 0.005, spd: -0.08 },
    ];
    let ci = 0;
    for (const ring of rings) {
      for (let k = 0; k < ring.count; k++) {
        const idx = SPHERE_N + BG_N + ci;
        const angle = (k / ring.count) * Math.PI * 2 + Math.random() * 0.3;
        // initial position on ring
        positions[idx*3]   = Math.cos(angle) * ring.r;
        positions[idx*3+1] = Math.sin(angle) * ring.r;
        positions[idx*3+2] = (Math.random() - 0.5) * 0.12;
        phases[idx]     = angle;           // use as initial angle
        speeds[idx]     = 0.4 + Math.random() * 1.8;
        sizes[idx]      = ring.size * (0.7 + Math.random() * 0.6);
        isSphere[idx]   = 0.0;
        isCircle[idx]   = 1.0;
        orbitR[idx]     = ring.r + (Math.random() - 0.5) * 0.08;
        orbitSpeed[idx] = ring.spd * (0.7 + Math.random() * 0.6);
        stripeExclude[idx] = 0.0;
        ci++;
      }
    }

    return { positions, phases, speeds, sizes, isSphere, stripeExclude, orbitR, orbitSpeed, isCircle };
  }, []);

  const uniforms = useMemo(() => ({
    uTime:        { value: 0 },
    uMouse:       { value: new THREE.Vector2(0, 0) },
    uBreath:      { value: 1.0 },
    uResolution:  { value: new THREE.Vector2(1, 1) },
  }), []);

  useFrame(({ clock, size }) => {
    if (!matRef.current) return;
    const t = clock.getElapsedTime();
    matRef.current.uniforms.uTime.value    = t;
    matRef.current.uniforms.uBreath.value  = 1.0 + Math.sin(t * 0.55) * 0.018 + Math.sin(t * 0.23) * 0.007;
    matRef.current.uniforms.uResolution.value.set(size.width, size.height);
    const tx = (mouse.current[0] / size.width  - 0.5) * 2.2;
    const ty = -(mouse.current[1] / size.height - 0.5) * 2.2;
    matRef.current.uniforms.uMouse.value.x += (tx - matRef.current.uniforms.uMouse.value.x) * 0.05;
    matRef.current.uniforms.uMouse.value.y += (ty - matRef.current.uniforms.uMouse.value.y) * 0.05;
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position"      args={[positions,     3]} />
        <bufferAttribute attach="attributes-aPhase"        args={[phases,        1]} />
        <bufferAttribute attach="attributes-aSpeed"        args={[speeds,        1]} />
        <bufferAttribute attach="attributes-aSize"         args={[sizes,         1]} />
        <bufferAttribute attach="attributes-aIsSphere"     args={[isSphere,      1]} />
        <bufferAttribute attach="attributes-aStripe"       args={[stripeExclude, 1]} />
        <bufferAttribute attach="attributes-aIsCircle"     args={[isCircle,      1]} />
        <bufferAttribute attach="attributes-aOrbitR"       args={[orbitR,        1]} />
        <bufferAttribute attach="attributes-aOrbitSpeed"   args={[orbitSpeed,    1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */`
          attribute float aPhase;
          attribute float aSpeed;
          attribute float aSize;
          attribute float aIsSphere;
          attribute float aStripe;
          attribute float aIsCircle;
          attribute float aOrbitR;
          attribute float aOrbitSpeed;

          uniform float uTime;
          uniform float uBreath;
          uniform vec2  uMouse;

          varying float vAlpha;
          varying float vBright;
          varying float vIsSphere;
          varying float vStripe;
          varying float vIsCircle;

          float hash(float n){ return fract(sin(n)*43758.5453); }

          void main(){
            vec3 pos = position;

            // ── Circle orbit particles ────────────────────
            if(aIsCircle > 0.5){
              float angle = aPhase + uTime * aOrbitSpeed;
              pos.x = cos(angle) * aOrbitR;
              pos.y = sin(angle) * aOrbitR;
              // slight vertical bob
              pos.y += sin(uTime * aSpeed * 0.3 + aPhase * 2.0) * 0.04;
              pos.z = position.z;

              // Mouse subtle warp on orbit
              vec2 toM   = pos.xy - uMouse * 0.5;
              float mStr = smoothstep(1.5, 0.0, length(toM)) * 0.06;
              pos.xy    += normalize(toM + 0.001) * mStr;

            } else if(aIsSphere > 0.5){
              pos *= uBreath;
              float driftAmp = 0.008;
              pos.x += sin(uTime * aSpeed * 0.4 + aPhase * 2.1) * driftAmp;
              pos.y += cos(uTime * aSpeed * 0.35 + aPhase * 3.3) * driftAmp;
              vec2  toM  = pos.xy - uMouse * 0.45;
              float mDist = length(toM);
              float mStr  = smoothstep(0.7, 0.0, mDist) * 0.055;
              pos.xy += normalize(toM + 0.001) * mStr;
            } else {
              pos.x += sin(uTime * aSpeed * 0.2 + aPhase) * 0.06;
              pos.y += cos(uTime * aSpeed * 0.15 + aPhase * 1.7) * 0.06;
            }

            // ── Sparkle lifecycle ─────────────────────────
            float cycle  = mod(uTime * aSpeed + aPhase, 6.2832);
            float appear = smoothstep(0.0, 1.0, cycle / 1.5);
            float fade   = 1.0 - smoothstep(4.5, 6.2832, cycle);
            float alpha  = appear * fade;
            float flicker = 0.78 + 0.22 * sin(uTime * aSpeed * 8.0 + aPhase * 11.0);
            float bright = 0.45 + 0.55 * (0.5 + 0.5 * sin(uTime * aSpeed * 1.5 + aPhase));

            // Circle particles: pure white, always slightly visible
            float baseAlpha = aIsCircle > 0.5
              ? (0.55 + 0.45 * alpha) * flicker
              : alpha * flicker * (aIsSphere > 0.5 ? 0.92 : 0.35);

            vAlpha    = baseAlpha;
            vBright   = aIsCircle > 0.5 ? 0.85 + 0.15 * bright : bright;
            vIsSphere = aIsSphere;
            vStripe   = aStripe;
            vIsCircle = aIsCircle;

            vec4 mv      = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = aSize * 380.0 / -mv.z;
            gl_Position  = projectionMatrix * mv;
          }
        `}
        fragmentShader={/* glsl */`
          varying float vAlpha;
          varying float vBright;
          varying float vIsSphere;
          varying float vStripe;
          varying float vIsCircle;

          void main(){
            if(vIsSphere > 0.5 && vStripe > 0.5) discard;

            vec2  uv = gl_PointCoord - 0.5;
            float d  = length(uv);
            if(d > 0.5) discard;

            float core  = 1.0 - smoothstep(0.0, 0.18, d);
            float glow  = 1.0 - smoothstep(0.0, 0.50, d);
            float shape = core * 0.85 + glow * 0.35;

            // Circle particles are pure bright white
            float shade = vIsCircle > 0.5
              ? mix(0.75, 1.0, vBright)
              : mix(0.25, 1.0, vBright);
            vec3 col = vec3(shade);

            gl_FragColor = vec4(col, shape * vAlpha);
          }
        `}
      />
    </points>
  );
}

// ── Main exported logo ─────────────────────────────────────────────────────
export default function LinearLogo({ size = 260 }: { size?: number }) {
  const mouse        = useRef<[number,number]>([0, 0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const radius       = size * 0.185; // rounded corner

  const onMouseMove = (e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    mouse.current = [e.clientX - r.left, e.clientY - r.top];
  };
  const onMouseLeave = () => { mouse.current = [size / 2, size / 2]; };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        width: size, height: size,
        borderRadius: radius,
        background: "#000",
        overflow: "hidden",
        cursor: "none",
        boxShadow: [
          "0 0 0 1px rgba(255,255,255,0.08)",
          "0 24px 60px rgba(0,0,0,0.5)",
          "inset 0 1px 0 rgba(255,255,255,0.06)",
        ].join(", "),
        position: "relative",
        userSelect: "none",
      }}
    >
      {/* CSS grain overlay */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 10,
          pointerEvents: "none", borderRadius: radius,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
          mixBlendMode: "overlay",
          opacity: 0.5,
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 40 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: "#000", display: "block" }}
        dpr={[1, 2]}
      >
        <SparkleParticles mouse={mouse} />
      </Canvas>
    </motion.div>
  );
}
