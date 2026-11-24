import { useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { otherProjects, projects } from "../data/content";
import { SectionHead } from "./About";
import { AirchestraRoom } from "./rooms/AirchestraRoom";
import { SquishyRoom } from "./rooms/SquishyRoom";

const byId = (id: string) => projects.find(p => p.id === id)!;

function Others() {
  const [hover, setHover] = useState<string | null>(null);
  const shown = otherProjects.find(p => p.name === hover && p.image);
  return (
    <div className="others">
      <h3 className="others-title" data-reveal>More projects</h3>
      <div className="others-wrap">
        <ul className="others-list">
          {otherProjects.map(p => {
            const inner = (
              <>
                <span className="o-name">{p.name}</span>
                <span className="o-kind mono">{p.kind}</span>
                <span className="o-note">{p.note}</span>
              </>
            );
            return (
              <li key={p.name} data-reveal onMouseEnter={() => setHover(p.name)} onMouseLeave={() => setHover(null)}>
                {p.href ? (
                  <a className="o-row" href={p.href} target="_blank" rel="noopener noreferrer" onFocus={() => setHover(p.name)} onBlur={() => setHover(null)}>
                    {inner}<ArrowUpRight className="o-arrow" size={18} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : <div className="o-row">{inner}</div>}
                {p.repo && (
                  <a className="o-repo" href={p.repo} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on GitHub (opens in a new tab)`} onFocus={() => setHover(p.name)} onBlur={() => setHover(null)}>
                    <Github size={18} aria-hidden="true" />
                  </a>
                )}
              </li>
            );
          })}
        </ul>
        <div className={`o-preview ${shown ? "on" : ""}`} aria-hidden="true">
          {otherProjects.filter(p => p.image).map(p => <img key={p.name} src={p.image} alt="" loading="lazy" className={shown?.name === p.name ? "on" : ""} />)}
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <section className="projects section" id="projects" data-stage="3" aria-labelledby="projects-title">
      <div className="shell">
        <SectionHead id="projects-title" label="03 / projects" title={<>Things I've <em>made</em></>}>
          Apps I built for INNOVA's holographic display. Each one has a small demo you can try right here.
        </SectionHead>
      </div>

      <AirchestraRoom project={byId("airchestra")} />
      <SquishyRoom project={byId("squishy")} />

      <div className="shell"><Others /></div>
    </section>
  );
}
