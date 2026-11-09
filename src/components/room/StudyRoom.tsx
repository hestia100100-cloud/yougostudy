"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { usePresence } from "@/components/presence/PresenceProvider";
import { AnimalAvatar } from "@/components/profile/AnimalAvatar";
import { SPAWN_POINT } from "@/game/config/world";
import { gameEvents, type GameEventMap } from "@/game/events";
import { RoomConnection, type ConnectionStatus } from "@/lib/supabase/roomChannel";
import type { PlayerSnapshot, Room } from "@/types";
import { GameCanvas } from "./GameCanvas";

const STATUS_TEXT: Record<ConnectionStatus, string | null> = {
  connecting: "Connecting…",
  connected: null,
  reconnecting: "Reconnecting…",
  closed: "Disconnected",
};

export function StudyRoom({ room }: { room: Room }) {
  const { profile } = useAuth();
  const { setCurrentRoom } = usePresence();
  const [chatOpen, setChatOpen] = useState(true);
  const [membersOpen, setMembersOpen] = useState(false);
  const [player, setPlayer] = useState<GameEventMap["player:state"] | null>(null);
  const [showTip, setShowTip] = useState(true);
  const [connection, setConnection] = useState<ConnectionStatus>("connecting");
  const [others, setOthers] = useState<Record<string, PlayerSnapshot>>({});
  // Spread arrivals out a little so avatars don't stack on the same spot.
  const [spawn] = useState(() => ({ x: SPAWN_POINT.x + Math.round((Math.random() - 0.5) * 200), y: SPAWN_POINT.y + Math.round((Math.random() - 0.5) * 80) }));
  const othersRef = useRef(others);
  othersRef.current = others;

  useEffect(() => gameEvents.on("player:state", setPlayer), []);
  // Keep the game visible on small screens: chat starts collapsed there.
  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) setChatOpen(false);
  }, []);
  useEffect(() => {
    if (player?.state === "walking") setShowTip(false);
  }, [player?.state]);

  useEffect(() => {
    setCurrentRoom(room.id);
    return () => setCurrentRoom(null);
  }, [room.id, setCurrentRoom]);

  // Network ⇄ game relay. The game never imports Supabase; this component bridges them.
  useEffect(() => {
    const conn = new RoomConnection(
      room.id,
      { userId: profile.id, username: profile.username, animal: profile.animal, ...spawn, state: "idle", facing: "down", seatId: null },
      {
        onUpsert: (p) => {
          setOthers((prev) => ({ ...prev, [p.userId]: p }));
          gameEvents.emit("remote:upsert", p);
        },
        onMove: (m) => gameEvents.emit("remote:move", m),
        onLeave: (userId) => {
          setOthers((prev) => {
            const next = { ...prev };
            delete next[userId];
            return next;
          });
          gameEvents.emit("remote:leave", { userId });
        },
        onStatus: setConnection,
      },
    );
    const offLocal = gameEvents.on("local:snapshot", ({ snapshot, reason }) => {
      if (reason === "move") conn.updatePosition(snapshot);
      else conn.updateState(snapshot);
    });
    // When the scene (re)starts, hand it everyone already in the room.
    const offReady = gameEvents.on("game:ready", () => {
      Object.values(othersRef.current).forEach((p) => gameEvents.emit("remote:upsert", p));
    });
    return () => {
      offLocal();
      offReady();
      conn.disconnect();
    };
  }, [room.id, profile.id, profile.username, profile.animal, spawn]);

  const busy = Boolean(player?.activity);
  const members = [{ userId: profile.id, username: profile.username, animal: profile.animal, you: true }, ...Object.values(others).map((p) => ({ ...p, you: false }))];
  const statusText = STATUS_TEXT[connection];

  return (
    <div className="flex h-[calc(100dvh-108px)] flex-col md:h-screen">
      {/* Room controls */}
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-bark bg-paper px-3 py-2">
        <h1 className="mr-auto truncate font-semibold text-forest">
          {room.visibility === "private" && "🔒 "}
          {room.name}
          {statusText && <span className="ml-2 text-xs font-normal text-terracotta">{statusText}</span>}
        </h1>
        {busy && (
          <span className="flex items-center gap-2 rounded-md bg-beige px-2 py-1 text-sm">
            {player!.activity}
            <button
              onClick={() => gameEvents.emit("command:stand-up")}
              className="rounded border border-bark px-2 text-xs hover:bg-paper"
            >
              {player!.seated ? "Stand up" : "Stop"}
            </button>
          </span>
        )}
        <div className="relative">
          <button
            onClick={() => setMembersOpen((v) => !v)}
            className="rounded-md border-2 border-bark px-3 py-1 text-sm hover:bg-beige"
            aria-expanded={membersOpen}
          >
            👥 {members.length}
          </button>
          {membersOpen && (
            <ul className="absolute right-0 top-full z-20 mt-1 w-48 space-y-2 rounded-md border-2 border-bark bg-paper p-2 text-sm shadow">
              {members.map((m) => (
                <li key={m.userId} className="flex items-center gap-2">
                  <AnimalAvatar animal={m.animal} size="sm" />
                  <span className="truncate">{m.username}</span>
                  {m.you && <span className="text-xs text-bark/60">(you)</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={() => setChatOpen((v) => !v)}
          className="rounded-md border-2 border-bark px-3 py-1 text-sm hover:bg-beige"
          aria-pressed={chatOpen}
        >
          {chatOpen ? "Hide chat" : "Chat"}
        </button>
        <Link href="/lobby" className="rounded-md border-2 border-bark bg-terracotta px-3 py-1 text-sm text-paper hover:brightness-110">
          Leave
        </Link>
      </div>

      <div className="relative flex min-h-0 flex-1">
        {/* Virtual environment — the visual priority */}
        <div className="relative min-w-0 flex-1 bg-forest">
          <GameCanvas animal={profile.animal} username={profile.username} spawn={spawn} />
          {showTip && (
            <p className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-paper/90 px-3 py-1.5 text-xs text-bark shadow">
              Press and hold your avatar, then drag to walk · Click a chair to sit
            </p>
          )}
        </div>

        {/* Room chat — collapsible, overlays on narrow screens */}
        {chatOpen && (
          <div className="absolute inset-y-0 right-0 z-10 w-72 max-w-[85%] border-l-2 border-bark bg-paper p-2 lg:static lg:w-80">
            <ChatPanel
              title="Room chat"
              className="h-full"
              initialMessages={[
                { id: "s1", senderId: null, senderName: "system", text: `You joined ${room.name} (chat goes live in the next update)`, sentAt: new Date().toISOString() },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
