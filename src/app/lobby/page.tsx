"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { PageHeader } from "@/components/layout/PageHeader";
import { usePresence } from "@/components/presence/PresenceProvider";
import { AnimalAvatar } from "@/components/profile/AnimalAvatar";
import { CreateRoomForm } from "@/components/rooms/CreateRoomForm";
import { RoomGrid } from "@/components/rooms/RoomCard";
import { useRooms } from "@/hooks/useRooms";
import { listPublicRooms } from "@/lib/supabase/rooms";

export default function LobbyPage() {
  const { onlineUsers, setCurrentRoom } = usePresence();
  const { rooms, error } = useRooms(listPublicRooms);

  useEffect(() => setCurrentRoom(null), [setCurrentRoom]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 md:px-8 md:py-8">
      <PageHeader title="Lobby" subtitle="Hang out here, or pick a room to settle into." action={<CreateRoomForm />} />

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-olive">
          Online now · {onlineUsers.length}
        </h2>
        <ul className="flex flex-wrap gap-4">
          {onlineUsers.map((u) => (
            <li key={u.userId} className="flex flex-col items-center gap-1 text-xs">
              <AnimalAvatar animal={u.animal} />
              <span>{u.username}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-olive">Public rooms</h2>
            <div className="flex gap-4 text-sm">
              <Link href="/rooms/public" className="text-terracotta hover:underline">
                Browse all →
              </Link>
              <Link href="/rooms/private" className="text-terracotta hover:underline">
                Join private →
              </Link>
            </div>
          </div>
          <RoomGrid rooms={rooms} error={error} />
        </section>

        <ChatPanel
          title="Lobby chat"
          initialMessages={[{ id: "s1", senderId: null, senderName: "system", text: "Welcome to yougostudy 🌿 (chat goes live in the next update)", sentAt: new Date().toISOString() }]}
        />
      </div>
    </div>
  );
}
