# REQUIREMENTS — Pilot Signup Flow (Prompt 1: decisions locked)

> **Status:** P1–P6 complete; P7 in progress; P8 pending user-managed git/deployment. **Input:** stakeholder answers 2026-11-03.
> **Supersedes:** off-site paper contract process for the FreeBrain pilot program.
> **Feeds:** P2 (master Terms draft), P3 (terms page), P4 (email pipeline), P5 (form), P6 (Lisbon page swap).

## Prompt tracker

| Prompt | Scope | Status |
|---|---|---|
| P1 | Lock provider, Terms, fields, consent, and signup decisions | ✅ Decisions recorded below |
| P2 | Draft consolidated Terms and review notes | ✅ `terms/master-terms.md` + `terms/REVIEW-NOTES.md` |
| P3 | Publish `/terms`, translate all body text ×4, update site links | ✅ Complete |
| P4 | Resend/Vercel endpoint: participant confirmation + signed-record email | ✅ Implemented and unit-tested |
| P5 | Localized form, validation, Terms and consent flows, success/Calendly state | ✅ Implemented and unit-tested |
| P6 | Replace Lisbon WhatsApp next step with the pilot form and positive program copy | ✅ Implemented; Tango opt-in appears only at `/lisbon-pilot?program=tango` |
| P7 | Real end-to-end submissions, four-locale checks, email verification, mobile and link QA | 🟡 In progress; unit/UI checks pass, but real delivery still needs a Vercel Preview test |
| P8 | Final review, stage/commit, merge flow, deploy | ⏳ User handles all git commands and deployment; no git commands are run by the assistant |

**Local testing note:** Vite does not serve Vercel Functions by default. `vitePilotSignupApi.ts` adds a development-only adapter that invokes the same API handler. It reads `RESEND_API_KEY` from the process environment or local env files server-side only; without it, submissions return a clear service-unavailable message and no email is sent. For actual email QA, use the deployed Vercel Preview. Never submit test data without intending to email both the participant and Jean.

## Locked inputs (from stakeholder)

- **Entity:** The ProductShift, LLC (**Wyoming, USA** registered) — protects Jean, the individual, and any individuals rendering services under FreeBrain.
- **Provider:** FreeBrain (project of The ProductShift, LLC).
- **Liability:** institution/clinic rendering services, parent, power of attorney, or end-user bears all responsibility. FreeBrain = **opt-in movement supplement**, no medical advice, no medical service, no responsibility whatsoever.
- **Governing law:** USA primary (Wyoming) + broad international coverage.
- **Signed records destination:** `jean@freethebrains.com`.
- **Email confirmation** is sent after signing; **Calendly is the next step, not part of signing**.

## D1 — Form fields (minimal set)

| # | Field | Type | Required | Notes |
|---|---|---|---|---|
| 1 | Full name | text | ✅ | |
| 2 | Email | email | ✅ | confirmation destination; format-validated |
| 3 | Phone | tel | ✅ | pilot is contact-driven; international format tolerated |
| 4 | Role | select | ✅ | `individual` / `clinician` / `institutionRep` / `parentOrPOA` / `other` |
| 5 | Institution / clinic | text | ⚠️ conditional | optional in general; **required when role = clinician or institutionRep** |
| 6 | Notes | textarea | ⛔ optional | free text, ≤1000 chars |
| 7 | Consent: Terms | checkbox | ✅ | see D7 cascade |
| 8 | Consent: 4 free tango sessions | checkbox | ⚠️ conditional | visible only with program flag; see D3/D7 |
| 9 | Consent: photos/videos | checkbox | ⚠️ gated | disabled until #8 checked; see D7 |
| 10 | Consent: partner logo/branding | checkbox | ⚠️ gated | disabled until #8 checked; see D7 |
| — | Honeypot field | hidden | — | anti-spam; server rejects if filled |

All labels, options, hints, errors → `t()` in **en/es/de/pt** (keys in sync). No hardcoded colors (tokens only). Page ≤300 lines.

## D2 — Data sink

