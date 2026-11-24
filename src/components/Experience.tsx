import { useEffect, useRef } from "react";
import { experience, type Job } from "../data/content";
import { gsap, reducedMotion } from "../lib/motion";
import { SectionHead } from "./About";

function Points({ job }: { job: Job }) {
  return <ul className="job-points">{job.points.map(p => <li key={p}>{p}</li>)}</ul>;
}
function Tech({ job }: { job: Job }) {
  return <ul className="chips" aria-label="Tools">{job.tech.map(t => <li key={t} className="chip">{t}</li>)}</ul>;
}
function Title({ job }: { job: Job }) {
  return (
    <>
      <p className="job-when mono">{job.period}</p>
      <h3 className="job-title"><span>{job.role}</span><span className="sr-only">, </span><span className="job-org">{job.org}</span></h3>
    </>
  );
}

/** Co-op Office: framed like an app window, since it was all app work. */
function CodeJob({ job }: { job: Job }) {
  return (
    <article className="job job-code" id={`job-${job.id}`} data-reveal>
      <div className="win-bar" aria-hidden="true">
        <span className="win-dots"><i /><i /><i /></span>
        <span className="mono">co-op-office / internal-apps</span>
        <span className="win-tabs mono"><b>.razor</b><b>.cs</b><b>.vb</b><b>.sql</b></span>
      </div>
      <div className="job-body">
        <Title job={job} />
        {job.intro && <p className="job-intro">{job.intro}</p>}
        <Points job={job} />
        <div className="deps">
          <p className="mono deps-label">stack</p>
          <Tech job={job} />
        </div>
      </div>
    </article>
  );
}

/** Nordion: numbers first, plus a before/after bar for data retrieval. */
function DataJob({ job }: { job: Job }) {
  return (
    <article className="job job-data" id={`job-${job.id}`} data-reveal>
      <div className="job-body">
        <Title job={job} />
        {job.intro && <p className="job-intro">{job.intro}</p>}
        {job.stats && (
          <div className="stats">
            {job.stats.map(s => (
              <div className="stat" key={s.label}>
                <span className="stat-value">{s.prefix}<span className="count" data-to={s.value}>{s.value}</span>{s.suffix}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        )}
        <div className="retrieval" role="img" aria-label="Time to find data: hours before the database, under 10 minutes after">
          <div className="bar-row"><span className="mono">before</span><span className="bar before"><i /></span><span className="mono">hours</span></div>
          <div className="bar-row"><span className="mono">after</span><span className="bar after"><i /></span><span className="mono">&lt; 10 min</span></div>
        </div>
        <Points job={job} />
        <Tech job={job} />
      </div>
    </article>
  );
}

/** INNOVA: holographic panel. */
function HoloJob({ job }: { job: Job }) {
  return (
    <article className="job job-holo" id={`job-${job.id}`} data-reveal>
      <div className="job-body">
        <Title job={job} />
        {job.intro && <p className="job-intro">{job.intro}</p>}
        <Points job={job} />
        <Tech job={job} />
      </div>
    </article>
  );
}

function CompactJob({ job }: { job: Job }) {
  return (
    <article className="job job-compact" id={`job-${job.id}`} data-reveal>
      <Title job={job} />
      <details>
        <summary>What I did</summary>
        <Points job={job} />
      </details>
      <Tech job={job} />
    </article>
  );
}

const byLook = { code: CodeJob, data: DataJob, holo: HoloJob, compact: CompactJob };

export function Experience() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".count").forEach(el => {
        const o = { v: 0 };
        gsap.to(o, {
          v: Number(el.dataset.to), duration: 1.5, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => { el.textContent = String(Math.round(o.v)); },
        });
      });
      gsap.from(".bar i", { scaleX: 0, duration: 1.4, ease: "expo.out", stagger: 0.25, scrollTrigger: { trigger: ".retrieval", start: "top 85%" } });
    }, root);
    return () => ctx.revert();
  }, []);

  const big = experience.filter(j => j.look !== "compact");
  const small = experience.filter(j => j.look === "compact");

  return (
    <section className="experience section" id="experience" data-stage="2" ref={root} aria-labelledby="exp-title">
      <div className="shell">
        <SectionHead id="exp-title" label="02 / experience" title={<>Where I've <em>worked</em></>}>
          Five roles across interactive tech, full-stack development, data, IT and web.
        </SectionHead>
        <div className="jobs">
          {big.map(j => { const C = byLook[j.look]; return <C key={j.id} job={j} />; })}
          <div className="jobs-small">{small.map(j => <CompactJob key={j.id} job={j} />)}</div>
        </div>
      </div>
    </section>
  );
}
