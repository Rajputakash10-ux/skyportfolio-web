"use client";
import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";

// ─── Inline simplex noise ──────────────────────────────────────────────────
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

// ─── Vertex shader ───────────────────────────────────────────────────────────
const VERT = /* glsl */`
${SIMPLEX_GLSL}

attribute vec3  aOffset;   // xy = base pos (NDC), z = zone (0=bg, 1=sphere)
attribute float aPhase;
attribute float aSpeed;
attribute float aSize;
attribute float aDist;
attribute float aStripeT;

uniform float uTime;
uniform float uBreath;
uniform vec2  uMouse;       // NDC mouse [-1,1], (9,9) when off canvas
uniform float uMouseActive; // 1.0 when hovering, 0.0 when not (smooth lerp)
uniform float uDpr;

varying float vAlpha;
varying float vBright;
varying float vZone;

void main() {
  // Stripe particles — discard
  if (aStripeT > 0.5) {
    gl_Position  = vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = 0.0;
    vAlpha = 0.0;
    return;
  }

  vec2 p    = aOffset.xy * uBreath;
  vZone     = aOffset.z;

  // ── Simplex noise drift (always on) ────────────────────────────────────
  float driftStr = (vZone > 0.5)
    ? mix(0.006, 0.018, 1.0 - aDist)
    : 0.014;

  p.x += snoise(vec3(aOffset.xy * 2.0,       uTime * 0.25 + aPhase)) * driftStr;
  p.y += snoise(vec3(aOffset.xy * 2.0 + 5.3, uTime * 0.25 + aPhase)) * driftStr;

  // ── Linear-style cursor REPULSION ──────────────────────────────────────
  // Particles scatter AWAY from cursor — strong, visible, like linear.app
  vec2  fromMouse = p - uMouse;
  float mDist     = length(fromMouse);

  // Two-zone repulsion:
  // Inner zone (< 0.18 NDC ~= 50px): strong explosive scatter
  // Outer zone (0.18–0.45 NDC ~= 130px): gentle nudge
  float innerPush = smoothstep(0.18, 0.0,  mDist) * 0.28;
  float outerPush = smoothstep(0.45, 0.18, mDist) * 0.06;
  float totalPush = (innerPush + outerPush) * uMouseActive;

  if (mDist > 0.0001) {
    p += normalize(fromMouse) * totalPush;
  }

  // ── Sparkle ─────────────────────────────────────────────────────────────
  float sparkle = 0.5 + 0.5 * abs(sin(uTime * aSpeed * 0.85 + aPhase * 6.2831));

  // ── Alpha ────────────────────────────────────────────────────────────────
  float edgeFade = (vZone > 0.5) ? (1.0 - smoothstep(0.80, 1.0, aDist)) : 1.0;
  float zoneDim  = (vZone > 0.5) ? 1.0 : 0.22;
  vAlpha  = clamp(sparkle * edgeFade * zoneDim, 0.0, 1.0);
  vBright = sparkle;

  // ── Halftone shading (denser in shadow, sparser in highlight) ────────────
  if (vZone > 0.5) {
    float highlight = (aOffset.x + aOffset.y) / 1.41;
    float htone     = smoothstep(-0.3, 0.7, -highlight);
    vAlpha *= 0.3 + 0.7 * htone;
  }

  gl_Position  = vec4(p, 0.0, 1.0);
  float sizeScale = (vZone > 0.5)
    ? (0.9 + 0.5 * (1.0 - aDist) + 0.2 * sparkle)
    : (0.4 + 0.15 * sparkle);
  gl_PointSize = aSize * uDpr * sizeScale;
}`;

// ─── Fragment shader — dark particles for white background ───────────────────
const FRAG = /* glsl */`
precision highp float;
varying float vAlpha;
varying float vBright;
varying float vZone;

void main() {
  vec2  uv = gl_PointCoord - 0.5;
  float d  = dot(uv, uv);
  if (d > 0.25) discard;
  float soft = 1.0 - smoothstep(0.08, 0.25, d);

  // Dark particles on white background
  // Sphere: near-black (#0a0a0a) → dark grey (#333)
  // Background: mid-grey (#999) → light grey (#bbb)
  float lum = (vZone > 0.5)
    ? mix(0.04, 0.22, vBright)   // dark dots for sphere
    : mix(0.55, 0.72, vBright);  // lighter grey for bg specks

  gl_FragColor = vec4(lum, lum, lum, soft * vAlpha);
}`;

