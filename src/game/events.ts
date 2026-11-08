// Tiny typed event bus between React UI and the Phaser game.
// Kept free of Phaser imports so React components can use it without loading the engine.
import type { CharacterState } from "@/types";

export interface GameEventMap {
  /** Local player's state changed (game → UI). */
  "player:state": { state: CharacterState; seated: boolean; activity: string | null };
  /** UI asks the local player to stand up from a seat / stop an activity (UI → game). */
  "command:stand-up": void;
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
