"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPublicRoom } from "@/lib/supabase/rooms";
import type { RoomVisibility } from "@/types";

export function CreateRoomForm({ defaultVisibility = "public" }: { defaultVisibility?: RoomVisibility }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [visibility, setVisibility] = useState<RoomVisibility>(defaultVisibility);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-md border-2 border-bark bg-terracotta px-4 py-2 text-sm font-semibold text-paper hover:brightness-110"
      >
        + Create room
      </button>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (visibility === "private") return;
        setBusy(true);
        setNotice(null);
        try {
          const room = await createPublicRoom({ name, description });
          router.push(`/rooms/${room.id}`);
        } catch (err) {
          setNotice(err instanceof Error ? err.message : "Couldn't create the room");
          setBusy(false);
        }
      }}
      className="w-full max-w-md space-y-3 rounded-lg border-2 border-bark bg-white/70 p-4"
    >
      <div className="flex gap-2 text-sm">
        {(["public", "private"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVisibility(v)}
            className={`flex-1 rounded-md border-2 border-bark px-3 py-1.5 capitalize ${
              visibility === v ? "bg-forest text-paper" : "bg-transparent"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      {visibility === "private" ? (
        <p className="rounded-md bg-beige p-3 text-xs">Password-protected private rooms are coming in the next update.</p>
      ) : (
        <>
          <input
            required
            maxLength={40}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Room name"
            className="w-full rounded-md border-2 border-bark/40 bg-paper px-3 py-2 text-sm"
          />
          <input
            maxLength={140}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full rounded-md border-2 border-bark/40 bg-paper px-3 py-2 text-sm"
          />
        </>
      )}
      {notice && <p className="text-xs text-terracotta">{notice}</p>}
      <div className="flex justify-end gap-2 text-sm">
        <button type="button" onClick={() => { setOpen(false); setNotice(null); }} className="px-3 py-1.5">
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy || visibility === "private"}
          className="rounded-md border-2 border-bark bg-terracotta px-4 py-1.5 font-semibold text-paper disabled:opacity-50"
        >
          {busy ? "Creating…" : "Create"}
        </button>
      </div>
    </form>
  );
}
