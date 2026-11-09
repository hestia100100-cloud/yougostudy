"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { PageHeader } from "@/components/layout/PageHeader";
import { ANIMALS, AnimalAvatar } from "@/components/profile/AnimalAvatar";
import type { AnimalType } from "@/types";

export default function ProfilePage() {
  const { profile, updateProfile } = useAuth();
  const [username, setUsername] = useState(profile.username);
  const [animal, setAnimal] = useState<AnimalType>(profile.animal);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | string>("idle");

  const dirty = username.trim() !== profile.username || animal !== profile.animal;

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-6 md:px-8 md:py-8">
      <PageHeader title="Profile" />

      <form
        className="space-y-8"
        onSubmit={async (e) => {
          e.preventDefault();
          setStatus("saving");
          try {
            await updateProfile({ username, animal });
            setStatus("saved");
          } catch (err) {
            setStatus(err instanceof Error ? err.message : "Couldn't save");
          }
        }}
      >
        <section className="flex items-center gap-5">
          <AnimalAvatar animal={animal} size="lg" />
          <div className="space-y-1">
            <input
              required
              maxLength={20}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setStatus("idle");
              }}
              className="w-56 rounded-md border-2 border-bark/40 bg-white px-3 py-1.5 text-lg font-bold text-forest"
            />
            <div className="text-sm text-olive">● online</div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-olive">Choose your animal</h2>
          <div className="flex flex-wrap gap-3">
            {ANIMALS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => {
                  setAnimal(a);
                  setStatus("idle");
                }}
                className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-xs capitalize ${
                  a === animal ? "border-terracotta bg-white" : "border-transparent hover:border-bark/30"
                }`}
              >
                <AnimalAvatar animal={a} />
                {a}
              </button>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            disabled={!dirty || status === "saving"}
            className="rounded-md border-2 border-bark bg-terracotta px-4 py-2 text-sm font-semibold text-paper disabled:opacity-50"
          >
            {status === "saving" ? "Saving…" : "Save"}
          </button>
          {status === "saved" && <span className="text-sm text-olive">Saved ✓</span>}
          {!["idle", "saving", "saved"].includes(status) && <span className="text-sm text-terracotta">{status}</span>}
        </div>
      </form>
    </div>
  );
}
