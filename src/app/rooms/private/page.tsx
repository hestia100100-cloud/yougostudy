import { PageHeader } from "@/components/layout/PageHeader";
import { CreateRoomForm } from "@/components/rooms/CreateRoomForm";
import { JoinPrivateRoomForm } from "@/components/rooms/JoinPrivateRoomForm";
import { RoomGrid } from "@/components/rooms/RoomCard";
import { privateRooms } from "@/lib/mock-data";

export default function PrivateRoomsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 md:px-8 md:py-8">
      <PageHeader
        title="Private Rooms"
        subtitle="Password-protected rooms for you and your friends."
        action={<CreateRoomForm defaultVisibility="private" />}
      />
      <JoinPrivateRoomForm />
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-olive">Rooms you can access</h2>
        <RoomGrid rooms={privateRooms} />
      </section>
    </div>
  );
}
