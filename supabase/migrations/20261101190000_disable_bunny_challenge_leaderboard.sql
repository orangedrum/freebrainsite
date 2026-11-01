drop policy if exists "Anyone can view Bunny Challenge scores"
  on public.bunny_challenge_scores;

drop policy if exists "Anyone can submit valid Bunny Challenge scores"
  on public.bunny_challenge_scores;

revoke all on table public.bunny_challenge_scores
  from PUBLIC, anon, authenticated;

revoke select (initials, elapsed_ms) on table public.bunny_challenge_scores
  from anon, authenticated;

revoke insert (initials, elapsed_ms) on table public.bunny_challenge_scores
  from anon, authenticated;
