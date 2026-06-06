"use client";
import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";

// ─── Inline simplex noise (no external dep) ────────────────────────────────
const SIMPLEX_GLSL = /* glsl */`
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.,i1.z,i2.z,1.))
   +i.y+vec4(0.,i1.y,i2.y,1.))
   +i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

// ─── Vertex shader ──────────────────────────────────────────────────────────
const VERT = /* glsl */`
${SIMPLEX_GLSL}

attribute vec3  aOffset;
attribute float aPhase;
attribute float aSpeed;
attribute float aSize;
attribute float aDist;
attribute float aStripeT;

uniform float uTime;
uniform float uBreath;
uniform vec2  uMouse;
uniform float uDpr;

varying float vAlpha;
varying float vBright;
varying float vZone;

void main() {
  // Discard stripe particles — push off screen
  if (aStripeT > 0.5) {
    gl_Position  = vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = 0.0;
    vAlpha       = 0.0;
    return;
  }

  vec2 p = aOffset.xy * uBreath;
  vZone  = aOffset.z;

  // ── Simplex noise drift ──────────────────────────────────────────────────
  float driftStr = (vZone > 0.5)
    ? mix(0.008, 0.022, 1.0 - aDist)
    : 0.018;

  p.x += snoise(vec3(aOffset.xy * 2.0,       uTime * 0.28 + aPhase)) * driftStr;
  p.y += snoise(vec3(aOffset.xy * 2.0 + 5.3, uTime * 0.28 + aPhase)) * driftStr;

  // ── Mouse attraction ─────────────────────────────────────────────────────
  vec2  toMouse = uMouse - p;
  float mDist   = length(toMouse);
  float pull    = smoothstep(0.38, 0.0, mDist) * 0.055;
  if (mDist > 0.001) p += normalize(toMouse) * pull;

  // ── Sparkle ───────────────────────────────────────────────────────────────
  float sparkle = 0.4 + 0.6 * abs(sin(uTime * aSpeed * 0.9 + aPhase * 6.2831));

  // ── Alpha ─────────────────────────────────────────────────────────────────
  float edgeFade = (vZone > 0.5) ? (1.0 - smoothstep(0.82, 1.0, aDist)) : 1.0;
  float zoneDim  = (vZone > 0.5) ? 1.0 : 0.18;
  vAlpha  = clamp(sparkle * edgeFade * zoneDim, 0.0, 1.0);
  vBright = sparkle;

  // ── Halftone density (shadow = dense, highlight = sparse) ─────────────────
  if (vZone > 0.5) {
    vec2  centered  = aOffset.xy;
    float highlight = (centered.x + centered.y) / 1.41;
    float htone     = smoothstep(-0.4, 0.6, -highlight);
    vAlpha *= 0.35 + 0.65 * htone;
  }

  gl_Position = vec4(p, 0.0, 1.0);

  float sizeScale = (vZone > 0.5)
    ? (0.85 + 0.6 * (1.0 - aDist) + 0.25 * sparkle)
    : (0.4  + 0.2 * sparkle);
  gl_PointSize = aSize * uDpr * sizeScale;
}`;

// ─── Fragment shader ─────────────────────────────────────────────────────────
const FRAG = /* glsl */`
precision highp float;
varying float vAlpha;
varying float vBright;
varying float vZone;

