import type { Silk } from "./silk";
import { canUseWebGL, isLowPower, reducedMotion, saveData } from "./motion";

/*
 * The background "world": a fixed layer with a Milky Blush color, three soft CSS glows
 * (fallback) and the flowing Silk gradient (lib/silk.ts). It follows the page's sections
 * (elements marked data-stage="0".."6") and shifts the colors gently for each one.
 */

// Background color and glow colors per stage (0 = hero … 6 = contact).
const ENV = ["#F9EDEF", "#F9EDEF", "#F8EAEC", "#F9EDEF", "#F7E8EA", "#F8EBED", "#F9EDEF"];
const BLOBS: [string, string, string][] = [
  ["#E8A6AD", "#F1D7D2", "#C45B70"],
  ["#E8A6AD", "#F1D7D2", "#E8A6AD"],
  ["#F1D7D2", "#E8A6AD", "#C45B70"],
  ["#E8A6AD", "#C45B70", "#F1D7D2"],
  ["#C45B70", "#E8A6AD", "#F1D7D2"],
  ["#F1D7D2", "#E8A6AD", "#E8A6AD"],
  ["#E8A6AD", "#C45B70", "#F1D7D2"],
];

const hex = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
};

/** Reads the current stage (0–6, fractional during transitions) from sections marked data-stage. */
export function readStage(): number {
  const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-stage]"));
  if (!sections.length) return 0;
  const vh = window.innerHeight;
  const probe = window.scrollY + vh * 0.3;
  const anchors = sections.map(s => ({ top: s.getBoundingClientRect().top + window.scrollY, stage: Number(s.dataset.stage) }));
  let stage = anchors[0].stage;
  for (let i = 0; i < anchors.length; i++) {
    const cur = anchors[i], next = anchors[i + 1];
    if (probe >= cur.top) {
      stage = cur.stage;
      if (next) {
        const span = Math.min(vh * 0.6, next.top - cur.top);
        const t = (probe - (next.top - span)) / span;
        if (t > 0) stage = cur.stage + Math.min(1, t) * (next.stage - cur.stage);
      }
    }
  }
  return stage;
}

/**
 * Starts the world inside `root` (which holds .world-glow and a canvas).
 * The Silk shader is lazy-loaded; without WebGL the CSS glows stay as a fallback.
 * Returns a cleanup function.
 */
export function mountWorld(root: HTMLElement): () => void {
  const canvas = root.querySelector("canvas");
  let field: Silk | null = null;
  let disposed = false;
  root.dataset.mode = "fallback";

  if (canvas && canUseWebGL() && !saveData()) {
    root.dataset.mode = "loading";
    import("./silk")
      .then(({ Silk }) => {
        if (disposed) return;
        try {
          field = new Silk({ canvas, reducedMotion: reducedMotion(), lowPower: isLowPower() });
          update(); // apply the current stage and hero pause right away
          root.dataset.mode = "webgl";
        } catch {
          root.dataset.mode = "fallback";
        }
      })
      .catch(() => { root.dataset.mode = "fallback"; });
  }

  const onPulse = (e: Event) => {
    const d = (e as CustomEvent<{ x: number; y: number }>).detail;
    field?.pulseAt(d.x, d.y);
  };

  let frame = 0;
  const update = () => {
    frame = 0;
    const s = readStage();
    field?.setStage(s);
    // While the hero (#top) fills the screen, its particles are the animation: hold the background still.
    const hero = document.getElementById("top");
    field?.setPaused(!!hero && hero.getBoundingClientRect().bottom >= window.innerHeight);
    const i = Math.floor(s), j = Math.min(ENV.length - 1, i + 1), t = s - i;
    root.style.backgroundColor = mix(ENV[i], ENV[j], t);
    ["a", "b", "c"].forEach((k, n) => root.style.setProperty(`--blob-${k}`, mix(BLOBS[i][n], BLOBS[j][n], t)));
    const max = document.documentElement.scrollHeight - window.innerHeight;
    document.documentElement.style.setProperty("--progress", String(max > 0 ? window.scrollY / max : 0));
  };
  const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("landmark:pulse", onPulse);

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    window.removeEventListener("landmark:pulse", onPulse);
    document.documentElement.style.removeProperty("--progress");
    field?.dispose();
    field = null;
  };
}
