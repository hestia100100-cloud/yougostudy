"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { gameEvents, type GameEventMap } from "@/game/events";
import { currentUser } from "@/lib/mock-data";
import type { Room } from "@/types";
import { GameCanvas } from "./GameCanvas";

export function StudyRoom({ room }: { room: Room }) {
  const [chatOpen, setChatOpen] = useState(true);
  const [player, setPlayer] = useState<GameEventMap["player:state"] | null>(null);
  const [showTip, setShowTip] = useState(true);

  useEffect(() => gameEvents.on("player:state", setPlayer), []);
  // Keep the game visible on small screens: chat starts collapsed there.
  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) setChatOpen(false);
  }, []);
  useEffect(() => {
    if (player?.state === "walking") setShowTip(false);
  }, [player?.state]);

  const busy = Boolean(player?.activity);

  return (
    <div className="flex h-[calc(100dvh-108px)] flex-col md:h-screen">
      {/* Room controls */}
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-bark bg-paper px-3 py-2">
        <h1 className="mr-auto truncate font-semibold text-forest">
          {room.visibility === "private" && "🔒 "}
          {room.name}
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
          <GameCanvas animal={currentUser.animal} username={currentUser.username} />
          {showTip && (
            <p className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-paper/90 px-3 py-1.5 text-xs text-bark shadow">
              Press and hold your cat, then drag to walk · Click a chair to sit
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
                { id: "s1", senderId: null, senderName: "system", text: `You joined ${room.name}`, sentAt: new Date().toISOString() },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
