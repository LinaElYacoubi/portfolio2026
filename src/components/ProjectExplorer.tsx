import { useState } from "react";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { projects } from "../data/content";

export function ProjectExplorer() {
  const [selected, setSelected] = useState(0);
  const project = projects[selected];

  return (
    <div className="project-explorer">
      <div className="project-picker" aria-label="Choose a project">
        {projects.map((item, index) => (
          <button key={item.id} type="button" aria-pressed={selected === index}
            onClick={() => setSelected(index)}>
            <span className="picker-number">0{index + 1}</span>
            <span>{item.name}</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </button>
        ))}
      </div>
      <article className="project-stage" aria-label="Selected project">
        <div className="stage-art" key={project.image}>
          <img src={project.image} alt={project.alt} width="1536" height="1024" />
          <span className="art-caption">a cover illustration, not the app</span>
        </div>
        <div className="stage-copy" aria-live="polite" aria-atomic="true">
          <div className="project-meta"><span>{project.category}</span><span>{project.team}</span></div>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          {project.contribution && <p className="contribution"><strong>My part:</strong> {project.contribution}</p>}
          <ul className="tags" aria-label="Technologies">{project.tech.map(t => <li key={t}>{t}</li>)}</ul>
          <a className="button primary" href={project.demo} target="_blank" rel="noopener noreferrer">
            Open {project.name} <ArrowUpRight size={18} /><span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <div className="project-controls">
          <span>0{selected + 1} <span className="control-divider">/ 04</span></span>
          <div>
            <button type="button" aria-label="Previous project" onClick={() => setSelected((selected + projects.length - 1) % projects.length)}><ArrowLeft size={19} /></button>
            <button type="button" aria-label="Next project" onClick={() => setSelected((selected + 1) % projects.length)}><ArrowRight size={19} /></button>
          </div>
        </div>
      </article>
    </div>
  );
}
