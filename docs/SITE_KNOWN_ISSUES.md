# FreeBrain — Known Issues & Behavior Notes (for AI agents)

> Where the site's **actual behavior deviates from apparent intent**, plus open bugs.
> Read with `docs/SITE_FEATURES.md`. Verify before fixing — some entries may be fixed already.
> Last verified against code: 2026-11-03.

## Functional bugs

1. **Movement Planner output ignores inputs.** `generateMovementPlan()` only sets a flag; the
   rendered `MovementRecipeTable` is static (3/5/2 min, daily). Selected mobility/focus change
   nothing. The generated `recipe` string is never displayed.
2. **Planner → Finder state handoff is broken.** Planner sends `{ state: { mobility, focus } }`;
   Movements reads `location.state?.condition` and `location.state?.mobility`. So `focus` is
   dropped, `condition` is never sent, and the condition filter never affects results.
3. **Condition filter does not filter.** `/movements` condition combobox only sets local state;
   results depend solely on mobility + time.
4. **Results capped at 1.** Finder `.slice(0, 1)` — users see at most one movement card.
5. **"Get Involved" header button silently fails on 5 routes.** `scrollToSection("get-involved")`
   but that anchor only exists on `/` and `/team` (not planner, movements, bunny, lisbon, terms).
6. **Dead links:** MovementPlanner disclaimer "full disclaimer" is `href="#"` with
   `preventDefault()`; Movements `ResearchCitation` → `#movement-research` (verify anchor exists).
7. ~~**`terms-and-privacy` renders raw i18n keys**~~ ✅ **resolved 2026-11-03 (P3):** the old page
   and its `termsPrivacy.*` keys (incl. the never-existing `leaderboard*`) were deleted; the route
   now redirects to the new `/terms` page.

## i18n sync gaps (rule: 4 locales in sync)

8. `movements.faq.q7–q10` / `a7–a10` **missing in es, de, pt** → raw keys render in
   FAQ accordion + FAQPage JSON-LD for those languages.
9. `movementPlanner.resultsBodyPart4` and `resultsBodyBold3` **missing in de** → `SegmentedBody
   parts={10}` shows raw keys in German.
10. `ErrorBoundary` fallback strings are hard-coded English (violates the `t()` rule).
11. `public/sitemap.xml` hreflang uses `?lang=es|de|pt` but the app **never reads a `lang` query
    param** — sitemap language URLs and the language detector disagree.

## Dead / unused code (do not resurrect without reason)

- `src/components/NavLink.tsx` — unused.
- React Query provider (mounted, zero queries), Sonner + radix Toaster (mounted, zero `toast()`).
- `FOCUS_OPTIONS`, `useNavigate`/`navigate` imports in `Movements.tsx` — unused.
- `react-hook-form`, `zod` — installed, unused in app code.
- Supabase: leaderboard **created then disabled** (2nd migration drops policies/revokes grants).
  No client library in `package.json`. Do not add leaderboard UI without re-enabling RLS first.
- Root cruft (see `MAINTENANCE.md`): `manifest.json`, `k4ldCNKtU8U4ZdVjPoMv.css`,
  `codemirror6-0.txt` (GoHighLevel leftovers); both `bun.lock` and `package-lock.json` tracked.

## Deliberate design decisions (not bugs)

- **Browser-based checks of Helmet SEO meta fail in this agent environment** — the OpenCode
  browser window is hidden, so `requestAnimationFrame` never fires and Helmet (default
  `defer: true`) never commits to `<head>`. Not a site bug: `src/test/helmetSeo.test.tsx`
  proves title/description/canonical commit correctly when a frame runs. Verify meta via that
  test, not via browser DOM checks. (The same hidden window is why screenshots throw
  `UnknownVizError`.)

- **Social feed cards are static** — likes/comments are constants, no live API.
- **All movement videos are `/tangoworkshop.mp4`** — placeholder per `docs/growth-strategy.md`.
- **Bunny recording is local-only** — no upload by design; terms copy states this explicitly.
- **Leaderboard is disabled** — "nixed leaderboard" commits; server-side RLS revoked.
- **`FaqJsonLd` sits outside the page `<Helmet>`** — required: react-helmet-async forbids custom
  components inside `<Helmet>`; nesting crashes pages to the ErrorBoundary (fixed once already).
- **`space-y-4` specificity trap** — keep top-fold content in its own `space-y-4` div; lower
  sections are siblings outside it with explicit `mt-[50px]` (otherwise the
  `> :not([hidden]) ~ :not([hidden])` selector overrides margins).

## Planned work (in progress — check git status before duplicating)

- **Pilot signup consolidation** (prompts captured by stakeholder): ✅ **P2 done** — master terms
  (`terms/master-terms.md` v1.0 + `terms/REVIEW-NOTES.md`, stakeholder decisions applied:
  gift/scheduling/unused-session rules, Web Summit date-gated, USA-first flexible governing law);
  ✅ **P3 done** — published at `/terms` (translatable `terms` namespace, footer link, old URL
  redirected); ✅ **P4 implemented** — `POST /api/pilot-signup` validates and emails the record and
  confirmation through Resend; ✅ **P5/P6 implemented** — localized form embedded in the Lisbon
  page's former WhatsApp CTA section, with the Terms/tango/media/branding consent flow. Use
  `/lisbon-pilot?program=tango` for Tango signup; the base page shows the general form. The local
  Vite API adapter now runs the same handler; real email delivery and the end-to-end funnel remain
  for P7 Preview QA. P8 git/deployment is user-managed.
- **SEO Phase 1** (may be uncommitted): per-page Helmet meta, sitemap/robots, FAQ/WebApplication
  JSON-LD.
- ~~`jean@freethebrains.com` mailbox~~ ✅ resolved 2026-11-03 (`MAINTENANCE.md` R1 — Zoho
  MX/SPF/DKIM verified; inbound + outbound working).
