import { PageHeader } from "@/components/layout/PageHeader";
import { CreateRoomForm } from "@/components/rooms/CreateRoomForm";
import { RoomGrid } from "@/components/rooms/RoomCard";
import { myRooms } from "@/lib/mock-data";

export default function MyRoomsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-8">
      <PageHeader title="My Rooms" subtitle="Rooms you created." action={<CreateRoomForm />} />
      <RoomGrid rooms={myRooms} />
    </div>
  );
}
