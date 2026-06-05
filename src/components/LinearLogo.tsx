"use client";
import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion, useDragControls } from "framer-motion";

// ─── Vertex Shader ────────────────────────────────────────────────────────────
const VERT = /* glsl */`
precision highp float;

attribute float aPhase;
attribute float aSpeed;
attribute float aSize;
attribute float aType;    // 0=bg, 1=sphere, 2=stripe-zone
attribute float aSeed;
attribute float aColor;   // 0=white, 0.5=light-gray, 1=dark-gray
attribute float aStripeT; // 0=solid, 0–1=feather zone, 1=stripe

uniform float uTime;
uniform float uBreath;
uniform vec2  uMouse;
uniform float uDpr;
uniform vec2  uRipple;    // ripple origin (world)
uniform float uRippleT;   // ripple time 0→1

varying float vAlpha;
varying float vBright;
varying float vType;
varying float vColor;
varying float vStar;      // >0 = render as star spike

// ── Simplex 2D noise ──────────────────────────────────────────────────────────
vec2 _s2hash(vec2 p){
  p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
  return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}
float simplex2(vec2 p){
  const float K1=0.366025404, K2=0.211324865;
  vec2 i = floor(p+(p.x+p.y)*K1);
  vec2 a = p - i + (i.x+i.y)*K2;
  vec2 o = step(a.yx,a.xy);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0*K2;
  vec3 h = max(0.5-vec3(dot(a,a),dot(b,b),dot(c,c)),0.0);
  vec3 n = h*h*h*h*vec3(dot(a,_s2hash(i)),dot(b,_s2hash(i+o)),dot(c,_s2hash(i+vec2(1,1))));
  return dot(n, vec3(70.0));
}
float fbm(vec2 p){
  float v=0.0,a=0.52;
  mat2 rot=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<5;i++){ v+=a*simplex2(p); p=rot*p; a*=0.48; }
  return v;
}

// ── Hash util ─────────────────────────────────────────────────────────────────
float hash1(float n){ return fract(sin(n)*43758.5453); }

void main(){
  vec3 pos = position;
  vType  = aType;
  vColor = aColor;
  vStar  = 0.0;

  // ── Discard stripe-core particles ────────────────────────────────────────
  if(aType > 1.5){
    gl_Position  = vec4(9.0,9.0,9.0,1.0);
    gl_PointSize = 0.0;
    vAlpha = 0.0; vBright = 0.0;
    return;
  }

  if(aType < 0.5){
    // ── Background particles ────────────────────────────────────────────────
    vec2 np = pos.xy * 1.6 + uTime * 0.038 * aSpeed + aSeed * 4.0;
    float nx = simplex2(np);
    float ny = simplex2(np + vec2(3.7, 8.1));
    pos.x += nx * 0.07 * aSpeed;
    pos.y += ny * 0.055 * aSpeed;

    float flicker = 0.28 + 0.72*(0.5+0.5*sin(uTime*aSpeed*2.8+aPhase*7.3));
    float drift   = 0.5  + 0.5 *sin(uTime*aSpeed*0.7+aPhase);
    vAlpha  = flicker * drift * 0.38;
    vBright = 0.2 + 0.3*drift;

  } else {
    // ── Sphere particles ────────────────────────────────────────────────────
    pos *= uBreath;

    // Multi-octave noise drift — each axis uses different noise domain
    float t = uTime * aSpeed * 0.32;
    vec2 np = pos.xy * 3.1 + t + aSeed * 6.28;
    float nx = fbm(np);
    float ny = fbm(np + vec2(4.3, 1.7));
    float nz = simplex2(np * 0.7 + vec2(9.1, 2.4));

    // driftAmp scales 0.5–3px (world) based on seed
    float driftAmp = 0.005 + aSeed * 0.011;
    pos.x += nx * driftAmp * 1.8;
    pos.y += ny * driftAmp * 1.8;
    pos.z += nz * driftAmp * 0.9;

    // Feathered stripe fade — aStripeT: 0=solid, 1=full stripe
    if(aStripeT > 0.01){
      float fade = smoothstep(0.0, 1.0, aStripeT);
      // Fade out in stripe transition zone
      vAlpha = (1.0 - fade * 0.94);
    }

    // Mouse ripple — luxurious, low strength
    vec2  delta = pos.xy - uMouse;
    float md    = length(delta);
    float mstr  = smoothstep(0.6, 0.0, md) * 0.052;
    pos.xy += normalize(delta + 0.001) * mstr;

    // Propagating ripple wave from entry point
    if(uRippleT > 0.0 && uRippleT < 1.0){
      vec2  rd    = pos.xy - uRipple;
      float rdist = length(rd);
      float wave  = sin((rdist - uRippleT * 2.2) * 14.0) * 0.5 + 0.5;
      float wenv  = smoothstep(0.0, 0.12, wave) *
                    smoothstep(uRippleT + 0.18, uRippleT, rdist) *
                    smoothstep(0.0, 0.12, uRippleT) *
                    smoothstep(1.0, 0.6, uRippleT) * 0.025;
      pos.xy += normalize(rd + 0.001) * wenv;
    }

    // ── Sparkle ─────────────────────────────────────────────────────────────
    float sp    = mod(uTime * aSpeed * 0.85 + aPhase * 6.283, 6.283);
    float spark = 0.3 + 0.7 * pow(0.5 + 0.5*sin(sp), 2.2);

    // Random flash — high-brightness bloom
    float flashSeed = aSeed + floor(uTime * aSpeed * 0.35);
    float flash     = step(0.91, hash1(flashSeed)) *
                      smoothstep(0.0, 0.25, fract(uTime * aSpeed * 0.35)) *
                      smoothstep(1.0, 0.5,  fract(uTime * aSpeed * 0.35));
    spark = mix(spark, 1.0, flash * 0.7);

    // Star spikes on very bright flashes
    vStar = flash * step(0.95, hash1(flashSeed + 0.3));

    // Edge falloff — denser center, lighter edges
    float dist2center = length(pos.xy);
    float edgeFade    = 1.0 - smoothstep(0.5, 1.08, dist2center);
    float depthFade   = 0.7 + 0.3 * (pos.z * 0.5 + 0.5); // z-parallax brightness

    float baseAlpha = aStripeT > 0.01
      ? (1.0 - smoothstep(0.0,1.0,aStripeT)*0.94) * spark * edgeFade
      : spark * edgeFade;

    vAlpha  = baseAlpha * depthFade;
    vBright = (0.5 + 0.5 * spark) * depthFade;
  }

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  // Z-parallax: deeper bg dots appear smaller
  float zScale = aType < 0.5 ? (0.55 + 0.45*(pos.z+0.8)*0.5) : 1.0;
  gl_PointSize = aSize * (330.0 / -mv.z) * uDpr * zScale;
  gl_Position  = projectionMatrix * mv;
}
`;

