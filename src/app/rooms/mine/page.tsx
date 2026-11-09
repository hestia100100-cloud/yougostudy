"use client";

import { useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { PageHeader } from "@/components/layout/PageHeader";
import { CreateRoomForm } from "@/components/rooms/CreateRoomForm";
import { RoomGrid } from "@/components/rooms/RoomCard";
import { useRooms } from "@/hooks/useRooms";
import { listRoomsCreatedBy } from "@/lib/supabase/rooms";

export default function MyRoomsPage() {
  const { profile } = useAuth();
  const load = useCallback(() => listRoomsCreatedBy(profile.id), [profile.id]);
  const { rooms, error } = useRooms(load);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-8">
      <PageHeader title="My Rooms" subtitle="Rooms you created." action={<CreateRoomForm />} />
      <RoomGrid rooms={rooms} error={error} />
    </div>
  );
}
