"use client";

import { useEffect, useRef } from "react";
import type { AnimalType } from "@/types";

/**
 * Mounts the Phaser study room. Phaser is imported lazily inside the effect so it
 * never runs during server rendering and stays out of other pages' bundles.
 */
export function GameCanvas({
  animal,
  username,
  spawn,
}: {
  animal: AnimalType;
  username: string;
  spawn: { x: number; y: number };
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let game: { destroy: (removeCanvas: boolean) => void } | null = null;

    import("@/game/createGame").then(({ createGame }) => {
      if (cancelled || !parentRef.current) return;
      game = createGame(parentRef.current, { animal, username, spawn });
    });

    return () => {
      cancelled = true;
      game?.destroy(true);
    };
    // spawn is fixed for the lifetime of the room view
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animal, username]);

  return <div ref={parentRef} className="absolute inset-0 overflow-hidden" />;
}
