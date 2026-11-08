// World dimensions are in world pixels. All positions (local or networked)
// use these coordinates; the camera is derived from them per client.

export const WORLD_WIDTH = 3200;
export const WORLD_HEIGHT = 720;

/** y where the back wall meets the floor. */
export const WALL_BOTTOM = 300;

/** Area an avatar's feet may occupy. */
export const WALKABLE = {
  minX: 30,
  maxX: WORLD_WIDTH - 30,
  minY: WALL_BOTTOM + 40,
  maxY: WORLD_HEIGHT - 12,
};

export interface Zone {
  id: "reading" | "working" | "coffee" | "lounge" | "quiet";
  name: string;
  fromX: number;
  toX: number;
}

// Visual zones only — movement is never restricted by zone.
export const ZONES: Zone[] = [
  { id: "reading", name: "Reading Area", fromX: 0, toX: 700 },
  { id: "working", name: "Working Area", fromX: 700, toX: 1500 },
  { id: "coffee", name: "Coffee Corner", fromX: 1500, toX: 2050 },
  { id: "lounge", name: "Lounge", fromX: 2050, toX: 2650 },
  { id: "quiet", name: "Quiet Corner", fromX: 2650, toX: WORLD_WIDTH },
];

export const SPAWN_POINT = { x: 560, y: 470 };

/** Max distance (world px) between avatar and a seat/object to interact with it. */
export const INTERACT_RADIUS = 150;

/** Walking speed in world px per second. */
export const WALK_SPEED = 260;