// ─── Stripe mask ─────────────────────────────────────────────────────────────
function inStripe(x: number, y: number): boolean {
  const angle  = Math.PI * 0.175;
  const proj   = x * Math.cos(angle) + y * Math.sin(angle);
  const period = 0.52;
  const width  = 0.155;
  const mod    = ((proj % period) + period) % period;
  return mod < width;
}

// ─── Build particles ──────────────────────────────────────────────────────────
function buildParticles(count: number) {
  const SPHERE_R = 0.72;
  const CX = 0.08, CY = 0.05;

  const sphereTarget = Math.round(count * 0.80);
  const bgTarget     = count - sphereTarget;

  const offsets = new Float32Array(count * 3);
  const phases  = new Float32Array(count);
  const speeds  = new Float32Array(count);
  const sizes   = new Float32Array(count);
  const dists   = new Float32Array(count);
  const stripes = new Float32Array(count);
  let n = 0;

  // Fibonacci sphere → disk
  const phi = Math.PI * (3 - Math.sqrt(5));
  const S   = Math.round(sphereTarget * 4);
  for (let i = 0; i < S && n < sphereTarget; i++) {
    const r  = Math.sqrt((i + 0.5) / S) * SPHERE_R;
    const th = phi * i;
    const bx = Math.cos(th) * r + CX + (Math.random() - 0.5) * 0.007;
    const by = Math.sin(th) * r + CY + (Math.random() - 0.5) * 0.007;
    const dc = Math.sqrt((bx - CX) ** 2 + (by - CY) ** 2) / SPHERE_R;
    if (dc > 1.0) continue;
    const hl      = ((bx - CX) + (by - CY)) / (SPHERE_R * 1.41);
    const density = Math.min(1, Math.max(0.1, 0.35 + 0.65 * (0.5 - hl * 0.5)));
    if (Math.random() > density) continue;
    offsets[n*3]=bx; offsets[n*3+1]=by; offsets[n*3+2]=1;
    phases[n]=Math.random()*Math.PI*2;
    speeds[n]=0.25+Math.random()*1.4;
    sizes[n]=(1.2+Math.random()*1.4)*(0.6+0.4*(1-dc));
    dists[n]=dc;
    stripes[n]=inStripe(bx-CX,by-CY)?1:0;
    n++;
  }
  let att=0;
  while(n<sphereTarget){ if(++att>sphereTarget*20)break;
    const th=Math.random()*Math.PI*2,r=Math.sqrt(Math.random())*SPHERE_R*0.99;
    const bx=Math.cos(th)*r+CX,by=Math.sin(th)*r+CY;
    const dc=Math.sqrt((bx-CX)**2+(by-CY)**2)/SPHERE_R;
    const hl=((bx-CX)+(by-CY))/(SPHERE_R*1.41);
    const density=Math.min(1,Math.max(0.1,0.35+0.65*(0.5-hl*0.5)));
    if(Math.random()>density)continue;
    offsets[n*3]=bx;offsets[n*3+1]=by;offsets[n*3+2]=1;
    phases[n]=Math.random()*Math.PI*2;speeds[n]=0.2+Math.random()*1.2;
    sizes[n]=(0.9+Math.random()*1.1)*(0.5+0.5*(1-dc));
    dists[n]=dc;stripes[n]=inStripe(bx-CX,by-CY)?1:0;
    n++;att=0;
  }

  const bgEnd=n+bgTarget; let ba=0;
  while(n<bgEnd){ if(++ba>bgTarget*20)break;
    const bx=(Math.random()-0.5)*1.9,by=(Math.random()-0.5)*1.9;
    const dc=Math.sqrt((bx-CX)**2+(by-CY)**2);
    if(dc<SPHERE_R*1.05)continue;
    offsets[n*3]=bx;offsets[n*3+1]=by;offsets[n*3+2]=0;
    phases[n]=Math.random()*Math.PI*2;speeds[n]=0.1+Math.random()*0.5;
    sizes[n]=0.4+Math.random()*0.5;dists[n]=0.5;stripes[n]=0;
    n++;ba=0;
  }
  return { offsets,phases,speeds,sizes,dists,stripes,count:n };
}

