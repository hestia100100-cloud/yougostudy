import type { RealtimeChannel } from "@supabase/supabase-js";
import type { PlayerMove, PlayerSnapshot } from "@/types";
import { supabase } from "./client";

/** Max movement broadcasts per second per client. */
const MOVE_INTERVAL_MS = 100;

export type ConnectionStatus = "connecting" | "connected" | "reconnecting" | "closed";

export interface RoomConnectionHandlers {
  onUpsert: (player: PlayerSnapshot) => void;
  onMove: (move: PlayerMove) => void;
  onLeave: (userId: string) => void;
  onStatus: (status: ConnectionStatus) => void;
}

/**
 * One Supabase Realtime channel per room (`room:<id>`):
 * - Presence: who is here + their latest full snapshot (join/leave, sit/stand, final position).
 * - Broadcast "move": throttled positions while walking.
 * Rooms are isolated because each uses its own channel topic.
 */
export class RoomConnection {
  private channel: RealtimeChannel;
  private me: PlayerSnapshot;
  private known = new Set<string>();
  private lastMoveAt = 0;
  private pendingMove: ReturnType<typeof setTimeout> | null = null;
  private subscribed = false;

  constructor(roomId: string, initial: PlayerSnapshot, private readonly handlers: RoomConnectionHandlers) {
    this.me = initial;
    this.channel = supabase().channel(`room:${roomId}`, {
      config: { presence: { key: initial.userId, enabled: true }, broadcast: { self: false } },
    });

    this.channel
      .on("presence", { event: "sync" }, () => this.syncPresence())
      .on("broadcast", { event: "move" }, ({ payload }) => {
        const move = payload as PlayerMove;
        if (move.userId !== this.me.userId) this.handlers.onMove(move);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          this.subscribed = true;
          this.handlers.onStatus("connected");
          void this.channel.track(this.me);
        } else if (status === "CLOSED") {
          this.subscribed = false;
          this.handlers.onStatus("closed");
        } else {
          // CHANNEL_ERROR / TIMED_OUT: supabase-js retries the join automatically.
          this.subscribed = false;
          this.handlers.onStatus("reconnecting");
        }
      });
    this.handlers.onStatus("connecting");
  }

  /** Full state change (sit, stand, stop walking): stored in presence so late joiners see it. */
  updateState(fields: Partial<PlayerSnapshot>) {
    this.me = { ...this.me, ...fields };
    this.cancelPendingMove();
    if (this.subscribed) void this.channel.track(this.me);
  }

  /** Position while walking: throttled broadcast, not stored. */
  updatePosition(fields: Pick<PlayerSnapshot, "x" | "y" | "facing" | "state">) {
    this.me = { ...this.me, ...fields };
    const wait = MOVE_INTERVAL_MS - (Date.now() - this.lastMoveAt);
    if (wait <= 0) this.sendMove();
    else this.pendingMove ??= setTimeout(() => this.sendMove(), wait);
  }

  disconnect() {
    this.cancelPendingMove();
    void supabase().removeChannel(this.channel);
  }

  private sendMove() {
    this.pendingMove = null;
    this.lastMoveAt = Date.now();
    if (!this.subscribed) return;
    const { userId, x, y, facing, state } = this.me;
    void this.channel.send({ type: "broadcast", event: "move", payload: { userId, x, y, facing, state } satisfies PlayerMove });
  }

  private cancelPendingMove() {
    if (this.pendingMove) clearTimeout(this.pendingMove);
    this.pendingMove = null;
  }

  private syncPresence() {
    const state = this.channel.presenceState<PlayerSnapshot>();
    const present = new Set<string>();
    for (const [key, metas] of Object.entries(state)) {
      // The same user in two tabs shares a key; we ignore our own key entirely.
      if (key === this.me.userId || metas.length === 0) continue;
      present.add(key);
      this.handlers.onUpsert(metas[metas.length - 1]);
    }
    for (const id of this.known) if (!present.has(id)) this.handlers.onLeave(id);
    this.known = present;
  }
}
