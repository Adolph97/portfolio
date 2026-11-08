/**
 * Point clouds for the hero's morphing field. Every shape has the same number
 * of points, so the shader can morph index i in one shape to index i in the next.
 *
 * Layout of each Float32Array (xyz per point):
 *  - the first `accent` points are the ochre accent (the mark's Initiative dot,
 *    a firing path, the chart line, the typing dots, the six countries);
 *  - the rest are paper-white.
 * Both groups are sorted along the rising-arrow direction (1, 1, 0) so neighbours
 * stay neighbours between shapes and each morph sweeps bottom-left to top-right.
 */

import { MARK_DOTS, MARK_PATHS } from '../components/Brand/KonaLogo';

export type ShapeId = 'logo' | 'ai' | 'tools' | 'product' | 'chat' | 'globe';
export const SHAPE_IDS: ShapeId[] = ['logo', 'ai', 'tools', 'product', 'chat', 'globe'];

type Rng = () => number;
type V3 = [number, number, number];

/** Small seeded RNG so the shapes are identical on every load. */
export const mulberry32 = (seed: number): Rng => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const gauss = (rng: Rng) => {
  const u = Math.max(rng(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
};

// ------------------------------------------------------------------ primitives

/** Absolute M/L/H/V paths (all the mark uses) → polyline points. */
const parseLinePath = (d: string): [number, number][] => {
  const out: [number, number][] = [];
  const re = /([MLHV])\s*([-\d.]+)(?:[\s,]+([-\d.]+))?/g;
  let x = 0;
  let y = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(d))) {
    const [, cmd, a, b] = m;
    if (cmd === 'H') x = +a;
    else if (cmd === 'V') y = +a;
    else {
      x = +a;
      y = +(b ?? 0);
    }
    out.push([x, y]);
  }
  return out;
};

type Capsule = { ax: number; ay: number; bx: number; by: number; r: number };

/** Uniform samples inside round-capped strokes, weighted by area. */
const sampleCapsules = (caps: Capsule[], n: number, rng: Rng, z: () => number): V3[] => {
  const areas = caps.map((c) => 2 * c.r * Math.hypot(c.bx - c.ax, c.by - c.ay) + Math.PI * c.r * c.r);
  const total = areas.reduce((s, a) => s + a, 0);
  const out: V3[] = [];
  while (out.length < n) {
    let pick = rng() * total;
    let c = caps[0];
    for (let i = 0; i < caps.length; i++) {
      pick -= areas[i];
      if (pick <= 0) {
        c = caps[i];
        break;
      }
    }
    const L = Math.hypot(c.bx - c.ax, c.by - c.ay) || 1e-6;
    const ux = (c.bx - c.ax) / L;
    const uy = (c.by - c.ay) / L;
    const t = -c.r + rng() * (L + 2 * c.r);
    const o = (rng() * 2 - 1) * c.r;
    const tc = Math.min(L, Math.max(0, t));
    if (Math.hypot(t - tc, o) > c.r) continue;
    out.push([c.ax + ux * t - uy * o, c.ay + uy * t + ux * o, z()]);
  }
  return out;
};

const sampleDisc = (cx: number, cy: number, r: number, n: number, rng: Rng, z: () => number): V3[] =>
  Array.from({ length: n }, () => {
    const a = rng() * Math.PI * 2;
    const d = r * Math.sqrt(rng());
    return [cx + Math.cos(a) * d, cy + Math.sin(a) * d, z()] as V3;
  });

/** Points spread evenly by length along a polyline, with a little jitter. */
const samplePolyline = (pts: V3[], n: number, rng: Rng, jitter = 0.008, closed = false): V3[] => {
  const segs: [V3, V3, number][] = [];
  const last = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < last; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    segs.push([a, b, Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])]);
  }
  const total = segs.reduce((s, g) => s + g[2], 0);
  const out: V3[] = [];
  for (let k = 0; k < n; k++) {
    let d = ((k + rng()) / n) * total;
    let seg = segs[segs.length - 1];
    for (const g of segs) {
      if (d <= g[2]) {
        seg = g;
        break;
      }
      d -= g[2];
    }
    const t = seg[2] ? Math.min(1, d / seg[2]) : 0;
    const [a, b] = seg;
    out.push([
      a[0] + (b[0] - a[0]) * t + gauss(rng) * jitter,
      a[1] + (b[1] - a[1]) * t + gauss(rng) * jitter,
      a[2] + (b[2] - a[2]) * t + gauss(rng) * jitter,
    ]);
  }
  return out;
};

