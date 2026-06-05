"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";

// ── GLSL for the organic morphing sphere ────────────────────────────────────
const vertexShader = /* glsl */`
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uMorphStrength;

  varying vec3  vNormal;
  varying vec3  vPos;
  varying vec2  vUv;
  varying float vNoise;

  // Smooth 3D noise
  vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec4 mod289(vec4 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3  i  = floor(v + dot(v, C.yyy));
    vec3  x0 = v - i + dot(i, C.xxx);
    vec3  g  = step(x0.yzx, x0.xyz);
    vec3  l  = 1.0 - g;
    vec3  i1 = min(g.xyz, l.zxy);
    vec3  i2 = max(g.xyz, l.zxy);
    vec3  x1 = x0 - i1 + C.xxx;
    vec3  x2 = x0 - i2 + C.yyy;
    vec3  x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0,i1.z,i2.z,1.0))
      + i.y + vec4(0.0,i1.y,i2.y,1.0))
      + i.x + vec4(0.0,i1.x,i2.x,1.0));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0*floor(p*ns.z*ns.z);
    vec4 x_ = floor(j*ns.z); vec4 y_ = floor(j - 7.0*x_);
    vec4 x  = x_ *ns.x + ns.yyyy;
    vec4 y  = y_ *ns.x + ns.yyyy;
    vec4 h  = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m*m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main(){
    vUv     = uv;
    vNormal = normal;

    // Multi-octave noise displacement — organic surface
    float t   = uTime * 0.28;
    float n1  = snoise(normal * 2.2 + t);
    float n2  = snoise(normal * 4.8 - t * 0.6) * 0.5;
    float n3  = snoise(normal * 9.0 + t * 1.1) * 0.25;
    float n   = (n1 + n2 + n3) * uMorphStrength;

    // Breathing: slow sine pulse
    float breath = sin(uTime * 0.55) * 0.012 + sin(uTime * 0.23) * 0.006;

    // Mouse magnetic pull on nearest hemisphere
    float mInfluence = smoothstep(1.6, 0.0, length(uMouse)) * 0.018;
    vec3  displaced  = normal * (1.0 + n + breath + mInfluence);

    vNoise = n;
    vPos   = displaced;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = /* glsl */`
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uLightAngle;

  varying vec3  vNormal;
  varying vec3  vPos;
  varying vec2  vUv;
  varying float vNoise;

  // Hash for halftone/grain
  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
  float hash3(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }

  float noise2(vec2 p){
    vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
               mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }

  void main(){
    // ── Moving light ──────────────────────────────────────────
    float la  = uLightAngle;
    vec3  lDir = normalize(vec3(cos(la)*1.2, sin(la*0.7+0.4)*0.8, 1.5));
    float diff = max(dot(normalize(vNormal), lDir), 0.0);

    // Fresnel rim
    vec3  viewDir = normalize(vec3(0.0, 0.0, 1.0) - vPos);
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 2.8);

    // ── Diagonal stripes (like Linear logo) ──────────────────
    float stripeCoord = (vUv.x - vUv.y) * 5.5 + uTime * 0.04;
    float stripe      = smoothstep(0.38, 0.42, fract(stripeCoord));
    stripe           *= smoothstep(0.62, 0.58, fract(stripeCoord));

    // ── Halftone dithering ────────────────────────────────────
    // Dynamic dot grid animated with time
    float dotScale = 14.0 + sin(uTime * 0.3) * 1.5;
    vec2  dotUv    = vUv * dotScale;
    vec2  dotCell  = floor(dotUv);
    vec2  dotLocal = fract(dotUv) - 0.5;

    // Animate dot positions slightly
    float anim = sin(uTime * 0.45 + hash(dotCell) * 6.28) * 0.06;
    float dotR = hash(dotCell + floor(uTime * 0.1)) * 0.1;
    float dot  = smoothstep(0.28 + dotR + anim, 0.22 + dotR + anim, length(dotLocal));

    // Halftone density driven by diffuse
    float halftoneMask = diff * 0.85 + 0.15;
    dot *= halftoneMask;

    // ── Noise texture on surface ──────────────────────────────
    float grain  = noise2(vUv * 38.0 + uTime * 0.12) * 0.08;
    float grain2 = hash3(vPos * 22.0) * 0.05;

    // ── Compose final color ───────────────────────────────────
    // Base: white sphere
    float base = 0.96;
    // Darken with stripes
    base -= stripe * 0.82;
    // Add halftone
    base = mix(base, base * 0.6, dot * (1.0 - stripe) * 0.5);
    // Fresnel edge darkening
    base -= fresnel * 0.28;
    // Grain
    base += grain + grain2 - 0.04;
    // Subtle noise displacement tint
    base += vNoise * 0.04;

    base = clamp(base, 0.0, 1.0);

    // Moving specular highlight
    float spec = pow(max(dot(reflect(-lDir, normalize(vNormal)), viewDir), 0.0), 18.0);
    base += spec * 0.12;

    gl_FragColor = vec4(vec3(base), 1.0);
  }
`;

// ── The sphere mesh component ───────────────────────────────────────────────
function OrganicSphere({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const matRef   = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo(() => ({
    uTime:         { value: 0 },
    uMouse:        { value: new THREE.Vector2(0, 0) },
    uMorphStrength:{ value: 0.072 },
    uLightAngle:   { value: 0 },
  }), []);

  useFrame((_, delta) => {
    if (!matRef.current || !meshRef.current) return;
    const u = matRef.current.uniforms;

    u.uTime.value        += delta;
    u.uLightAngle.value  += delta * 0.22;   // slow light orbit

    // Smooth mouse follow
    const mx = (mouse.current[0] / size.width  - 0.5) * 1.2;
    const my = -(mouse.current[1] / size.height - 0.5) * 1.2;
    u.uMouse.value.x += (mx - u.uMouse.value.x) * 0.04;
    u.uMouse.value.y += (my - u.uMouse.value.y) * 0.04;

    // Breathing scale
    const breathScale = 1 + Math.sin(u.uTime.value * 0.52) * 0.008
                          + Math.sin(u.uTime.value * 0.19) * 0.004;
    meshRef.current.scale.setScalar(breathScale);

    // Very slow rotation
    meshRef.current.rotation.y += delta * 0.04;
    meshRef.current.rotation.x += delta * 0.018;
  });

  return (
    <mesh ref={meshRef}>
      {/* High-res sphere for smooth surface */}
      <sphereGeometry args={[1, 256, 256]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

// ── Main exported component ─────────────────────────────────────────────────
export default function LinearLogo() {
  const mouse = useRef<[number, number]>([0, 0]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouse.current = [e.clientX - rect.left, e.clientY - rect.top];
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative select-none"
      style={{
        width: 260,
        height: 260,
        borderRadius: 48,
        background: "#0e0e0e",
        overflow: "hidden",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 32px 80px rgba(0,0,0,0.35)",
      }}
    >
      {/* Subtle corner grain */}
      <div
        className="absolute inset-0 z-10 pointer-events-none rounded-[48px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
          mixBlendMode: "overlay",
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 2.6], fov: 42 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: "#0e0e0e" }}
        dpr={[1, 2]}
      >
        <OrganicSphere mouse={mouse} />
      </Canvas>
    </motion.div>
  );
}
