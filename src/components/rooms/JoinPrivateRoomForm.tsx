"use client";

import { useState } from "react";

// UI only. Password verification must happen server-side (Phase 4);
// the client never receives the stored hash.
export function JoinPrivateRoomForm() {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setNotice("Joining private rooms will work once the backend is connected (Phase 4).");
      }}
      className="max-w-md space-y-3 rounded-lg border-2 border-bark bg-white/60 p-4"
    >
      <h2 className="font-semibold text-forest">Join a private room</h2>
      <input required placeholder="Room ID" className="w-full rounded-md border-2 border-bark/40 bg-paper px-3 py-2 text-sm" />
      <input
        required
        type="password"
        placeholder="Password"
        className="w-full rounded-md border-2 border-bark/40 bg-paper px-3 py-2 text-sm"
      />
      {notice && <p className="text-xs text-terracotta">{notice}</p>}
      <button className="rounded-md border-2 border-bark bg-forest px-4 py-2 text-sm font-semibold text-paper">
        Enter room
      </button>
    </form>
  );
}
