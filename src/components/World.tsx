import { useEffect, useRef } from "react";
import { mountWorld } from "../lib/world";

/** Fixed background: soft glows plus the flowing Silk gradient that shifts per section (see lib/world.ts). */
export function World() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => (root.current ? mountWorld(root.current) : undefined), []);

  return (
    <div className="world" ref={root} aria-hidden="true">
      <div className="world-glow"><i /><i /><i /></div>
      <canvas className="world-canvas" />
      <div className="world-grain" />
    </div>
  );
}
