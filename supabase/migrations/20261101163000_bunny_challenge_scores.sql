create table if not exists public.bunny_challenge_scores (
  id uuid primary key default gen_random_uuid(),
  initials text not null check (initials ~ '^[A-Z]{1,3}$'),
  elapsed_ms integer not null check (elapsed_ms between 1 and 86400000),
  created_at timestamptz not null default now()
);

create index if not exists bunny_challenge_scores_elapsed_ms_idx
  on public.bunny_challenge_scores (elapsed_ms);

alter table public.bunny_challenge_scores enable row level security;

revoke all on table public.bunny_challenge_scores from PUBLIC, anon, authenticated;
grant select (initials, elapsed_ms) on table public.bunny_challenge_scores to anon;
grant insert (initials, elapsed_ms) on table public.bunny_challenge_scores to anon;

drop policy if exists "Anyone can view Bunny Challenge scores"
  on public.bunny_challenge_scores;
create policy "Anyone can view Bunny Challenge scores"
  on public.bunny_challenge_scores
  for select
  to anon
  using (true);

drop policy if exists "Anyone can submit valid Bunny Challenge scores"
  on public.bunny_challenge_scores;
create policy "Anyone can submit valid Bunny Challenge scores"
  on public.bunny_challenge_scores
  for insert
  to anon
  with check (
    initials ~ '^[A-Z]{1,3}$'
    and elapsed_ms between 1 and 86400000
  );
