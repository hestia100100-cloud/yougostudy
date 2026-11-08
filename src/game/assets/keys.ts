// Texture & animation key contract.
//
// Game logic only refers to these keys. Final art replaces placeholders by
// loading real images under the same keys (see manifest.ts) — no logic changes.
import type { AnimalType } from "@/types";
import type { FurnitureKind } from "@/game/furniture/layout";
import type { Direction } from "@/game/movement/movement";

export const BACKGROUND_KEY = "room-bg";

export const furnitureKey = (kind: FurnitureKind) => `furniture-${kind}`;

/** States drawn in a seated posture vs. standing. */
export const SEATED_STATES = ["sitting", "working", "reading", "break", "sleeping"] as const;
export const STANDING_ACTIVITY_STATES = ["reading", "break"] as const;

export type SeatedState = (typeof SEATED_STATES)[number];
export type StandingActivityState = (typeof STANDING_ACTIVITY_STATES)[number];

// Animation keys
export const animIdle = (a: AnimalType) => `${a}-idle`;
export const animWalk = (a: AnimalType, d: Direction) => `${a}-walk-${d}`;
export const animSeated = (a: AnimalType, s: SeatedState) => `${a}-${s}-sit`;
export const animStanding = (a: AnimalType, s: StandingActivityState) => `${a}-${s}-stand`;

/** Individual frame texture key: `<animKey>-<frameIndex>`. */
export const frameKey = (animKey: string, i: number) => `${animKey}-${i}`;

/** Character frame size (feet at bottom-centre). */
export const CHARACTER_FRAME = { w: 64, h: 80 };
