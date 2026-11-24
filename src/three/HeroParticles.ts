import {
  BufferAttribute, BufferGeometry, Color, Group, NormalBlending, PerspectiveCamera,
  Plane, Points, Raycaster, Scene, ShaderMaterial, Vector2, Vector3, WebGLRenderer,
} from "three";
import { appWindow, dataGrid, GRID_W, hand, mulberry32 } from "./heroShapes";

/*
 * Hero particles: one cloud that morphs between 3 shapes, one per part of the headline:
 *   0 app window </>  ·  1 data grid with flowing rows  ·  2 hand
 * Each shape holds for ~3 s, then morphs for ~1 s (a 12 s loop). `onShape` reports which
 * shape is showing so the matching headline words can light up.
 */

const HOLD = 3, MORPH = 1, STEP = HOLD + MORPH, SHAPES = 3;

const vertex = /* glsl */ `
  attribute vec3 pA; attribute vec3 pB; attribute vec3 pC;
  attribute float aFlow; attribute float aRand; attribute float aSize;
  uniform float uFrom, uTo, uMix, uTime, uSize, uPixel, uFadeX, uGridW;
  uniform vec3 uMouse;
  varying float vAlpha; varying float vTone;
  float eq(float a, float b) { return 1.0 - step(0.5, abs(a - b)); }
  void main() {
    // Data rows stream sideways and wrap around inside the grid.
    float hw = uGridW * 0.5;
    vec3 g = pB;
    g.x = -hw + mod(pB.x + hw + uTime * aFlow, uGridW);
    float edge = mix(1.0, smoothstep(hw, hw - 0.35, abs(g.x)), step(0.001, aFlow));

    float wA = eq(0.0, uFrom) * (1.0 - uMix) + eq(0.0, uTo) * uMix;
    float wB = eq(1.0, uFrom) * (1.0 - uMix) + eq(1.0, uTo) * uMix;
    float wC = eq(2.0, uFrom) * (1.0 - uMix) + eq(2.0, uTo) * uMix;
    vec3 pos = pA * wA + g * wB + pC * wC;

    // A soft scatter in the middle of each morph, and a gentle shimmer.
    float mid = sin(uMix * 3.14159);
    vec3 dir = normalize(vec3(sin(aRand * 91.0), cos(aRand * 47.0), sin(aRand * 13.0)) + 0.0001);
    pos += dir * mid * (0.35 + aRand * 0.55);
    pos += vec3(sin(uTime * 0.8 + aRand * 40.0), cos(uTime * 0.7 + aRand * 31.0), 0.0) * 0.012;

    vec4 world = modelMatrix * vec4(pos, 1.0);
    // Cursor gently pushes nearby particles away.
    vec3 d = world.xyz - uMouse; d.z *= 0.3;
    world.xyz += normalize(d + 0.0001) * smoothstep(0.9, 0.0, length(d)) * 0.35;

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uSize * uPixel * (1.0 / -mv.z);

    vAlpha = (0.45 + aRand * 0.5) * mix(1.0, edge, wB);
    // Fewer particles near the headline (left side on desktop).
    vAlpha *= mix(1.0, smoothstep(-0.9, 0.5, world.x), uFadeX);
    vTone = aRand;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColA, uColB, uColHi; uniform float uOpacity;
  varying float vAlpha; varying float vTone;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d); a *= a;
    vec3 col = mix(uColA, uColB, vTone);
    col = mix(col, uColHi, step(0.9, vTone));
    gl_FragColor = vec4(col, a * vAlpha * uOpacity);
  }
`;

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export type HeroOptions = { canvas: HTMLCanvasElement; lowPower: boolean; onShape: (i: number) => void };

export class HeroParticles {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(40, 1, 0.1, 50);
  private group = new Group();
  private material: ShaderMaterial;
  private opts: HeroOptions;
  private raf = 0;
  private running = false;
  private visible = true;
  private time = 0;
  private last = performance.now();
  private shown = -1;
  private pointer = new Vector2(0, 0);
  private smooth = new Vector2(0, 0);
  private mouseWorld = new Vector3(99, 99, 0);
  private ray = new Raycaster();
  private zPlane = new Plane(new Vector3(0, 0, 1), 0);
  private ro: ResizeObserver;

