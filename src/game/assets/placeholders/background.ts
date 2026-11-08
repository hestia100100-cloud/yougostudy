// Placeholder room background: wall + floor only. No characters, labels or UI
// are baked in (spec §6.3); furniture is placed separately from layout data.
import type * as Phaser from "phaser";
import { BACKGROUND_KEY } from "@/game/assets/keys";
import { WALL_BOTTOM, WORLD_HEIGHT, WORLD_WIDTH, ZONES, type Zone } from "@/game/config/world";
import { C } from "./palette";

const WALL: Record<Zone["id"], number> = {
  reading: 0xd8c6a5,
  working: 0xcfc3a8,
  coffee: 0xc9a98a,
  lounge: 0xbfc4b0,
  quiet: 0xb5bfc2,
};

function windowFrame(g: Phaser.GameObjects.Graphics, x: number, w: number) {
  const y = 70;
  const h = 150;
  g.fillStyle(0xa9bcc4, 1);
  g.fillRect(x, y, w, h);
  g.fillStyle(0xc3d1d6, 1);
  g.fillRect(x, y + h * 0.55, w, h * 0.45);
  // distant hills, so windows aren't flat boxes
  g.fillStyle(C.olive, 1);
  g.fillEllipse(x + w * 0.3, y + h, w * 0.9, 60);
  g.fillStyle(C.forest, 1);
  g.fillEllipse(x + w * 0.8, y + h, w * 0.7, 46);
  g.lineStyle(6, C.ink, 1);
  g.strokeRect(x, y, w, h);
  g.lineStyle(4, C.ink, 1);
  g.lineBetween(x + w / 2, y, x + w / 2, y + h);
  g.lineBetween(x, y + h / 2, x + w, y + h / 2);
  g.fillStyle(C.woodDark, 1);
  g.fillRect(x - 10, y + h, w + 20, 10);
  g.lineStyle(3, C.ink, 1);
  g.strokeRect(x - 10, y + h, w + 20, 10);
}

function frame(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, fill: number) {
  g.fillStyle(fill, 1);
  g.fillRect(x, y, w, h);
  g.lineStyle(4, C.ink, 1);
  g.strokeRect(x, y, w, h);
}

export function generateBackgroundPlaceholder(scene: Phaser.Scene) {
  if (scene.textures.exists(BACKGROUND_KEY)) return;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);

  // Wall, tinted per zone
  for (const z of ZONES) {
    g.fillStyle(WALL[z.id], 1);
    g.fillRect(z.fromX, 0, z.toX - z.fromX, WALL_BOTTOM);
  }
  // Zone dividers: simple vertical trim
  g.fillStyle(C.woodDark, 1);
  for (const z of ZONES.slice(1)) g.fillRect(z.fromX - 4, 0, 8, WALL_BOTTOM);

  // Coffee corner tiled backsplash
  const coffee = ZONES.find((z) => z.id === "coffee")!;
  g.lineStyle(1.5, C.bark, 0.25);
  for (let y = 150; y < WALL_BOTTOM; y += 20) g.lineBetween(coffee.fromX + 4, y, coffee.toX - 4, y);
  for (let x = coffee.fromX + 24; x < coffee.toX; x += 30) g.lineBetween(x, 150, x, WALL_BOTTOM);

  // Windows & wall pieces
  windowFrame(g, 520, 140);
  windowFrame(g, 900, 160);
  windowFrame(g, 1220, 160);
  windowFrame(g, 2420, 180);
  windowFrame(g, 2880, 140);
  frame(g, 2140, 110, 70, 90, C.terracotta);
  frame(g, 2230, 130, 50, 60, C.mist);
  // Coffee chalkboard
  frame(g, 1880, 60, 120, 80, C.forest);
  g.lineStyle(2, C.paper, 0.7);
  for (const y of [82, 98, 114]) g.lineBetween(1895, y, 1960 + (y % 3) * 8, y);

  // Baseboard
  g.fillStyle(C.bark, 1);
  g.fillRect(0, WALL_BOTTOM - 14, WORLD_WIDTH, 14);

  // Floor planks
  g.fillStyle(0xb08b67, 1);
  g.fillRect(0, WALL_BOTTOM, WORLD_WIDTH, WORLD_HEIGHT - WALL_BOTTOM);
  g.lineStyle(2, 0x8f6c4c, 0.7);
  let row = 0;
  for (let y = WALL_BOTTOM + 34; y < WORLD_HEIGHT; y += 36, row++) {
    g.lineBetween(0, y, WORLD_WIDTH, y);
  }
  row = 0;
  for (let y = WALL_BOTTOM; y < WORLD_HEIGHT; y += 36, row++) {
    for (let x = (row % 2) * 90; x < WORLD_WIDTH; x += 180) g.lineBetween(x, y, x, y + 34);
  }
  // Coffee corner tile floor
  g.fillStyle(0xcdb894, 1);
  g.fillRect(coffee.fromX, WALL_BOTTOM, coffee.toX - coffee.fromX, WORLD_HEIGHT - WALL_BOTTOM);
  g.fillStyle(0xb9a27c, 1);
  for (let y = WALL_BOTTOM; y < WORLD_HEIGHT; y += 40) {
    for (let x = coffee.fromX + (((y - WALL_BOTTOM) / 40) % 2) * 40; x < coffee.toX; x += 80) g.fillRect(x, y, 40, 40);
  }
  // Floor/wall shadow line
  g.fillStyle(C.ink, 0.18);
  g.fillRect(0, WALL_BOTTOM, WORLD_WIDTH, 8);

  g.generateTexture(BACKGROUND_KEY, WORLD_WIDTH, WORLD_HEIGHT);
  g.destroy();
}
