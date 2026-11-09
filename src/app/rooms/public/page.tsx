"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { CreateRoomForm } from "@/components/rooms/CreateRoomForm";
import { RoomGrid } from "@/components/rooms/RoomCard";
import { useRooms } from "@/hooks/useRooms";
import { listPublicRooms } from "@/lib/supabase/rooms";

export default function PublicRoomsPage() {
  const { rooms, error } = useRooms(listPublicRooms);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-8">
      <PageHeader
        title="Public Rooms"
        subtitle="Open to everyone. Walk in, find a desk, get to work."
        action={<CreateRoomForm defaultVisibility="public" />}
      />
      <RoomGrid rooms={rooms} error={error} />
    </div>
  );
}
