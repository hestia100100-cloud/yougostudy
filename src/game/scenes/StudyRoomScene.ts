import * as Phaser from "phaser";
import type { AnimalType, CharacterState } from "@/types";
import { BACKGROUND_KEY } from "@/game/assets/keys";
import { IMAGE_ASSETS } from "@/game/assets/manifest";
import { generateBackgroundPlaceholder } from "@/game/assets/placeholders/background";
import { generateCharacterPlaceholders } from "@/game/assets/placeholders/characters";
import { generateFurniturePlaceholders } from "@/game/assets/placeholders/furniture";
import { setupFollowCamera } from "@/game/camera/followCamera";
import { Avatar } from "@/game/characters/Avatar";
import { registerCharacterAnimations } from "@/game/characters/animations";
import { INTERACT_RADIUS, SPAWN_POINT } from "@/game/config/world";
import { gameEvents } from "@/game/events";
import { FurnitureObject, blockerRect } from "@/game/furniture/Furniture";
import { FURNITURE, SEATS, type SeatDef } from "@/game/furniture/layout";
import { DragController } from "@/game/movement/DragController";
import type { Rect } from "@/game/movement/movement";

export interface StudyRoomSceneData {
  animal: AnimalType;
  username: string;
}

/** Clicks shorter than this (px of pointer travel) count as clicks, not drags. */
const CLICK_SLOP = 6;

export class StudyRoomScene extends Phaser.Scene {
  private player!: Avatar;
  private drag!: DragController;
  private hoverHint!: Phaser.GameObjects.Text;
  /** Seats taken by anyone in the room. Shared state once multiplayer lands. */
  private occupiedSeats = new Set<string>();
  /** Furniture the current activity/seat belongs to, for the UI label. */
  private activityPlace: string | null = null;
  private unsubscribers: (() => void)[] = [];

  constructor() {
    super("StudyRoom");
  }

  preload() {
    for (const asset of IMAGE_ASSETS) this.load.image(asset.key, asset.url);
  }

  create(data: StudyRoomSceneData) {
    generateBackgroundPlaceholder(this);
    generateFurniturePlaceholders(this);
    generateCharacterPlaceholders(this, data.animal);
    registerCharacterAnimations(this, data.animal);

    this.add.image(0, 0, BACKGROUND_KEY).setOrigin(0, 0).setDepth(-10);

    const blockers: Rect[] = [];
    for (const def of FURNITURE) {
      const obj = new FurnitureObject(this, def);
      const rect = blockerRect(def);
      if (rect) blockers.push(rect);
      if (obj.interactive) this.wireFurniture(obj);
    }

    this.player = new Avatar(this, SPAWN_POINT.x, SPAWN_POINT.y, data.animal, data.username);
    this.drag = new DragController(this, this.player, blockers, {
      onDragStart: () => this.leaveCurrentSpot(),
      onMoved: () => {},
    });
    setupFollowCamera(this, this.player);

    this.hoverHint = this.add
      .text(0, 0, "", {
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        fontSize: "13px",
        color: "#2e241d",
        backgroundColor: "#f2ede3",
        padding: { x: 6, y: 3 },
      })
      .setOrigin(0.5, 1)
      .setDepth(10_000)
      .setVisible(false);

    this.unsubscribers.push(gameEvents.on("command:stand-up", () => this.leaveCurrentSpot()));
    this.events.once("shutdown", () => this.unsubscribers.forEach((u) => u()));
    this.emitState();
  }

  update(_time: number, delta: number) {
    const before = this.player.characterState;
    this.drag.update(delta);
    if (this.player.characterState !== before) this.emitState();
  }

  private wireFurniture(obj: FurnitureObject) {
    obj.on("pointerover", () => {
      if (this.drag.isDragging) return;
      this.hoverHint.setText(obj.hint).setPosition(obj.x, obj.y - obj.displayHeight - 6).setVisible(true);
    });
    obj.on("pointerout", () => this.hoverHint.setVisible(false));
    obj.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      if (this.drag.isDragging) return;
      if (Phaser.Math.Distance.Between(pointer.downX, pointer.downY, pointer.upX, pointer.upY) > CLICK_SLOP) return;
      this.interact(obj);
    });
  }

  private interact(obj: FurnitureObject) {
    const { def } = obj;
    this.hoverHint.setVisible(false);

    if (def.seatIds?.length) {
      const free = def.seatIds
        .map((id) => SEATS.get(id)!)
        .filter((s) => !this.occupiedSeats.has(s.id) || s.id === this.player.seatId);
      if (free.length === 0) return this.floatHint(obj, "Taken");
      const seat = free.reduce((a, b) => (this.distanceTo(a) <= this.distanceTo(b) ? a : b));
      if (seat.id === this.player.seatId) return;
      if (!this.player.seated && this.distanceTo(seat) > INTERACT_RADIUS) return this.floatHint(obj, "Walk a little closer");
      this.sitAt(seat, obj.label);
      return;
    }

    if (def.action) {
      // Distance to the front edge of the object, so wide counters work from either end.
      const half = (def.blocker?.w ?? obj.displayWidth) / 2;
      const nearestX = Phaser.Math.Clamp(this.player.x, def.x - half, def.x + half);
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, nearestX, def.y);
      if (this.player.seated || dist > INTERACT_RADIUS) return this.floatHint(obj, "Walk a little closer");
      this.startActivity(def.action.state, obj.label);
    }
  }

  private sitAt(seat: SeatDef, place: string) {
    this.leaveCurrentSpot();
    this.occupiedSeats.add(seat.id);
    this.activityPlace = place;
    this.player.sit(seat.id, seat.x, seat.y, seat.state, seat.depth ?? seat.y);
    this.emitState();
  }

  private startActivity(state: CharacterState, place: string) {
    this.activityPlace = place;
    this.player.setFacing("down");
    this.player.setCharacterState(state);
    this.emitState();
  }

  /** Stand up from a seat or stop a standing activity. */
  private leaveCurrentSpot() {
    if (this.player.seatId) {
      const seat = SEATS.get(this.player.seatId)!;
      this.occupiedSeats.delete(seat.id);
      this.player.standUp(seat.exit.x, seat.exit.y);
    } else if (this.player.characterState !== "idle" && this.player.characterState !== "walking") {
      this.player.setCharacterState("idle");
    }
    this.activityPlace = null;
    this.emitState();
  }

  private distanceTo(seat: SeatDef) {
    return Phaser.Math.Distance.Between(this.player.x, this.player.y, seat.x, seat.y);
  }

  private floatHint(obj: FurnitureObject, text: string) {
    const t = this.add
      .text(obj.x, obj.y - obj.displayHeight - 8, text, {
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        fontSize: "13px",
        color: "#f2ede3",
        backgroundColor: "#b66d4b",
        padding: { x: 6, y: 3 },
      })
      .setOrigin(0.5, 1)
      .setDepth(10_001);
    this.hoverHint.setVisible(false);
    this.tweens.add({ targets: t, y: t.y - 18, alpha: 0, delay: 700, duration: 600, onComplete: () => t.destroy() });
  }

  private emitState() {
    const label = this.player.activityLabel();
    gameEvents.emit("player:state", {
      state: this.player.characterState,
      seated: this.player.seated,
      activity: label && this.activityPlace ? `${label} · ${this.activityPlace}` : null,
    });
  }
}
