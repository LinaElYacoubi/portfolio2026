// Point sets for the hero particles. Each shape is centered at the origin, about 4.4 wide and 3.2 tall,
// and returns `count` xyz points. The same particle index moves between shapes when they morph.

export type Rand = () => number;

export function mulberry32(seed: number): Rand {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const gauss = (r: Rand) => {
  const u = Math.max(r(), 1e-6);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
};

type P2 = [number, number];

/** A random point on a polyline (list of segments), with a little thickness. */
function onPolyline(points: P2[], r: Rand, thick: number): P2 {
  const segs: [P2, P2, number][] = [];
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i], b = points[i + 1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    segs.push([a, b, len]);
    total += len;
  }
  let pick = r() * total;
  for (const [a, b, len] of segs) {
    if (pick <= len) {
      const t = pick / len;
      return [a[0] + (b[0] - a[0]) * t + gauss(r) * thick, a[1] + (b[1] - a[1]) * t + gauss(r) * thick];
    }
    pick -= len;
  }
  return points[points.length - 1];
}

const put = (out: Float32Array, i: number, x: number, y: number, r: Rand, depth = 0.12) => {
  out[i * 3] = x; out[i * 3 + 1] = y; out[i * 3 + 2] = gauss(r) * depth;
};

/** 1. An app window: outline, title bar with three dots, and a </> in the middle. */
export function appWindow(count: number, r: Rand): Float32Array {
  const out = new Float32Array(count * 3);
  const W = 4.4, H = 3.0, top = H / 2, bar = top - 0.42;
  const outline: P2[] = [[-W / 2, -top], [W / 2, -top], [W / 2, top], [-W / 2, top], [-W / 2, -top]];
  const cy = -0.25;
  const lt: P2[] = [[-0.55, cy + 0.5], [-1.2, cy], [-0.55, cy - 0.5]];
  const slash: P2[] = [[0.28, cy + 0.62], [-0.28, cy - 0.62]];
  const gt: P2[] = [[0.55, cy + 0.5], [1.2, cy], [0.55, cy - 0.5]];
  for (let i = 0; i < count; i++) {
    const k = r();
    let p: P2;
    if (k < 0.38) p = onPolyline(outline, r, 0.022);
    else if (k < 0.46) p = onPolyline([[-W / 2, bar], [W / 2, bar]], r, 0.018);
    else if (k < 0.52) {
      const d = Math.floor(r() * 3), a = r() * Math.PI * 2, rad = Math.sqrt(r()) * 0.075;
      p = [-W / 2 + 0.3 + d * 0.24 + Math.cos(a) * rad, top - 0.21 + Math.sin(a) * rad];
    } else if (k < 0.70) p = onPolyline(lt, r, 0.03);
    else if (k < 0.82) p = onPolyline(slash, r, 0.03);
    else p = onPolyline(gt, r, 0.03);
    put(out, i, p[0], p[1], r);
  }
  return out;
}

/**
 * 2. A data grid: table lines plus bars of "data" in each row. `flow` gets a horizontal speed for
 * the data points (0 for the grid lines), so the shader can make rows stream sideways.
 */
export const GRID_W = 4.4;
export function dataGrid(count: number, r: Rand, flow: Float32Array): Float32Array {
  const out = new Float32Array(count * 3);
  const W = GRID_W, H = 3.0, rows = 6, cols = 5;
  const rowH = H / rows, colW = W / cols;
  const speeds = Array.from({ length: rows }, (_, i) => (i === 0 ? 0 : 0.18 + ((i * 37) % 5) * 0.06));
  for (let i = 0; i < count; i++) {
    const k = r();
    let x: number, y: number;
    flow[i] = 0;
    if (k < 0.22) { // horizontal lines
      const line = Math.floor(r() * (rows + 1));
      x = (r() - 0.5) * W; y = H / 2 - line * rowH + gauss(r) * 0.015;
    } else if (k < 0.36) { // vertical lines
      const line = Math.floor(r() * (cols + 1));
      x = -W / 2 + line * colW + gauss(r) * 0.015; y = (r() - 0.5) * H;
    } else { // data bars, one row at a time
      const row = Math.floor(r() * rows);
      const col = Math.floor(r() * cols);
      const len = 0.35 + ((row * 7 + col * 3) % 5) * 0.1;
      x = -W / 2 + col * colW + 0.12 + r() * len;
      y = H / 2 - (row + 0.5) * rowH + gauss(r) * 0.03;
      flow[i] = speeds[row];
    }
    put(out, i, x, y, r, 0.08);
  }
  return out;
}

// MediaPipe-style hand: 21 landmarks (palm facing the viewer, fingers up).
const L: P2[] = [
  [0, -1.6], // 0 wrist
  [-0.55, -1.15], [-0.95, -0.7], [-1.25, -0.25], [-1.45, 0.1], // 1-4 thumb
  [-0.45, -0.05], [-0.55, 0.6], [-0.6, 1.0], [-0.63, 1.35], // 5-8 index
  [0, 0], [0, 0.72], [0, 1.15], [0, 1.55], // 9-12 middle
  [0.42, -0.08], [0.5, 0.58], [0.55, 0.98], [0.58, 1.3], // 13-16 ring
  [0.78, -0.25], [0.92, 0.25], [1.0, 0.55], [1.05, 0.82], // 17-20 pinky
];
const BONES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [5, 6], [6, 7], [7, 8], [9, 10], [10, 11], [11, 12], [13, 14], [14, 15], [15, 16], [17, 18], [18, 19], [19, 20],
  [0, 5], [5, 9], [9, 13], [13, 17], [0, 17],
];

/** 3. A hand: joints, bones, and a soft outline of the fingers around them. */
export function hand(count: number, r: Rand): Float32Array {
  const out = new Float32Array(count * 3);
  const sx = 0.2, sy = 0.05; // nudge to center the shape
  for (let i = 0; i < count; i++) {
    const k = r();
    let x: number, y: number;
    if (k < 0.22) { // joints
      const j = L[Math.floor(r() * L.length)];
      x = j[0] + gauss(r) * 0.045; y = j[1] + gauss(r) * 0.045;
    } else {
      const [a, b] = BONES[Math.floor(r() * BONES.length)];
      const t = r();
      const px = L[a][0] + (L[b][0] - L[a][0]) * t, py = L[a][1] + (L[b][1] - L[a][1]) * t;
      if (k < 0.55) { x = px + gauss(r) * 0.018; y = py + gauss(r) * 0.018; } // bone line
      else { // skin: a ring around the bone
        const dx = L[b][0] - L[a][0], dy = L[b][1] - L[a][1], len = Math.hypot(dx, dy) || 1;
        const side = r() < 0.5 ? -1 : 1, rad = 0.13 + gauss(r) * 0.02;
        x = px + (-dy / len) * rad * side; y = py + (dx / len) * rad * side;
      }
    }
    put(out, i, x + sx, y + sy, r, 0.1);
  }
  return out;
}
