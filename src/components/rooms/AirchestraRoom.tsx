import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { Project } from "../../data/content";
import { RoomInfo } from "./RoomInfo";

// The same pentatonic range Airchestra uses: C4 to C6.
const NOTES = [
  ["C", 261.63], ["D", 293.66], ["E", 329.63], ["G", 392.0], ["A", 440.0],
  ["C", 523.25], ["D", 587.33], ["E", 659.25], ["G", 783.99], ["A", 880.0], ["C", 1046.5],
] as const;
const OCT = [4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6];

function usePluck() {
  const ctx = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const play = useCallback((freq: number, vol: number) => {
    if (!ctx.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx.current = new AC();
      master.current = ctx.current.createGain();
      master.current.gain.value = 0.22;
      const comp = ctx.current.createDynamicsCompressor();
      master.current.connect(comp).connect(ctx.current.destination);
    }
    const c = ctx.current, t = c.currentTime;
    if (c.state === "suspended") void c.resume();
    const o = c.createOscillator(), o2 = c.createOscillator(), g = c.createGain();
    o.type = "triangle"; o.frequency.value = freq;
    o2.type = "sine"; o2.frequency.value = freq * 2;
    const g2 = c.createGain(); g2.gain.value = 0.25;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.02, vol), t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    o.connect(g); o2.connect(g2).connect(g); g.connect(master.current!);
    o.start(t); o2.start(t); o.stop(t + 1.5); o2.stop(t + 1.5);
  }, []);
  useEffect(() => () => { void ctx.current?.close(); }, []);
  return play;
}

export function AirchestraRoom({ project }: { project: Project }) {
  const stage = useRef<HTMLDivElement>(null);
  const [note, setNote] = useState<number | null>(null);
  const [vol, setVol] = useState(0.6);
  const [sound, setSound] = useState(false);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const last = useRef<number | null>(null);
  const play = usePluck();

  const strike = (i: number, v: number) => {
    setNote(i);
    if (sound) play(NOTES[i][1], v);
  };

  const onMove = (e: React.PointerEvent) => {
    const r = stage.current!.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    const i = Math.max(0, Math.min(10, Math.floor(x * 11)));
    const v = Math.max(0.05, Math.min(1, 1 - y));
    setVol(v);
    setCursor({ x: x * 100, y: y * 100 });
    if (i !== last.current) { last.current = i; strike(i, v); }
  };

  return (
    <article className="room room-air" id="room-airchestra" aria-labelledby="room-airchestra-title">
      
      <div className="shell room-grid">
        <RoomInfo project={project} n="01">
          <div className="hand-legend">
            <span><i className="swatch a" />right hand: left/right picks the note</span>
            <span><i className="swatch b" />left hand: up/down sets the volume</span>
          </div>
        </RoomInfo>

        <div className="air-demo" data-reveal>
          <div className="demo-bar">
            <span className="mono">try it: your mouse is both hands</span>
            <button type="button" className={`sound-toggle ${sound ? "on" : ""}`} aria-pressed={sound} onClick={() => setSound(s => !s)}>
              {sound ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />} Sound {sound ? "on" : "off"}
            </button>
          </div>
          <div
            ref={stage}
            className="air-stage"
            data-no-pulse
            onPointerMove={onMove}
            onPointerDown={onMove}
            onPointerLeave={() => { setCursor(null); last.current = null; setNote(null); }}
          >
            {NOTES.map(([n], i) => (
              <button
                key={i}
                type="button"
                className={`band ${note === i ? "active" : ""}`}
                aria-label={`Play ${n}${OCT[i]}`}
                onFocus={() => setNote(i)}
                onClick={() => strike(i, vol)}
              >
                <span className="band-label" aria-hidden="true">{n}</span>
              </button>
            ))}
            {cursor && <span className="air-cursor" style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }} aria-hidden="true" />}
            <div className="air-readout" aria-live="polite">
              <span className="mono">now playing</span>
              <strong>{note === null ? "–" : NOTES[note][0]}</strong>
            </div>
            <div className="air-meter" aria-hidden="true"><span style={{ height: `${vol * 100}%` }} /></div>
          </div>
          <p className="demo-note">A simple mouse version. The real app tracks both hands with a webcam.</p>
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
