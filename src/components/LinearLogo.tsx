"use client";
import { useEffect, useRef, useCallback } from "react";
import { motion, useDragControls } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// SHADER: background dots (dark gray on black — subtle scatter)
// ─────────────────────────────────────────────────────────────────────────────
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
  p.x += sin(t*0.28 + aPhase*3.1) * 0.012;
  p.y += cos(t*0.22 + aPhase*2.3) * 0.012;
  float fl = 0.3 + 0.7*(0.5+0.5*sin(uTime*aSpeed*2.1+aPhase*5.0));
  vA = fl * 0.55;
  gl_Position  = vec4(p, 0.0, 1.0);
  gl_PointSize = aSize;
}`;
const BG_FRAG = `
precision highp float;
varying float vA;
void main(){
  vec2 uv = gl_PointCoord - 0.5;
  if(dot(uv,uv)>0.25) discard;
  gl_FragColor = vec4(0.72,0.72,0.72, vA);
}`;

// ─────────────────────────────────────────────────────────────────────────────
// SHADER: sphere dots (white, halftone density, 3 stripe cutouts)
// ─────────────────────────────────────────────────────────────────────────────
const SP_VERT = `
precision highp float;
attribute vec2  aPos;
attribute float aPhase;
attribute float aSpeed;
attribute float aSize;
attribute float aDist;   // distance from centre [0..1]
uniform float uTime;
uniform float uBreath;
uniform vec2  uMouse;
uniform float uCanvasSize;
uniform float uDpr;
varying float vA;
varying float vSize;
void main(){
  vec2 p = aPos * uBreath;

  // organic drift — amplitude inversely proportional to distance from centre
  float amp = (0.003 + aSize*0.002) * (1.0 - aDist*0.4);
  float t = uTime * aSpeed;
  p.x += sin(t*0.38 + aPhase*2.1)*amp + sin(t*0.13+aPhase*5.7)*amp*0.35;
  p.y += cos(t*0.33 + aPhase*3.4)*amp + cos(t*0.11+aPhase*7.3)*amp*0.35;

  // mouse soft repel
  vec2 ndcM = (uMouse / uCanvasSize)*2.0 - 1.0;
  ndcM.y *= -1.0;
  vec2  dv = p - ndcM;
  float d  = length(dv);
  if(d < 0.32 && d > 0.001)
    p += normalize(dv) * pow(1.0-d/0.32, 2.0) * 0.03;

  // sparkle brightness — centre dots brighter
  float sp = 0.35 + 0.65*pow(0.5+0.5*sin(uTime*aSpeed*0.75+aPhase*6.28),2.2);
  float centreGlow = 1.0 - smoothstep(0.0, 0.55, aDist);
  float bright = sp + centreGlow*0.25;

  // edge fade
  float edge = 1.0 - smoothstep(0.50, 0.98, aDist);

  vA    = clamp(bright * edge, 0.0, 1.0);
  vSize = aSize * uDpr * (0.9 + sp*0.25 + centreGlow*0.2);

  gl_Position  = vec4(p, 0.0, 1.0);
  gl_PointSize = vSize;
}`;
const SP_FRAG = `
precision highp float;
varying float vA;
varying float vSize;
void main(){
  vec2  uv = gl_PointCoord - 0.5;
  float d  = dot(uv,uv);
  if(d > 0.25) discard;
  float soft = 1.0 - smoothstep(0.08, 0.25, d);
  gl_FragColor = vec4(1.0, 1.0, 1.0, soft * vA);
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Stripe test — 3 diagonal cutouts matching reference image angle
// ─────────────────────────────────────────────────────────────────────────────
function inStripe(x: number, y: number): boolean {
  // ~38° angle (bottom-left → top-right like the image)
  const angle = Math.PI * 0.21;
  const proj  = x * Math.cos(angle) + y * Math.sin(angle);
  const period = 0.50, width = 0.17;
  const p = ((proj % period) + period) % period;
  return p < width;
}

// ─────────────────────────────────────────────────────────────────────────────
// Build background scatter buffer
// ─────────────────────────────────────────────────────────────────────────────
function buildBg(COUNT: number, dpr: number) {
  const pos   = new Float32Array(COUNT * 2);
  const phase = new Float32Array(COUNT);
  const speed = new Float32Array(COUNT);
  const size  = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    // uniform scatter across [-1, 1] square
    pos[i*2]   = (Math.random() - 0.5) * 1.92;
    pos[i*2+1] = (Math.random() - 0.5) * 1.92;
    phase[i]   = Math.random() * Math.PI * 2;
    speed[i]   = 0.12 + Math.random() * 0.5;
    size[i]    = (0.8 + Math.random() * 1.1) * dpr;
  }
  return { pos, phase, speed, size };
}

