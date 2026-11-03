# FreeBrain — Feature & Functionality Reference (for AI agents)

> Canonical inventory of **what the site is and how it actually works**. Read alongside
> `CLAUDE.md` (rules) and `docs/SITE_KNOWN_ISSUES.md` (where behavior deviates from intent).
> Last verified against code: 2026-11-03.

## Stack & architecture

- React 18 + TypeScript + Vite 5 + Tailwind 3 + shadcn/ui + react-router-dom 6 + react-i18next + react-helmet-async.
- **React SPA + Vercel Functions.** Browser code is under `src/`; the pilot signup endpoint is
  `api/pilot-signup.ts` and its validation/email logic lives in `src/lib/pilotSignup*.ts`.
  `RESEND_API_KEY` is a server-only Vercel environment variable; never expose it through Vite.
- `vercel.json` = SPA rewrite of all paths → `index.html` (deep links work on Vercel).
- App shell: `main.tsx` → `ErrorBoundary` → `HelmetProvider` → `Suspense` → `App.tsx` (`QueryClientProvider` → `TooltipProvider` → Toasters → `BrowserRouter` → `ScrollToTop` → `Routes` → floating `LanguageSwitcher`).
- TanStack Query provider is mounted but **zero queries exist**. `react-hook-form`/`zod` installed but unused in app code.

## Routes (`src/App.tsx`)