/** Rounded rectangle outline in the XY plane (z fixed). */
const roundRect = (x0: number, y0: number, x1: number, y1: number, r: number, z = 0): V3[] => {
  const pts: V3[] = [];
  const corners: [number, number, number][] = [
    [x1 - r, y1 - r, 0],
    [x0 + r, y1 - r, Math.PI / 2],
    [x0 + r, y0 + r, Math.PI],
    [x1 - r, y0 + r, (3 * Math.PI) / 2],
  ];
  for (const [cx, cy, start] of corners) {
    for (let i = 0; i <= 6; i++) {
      const a = start + (i / 6) * (Math.PI / 2);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, z]);
    }
  }
  return pts;
};

/** Sparse jittered grid inside a rectangle: the site's dot-grid language. */
const sampleFill = (x0: number, y0: number, x1: number, y1: number, n: number, rng: Rng, z = 0): V3[] =>
  Array.from({ length: n }, () => [x0 + rng() * (x1 - x0), y0 + rng() * (y1 - y0), z + gauss(rng) * 0.01] as V3);

const rotateY = (pts: V3[], a: number): V3[] => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return pts.map(([x, y, z]) => [c * x + s * z, y, -s * x + c * z]);
};

const rotateX = (pts: V3[], a: number): V3[] => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return pts.map(([x, y, z]) => [x, c * y - s * z, s * y + c * z]);
};

/** Shuffle-and-slice or pad with jittered copies so a list has exactly n points. */
const fitToCount = (pts: V3[], n: number, rng: Rng): V3[] => {
  const a = pts.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.length >= n) return a.slice(0, n);
  const out = a.slice();
  while (out.length < n) {
    const p = a[Math.floor(rng() * a.length)] ?? [0, 0, 0];
    out.push([p[0] + gauss(rng) * 0.01, p[1] + gauss(rng) * 0.01, p[2] + gauss(rng) * 0.01]);
  }
  return out;
};

// ------------------------------------------------------------------ shapes

type Sampler = (n: number, accent: number, rng: Rng) => { accent: V3[]; rest: V3[] };

/** The Kona mark: K stem, rising-arrow arm, arrowhead, leg, three dots (the last ochre). */
const sampleLogo: Sampler = (n, accent, rng) => {
  const s = 1 / 18;
  const tx = (x: number) => (x - 25.5) * s; // optical centre of the glyph, not the tile
  const ty = (y: number) => -(y - 24) * s;
  const z = () => (rng() - 0.5) * 0.16;
  const widths: Record<string, number> = { stem: 5.5, arrow: 4.8, head: 4.8, leg: 4.8 };
  const caps: Capsule[] = [];
  for (const [key, d] of Object.entries(MARK_PATHS)) {
    const pts = parseLinePath(d);
    for (let i = 0; i < pts.length - 1; i++) {
      caps.push({ ax: tx(pts[i][0]), ay: ty(pts[i][1]), bx: tx(pts[i + 1][0]), by: ty(pts[i + 1][1]), r: (widths[key] / 2) * s });
    }
  }
  const [d1, d2, d3] = MARK_DOTS;
  const smallDots = Math.round(n * 0.035);
  const strokes = sampleCapsules(caps, n - accent - smallDots, rng, z);
  const dots = [
    ...sampleDisc(tx(d1.cx), ty(d1.cy), d1.r * s, Math.round(smallDots * 0.42), rng, z),
    ...sampleDisc(tx(d2.cx), ty(d2.cy), d2.r * s, smallDots - Math.round(smallDots * 0.42), rng, z),
  ];
  return { accent: sampleDisc(tx(d3.cx), ty(d3.cy), d3.r * s, accent, rng, z), rest: [...strokes, ...dots] };
};