// ─────────────────────────────────────────────────────────────────────────────
// Build sphere halftone buffer (Fibonacci + density bias + stripe cutout)
// ─────────────────────────────────────────────────────────────────────────────
function buildSphere(COUNT: number) {
  const S     = Math.round(COUNT * 2.4);
  const phi   = Math.PI * (3 - Math.sqrt(5));
  const pos   = new Float32Array(COUNT * 2);
  const phase = new Float32Array(COUNT);
  const speed = new Float32Array(COUNT);
  const size  = new Float32Array(COUNT);
  const dist  = new Float32Array(COUNT);
  let n = 0;

  for (let i = 0; i < S && n < COUNT; i++) {
    const y  = 1 - (i / (S - 1)) * 2;
    const r  = Math.sqrt(Math.max(0, 1 - y * y));
    const th = phi * i;
    const nx = Math.cos(th) * r;

    // Stripe cutout — dots inside stripe are skipped
    if (inStripe(nx, y)) continue;

    const jx = (Math.random() - 0.5) * 0.018;
    const jy = (Math.random() - 0.5) * 0.018;
    const bx = nx + jx, by = y + jy;
    const dc = Math.sqrt(bx*bx + by*by);
    if (dc > 0.98) continue;

    // Halftone density: denser at centre, sparse at edges
    // (matches the reference image — right half of sphere is denser)
    const densityBias = 1.0 - dc * 0.65;
    if (Math.random() > densityBias + 0.05) continue;

    pos[n*2]   = bx;
    pos[n*2+1] = by;
    phase[n]   = Math.random() * Math.PI * 2;
    speed[n]   = 0.3 + Math.random() * 1.8;
    // dot size: larger at centre, 1px at edges — matches halftone look
    size[n]    = (0.6 + Math.random() * 1.2) * (0.55 + 0.45 * (1 - dc));
    dist[n]    = dc;
    n++;
  }
  // pad if needed
  while (n < COUNT) {
    const a = Math.random()*Math.PI*2, rd = Math.sqrt(Math.random())*0.97;
    const bx = Math.cos(a)*rd, by = Math.sin(a)*rd;
    if (!inStripe(bx, by)) {
      pos[n*2]=bx; pos[n*2+1]=by;
      phase[n]=Math.random()*Math.PI*2;
      speed[n]=0.3+Math.random()*1.2;
      const dc=Math.sqrt(bx*bx+by*by);
      size[n]=(0.6+Math.random()*0.9)*(0.55+0.45*(1-dc));
      dist[n]=dc; n++;
    }
  }
  return { pos, phase, speed, size, dist };
}

