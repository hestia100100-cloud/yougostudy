-- yougostudy · Phase 3 schema
-- Run once in the Supabase dashboard: SQL Editor → New query → paste → Run.

-- ── Profiles ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null check (char_length(trim(username)) between 1 and 20),
  animal text not null default 'cat'
    check (animal in ('cat', 'rabbit', 'penguin', 'bear', 'hedgehog')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Signed-in users can read profiles"
  on public.profiles for select to authenticated using (true);

create policy "Users create their own profile"
  on public.profiles for insert to authenticated with check (id = auth.uid());

create policy "Users update their own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- ── Rooms ───────────────────────────────────────────────────────────────────
-- Private rooms (password hashes kept in a separate, non-readable table) arrive in Phase 4.
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 40),
  description text not null default '' check (char_length(description) <= 140),
  visibility text not null default 'public' check (visibility in ('public', 'private')),
  creator_id uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

create index if not exists rooms_created_at_idx on public.rooms (created_at desc);

alter table public.rooms enable row level security;

create policy "Public rooms are visible to signed-in users"
  on public.rooms for select to authenticated
  using (visibility = 'public' or creator_id = auth.uid());

create policy "Users create public rooms as themselves"
  on public.rooms for insert to authenticated
  with check (creator_id = auth.uid() and visibility = 'public');

create policy "Creators update their rooms"
  on public.rooms for update to authenticated
  using (creator_id = auth.uid()) with check (creator_id = auth.uid() and visibility = 'public');

create policy "Creators delete their rooms"
  on public.rooms for delete to authenticated using (creator_id = auth.uid());

-- Starter rooms so the lobby isn't empty.
insert into public.rooms (name, description, creator_id)
select * from (values
  ('Morning Library', 'Quiet reading, cameras off, minds on.', null::uuid),
  ('Exam Week Grind', '50/10 pomodoros until finals are over.', null::uuid),
  ('Night Owls', 'For people who work best after midnight.', null::uuid)
) as seed(name, description, creator_id)
where not exists (select 1 from public.rooms);
