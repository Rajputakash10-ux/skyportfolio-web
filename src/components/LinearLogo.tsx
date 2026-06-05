"use client";
import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";

// ─── Simplex-style noise helpers (GLSL inline) ───────────────────────────────
// We inline noise fully in GLSL — no textures needed.

const VERT = /* glsl */`
precision highp float;

attribute float aPhase;
attribute float aSpeed;
attribute float aSize;
attribute float aType;   // 0=bg, 1=sphere, 2=stripe(hidden)
attribute float aSeed;

uniform float uTime;
uniform float uBreath;
uniform vec2  uMouse;
uniform float uDpr;

varying float vAlpha;
varying float vBright;
varying float vType;

// ── hash / noise ─────────────────────────────────────────────────────────────
float hash11(float p){
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}
float hash12(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031,0.1030,0.0973));
  p3 += dot(p3, p3.yzx+33.33);
  return fract((p3.xx+p3.yz)*p3.zy);
}

// 2D value noise
float vnoise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  float a = hash12(i);
  float b = hash12(i+vec2(1,0));
  float c = hash12(i+vec2(0,1));
  float d = hash12(i+vec2(1,1));
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){
  float v=0.0, a=0.5;
  for(int i=0;i<4;i++){ v+=a*vnoise(p); p*=2.1; a*=0.5; }
  return v;
}

void main(){
  vec3 pos = position;
  vType = aType;

  if(aType < 0.5){
    // ── Background particles ──────────────────────────────────────────────
    vec2 np = pos.xy * 1.4 + uTime * 0.04 * aSpeed;
    float n = fbm(np + aSeed);
    pos.x += (n - 0.5) * 0.08 * aSpeed;
    pos.y += (vnoise(np * 1.3 + 0.7) - 0.5) * 0.06 * aSpeed;

    float flicker = 0.3 + 0.7 * (0.5 + 0.5*sin(uTime*aSpeed*3.0 + aPhase*7.0));
    float drift   = 0.5 + 0.5 * sin(uTime*aSpeed*0.8 + aPhase);
    vAlpha  = flicker * drift * 0.45;
    vBright = 0.25 + 0.35 * drift;

  } else if(aType > 1.5){
    // ── Stripe / discarded — type 2 ───────────────────────────────────────
    // Force offscreen so fragment never runs (stripe discarded in frag)
    gl_Position = vec4(9.0,9.0,9.0,1.0);
    gl_PointSize = 0.0;
    vAlpha = 0.0;
    vBright = 0.0;
    return;

  } else {
    // ── Sphere particles ──────────────────────────────────────────────────
    pos *= uBreath;

    // Noise-driven micro-drift (0.5–3 px in world units)
    float t  = uTime * aSpeed * 0.38;
    vec2 np  = pos.xy * 2.8 + t;
    float nx = fbm(np             + aSeed);
    float ny = fbm(np + vec2(5.2, 1.3));
    float driftAmp = 0.006 + aSeed * 0.009; // ~0.5–3px after projection
    pos.x += (nx - 0.5) * driftAmp * 2.0;
    pos.y += (ny - 0.5) * driftAmp * 2.0;
    pos.z += (fbm(np + vec2(2.7, 8.1)) - 0.5) * driftAmp;

    // Mouse ripple — very subtle, luxurious
    vec2 delta  = pos.xy - uMouse;
    float mdist = length(delta);
    float mstr  = smoothstep(0.55, 0.0, mdist) * 0.045;
    pos.xy += normalize(delta + 0.0001) * mstr;

    // ── Sparkle: individual brightness cycle ──────────────────────────────
    float sparkPhase = mod(uTime * aSpeed * 0.9 + aPhase * 6.283, 6.283);
    float sparkle    = 0.3 + 0.7 * pow(0.5 + 0.5 * sin(sparkPhase), 2.0);
    // Occasional super-bright flash
    float flash = step(0.92, hash11(aSeed + floor(uTime * aSpeed * 0.4))) * 
                  smoothstep(0.0, 0.3, fract(uTime * aSpeed * 0.4));
    sparkle = mix(sparkle, 1.0, flash * 0.6);

    // Density: dots toward center slightly brighter/denser (handled by sphere gen)
    float r2 = dot(pos.xy, pos.xy);
    float edgeFade = 1.0 - smoothstep(0.55, 1.05, sqrt(r2));

    vAlpha  = sparkle * edgeFade;
    vBright = 0.55 + 0.45 * sparkle;
  }

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (320.0 / -mv.z) * uDpr;
  gl_Position  = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */`
