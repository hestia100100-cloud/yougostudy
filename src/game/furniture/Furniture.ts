import * as Phaser from "phaser";
import { furnitureKey } from "@/game/assets/keys";
import type { Rect } from "@/game/movement/movement";
import { FURNITURE_LABELS, type FurnitureDef } from "./layout";

export class FurnitureObject extends Phaser.GameObjects.Image {
  constructor(
    scene: Phaser.Scene,
    readonly def: FurnitureDef,
  ) {
    super(scene, def.x, def.y, furnitureKey(def.kind));
    this.setOrigin(0.5, 1);
    this.setDepth(def.flat ? -5 : def.y);
    scene.add.existing(this);

    if (this.interactive) {
      this.setInteractive({ useHandCursor: true, pixelPerfect: true });
      this.on("pointerover", () => this.setTint(0xfff1dc));
      this.on("pointerout", () => this.clearTint());
    }
  }

  get interactive() {
    return Boolean(this.def.seatIds?.length || this.def.action);
  }

  get label() {
    return FURNITURE_LABELS[this.def.kind];
  }

  /** Hover hint, e.g. "Sit · Study chair". */
  get hint() {
    if (this.def.seatIds?.length) return `Sit · ${this.label}`;
    if (this.def.action) return `${this.def.action.label}`;
    return this.label;
  }
}

export function blockerRect(def: FurnitureDef): Rect | null {
  if (!def.blocker) return null;
  const { w, h } = def.blocker;
  return { x: def.x - w / 2, y: def.y - h, w, h };
}
