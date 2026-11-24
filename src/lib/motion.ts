import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

export const reducedMotion = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis: Lenis | null = null;

export function initSmoothScroll(): () => void {
  if (reducedMotion() || lenis) return () => {};
  lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 0.95 });
  const l = lenis;
  l.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => l.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    l.destroy();
    lenis = null;
  };
}

export function pauseScroll(paused: boolean) {
  if (!lenis) return;
  if (paused) lenis.stop();
  else lenis.start();
}

/** Scroll to an in-page target, then move keyboard focus there for screen-reader and keyboard users. */
export function scrollToTarget(selector: string) {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;
  const focus = () => {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };
  if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.4, onComplete: focus });
  else { el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" }); focus(); }
  history.replaceState(null, "", selector.startsWith("#") ? selector : location.pathname);
}

export function canUseWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function isLowPower(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return (
    window.innerWidth < 768 ||
    (nav.hardwareConcurrency ?? 8) <= 4 ||
    (nav.deviceMemory ?? 8) <= 4
  );
}

export function saveData(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return !!nav.connection?.saveData;
}
