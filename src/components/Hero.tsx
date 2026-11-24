import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { canUseWebGL, gsap, isLowPower, reducedMotion, saveData, scrollToTarget } from "../lib/motion";

const jump = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); scrollToTarget(id); };

/**
 * Opening screen: real HTML headline over the light background, and a particle cloud (three/HeroParticles.ts)
 * that morphs between an app window, a data grid and a hand. The headline part that matches the
 * shape on screen lights up. Reduced motion or no WebGL: static gradient, no highlight cycling.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [live, setLive] = useState(false);

  // Particles: lazy-loaded, paused when the hero is off screen.
  useEffect(() => {
    if (reducedMotion() || saveData() || !canUseWebGL() || !canvas.current || !root.current) return;
    let disposed = false;
    let scene: import("../three/HeroParticles").HeroParticles | null = null;
    const io = new IntersectionObserver(([e]) => scene?.setVisible(e.isIntersecting));
    import("../three/HeroParticles")
      .then(({ HeroParticles }) => {
        if (disposed || !canvas.current) return;
        try {
          scene = new HeroParticles({ canvas: canvas.current, lowPower: isLowPower(), onShape: setActive });
          setLive(true);
          if (root.current) io.observe(root.current);
        } catch {
          setLive(false);
        }
      })
      .catch(() => setLive(false));
    return () => { disposed = true; io.disconnect(); scene?.dispose(); setActive(null); };
  }, []);

  // Entrance and scroll fade.
  useEffect(() => {
    if (reducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "expo.out" } })
        .from(".hero-title", { y: 28, opacity: 0, duration: 1.2, delay: 0.1 })
        .from("[data-hero-fade]", { y: 16, opacity: 0, duration: 0.9, stagger: 0.1 }, "-=0.9");
      gsap.to([".hero-inner", ".hero-hint"], {
        yPercent: -14, opacity: 0, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const hl = (i: number) => `hl${active === i ? " is-on" : ""}`;

  return (
    <section className="hero" id="top" data-stage="0" ref={root} aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true">
        <canvas ref={canvas} className={`hero-canvas${live ? " on" : ""}`} />
        <div className="hero-vignette" />
      </div>
      <div className="hero-inner shell">
        <p className="hero-hello mono" data-hero-fade>Hi, I'm Lina El Yacoubi</p>
        <h1 id="hero-title" className="hero-title">
          I build <span className={hl(0)}><span className="nowrap">full-stack</span> apps</span>, <span className={hl(1)}>data pipelines</span> and{" "}
          <span className={hl(2)}>experiences you control with your <em>hands</em></span>.
        </h1>
        <p className="hero-sub mono" data-hero-fade>Software engineering @ uOttawa · 4 co-op terms · graduating Dec. 2027</p>
        <a href="#about" className="hero-scroll" onClick={jump("#about")} data-hero-fade>
          About me <ArrowDown size={17} aria-hidden="true" />
        </a>
      </div>
      <p className="hero-hint mono" aria-hidden="true" hidden={!live}>
        <span className="hint-desktop">move your cursor through the particles</span>
      </p>
    </section>
  );
}
