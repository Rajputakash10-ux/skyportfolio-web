"use client";
import { useEffect, useRef, useCallback } from "react";
import { motion, useDragControls } from "framer-motion";

// ── GLSL shaders ──────────────────────────────────────────────────────────────
const VERT = `
precision highp float;
attribute vec2  aPos;     // normalised sphere pos [-1,1]
attribute float aPhase;
attribute float aSpeed;
attribute float aSize;

uniform float uTime;
uniform float uBreath;
uniform vec2  uMouse;     // canvas-local [0,size]
uniform float uSize;      // canvas px size
uniform float uDpr;

varying float vAlpha;

float hash(float n){ return fract(sin(n)*43758.5453); }

void main(){
  vec2 p = aPos * uBreath;

  // 3-harmonic organic drift  (sub-pixel movement)
  float amp = 0.004 + aSize * 0.003;
  float t   = uTime * aSpeed;
  p.x += sin(t*0.38 + aPhase*2.1)*amp + sin(t*0.14 + aPhase*5.3)*amp*0.3;
  p.y += cos(t*0.31 + aPhase*3.1)*amp + cos(t*0.11 + aPhase*7.0)*amp*0.3;

  // mouse repel (very subtle) — in NDC space
  vec2 ndcMouse = (uMouse / uSize) * 2.0 - 1.0;
  ndcMouse.y *= -1.0;
  vec2  delta = p - ndcMouse;
  float d     = length(delta);
  float R     = 0.35;
  if(d < R && d > 0.001){
    float str = pow(1.0 - d/R, 1.8) * 0.04;
    p += normalize(delta) * str;
  }

  // shimmer brightness
  float sh = 0.25 + 0.75 * pow(0.5 + 0.5*sin(uTime*aSpeed*0.78 + aPhase*6.28), 2.0);

  // edge fade
  float dc   = length(aPos);
  float edge = 1.0 - smoothstep(0.50, 0.97, dc);

  vAlpha = sh * edge * 0.92;

  // clip-space
  gl_Position  = vec4(p, 0.0, 1.0);
  gl_PointSize = aSize * uDpr * (0.85 + sh * 0.3);
}`;

const FRAG = `
precision highp float;
varying float vAlpha;
uniform vec3 uColor;

void main(){
  vec2  uv = gl_PointCoord - 0.5;
  float d  = dot(uv, uv);
  if(d > 0.25) discard;           // round dot
  float soft = 1.0 - smoothstep(0.10, 0.25, d);
  gl_FragColor = vec4(uColor, soft * vAlpha);
}`;

// ── stripe mask ───────────────────────────────────────────────────────────────
function inStripe(nx: number, ny: number): boolean {
  const proj = nx * Math.cos(Math.PI / 5.2) + ny * Math.sin(Math.PI / 5.2);
  const p    = ((proj % 0.52) + 0.52) % 0.52;
  return p < 0.16;
}

// ── build Float32 buffers ─────────────────────────────────────────────────────
function buildBuffers(COUNT: number) {
  // oversample heavily — stripe + circle rejection drops ~35%
  const S      = Math.round(COUNT * 2.1);
  const phi    = Math.PI * (3 - Math.sqrt(5));
  const pos    = new Float32Array(COUNT * 2);
  const phase  = new Float32Array(COUNT);
  const speed  = new Float32Array(COUNT);
  const size   = new Float32Array(COUNT);
  let   filled = 0;

  for (let i = 0; i < S && filled < COUNT; i++) {
    const y  = 1 - (i / (S - 1)) * 2;
    const r  = Math.sqrt(Math.max(0, 1 - y * y));
    const th = phi * i;
    const nx = Math.cos(th) * r;
    if (inStripe(nx, y)) continue;
    const bx = nx + (Math.random() - 0.5) * 0.022;
    const by = y  + (Math.random() - 0.5) * 0.022;
    if (bx * bx + by * by > 0.97) continue;
    // centre density bias
    const dc = Math.sqrt(bx * bx + by * by);
    if (dc > 0.45 && Math.random() > 1.15 - dc) continue;

    pos[filled * 2]     = bx;
    pos[filled * 2 + 1] = by;
    phase[filled] = Math.random() * Math.PI * 2;
    speed[filled] = 0.25 + Math.random() * 1.6;
    // size: 1–2px, smaller at edges
    size[filled]  = (0.9 + Math.random() * 1.1) * (0.7 + 0.3 * (1 - dc));
    filled++;
  }

  // fill remainder if rejection was too aggressive
  while (filled < COUNT) {
    const a  = Math.random() * Math.PI * 2;
    const rd = Math.sqrt(Math.random()) * 0.96;
    const bx = Math.cos(a) * rd, by = Math.sin(a) * rd;
    if (!inStripe(bx, by)) {
      pos[filled * 2]     = bx;
      pos[filled * 2 + 1] = by;
      phase[filled] = Math.random() * Math.PI * 2;
      speed[filled] = 0.25 + Math.random() * 1.6;
      size[filled]  = 0.9 + Math.random() * 0.8;
      filled++;
    }
  }

  return { pos, phase, speed, size };
}

