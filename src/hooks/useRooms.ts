"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePresence } from "@/components/presence/PresenceProvider";
import type { Room } from "@/types";

/**
 * Loads rooms with `load` and decorates them with live online counts from lobby presence.
 * `load` should be stable (module function or memoised).
 */
export function useRooms(load: () => Promise<Room[]>) {
  const { roomCounts } = usePresence();
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    load()
      .then((r) => {
        setRooms(r);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, [load]);

  useEffect(reload, [reload]);

  const live = useMemo(
    () =>
      rooms?.map((r) => {
        const onlineCount = roomCounts[r.id] ?? 0;
        return { ...r, onlineCount, status: onlineCount > 0 ? ("open" as const) : ("quiet" as const) };
      }) ?? null,
    [rooms, roomCounts],
  );

  return { rooms: live, error, reload };
}