| Route | Page | Purpose |
|---|---|---|
| `/` | `pages/Index.tsx` | Marketing home |
| `/team` | `pages/Team.tsx` | Founder + advisors + stats (`/teams` redirects here) |
| `/lisbon-pilot` | `pages/LisbonPilot.tsx` | Lisbon tango-workshop pilot (Parkinson's) |
| `/movement-planner` | `pages/MovementPlanner.tsx` | "10-minute recipe" generator (PD) |
| `/movements` | `pages/Movements.tsx` | Exercise finder / video library |
| `/bunny-challenge` | `pages/BunnyChallenge.tsx` | Coordination game + optional recording |
| `/terms` | `pages/Terms.tsx` + `features/terms/TermsDocument.tsx` | Full master Terms & Services (indexed, anchor-linkable clauses) |
| `/terms-and-privacy` | redirect | `<Navigate to="/terms" replace />` (old URL kept alive) |
| `*` | `pages/NotFound.tsx` | 404 (no Header/Footer, noindex) |

## Pages

### Home (`/`) — slim composition layer, `useModalState`
Sections in order: `HeroSection` → `WebSummitSection` (live countdown to `2026-11-09T09:00:00Z`, shows "LIVE" after) → `ConditionsMarquee` (auto-scroll, 15 conditions) → `#platform` (GridBackground + OnDemand + BecomeFreeBrainer) → `GetInvolvedSection` (`#get-involved`) → `SupportingEvidenceSection` (interactive SVG neural-pathway graph: click node → quote + source) → `SocialFeedsSection` (**static** cards, likes/comments are constants) → `Footer` → shared `Modal`.
CTAs: "Learn more" scrolls to `#platform`; all others dispatch modal variants (below).
SEO: Helmet meta + JSON-LD `Organization` and `WebSite` (`SearchAction` → `/movements?q=`).

### Team (`/team`)
Hero (image bg) → `AdvisorsSection` (Anoop + Martin LinkedIn cards + invite card → advisors Calendly modal) → `FounderSection` (LinkedIn + The Product Shift CTAs) → `TeamStatsSection` (4 count-up stats via `useCountUp`, respects `prefers-reduced-motion`; client logo strip) → `GetInvolvedSection` → `Footer` → `Modal`. Helmet meta, no JSON-LD.

### Lisbon Pilot (`/lisbon-pilot`)
Hero → intro/why → `VideoPlayer` (`/tangoworkshop.mp4`) → 3-step how-it-works → app copy → Web Summit section → 2×2 cards (what we offer / what we ask / safety / CTA).
**Key interaction:** embedded localized signup form; use `/lisbon-pilot?program=tango` for the Tango pilot form, where tango opt-in is visible and unchecked by default and photo/video + branding consents are gated until opt-in. The base URL has the general signup form. Email errors remain in-form and do not display a WhatsApp link. Helmet meta only.

### Movement Planner (`/movement-planner`)
Inputs: mobility Select (`seated|assistedStanding|independent`) + focus Select (`freezingGait|tremor|posturalInstability`) + Generate.
**Actual behavior:** clicking Generate renders the **static** `MovementRecipeTable` (3 min rhythmic warm-up / 5 min dual-task dance / 2 min stretch = 10 min, daily). Selected inputs do **not** change output (see KNOWN_ISSUES). "Try now" navigates to `/movements` with router state.
Other: breadcrumb, dismissible medical `Alert`, `ResearchCitation`, stat chips, `MovementPlannerPromoCard`, `SegmentedBody` copy blocks, `BenefitsOfMovement` (6 cards), 3-step how-to, `ExercisesForCondition`, 14-item `FaqAccordion`.
SEO: Helmet + JSON-LD `WebApplication` (HealthApplication, price 0) + `FaqJsonLd` (14 FAQs).

### Exercise Finder (`/movements`)
Filters: condition combobox (15 conditions — **sets state only, does not filter**), mobility Select (3 levels), time slider (`TIME_OPTIONS = 1|5|15`), "Find my movement".
**Actual behavior:** `MOVEMENTS.filter(mobility === x && minutes <= t).slice(0, 1)` → **at most one result card** (or no-results message). Click card → `Dialog` with `VideoPlayer` + copy. Before search: rotating fun fact (4 s).
Data: static `MOVEMENTS` array (6 entries, all play `/tangoworkshop.mp4`), in `src/features/movements/movementPageData.ts`.
Sections: `MovementPageMeta` (breadcrumb + disclaimer + `ResearchCitation`), promo card, "What is", how-to, benefits, research copy, `ExercisesForCondition` (15 chips, display-only), `MovementByCondition` (15 cards), 10-item FAQ.
SEO: Helmet + JSON-LD `WebApplication` + `FaqJsonLd`.

### Bunny Challenge (`/bunny-challenge`)
Two-hand coordination game: SVG poses (`/handgesture_bunny.svg`, `/handgesture_gun.svg`) swap on an **accelerating beat**; score = elapsed time.
- State machine `useBunnyChallenge`: `intro → countdown → playing → result`; 3 s countdown; `BEAT_INTERVALS_MS` decelerate 5000→1000 ms with inserted 3000 ms beats; timer sampled every 100 ms from `performance.now()`.
- **Recording** (opt-in, default OFF): camera requested only on Go with switch on — `getUserMedia({video, audio:false})` (**no mic**). Composites 540×960 portrait canvas @ ~20 fps (camera + SVGs + logo + overlays) → `captureStream(20)` → `MediaRecorder` 1.5 Mbps (mp4 → webm/vp8 → webm fallbacks). JPEG poster captured on stop. **Everything stays in-browser: no upload, no server.** Full error mapping in `recordingHelpers`.
- **Share** dialog: download `freebrain-bunny-challenge.mp4|webm` + copy caption (`createChallengeCaption` with `{{time}}`/`{{url}}`, `BUNNY_CHALLENGE_URL` constant) via clipboard API.
- Science section: 3 Wikipedia citations ([1] exercise neurobiology, [2] neuroplasticity, [3] BDNF).
- **Leaderboard: disabled.** Supabase table exists as SQL migration only; second migration drops all RLS policies/revokes grants. No Supabase client code in `src/`.
- Tests: Vitest for share helpers, recording support, game hook, recording hook.

### Terms & Services (`/terms`)
Renders the full `terms/master-terms.md` content from the **`terms` i18n namespace** (`src/locales/{lang}/terms.json`): header (version stamp v1.0 / 2026-11-03, provider, contact), on-this-page TOC with hash links, 10 numbered sections / 56 clauses — each clause has a clickable number anchor (`#clause-3-2`), `**bold**` markers rendered as `<strong>`, per-section "Back to top". Indexed (`canonical` → `/terms`, no `noindex`). **Fully translated ×4**: `en/es/de/pt/terms.json` are key-identical (76 leaf keys) and carry the whole clause body; English text governs on divergence (clause 8.4 / D5). Old `/terms-and-privacy` page deleted; its `termsPrivacy.*` keys removed from all 4 locales; Bunny-Challenge intro + footer link to `/terms`. Exports `TERMS_VERSION` / `TERMS_DATE` for P5 acceptance records. **Legal-parity rule:** any feature touching consent/media/branding/data/liability/pilot must update the terms in lockstep or be adjusted to match (see CLAUDE.md).

## Navigation & modals

- **Header** (sticky, blur): logo → `/`; desktop nav = Team · Resources dropdown · Join Community (modal) · Get Involved (scroll `#get-involved`) · **Try Bunny Demo** (`bg-brand` blue CTA → `/bunny-challenge`); mobile hamburger drawer with Resources accordion.
- **ResourcesMenu**: 2 items — `/movement-planner`, `/movements` — desktop dropdown renders **vertical menu cards** (14px non-bold white titles, 12px muted descriptions, rounded border + lighter-blue hover), mobile expandable list.
- **Footer**: brand, "Trusted by" badge, Web Summit badge, Explore (Home · Team · Lisbon Pilot · **Terms** · Get Involved) / Resources columns (Podcast + Resource Center = *Soon*), socials, mobile back-to-top.
- **LanguageSwitcher**: fixed bottom-right globe; 4 languages (🇺🇸 🇲🇽 🇩🇪 🇧🇷).
- **Modal system** (`useModalState` + shared `Modal`): one generic Dialog per page; modal CTAs are external `<a target="_blank">`. Variants: `joinCommunity` (WhatsApp group / mailing list), `joinPilot` (forms.app pilot form), `advisors`/`funding`/`careFacilities`/`designYourApp` (Calendly), default CTA = Calendly.
- **Lisbon pilot signup**: the `/lisbon-pilot` next-step section embeds `features/pilotSignup/PilotSignupForm.tsx`; it submits to `/api/pilot-signup`. `?program=tango` reveals the unchecked tango opt-in and its gated photo/video + branding consents.
- **`EXTERNAL_LINKS`** (`src/lib/constants.ts`): whatsapp group, `jeanWhatsapp` (signup support fallback), calendly, `pilotForm` + `mailingList` (forms.app), productShift, webSummit (with Iterable UTM params), founder/advisor LinkedIn, socials.

## i18n

- 4 languages: `en` (fallback), `es`, `de`, `pt`; namespaces: `translation` (`common.json`), `terms` (`terms.json`, legal page — **fully translated body ×4**, English governs on divergence, see D5), and `pilotSignupEmail` (localized confirmation emails).
- Detection: localStorage → navigator → htmlTag; if no stored choice and browser language unsupported → **geo fallback** via `https://ipapi.co/json/` (5 s timeout; PT/BR→pt, DE/AT→de, ES + LatAm→es).
- **All user-facing strings must use `t()`; all 4 locales stay in sync** (manual rule, no tooling). Current sync gaps listed in `docs/SITE_KNOWN_ISSUES.md`.

## Integrations (complete)

| Service | Usage |
|---|---|
| **Cookiebot** | Only third-party script (`index.html`, auto-blocking) |
| **ipapi.co** | Language geo-fallback |
| **Resend** | `/api/pilot-signup` Web `GET`/`POST` function sends the user confirmation and signed-record email to `jean@freethebrains.com`; uses the existing server-only `RESEND_API_KEY` configured in Vercel |
| **Calendly** | Advisors/funding/care/design modals |
| **WhatsApp** | Community group + fallback contact for a signup delivery issue |
| **forms.app** | Pilot registration + mailing list (external) |
| **filesafe.space CDN** | Videos/images (`assets.cdn.filesafe.space`, `vibe.filesafe.space`) |
| **Supabase** | SQL migrations only — leaderboard created then **disabled**; no client |
| **Social** | Outbound links only (IG/FB/TikTok/LinkedIn) — no embeds |
| **Analytics** | **None** (no GA/Plausible/etc.) |
| Videos | Local `<video>` (`/public/*.mp4`) — no YouTube/Vimeo embeds |

## SEO

- Per-page `react-helmet-async` meta (title/description/canonical/og/twitter) on Index, Team, LisbonPilot, MovementPlanner, Movements, BunnyChallenge; `index.html` carries defaults + `Organization` JSON-LD.
- JSON-LD: `Organization`+`WebSite` (home), `WebApplication`+`FAQPage` (planner, movements), `WebPage`+`FAQPage` (bunny).
- `public/robots.txt` → points to `https://www.freethebrains.com/sitemap.xml`; `public/sitemap.xml` with hreflang alternates.
- ⚠️ `FaqJsonLd` must render as a **sibling after** the page `<Helmet>` (react-helmet-async forbids custom components inside `<Helmet>`; nesting crashes pages to ErrorBoundary).

## Config & deploy

- Scripts: `dev` (port **8080**), `build`, `lint`, `test` (vitest run), `preview`.
- Vite: `@leadconnector/vibe-tagger` dev-only; alias `@ → ./src`.
- Branch flow (user runs all git): **`growthstrat` → `develop` → `stage` → `main`**; Vercel deploys from GitHub.
- Media/localization constants: `src/lib/constants.ts` (`LOGO_URL`, video sources, 15 conditions, evidence data, neural nodes, social feeds).

## Conventions (summary — see CLAUDE.md for full rules)

≤300 lines/file · pages = slim composition layers · sections in `src/features/<feature>/` · shared UI in `src/components/shared/` · no cross-feature imports · never edit `src/components/ui/` · colors only via CSS tokens · all strings via `t()` in 4 synced locales · no dead code/console.log/`any`.
