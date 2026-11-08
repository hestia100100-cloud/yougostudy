# yougostudy

A little space to focus together — a multiplayer 2D virtual study & co-working room.

## Status

**Phase 1 — Project foundation** ✅

- Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4
- App shell with sidebar navigation
- Lobby (online users, room list, local-only chat), Public / Private / My Rooms, Profile
- Placeholder study room page at `/rooms/[roomId]`
- All data is mock data from `src/lib/mock-data.ts` until Supabase is connected (Phase 3)

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
