import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Copy, Download } from "lucide-react";
import { profile } from "../data/content";


export function Contact() {
  const [copy, setCopy] = useState<"idle" | "ok" | "fail">("idle");

  useEffect(() => {
    if (copy === "idle") return;
    const t = window.setTimeout(() => setCopy("idle"), 3000);
    return () => window.clearTimeout(t);
  }, [copy]);

  const doCopy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopy("ok"); }
    catch { setCopy("fail"); }
  };

  return (
    <section className="contact section dark" id="contact" data-stage="6" aria-labelledby="contact-title">
      <div className="shell">
        <div className="contact-inner">
        <p className="section-label mono">06 / contact</p>
        <h2 id="contact-title" className="contact-title" data-reveal>Say <em>hi</em></h2>
        <p className="lede" data-reveal>
          Have a role in mind, a question about one of my projects, or just want to talk about hand tracking? Send me an email.
        </p>
        <div className="contact-mail" data-reveal>
          <a className="mail" href={`mailto:${profile.email}`}>{profile.email}</a>
          <button type="button" className="btn btn-glass btn-sm" onClick={doCopy}>
            {copy === "ok" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />} {copy === "ok" ? "Copied" : "Copy"}
          </button>
          <p className="copy-status mono" role="status">{copy === "ok" ? "Copied to clipboard." : copy === "fail" ? "Couldn't copy, but you can select it." : ""}</p>
        </div>
        <ul className="contact-links" data-reveal>
          <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn<ArrowUpRight aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></li>
          <li><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub<ArrowUpRight aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></li>
          <li><a href={profile.resumeFile} download={profile.resumeName}>Resume (PDF)<Download aria-hidden="true" /></a></li>
        </ul>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer"><div className="shell footer-inner">
      <p>Made by Lina with React, TypeScript and WebGL. © {new Date().getFullYear()}</p>
      <p className="mono footer-hint">psst: type “squishy”</p>
    </div>
    </footer>
  );
}
