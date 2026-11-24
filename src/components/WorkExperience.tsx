import { Plus } from "lucide-react";
import { experience } from "../data/content";

export function WorkExperience() {
  return <section className="section experience-section" id="experience" aria-labelledby="experience-title">
    <div className="shell">
      <div className="section-heading">
        <h2 id="experience-title">Experience</h2>

      </div>
      <div className="work-timeline">
        {experience.map(item => <article className="work-role" key={item.id} aria-labelledby={`${item.id}-title`}>
          <p className="role-date">{item.period}</p>
          <div className="role-content">
            <h3 id={`${item.id}-title`}>{item.role}</h3>
            <p className="role-employer">{item.organization}</p>
            <p className="role-description">{item.description}</p>
            {item.stats && <dl className="role-results">{item.stats.map(stat => <div key={stat.label}>
              <dt>{stat.label}</dt><dd>{stat.value}</dd>
            </div>)}</dl>}
            {item.detail && <details className="role-detail">
              <summary>More about the work <Plus size={15} aria-hidden="true" /></summary>
              <p>{item.detail}</p>
            </details>}
            <ul className="tags" aria-label="Technologies used">{item.tech.map(tech => <li key={tech}>{tech}</li>)}</ul>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
