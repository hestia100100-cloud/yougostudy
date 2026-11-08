import { notFound } from "next/navigation";
import { StudyRoom } from "@/components/room/StudyRoom";
import { rooms } from "@/lib/mock-data";

export default async function StudyRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const room = rooms.find((r) => r.id === roomId);
  if (!room) notFound();

  return <StudyRoom room={room} />;
}
