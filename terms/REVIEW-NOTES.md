# REVIEW NOTES — master-terms.md v1.0 (for stakeholder + lawyer review)

Companion to `terms/master-terms.md`. Prepared 2026-11-03 from the existing
Pilot Partnership Agreement (PT/EN, effective 27 Oct 2026) + on-site `TermsAndPrivacy` content +
Prompt 1 requirements (REQUIREMENTS.md D1–D7).

**Stakeholder decisions applied 2026-11-03 (publish gate cleared):** sessions are *gifts* with
scheduling solely on the institution/participant, and unused sessions never forfeit branding/media
rights (7.1/7.3/7.7); Web Summit is a **date-gated provision for sign-ups before 6 Nov 2026**
(7.8(d)); governing law is **USA-first and flexible** with worldwide responsibility allocation
(3.2/8.3). Remaining flags below are held as a **lawyer-maintenance backlog** ("once we get there").

## Plain-language summary — what changed vs. the existing contract

1. **Added a whole general-terms layer** the old contract never had: website/app acceptable use, IP, third-party links, termination — so one document now covers *every* aspect of FreeBrain, not just the institutional pilot.
2. **Consolidated, not diluted:** pilot clauses (sessions, pricing, safety, Web Summit, Founding Partner Offer, resident consent) were moved intact into an **optional section 7** — applicable parties read it; everyone else skips it.
3. **Governing law: USA-first + flexible** — Wyoming primary with international fallback (8.1/8.2), and an **8.3 flexibility clause** letting parties agree in writing to local law (e.g., Portuguese law for a Lisbon pilot) while responsibility allocation (3.2/6.3) applies **worldwide**. Stakeholder direction applied; a lawyer should still sanity-check it later.
4. **Language clause changed** from "Portuguese prevails" to **English-only publication** (D5) — flagged in 8.4/8.3.
5. **Individual protection added (1.2):** Jean and every person rendering services under FreeBrain are explicitly shielded; ProductShift alone is the contracting party (this was implicit before, now explicit).
6. **Responsibility allocation generalized (3.2):** old contract put this on the *institution*; new text explicitly covers institution/clinic, **parent, POA, or the user themself** — plus minors and persons without capacity (3.3), per your model.
7. **Consent cascade made contractual (4.6 + 7.2):** media + branding consents are stated as **conditions of free-session eligibility** — matching your rule "no filming/branding consent, no free sessions," with the withdrawal→regular-price consequence (7.2/7.7).
8. **In-app recording covered (4.2):** the Bunny Challenge's local-only, video-only, never-uploaded behavior is now in the terms (was only on the on-site page).
9. **Version stamp added** (v1.0, 2026-11-03, in header + version history) so signed records can cite exactly which text was accepted.
10. **Contact unified** to `jean@freethebrains.com` per D4 (old contract listed jean@theproductshift.com + WhatsApp).

## Lawyer-maintenance backlog (held per stakeholder — review "once we get there")

| # | Issue | Status / why it matters |
|---|---|---|
| L1 | **Governing law** — old contract: Portuguese law/Lisbon courts/PT-prevails. Master: Wyoming primary + flexible 8.3. | **Direction decided** (USA-first, flexible, worldwide responsibility — applied 3.2/8.3). Lawyer to confirm enforceability for EU/elderly participants. |
| L2 | **Language conflict** — old contract: "Portuguese prevails." Master: English-only publication (8.4), page UI translated in 4 languages. | Lawyer to confirm PT-prevails isn't legally required for consumer-facing terms in the EU. |
| L3 | **GDPR freeness of consent** — media+branding consent gates the free sessions ("no consent, no free sessions", 4.6/7.2). | Stakeholder confirmed: consent is required under GDPR and both consents are conditions of eligibility. Lawyer to confirm the conditions-precedent framing survives Art. 4(11)/7 scrutiny. |
| L4 | **Insurance clause (7.5)** — institution's insurance must cover FreeBrain-led sessions "confirmed in writing before first session." The e-sign flow has no slot for that confirmation. | Add a checkbox/field for institutions, or move to the paper signature page only. |
| L5 | **Clause numbering** — old contract cross-references are internally inconsistent (e.g., EN §3.3 labeled "3.5", §3.4 labeled "3.6"; 4.3–4.6 vs 4.4/4.5 mismatches). Draft renumbers cleanly; every cross-ref was re-mapped. | Verify no commercial term was lost in renumbering (esp. 2.1 penalty trigger). |
| L6 | **Price discrepancy in source** — table says Facility Plan regular "$160/month or $1,200/year," but intro text says "$150/month." Draft used **$160** (from two places). | Confirm the real price. |
| L7 | ~~Deadlines already passed~~ ✅ **RESOLVED 2026-11-03:** 7.8(d) is now a **Lisbon-pilot provision applying only to sign-ups before 6 Nov 2026**; later sign-ups simply don't get it. Offer deadline (31 Dec 2026) still applies as written. | None. |
| L8 | **Bilingual PT version** — master is English-only. Institutions currently sign PT/EN bilingual paper. | Decide whether the paper agreement remains bilingual (a separate artifact incorporating these Terms), or the master must be translated for signature. |
| L9 | **Founding Partner Offer / Annex A + Annex B** — retained in 7.9/7.10 as summarized terms. The old flow had separate signable annexes. | The e-sign flow (P5) has no annex-signing step. Confirm: offer stays paper-only for now? |
| L10 | **Individual Plan placeholders** — A.7's `[$price]`, `[20]%`, `[3] months`, `[10]%` credit remain unresolved in source; draft dropped A.7 details to "separate agreement." | Fill in numbers or keep out of master terms. |
| L11 | **On-site leaderboard terms** — old `TermsAndPrivacy` mentioned a leaderboard; feature is disabled and its i18n keys were broken (KNOWN_ISSUES #7). Master omitted leaderboard entirely; the old page is now removed and redirected to `/terms`. | If leaderboard ships later, add a clause then. |

## Consent-flow → clause map (input for P5)

| Checkbox (UI) | Unchecked default | Required? | Maps to clause |
|---|---|---|---|
| Accept Terms & Services | yes | always | 1–9 (whole doc) |
| 4 free tango sessions (flag `?program=tango` only) | yes | when visible | 7 (esp. 7.2) |
| Photos & videos permission | yes | enabled only after tango | 4.1/4.3 → gate in 4.6/7.2 |
| Partner logo/branding permission | yes | enabled only after tango | 4.4 → gate in 4.6/7.2 |

Confirmation email: terms link **with version stamp** + Calendly link (next step) per D6.