  constructor(opts: HeroOptions) {
    this.opts = opts;
    this.renderer = new WebGLRenderer({ canvas: opts.canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
    this.renderer.setClearColor(0x000000, 0);
    this.camera.position.set(0, 0, 7);

    const count = opts.lowPower ? 1600 : 4500;
    const r = mulberry32(7);
    const flow = new Float32Array(count);
    const rand = new Float32Array(count);
    const size = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      rand[i] = r();
      size[i] = r() < 0.1 ? 1.5 + r() * 1.1 : 0.55 + r() * 0.8;
    }
    const g = new BufferGeometry();
    const a = appWindow(count, r);
    g.setAttribute("pA", new BufferAttribute(a, 3));
    g.setAttribute("pB", new BufferAttribute(dataGrid(count, r, flow), 3));
    g.setAttribute("pC", new BufferAttribute(hand(count, r), 3));
    g.setAttribute("position", new BufferAttribute(a, 3));
    g.setAttribute("aFlow", new BufferAttribute(flow, 1));
    g.setAttribute("aRand", new BufferAttribute(rand, 1));
    g.setAttribute("aSize", new BufferAttribute(size, 1));
    g.computeBoundingSphere();
    if (g.boundingSphere) g.boundingSphere.radius = 10;

    this.material = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: NormalBlending,
      uniforms: {
        uFrom: { value: 0 }, uTo: { value: 1 }, uMix: { value: 0 }, uTime: { value: 0 },
        uSize: { value: opts.lowPower ? 34 : 30 }, uPixel: { value: 1 }, uFadeX: { value: 1 }, uGridW: { value: GRID_W },
        uMouse: { value: this.mouseWorld }, uOpacity: { value: 1 },
        uColA: { value: new Color("#852D46") }, uColB: { value: new Color("#C45B70") }, uColHi: { value: new Color("#E8A6AD") },
      },
    });
    const points = new Points(g, this.material);
    points.frustumCulled = false;
    this.group.add(points);
    this.scene.add(this.group);

    this.ro = new ResizeObserver(this.resize);
    this.ro.observe(opts.canvas);
    this.resize();
    window.addEventListener("pointermove", this.onPointer, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);
    this.start();
  }

  /** Pause rendering when the hero is scrolled out of view. */
  setVisible(v: boolean) {
    this.visible = v;
    if (v) this.start(); else this.stop();
  }

  dispose() {
    this.stop();
    this.ro.disconnect();
    window.removeEventListener("pointermove", this.onPointer);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.group.traverse(o => (o as Points).geometry?.dispose());
    this.material.dispose();
    this.renderer.dispose();
  }

  private start() {
    if (this.running || !this.visible || document.hidden) return;
    this.running = true;
    this.last = performance.now();
    const loop = () => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(loop);
      this.render();
    };
    loop();
  }

  private stop() { this.running = false; cancelAnimationFrame(this.raf); }

  private onVisibility = () => { if (document.hidden) this.stop(); else this.start(); };

  private onPointer = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const rect = this.opts.canvas.getBoundingClientRect();
    const ndc = new Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    this.pointer.copy(ndc);
    this.ray.setFromCamera(ndc, this.camera);
    const hit = new Vector3();
    if (this.ray.ray.intersectPlane(this.zPlane, hit)) this.mouseWorld.copy(hit);
  };

  private resize = () => {
    const c = this.opts.canvas;
    const w = c.clientWidth || 1, h = c.clientHeight || 1;
    const dpr = Math.min(window.devicePixelRatio || 1, this.opts.lowPower ? 1.25 : 1.75);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.material.uniforms.uPixel.value = dpr * Math.max(0.75, h / 900);

    // Desktop: shape on the right, away from the headline. Phone: smaller, above the text.
    const halfH = Math.tan((this.camera.fov * Math.PI) / 360) * this.camera.position.z;
    const halfW = halfH * this.camera.aspect;
    if (w >= 900) {
      const s = Math.min(1.05, Math.max(0.5, (halfW * 0.82) / 4.4));
      this.group.position.set(halfW * 0.5, 0, 0);
      this.group.scale.setScalar(s);
      this.material.uniforms.uFadeX.value = 1;
      this.material.uniforms.uOpacity.value = 1;
    } else {
      const s = Math.min((halfW * 1.7) / 4.4, (halfH * 0.75) / 3.2);
      this.group.position.set(0, halfH * 0.42, 0);
      this.group.scale.setScalar(s);
      this.material.uniforms.uFadeX.value = 0;
      this.material.uniforms.uOpacity.value = 0.7;
    }
  };

  private render() {
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.time += dt;

    const cycle = this.time % (STEP * SHAPES);
    const from = Math.floor(cycle / STEP);
    const local = cycle - from * STEP;
    const mix = local < HOLD ? 0 : ease((local - HOLD) / MORPH);
    const to = (from + 1) % SHAPES;
    const u = this.material.uniforms;
    u.uFrom.value = from; u.uTo.value = to; u.uMix.value = mix; u.uTime.value = this.time;

    const showing = mix < 0.5 ? from : to;
    if (showing !== this.shown) { this.shown = showing; this.opts.onShape(showing); }

    this.smooth.lerp(this.pointer, Math.min(1, dt * 3));
    this.group.rotation.set(-this.smooth.y * 0.12, Math.sin(this.time * 0.3) * 0.16 + this.smooth.x * 0.2, 0);
    this.renderer.render(this.scene, this.camera);
  }
}