precision highp float;
varying float vAlpha;
varying float vBright;
varying float vType;

void main(){
  vec2  uv = gl_PointCoord - 0.5;
  float d  = length(uv);
  if(d > 0.5) discard;

  float core = 1.0 - smoothstep(0.0, 0.22, d);
  float glow = 1.0 - smoothstep(0.0, 0.50, d);
  float mask = core * 0.8 + glow * 0.3;

  float shade;
  if(vType < 0.5){
    // bg dots: dark gray
    shade = mix(0.28, 0.55, vBright);
  } else {
    // sphere: white → light gray
    shade = mix(0.62, 1.0, vBright);
  }

  gl_FragColor = vec4(vec3(shade), mask * vAlpha);
}
`;

// ─── Fibonacci sphere sampler ────────────────────────────────────────────────
function fibSphere(n: number, r: number): Float32Array {
  const pts = new Float32Array(n * 3);
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y   = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const th  = phi * i;
    pts[i*3]   = Math.cos(th) * rad * r;
    pts[i*3+1] = y * r;
    pts[i*3+2] = Math.sin(th) * rad * r;
  }
  return pts;
}

// ─── Stripe mask: 3 diagonal cutouts ────────────────────────────────────────
// Projects 3D sphere point to 2D, applies diagonal stripe pattern.
// Returns true if point falls inside a stripe (should be hidden).
function inStripe(x: number, y: number): boolean {
  // Diagonal direction: ~35° — matches Linear logo angle
  const angle  = Math.PI / 5.2;      // ~34.6°
  const cosA   = Math.cos(angle);
  const sinA   = Math.sin(angle);
  const proj   = x * cosA + y * sinA; // projection along stripe normal
  // 3 stripes, width=0.19, spacing=0.54
  const period = 0.54;
  const width  = 0.19;
  const p = ((proj % period) + period) % period;
  return p < width;
}

// ─── Particle system ─────────────────────────────────────────────────────────
function Particles({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const SPHERE_N = isMobile ? 9000  : 28000;
  const BG_N     = isMobile ? 1800  :  5000;
  const TOTAL    = SPHERE_N + BG_N;

  const { positions, aPhase, aSpeed, aSize, aType, aSeed } = useMemo(() => {
    const positions = new Float32Array(TOTAL * 3);
    const aPhase    = new Float32Array(TOTAL);
    const aSpeed    = new Float32Array(TOTAL);
    const aSize     = new Float32Array(TOTAL);
    const aType     = new Float32Array(TOTAL); // 0=bg,1=sphere
    const aSeed     = new Float32Array(TOTAL);

    // ── Sphere particles (with jitter + stripe masking) ───────────────────
    const sph = fibSphere(SPHERE_N, 1.0);
    for (let i = 0; i < SPHERE_N; i++) {
      const sx = sph[i*3], sy = sph[i*3+1], sz = sph[i*3+2];
      // Small random jitter to break Fibonacci pattern
      const jx = (Math.random() - 0.5) * 0.055;
      const jy = (Math.random() - 0.5) * 0.055;
      const jz = (Math.random() - 0.5) * 0.055;
      positions[i*3]   = sx + jx;
      positions[i*3+1] = sy + jy;
      positions[i*3+2] = sz + jz;
      aType[i]  = inStripe(sx, sy) ? 2.0 : 1.0; // type 2 = discarded in shader
      aPhase[i] = Math.random() * Math.PI * 2;
      aSpeed[i] = 0.5 + Math.random() * 2.2;
      // Size: slightly larger near equator (more visible area), smaller near poles
      const latFactor = 0.7 + 0.3 * (1.0 - Math.abs(sy));
      aSize[i]  = (0.006 + Math.random() * 0.009) * latFactor;
      aSeed[i]  = Math.random();
    }

    // ── Background particles ───────────────────────────────────────────────
    for (let i = 0; i < BG_N; i++) {
      const idx = SPHERE_N + i;
      // Fill entire container area (clipped by canvas/container)
      positions[idx*3]   = (Math.random() - 0.5) * 3.2;
      positions[idx*3+1] = (Math.random() - 0.5) * 3.2;
      positions[idx*3+2] = -0.8 + Math.random() * 0.4;
      aType[idx]  = 0.0;
      aPhase[idx] = Math.random() * Math.PI * 2;
      aSpeed[idx] = 0.2 + Math.random() * 0.9;
      aSize[idx]  = 0.003 + Math.random() * 0.005;
      aSeed[idx]  = Math.random();
    }

    return { positions, aPhase, aSpeed, aSize, aType, aSeed };
  }, []);

  const uniforms = useMemo(() => ({
    uTime:   { value: 0 },
    uBreath: { value: 1.0 },
    uMouse:  { value: new THREE.Vector2(9, 9) },
    uDpr:    { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1 },
  }), []);

  useFrame(({ clock, size }) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    const t = clock.getElapsedTime();
    u.uTime.value   = t;
    // Breathing: 8–12s cycle, ±1.5%
    u.uBreath.value = 1.0 + Math.sin(t * 0.59) * 0.013 + Math.sin(t * 0.23) * 0.006;
    // Map mouse from canvas px → NDC-like world coords
    const mx = mouse.current[0];
    const my = mouse.current[1];
    const wx = (mx / size.width  - 0.5) * 2.6;
    const wy = -(my / size.height - 0.5) * 2.6;
    u.uMouse.value.x += (wx - u.uMouse.value.x) * 0.04;
    u.uMouse.value.y += (wy - u.uMouse.value.y) * 0.04;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase"   args={[aPhase,    1]} />
        <bufferAttribute attach="attributes-aSpeed"   args={[aSpeed,    1]} />
        <bufferAttribute attach="attributes-aSize"    args={[aSize,     1]} />
        <bufferAttribute attach="attributes-aType"    args={[aType,     1]} />
        <bufferAttribute attach="attributes-aSeed"    args={[aSeed,     1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

// ─── Exported component ───────────────────────────────────────────────────────
export default function LinearLogo({ size = 260 }: { size?: number }) {
  const mouse        = useRef<[number, number]>([9999, 9999]);
  const containerRef = useRef<HTMLDivElement>(null);
  const radius       = size * 0.108; // ≈28px at size=260

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    mouse.current = [e.clientX - r.left, e.clientY - r.top];
  }, []);

  const onLeave = useCallback(() => {
    mouse.current = [9999, 9999];
  }, []);

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, scale: 0.86 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: size, height: size,
        borderRadius: radius,
        background: "#000",
        overflow: "hidden",
        position: "relative",
        userSelect: "none",
        cursor: "crosshair",
        boxShadow: [
          "0 0 0 1px rgba(255,255,255,0.07)",
          "0 32px 80px rgba(0,0,0,0.55)",
          "inset 0 1px 0 rgba(255,255,255,0.05)",
        ].join(", "),
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 2.9], fov: 42 }}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        style={{ background: "#000", display: "block", width: "100%", height: "100%" }}
        dpr={[1, 2]}
      >
        <Particles mouse={mouse} />
      </Canvas>
    </motion.div>
  );
}