void main() {
  vec2  uv = gl_PointCoord - 0.5;
  float d  = dot(uv, uv);
  if (d > 0.25) discard;
  float soft = 1.0 - smoothstep(0.10, 0.25, d);

  float lum = (vZone > 0.5)
    ? mix(0.95, 1.0,  vBright)
    : mix(0.75, 1.0, vBright);

  gl_FragColor = vec4(lum, lum, lum, soft * vAlpha);
}`;

// ─── Stripe test — fixed angle ~31.5° to match Linear logo ───────────────
function inStripe(x: number, y: number): boolean {
  const angle  = Math.PI * 0.175; // ~31.5° (was 0.22 / ~39°)
  const proj   = x * Math.cos(angle) + y * Math.sin(angle);
  const period = 0.52;
  const width  = 0.155;
  const mod    = ((proj % period) + period) % period;
  return mod < width;
}

// ─── Build particle attribute arrays ────────────────────────────────────────
function buildParticles(count: number) {
  const SPHERE_R = 0.72;
  const CENTER_X = 0.08;
  const CENTER_Y = 0.05;

  const sphereTarget = Math.round(count * 0.80);
  const bgTarget     = count - sphereTarget;

  const offsets = new Float32Array(count * 3);
  const phases  = new Float32Array(count);
  const speeds  = new Float32Array(count);
  const sizes   = new Float32Array(count);
  const dists   = new Float32Array(count);
  const stripes = new Float32Array(count);

  let n = 0;

  // ── Sphere particles via Fibonacci spiral ────────────────────────────────
  const phi = Math.PI * (3 - Math.sqrt(5));
  const S   = Math.round(sphereTarget * 4);

  for (let i = 0; i < S && n < sphereTarget; i++) {
    const r  = Math.sqrt((i + 0.5) / S) * SPHERE_R;
    const th = phi * i;
    const bx = Math.cos(th) * r + CENTER_X + (Math.random() - 0.5) * 0.007;
    const by = Math.sin(th) * r + CENTER_Y + (Math.random() - 0.5) * 0.007;
    const dc = Math.sqrt((bx - CENTER_X) ** 2 + (by - CENTER_Y) ** 2) / SPHERE_R;

    if (dc > 1.0) continue;

    // FIX: clamped halftone density
    const highlight = ((bx - CENTER_X) + (by - CENTER_Y)) / (SPHERE_R * 1.41);
    const density   = Math.min(1.0, Math.max(0.1, 0.35 + 0.65 * (0.5 - highlight * 0.5)));
    if (Math.random() > density) continue;

    offsets[n * 3]     = bx;
    offsets[n * 3 + 1] = by;
    offsets[n * 3 + 2] = 1.0;
    phases[n]          = Math.random() * Math.PI * 2;
    speeds[n]          = 0.25 + Math.random() * 1.4;
    sizes[n]           = (1.2 + Math.random() * 1.6) * (0.6 + 0.4 * (1 - dc));
    dists[n]           = dc;
    stripes[n]         = inStripe(bx - CENTER_X, by - CENTER_Y) ? 1 : 0;
    n++;
  }

  // FIX: fallback loop also applies density rejection + safety counter
  let attempts = 0;
  while (n < sphereTarget) {
    if (++attempts > sphereTarget * 20) break; // safety
    const th = Math.random() * Math.PI * 2;
    const r  = Math.sqrt(Math.random()) * SPHERE_R * 0.99;
    const bx = Math.cos(th) * r + CENTER_X;
    const by = Math.sin(th) * r + CENTER_Y;
    const dc = Math.sqrt((bx - CENTER_X) ** 2 + (by - CENTER_Y) ** 2) / SPHERE_R;

    const highlight = ((bx - CENTER_X) + (by - CENTER_Y)) / (SPHERE_R * 1.41);
    const density   = Math.min(1.0, Math.max(0.1, 0.35 + 0.65 * (0.5 - highlight * 0.5)));
    if (Math.random() > density) continue;

    offsets[n * 3]     = bx;
    offsets[n * 3 + 1] = by;
    offsets[n * 3 + 2] = 1.0;
    phases[n]          = Math.random() * Math.PI * 2;
    speeds[n]          = 0.2 + Math.random() * 1.2;
    sizes[n]           = (0.8 + Math.random() * 1.2) * (0.5 + 0.5 * (1 - dc));
    dists[n]           = dc;
    stripes[n]         = inStripe(bx - CENTER_X, by - CENTER_Y) ? 1 : 0;
    n++;
    attempts = 0; // reset on success
  }

  // ── Background particles — FIX: safety counter ───────────────────────────
  const bgEnd = n + bgTarget;
  let bgAttempts = 0;
  while (n < bgEnd) {
    if (++bgAttempts > bgTarget * 20) break; // safety
    const bx = (Math.random() - 0.5) * 1.9;
    const by = (Math.random() - 0.5) * 1.9;
    const dc = Math.sqrt((bx - CENTER_X) ** 2 + (by - CENTER_Y) ** 2);
    if (dc < SPHERE_R * 1.05) continue;

    offsets[n * 3]     = bx;
    offsets[n * 3 + 1] = by;
    offsets[n * 3 + 2] = 0.0;
    phases[n]          = Math.random() * Math.PI * 2;
    speeds[n]          = 0.1 + Math.random() * 0.6;
    sizes[n]           = 0.3 + Math.random() * 0.5;
    dists[n]           = 0.5;
    stripes[n]         = 0;
    n++;
    bgAttempts = 0; // reset on success
  }

  return { offsets, phases, speeds, sizes, dists, stripes, count: n };
}

// ─── Inner R3F component ─────────────────────────────────────────────────────
function ParticleField({ count }: { count: number }) {
  // FIX: matRef typed correctly, no double-attach
  const matRef   = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef<[number, number]>([9, 9]);
  const { gl }   = useThree();

  // FIX: DPR in useMemo so it's stable
  const dpr = useMemo(() => Math.min(
    typeof window !== "undefined" ? window.devicePixelRatio : 1,
    2
  ), []);

  // Build geometry once + dispose on unmount
  const geo = useMemo(() => {
    const data = buildParticles(count);
    const g    = new THREE.BufferGeometry();
    g.setAttribute("aOffset",  new THREE.BufferAttribute(data.offsets, 3));
    g.setAttribute("aPhase",   new THREE.BufferAttribute(data.phases,  1));
    g.setAttribute("aSpeed",   new THREE.BufferAttribute(data.speeds,  1));
    g.setAttribute("aSize",    new THREE.BufferAttribute(data.sizes,   1));
    g.setAttribute("aDist",    new THREE.BufferAttribute(data.dists,   1));
    g.setAttribute("aStripeT", new THREE.BufferAttribute(data.stripes, 1));
    return g;
  }, [count]);

  // FIX: cleanup geometry on unmount
  useEffect(() => {
    return () => { geo.dispose(); };
  }, [geo]);

  // Shader material
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   VERT,
    fragmentShader: FRAG,
    transparent:    true,
    depthWrite:     false,
    depthTest:      false,
    blending:       THREE.AdditiveBlending,
    uniforms: {
      uTime:   { value: 0 },
      uBreath: { value: 1.0 },
      uMouse:  { value: new THREE.Vector2(9, 9) },
      uDpr:    { value: dpr },
    },
  }), [dpr]);

  // FIX: cleanup material on unmount
  useEffect(() => {
    return () => { mat.dispose(); };
  }, [mat]);

  // Mouse tracking
  useEffect(() => {
    const canvas  = gl.domElement;
    const onMove  = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx   = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      const ny   = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current = [nx, ny];
    };
    const onLeave = () => { mouseRef.current = [9, 9]; };
    canvas.addEventListener("mousemove",  onMove);
    canvas.addEventListener("mouseleave", onLeave);
    return () => {
      canvas.removeEventListener("mousemove",  onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [gl]);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const t = clock.getElapsedTime();
    matRef.current.uniforms.uTime.value  = t;
    matRef.current.uniforms.uMouse.value.set(mouseRef.current[0], mouseRef.current[1]);
    // Internal breathing pulse (complements Framer Motion outer scale)
    const breath = 1.0 + Math.sin(t * 0.38) * 0.009 + Math.sin(t * 0.17) * 0.004;
    matRef.current.uniforms.uBreath.value = breath;
  });

  // FIX: single material attachment via ref — no double-attach
  return (
    <points geometry={geo}>
      <primitive object={mat} ref={matRef} attach="material" />
    </points>
  );
}

// ─── Exported component ──────────────────────────────────────────────────────
export default function LinearLogo({ size = 320 }: { size?: number }) {
  const count = useMemo(() => {
    if (typeof window === "undefined") return 30_000;
    const mobile = window.innerWidth < 768;
    const lowEnd = (navigator.hardwareConcurrency ?? 4) <= 4;
    if (mobile) return lowEnd ? 8_000 : 12_000;
    return lowEnd ? 30_000 : 48_000;
  }, []);

  return (
    <motion.div
      className="relative block"
      style={{ width: size, height: size, flexShrink: 0 }}
      animate={{ scale: [1.0, 1.02, 1.0] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Black rounded square */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#000000",
          borderRadius: "28px",
          overflow: "hidden",
          width: size,
          height: size,
        }}
      >
        <Canvas
          gl={{
            alpha:           false,  // solid black background
            antialias:       false,
            powerPreference: "high-performance",
            stencil:         false,
            depth:           false,
          }}
          dpr={[1, 2]}
          camera={{ position: [0, 0, 1], near: 0.01, far: 10, fov: 90 }}
          style={{ display: "block", width: size, height: size }}
          frameloop="always"
          onCreated={({ gl }) => gl.setClearColor(0x000000, 1)}
        >
          <ParticleField count={count} />
        </Canvas>
      </div>
    </motion.div>
  );
}
