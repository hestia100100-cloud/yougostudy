import Link from "next/link";
import type { Room } from "@/types";

const STATUS_STYLE: Record<Room["status"], string> = {
  open: "bg-olive text-paper",
  quiet: "bg-mist text-paper",
  closed: "bg-bark/30 text-bark",
};

export function RoomCard({ room }: { room: Room }) {
  const created = new Date(room.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" });

  return (
    <Link
      href={`/rooms/${room.id}`}
      className="group flex flex-col rounded-lg border-2 border-bark bg-white/60 p-4 transition-transform hover:-translate-y-0.5 hover:bg-white"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-forest">
          {room.visibility === "private" && <span aria-label="private">🔒 </span>}
          {room.name}
        </h3>
        <span className={`rounded px-2 py-0.5 text-xs ${STATUS_STYLE[room.status]}`}>{room.status}</span>
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-bark/80">{room.description}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-bark/70">
        <span>
          by {room.creatorName} · {created}
        </span>
        <span className="font-semibold text-terracotta">● {room.onlineCount} online</span>
      </div>
    </Link>
  );
}

export function RoomGrid({ rooms }: { rooms: Room[] }) {
  if (rooms.length === 0) {
    return <p className="rounded-lg border-2 border-dashed border-bark/30 p-8 text-center text-sm">No rooms yet.</p>;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
