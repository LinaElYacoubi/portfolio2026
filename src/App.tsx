import { useEffect } from "react";
import { About } from "./components/About";
import { Contact, Footer } from "./components/Contact";
import { EasterEggs } from "./components/EasterEggs";
import { Experience } from "./components/Experience";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { World } from "./components/World";
import { gsap, initSmoothScroll, reducedMotion, ScrollTrigger } from "./lib/motion";

export default function App() {
  useEffect(() => {
    const stopScroll = initSmoothScroll();
    let ctx: gsap.Context | undefined;
    if (!reducedMotion()) {
      ctx = gsap.context(() => {
        gsap.set("[data-reveal]", { opacity: 0, y: 36 });
        ScrollTrigger.batch("[data-reveal]", {
          start: "top 88%",
          once: true,
          onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08, overwrite: true }),
        });
      });
    }
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 600);
    const hash = location.hash;
    if (hash.length > 1) window.setTimeout(() => document.querySelector(hash)?.scrollIntoView(), 50);
    return () => { ctx?.revert(); stopScroll(); window.removeEventListener("load", refresh); window.clearTimeout(t); };
  }, []);

  return (
    <>
      <a className="skip-link" href="#about">Skip to content</a>
      <World />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <EasterEggs />
    </>
  );
}