/** AI and automation: a small network, one path firing. */
const sampleNeural: Sampler = (n, accent, rng) => {
  const layers = [
    [-0.75, 0, 0.75],
    [-1.05, -0.35, 0.35, 1.05],
    [-0.45, 0.45],
  ];
  const xs = [-1.05, 0, 1.05];
  const nodes: V3[][] = layers.map((ys, li) => ys.map((y) => [xs[li], y, (rng() - 0.5) * 0.6] as V3));
  const edges: [V3, V3][] = [];
  for (let li = 0; li < nodes.length - 1; li++) for (const a of nodes[li]) for (const b of nodes[li + 1]) edges.push([a, b]);

  const all = nodes.flat();
  const clusterN = Math.round((n - accent) * 0.42);
  const rest: V3[] = Array.from({ length: clusterN }, (_, i) => {
    const c = all[i % all.length];
    return [c[0] + gauss(rng) * 0.055, c[1] + gauss(rng) * 0.055, c[2] + gauss(rng) * 0.055] as V3;
  });
  const perEdge = Math.floor((n - accent - clusterN) / edges.length);
  for (const [a, b] of edges) rest.push(...samplePolyline([a, b], perEdge, rng, 0.012));

  // Firing path: input → hidden → output, travelling up toward the arrow direction
  const path: V3[] = [nodes[0][0], nodes[1][2], nodes[2][1]];
  const acc = [
    ...samplePolyline(path, Math.round(accent * 0.6), rng, 0.01),
    ...path.flatMap((c) => Array.from({ length: Math.round((accent * 0.4) / 3) }, () => [c[0] + gauss(rng) * 0.04, c[1] + gauss(rng) * 0.04, c[2] + gauss(rng) * 0.04] as V3)),
  ];
  return { accent: acc, rest };
};

/** Internal tools: a dashboard of tiles, a chart line rising inside it. */
const sampleDashboard: Sampler = (n, accent, rng) => {
  const tiles: [number, number, number, number][] = [
    [-1.25, 0.6, 1.25, 0.82], // header
    [-1.25, -0.82, -0.8, 0.5], // sidebar
    [-0.7, 0.12, -0.02, 0.5], // KPI
    [0.08, 0.12, 0.6, 0.5], // KPI
    [0.7, 0.12, 1.25, 0.5], // KPI
    [-0.7, -0.82, 1.25, 0.02], // chart
  ];
  const outlineN = Math.round((n - accent) * 0.8);
  const fillN = n - accent - outlineN;
  const perim = tiles.map(([x0, y0, x1, y1]) => 2 * (x1 - x0 + (y1 - y0)));
  const pTotal = perim.reduce((s, p) => s + p, 0);
  const area = tiles.map(([x0, y0, x1, y1]) => (x1 - x0) * (y1 - y0));
  const aTotal = area.reduce((s, a) => s + a, 0);
  const rest: V3[] = [];
  tiles.forEach(([x0, y0, x1, y1], i) => {
    rest.push(...samplePolyline(roundRect(x0, y0, x1, y1, 0.06), Math.round((outlineN * perim[i]) / pTotal), rng, 0.006, true));
    rest.push(...sampleFill(x0 + 0.04, y0 + 0.04, x1 - 0.04, y1 - 0.04, Math.round((fillN * area[i]) / aTotal), rng));
  });
  const line: V3[] = [
    [-0.58, -0.7, 0.02],
    [-0.2, -0.45, 0.02],
    [0.15, -0.55, 0.02],
    [0.55, -0.2, 0.02],
    [0.85, -0.3, 0.02],
    [1.12, -0.08, 0.02],
  ];
  return { accent: samplePolyline(line, accent, rng, 0.012), rest: rotateY(rest, -0.32).map((p) => p) };
};

/** Product engineering: three stacked layers seen in isometric. */
const sampleLayers: Sampler = (n, accent, rng) => {
  const ys = [-0.62, 0, 0.62];
  const per = Math.floor((n - accent) / ys.length);
  let rest: V3[] = [];
  ys.forEach((y, i) => {
    const outline = Math.round(per * 0.72);
    const plane = [
      ...samplePolyline(roundRect(-0.95, -0.95, 0.95, 0.95, 0.18), outline, rng, 0.006, true),
      ...sampleFill(-0.85, -0.85, 0.85, 0.85, per - outline, rng),
    ];
    // Lay the plane flat (XZ) and lift it to its level
    rest.push(...plane.map(([x, yy]) => [x, y + (i === 2 ? 0.08 : 0), yy] as V3));
  });
  rest = rotateX(rotateY(rest, Math.PI / 4), 0.5);
  // Accent: a small spark hovering over the top layer
  const top = rotateX(rotateY([[0, 0.92, 0]], Math.PI / 4), 0.5)[0];
  const acc = Array.from({ length: accent }, () => [top[0] + gauss(rng) * 0.07, top[1] + gauss(rng) * 0.07, top[2] + gauss(rng) * 0.07] as V3);
  return { accent: acc, rest };
};

