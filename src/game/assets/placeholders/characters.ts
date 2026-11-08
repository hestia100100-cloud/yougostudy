// Procedurally drawn placeholder cat frames. Temporary art: replace by loading
// real frames under the same keys (see assets/manifest.ts).
import type * as Phaser from "phaser";
import type { AnimalType } from "@/types";
import {
  CHARACTER_FRAME,
  SEATED_STATES,
  STANDING_ACTIVITY_STATES,
  animIdle,
  animSeated,
  animStanding,
  animWalk,
  frameKey,
} from "@/game/assets/keys";
import type { Direction } from "@/game/movement/movement";
import { C } from "./palette";

type G = Phaser.GameObjects.Graphics;
type Prop = "none" | "book" | "pencil" | "mug" | "zzz";

interface Pose {
  dir: Direction;
  seated: boolean;
  /** Walk cycle step 0–3, or -1 when not walking. */
  step: number;
  eyes: "open" | "closed" | "down";
  prop: Prop;
  bob: number;
}

const FUR = C.terracotta;
const FUR_DARK = 0x8f5034;
const BELLY = C.paper;
const OUT = C.ink;
const W = CHARACTER_FRAME.w;
const H = CHARACTER_FRAME.h;
const CX = W / 2;

function line(g: G, width = 2.5) {
  g.lineStyle(width, OUT, 1);
}

function ellipse(g: G, x: number, y: number, w: number, h: number, fill: number) {
  g.fillStyle(fill, 1);
  g.fillEllipse(x, y, w, h);
  line(g);
  g.strokeEllipse(x, y, w, h);
}

function tri(g: G, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, fill: number) {
  g.fillStyle(fill, 1);
  g.fillTriangle(x1, y1, x2, y2, x3, y3);
  line(g);
  g.strokeTriangle(x1, y1, x2, y2, x3, y3);
}

function tail(g: G, points: [number, number][]) {
  g.lineStyle(9, OUT, 1);
  g.strokePoints(points.map(([x, y]) => ({ x, y })), false);
  g.lineStyle(5, FUR, 1);
  g.strokePoints(points.map(([x, y]) => ({ x, y })), false);
}

function eyes(g: G, pts: [number, number][], mode: Pose["eyes"]) {
  for (const [x, y] of pts) {
    if (mode === "open") {
      g.fillStyle(OUT, 1);
      g.fillEllipse(x, y, 4, 5.5);
    } else {
      line(g, 2);
      g.beginPath();
      if (mode === "closed") {
        g.arc(x, y - 1, 2.6, 0.15 * Math.PI, 0.85 * Math.PI, false);
      } else {
        g.moveTo(x - 2.5, y + 1);
        g.lineTo(x + 2.5, y + 1);
      }
      g.strokePath();
    }
  }
}

function headFront(g: G, hx: number, hy: number, pose: Pose) {
  tri(g, hx - 15, hy - 4, hx - 11, hy - 20, hx - 2, hy - 10, FUR);
  tri(g, hx + 15, hy - 4, hx + 11, hy - 20, hx + 2, hy - 10, FUR);
  ellipse(g, hx, hy, 34, 28, FUR);
  // forehead stripes give the cat its own markings
  g.fillStyle(FUR_DARK, 1);
  g.fillRect(hx - 4, hy - 13, 2.5, 6);
  g.fillRect(hx + 1.5, hy - 13, 2.5, 6);
  // muzzle
  g.fillStyle(BELLY, 1);
  g.fillEllipse(hx, hy + 6, 14, 9);
  eyes(g, [[hx - 7, hy + 1], [hx + 7, hy + 1]], pose.eyes);
  g.fillStyle(OUT, 1);
  g.fillTriangle(hx - 2, hy + 4, hx + 2, hy + 4, hx, hy + 6.5);
}

