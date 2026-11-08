# yougostudy

A little space to focus together — a multiplayer 2D virtual study & co-working room.

## Status

**Phase 1 — Project foundation** ✅

- Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4
- App shell with sidebar navigation
- Lobby (online users, room list, local-only chat), Public / Private / My Rooms, Profile
- Placeholder study room page at `/rooms/[roomId]`
- All data is mock data from `src/lib/mock-data.ts` until Supabase is connected (Phase 3)

**Phase 2 — Single-player study room** ✅

- Phaser 3 world (3200 × 720) with five visual zones, mounted at `/rooms/[roomId]`
- Press-and-hold your avatar and drag to walk; 4-direction walk animations; furniture collision; world bounds
- Per-client follow camera with horizontal scrolling, clamped to the world edges
- Click a chair / sofa / bench to sit (working, reading, resting…), click a bookshelf or the coffee counter for a standing activity; "Stand up" in the toolbar or just drag your avatar again
- All art is generated placeholder art — see "Replacing art" below

See [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md) for the roadmap.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open http://localhost:3000 (it redirects to `/lobby`).

Other scripts:

```bash
npm run lint    # ESLint
npm run build   # production build
npm start       # serve the production build
```

## Project structure

```text
public/assets/        # backgrounds, characters/<animal>, furniture, objects, ui (placeholders for now)
src/app/              # routes: lobby, rooms/{public,private,mine,[roomId]}, profile
src/components/       # React UI: layout, chat, rooms, profile
src/game/             # Phaser game code (Phase 2+): scenes, characters, movement, furniture, camera, multiplayer
src/lib/              # supabase client (Phase 3), utils, mock data
src/types/            # shared TypeScript types
docs/                 # product spec
```

React owns navigation, lists, chat and settings; Phaser will own the game world.
The two are kept separate.

## Game code (`src/game/`)

| Path | Role |
|---|---|
| `createGame.ts` | Boots Phaser (loaded lazily by `components/room/GameCanvas.tsx`) |
| `events.ts` | Typed event bus between React and the game |
| `config/world.ts` | World size, walkable area, zones, speeds |
| `furniture/layout.ts` | Furniture positions, collision footprints and seats (pure data) |
| `movement/movement.ts` | Pure movement + collision math |
| `movement/DragController.ts` | Press-hold-drag input for the local avatar |
| `characters/Avatar.ts` | Avatar rendering & state (no input — reusable for remote players) |
| `camera/followCamera.ts` | Horizontal follow camera |
| `scenes/StudyRoomScene.ts` | Wires everything together, handles furniture interaction |
| `assets/` | Texture/animation key contract, asset manifest, placeholder generators |

## Replacing art

Game logic only references texture keys defined in `src/game/assets/keys.ts`.
To use final art, put files in `public/assets/…` and list them in
`src/game/assets/manifest.ts` under the same keys. Any key without a real file
falls back to a generated placeholder, so art can be replaced piece by piece.
Furniture collision and seat positions live in `furniture/layout.ts`, not in the images.
