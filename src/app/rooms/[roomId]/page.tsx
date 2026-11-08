import Link from "next/link";
import { notFound } from "next/navigation";
import { rooms } from "@/lib/mock-data";

// Placeholder. The Phaser study room is mounted here in Phase 2.
export default async function StudyRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const room = rooms.find((r) => r.id === roomId);
  if (!room) notFound();

  return (
    <div className="flex h-full min-h-[70vh] flex-col">
      <div className="flex items-center justify-between border-b-2 border-bark bg-white/60 px-4 py-3">
        <h1 className="font-semibold text-forest">{room.name}</h1>
        <Link href="/lobby" className="rounded-md border-2 border-bark px-3 py-1 text-sm hover:bg-beige">
          Leave room
        </Link>
      </div>
      <div className="m-4 flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-bark/40 bg-beige/40 p-8 text-center">
        <div>
          <p className="text-lg font-semibold text-forest">The virtual study room goes here.</p>
          <p className="mt-1 text-sm text-bark/70">Coming in Phase 2: Phaser world, avatar movement, furniture.</p>
        </div>
      </div>
    </div>
  );
}
