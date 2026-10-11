# Maintenance Log — FreeBrain

Track non-urgent cleanup / tech-debt here. Do not fix during feature work — fix once stable on `advisorupdates`.

How to use:
- Add new item at bottom under `Pending` with date + branch found on.
- Move to `Resolved` with date + commit hash when fixed.
- One item = one cleanup, keep atomic.

---

## Pending

### 1. [2026-10-08, branch `advisorupdates`] Review root cruft — leave alone until stable
Files (all currently tracked in git, confirmed via `git ls-files`):
- `bun.lock` (149K) — repo also has `package-lock.json`. `README.md` says do not track `package-lock.json`. Pick one package manager (npm, since no Docker). Do NOT delete yet — verify which lockfile `npm install` actually uses first.
- `codemirror6-0.txt` (2.2K)
- `k4ldCNKtU8U4ZdVjPoMv.css` (17K) — stray CSS in root, not in `src/`.
- `manifest.json` (14K) — GoHighLevel / LeadConnector federated-app dump, looks unrelated to Vite build.

Why parked: removing tracked files could break build/deploy. No regression risk taken during feature work.

To resolve later:
1. `grep -r "manifest.json\|k4ldCNKtU8U4ZdVjPoMv\|codemirror" --include="*.ts" --include="*.tsx" --include="*.html" --include="*.config.*“ src index.html vite.config.ts` — if no hits, safe to untrack.
2. Decide lockfile: `rm bun.lock` if npm-only, or `rm package-lock.json` if bun-only, then `npm install` + `npm run build` to verify.
3. `git rm --cached <file>` (keeps local copy, removes from git) + add to `.gitignore` if generated.
4. Verify: `npm run build`, `npx tsc --noEmit`, `git status -sb` clean.

Status: PARKED

### 2. [2026-10-09, branch `advisorupdates`] Compress `public/founder_drum.jpg` (4.2MB)
The drumming photo is ~40x heavier than the other founder photos and loads on the Team page. Resize to max 1600px wide + export JPG quality ~70 (target <300KB) with any image tool, keeping the same filename so no code change is needed.

Status: PARKED

### 3. [2026-10-09, branch `advisorupdates`] Compress `public/disneydesignsprint.png` (1.4MB)
Team hero background wash behind an 85% blue overlay. Export as JPG quality ~70, max 2000px wide (target <300KB), keeping the same filename so no code change is needed.

Status: PARKED

### 4. [2026-10-09, branch `advisorupdates`] Compress `public/smoothbluebkgrnd_nobkgrnd.png` (284KB) + `public/aigenwebsumitvision.jpeg` (2.6MB)
The header logo loads on every page and the summit art is the home hero — resize logo to ~256px + JPG ~70, summit art to 2000px + JPG ~70, same filenames so no code change is needed. (`smoothbluebkgrnd.png` 983KB is now the favicon — shrink a copy to 64px PNG for the tab icon and point index.html at it instead.)

Status: PARKED

---

## Resolved

(none yet)