// ─── R3F inner component ─────────────────────────────────────────────────────
function ParticleField({ count }: { count: number }) {
  const matRef      = useRef<THREE.ShaderMaterial>(null);
  const mouseRef    = useRef<[number,number]>([9,9]);
  const activeRef   = useRef(0);   // smooth 0→1 lerp for hover state
  const { gl }      = useThree();

  const dpr = useMemo(()=>Math.min(typeof window!=="undefined"?window.devicePixelRatio:1,2),[]);

  const geo = useMemo(()=>{
    const data=buildParticles(count);
    const g=new THREE.BufferGeometry();
    g.setAttribute("aOffset",  new THREE.BufferAttribute(data.offsets,3));
    g.setAttribute("aPhase",   new THREE.BufferAttribute(data.phases,1));
    g.setAttribute("aSpeed",   new THREE.BufferAttribute(data.speeds,1));
    g.setAttribute("aSize",    new THREE.BufferAttribute(data.sizes,1));
    g.setAttribute("aDist",    new THREE.BufferAttribute(data.dists,1));
    g.setAttribute("aStripeT", new THREE.BufferAttribute(data.stripes,1));
    return g;
  },[count]);

  useEffect(()=>{return()=>{geo.dispose();};},[geo]);

  const mat = useMemo(()=>new THREE.ShaderMaterial({
    vertexShader:   VERT,
    fragmentShader: FRAG,
    transparent:    true,
    depthWrite:     false,
    depthTest:      false,
    blending:       THREE.NormalBlending,  // normal blend on white bg
    uniforms:{
      uTime:        { value:0 },
      uBreath:      { value:1.0 },
      uMouse:       { value:new THREE.Vector2(9,9) },
      uMouseActive: { value:0.0 },
      uDpr:         { value:dpr },
    },
  }),[dpr]);

  useEffect(()=>{return()=>{mat.dispose();};},[mat]);

  // Mouse tracking — update NDC coords and active state
  useEffect(()=>{
    const canvas=gl.domElement;
    const onMove=(e:MouseEvent)=>{
      const rect=canvas.getBoundingClientRect();
      mouseRef.current=[
        ((e.clientX-rect.left)/rect.width)*2-1,
        -(((e.clientY-rect.top)/rect.height)*2-1),
      ];
      activeRef.current=1;  // hovering
    };
    const onLeave=()=>{ activeRef.current=0; mouseRef.current=[9,9]; };
    canvas.addEventListener("mousemove",onMove);
    canvas.addEventListener("mouseleave",onLeave);
    return()=>{
      canvas.removeEventListener("mousemove",onMove);
      canvas.removeEventListener("mouseleave",onLeave);
    };
  },[gl]);

  // Smooth active value (lerp 0↔1) so repulsion fades in/out
  const smoothActiveRef = useRef(0);

  useFrame(({clock},delta)=>{
    if(!matRef.current) return;
    const t=clock.getElapsedTime();

    // Smooth lerp toward target active state
    smoothActiveRef.current=THREE.MathUtils.lerp(
      smoothActiveRef.current,
      activeRef.current,
      1-Math.exp(-delta*8)  // ~125ms ease
    );

    matRef.current.uniforms.uTime.value        = t;
    matRef.current.uniforms.uMouse.value.set(mouseRef.current[0],mouseRef.current[1]);
    matRef.current.uniforms.uMouseActive.value = smoothActiveRef.current;
    const breath=1+Math.sin(t*0.38)*0.009+Math.sin(t*0.17)*0.004;
    matRef.current.uniforms.uBreath.value      = breath;
  });

  return(
    <points geometry={geo}>
      <primitive object={mat} ref={matRef} attach="material"/>
    </points>
  );
}

// ─── Exported component ───────────────────────────────────────────────────────
export default function LinearLogo({ size=320 }:{ size?:number }) {
  const count=useMemo(()=>{
    if(typeof window==="undefined") return 30_000;
    const mobile=window.innerWidth<768;
    const low=(navigator.hardwareConcurrency??4)<=4;
    if(mobile) return low?8_000:12_000;
    return low?30_000:48_000;
  },[]);

  return(
    <motion.div
      className="relative block"
      style={{ width:size, height:size, flexShrink:0 }}
      animate={{ scale:[1.0,1.02,1.0] }}
      transition={{ duration:9, repeat:Infinity, ease:"easeInOut" }}
    >
      {/* White rounded square */}
      <div style={{
        position:"absolute", inset:0,
        background:"#ffffff",
        borderRadius:"28px",
        overflow:"hidden",
        width:size, height:size,
        boxShadow:"0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
      }}>
        <Canvas
          gl={{
            alpha:           false,
            antialias:       false,
            powerPreference: "high-performance",
            stencil:         false,
            depth:           false,
          }}
          dpr={[1,2]}
          camera={{ position:[0,0,1], near:0.01, far:10, fov:90 }}
          style={{ display:"block", width:size, height:size }}
          frameloop="always"
          onCreated={({gl})=>gl.setClearColor(0xffffff,1)}
        >
          <ParticleField count={count}/>
        </Canvas>
      </div>
    </motion.div>
  );
}
