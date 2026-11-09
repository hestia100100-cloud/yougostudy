import * as Phaser from "phaser";
import type { AnimalType, CharacterState } from "@/types";
import {
  SEATED_STATES,
  STANDING_ACTIVITY_STATES,
  animIdle,
  animSeated,
  animStanding,
  animWalk,
  type SeatedState,
  type StandingActivityState,
} from "@/game/assets/keys";
import type { Direction } from "@/game/movement/movement";
import type { LocalSnapshot } from "@/game/events";
import { ACTIVITY_LABELS } from "@/game/furniture/layout";

const STATE_ICON: Partial<Record<CharacterState, string>> = {
  working: "✏️",
  reading: "📖",
  break: "☕",
  sleeping: "💤",
};

/**
 * Visual representation of one player. Holds no input logic, so the same class
 * renders both the local player and (later) remote players.
 * Container origin = the character's feet in world coordinates.
 */
export class Avatar extends Phaser.GameObjects.Container {
  readonly sprite: Phaser.GameObjects.Sprite;
  private readonly nameLabel: Phaser.GameObjects.Text;
  private readonly statusLabel: Phaser.GameObjects.Text;

  characterState: CharacterState = "idle";
  facing: Direction = "down";
  seatId: string | null = null;
  private seatDepth: number | null = null;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    readonly animal: AnimalType,
    name: string,
  ) {
    super(scene, x, y);

    this.sprite = scene.add.sprite(0, 0, "__DEFAULT").setOrigin(0.5, 1);
    this.nameLabel = scene.add
      .text(0, -84, name, {
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        fontSize: "13px",
        fontStyle: "bold",
        color: "#f2ede3",
        backgroundColor: "#3f5141",
        padding: { x: 6, y: 2 },
      })
      .setOrigin(0.5, 1);
    this.statusLabel = scene.add.text(0, -104, "", { fontSize: "16px" }).setOrigin(0.5, 1);

    this.add([this.sprite, this.nameLabel, this.statusLabel]);
    scene.add.existing(this);
    this.applyAnimation();
    this.syncDepth();
  }

  get seated() {
    return this.seatId !== null;
  }

  setDisplayName(name: string) {
    if (this.nameLabel.text !== name) this.nameLabel.setText(name);
  }

  setFacing(dir: Direction) {
    if (dir === this.facing) return;
    this.facing = dir;
    if (this.characterState === "walking") this.applyAnimation();
  }

  setCharacterState(state: CharacterState) {
    if (state === this.characterState) return;
    this.characterState = state;
    this.applyAnimation();
  }

  sit(seatId: string, x: number, y: number, state: CharacterState, depth: number) {
    this.seatId = seatId;
    this.seatDepth = depth;
    this.setPosition(x, y);
    this.facing = "down";
    this.characterState = state;
    this.applyAnimation();
    this.syncDepth();
  }

  standUp(x: number, y: number) {
    this.seatId = null;
    this.seatDepth = null;
    this.setPosition(x, y);
    this.setCharacterState("idle");
    this.syncDepth();
  }

  /** Characters further down the screen are drawn in front. */
  syncDepth() {
    this.setDepth(this.seatDepth ?? this.y);
  }

  /** Shareable state for the network layer. */
  snapshot(): LocalSnapshot {
    return { x: this.x, y: this.y, state: this.characterState, facing: this.facing, seatId: this.seatId };
  }

  activityLabel(): string | null {
    return ACTIVITY_LABELS[this.characterState] ?? null;
  }

  private applyAnimation() {
    const s = this.characterState;
    let key: string;
    if (s === "walking") key = animWalk(this.animal, this.facing);
    else if (this.seated && (SEATED_STATES as readonly string[]).includes(s)) key = animSeated(this.animal, s as SeatedState);
    else if ((STANDING_ACTIVITY_STATES as readonly string[]).includes(s)) key = animStanding(this.animal, s as StandingActivityState);
    else key = animIdle(this.animal);

    if (this.sprite.anims.currentAnim?.key !== key) this.sprite.play(key);
    this.statusLabel.setText(STATE_ICON[s] ?? "");
    // Seated sprites are shorter; keep labels hugging the head.
    const top = this.seated ? -76 : -84;
    this.nameLabel.setY(top);
    this.statusLabel.setY(top - 20);
  }
}