**v1: two emails, nothing stored.** No database, no sheet, no CRM. P4 implements this via
`POST /api/pilot-signup` → Resend; reuse the existing server-only `RESEND_API_KEY` in Vercel
(already configured for magic links; never expose it through Vite).

- Every submission → serverless function → **Resend** queues:
  1. **To the user:** confirmation + what they agreed to (terms link + version) + **Calendly link as next step**.
  2. **To `jean@freethebrains.com`:** the signed record — all fields, every checkbox state, UTC timestamp, IP address, terms version accepted.
- The jean@ inbox **is the system of record** for v1.
- **Record format: structured email, not PDF.** A PDF could be generated with free code libraries, but it adds rendering/attachment complexity without improving the v1 source of record: the email inbox. The structured message is searchable and contains the needed consent evidence; it is not a cryptographic signature or tamper-proof archive. Revisit PDF/archive requirements with legal counsel or if a pilot institution requires them.

**Revisit triggers (any → add storage):** >~50 submissions/month; need to filter/report; legal advice to keep centralized records. Storage options then: Vercel KV / Supabase (free tiers) — decided at that time, still $0.

**Spam/abuse:** honeypot field + per-IP rate limit in the function (best-effort v1).

## D3 — Tango-checkbox visibility mechanism

The Tango consent section is controlled by P1's `?program=tango` visibility mechanism and is hidden by default. For the Lisbon Tango signup, use `/lisbon-pilot?program=tango`.

- Tango opt-in is **unchecked by default**; photo/video and partner branding consents remain disabled until it is selected.
- The form stays embedded in the Lisbon page where the WhatsApp CTA used to be; the base `/lisbon-pilot` URL remains the general form.

**Why not the alternatives:**
- *Dedicated route* (`/lisbon-pilot-signup`): not used; the form is embedded in context on the Lisbon pilot page.

General signup experiences omit the tango consent section.

## D4 — Email provider

**Decision: Resend** (already sending your app/site email; domain verified — SPF at `send`, DKIM at `resend._domainkey` confirmed present).

- Architecture: form → **Vercel serverless function** (`/api/…`) → Resend API. `RESEND_API_KEY` lives as a Vercel env var — never in the repo/client.
- From: `FreeBrain <jean@freethebrains.com>`, `replyTo: jean@freethebrains.com` (domain-level verification authorizes any @freethebrains.com from-address).
- **Rejected:** Formspree (third-party form vendor, no dual-email control, adds a dependency), Vercel+SMTP (Resend *is* the transactional layer; raw SMTP adds config and worse deliverability).
- **DNS/MX requirements:** *sending* ✅. *Receiving* at `jean@` ✅ **fixed 2026-11-03 — Zoho MX/SPF/DKIM active (`MAINTENANCE.md` R1); no longer a blocker for P4.**
- ⚠️ Verify `/api/*` routes aren't swallowed by the SPA rewrite in `vercel.json` (filesystem/function routes normally win — confirm in QA).

## D5 — Terms language

**Decision: page fully translatable in all 4 languages; full body translated ×4 (chrome + clauses); English text governs on divergence (8.4).**

- Mechanism shipped in P3: a dedicated `terms` i18n namespace (`src/locales/{lang}/terms.json`).
  Page chrome (title, TOC, back-to-top, version stamp, provider/contact) **and the full clause body**
  (10 sections / 56 clauses + section-7 note + version history) are translated in `en`, `es`, `de`, and
  `pt` — all four files are key-identical and must stay in sync (76 leaf keys each).
- Translations are a JSON-only change, no code; English (`en/terms.json`) is the source of truth when
  amending clauses — mirror every edit into es/de/pt in the same change.
- Repo `t()` rule applies to all UI strings (now including the terms page chrome).
- English text governs on divergence (master terms clause 8.4) — divergence risk of translated
  legal text is explicitly accepted in the document itself.

## D6 — Success flow

**Submit → function → both emails queued → success state.** Failure = explicit error state (no silent success; nothing is stored, so a failed send must not look like a signed deal). If the record email is sent but confirmation fails, tell the user not to resubmit and offer Jean's WhatsApp.

