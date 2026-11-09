"use client";

import type { RealtimeChannel } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import type { AnimalType } from "@/types";

/** What each client shares on the global lobby channel. */
interface LobbyPresence {
  userId: string;
  username: string;
  animal: AnimalType;
  roomId: string | null;
}

interface PresenceContextValue {
  onlineUsers: LobbyPresence[];
  /** Number of people currently in each room, by room id. */
  roomCounts: Record<string, number>;
  /** Tell everyone which room you're in (null = lobby). */
  setCurrentRoom: (roomId: string | null) => void;
}

const PresenceContext = createContext<PresenceContextValue | null>(null);

export function usePresence() {
  const ctx = useContext(PresenceContext);
  if (!ctx) throw new Error("usePresence must be used inside <PresenceProvider>");
  return ctx;
}

/** Global "who's online and where" via Supabase Realtime Presence on the `lobby` channel. */
export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<LobbyPresence[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const meRef = useRef<LobbyPresence>({ userId: profile.id, username: profile.username, animal: profile.animal, roomId: null });

  useEffect(() => {
    const channel = supabase().channel("lobby", { config: { presence: { key: profile.id, enabled: true } } });
    channelRef.current = channel;
    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<LobbyPresence>();
        // One entry per user; with several tabs open, the newest one wins.
        setOnlineUsers(Object.values(state).flatMap((metas) => (metas.length ? [metas[metas.length - 1]] : [])));
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") void channel.track(meRef.current);
      });
    return () => {
      channelRef.current = null;
      void supabase().removeChannel(channel);
    };
  }, [profile.id]);

  // Re-announce whenever our name, animal or room changes.
  useEffect(() => {
    meRef.current = { userId: profile.id, username: profile.username, animal: profile.animal, roomId };
    void channelRef.current?.track(meRef.current);
  }, [profile.id, profile.username, profile.animal, roomId]);

  const value = useMemo<PresenceContextValue>(() => {
    const roomCounts: Record<string, number> = {};
    for (const u of onlineUsers) if (u.roomId) roomCounts[u.roomId] = (roomCounts[u.roomId] ?? 0) + 1;
    return { onlineUsers, roomCounts, setCurrentRoom: setRoomId };
  }, [onlineUsers]);

  return <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>;
}
