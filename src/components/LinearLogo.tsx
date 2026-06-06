"use client";
import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";

// ── Simplex noise GLSL (Ian McEwan / Ashima Arts, MIT) ────────────────────────
const NOISE = /* glsl */`
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy)),x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz),l=1.-g;
  vec3 i1=min(g.xyz,l.zxy),i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx,x2=x0-i2+C.yyy,x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z),x_=floor(j*ns.z),y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy,y=y_*ns.x+ns.yyyy,h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy),b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.,s1=floor(b1)*2.+1.,sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy,a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x),p1=vec3(a0.zw,h.y),p2=vec3(a1.xy,h.z),p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

// ── Vertex shader ─────────────────────────────────────────────────────────────
const VERT = /* glsl */`
${NOISE}

// per-particle attributes
attribute vec3  aBase;    // xy = rest position (NDC-space), z = zone (0=bg, 1=sphere)
attribute float aPhase;   // random seed [0, 2π]
attribute float aSpeed;   // sparkle/drift speed multiplier
attribute float aSize;    // base point radius
attribute float aDist;    // distance from sphere centre, normalised [0,1]
attribute float aStripe;  // 1 = lives inside a stripe cutout → discard
attribute float aColor;   // 0=white 1=e5e5 2=cfcf

uniform float uTime;
uniform float uBreath;    // 1.00–1.02 breathing scale
uniform vec2  uMouse;     // NDC [-1,1], (9,9) = off-canvas
uniform float uHover;     // 0→1 smooth hover activation
uniform float uDpr;

varying float vAlpha;
varying float vBright;
varying float vColor;     // passed to frag for palette

void main(){
  // ── hard-discard stripe cutouts ────────────────────────────────────────
  if(aStripe > 0.5){
    gl_Position=vec4(9.,9.,9.,1.); gl_PointSize=0.; vAlpha=0.; return;
  }

  vec2 p   = aBase.xy * uBreath;
  float zone = aBase.z;

  // ── Simplex noise drift — unique path per particle ──────────────────────
  float driftAmp = (zone > 0.5)
    ? mix(0.007, 0.020, 1.0-aDist)   // sphere: inner particles drift more
    : 0.016;                           // bg
  float t = uTime;
  p.x += snoise(vec3(aBase.xy*2.1,       t*0.26+aPhase)) * driftAmp;
  p.y += snoise(vec3(aBase.xy*2.1 + 5.7, t*0.26+aPhase)) * driftAmp;

  // ── Cursor soft ATTRACTION (5–10%, linear.app spec) ───────────────────
  vec2  toM  = uMouse - p;
  float mLen = length(toM);
  float pull = smoothstep(0.50, 0.0, mLen) * 0.07 * uHover;
  if(mLen > 0.001) p += normalize(toM) * pull;

  // ── Per-particle sparkle brightness ────────────────────────────────────
  float sparkle = 0.4 + 0.6 * abs(sin(t * aSpeed * 0.85 + aPhase * 6.2831));

  // ── Alpha: edge fade for sphere, dim for background ─────────────────────
  float eFade = (zone > 0.5) ? (1.0 - smoothstep(0.78, 1.0, aDist)) : 1.0;
  float zDim  = (zone > 0.5) ? 1.0 : 0.28;
  float alpha = sparkle * eFade * zDim;

  // ── Halftone density — shadow = dense, highlight = sparse ───────────────
  if(zone > 0.5){
    // Highlight direction: top-right (Linear logo convention)
    vec2  c  = aBase.xy;
    float hl = dot(normalize(c + 0.001), vec2(0.707, 0.707));
    // Clamp so neither extreme is fully empty
    float ht = clamp(0.25 + 0.75*(0.5 - hl*0.55), 0.15, 1.0);
    alpha *= ht;
  }

  vAlpha  = clamp(alpha, 0.0, 1.0);
  vBright = sparkle;
  vColor  = aColor;

  gl_Position  = vec4(p, 0.0, 1.0);

  // Larger toward sphere centre, smaller in bg
  float sScale = (zone > 0.5)
    ? (0.8 + 0.55*(1.0-aDist) + 0.22*sparkle)
    : (0.35 + 0.18*sparkle);
  gl_PointSize = aSize * uDpr * sScale;
}`;

// ── Fragment shader — white/grey palette on black bg ──────────────────────────
const FRAG = /* glsl */`
precision highp float;
varying float vAlpha;
varying float vBright;
varying float vColor;

