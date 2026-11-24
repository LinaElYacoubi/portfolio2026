import { useEffect, useState } from "react";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/** Small surprises: type "squishy", or enter the Konami code. Never triggered while typing in a field. */
export function EasterEggs() {
  const [peek, setPeek] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    console.log(
      "%chi! 👋%c\nthis site is React + TypeScript + WebGL + GSAP.\nmove your cursor to light up the background.\nsource: https://github.com/LinaElYacoubi\n(also try typing \"squishy\")",
      "font: 700 16px system-ui; color: #C45B70", "font: 12px ui-monospace, monospace; color: #852D46",
    );
    let typed = "", k = 0;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input,textarea,select,[contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.querySelector("dialog[open]")) return;
      typed = (typed + e.key.toLowerCase()).slice(-7);
      if (typed === "squishy") { setPeek(true); window.setTimeout(() => setPeek(false), 4200); }
      k = e.key === KONAMI[k] || e.key.toLowerCase() === KONAMI[k] ? k + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (k === KONAMI.length) {
        k = 0;
        for (let i = 0; i < 5; i++) {
          window.setTimeout(() => window.dispatchEvent(new CustomEvent("landmark:pulse", { detail: { x: window.innerWidth * (0.2 + Math.random() * 0.6), y: window.innerHeight * (0.2 + Math.random() * 0.6) } })), i * 260);
        }
        setToast("you found the konami code ✋");
        window.setTimeout(() => setToast(""), 3500);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className={`peek ${peek ? "show" : ""}`} aria-hidden={!peek}>
        <span className="peek-bubble">hi! come play with me in Projects ↑</span>
        <span className="peek-jelly"><i /><i /></span>
      </div>
      <p className={`toast ${toast ? "show" : ""}`} role="status">{toast}</p>
    </>
  );
}
