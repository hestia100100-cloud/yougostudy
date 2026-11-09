// Tiny typed event bus between React UI and the Phaser game.
// Kept free of Phaser imports so React components can use it without loading the engine.
// The game never talks to the network directly: React relays these events to Supabase.
import type { CharacterState, PlayerMove, PlayerSnapshot } from "@/types";

/** Local player's shareable state (identity fields are added by the network layer). */
export type LocalSnapshot = Omit<PlayerSnapshot, "userId" | "username" | "animal">;

export interface GameEventMap {
  /** Scene finished building; UI should (re)send current remote players (game → UI). */
  "game:ready": void;
  /** Local player's state changed (game → UI). */
  "player:state": { state: CharacterState; seated: boolean; activity: string | null };
  /** Local player moved / changed state — to broadcast (game → UI → network). */
  "local:snapshot": { snapshot: LocalSnapshot; reason: "move" | "state" };
  /** UI asks the local player to stand up from a seat / stop an activity (UI → game). */
  "command:stand-up": void;
  /** Remote player joined or changed state (network → game). */
  "remote:upsert": PlayerSnapshot;
  /** Remote player position update while walking (network → game). */
  "remote:move": PlayerMove;
  /** Remote player left the room (network → game). */
  "remote:leave": { userId: string };
}

type Handler<T> = (payload: T) => void;

class GameEventBus {
  private handlers = new Map<keyof GameEventMap, Set<Handler<never>>>();

  on<K extends keyof GameEventMap>(event: K, handler: Handler<GameEventMap[K]>): () => void {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(handler as Handler<never>);
    return () => this.handlers.get(event)?.delete(handler as Handler<never>);
  }

  emit<K extends keyof GameEventMap>(event: K, ...payload: GameEventMap[K] extends void ? [] : [GameEventMap[K]]) {
    this.handlers.get(event)?.forEach((h) => (h as Handler<unknown>)(payload[0]));
  }
}

export const gameEvents = new GameEventBus();
