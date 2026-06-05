"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

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
uniform vec2  uClick;    // NDC click position [-1,1]
uniform float uStretch;  // 0..1 explosion amount
uniform vec2  uMouse;    // NDC mouse [-1,1]
varying float vA;
varying float vBright;
void main(){
  vec2 p = aPos * uBreath;

  // organic drift
  float amp = (0.002 + aSize*0.001)*(1.0-aDist*0.4);
  float t = uTime*aSpeed;
  p.x += sin(t*0.38+aPhase*2.1)*amp + sin(t*0.13+aPhase*5.7)*amp*0.3;
  p.y += cos(t*0.33+aPhase*3.4)*amp + cos(t*0.11+aPhase*7.3)*amp*0.3;

  // click stretch — particles fly outward from click point
  if(uStretch > 0.001){
    vec2  dir = p - uClick;
    float d   = length(dir);
    float falloff = 1.0 - smoothstep(0.0, 1.4, d);
    float power = uStretch * falloff * (0.5 + (1.0-aDist)*0.8);
    p += normalize(dir + vec2(0.0001)) * power * 0.9;
  }

  // mouse soft attract on hover
  vec2  dm = p - uMouse;
  float distM = length(dm);
  if(distM < 0.4 && distM > 0.001){
    float pull = (1.0 - distM/0.4) * 0.018;
    p -= normalize(dm) * pull;
  }

  float sp = 0.4+0.6*pow(0.5+0.5*sin(uTime*aSpeed*0.75+aPhase*6.28),2.0);
  float cg = 1.0-smoothstep(0.0,0.55,aDist);
  float edge = 1.0-smoothstep(0.48,0.98,aDist);
  vA = clamp((sp+cg*0.3)*edge,0.0,1.0);
  // brighten on stretch
  vBright = 1.0 + uStretch * 1.5 * (1.0-aDist);

  gl_Position  = vec4(p,0.0,1.0);
  gl_PointSize = aSize*uDpr*(0.85+sp*0.2+cg*0.15) * (1.0 + uStretch*0.6*(1.0-aDist));
}`;

const SP_FRAG = `
precision highp float;
varying float vA;
varying float vBright;
void main(){
  vec2  uv = gl_PointCoord-0.5;
  float d  = dot(uv,uv);
  if(d>0.25) discard;
  float soft = 1.0-smoothstep(0.06,0.25,d);
  gl_FragColor = vec4(min(vBright,1.0), min(vBright*0.95,1.0), 1.0, soft*vA);
}`;

function inStripe(x: number, y: number) {
  const proj = x*Math.cos(Math.PI*0.21) + y*Math.sin(Math.PI*0.21);
  return ((proj%0.50)+0.50)%0.50 < 0.17;
}

function buildSphere(COUNT: number) {
  const S=Math.round(COUNT*2.6), phi=Math.PI*(3-Math.sqrt(5));
  const pos=new Float32Array(COUNT*2), phase=new Float32Array(COUNT);
  const speed=new Float32Array(COUNT), size=new Float32Array(COUNT);
  const dist=new Float32Array(COUNT);
  let n=0;
  for(let i=0;i<S&&n<COUNT;i++){
    const y=1-(i/(S-1))*2, rr=Math.sqrt(Math.max(0,1-y*y));
    const nx=Math.cos(phi*i)*rr;
    if(inStripe(nx,y)) continue;
    const bx=nx+(Math.random()-0.5)*0.012, by=y+(Math.random()-0.5)*0.012;
    const dc=Math.sqrt(bx*bx+by*by);
    if(dc>0.98||Math.random()>1.0-dc*0.55+0.08) continue;
    pos[n*2]=bx; pos[n*2+1]=by;
    phase[n]=Math.random()*Math.PI*2;
    speed[n]=0.2+Math.random()*1.5;
    size[n]=(0.5+Math.random()*1.0)*(0.5+0.5*(1-dc));
    dist[n]=dc; n++;
  }
  while(n<COUNT){
    const a=Math.random()*Math.PI*2, rd=Math.sqrt(Math.random())*0.97;
    const bx=Math.cos(a)*rd, by=Math.sin(a)*rd;
    if(!inStripe(bx,by)){
      pos[n*2]=bx; pos[n*2+1]=by;
      phase[n]=Math.random()*Math.PI*2;
      speed[n]=0.2+Math.random()*1.0;
      const dc=Math.sqrt(bx*bx+by*by);
      size[n]=(0.5+Math.random()*0.8)*(0.5+0.5*(1-dc));
      dist[n]=dc; n++;
    }
  }
  return {pos,phase,speed,size,dist};
}

function mk(gl: WebGLRenderingContext, t: number, src: string){ const s=gl.createShader(t)!; gl.shaderSource(s,src); gl.compileShader(s); return s; }
function mkProg(gl: WebGLRenderingContext, vs: string, fs: string){ const p=gl.createProgram()!; gl.attachShader(p,mk(gl,gl.VERTEX_SHADER,vs)); gl.attachShader(p,mk(gl,gl.FRAGMENT_SHADER,fs)); gl.linkProgram(p); return p; }
function mkBuf(gl: WebGLRenderingContext, data: Float32Array){ const b=gl.createBuffer()!; gl.bindBuffer(gl.ARRAY_BUFFER,b); gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW); return b; }
function bind(gl: WebGLRenderingContext, prog: WebGLProgram, name: string, buf: WebGLBuffer, sz: number){ const l=gl.getAttribLocation(prog,name); if(l<0)return; gl.bindBuffer(gl.ARRAY_BUFFER,buf); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l,sz,gl.FLOAT,false,0,0); }

function useWebGL(size: number) {
  const ref       = useRef<HTMLCanvasElement>(null);
  const fId       = useRef(0);
  const stretch   = useRef(0);      // current stretch amount 0..1
  const stretchV  = useRef(0);      // velocity for spring
  const clickNDC  = useRef<[number,number]>([0,0]);
  const mouseNDC  = useRef<[number,number]>([9,9]);
  const pressing  = useRef(false);

  // spring constants
  const STIFF = 180, DAMP = 18;

  useEffect(()=>{
    const canvas = ref.current; if(!canvas) return;
    const DPR = Math.min(window.devicePixelRatio||1,2), W = size*DPR;
    canvas.width = canvas.height = W;
    canvas.style.width = canvas.style.height = `${size}px`;

    const gl = canvas.getContext("webgl",{alpha:true,premultipliedAlpha:false,antialias:false,powerPreference:"high-performance"}) as WebGLRenderingContext|null;
    if(!gl) return;
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

    const isMob = window.innerWidth < 768;
    const SP_N  = isMob ? 300_000 : 3_000_000;

    const prog = mkProg(gl, SP_VERT, SP_FRAG);
    const data = buildSphere(SP_N);
    const bufs = {
      pos:   mkBuf(gl,data.pos),   phase: mkBuf(gl,data.phase),
      speed: mkBuf(gl,data.speed), size:  mkBuf(gl,data.size),
      dist:  mkBuf(gl,data.dist),
    };
    const u = {
      time:    gl.getUniformLocation(prog,"uTime"),
      breath:  gl.getUniformLocation(prog,"uBreath"),
      dpr:     gl.getUniformLocation(prog,"uDpr"),
      click:   gl.getUniformLocation(prog,"uClick"),
      stretch: gl.getUniformLocation(prog,"uStretch"),
      mouse:   gl.getUniformLocation(prog,"uMouse"),
    };
    gl.useProgram(prog); gl.uniform1f(u.dpr,DPR);

    let last = 0, start = 0;
    const draw = (ts: number) => {
      const dt = Math.min((ts-last)*0.001, 0.05); last = ts;
      if(!start) start = ts;
      const t = (ts-start)*0.001;

      // spring physics for stretch
      const target = pressing.current ? 1.0 : 0.0;
      const force  = (target - stretch.current) * STIFF - stretchV.current * DAMP;
      stretchV.current  += force * dt;
      stretch.current   += stretchV.current * dt;
      stretch.current    = Math.max(0, Math.min(1.2, stretch.current));

      gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT); gl.viewport(0,0,W,W);
      const br = 1 + Math.sin(t*0.55)*0.015 + Math.sin(t*0.21)*0.006;
      gl.useProgram(prog);
      gl.uniform1f(u.time,   t);
      gl.uniform1f(u.breath, br);
      gl.uniform1f(u.stretch, stretch.current);
      gl.uniform2f(u.click,  clickNDC.current[0], clickNDC.current[1]);
      gl.uniform2f(u.mouse,  mouseNDC.current[0], mouseNDC.current[1]);
      bind(gl,prog,"aPos",  bufs.pos,  2); bind(gl,prog,"aPhase",bufs.phase,1);
      bind(gl,prog,"aSpeed",bufs.speed,1); bind(gl,prog,"aSize", bufs.size, 1);
      bind(gl,prog,"aDist", bufs.dist, 1);
      gl.drawArrays(gl.POINTS,0,SP_N);
      fId.current = requestAnimationFrame(draw);
    };
    fId.current = requestAnimationFrame(draw);
    return ()=>{ cancelAnimationFrame(fId.current); Object.values(bufs).forEach(b=>gl.deleteBuffer(b)); gl.deleteProgram(prog); };
  },[size]);

  // convert canvas pixel coords → NDC [-1,1]
  const toNDC = (cx: number, cy: number, rect: DOMRect): [number,number] => [
    ((cx-rect.left)/rect.width)*2-1,
    -(((cy-rect.top)/rect.height)*2-1),
  ];

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseNDC.current = toNDC(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
  };
  const onMouseLeave = () => { mouseNDC.current = [9,9]; };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pressing.current = true;
    clickNDC.current = toNDC(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
  };
  const onPointerUp   = () => { pressing.current = false; };

  return { ref, onMouseMove, onMouseLeave, onPointerDown, onPointerUp };
}

export default function LinearLogo({ size=160 }: { size?: number }) {
  const { ref, onMouseMove, onMouseLeave, onPointerDown, onPointerUp } = useWebGL(size);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx,{stiffness:60,damping:20});
  const sy = useSpring(my,{stiffness:60,damping:20});
  const rotateX = useTransform(sy,[-0.5,0.5],["8deg","-8deg"]);
  const rotateY = useTransform(sx,[-0.5,0.5],["-8deg","8deg"]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX-r.left-r.width/2)/r.width);
    my.set((e.clientY-r.top-r.height/2)/r.height);
    onMouseMove(e);
  };
  const onLeave = () => { mx.set(0); my.set(0); onMouseLeave(); };

  const pad = 48;

  return (
    <motion.div
      className="relative select-none cursor-pointer"
      style={{ width:size+pad*2, height:size+pad*2, perspective:700 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* Orbit ring 1 */}
      <motion.div
        className="absolute inset-0 rounded-full border border-white/8"
        animate={{ rotate:360 }}
        transition={{ duration:18, repeat:Infinity, ease:"linear" }}
        style={{ margin:4 }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/50" />
      </motion.div>

      {/* Orbit ring 2 */}
      <motion.div
        className="absolute inset-0 rounded-full border border-white/5"
        animate={{ rotate:-360 }}
        transition={{ duration:30, repeat:Infinity, ease:"linear" }}
        style={{ margin:-8 }}
      >
        <div className="absolute top-1/4 right-0 translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-purple-400/70" />
        <div className="absolute bottom-1/4 left-0 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400/70" />
      </motion.div>

      {/* Pulse glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ inset:pad-8, background:"radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)" }}
        animate={{ scale:[1,1.1,1], opacity:[0.5,0.9,0.5] }}
        transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}
      />

      {/* Canvas — 3D tilt */}
      <motion.div
        style={{ width:size, height:size, margin:pad, borderRadius:"50%", overflow:"hidden", rotateX, rotateY }}
        initial={{ opacity:0, scale:0.8 }}
        animate={{ opacity:1, scale:1 }}
        transition={{ duration:1.2, ease:[0.22,1,0.36,1] }}
      >
        <canvas ref={ref} style={{ display:"block", width:size, height:size }} />
      </motion.div>
    </motion.div>
  );
}
