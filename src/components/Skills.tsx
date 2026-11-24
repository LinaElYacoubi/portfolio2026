import { skills } from "../data/content";
import { SectionHead } from "./About";

export function Skills() {
  return (
    <section className="skills section" id="skills" data-stage="5" aria-labelledby="skills-title">
      <div className="shell">
        <SectionHead id="skills-title" label="05 / skills" title={<>What I <em>work with</em></>} />
        <div className="skill-grid">
          {skills.map((g, i) => (
            <div key={g.title} className="skill-group glass" data-reveal>
              <p className="mono skill-n">0{i + 1}</p>
              <h3>{g.title}</h3>
              <ul className="chips">{g.items.map(s => <li key={s} className="chip">{s}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
