import { PageHeader } from "@/components/layout/PageHeader";
import { CreateRoomForm } from "@/components/rooms/CreateRoomForm";
import { RoomGrid } from "@/components/rooms/RoomCard";
import { publicRooms } from "@/lib/mock-data";

export default function PublicRoomsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-8">
      <PageHeader
        title="Public Rooms"
        subtitle="Open to everyone. Walk in, find a desk, get to work."
        action={<CreateRoomForm defaultVisibility="public" />}
      />
      <RoomGrid rooms={publicRooms} />
    </div>
  );
}
