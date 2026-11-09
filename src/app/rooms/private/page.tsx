import { PageHeader } from "@/components/layout/PageHeader";
import { JoinPrivateRoomForm } from "@/components/rooms/JoinPrivateRoomForm";

// Private rooms (hashed passwords, server-side verification) are Phase 4.
export default function PrivateRoomsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 md:px-8 md:py-8">
      <PageHeader title="Private Rooms" subtitle="Password-protected rooms for you and your friends — coming in the next update." />
      <JoinPrivateRoomForm />
    </div>
  );
}
