"use client";

import { useState } from "react";
import { AnimalAvatar } from "@/components/profile/AnimalAvatar";
import { currentUser } from "@/lib/mock-data";
import type { ChatMessage } from "@/types";

// Local-only chat UI. Messages are not sent anywhere until Supabase Realtime
// is connected (Phase 4); the component API is designed to stay the same.
export function ChatPanel({ title, initialMessages = [] }: { title: string; initialMessages?: ChatMessage[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        senderId: currentUser.id,
        senderName: currentUser.username,
        senderAnimal: currentUser.animal,
        text,
        sentAt: new Date().toISOString(),
      },
    ]);
    setDraft("");
  }

  return (
    <section className="flex h-96 flex-col rounded-lg border-2 border-bark bg-white/60">
      <h2 className="border-b-2 border-bark/15 px-4 py-2 text-sm font-semibold text-forest">{title}</h2>
      <ol className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
        {messages.map((m) =>
          m.senderId === null ? (
            <li key={m.id} className="text-center text-xs italic text-bark/60">
              {m.text}
            </li>
          ) : (
            <li key={m.id} className="flex gap-2">
              {m.senderAnimal && <AnimalAvatar animal={m.senderAnimal} size="sm" />}
              <div className="min-w-0">
                <div className="text-xs">
                  <span className="font-semibold">{m.senderName}</span>{" "}
                  <time className="text-bark/50">
                    {new Date(m.sentAt).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}
                  </time>
                </div>
                <p className="break-words">{m.text}</p>
              </div>
            </li>
          ),
        )}
      </ol>
      <form onSubmit={send} className="flex gap-2 border-t-2 border-bark/15 p-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Say hi 👋"
          className="min-w-0 flex-1 rounded-md bg-paper px-3 py-1.5 text-sm"
        />
        <button className="rounded-md bg-forest px-3 py-1.5 text-sm font-semibold text-paper">Send</button>
      </form>
    </section>
  );
}
