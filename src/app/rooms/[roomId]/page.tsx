"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { StudyRoom } from "@/components/room/StudyRoom";
import { getRoom } from "@/lib/supabase/rooms";
import type { Room } from "@/types";

export default function StudyRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const [room, setRoom] = useState<Room | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRoom(roomId)
      .then(setRoom)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, [roomId]);

  if (room) return <StudyRoom room={room} />;

  return (
    <div className="p-8 text-sm">
      {error ? `Couldn't load this room: ${error}` : room === null ? "This room doesn't exist (or you don't have access)." : "Loading room…"}
      {(error || room === null) && (
        <Link href="/lobby" className="ml-2 text-terracotta underline">
          Back to lobby
        </Link>
      )}
    </div>
  );
}
