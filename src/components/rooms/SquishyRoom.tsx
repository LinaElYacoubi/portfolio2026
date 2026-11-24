import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "../../data/content";
import { reducedMotion } from "../../lib/motion";
import { RoomInfo } from "./RoomInfo";

type Mood = "happy" | "chomp" | "sleepy" | "full" | "dizzy";
type Food = { id: "strawberry" | "butter" | "blueberry"; label: string };
const FOODS: Food[] = [
  { id: "strawberry", label: "strawberry" },
  { id: "butter", label: "butter cube" },
  { id: "blueberry", label: "blueberry" },
];

export function SquishyRoom({ project }: { project: Project }) {
  const box = useRef<HTMLDivElement>(null);
  const blob = useRef<HTMLDivElement>(null);
  const eyes = useRef<HTMLDivElement>(null);
  const [mood, setMood] = useState<Mood>("happy");
  const [bubble, setBubble] = useState("");
  const [held, setHeld] = useState<string | null>(null);
  const [eaten, setEaten] = useState<Record<string, number>>({});
  const reduced = useRef(false);

  // Physics state lives in refs so the loop never re-renders React.
  const s = useRef({
    W: 600, H: 420, S: 150,
    x: 300, y: 200, vx: 0, vy: 0,
    grab: false, gx: 0, gy: 0, px: 0, py: 0, hist: [] as { x: number; y: number; t: number }[],
    w: 0, wv: 0, pet: 0, lastPet: 0, visible: false, greeted: false, snacks: 0, fullUntil: 0,
  });
  const moodRef = useRef<Mood>("happy");
  const timers = useRef<number[]>([]);

  const lastSay = useRef(0);
  const say = useCallback((text: string, ms = 2200) => {
    lastSay.current = performance.now();
    setBubble(text);
    const t = window.setTimeout(() => setBubble(b => (b === text ? "" : b)), ms);
    timers.current.push(t);
  }, []);
  const setMoodFor = useCallback((m: Mood, ms: number) => {
    moodRef.current = m; setMood(m);
    const t = window.setTimeout(() => { if (moodRef.current === m) { moodRef.current = "happy"; setMood("happy"); } }, ms);
    timers.current.push(t);
  }, []);

  useEffect(() => {
    reduced.current = reducedMotion();
    const st = s.current;
    const el = box.current!;
    const measure = () => {
      const r = el.getBoundingClientRect();
      st.W = r.width; st.H = r.height; st.S = r.width < 520 ? 116 : 150;
      if (!st.grab) { st.x = Math.min(Math.max(st.x, st.S / 2), st.W - st.S / 2); st.y = st.H - st.S * 0.45; }
      draw();
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    st.x = el.clientWidth * 0.6;

    let raf = 0, last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.033, (now - last) / 1000); last = now;
      step(dt);
      draw();
    };
    const io = new IntersectionObserver(([e]) => {
      st.visible = e.isIntersecting;
      if (e.isIntersecting) {
        if (!st.greeted) { st.greeted = true; if (performance.now() - lastSay.current > 2500) say("Hi, I'm Squishy! Pinch me.", 2800); }
        if (!reduced.current && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
      } else if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }, { threshold: 0.15 });
    io.observe(el);
    const tm = timers.current;
    return () => { ro.disconnect(); io.disconnect(); cancelAnimationFrame(raf); tm.forEach(clearTimeout); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function step(dt: number) {
    const st = s.current;
    const floor = st.H - st.S * 0.45, r = st.S * 0.5;
    if (st.grab) {
      const tx = st.px - st.gx, ty = st.py - st.gy;
      st.vx += (tx - st.x) * 160 * dt; st.vy += (ty - st.y) * 160 * dt;
      const damp = Math.pow(0.0008, dt);
      st.vx *= damp; st.vy *= damp;
    } else {
      st.vy += 2600 * dt;
    }
    st.x += st.vx * dt; st.y += st.vy * dt;
    if (!st.grab) {
      if (st.y > floor) {
        if (st.vy > 260) { st.wv += Math.min(st.vy, 2400) * 0.0016; if (st.vy > 1500 && moodRef.current === "happy") setMoodFor("dizzy", 1300); }
        st.y = floor; st.vy = -st.vy * 0.48; if (Math.abs(st.vy) < 90) st.vy = 0;
        st.vx *= 0.86;
      }
      if (st.y < r * 0.6) { st.y = r * 0.6; st.vy = Math.abs(st.vy) * 0.5; }
      if (st.x < r) { st.x = r; st.vx = Math.abs(st.vx) * 0.6; st.wv += 0.6; }
      if (st.x > st.W - r) { st.x = st.W - r; st.vx = -Math.abs(st.vx) * 0.6; st.wv += 0.6; }
    }
    // jelly wobble: damped spring
    st.wv += (-st.w * 220 - st.wv * 9) * dt;
    st.w += st.wv * dt;
  }

  function draw() {
    const st = s.current, b = blob.current;
    if (!b) return;
    let ang = 0, stretch = 0;
    if (st.grab) {
      const dx = st.px - st.gx - st.x, dy = st.py - st.gy - st.y;
      stretch = Math.min(0.42, Math.hypot(dx, dy) / 260);
      ang = Math.atan2(dy, dx);
    } else {
      const sp = Math.hypot(st.vx, st.vy);
      stretch = Math.min(0.25, sp / 5000);
      ang = Math.atan2(st.vy, st.vx);
    }
    const w = Math.max(-0.3, Math.min(0.3, st.w));
    const deg = (ang * 180) / Math.PI;
    b.style.width = b.style.height = `${st.S}px`;
    b.style.transform =
      `translate(${st.x - st.S / 2}px, ${st.y - st.S / 2}px) rotate(${deg}deg) scale(${1 + stretch}, ${1 - stretch * 0.55}) rotate(${-deg}deg) scale(${1 + w}, ${1 - w})`;
    if (eyes.current) {
      const dx = st.px - st.x, dy = st.py - (st.y - st.S * 0.1), d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 160) * (st.S / 25);
      eyes.current.style.transform = `translate(${(dx / d) * k}px, ${(dy / d) * k}px)`;
    }
  }

  const local = (e: React.PointerEvent | PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onBlobDown = (e: React.PointerEvent) => {
    const st = s.current, p = local(e);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    st.grab = true; st.gx = p.x - st.x; st.gy = p.y - st.y; st.px = p.x; st.py = p.y; st.hist = [];
    if (moodRef.current === "sleepy") { moodRef.current = "happy"; setMood("happy"); say("Huh? I'm awake!"); }
    else if (Math.random() < 0.5) say("Wheee!", 1200);
    if (reduced.current) { st.wv += 1.2; draw(); }
  };
  const onMove = (e: React.PointerEvent) => {
    const st = s.current, p = local(e);
    const moved = Math.hypot(p.x - st.px, p.y - st.py);
    st.px = p.x; st.py = p.y;
    if (st.grab) {
      st.hist.push({ x: p.x, y: p.y, t: performance.now() });
      if (st.hist.length > 6) st.hist.shift();
      if (reduced.current) { st.x = p.x - st.gx; st.y = p.y - st.gy; draw(); }
      return;
    }
    // petting: slow movement over the top of the head
    const head = Math.hypot(p.x - st.x, p.y - (st.y - st.S * 0.25)) < st.S * 0.55;
    const now = performance.now();
    if (head && !held) {
      if (now - st.lastPet > 900) st.pet = 0;
      st.pet += moved; st.lastPet = now;
      if (st.pet > 1100 && moodRef.current === "happy") { st.pet = 0; setMoodFor("sleepy", 6000); say("Zzz… so cosy", 3000); }
    }
    if (reduced.current) draw();
  };
  const onBlobUp = () => {
    const st = s.current;
    if (!st.grab) return;
    st.grab = false;
    const h = st.hist;
    if (h.length >= 2) {
      const a = h[0], z = h[h.length - 1], dt = Math.max(16, z.t - a.t) / 1000;
      st.vx = Math.max(-3200, Math.min(3200, (z.x - a.x) / dt));
      st.vy = Math.max(-3200, Math.min(3200, (z.y - a.y) / dt));
      if (Math.hypot(st.vx, st.vy) > 1400) say("Again! Again!", 1500);
    }
    if (reduced.current) { st.y = st.H - st.S * 0.45; st.vx = st.vy = 0; draw(); }
  };

  const eat = useCallback((food: Food) => {
    const st = s.current, now = performance.now();
    if (now < st.fullUntil) { say("I'm full! Maybe later."); return false; }
    st.snacks += 1;
    const n = (eaten[food.id] ?? 0) + 1;
    setEaten(prev => ({ ...prev, [food.id]: n }));
    setMoodFor("chomp", 900);
    st.wv += 1.4;
    if (st.snacks >= 2) { st.snacks = 0; st.fullUntil = now + 9000; say(n >= 2 ? `My favourite! …and now I'm full.` : "Nom! Okay, I'm full now.", 2600); }
    else say(n >= 2 ? `${food.label[0].toUpperCase() + food.label.slice(1)}! My favourite ♥` : `Nom! A ${food.label}!`);
    if (reduced.current) draw();
    return true;
  }, [eaten, say, setMoodFor]);

  // Food dragging
  const foodHome = useRef<Record<string, HTMLButtonElement | null>>({});
  const onFoodDown = (e: React.PointerEvent<HTMLButtonElement>, f: Food) => {
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    setHeld(f.id);
    const start = local(e);
    el.style.transition = "none";
    el.dataset.sx = String(start.x); el.dataset.sy = String(start.y);
  };
  const onFoodMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    if (!el.hasPointerCapture(e.pointerId)) return;
    const p = local(e);
    el.style.transform = `translate(${p.x - Number(el.dataset.sx)}px, ${p.y - Number(el.dataset.sy)}px) scale(1.15)`;
    s.current.px = p.x; s.current.py = p.y;
    if (reduced.current) draw();
  };
  const onFoodUp = (e: React.PointerEvent<HTMLButtonElement>, f: Food) => {
    const el = e.currentTarget, st = s.current, p = local(e);
    setHeld(null);
    const near = Math.hypot(p.x - st.x, p.y - (st.y + st.S * 0.12)) < st.S * 0.62;
    const ok = near && eat(f);
    el.style.transition = "transform .6s cubic-bezier(.2,.9,.3,1.3), opacity .3s";
    if (ok) { el.style.opacity = "0"; el.style.transform += " scale(0.2)"; window.setTimeout(() => { el.style.transition = "none"; el.style.transform = ""; requestAnimationFrame(() => { el.style.transition = "opacity .5s"; el.style.opacity = "1"; }); }, 500); }
    else el.style.transform = "";
  };

  const toss = () => {
    const st = s.current;
    st.vy = -1500 - Math.random() * 500; st.vx = (Math.random() - 0.5) * 1600; st.wv += 1;
    say("Wheee!", 1300);
    if (reduced.current) { st.wv = 0; say("Boing! (motion is reduced, so I stay put)", 2200); }
  };
  const pet = () => { if (moodRef.current === "happy") { setMoodFor("sleepy", 5000); say("Zzz… so cosy", 2500); } };

  return (
    <article className="room room-squishy" id="room-squishy" aria-labelledby="room-squishy-title">
      
      <div className="shell room-grid room-grid-flip">
        <RoomInfo project={project} n="02">
          <ul className="mechanics">
            <li><b>pinch</b> grab &amp; stretch</li>
            <li><b>flick</b> throw it</li>
            <li><b>carry</b> feed it a snack</li>
            <li><b>pet</b> it falls asleep</li>
          </ul>
        </RoomInfo>

        <div className="squishy-demo" data-reveal>
          <div className="demo-bar">
            <span className="mono">try it: drag Squishy, throw it, drag a snack to its mouth</span>
          </div>
          <div ref={box} className="squishy-box" data-no-pulse onPointerMove={onMove}>
            <p className={`speech ${bubble ? "show" : ""}`} role="status" aria-live="polite">{bubble}</p>
            <div
              ref={blob}
              className={`jelly mood-${mood}`}
              onPointerDown={onBlobDown}
              onPointerUp={onBlobUp}
              onPointerCancel={onBlobUp}
              aria-hidden="true"
            >
              <span className="jelly-shine" />
              <div className="jelly-face">
                <div className="jelly-eyes" ref={eyes}><i /><i /></div>
                <span className="jelly-cheek l" /><span className="jelly-cheek r" />
                <span className="jelly-mouth" />
              </div>
              {mood === "sleepy" && <span className="zzz">z z z</span>}
            </div>
            <div className={`tray ${held ? "holding" : ""}`}>
              {FOODS.map(f => (
                <button
                  key={f.id}
                  ref={el => { foodHome.current[f.id] = el; }}
                  type="button"
                  className={`food food-${f.id}`}
                  aria-label={`Feed Squishy a ${f.label}`}
                  onPointerDown={e => onFoodDown(e, f)}
                  onPointerMove={onFoodMove}
                  onPointerUp={e => onFoodUp(e, f)}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); eat(f); } }}
                />
              ))}
            </div>
          </div>
          <div className="squishy-keys" aria-label="Keyboard controls">
            <button type="button" className="chip chip-btn" onClick={toss}>Toss Squishy</button>
            <button type="button" className="chip chip-btn" onClick={pet}>Pet Squishy</button>
            <span className="mono demo-note">Snacks eaten: {Object.values(eaten).reduce((a, b) => a + b, 0)}</span>
          </div>
        </div>
      </div>
      <div className="shell room-shots" data-reveal>
        {project.media.map(m => (
          <figure key={m.src} className="shot">
            <img src={m.src} alt={m.alt} loading="lazy" decoding="async" width="1280" height="800" />
            <figcaption className="mono">{m.caption}</figcaption>
          </figure>
        ))}
      </div>
    </article>
  );
}