/** Chatbots and messaging: a speech bubble with three typing dots. */
const sampleBubble: Sampler = (n, accent, rng) => {
  const outline: V3[] = [
    ...roundRect(-1.15, -0.5, 1.15, 0.8, 0.32).filter(([x, y]) => !(y < -0.45 && x > -0.75 && x < -0.25)),
  ];
  const outlineN = Math.round((n - accent) * 0.78);
  const tail: V3[] = [
    [-0.25, -0.5, 0],
    [-0.8, -1.0, 0],
    [-0.72, -0.5, 0],
  ];
  const tailN = Math.round(outlineN * 0.14);
  const rest: V3[] = [
    ...samplePolyline(outline, outlineN - tailN, rng, 0.007, true),
    ...samplePolyline(tail, tailN, rng, 0.007),
    ...sampleFill(-1.05, -0.4, 1.05, 0.7, n - accent - outlineN, rng),
  ];
  const z = () => (rng() - 0.5) * 0.06;
  const per = Math.floor(accent / 3);
  const acc = [
    ...sampleDisc(-0.45, 0.15, 0.12, per, rng, z),
    ...sampleDisc(0, 0.15, 0.12, per, rng, z),
    ...sampleDisc(0.45, 0.15, 0.12, accent - 2 * per, rng, z),
  ];
  return { accent: rotateY(acc, 0.28), rest: rotateY(rest, 0.28) };
};

const COUNTRIES = [
  [9.082, 8.6753], // Nigeria
  [55.3781, -3.436], // United Kingdom
  [37.0902, -95.7129], // United States
  [23.4241, 53.8478], // UAE
  [20.5937, 78.9629], // India
  [-31.9535, 115.857], // Australia
];

const latLon = (lat: number, lon: number, r: number): V3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [-(r * Math.sin(phi) * Math.cos(theta)), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)];
};

/** Six countries: a dotted globe with the places we work glowing ochre. */
const sampleGlobe: Sampler = (n, accent, rng) => {
  const m = n - accent;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const R = 1.08;
  let rest: V3[] = Array.from({ length: m }, (_, i) => {
    const y = 1 - (i / (m - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    return [Math.cos(t) * r * R, y * R, Math.sin(t) * r * R] as V3;
  });
  const per = Math.floor(accent / COUNTRIES.length);
  let acc: V3[] = COUNTRIES.flatMap(([lat, lon], i) =>
    Array.from({ length: i === COUNTRIES.length - 1 ? accent - per * (COUNTRIES.length - 1) : per }, () =>
      latLon(lat + gauss(rng) * 2.2, lon + gauss(rng) * 2.2, R * 1.01)
    )
  );
  // Turn Lagos toward the viewer
  const spin = -1.75;
  rest = rotateX(rotateY(rest, spin), 0.32);
  acc = rotateX(rotateY(acc, spin), 0.32);
  return { accent: acc, rest };
};

const SAMPLERS: Record<ShapeId, Sampler> = {
  logo: sampleLogo,
  ai: sampleNeural,
  tools: sampleDashboard,
  product: sampleLayers,
  chat: sampleBubble,
  globe: sampleGlobe,
};

const orderForMorph = (pts: V3[]) => pts.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));

/** Builds every shape with exactly `count` points, the first `accent` of them ochre. */
export const buildShapes = (count: number, accent: number, seed = 7): Record<ShapeId, Float32Array> => {
  const out = {} as Record<ShapeId, Float32Array>;
  for (const id of SHAPE_IDS) {
    const rng = mulberry32(seed + id.length * 101 + id.charCodeAt(0));
    const { accent: acc, rest } = SAMPLERS[id](count, accent, rng);
    const pts = [...orderForMorph(fitToCount(acc, accent, rng)), ...orderForMorph(fitToCount(rest, count - accent, rng))];
    const arr = new Float32Array(count * 3);
    pts.forEach((p, i) => arr.set(p, i * 3));
    out[id] = arr;
  }
  return out;
};
