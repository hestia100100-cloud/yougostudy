"use client";

import { useState } from "react";
import { ANIMALS, AnimalAvatar } from "@/components/profile/AnimalAvatar";
import type { AnimalType } from "@/types";

export function WelcomeScreen({
  status,
  error,
  onSubmit,
}: {
  status: "loading" | "unconfigured" | "needs-profile" | "ready" | "error";
  error: string | null;
  onSubmit: (fields: { username: string; animal: AnimalType }) => Promise<void>;
}) {
  const [username, setUsername] = useState("");
  const [animal, setAnimal] = useState<AnimalType>("cat");
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest px-4 py-10">
      <div className="w-full max-w-md rounded-xl border-2 border-bark bg-paper p-6 shadow-[6px_6px_0_#2e241d]">
        <h1 className="text-3xl font-bold text-forest">yougostudy</h1>
        <p className="mt-1 text-sm text-bark/80">A little space to focus together.</p>

        {status === "loading" && <p className="mt-8 text-sm">Loading…</p>}

        {status === "unconfigured" && (
          <p className="mt-8 rounded-md bg-beige p-3 text-sm">
            The backend isn&apos;t connected yet. Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (see README).
          </p>
        )}

        {status === "error" && (
          <p className="mt-8 rounded-md bg-beige p-3 text-sm">
            Couldn&apos;t reach the server. Please refresh. <span className="block text-xs opacity-70">{error}</span>
          </p>
        )}

        {status === "needs-profile" && (
          <form
            className="mt-8 space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setSubmitError(null);
              try {
                await onSubmit({ username, animal });
              } catch (err) {
                setSubmitError(err instanceof Error ? err.message : "Something went wrong");
                setBusy(false);
              }
            }}
          >
            <label className="block">
              <span className="text-sm font-semibold text-forest">What should friends call you?</span>
              <input
                required
                maxLength={20}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nickname"
                className="mt-1 w-full rounded-md border-2 border-bark/40 bg-white px-3 py-2"
              />
            </label>
            <div>
              <span className="text-sm font-semibold text-forest">Pick your animal</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {ANIMALS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAnimal(a)}
                    className={`flex flex-col items-center gap-1 rounded-lg border-2 p-2 text-xs capitalize ${
                      a === animal ? "border-terracotta bg-white" : "border-transparent hover:border-bark/30"
                    }`}
                  >
                    <AnimalAvatar animal={a} />
                    {a}
                  </button>
                ))}
              </div>
            </div>
            {submitError && <p className="text-sm text-terracotta">{submitError}</p>}
            <button
              disabled={busy || !username.trim()}
              className="w-full rounded-md border-2 border-bark bg-terracotta py-2 font-semibold text-paper disabled:opacity-60"
            >
              {busy ? "Entering…" : "Enter the lobby"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
