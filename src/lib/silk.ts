/*
 * Silk: the site's background. A slow, flowing gradient in the brand palette, drawn by one
 * fragment shader on a full-screen canvas (plain WebGL, no 3D library).
 * - Calm on purpose: no particles, low contrast, very slow motion.
 * - A soft light follows the cursor; a click sends a gentle ripple.
 * - Each page section (data-stage 0..6) shifts the colors a little.
 * - Reduced motion: one still frame, redrawn only on resize or section change.
 */

export type SilkOptions = { canvas: HTMLCanvasElement; reducedMotion: boolean; lowPower: boolean };

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseOn;
uniform float uStage;
uniform float uAmount;
uniform vec3 uBase, uSoft, uRose, uWine;
uniform float uPulseT;
uniform vec2 uPulseO;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime * 0.035;

  // Domain-warped noise: soft folds of fabric that slowly drift.
  vec2 q = vec2(fbm(p * 1.3 + t), fbm(p * 1.3 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(
    fbm(p * 1.1 + 2.0 * q + vec2(1.7, 9.2) + t * 0.6 + uStage * 0.35),
    fbm(p * 1.1 + 2.0 * q + vec2(8.3, 2.8) - t * 0.4)
  );
  float f = fbm(p * 1.2 + 2.0 * r);
  float sheen = sin(f * 8.0 + r.x * 3.0 - uTime * 0.12) * 0.5 + 0.5;

  vec3 col = mix(uBase, uSoft, smoothstep(0.3, 0.85, f));
  col = mix(col, uRose, smoothstep(0.55, 1.0, sheen) * 0.32 * clamp(length(q), 0.0, 1.0));
  col = mix(col, uWine, smoothstep(0.78, 1.0, f) * 0.12);

  // Soft light under the cursor.
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);
  float d = distance(p, m);
  col += vec3(1.0, 0.95, 0.96) * 0.09 * exp(-d * d * 5.0) * uMouseOn;

  // Gentle ripple after a click.
  if (uPulseT >= 0.0) {
    vec2 o = vec2(uPulseO.x * aspect, uPulseO.y);
    float pd = distance(p, o);
    float ring = exp(-pow((pd - uPulseT * 0.6) * 9.0, 2.0)) * exp(-uPulseT * 1.8);
    col += vec3(1.0, 0.93, 0.95) * ring * 0.12;
  }

  // Calmer behind text sections: fade toward the base color.
  col = mix(uBase, col, uAmount);
  gl_FragColor = vec4(col, 1.0);
}
`;

const hexToRgb = (h: string): [number, number, number] => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];

// Palette: Milky Blush, Soft Blush, Dusty Rose, Rosewood.
const BASE = hexToRgb("#F9EDEF");
const SOFT = hexToRgb("#F1D7D2");
const ROSE = hexToRgb("#E8A6AD");
const WINE = hexToRgb("#C45B70");
// How strong the silk is per stage: 0 opening, 1 about, 2 experience, 3 projects, 4 –, 5 skills, 6 contact.
const AMOUNT = [1, 0.8, 0.65, 0.7, 0.65, 0.65, 0.8];

export class Silk {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private raf = 0;
  private running = false;
  private time = 0;
  private last = performance.now();
  private stage = 0;
  private targetStage = 0;
  private mouse = [0.5, 0.6];
  private smoothMouse = [0.5, 0.6];
  private mouseOn = 0;
  private mouseOnTarget = 0;
  private pulseT = -1;
  private pulseO = [0.5, 0.5];
  private scale: number;
  private opts: SilkOptions;
  private paused = false;

  constructor(opts: SilkOptions) {
    this.opts = opts;
    const gl = opts.canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, powerPreference: "low-power" });
    if (!gl) throw new Error("WebGL unavailable");
    this.gl = gl;
    // The gradient is soft, so render below full resolution and let CSS scale it up.
    this.scale = opts.lowPower ? 0.35 : 0.5;

    this.program = this.link(VERT, FRAG);
    gl.useProgram(this.program);
    for (const name of ["uRes", "uTime", "uMouse", "uMouseOn", "uStage", "uAmount", "uBase", "uSoft", "uRose", "uWine", "uPulseT", "uPulseO"]) {
      this.u[name] = gl.getUniformLocation(this.program, name);
    }
    gl.uniform3fv(this.u.uBase, BASE);
    gl.uniform3fv(this.u.uSoft, SOFT);
    gl.uniform3fv(this.u.uRose, ROSE);
    gl.uniform3fv(this.u.uWine, WINE);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(this.program, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    this.resize();
    window.addEventListener("resize", this.resize);
    document.addEventListener("visibilitychange", this.onVisibility);
    if (!opts.reducedMotion) {
      window.addEventListener("pointermove", this.onPointer, { passive: true });
      document.addEventListener("pointerleave", this.onLeave);
      window.addEventListener("pointerdown", this.onDown, { passive: true });
    }
    this.start();
  }

  setStage(stage: number) {
    this.targetStage = stage;
    if (this.opts.reducedMotion) { this.stage = Math.round(stage); this.draw(); }
  }

  /** Stop drawing while something else covers the screen (the dark hero). */
  setPaused(p: boolean) {
    if (p === this.paused) return;
    this.paused = p;
    if (p) this.stop(); else this.start();
  }

  /** A soft ripple from a screen point (used by clicks and the easter egg). */
  pulseAt(clientX: number, clientY: number) {
    if (this.opts.reducedMotion) return;
    this.pulseO = [clientX / window.innerWidth, 1 - clientY / window.innerHeight];
    this.pulseT = 0;
  }

  dispose() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
    document.removeEventListener("visibilitychange", this.onVisibility);
    window.removeEventListener("pointermove", this.onPointer);
    document.removeEventListener("pointerleave", this.onLeave);
    window.removeEventListener("pointerdown", this.onDown);
    this.gl.deleteProgram(this.program);
  }

  private link(vs: string, fs: string): WebGLProgram {
    const gl = this.gl;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader error");
      return s;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link error");
    return p;
  }

  private start() {
    if (this.running || this.paused) return;
    if (this.opts.reducedMotion) { this.draw(); return; }
    this.running = true;
    this.last = performance.now();
    const loop = () => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(loop);
      this.tick();
      this.draw();
    };
    loop();
  }

  private stop() { this.running = false; cancelAnimationFrame(this.raf); }

  private onVisibility = () => { if (document.hidden) this.stop(); else this.start(); };

  private onPointer = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    this.mouse = [e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight];
    this.mouseOnTarget = 1;
  };
  private onLeave = () => { this.mouseOnTarget = 0; };
  private onDown = (e: PointerEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && t.closest("a,button,input,select,textarea,summary,dialog,[data-no-pulse]")) return;
    this.pulseAt(e.clientX, e.clientY);
  };

  private resize = () => {
    const c = this.opts.canvas;
    c.width = Math.max(1, Math.round(window.innerWidth * this.scale));
    c.height = Math.max(1, Math.round(window.innerHeight * this.scale));
    this.gl.viewport(0, 0, c.width, c.height);
    this.gl.uniform2f(this.u.uRes, c.width, c.height);
    if (this.opts.reducedMotion) this.draw();
  };

  private tick() {
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.time += dt;
    this.stage += (this.targetStage - this.stage) * Math.min(1, dt * 2.5);
    const k = Math.min(1, dt * 4);
    this.smoothMouse[0] += (this.mouse[0] - this.smoothMouse[0]) * k;
    this.smoothMouse[1] += (this.mouse[1] - this.smoothMouse[1]) * k;
    this.mouseOn += (this.mouseOnTarget - this.mouseOn) * Math.min(1, dt * 2);
    if (this.pulseT >= 0) { this.pulseT += dt; if (this.pulseT > 2.5) this.pulseT = -1; }
  }

  private draw() {
    const gl = this.gl;
    const i = Math.floor(this.stage), j = Math.min(AMOUNT.length - 1, i + 1), f = this.stage - i;
    gl.uniform1f(this.u.uTime, this.time);
    gl.uniform1f(this.u.uStage, this.stage);
    gl.uniform1f(this.u.uAmount, AMOUNT[i] + (AMOUNT[j] - AMOUNT[i]) * f);
    gl.uniform2f(this.u.uMouse, this.smoothMouse[0], this.smoothMouse[1]);
    gl.uniform1f(this.u.uMouseOn, this.mouseOn);
    gl.uniform1f(this.u.uPulseT, this.pulseT);
    gl.uniform2f(this.u.uPulseO, this.pulseO[0], this.pulseO[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
