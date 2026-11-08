import type * as Phaser from "phaser";
import type { AnimalType } from "@/types";
import {
  SEATED_STATES,
  STANDING_ACTIVITY_STATES,
  animIdle,
  animSeated,
  animStanding,
  animWalk,
  frameKey,
} from "@/game/assets/keys";
import type { Direction } from "@/game/movement/movement";

const DIRECTIONS: Direction[] = ["up", "down", "left", "right"];

interface AnimSpec {
  key: string;
  frames: number;
  frameRate: number;
  /** Optional per-frame durations in ms (overrides frameRate pacing). */
  durations?: number[];
}

/** Every animation a character needs, with its frame count. Art must provide these frames. */
export function characterAnimSpecs(animal: AnimalType): AnimSpec[] {
  return [
    { key: animIdle(animal), frames: 2, frameRate: 1, durations: [2600, 160] },
    ...DIRECTIONS.map((d) => ({ key: animWalk(animal, d), frames: 4, frameRate: 8 })),
    ...SEATED_STATES.map((s) => ({ key: animSeated(animal, s), frames: 2, frameRate: 1.5 })),
    ...STANDING_ACTIVITY_STATES.map((s) => ({ key: animStanding(animal, s), frames: 2, frameRate: 1.5 })),
  ];
}

export function registerCharacterAnimations(scene: Phaser.Scene, animal: AnimalType) {
  for (const spec of characterAnimSpecs(animal)) {
    if (scene.anims.exists(spec.key)) continue;
    scene.anims.create({
      key: spec.key,
      frames: Array.from({ length: spec.frames }, (_, i) => ({
        key: frameKey(spec.key, i),
        duration: spec.durations?.[i],
      })),
      frameRate: spec.frameRate,
      repeat: -1,
    });
  }
}
