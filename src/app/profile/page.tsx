"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ANIMALS, AnimalAvatar } from "@/components/profile/AnimalAvatar";
import { currentUser } from "@/lib/mock-data";
import type { AnimalType } from "@/types";

export default function ProfilePage() {
  // Local state only; saved to the user's Supabase profile in Phase 3.
  const [animal, setAnimal] = useState<AnimalType>(currentUser.animal);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-6 md:px-8 md:py-8">
      <PageHeader title="Profile" />

      <section className="flex items-center gap-5">
        <AnimalAvatar animal={animal} size="lg" />
        <div>
          <div className="text-xl font-bold text-forest">{currentUser.username}</div>
          <div className="text-sm text-olive">● online</div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-olive">Choose your animal</h2>
        <div className="flex flex-wrap gap-3">
          {ANIMALS.map((a) => (
            <button
              key={a}
              onClick={() => setAnimal(a)}
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
    </div>
  );
}
