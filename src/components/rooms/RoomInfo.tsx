import { ArrowUpRight, Github } from "lucide-react";
import { isFilled, type Project } from "../../data/content";

/** Text column next to each project's interactive preview. */
export function RoomInfo({ project, n, children }: { project: Project; n: string; children?: React.ReactNode }) {
  const live = project.links.find(l => !l.href.includes("github.com"));
  const repo = project.links.find(l => l.href.includes("github.com"));
  return (
    <div className="room-info" data-reveal>
      <p className="room-meta mono"><span className="room-n">{n}</span>{project.kicker}</p>
      <h3 className="room-title" id={`room-${project.id}-title`}>{project.name}</h3>
      <p className="room-tagline">{project.tagline}</p>
      {(isFilled(project.when) || isFilled(project.role) || project.status) && (
        <p className="room-facts mono">
          {[project.when, project.role].filter(isFilled).join(" · ")}
          {project.status && <>{isFilled(project.when) || isFilled(project.role) ? " · " : ""}<span className="room-status">{project.status}</span></>}
        </p>
      )}
      <p className="room-summary">{project.summary}</p>
      {children}
      <ul className="chips" aria-label="Built with">{project.tech.map(t => <li key={t} className="chip">{t}</li>)}</ul>
      <div className="room-actions">
        {live && (
          <a className="btn btn-cherry" href={live.href} target="_blank" rel="noopener noreferrer">
            {live.label} <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
        {repo && (
          <a className="icon-link" href={repo.href} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} on GitHub (opens in a new tab)`}>
            <Github size={20} aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
}
