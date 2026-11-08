// Placeholder furniture art: flat shapes with ink outlines, bottom-centre anchored.
import type * as Phaser from "phaser";
import { furnitureKey } from "@/game/assets/keys";
import type { FurnitureKind } from "@/game/furniture/layout";
import { C } from "./palette";

type G = Phaser.GameObjects.Graphics;

function box(g: G, x: number, y: number, w: number, h: number, fill: number, r = 0) {
  g.fillStyle(fill, 1);
  g.lineStyle(3, C.ink, 1);
  if (r > 0) {
    g.fillRoundedRect(x, y, w, h, r);
    g.strokeRoundedRect(x, y, w, h, r);
  } else {
    g.fillRect(x, y, w, h);
    g.strokeRect(x, y, w, h);
  }
}

function leg(g: G, x: number, y: number, h: number, w = 6) {
  box(g, x, y, w, h, C.woodDark);
}

const DRAW: Record<FurnitureKind, { w: number; h: number; draw: (g: G, w: number, h: number) => void }> = {
  bookshelf: {
    w: 112,
    h: 180,
    draw(g, w, h) {
      box(g, 2, 2, w - 4, h - 4, C.woodDark);
      const spines = [C.terracotta, C.olive, C.mist, C.beige, C.forest, C.paper];
      for (let row = 0; row < 4; row++) {
        const y = 12 + row * 41;
        box(g, 10, y, w - 20, 34, C.bark);
        let x = 14;
        let i = row * 2;
        while (x < w - 22) {
          const bw = 7 + ((i * 5) % 6);
          const bh = 22 + ((i * 7) % 10);
          box(g, x, y + 34 - bh, bw, bh, spines[i % spines.length]);
          x += bw + 1;
          i++;
        }
      }
    },
  },
  desk: {
    w: 156,
    h: 66,
    draw(g, w) {
      leg(g, 10, 22, 42);
      leg(g, w - 16, 22, 42);
      box(g, 2, 4, w - 4, 22, C.woodLight); // top surface
      box(g, 2, 24, w - 4, 10, C.wood); // front edge
      box(g, w - 54, 34, 40, 20, C.wood); // drawer
      g.fillStyle(C.ink, 1);
      g.fillRect(w - 38, 43, 8, 3);
      // a small lamp and papers on the desk, so desks read as desks
      box(g, 16, 10, 26, 10, C.paper);
      box(g, w - 34, -2, 8, 14, C.olive);
    },
  },
  "desk-chair": {
    w: 54,
    h: 70,
    draw(g, w) {
      box(g, 8, 2, w - 16, 40, C.olive, 6); // backrest
      leg(g, 10, 50, 18, 5);
      leg(g, w - 15, 50, 18, 5);
      box(g, 4, 40, w - 8, 12, C.forest, 3); // seat
    },
  },
  armchair: {
    w: 88,
    h: 80,
    draw(g, w) {
      box(g, 12, 2, w - 24, 50, C.terracotta, 10);
      box(g, 2, 30, 18, 40, C.terracotta, 6);
      box(g, w - 20, 30, 18, 40, C.terracotta, 6);
      box(g, 18, 46, w - 36, 22, 0xc98463, 4);
      leg(g, 8, 68, 10, 6);
      leg(g, w - 14, 68, 10, 6);
    },
  },
  "side-table": {
    w: 60,
    h: 50,
    draw(g, w) {
      leg(g, w / 2 - 4, 14, 34, 8);
      box(g, 4, 6, w - 8, 12, C.wood, 6);
      box(g, w / 2 - 8, -2, 16, 10, C.paper); // book stack
    },
  },
  "coffee-counter": {
    w: 236,
    h: 130,
    draw(g, w, h) {
      box(g, 4, 50, w - 8, h - 54, C.forest);
      box(g, 0, 40, w, 14, C.woodLight);
      for (let x = 20; x < w - 20; x += 40) box(g, x, 66, 28, 48, 0x4c614e, 2);
      // espresso machine and cups
      box(g, 30, 4, 56, 38, C.mist, 4);
      box(g, 42, 14, 32, 10, C.ink);
      for (const x of [120, 142, 164]) box(g, x, 26, 14, 16, C.paper, 2);
      box(g, 190, 10, 28, 32, C.beige, 3); // jar
    },
  },
  "cafe-table": {
    w: 70,
    h: 58,
    draw(g, w) {
      leg(g, w / 2 - 3, 18, 34, 6);
      box(g, w / 2 - 16, 50, 32, 6, C.ink);
      box(g, 2, 8, w - 4, 14, C.paper, 7);
      box(g, w / 2 - 6, -2, 12, 12, C.terracotta, 2);
    },
  },
  "cafe-chair": {
    w: 46,
    h: 60,
    draw(g, w) {
      box(g, 8, 2, w - 16, 28, C.mist, 5);
      leg(g, 9, 40, 18, 4);
      leg(g, w - 13, 40, 18, 4);
      box(g, 4, 30, w - 8, 10, 0x5f727c, 3);
    },
  },
  sofa: {
    w: 220,
    h: 90,
    draw(g, w) {
      box(g, 14, 4, w - 28, 50, C.olive, 12);
      box(g, 2, 32, 26, 46, C.olive, 8);
      box(g, w - 28, 32, 26, 46, C.olive, 8);
      box(g, 26, 50, (w - 52) / 2, 26, 0x7d8d67, 4);
      box(g, w / 2, 50, (w - 52) / 2, 26, 0x7d8d67, 4);
      box(g, 40, 18, 30, 24, C.beige, 8); // cushion
      leg(g, 12, 78, 10, 6);
      leg(g, w - 18, 78, 10, 6);
    },
  },
  "coffee-table": {
    w: 128,
    h: 44,
    draw(g, w) {
      leg(g, 10, 16, 26);
      leg(g, w - 16, 16, 26);
      box(g, 2, 6, w - 4, 14, C.wood, 3);
      box(g, 20, -2, 30, 10, C.terracotta, 2);
      box(g, 78, 0, 14, 8, C.paper, 2);
    },
  },
  "lounge-chair": {
    w: 92,
    h: 72,
    draw(g, w) {
      box(g, 10, 4, w - 20, 40, C.beige, 14);
      box(g, 6, 36, w - 12, 20, 0xc4b08b, 8);
      leg(g, 14, 54, 16, 5);
      leg(g, w - 19, 54, 16, 5);
    },
  },
  bench: {
    w: 170,
    h: 44,
    draw(g, w) {
      leg(g, 10, 18, 24, 8);
      leg(g, w - 18, 18, 24, 8);
      box(g, 2, 6, w - 4, 16, C.wood, 3);
      box(g, 8, 0, w - 16, 10, C.terracotta, 4); // cushion
    },
  },
  rug: {
    w: 420,
    h: 150,
    draw(g, w, h) {
      g.fillStyle(C.beige, 1);
      g.fillEllipse(w / 2, h / 2, w - 4, h - 4);
      g.lineStyle(3, C.bark, 0.5);
      g.strokeEllipse(w / 2, h / 2, w - 4, h - 4);
      g.lineStyle(4, C.terracotta, 0.6);
      g.strokeEllipse(w / 2, h / 2, w - 50, h - 34);
    },
  },
  "floor-lamp": {
    w: 34,
    h: 140,
    draw(g, w, h) {
      box(g, w / 2 - 2, 30, 4, h - 40, C.ink);
      box(g, w / 2 - 12, h - 12, 24, 10, C.ink, 4);
      g.fillStyle(C.paper, 1);
      g.lineStyle(3, C.ink, 1);
      g.fillTriangle(4, 34, w - 4, 34, w / 2, 4);
      g.strokeTriangle(4, 34, w - 4, 34, w / 2, 4);
    },
  },
};

export function generateFurniturePlaceholders(scene: Phaser.Scene) {
  for (const [kind, spec] of Object.entries(DRAW) as [FurnitureKind, (typeof DRAW)[FurnitureKind]][]) {
    const key = furnitureKey(kind);
    if (scene.textures.exists(key)) continue;
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    // Drawn 4px down so props that poke above the top edge aren't clipped.
    g.translateCanvas(0, 4);
    spec.draw(g, spec.w, spec.h - 4);
    g.generateTexture(key, spec.w, spec.h);
    g.destroy();
  }
}