Success screen contains:
1. Confirmation copy ("check your email — we sent you a copy of what you agreed to").
2. **Primary CTA: Calendly button — the next step** (scheduling happens strictly after signing).
3. Link to the terms they just accepted.

The confirmation email and success state use the approved Calendly event: `https://calendly.com/jean-kaluza/app-idea-day-1-facilitation-clone`.

## D7 — Consent cascade (NEW requirement, UI + terms)

**State machine (binding order):**

```
[terms] ─────────────────────────────── always visible, required, unchecked
[tango] ─ visible only with ?program=tango, unchecked
   │ when checked:
   ├─▶ [mediaConsent]   enabled (visible-but-disabled before) → required
   └─▶ [brandingConsent] enabled (visible-but-disabled before) → required
   when unchecked:
   └─▶ media + branding disabled AND cleared
```

**UI spec:**
- `terms`: "I have read and agree to the FreeBrain **Terms & Services**" — linked text (new tab) to the published terms.
- `tango`: positive framing — "Yes, include the **4 free live tango sessions**" (+ one-line benefit copy). Safety/residential details live in the linked terms, not the label.
- `media` / `branding`: rendered **visible but `disabled`** with helper text *"Available once you select the 4 free sessions"* — then become required when enabled:
  - media: permission to use photos and videos from sessions
  - branding: permission to use the partner's logo and branding in partnership with FreeBrain
- Submit disabled until all *applicable* consents are checked (which set is applicable is derived from the flag).

**Terms document must contain matching clauses** (input to P2): general T&C · tango program section · photo/video release · partner logo/branding license — each cross-referenced so the checkbox maps to a numbered clause, and the signed record stores the terms **version**.

## Open questions (need stakeholder/lawyer answers before P2 finalizes)

1. ~~Are media + branding consents strictly required?~~ ✅ **RESOLVED 2026-11-03:** both are **conditions of eligibility** — no media + branding consent, no free tango sessions (implemented as gate in `terms/master-terms.md` 4.6/7.2).
2. ~~Calendly URL~~ ✅ **RESOLVED 2026-11-03:** use existing `https://calendly.com/jean-kaluza/app-idea-day-1-facilitation-clone` in the confirmation email; sessions booked 1 at a time (D6).
3. **Phone required vs optional?** Decided ✅ required — confirm; alternatives (WhatsApp-first) possible.
4. ~~Existing `forms.app` pilot link~~ ✅ **RESOLVED 2026-11-03:** retire nothing — keep all existing links working; trim fat after full implementation.
5. **Data controller/retention:** form data persists only as emails — is that acceptable as the retention model? Need a deletion-request process (GDPR)? Who is controller of record (The ProductShift, LLC)?
6. **Multi-submit dedupe:** two people from one institution — ignore in v1?
7. **Terms delivery in email:** link + version stamp only, or attach full text/PDF? (Decided: link + version stamp — confirm.)
8. **Which locales** get the tango/consent UI copy? (t() rule ⇒ all four — confirm no exception for pilot markets.)

**New from P2 (see `terms/REVIEW-NOTES.md` L1–L11):** governing-law conflict (Portuguese vs Wyoming), PT-prevails vs English-only, GDPR "freely given" question on consent gating, insurance-confirmation step, price discrepancy ($150 vs $160), passed deadlines (Web Summit 11 Nov 2026).

## Decisions summary

| # | Question | Decision |
|---|---|---|
| D1 | Form fields | 10-field minimal set, conditional institution + gated consents (table above) |
| D2 | Data sink | Two Resend emails only; no storage; revisit at >50/mo |
| D3 | Tango visibility | `?program=tango` on `/lisbon-pilot`; hidden otherwise |
| D4 | Email provider | Resend via Vercel serverless; jean@ receiving ✅ **fixed 2026-11-03** (Zoho MX/SPF/DKIM active — MAINTENANCE #5 resolved) |
| D5 | Terms language | Translatable page (`terms` namespace ×4): chrome **and full clause body** translated ×4; English governs on divergence (8.4) |
| D6 | Success flow | Success screen + confirmation email, both ending in Calendly next step |
| D7 | Consent cascade | terms → tango → media+branding (disabled→enabled→required) |
