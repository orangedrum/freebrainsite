# FreeBrain — Growth Strategy & Product Planner

> Living document for the FreeBrain growth strategy (SEO, AEO, product-led growth).
> Created during the "growthstrat" planning phase. AI models and humans should both be
> able to reference this as the source of truth for what we are building and why.

---

## Objective

Replicate the product-led-growth (PLG) mechanics of
[Peptide Schedule](https://www.peptideschedule.com/calculator) on FreeThebrains.com:

> High-friction problem → free interactive utility → instant value → app conversion.

For FreeTheBrains, the high-friction problem is **safety paralysis** around movement
therapy for neurological conditions. Peptide Schedule turned vial math into a daily-returned
utility; FreeBrain's v1 turns caregiver movement intent into a personalized "Movement Plan".

**Long-term objective:** grow from the free movement tools into a self-reinforcing funnel:
movement tools → value → app users → community/advocacy → more tools (movement planner,
games, calculators) → learn hub + expert content.

---

## Keyword strategy (longtail, caregiver-focused)

Buckets determined during planning (all for freethebrains.com):

### Bucket A — Home safety & exercise modification (high conversion)

- "how to help a parent with parkinsons exercise safely"
- "safe balance exercises for parkinsons at home"
- "seated exercises for parkinsons patients caregiver guide"
- "how to stop parkinsons freezing of gait at home"
- "physical therapy exercises for parkinsons stage 3"

### Bucket B — Specialized neuro-movement & dance (high engagement)

- "dance for parkinsons at home video"
- "rhythmic auditory cueing exercises for parkinsons"
- "cognitive motor training exercises for elderly parents"
- "tango exercises for parkinson's patients at home"

### Bucket C — Caregiver activities & solutions (top-of-funnel)

- "fun activities to do with a parkinsons parent"
- "how to keep a parkinson's patient active at home"
- "home workout routine for elderly with tremors"

**Current build focus:** Bucket A — specifically *"how to help a parent with parkinsons
exercise safely"* is the highest-intent, highest-conversion keyword the project has
decided to win with the first tool.

---

## v1 Build Plan — Movement Planner + Movement Library

### Phase 1 — Movement Planner (free interactive tool)

**Prompt basis:** "Build the first free interactive component on freethebrains.com: a Movement
Plan tool replicating Peptide Schedule's 'Vial + BAC Water' parallel. User inputs: Patient
Mobility (Seated / Standing with Support / Independent Standing) + Current Movement Focus
(Freezing of Gait / Tremors / Postural Instability). Compute: personalized recipe — 'Your
10-Minute Home Recipe: 3 Mins Rhythmic Warm-Up, 5 Mins Dual-Task Dance Demo, 2 Mins
Chest-Opening Stretch. Do this daily and you should see significant results.' CTA:
'Ready to try right now?' → routes to /movements pre-filtered."

**Decisions (finalized for v1):**

1. Filters drive the library list; until inputs are set, no videos show.
2. The results from the Movement Plan apply to the filters on the Movement Library page.
3. Pre-flight Safety Check precedes the planner in code (both are v1 deliverables).
4. All movement videos use `/tangoworkshop.mp4` for now; more videos to come.

### Phase 2 — Movement Library v1

- Video-list page (`/movements`) fed by planner state (mobility / focus).
- Vertical VideoPlayer per movement card; generic + tango variants per mobility.
- Only `/tangoworkshop.mp4` for v1 (poster: `/tangoworkshop.png`).

### Phase 3 — Conversion

- Post-workout screen: "Workout Complete! You just stimulated neuroplasticity for 8 minutes."
- Noticing checklist + value hook + "Download App & Save Today's Session" → Join Pilot modal.

---

## Future phases (out of scope for v1)

- More movement tools (games, calculators) as the planner expands.
- Movements library broken down by condition (Parkinson's, Alzheimer's, MS, etc.).
- Learn section (Peptide Schedule-style educational content).
- Expert hub (internally scraped knowledge).

---

## Current status

- Branch: `growthstrat` (vite/tsc errors being fixed for the two new pages were surfaced; build passes via vite).
- Not yet shipped to production.
- Following this: ship `growthstrat` → `develop` → `stage` → `main`.

---

## How to use this document with future AI sessions

- Treat this file as the product/strategy source of truth when asked to build or plan anything
  growth-related on this repo.
- When adding new growth features, append to this doc (keep one item = one plan block).
- When planning implementation order, follow the dependency order above.
