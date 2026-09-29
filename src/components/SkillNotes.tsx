import { useState } from "react";
import { Search, X } from "lucide-react";
import { skills } from "../data/content";

export function SkillNotes() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const visible = skills.filter(group => category === "All" || group.title === category)
    .map(group => ({ ...group, items: group.items.filter(item => item.toLowerCase().includes(query.trim().toLowerCase())) }))
    .filter(group => group.items.length > 0);
  const count = visible.reduce((sum, group) => sum + group.items.length, 0);
  return <div className="skills-browser">
    <div className="skills-toolbar"><h3>My toolkit</h3><div className="skills-search">
      <Search size={16} aria-hidden="true" /><label className="sr-only" htmlFor="skill-search">Find a skill</label>
      <input id="skill-search" type="search" placeholder="Find a skill…" value={query} onChange={event => setQuery(event.target.value)} />
      {query && <button type="button" aria-label="Clear skill search" onClick={() => { setQuery(""); document.getElementById("skill-search")?.focus(); }}><X size={15} /></button>}
    </div></div>
    <div className="skills-filters" role="group" aria-label="Filter skills by category">
      {["All", ...skills.map(group => group.title)].map(title => <button type="button" key={title} aria-pressed={category === title} onClick={() => setCategory(title)}>{title}</button>)}
    </div>
    <p className="skills-result" role="status">{count} {count === 1 ? "skill" : "skills"}{category === "All" ? " across my toolkit" : ` in ${category.toLowerCase()}`}{query.trim() ? ` matching “${query.trim()}”` : ""}</p>
    <div className="skills-grid">{visible.map(group => <section className="skill-group" key={group.title} aria-labelledby={`skills-${group.id}`}>
      <h4 id={`skills-${group.id}`}>{group.title}</h4><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
    </section>)}</div>
    {count === 0 && <div className="skills-empty"><p>No skills match this search.</p><button type="button" onClick={() => { setCategory("All"); setQuery(""); }}>Show all skills</button></div>}
  </div>;
}
