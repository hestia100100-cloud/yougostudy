// Furniture placement, collision footprints and seat positions for the study room.
// Defined as data, independent of the background image, so art can be swapped freely.
import type { CharacterState } from "@/types";

export type FurnitureKind =
  | "bookshelf"
  | "desk"
  | "desk-chair"
  | "armchair"
  | "side-table"
  | "coffee-counter"
  | "cafe-table"
  | "cafe-chair"
  | "sofa"
  | "coffee-table"
  | "lounge-chair"
  | "bench"
  | "rug"
  | "floor-lamp";

export interface SeatDef {
  id: string;
  /** Avatar foot position when seated. Also used as its depth. */
  x: number;
  y: number;
  state: CharacterState;
  /** Where the avatar stands when leaving the seat. */
  exit: { x: number; y: number };
  /** Render depth while seated; defaults to y. Set above the chair's y to draw in front of it. */
  depth?: number;
}

export interface FurnitureDef {
  id: string;
  kind: FurnitureKind;
  /** Bottom-centre anchor in world coordinates. Depth sorts by y. */
  x: number;
  y: number;
  /** Solid footprint centred on (x, y - h/2). Omit for walk-through furniture. */
  blocker?: { w: number; h: number };
  /** Seats this piece gives access to (a desk and its chair share one seat). */
  seatIds?: string[];
  /** A standing activity, e.g. browsing a bookshelf. */
  action?: { state: CharacterState; label: string };
  /** Render beneath everything else (rugs). */
  flat?: boolean;
}

export const FURNITURE_LABELS: Record<FurnitureKind, string> = {
  bookshelf: "Bookshelf",
  desk: "Study desk",
  "desk-chair": "Study chair",
  armchair: "Armchair",
  "side-table": "Side table",
  "coffee-counter": "Coffee counter",
  "cafe-table": "Café table",
  "cafe-chair": "Café chair",
  sofa: "Sofa",
  "coffee-table": "Coffee table",
  "lounge-chair": "Lounge chair",
  bench: "Window bench",
  rug: "Rug",
  "floor-lamp": "Lamp",
};

export const ACTIVITY_LABELS: Partial<Record<CharacterState, string>> = {
  sitting: "Sitting",
  working: "Working",
  reading: "Reading",
  break: "Taking a break",
  sleeping: "Resting",
};

const seats: SeatDef[] = [];
const furniture: FurnitureDef[] = [];

function seat(id: string, x: number, y: number, state: CharacterState, exit: { x: number; y: number }, depth?: number) {
  seats.push({ id, x, y, state, exit, depth });
  return id;
}

/** Chair behind a desk, so the seated avatar faces the viewer and the desk covers its lap. */
function workstation(id: string, x: number, chairY: number) {
  // Seat sits slightly above the chair's base so the torso clears the desk top.
  const s = seat(`${id}-seat`, x, chairY - 12, "working", { x: x + 100, y: chairY + 10 }, chairY + 1);
  furniture.push({ id: `${id}-chair`, kind: "desk-chair", x, y: chairY, seatIds: [s] });
  furniture.push({ id: `${id}-desk`, kind: "desk", x, y: chairY + 40, blocker: { w: 150, h: 22 }, seatIds: [s] });
}

// — Reading Area —
furniture.push({ id: "reading-rug", kind: "rug", x: 300, y: 640, flat: true });
for (const [i, x] of [110, 240, 370].entries()) {
  furniture.push({
    id: `shelf-${i}`,
    kind: "bookshelf",
    x,
    y: 345,
    blocker: { w: 104, h: 26 },
    action: { state: "reading", label: "Browse books" },
  });
}
furniture.push({ id: "armchair-a", kind: "armchair", x: 180, y: 520, seatIds: [seat("armchair-a", 180, 512, "reading", { x: 180, y: 570 }, 521)] });
furniture.push({ id: "armchair-b", kind: "armchair", x: 440, y: 600, seatIds: [seat("armchair-b", 440, 592, "reading", { x: 440, y: 650 }, 601)] });
furniture.push({ id: "side-table-a", kind: "side-table", x: 310, y: 560, blocker: { w: 56, h: 18 } });

// — Working Area —
for (const [i, x] of [860, 1090, 1320].entries()) {
  workstation(`desk-r1-${i}`, x, 440);
  workstation(`desk-r2-${i}`, x, 590);
}

// — Coffee Corner —
furniture.push({
  id: "coffee-counter",
  kind: "coffee-counter",
  x: 1730,
  y: 370,
  blocker: { w: 230, h: 30 },
  action: { state: "break", label: "Grab a coffee" },
});
for (const [i, [tx, ty]] of [[1640, 560], [1890, 620]].entries()) {
  furniture.push({ id: `cafe-table-${i}`, kind: "cafe-table", x: tx, y: ty, blocker: { w: 60, h: 18 } });
  for (const side of [-1, 1]) {
    const cx = tx + side * 58;
    const sid = seat(`cafe-${i}-${side}`, cx, ty + 2, "break", { x: cx + side * 40, y: ty + 30 });
    furniture.push({ id: `cafe-chair-${i}-${side}`, kind: "cafe-chair", x: cx, y: ty, seatIds: [sid] });
  }
}

// — Lounge —
furniture.push({ id: "lounge-rug", kind: "rug", x: 2350, y: 620, flat: true });
furniture.push({
  id: "sofa",
  kind: "sofa",
  x: 2350,
  y: 450,
  blocker: { w: 210, h: 20 },
  seatIds: [
    seat("sofa-l", 2305, 444, "sleeping", { x: 2305, y: 500 }, 451),
    seat("sofa-r", 2395, 444, "sleeping", { x: 2395, y: 500 }, 451),
  ],
});
furniture.push({ id: "coffee-table", kind: "coffee-table", x: 2350, y: 560, blocker: { w: 120, h: 22 } });
furniture.push({ id: "lounge-chair-a", kind: "lounge-chair", x: 2170, y: 620, seatIds: [seat("lounge-a", 2170, 612, "break", { x: 2170, y: 670 }, 621)] });
furniture.push({ id: "lounge-chair-b", kind: "lounge-chair", x: 2530, y: 620, seatIds: [seat("lounge-b", 2530, 612, "break", { x: 2530, y: 670 }, 621)] });

// — Quiet Corner —
workstation("quiet-desk", 2810, 440);
furniture.push({ id: "armchair-q", kind: "armchair", x: 3070, y: 480, seatIds: [seat("armchair-q", 3070, 472, "reading", { x: 3070, y: 530 }, 481)] });
furniture.push({ id: "floor-lamp", kind: "floor-lamp", x: 3150, y: 470, blocker: { w: 24, h: 12 } });
furniture.push({
  id: "bench",
  kind: "bench",
  x: 2950,
  y: 650,
  blocker: { w: 160, h: 10 },
  seatIds: [
    seat("bench-l", 2915, 642, "sitting", { x: 2915, y: 600 }, 651),
    seat("bench-r", 2985, 642, "sitting", { x: 2985, y: 600 }, 651),
  ],
});

export const SEATS: ReadonlyMap<string, SeatDef> = new Map(seats.map((s) => [s.id, s]));
export const FURNITURE: readonly FurnitureDef[] = furniture;