// ─────────────────────────────────────────────────────────────────────────────
// WebGL helpers
// ─────────────────────────────────────────────────────────────────────────────
function mkShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src); gl.compileShader(s); return s;
}
function mkProg(gl: WebGLRenderingContext, vs: string, fs: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, mkShader(gl, gl.VERTEX_SHADER,   vs));
  gl.attachShader(p, mkShader(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p); return p;
}
function mkBuf(gl: WebGLRenderingContext, data: Float32Array) {
  const b = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return b;
}
function bindAttr(gl: WebGLRenderingContext, prog: WebGLProgram,
                  name: string, buf: WebGLBuffer, sz: number) {
  const loc = gl.getAttribLocation(prog, name);
  if (loc < 0) return;
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, sz, gl.FLOAT, false, 0, 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main hook
// ─────────────────────────────────────────────────────────────────────────────
function useLinearWebGL(size: number) {
  const ref      = useRef<HTMLCanvasElement>(null);
  const mouse    = useRef<[number,number]>([9999,9999]);
  const hovering = useRef(false);
  const frameId  = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const DPR  = Math.min(window.devicePixelRatio || 1, 2);
    const W    = size * DPR;
    canvas.width = canvas.height = W;
    canvas.style.width = canvas.style.height = `${size}px`;

    const gl = canvas.getContext("webgl", {
      alpha: true, premultipliedAlpha: false,
      antialias: false, powerPreference: "high-performance",
    }) as WebGLRenderingContext | null;
    if (!gl) return;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const isMob   = window.innerWidth < 768;
    const BG_N    = isMob ?  40_000 : 200_000;  // background scatter
    const SP_N    = isMob ? 150_000 : 800_000;  // sphere halftone

    // ── background program ──────────────────────────────────────────────────
    const bgProg = mkProg(gl, BG_VERT, BG_FRAG);
    const bgData = buildBg(BG_N, DPR);
    const bgBufs = {
      pos:   mkBuf(gl, bgData.pos),
      phase: mkBuf(gl, bgData.phase),
      speed: mkBuf(gl, bgData.speed),
      size:  mkBuf(gl, bgData.size),
    };
    const bgU = { time: gl.getUniformLocation(bgProg, "uTime") };

    // ── sphere program ───────────────────────────────────────────────────────
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
      mouse:  gl.getUniformLocation(spProg, "uMouse"),
      csize:  gl.getUniformLocation(spProg, "uCanvasSize"),
      dpr:    gl.getUniformLocation(spProg, "uDpr"),
    };
    gl.useProgram(spProg);
    gl.uniform1f(spU.csize, size);
    gl.uniform1f(spU.dpr,   DPR);

    let start = 0;
    const draw = (ts: number) => {
      if (!start) start = ts;
      const t = (ts - start) * 0.001;

      // Pure near-black background — matches Linear exactly
      gl.clearColor(0.04, 0.04, 0.045, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.viewport(0, 0, W, W);

      // ── draw background scatter ──────────────────────────────────────────
      gl.useProgram(bgProg);
      gl.uniform1f(bgU.time, t);
      bindAttr(gl, bgProg, "aPos",   bgBufs.pos,   2);
      bindAttr(gl, bgProg, "aPhase", bgBufs.phase, 1);
      bindAttr(gl, bgProg, "aSpeed", bgBufs.speed, 1);
      bindAttr(gl, bgProg, "aSize",  bgBufs.size,  1);
      gl.drawArrays(gl.POINTS, 0, BG_N);

      // ── draw sphere halftone ─────────────────────────────────────────────
      const br = 1 + Math.sin(t*0.55)*0.012 + Math.sin(t*0.21)*0.005;
      gl.useProgram(spProg);
      gl.uniform1f(spU.time,   t);
      gl.uniform1f(spU.breath, br);
      const [mx, my] = mouse.current;
      gl.uniform2f(spU.mouse,
        hovering.current ? mx : 9999,
        hovering.current ? my : 9999);
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
    const r = ref.current?.getBoundingClientRect();
    if (r) mouse.current = [e.clientX - r.left, e.clientY - r.top];
  }, []);
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (r) mouse.current = [
      e.touches[0].clientX - r.left,
      e.touches[0].clientY - r.top,
    ];
  }, []);
  const onEnter = useCallback(() => { hovering.current = true; }, []);
  const onLeave = useCallback(() => {
    hovering.current = false;
    mouse.current = [9999, 9999];
  }, []);

  return { ref, onMouseMove, onTouchMove, onEnter, onLeave };
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function LinearLogo({ size = 240 }: { size?: number }) {
  const drag = useDragControls();
  const { ref, onMouseMove, onTouchMove, onEnter, onLeave } = useLinearWebGL(size);
  return (
    <motion.div
      drag
      dragControls={drag}
      dragMomentum={false}
      dragElastic={0}
      whileDrag={{ scale: 1.05 }}
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: size, height: size,
        borderRadius: Math.round(size * 0.22),
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
        flexShrink: 0,
        position: "relative",
        zIndex: 10,
        overflow: "hidden",
        boxShadow: "0 4px 32px rgba(0,0,0,0.7), 0 1px 6px rgba(0,0,0,0.5)",
      }}
      onPointerDown={(e) => drag.start(e)}
    >
      <canvas
        ref={ref}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onTouchStart={onEnter}
        onTouchEnd={onLeave}
        style={{ display: "block", width: size, height: size }}
      />
    </motion.div>
  );
}