function headBack(g: G, hx: number, hy: number) {
  tri(g, hx - 15, hy - 4, hx - 11, hy - 20, hx - 2, hy - 10, FUR);
  tri(g, hx + 15, hy - 4, hx + 11, hy - 20, hx + 2, hy - 10, FUR);
  ellipse(g, hx, hy, 34, 28, FUR);
  g.fillStyle(FUR_DARK, 1);
  for (const dx of [-7, 0, 7]) g.fillRect(hx + dx - 1.5, hy - 12, 3, 10);
}

function headSide(g: G, hx: number, hy: number, s: number, pose: Pose) {
  // s = +1 facing right, -1 facing left
  tri(g, hx - 10 * s, hy - 6, hx - 6 * s, hy - 21, hx + 3 * s, hy - 11, FUR);
  ellipse(g, hx, hy, 32, 27, FUR);
  g.fillStyle(BELLY, 1);
  g.fillEllipse(hx + 11 * s, hy + 5, 11, 9);
  g.fillStyle(FUR_DARK, 1);
  g.fillRect(hx - 6 * s - 1.5, hy - 12, 3, 7);
  eyes(g, [[hx + 7 * s, hy]], pose.eyes);
  g.fillStyle(OUT, 1);
  g.fillCircle(hx + 16 * s, hy + 3, 1.8);
}

function prop(g: G, p: Prop, x: number, y: number) {
  switch (p) {
    case "book":
      g.fillStyle(C.forest, 1);
      g.fillRect(x - 13, y - 9, 26, 17);
      line(g);
      g.strokeRect(x - 13, y - 9, 26, 17);
      g.fillStyle(C.paper, 1);
      g.fillRect(x - 11, y - 7, 10, 13);
      g.fillRect(x + 1, y - 7, 10, 13);
      g.lineStyle(1.5, OUT, 1);
      g.lineBetween(x, y - 9, x, y + 8);
      break;
    case "pencil":
      g.lineStyle(4, OUT, 1);
      g.lineBetween(x + 4, y - 10, x + 12, y + 2);
      g.lineStyle(2.4, C.olive, 1);
      g.lineBetween(x + 4, y - 10, x + 12, y + 2);
      break;
    case "mug":
      g.fillStyle(C.mist, 1);
      g.fillRect(x - 6, y - 8, 12, 13);
      line(g, 2);
      g.strokeRect(x - 6, y - 8, 12, 13);
      g.strokeCircle(x + 8, y - 2, 3.5);
      g.lineStyle(1.5, C.paper, 0.9);
      g.lineBetween(x - 2, y - 12, x - 1, y - 16);
      g.lineBetween(x + 2, y - 12, x + 3, y - 17);
      break;
    default:
      break;
  }
}

function zzz(g: G, frame: number) {
  const x = CX + 16;
  const y = 18 - frame * 4;
  line(g, 2);
  for (const [dx, dy, s] of [[0, 0, 5], [7, -8, 4]] as const) {
    g.beginPath();
    g.moveTo(x + dx, y + dy);
    g.lineTo(x + dx + s, y + dy);
    g.lineTo(x + dx, y + dy + s);
    g.lineTo(x + dx + s, y + dy + s);
    g.strokePath();
  }
}