// ─── Fragment Shader ──────────────────────────────────────────────────────────
const FRAG = /* glsl */`
precision highp float;
varying float vAlpha;
varying float vBright;
varying float vType;
varying float vColor;
varying float vStar;

void main(){
  vec2  uv = gl_PointCoord - 0.5;
  float d  = length(uv);
  if(d > 0.5) discard;

  // Base round dot
  float core  = 1.0 - smoothstep(0.0, 0.20, d);
  float glow  = 1.0 - smoothstep(0.0, 0.50, d);
  float shape = core * 0.82 + glow * 0.28;

  // Star diffraction spikes on flash peaks
  if(vStar > 0.5){
    float angle = atan(uv.y, uv.x);
    float spike = pow(abs(sin(angle * 2.0)), 8.0); // 4-point star
    float spike6= pow(abs(sin(angle * 3.0)), 14.0); // 6-point
    float spikes = spike * 0.5 + spike6 * 0.3;
    float sRad   = smoothstep(0.5, 0.05, d) * spikes * vBright;
    shape = max(shape, sRad);
  }

  // Per-type color
  float shade;
  if(vType < 0.5){
    // Background: dark gray range
    shade = mix(0.22, 0.48, vBright);
  } else {
    // Sphere: white(0) → light-gray(0.5) → mid-gray(1.0)
    float lo = mix(0.78, 0.55, vColor);
    float hi = mix(1.00, 0.82, vColor);
    shade = mix(lo, hi, vBright);
  }

  // Rim glow additive for bright sparks
  float rim = smoothstep(0.25, 0.5, d) * smoothstep(0.5, 0.35, d) * vBright * 0.18;
  shade = min(1.0, shade + rim);

  gl_FragColor = vec4(vec3(shade), shape * vAlpha);
}
`;