// ── WebGL helpers ─────────────────────────────────────────────────────────────
function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}
function makeProgram(gl: WebGLRenderingContext) {
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER,   VERT));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(p);
  return p;
}
function buf(gl: WebGLRenderingContext, data: Float32Array) {
  const b = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return b;
}
function attr(gl: WebGLRenderingContext, prog: WebGLProgram, name: string,
              buffer: WebGLBuffer, size: number) {
  const loc = gl.getAttribLocation(prog, name);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
}

// ── hook ──────────────────────────────────────────────────────────────────────
function useWebGL(size: number) {
  const ref      = useRef<HTMLCanvasElement>(null);
  const mouse    = useRef<[number, number]>([9999, 9999]);
  const hovering = useRef(false);
  const frameId  = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = size * DPR;
    canvas.height = size * DPR;
    canvas.style.width  = `${size}px`;
    canvas.style.height = `${size}px`;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      powerPreference: "high-performance",
    }) as WebGLRenderingContext | null;

    if (!gl) return;

    // transparent clear
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // particle count — mobile gets fewer for 60fps
    const isMob  = window.innerWidth < 768;
    const COUNT  = isMob ? 120_000 : 2_000_000;

    const { pos, phase, speed, size: sz } = buildBuffers(COUNT);
    const prog = makeProgram(gl);
    gl.useProgram(prog);

    const bPos   = buf(gl, pos);
    const bPhase = buf(gl, phase);
    const bSpeed = buf(gl, speed);
    const bSize  = buf(gl, sz);

    attr(gl, prog, "aPos",   bPos,   2);
    attr(gl, prog, "aPhase", bPhase, 1);
    attr(gl, prog, "aSpeed", bSpeed, 1);
    attr(gl, prog, "aSize",  bSize,  1);

    const uTime   = gl.getUniformLocation(prog, "uTime");
    const uBreath = gl.getUniformLocation(prog, "uBreath");
    const uMouse  = gl.getUniformLocation(prog, "uMouse");
    const uSize   = gl.getUniformLocation(prog, "uSize");
    const uDpr    = gl.getUniformLocation(prog, "uDpr");
    const uColor  = gl.getUniformLocation(prog, "uColor");

    gl.uniform1f(uDpr,  DPR);
    gl.uniform1f(uSize, size);
    // BLACK particles: rgb(0,0,0)
    gl.uniform3f(uColor, 0.0, 0.0, 0.0);

    let start = 0;
    const draw = (ts: number) => {
      if (!start) start = ts;
      const t = (ts - start) * 0.001;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const br = 1 + Math.sin(t * 0.55) * 0.012 + Math.sin(t * 0.21) * 0.005;
      gl.uniform1f(uTime,   t);
      gl.uniform1f(uBreath, br);

      const [mx, my] = mouse.current;
      gl.uniform2f(uMouse,
        hovering.current ? mx : 9999,
        hovering.current ? my : 9999,
      );

      gl.drawArrays(gl.POINTS, 0, COUNT);
      frameId.current = requestAnimationFrame(draw);
    };

    frameId.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frameId.current);
      gl.deleteBuffer(bPos);
      gl.deleteBuffer(bPhase);
      gl.deleteBuffer(bSpeed);
      gl.deleteBuffer(bSize);
      gl.deleteProgram(prog);
    };
  }, [size]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (r) mouse.current = [e.clientX - r.left, e.clientY - r.top];
  }, []);
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mouse.current = [e.touches[0].clientX - r.left, e.touches[0].clientY - r.top];
  }, []);
  const onEnter = useCallback(() => { hovering.current = true;  }, []);
  const onLeave = useCallback(() => {
    hovering.current = false;
    mouse.current    = [9999, 9999];
  }, []);

  return { ref, onMouseMove, onTouchMove, onEnter, onLeave };
}

// ── component ──────────────────────────────────────────────────────────────────
export default function LinearLogo({ size = 220 }: { size?: number }) {
  const drag = useDragControls();
  const { ref, onMouseMove, onTouchMove, onEnter, onLeave } = useWebGL(size);

  return (
    <motion.div
      drag
      dragControls={drag}
      dragMomentum={false}
      dragElastic={0}
      whileDrag={{ scale: 1.03 }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: size, height: size,
        borderRadius: "50%",
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
        flexShrink: 0,
        position: "relative",
        zIndex: 10,
        overflow: "hidden",
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
