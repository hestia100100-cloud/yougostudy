# yougostudy — Product Spec (condensed)

Condensed from the v1.0 PRD. Source of truth for scope decisions.

## Concept
Friends enter shared 2D virtual rooms as animal avatars, move around, sit at desks, study together and chat by text. No camera or microphone. It should feel like a small multiplayer indie game, not a video call.

## Sections
- **Lobby** — online users + avatars, lobby chat, access to public/private rooms, create room, own profile.
- **Public Rooms** — browse (name, description, creator, online count, created time, status), join without password, create.
- **Private Rooms** — create with name + password, join with password. Passwords hashed, verified server-side; unauthorized users get no room data or chat.
- **Study Room** — wide horizontal 2D world, avatars, interactive furniture, realtime sync, room chat (collapsible, right side), member list, toolbar (focus timer, to-do, chat toggle, members, settings, leave).
- **Profile** — username, animal choice, online status, preferences.

## Game system (Phaser)
- World wider than the viewport; zones: Reading, Working, Coffee Corner, Lounge, Quiet Corner (visual only, not movement-restricted).
- Per-client camera follows own avatar horizontally, clamped to world bounds. Positions stored in world coordinates.
- Movement: press-and-hold left mouse on own avatar, drag, release. Can't drag others. Respect furniture collision and world bounds. Remote avatars interpolated smoothly.
- Furniture: chair/desk/sofa/coffee/bookshelf/lounge chair. Sitting snaps avatar to seat and switches animation; user can stand up.
- States: idle, walking, sitting, reading, working, sleeping, break — visible to others.

## Assets
- Animals: cat, rabbit, penguin, bear, hedgehog — distinct silhouettes, not recolors.
- Transparent PNG/WebP, consistent size/scale/outline/perspective. 4-direction walk; back view OK for up.
- Background is a separate image with no characters/UI. Collision areas and seat positions defined in data, not baked in.
- Art direction: distinctive indie 2D illustration, clear shapes, outlines, muted earth tones, contrast; avoid generic AI cozy-café look.
- Palette: olive #667653, forest #3F5141, terracotta #B66D4B, beige #D8C6A5, dark brown #594638, muted blue #778B96, off-white #F2EDE3.

## Multiplayer & chat (Supabase)
- Presence: join/leave, avatar, world position, state, sitting.
- Local update immediately → throttled broadcast → interpolate on remotes.
- Rooms fully isolated (presence, positions, chat, settings).
- Chats: lobby, public room, private room. Username, avatar, timestamp, emoji, system messages.

## Productivity (after core works)
Personal Pomodoro (25/5/15, not synced across room), personal to-do list, focus status reflected in avatar.

## Stack
Next.js + React + TypeScript + Tailwind · Phaser · Supabase (auth, Postgres, Realtime Presence/Broadcast) · GitHub + Vercel.

## Roadmap
1. **Foundation** — Next.js/TS/Tailwind, structure, Lobby, room pages. ✅
2. **Single-player room** — Phaser, background, one avatar, drag movement, 4-dir animations, camera, bounds, furniture, sitting.
3. **Multiplayer** — Supabase auth, membership, presence, position/state sync, disconnects.
4. **Communication** — lobby/room chat, private room password verification, invitations, member lists.
5. **Productivity** — timer, to-do, focus status, profile.
6. **Polish** — final art, animations, UI, sound, performance.

## MVP
Lobby; public/private room creation; scrolling room; ≥1 playable animal; drag movement; 4-dir walk; sitting; realtime avatar sync; room chat. No cosmetics/achievements/themes before core works.

## Dev rules
Incremental by phase; explain architecture before building and files after; test before moving on; meaningful commits; placeholder assets OK; never bake characters into backgrounds; all art swappable without changing game logic; ask before major architectural changes.
