import type { AnimalType } from "@/types";

// Temporary placeholder art. Real sprites will live in public/assets/characters/<animal>/.
const PLACEHOLDER: Record<AnimalType, { glyph: string; bg: string }> = {
  cat: { glyph: "🐱", bg: "bg-terracotta" },
  rabbit: { glyph: "🐰", bg: "bg-beige" },
  penguin: { glyph: "🐧", bg: "bg-mist" },
  bear: { glyph: "🐻", bg: "bg-bark" },
  hedgehog: { glyph: "🦔", bg: "bg-olive" },
};

export const ANIMALS = Object.keys(PLACEHOLDER) as AnimalType[];

export function AnimalAvatar({
  animal,
  size = "md",
}: {
  animal: AnimalType;
  size?: "sm" | "md" | "lg";
}) {
  const { glyph, bg } = PLACEHOLDER[animal];
  const dims = { sm: "h-7 w-7 text-base", md: "h-10 w-10 text-xl", lg: "h-20 w-20 text-4xl" }[size];
  return (
    <span
      className={`${bg} ${dims} inline-flex shrink-0 items-center justify-center rounded-md border-2 border-bark`}
      aria-label={animal}
    >
      {glyph}
    </span>
  );
}
