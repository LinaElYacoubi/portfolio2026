import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDown, Menu, X, Download, Copy, Check } from "lucide-react";
import { profile, nav } from "./data/content";
import { ProjectExplorer } from "./components/ProjectExplorer";
import { SkillNotes } from "./components/SkillNotes";
import { WorkExperience } from "./components/WorkExperience";
import { useActiveSection } from "./hooks/useActiveSection";

const currentYear = new Date().getFullYear();
const sectionIds = ["top", ...nav.map(item => item.href.slice(1))];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const toggle = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        toggle.current?.focus();
      }
    };
    const resize = () => { if (window.innerWidth >= 800) setMenuOpen(false); };
    window.addEventListener("keydown", close);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("keydown", close);
      window.removeEventListener("resize", resize);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (copyState === "idle") return;
    const timer = window.setTimeout(() => setCopyState("idle"), 3500);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyState("copied");
    } catch { setCopyState("failed"); }
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <nav className="shell navigation" aria-label="Primary">
        <a className="wordmark" href="#top" aria-label="Lina El Yacoubi, back to top">lina<span>✳</span></a>
        <div className="desktop-nav">
          {nav.map(n => <a key={n.href} href={n.href} aria-current={active === n.href.slice(1) ? "location" : undefined}>{n.label}</a>)}
          <a className="resume-link" href={profile.resumeFile} download>Resume <Download size={15} /></a>
        </div>
        <button ref={toggle} className="menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </nav>
      <nav id="mobile-menu" aria-label="Mobile" className="mobile-nav shell" hidden={!menuOpen}>
        {nav.map(n => <a key={n.href} href={n.href} aria-current={active === n.href.slice(1) ? "location" : undefined} onClick={() => setMenuOpen(false)}>{n.label}</a>)}
        <a href={profile.resumeFile} download onClick={() => setMenuOpen(false)}>Download resume</a>
      </nav>
    </header>

    <main id="main" tabIndex={-1}>
      <section className="hero shell" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="little-star" aria-hidden="true"></span> Software engineering student</p>
          <p className="handwritten hello-note">Hello, nice to meet you.</p>
          <h1 id="hero-title">I’m Lina<br /><span>El Yacoubi<span className="name-dot">.</span></span></h1>
          <p className="hero-lead">I build web applications and make data easier to work with.</p>
          <div className="actions">
            <a className="button primary" href="#projects">My Projects<ArrowDown size={17} /></a>
            <a className="text-link" href={profile.resumeFile} download>My resume <ArrowUpRight size={17} /></a>
          </div>
        </div>
        <div className="hero-collage">
          <span className="orbit-doodle" aria-hidden="true"></span>
          <figure className="portrait">
            <span className="photo-tape" aria-hidden="true" />
            <div className="portrait-frame"><img src="/photo.png" alt="Lina El Yacoubi" width="640" height="800" fetchPriority="high" /></div>
          </figure>

        </div>
      </section>

      <section className="section shell about" id="about" aria-labelledby="about-title">
        <div className="about-heading"><p className="eyebrow">About me</p><h2 id="about-title">About me<br /> &amp; my skills.</h2><p className="about-intro">I’m a software engineering co-op student at the University of Ottawa, graduating in December 2027.</p><p className="about-intro">My experience spans internal applications, engineering data and accessible websites. Here are the languages, tools and practices I’ve worked with along the way.</p><span className="handwritten side-note"></span></div>
        <SkillNotes />
      </section>

      <WorkExperience />

      <section className="section shell" id="projects" aria-labelledby="projects-title">
        <div className="section-heading"><div><p className="eyebrow">Projects</p><h2 id="projects-title">Pick something.<br /><em>Give it a try.</em></h2></div><span className="handwritten">Four projects, a few different ideas.</span></div>
        <ProjectExplorer />
      </section>

      <section className="contact section" id="contact" aria-labelledby="contact-title"><div className="shell contact-inner">
        <div><p className="eyebrow">Have something in mind?</p><h2 id="contact-title">Let’s talk<span className="gold-dot">.</span></h2><p>A role, a project or just a hello. My inbox is open.</p></div>
        <div className="contact-note"><span className="handwritten">You can reach me here ↓</span><a className="email-link" href={"mailto:" + profile.email}>{profile.email} <ArrowUpRight /></a><button type="button" className="copy-email" onClick={copyEmail}>{copyState === "copied" ? <Check size={16} /> : <Copy size={16} />} Copy email address</button><p className="copy-status" role="status">{copyState === "copied" ? "Copied — ready to paste." : copyState === "failed" ? "Couldn’t copy. You can select the address above." : ""}</p></div>
        <div className="contact-links"><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <span className="sr-only">(opens in a new tab)</span><ArrowUpRight size={16} /></a><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <span className="sr-only">(opens in a new tab)</span><ArrowUpRight size={16} /></a><a href={profile.resumeFile} download>Resume <Download size={16} /></a></div>
      </div></section>
    </main>
    <footer className="shell footer"><p>© {currentYear} {profile.name}</p><a href="#top">Back to the top ↑</a></footer>
  </>;
}
export default App;
