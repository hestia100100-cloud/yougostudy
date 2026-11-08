// Real asset files to load. Anything not listed falls back to a generated placeholder.
//
// To add final art, drop files into public/assets/ and list them here with the
// matching key from keys.ts, e.g.
//   { key: BACKGROUND_KEY, url: "/assets/backgrounds/study-room.webp" }
//   { key: furnitureKey("desk"), url: "/assets/furniture/desk.png" }
//   { key: frameKey(animWalk("cat", "down"), 0), url: "/assets/characters/cat/walk-down-0.png" }

export interface ImageAsset {
  key: string;
  url: string;
}

export const IMAGE_ASSETS: ImageAsset[] = [];
