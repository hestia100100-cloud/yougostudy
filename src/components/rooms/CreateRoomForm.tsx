"use client";

import { useState } from "react";
import type { RoomVisibility } from "@/types";

// UI only for now. Room creation is wired to Supabase in Phase 3/4
// (private room passwords will be hashed and checked server-side).
export function CreateRoomForm({ defaultVisibility = "public" }: { defaultVisibility?: RoomVisibility }) {
  const [open, setOpen] = useState(false);
  const [visibility, setVisibility] = useState<RoomVisibility>(defaultVisibility);
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
      onSubmit={(e) => {
        e.preventDefault();
        setNotice("Room creation will be available once the backend is connected (Phase 3).");
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
      <input required placeholder="Room name" className="w-full rounded-md border-2 border-bark/40 bg-paper px-3 py-2 text-sm" />
      <input placeholder="Description (optional)" className="w-full rounded-md border-2 border-bark/40 bg-paper px-3 py-2 text-sm" />
      {visibility === "private" && (
        <input
          required
          type="password"
          placeholder="Room password"
          className="w-full rounded-md border-2 border-bark/40 bg-paper px-3 py-2 text-sm"
        />
      )}
      {notice && <p className="text-xs text-terracotta">{notice}</p>}
      <div className="flex justify-end gap-2 text-sm">
        <button type="button" onClick={() => { setOpen(false); setNotice(null); }} className="px-3 py-1.5">
          Cancel
        </button>
        <button type="submit" className="rounded-md border-2 border-bark bg-terracotta px-4 py-1.5 font-semibold text-paper">
          Create
        </button>
      </div>
    </form>
  );
}
