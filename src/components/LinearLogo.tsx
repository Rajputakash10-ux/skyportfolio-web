"use client";
import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

// ── SHADER: background scatter (transparent bg, white dots) ──────────────────
const BG_VERT = `
precision highp float;
attribute vec2  aPos;
attribute float aPhase;
attribute float aSpeed;
attribute float aSize;
uniform float uTime;
varying float vA;
void main(){
  vec2 p = aPos;
  float t = uTime * aSpeed;
  p.x += sin(t*0.28 + aPhase*3.1) * 0.010;
  p.y += cos(t*0.22 + aPhase*2.3) * 0.010;
  float fl = 0.2 + 0.5*(0.5+0.5*sin(uTime*aSpeed*2.1+aPhase*5.0));
  vA = fl * 0.45;
  gl_Position  = vec4(p, 0.0, 1.0);
  gl_PointSize = aSize;
}`;
const BG_FRAG = `
precision highp float;
varying float vA;
void main(){
  vec2 uv = gl_PointCoord - 0.5;
  if(dot(uv,uv)>0.25) discard;
  gl_FragColor = vec4(1.0,1.0,1.0, vA);
}`;

// ── SHADER: sphere halftone ───────────────────────────────────────────────────
const SP_VERT = `
precision highp float;
attribute vec2  aPos;
attribute float aPhase;
attribute float aSpeed;
attribute float aSize;
attribute float aDist;
uniform float uTime;
uniform float uBreath;
uniform float uDpr;
varying float vA;
void main(){
  vec2 p = aPos * uBreath;
  float amp = (0.002 + aSize*0.001) * (1.0 - aDist*0.4);
  float t = uTime * aSpeed;
  p.x += sin(t*0.38 + aPhase*2.1)*amp + sin(t*0.13+aPhase*5.7)*amp*0.3;
  p.y += cos(t*0.33 + aPhase*3.4)*amp + cos(t*0.11+aPhase*7.3)*amp*0.3;

  float sp = 0.4 + 0.6*pow(0.5+0.5*sin(uTime*aSpeed*0.75+aPhase*6.28),2.0);
  float centreGlow = 1.0 - smoothstep(0.0, 0.55, aDist);
  float edge = 1.0 - smoothstep(0.48, 0.98, aDist);
  vA = clamp((sp + centreGlow*0.3) * edge, 0.0, 1.0);

  gl_Position  = vec4(p, 0.0, 1.0);
  gl_PointSize = aSize * uDpr * (0.85 + sp*0.2 + centreGlow*0.15);
}`;
const SP_FRAG = `
precision highp float;
varying float vA;
void main(){
  vec2  uv = gl_PointCoord - 0.5;
  float d  = dot(uv,uv);
  if(d > 0.25) discard;
  float soft = 1.0 - smoothstep(0.06, 0.25, d);
  gl_FragColor = vec4(1.0,1.0,1.0, soft * vA);
}`;

function inStripe(x: number, y: number): boolean {
  const angle = Math.PI * 0.21;
  const proj  = x * Math.cos(angle) + y * Math.sin(angle);
  const period = 0.50, width = 0.17;
  const p = ((proj % period) + period) % period;
  return p < width;
}

function buildBg(COUNT: number, dpr: number) {
  const pos = new Float32Array(COUNT * 2);
  const phase = new Float32Array(COUNT);
  const speed = new Float32Array(COUNT);
  const size  = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    pos[i*2]   = (Math.random() - 0.5) * 1.95;
    pos[i*2+1] = (Math.random() - 0.5) * 1.95;
    phase[i]   = Math.random() * Math.PI * 2;
    speed[i]   = 0.1 + Math.random() * 0.4;
    size[i]    = (0.5 + Math.random() * 0.8) * dpr;
  }
  return { pos, phase, speed, size };
}

function buildSphere(COUNT: number) {
  const S   = Math.round(COUNT * 2.6);
  const phi = Math.PI * (3 - Math.sqrt(5));
  const pos   = new Float32Array(COUNT * 2);
  const phase = new Float32Array(COUNT);
  const speed = new Float32Array(COUNT);
  const size  = new Float32Array(COUNT);
  const dist  = new Float32Array(COUNT);
  let n = 0;

  for (let i = 0; i < S && n < COUNT; i++) {
    const y  = 1 - (i / (S - 1)) * 2;
    const rr = Math.sqrt(Math.max(0, 1 - y * y));
    const th = phi * i;
    const nx = Math.cos(th) * rr;
    if (inStripe(nx, y)) continue;
    const jx = (Math.random() - 0.5) * 0.012;
    const jy = (Math.random() - 0.5) * 0.012;
    const bx = nx + jx, by = y + jy;
    const dc = Math.sqrt(bx*bx + by*by);
    if (dc > 0.98) continue;
    const densityBias = 1.0 - dc * 0.55;
    if (Math.random() > densityBias + 0.08) continue;
    pos[n*2] = bx; pos[n*2+1] = by;
    phase[n] = Math.random() * Math.PI * 2;
    speed[n] = 0.2 + Math.random() * 1.5;
    size[n]  = (0.5 + Math.random() * 1.0) * (0.5 + 0.5 * (1 - dc));
    dist[n]  = dc;
    n++;
  }
  while (n < COUNT) {
    const a = Math.random()*Math.PI*2, rd = Math.sqrt(Math.random())*0.97;
    const bx = Math.cos(a)*rd, by = Math.sin(a)*rd;
    if (!inStripe(bx, by)) {
      pos[n*2]=bx; pos[n*2+1]=by;
      phase[n]=Math.random()*Math.PI*2;
      speed[n]=0.2+Math.random()*1.0;
      const dc=Math.sqrt(bx*bx+by*by);
      size[n]=(0.5+Math.random()*0.8)*(0.5+0.5*(1-dc));
      dist[n]=dc; n++;
    }
  }
  return { pos, phase, speed, size, dist };
}

function mkShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src); gl.compileShader(s); return s;
}
function mkProg(gl: WebGLRenderingContext, vs: string, fs: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, mkShader(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, mkShader(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p); return p;
}
function mkBuf(gl: WebGLRenderingContext, data: Float32Array) {
  const b = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return b;
}
function bindAttr(gl: WebGLRenderingContext, prog: WebGLProgram, name: string, buf: WebGLBuffer, sz: number) {
  const loc = gl.getAttribLocation(prog, name);
  if (loc < 0) return;
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, sz, gl.FLOAT, false, 0, 0);
}

function useLinearWebGL(size: number) {
  const ref     = useRef<HTMLCanvasElement>(null);
  const frameId = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const W   = size * DPR;
    canvas.width = canvas.height = W;
    canvas.style.width = canvas.style.height = `${size}px`;

    const gl = canvas.getContext("webgl", {
      alpha: true, premultipliedAlpha: false,
      antialias: false, powerPreference: "high-performance",
    }) as WebGLRenderingContext | null;
    if (!gl) return;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const isMob = window.innerWidth < 768;
    // 5 million total: 500k bg + 4.5M sphere (scaled down on mobile for perf)
    const BG_N = isMob ?  80_000 :  500_000;
    const SP_N = isMob ? 400_000 : 4_500_000;

    const bgProg = mkProg(gl, BG_VERT, BG_FRAG);
    const bgData = buildBg(BG_N, DPR);
    const bgBufs = {
      pos:   mkBuf(gl, bgData.pos),
      phase: mkBuf(gl, bgData.phase),
      speed: mkBuf(gl, bgData.speed),
      size:  mkBuf(gl, bgData.size),
    };
    const bgU = { time: gl.getUniformLocation(bgProg, "uTime") };

    const spProg = mkProg(gl, SP_VERT, SP_FRAG);
    const spData = buildSphere(SP_N);
    const spBufs = {
      pos:   mkBuf(gl, spData.pos),
      phase: mkBuf(gl, spData.phase),
      speed: mkBuf(gl, spData.speed),
      size:  mkBuf(gl, spData.size),
      dist:  mkBuf(gl, spData.dist),
    };
    const spU = {
      time:   gl.getUniformLocation(spProg, "uTime"),
      breath: gl.getUniformLocation(spProg, "uBreath"),
      dpr:    gl.getUniformLocation(spProg, "uDpr"),
    };
    gl.useProgram(spProg);
    gl.uniform1f(spU.dpr, DPR);

    let start = 0;
    const draw = (ts: number) => {
      if (!start) start = ts;
      const t = (ts - start) * 0.001;

      // fully transparent background
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.viewport(0, 0, W, W);

      gl.useProgram(bgProg);
      gl.uniform1f(bgU.time, t);
      bindAttr(gl, bgProg, "aPos",   bgBufs.pos,   2);
      bindAttr(gl, bgProg, "aPhase", bgBufs.phase, 1);
      bindAttr(gl, bgProg, "aSpeed", bgBufs.speed, 1);
      bindAttr(gl, bgProg, "aSize",  bgBufs.size,  1);
      gl.drawArrays(gl.POINTS, 0, BG_N);

      const br = 1 + Math.sin(t*0.55)*0.01 + Math.sin(t*0.21)*0.004;
      gl.useProgram(spProg);
      gl.uniform1f(spU.time,   t);
      gl.uniform1f(spU.breath, br);
      bindAttr(gl, spProg, "aPos",   spBufs.pos,   2);
      bindAttr(gl, spProg, "aPhase", spBufs.phase, 1);
      bindAttr(gl, spProg, "aSpeed", spBufs.speed, 1);
      bindAttr(gl, spProg, "aSize",  spBufs.size,  1);
      bindAttr(gl, spProg, "aDist",  spBufs.dist,  1);
      gl.drawArrays(gl.POINTS, 0, SP_N);

      frameId.current = requestAnimationFrame(draw);
    };

    frameId.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frameId.current);
      [bgBufs.pos, bgBufs.phase, bgBufs.speed, bgBufs.size,
       spBufs.pos, spBufs.phase, spBufs.speed, spBufs.size, spBufs.dist]
        .forEach(b => gl.deleteBuffer(b));
      gl.deleteProgram(bgProg);
      gl.deleteProgram(spProg);
    };
  }, [size]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    void e;
  }, []);

  return { ref, onMouseMove };
}

export default function LinearLogo({ size = 260 }: { size?: number }) {
  const { ref, onMouseMove } = useLinearWebGL(size);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: size, height: size,
        borderRadius: "50%",
        flexShrink: 0,
        position: "relative",
        zIndex: 10,
        overflow: "hidden",
        background: "transparent",
        boxShadow: "0 0 60px rgba(255,255,255,0.06), 0 0 120px rgba(255,255,255,0.03)",
      }}
    >
      <canvas
        ref={ref}
        onMouseMove={onMouseMove}
        style={{ display: "block", width: size, height: size }}
      />
    </motion.div>
  );
}