// ─── Fibonacci sphere sampler ─────────────────────────────────────────────────
function fibSphere(n: number, r: number): Float32Array {
  const pts = new Float32Array(n * 3);
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y  = 1 - (i / (n - 1)) * 2;
    const rr = Math.sqrt(Math.max(0, 1 - y * y));
    const th = phi * i;
    pts[i*3]   = Math.cos(th) * rr * r;
    pts[i*3+1] = y * r;
    pts[i*3+2] = Math.sin(th) * rr * r;
  }
  return pts;
}

// ─── Stripe classifier — returns 0 (solid), 0–1 (feather), 1 (stripe) ────────
function stripeT(x: number, y: number): number {
  const cosA = Math.cos(Math.PI / 5.2);  // 34.6°
  const sinA = Math.sin(Math.PI / 5.2);
  const proj  = x * cosA + y * sinA;
  const period = 0.54;
  const coreW  = 0.155; // hard discard zone
  const featherW = 0.21; // feather out to this width
  const p = ((proj % period) + period) % period;
  if (p < coreW)    return 1.0;                          // full stripe
  if (p < featherW) return (p - coreW) / (featherW - coreW); // feather
  return 0.0;
}

// ─── Ripple trigger ref (module-level singleton) ────────────────────────────
const _ripple = { x: 0, y: 0, t: 2.0 };

