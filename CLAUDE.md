# yougostudy — notes for Claude

- Read `docs/PRODUCT_SPEC.md` first; work phase by phase per its roadmap.
- Keep React UI (`src/app`, `src/components`) separate from Phaser game code (`src/game`).
- Until Supabase is wired up, data comes from `src/lib/mock-data.ts`.
- Colors are Tailwind theme tokens in `src/app/globals.css` (`olive`, `forest`, `terracotta`, `beige`, `bark`, `mist`, `paper`).
- Before committing: `npm run lint && npm run build`.
- Communicate with the user in Traditional Chinese.
