import { ArrowDown, Download, Github, Linkedin } from "lucide-react";
import { education, profile } from "../data/content";
import { scrollToTarget } from "../lib/motion";

export function SectionHead({ id, label, title, children }: { id: string; label: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="section-head">
      <p className="section-label mono">{label}</p>
      <h2 id={id} className="h2" data-reveal>{title}</h2>
      {children && <p className="lede" data-reveal>{children}</p>}
    </header>
  );
}

const jump = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); scrollToTarget(id); };

/** First full section after the opening screen: photo, story and the main actions. */
export function About() {
  return (
    <section className="about section" id="about" data-stage="1" aria-labelledby="about-title">
      <div className="shell">
        <div className="about-grid">
          <figure className="portrait" data-reveal>
            <img src="/media/lina-portrait.webp" alt="Portrait of Lina El Yacoubi" width="720" height="720" loading="lazy" decoding="async" />
          </figure>
          <div>
            <SectionHead id="about-title" label="01 / about me" title={<>About <em>me</em></>} />
            <div className="prose" data-reveal>
              <p>
                I'm a 4th-year Software Engineering student at uOttawa. My co-ops covered web development, data and project management at Nordion, and full-stack development at the university's Co-op Office. I also worked in IT support on campus. That means I'm comfortable anywhere from the database to the screen.
              </p>
              <p>
                Today I'm a Digital Navigator at INNOVA. I build apps for its holographic and 360° displays, and I write bilingual guides so visitors can use the equipment. My favourite moment is when someone walks up to one of my apps and gets it in five seconds.
              </p>
              <p>I'm also uOttawa's Head Delegate for CUSEC 2027, leading a delegation of 30+ students.</p>
            </div>
            <dl className="facts" data-reveal>
              <div><dt>School</dt><dd>{education.degree}, {education.school}</dd></div>
              <div><dt>Graduating</dt><dd>{profile.graduation} · {education.note}</dd></div>
            </dl>
            <div className="cta-row" data-reveal>
              <a href="#experience" className="btn btn-cherry" onClick={jump("#experience")}>
                See my work <ArrowDown size={18} aria-hidden="true" />
              </a>
              <a href={profile.resumeFile} download={profile.resumeName} className="btn btn-glass">
                Resume <Download size={17} aria-hidden="true" />
              </a>
              <a href={profile.github} className="icon-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)"><Github size={20} aria-hidden="true" /></a>
              <a href={profile.linkedin} className="icon-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)"><Linkedin size={20} aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
