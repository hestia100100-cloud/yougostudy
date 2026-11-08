import type * as Phaser from "phaser";
import type { Avatar } from "@/game/characters/Avatar";
import { WALKABLE, WALK_SPEED } from "@/game/config/world";
import { directionOf, stepTowards, type Rect, type Vec2 } from "./movement";

/**
 * Press-and-hold on your own avatar, drag, release (spec §4.3).
 * The avatar walks toward the pointer at WALK_SPEED rather than teleporting,
 * so it animates, respects collisions, and the camera can follow smoothly.
 */
export class DragController {
  private dragging = false;
  /** Pointer-to-feet offset captured on press, so the avatar doesn't jump. */
  private grabOffset: Vec2 = { x: 0, y: 0 };

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly avatar: Avatar,
    private readonly blockers: readonly Rect[],
    private readonly hooks: { onDragStart: () => void; onMoved: () => void },
  ) {
    avatar.sprite.setInteractive({ useHandCursor: true, draggable: false, pixelPerfect: true });
    avatar.sprite.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown() || pointer.middleButtonDown()) return;
      this.hooks.onDragStart(); // may stand the avatar up first
      const world = this.pointerWorld(pointer);
      this.grabOffset = { x: avatar.x - world.x, y: avatar.y - world.y };
      this.dragging = true;
    });
    scene.input.on("pointerup", () => this.release());
    scene.input.on("gameout", () => this.release());
  }

  get isDragging() {
    return this.dragging;
  }

  update(deltaMs: number) {
    if (!this.dragging) return;
    const world = this.pointerWorld(this.scene.input.activePointer);
    const target = { x: world.x + this.grabOffset.x, y: world.y + this.grabOffset.y };
    const from = { x: this.avatar.x, y: this.avatar.y };
    const next = stepTowards(from, target, (WALK_SPEED * deltaMs) / 1000, WALKABLE, this.blockers);

    const dx = next.x - from.x;
    const dy = next.y - from.y;
    if (Math.hypot(dx, dy) > 0.2) {
      this.avatar.setPosition(next.x, next.y);
      this.avatar.setFacing(directionOf(dx, dy, this.avatar.facing));
      this.avatar.setCharacterState("walking");
      this.avatar.syncDepth();
      this.hooks.onMoved();
    } else if (this.avatar.characterState === "walking") {
      this.avatar.setCharacterState("idle");
    }
  }

  private release() {
    if (!this.dragging) return;
    this.dragging = false;
    if (this.avatar.characterState === "walking") this.avatar.setCharacterState("idle");
  }

  /** Re-projects every frame: the camera may scroll while the pointer is still. */
  private pointerWorld(pointer: Phaser.Input.Pointer): Vec2 {
    const p = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    return { x: p.x, y: p.y };
  }
}
