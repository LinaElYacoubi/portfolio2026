import { useEffect, useRef, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { nav, profile } from "../data/content";
import { scrollToTarget } from "../lib/motion";

/** Plain "LY" monogram: just the letters, no badge or background. */
export function Logo() {
  return <span className="logo-mark" aria-hidden="true">LY</span>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    nav.forEach(n => { const el = document.getElementById(n.href.slice(1)); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); toggle.current?.focus(); } };
    const onResize = () => { if (window.innerWidth >= 860) setOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, [open]);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToTarget(href);
  };

  return (
    <header className="site-header">
      <nav className="nav" aria-label="Main">
        <a href="#top" className="brand" onClick={e => go(e, "#top")}>
          <Logo />
          <span>Lina El Yacoubi</span>
        </a>
        <ul className="nav-links">
          {nav.map(n => (
            <li key={n.href}>
              <a href={n.href} onClick={e => go(e, n.href)} aria-current={active === n.href.slice(1) ? "true" : undefined}>{n.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <a className="btn btn-cherry btn-sm" href={profile.resumeFile} download={profile.resumeName}>
            Resume <Download size={15} aria-hidden="true" />
          </a>
          <button ref={toggle} type="button" className="menu-btn" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <ul>
          {nav.map(n => (
            <li key={n.href}><a href={n.href} onClick={e => go(e, n.href)}>{n.label}</a></li>
          ))}
        </ul>
      </div>
      <div className="progress" aria-hidden="true" />
    </header>
  );
}
