// Pure movement math — no Phaser dependency, so it can be reused for
// remote-player prediction and unit tests.

export interface Vec2 {
  x: number;
  y: number;
}

export interface Rect {
  x: number; // left
  y: number; // top
  w: number;
  h: number;
}

export type Direction = "up" | "down" | "left" | "right";

/** Avatar collision footprint around its feet. */
export const FOOT_SIZE = { w: 26, h: 12 };

export function footRect(p: Vec2): Rect {
  return { x: p.x - FOOT_SIZE.w / 2, y: p.y - FOOT_SIZE.h, w: FOOT_SIZE.w, h: FOOT_SIZE.h };
}

function overlaps(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function collides(p: Vec2, blockers: readonly Rect[]) {
  const f = footRect(p);
  return blockers.some((b) => overlaps(f, b));
}

export interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Move `from` toward `target` by at most `maxStep`, staying inside `bounds`
 * and sliding along blockers (x and y resolved separately).
 */
export function stepTowards(from: Vec2, target: Vec2, maxStep: number, bounds: Bounds, blockers: readonly Rect[]): Vec2 {
  const dx = target.x - from.x;
  const dy = target.y - from.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.5) return from;

  const k = Math.min(1, maxStep / dist);
  let x = clamp(from.x + dx * k, bounds.minX, bounds.maxX);
  let y = clamp(from.y + dy * k, bounds.minY, bounds.maxY);

  if (collides({ x, y: from.y }, blockers)) x = from.x;
  if (collides({ x, y }, blockers)) y = from.y;
  return { x, y };
}

/** Facing direction for a movement delta; horizontal wins ties. */
export function directionOf(dx: number, dy: number, fallback: Direction): Direction {
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return fallback;
  if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? "right" : "left";
  return dy > 0 ? "down" : "up";
}