function drawStanding(g: G, pose: Pose) {
  const foot = H - 2;
  const lift = (i: number) => (pose.step < 0 ? 0 : pose.step === i ? 4 : 0);
  const by = pose.bob;
  const { dir } = pose;

  if (dir === "down" || dir === "up") {
    if (dir === "down") tail(g, [[CX + 10, foot - 14], [CX + 22, foot - 18], [CX + 24, foot - 32]]);
    // legs
    ellipse(g, CX - 7, foot - 4 - lift(0), 10, 9, FUR);
    ellipse(g, CX + 7, foot - 4 - lift(2), 10, 9, FUR);
    ellipse(g, CX, foot - 18 + by, 30, 28, FUR);
    if (dir === "down") {
      g.fillStyle(BELLY, 1);
      g.fillEllipse(CX, foot - 16 + by, 16, 18);
      headFront(g, CX, foot - 40 + by, pose);
      prop(g, pose.prop, CX, foot - 18 + by);
    } else {
      headBack(g, CX, foot - 40 + by);
      tail(g, [[CX, foot - 12], [CX + 2, foot - 26], [CX + 10, foot - 34]]);
    }
  } else {
    const s = dir === "right" ? 1 : -1;
    tail(g, [[CX - 13 * s, foot - 16 + by], [CX - 24 * s, foot - 20], [CX - 26 * s, foot - 34]]);
    // far legs then near legs, alternating
    ellipse(g, CX - 8 * s, foot - 4 - lift(1), 9, 9, FUR_DARK);
    ellipse(g, CX + 9 * s, foot - 4 - lift(3), 9, 9, FUR_DARK);
    ellipse(g, CX, foot - 16 + by, 36, 24, FUR);
    ellipse(g, CX - 6 * s, foot - 4 - lift(3), 10, 9, FUR);
    ellipse(g, CX + 11 * s, foot - 4 - lift(1), 10, 9, FUR);
    headSide(g, CX + 7 * s, foot - 36 + by, s, pose);
  }
}

function drawSeated(g: G, pose: Pose) {
  const base = H - 4;
  const by = pose.bob;
  tail(g, [[CX + 12, base - 6], [CX + 24, base - 8], [CX + 25, base - 20]]);
  ellipse(g, CX, base - 14 + by, 34, 26, FUR);
  g.fillStyle(BELLY, 1);
  g.fillEllipse(CX, base - 13 + by, 18, 16);
  // paws resting forward
  ellipse(g, CX - 8, base - 2, 11, 8, FUR);
  ellipse(g, CX + 8, base - 2, 11, 8, FUR);
  headFront(g, CX, base - 36 + by, pose);
  prop(g, pose.prop, CX, base - 12 + by);
}

function drawFrame(scene: Phaser.Scene, key: string, pose: Pose, extra?: (g: G) => void) {
  if (scene.textures.exists(key)) return; // real art already loaded
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  if (pose.seated) drawSeated(g, pose);
  else drawStanding(g, pose);
  extra?.(g);
  g.generateTexture(key, W, H);
  g.destroy();
}

const STATE_PROP: Record<string, Prop> = {
  sitting: "none",
  working: "pencil",
  reading: "book",
  break: "mug",
  sleeping: "none",
};

export function generateCharacterPlaceholders(scene: Phaser.Scene, animal: AnimalType) {
  const base: Pose = { dir: "down", seated: false, step: -1, eyes: "open", prop: "none", bob: 0 };

  drawFrame(scene, frameKey(animIdle(animal), 0), base);
  drawFrame(scene, frameKey(animIdle(animal), 1), { ...base, eyes: "closed" });

  for (const dir of ["up", "down", "left", "right"] as Direction[]) {
    for (let i = 0; i < 4; i++) {
      drawFrame(scene, frameKey(animWalk(animal, dir), i), { ...base, dir, step: i, bob: i % 2 === 0 ? -1.5 : 0 });
    }
  }

  for (const state of SEATED_STATES) {
    for (let i = 0; i < 2; i++) {
      const sleeping = state === "sleeping";
      drawFrame(
        scene,
        frameKey(animSeated(animal, state), i),
        {
          ...base,
          seated: true,
          prop: STATE_PROP[state],
          eyes: sleeping ? "closed" : state === "working" || state === "reading" ? "down" : "open",
          bob: i === 0 ? 0 : sleeping ? 1.5 : 0.8,
        },
        sleeping ? (g) => zzz(g, i) : undefined,
      );
    }
  }

  for (const state of STANDING_ACTIVITY_STATES) {
    for (let i = 0; i < 2; i++) {
      drawFrame(scene, frameKey(animStanding(animal, state), i), {
        ...base,
        prop: STATE_PROP[state],
        eyes: state === "reading" ? "down" : "open",
        bob: i === 0 ? 0 : 0.8,
      });
    }
  }
}