void main(){
  // Soft circular disc per point
  vec2  uv = gl_PointCoord - 0.5;
  float d  = dot(uv,uv);
  if(d > 0.25) discard;
  float soft = 1.0 - smoothstep(0.08, 0.25, d);

  // Palette: 0=#FFF, 1=#E5E5E5, 2=#CFCFCF
  float c0 = 1.00;
  float c1 = mix(0.82, 1.00, vBright);  // #E5
  float c2 = mix(0.68, 0.92, vBright);  // #CF
  float lum = (vColor < 0.5) ? c0
            : (vColor < 1.5) ? c1
            :                  c2;

  gl_FragColor = vec4(lum, lum, lum, soft * vAlpha);
}`;

// ── Stripe mask (3 diagonal bands ~31.5°) ────────────────────────────────────
function isStripe(x: number, y: number): boolean {
  const cos = Math.cos(Math.PI * 0.175);
  const sin = Math.sin(Math.PI * 0.175);
  const proj = x * cos + y * sin;
  const period = 0.50;
  const width  = 0.148;
  const m = ((proj % period) + period) % period;
  return m < width;
}

// ── Build all particle buffers ────────────────────────────────────────────────
function buildParticles(N: number) {
  const SR = 0.70;   // sphere radius in NDC
  const CX = 0.06, CY = 0.04;  // slight offset → upper-right feel

  const sphereN = Math.round(N * 0.82);
  const bgN     = N - sphereN;

  const base    = new Float32Array(N * 3);
  const phase   = new Float32Array(N);
  const speed   = new Float32Array(N);
  const size    = new Float32Array(N);
  const dist    = new Float32Array(N);
  const stripe  = new Float32Array(N);
  const color   = new Float32Array(N);  // 0/1/2 → #FFF/#E5/#CF
  let n = 0;

  // ── Sphere: Fibonacci disc for even coverage ──────────────────────────
  const PHI = Math.PI * (3 - Math.sqrt(5));
  const S   = Math.round(sphereN * 3.5);
  for (let i = 0; i < S && n < sphereN; i++) {
    const r  = Math.sqrt((i + 0.5) / S) * SR;
    const th = PHI * i;
    const bx = Math.cos(th) * r + CX + (Math.random() - 0.5) * 0.006;
    const by = Math.sin(th) * r + CY + (Math.random() - 0.5) * 0.006;
    const dc = Math.sqrt((bx - CX) ** 2 + (by - CY) ** 2) / SR;
    if (dc > 1.0) continue;

    // Halftone density rejection — highlight side is sparser
    const hl  = ((bx - CX) + (by - CY)) / (SR * 1.414);
    const den = Math.min(1, Math.max(0.12, 0.38 + 0.62 * (0.5 - hl * 0.5)));
    if (Math.random() > den) continue;

    base[n*3]=bx; base[n*3+1]=by; base[n*3+2]=1;
    phase[n] = Math.random() * Math.PI * 2;
    speed[n] = 0.3  + Math.random() * 1.5;
    size[n]  = (1.1 + Math.random() * 1.3) * (0.55 + 0.45 * (1 - dc));
    dist[n]  = dc;
    stripe[n]= isStripe(bx - CX, by - CY) ? 1 : 0;
    // Colour distribution: 55% white, 30% #E5, 15% #CF
    const cr = Math.random();
    color[n] = cr < 0.55 ? 0 : cr < 0.85 ? 1 : 2;
    n++;
  }

  // Fill remaining sphere quota with uniform random
  let att = 0;
  while (n < sphereN) {
    if (++att > sphereN * 25) break;
    const th = Math.random() * Math.PI * 2;
    const r  = Math.sqrt(Math.random()) * SR * 0.98;
    const bx = Math.cos(th) * r + CX;
    const by = Math.sin(th) * r + CY;
    const dc = Math.sqrt((bx - CX) ** 2 + (by - CY) ** 2) / SR;
    const hl = ((bx - CX) + (by - CY)) / (SR * 1.414);
    const den = Math.min(1, Math.max(0.12, 0.38 + 0.62 * (0.5 - hl * 0.5)));
    if (Math.random() > den) continue;
    base[n*3]=bx; base[n*3+1]=by; base[n*3+2]=1;
    phase[n]=Math.random()*Math.PI*2;
    speed[n]=0.25+Math.random()*1.3;
    size[n]=(0.9+Math.random()*1.1)*(0.5+0.5*(1-dc));
    dist[n]=dc;
    stripe[n]=isStripe(bx-CX,by-CY)?1:0;
    const cr=Math.random(); color[n]=cr<0.55?0:cr<0.85?1:2;
    n++; att=0;
  }

  // ── Background: dim sparse dots filling the black square ─────────────
  const bgEnd = n + bgN;
  let ba = 0;
  while (n < bgEnd) {
    if (++ba > bgN * 25) break;
    const bx = (Math.random() - 0.5) * 1.92;
    const by = (Math.random() - 0.5) * 1.92;
    // Keep background dots outside sphere boundary
    if (Math.sqrt((bx-CX)**2+(by-CY)**2) < SR * 1.04) continue;
    base[n*3]=bx; base[n*3+1]=by; base[n*3+2]=0;
    phase[n]=Math.random()*Math.PI*2;
    speed[n]=0.08+Math.random()*0.45;
    size[n]=0.35+Math.random()*0.5;
    dist[n]=0.5;
    stripe[n]=0;
    // Background dots are dimmer — mostly #CF, some #E5
    color[n]=Math.random()<0.5?2:1;
    n++; ba=0;
  }

  return { base, phase, speed, size, dist, stripe, color, count: n };
}

// ── Inner Three.js / R3F scene ────────────────────────────────────────────────
function ParticleField({ count }: { count: number }) {
  const matRef        = useRef<THREE.ShaderMaterial>(null);
  const mouseRef      = useRef<[number, number]>([9, 9]);
  const hoverTarget   = useRef(0);
  const hoverSmooth   = useRef(0);
  const { gl }        = useThree();

  const dpr = useMemo(() =>
    Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2),
  []);

  // Build geometry once
  const geo = useMemo(() => {
    const d = buildParticles(count);
    const g = new THREE.BufferGeometry();
    g.setAttribute("aBase",   new THREE.BufferAttribute(d.base,   3));
    g.setAttribute("aPhase",  new THREE.BufferAttribute(d.phase,  1));
    g.setAttribute("aSpeed",  new THREE.BufferAttribute(d.speed,  1));
    g.setAttribute("aSize",   new THREE.BufferAttribute(d.size,   1));
    g.setAttribute("aDist",   new THREE.BufferAttribute(d.dist,   1));
    g.setAttribute("aStripe", new THREE.BufferAttribute(d.stripe, 1));
    g.setAttribute("aColor",  new THREE.BufferAttribute(d.color,  1));
    return g;
  }, [count]);

  useEffect(() => () => geo.dispose(), [geo]);

  // Shader material — AdditiveBlending on black bg = correct white glow
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
      uHover:  { value: 0.0 },
      uDpr:    { value: dpr },
    },
  }), [dpr]);

  useEffect(() => () => mat.dispose(), [mat]);

  // Mouse events on the canvas element
  useEffect(() => {
    const cv = gl.domElement;
    const onMove = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      mouseRef.current = [
        ((e.clientX - r.left) / r.width)  * 2 - 1,
        -(((e.clientY - r.top) / r.height) * 2 - 1),
      ];
      hoverTarget.current = 1;
    };
    const onLeave = () => { hoverTarget.current = 0; mouseRef.current = [9, 9]; };
    cv.addEventListener("mousemove",  onMove);
    cv.addEventListener("mouseleave", onLeave);
    return () => {
      cv.removeEventListener("mousemove",  onMove);
      cv.removeEventListener("mouseleave", onLeave);
    };
  }, [gl]);

  useFrame(({ clock }, delta) => {
    if (!matRef.current) return;
    const t = clock.getElapsedTime();

    // Smooth hover activation (ease ~120ms)
    hoverSmooth.current = THREE.MathUtils.lerp(
      hoverSmooth.current, hoverTarget.current,
      1 - Math.exp(-delta * 9)
    );

    // Breathing: dual-frequency so it never feels mechanical
    const breath = 1.0
      + Math.sin(t * 0.40) * 0.010
      + Math.sin(t * 0.19) * 0.004;

    const u = matRef.current.uniforms;
    u.uTime.value   = t;
    u.uBreath.value = breath;
    u.uHover.value  = hoverSmooth.current;
    u.uMouse.value.set(mouseRef.current[0], mouseRef.current[1]);
  });

  return (
    <points geometry={geo}>
      <primitive object={mat} ref={matRef} attach="material" />
    </points>
  );
}

// ── Public component ──────────────────────────────────────────────────────────
export default function LinearLogo({ size = 320 }: { size?: number }) {
  const count = useMemo(() => {
    if (typeof window === "undefined") return 35_000;
    const mob = window.innerWidth < 768;
    const low = (navigator.hardwareConcurrency ?? 4) <= 4;
    if (mob) return low ? 8_000 : 12_000;
    return low ? 30_000 : 48_000;
  }, []);

  return (
    // Framer Motion breathing wrapper (scale 1.00→1.02→1.00, 9s)
    <motion.div
      style={{ width: size, height: size, flexShrink: 0, position: "relative" }}
      animate={{ scale: [1.0, 1.02, 1.0] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Black rounded square container */}
      <div style={{
        position:     "absolute",
        inset:        0,
        width:        size,
        height:       size,
        borderRadius: "28px",
        overflow:     "hidden",
        background:   "#000000",
      }}>
        <Canvas
          gl={{
            alpha:           false,
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
