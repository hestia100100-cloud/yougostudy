import type * as Phaser from "phaser";
import type { AnimalType, PlayerMove, PlayerSnapshot } from "@/types";
import { generateCharacterPlaceholders } from "@/game/assets/placeholders/characters";
import { Avatar } from "@/game/characters/Avatar";
import { registerCharacterAnimations } from "@/game/characters/animations";
import { SEATS } from "@/game/furniture/layout";

/** Remote updates further than this snap instead of gliding (e.g. standing up, rejoining). */
const SNAP_DISTANCE = 400;
/** Exponential smoothing rate for remote positions (per second). */
const SMOOTHING = 12;
/** If no move arrives for this long while "walking", show them idle. */
const WALK_TIMEOUT_MS = 400;

interface Remote {
  avatar: Avatar;
  target: { x: number; y: number };
  lastMoveAt: number;
}

/**
 * Renders other players from network snapshots. Positions are interpolated
 * toward the latest received target so movement looks smooth, not jumpy.
 */
export class RemotePlayers {
  private remotes = new Map<string, Remote>();

  constructor(private readonly scene: Phaser.Scene) {}

  /** Seats taken by remote players right now. */
  occupiedSeats(): Set<string> {
    const set = new Set<string>();
    for (const r of this.remotes.values()) if (r.avatar.seatId) set.add(r.avatar.seatId);
    return set;
  }

  upsert(p: PlayerSnapshot) {
    let r = this.remotes.get(p.userId);
    if (r && r.avatar.animal !== p.animal) {
      this.remove(p.userId); // changed animal: rebuild with new art
      r = undefined;
    }
    if (!r) {
      this.ensureArt(p.animal);
      r = { avatar: new Avatar(this.scene, p.x, p.y, p.animal, p.username), target: { x: p.x, y: p.y }, lastMoveAt: 0 };
      this.remotes.set(p.userId, r);
    }
    const { avatar } = r;
    avatar.setDisplayName(p.username);

    const seat = p.seatId ? SEATS.get(p.seatId) : undefined;
    if (seat) {
      avatar.sit(seat.id, seat.x, seat.y, p.state, seat.depth ?? seat.y);
      r.target = { x: seat.x, y: seat.y };
      return;
    }
    if (avatar.seated) avatar.standUp(p.x, p.y);
    r.target = { x: p.x, y: p.y };
    avatar.setFacing(p.facing);
    avatar.setCharacterState(p.state);
  }

  move(m: PlayerMove) {
    const r = this.remotes.get(m.userId);
    if (!r || r.avatar.seated) return;
    r.target = { x: m.x, y: m.y };
    r.lastMoveAt = this.scene.time.now;
    r.avatar.setFacing(m.facing);
    r.avatar.setCharacterState(m.state);
  }

  remove(userId: string) {
    this.remotes.get(userId)?.avatar.destroy();
    this.remotes.delete(userId);
  }

  update(deltaMs: number) {
    const k = Math.min(1, (SMOOTHING * deltaMs) / 1000);
    for (const r of this.remotes.values()) {
      const { avatar, target } = r;
      if (avatar.seated) continue;
      const dx = target.x - avatar.x;
      const dy = target.y - avatar.y;
      if (Math.hypot(dx, dy) > SNAP_DISTANCE) avatar.setPosition(target.x, target.y);
      else avatar.setPosition(avatar.x + dx * k, avatar.y + dy * k);
      avatar.syncDepth();
      if (avatar.characterState === "walking" && this.scene.time.now - r.lastMoveAt > WALK_TIMEOUT_MS) {
        avatar.setCharacterState("idle");
      }
    }
  }

  destroy() {
    for (const id of [...this.remotes.keys()]) this.remove(id);
  }

  private ensureArt(animal: AnimalType) {
    generateCharacterPlaceholders(this.scene, animal);
    registerCharacterAnimations(this.scene, animal);
  }
}