// ─── Particle system ──────────────────────────────────────────────────────────
function Particles({ mouse, isMobile }: {
  mouse: React.MutableRefObject<[number, number]>;
  isMobile: boolean;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const SPHERE_N = isMobile ? 10000 : 36000;
  const BG_N     = isMobile ?  2000 :  6000;
  const TOTAL    = SPHERE_N + BG_N;

  const { positions, aPhase, aSpeed, aSize, aType, aSeed, aColor, aStripeT } = useMemo(() => {
    const positions = new Float32Array(TOTAL * 3);
    const aPhase    = new Float32Array(TOTAL);
    const aSpeed    = new Float32Array(TOTAL);
    const aSize     = new Float32Array(TOTAL);
    const aType     = new Float32Array(TOTAL);
    const aSeed     = new Float32Array(TOTAL);
    const aColor    = new Float32Array(TOTAL);
    const aStripeT  = new Float32Array(TOTAL);

    const sph = fibSphere(SPHERE_N, 1.0);

    for (let i = 0; i < SPHERE_N; i++) {
      const sx = sph[i*3], sy = sph[i*3+1], sz = sph[i*3+2];
      // Density-weighted jitter: less jitter near center-face (front hemisphere)
      const jScale = 0.04 + Math.abs(sz) * 0.025;
      positions[i*3]   = sx + (Math.random()-0.5)*jScale;
      positions[i*3+1] = sy + (Math.random()-0.5)*jScale;
      positions[i*3+2] = sz + (Math.random()-0.5)*jScale;

      const st = stripeT(sx, sy);
      aType[i]    = st >= 1.0 ? 2.0 : 1.0;
      aStripeT[i] = st;
      aPhase[i]   = Math.random() * Math.PI * 2;
      aSpeed[i]   = 0.45 + Math.random() * 2.4;

      // Size: larger near front (z>0), smaller at back; equator bonus
      const latFactor  = 0.65 + 0.35 * (1.0 - Math.abs(sy));
      const depthBonus = 0.8 + 0.4 * (sz * 0.5 + 0.5);
      aSize[i]  = (0.007 + Math.random() * 0.011) * latFactor * depthBonus;
      aSeed[i]  = Math.random();

      // Color distribution: heavily white-biased
      const cr = Math.random();
      aColor[i] = cr < 0.82 ? 0.0 : cr < 0.94 ? 0.5 : 1.0;
    }

    for (let i = 0; i < BG_N; i++) {
      const idx = SPHERE_N + i;
      // Stratified placement for even coverage
      positions[idx*3]   = (Math.random()-0.5)*3.4;
      positions[idx*3+1] = (Math.random()-0.5)*3.4;
      positions[idx*3+2] = -1.2 + Math.random()*0.7;
      aType[idx]    = 0.0;
      aPhase[idx]   = Math.random()*Math.PI*2;
      aSpeed[idx]   = 0.15 + Math.random()*0.85;
      aSize[idx]    = 0.0025 + Math.random()*0.0045;
      aSeed[idx]    = Math.random();
      aColor[idx]   = 0.8 + Math.random()*0.2;
      aStripeT[idx] = 0.0;
    }

    return { positions, aPhase, aSpeed, aSize, aType, aSeed, aColor, aStripeT };
  }, []);

  const uniforms = useMemo(() => ({
    uTime:    { value: 0 },
    uBreath:  { value: 1.0 },
    uMouse:   { value: new THREE.Vector2(9, 9) },
    uDpr:     { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1 },
    uRipple:  { value: new THREE.Vector2(0, 0) },
    uRippleT: { value: 2.0 },
  }), []);

  useFrame(({ clock, size }) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    const t = clock.getElapsedTime();

    u.uTime.value  = t;
    // Breathing: two-frequency, 8–12s effective period
    u.uBreath.value = 1.0
      + Math.sin(t * 0.58) * 0.014
      + Math.sin(t * 0.22) * 0.007
      + Math.sin(t * 0.091) * 0.003;

    // Smooth mouse
    const wx = (mouse.current[0] / size.width  - 0.5) * 2.7;
    const wy = -(mouse.current[1] / size.height - 0.5) * 2.7;
    u.uMouse.value.x += (wx - u.uMouse.value.x) * 0.038;
    u.uMouse.value.y += (wy - u.uMouse.value.y) * 0.038;

    // Ripple propagation
    if (_ripple.t <= 1.0) {
      _ripple.t += 0.008;
      u.uRipple.value.set(_ripple.x, _ripple.y);
      u.uRippleT.value = _ripple.t;
    }
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position"  args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase"    args={[aPhase,    1]} />
        <bufferAttribute attach="attributes-aSpeed"    args={[aSpeed,    1]} />
        <bufferAttribute attach="attributes-aSize"     args={[aSize,     1]} />
        <bufferAttribute attach="attributes-aType"     args={[aType,     1]} />
        <bufferAttribute attach="attributes-aSeed"     args={[aSeed,     1]} />
        <bufferAttribute attach="attributes-aColor"    args={[aColor,    1]} />
        <bufferAttribute attach="attributes-aStripeT"  args={[aStripeT,  1]} />
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

// ─── Exported component ────────────────────────────────────────────────────────
export default function LinearLogo({ size = 260 }: { size?: number }) {
  const mouse        = useRef<[number, number]>([9999, 9999]);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const radius       = size * 0.108;
  const isMobile     = typeof window !== "undefined" && window.innerWidth < 768;

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    mouse.current = [e.clientX - r.left, e.clientY - r.top];
  }, []);

  const onEnter = useCallback((e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    _ripple.x = (((e.clientX - r.left) / r.width)  - 0.5) * 2.7;
    _ripple.y = -(((e.clientY - r.top)  / r.height) - 0.5) * 2.7;
    _ripple.t = 0.0;
  }, []);

  const onLeave = useCallback(() => {
    mouse.current = [9999, 9999];
  }, []);

  return (
    /* Outer draggable wrapper — sits above canvas, no overflow clip */
    <motion.div
      drag
      dragControls={dragControls}
      dragMomentum={true}
      dragElastic={0.12}
      dragTransition={{ power: 0.18, timeConstant: 220 }}
      whileDrag={{ scale: 1.04, cursor: "grabbing" }}
      initial={{ opacity: 0, scale: 0.84 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: size, height: size,
        position: "relative",
        userSelect: "none",
        cursor: "grab",
        touchAction: "none",
        zIndex: 10,
        filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.45))",
      }}
    >
      {/* Inner canvas container — rounded clip */}
      <div
        ref={containerRef}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onPointerDown={(e) => dragControls.start(e)}
        style={{
          width: "100%", height: "100%",
          borderRadius: radius,
          background: "#000",
          overflow: "hidden",
          position: "relative",
          boxShadow: [
            "0 0 0 1px rgba(255,255,255,0.09)",
            "0 0 0 1px rgba(255,255,255,0.04) inset",
          ].join(", "),
        }}
      >
        {/* Animated shimmer border */}
        <motion.div
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none",
            borderRadius: radius,
            border: "1px solid transparent",
            backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.12) 60%, transparent 100%)",
            backgroundSize: "200% 100%",
            backgroundOrigin: "border-box",
            WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            maskComposite: "exclude",
          }}
        />
        {/* Radial vignette */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 15, pointerEvents: "none",
          borderRadius: radius,
          background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 55%, rgba(0,0,0,0.5) 100%)",
        }} />

        <Canvas
          camera={{ position: [0, 0, 2.9], fov: 42 }}
          gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
          style={{ background: "#000", display: "block", width: "100%", height: "100%" }}
          dpr={[1, 2]}
        >
          <Particles mouse={mouse} isMobile={isMobile} />
        </Canvas>
      </div>
    </motion.div>
  );
}
