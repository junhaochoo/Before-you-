# Analysis Index — "Before You Sign"

Assessment of Ivory Lim's FNCE6041 pitch against the assignment brief + the user's
goal of building a deployable MVP. Read in order:

1. `../briefs/00-brief-and-pitch.md` — the brief + the source pitch (captured).
2. `01-research/01-regulatory-singapore.md` — **the decisive constraint**: the
   MAS advice/information boundary; why "RiskFit" must be redesigned; problem-harm
   evidence (FIDReC 20-year high).
3. `01-research/02-market-and-competitors.md` — segments, competitors/substitutes,
   USPs (scrutinised), platform/network read.
4. `02-pitch-assessment-vs-brief.md` — **scorecard vs the brief's 6 elements**;
   what's strong, what loses marks.
5. `03-prototype-gaps.md` — **what's lacking to build the MVP**; the data-layer
   problem; per-module gaps; the recommended thin-slice; tech shape.
6. `06-analytical-component.md` — **the quantitative engine** (fee drag, Monte Carlo
   downside, concentration/liquidity, portfolio HHI, fee backtest). The graded core.
7. `04-business-model.md` — B2B2C-led revenue model + unit-economics drivers.
8. `05-risks-and-constraints.md` — regulatory, operational, model, business risks.
9. `../03-user-flows/01-core-flow.md` — end-to-end MVP user journey.
10. `../../before-you-sign/specs/` — buildable domain specs for the MVP.

## Terminology normalization (red-team M1 — read before the legacy docs)

Earlier docs (01-research, 02–07) use **"PHS"** as generic shorthand for the source
document. Canonical taxonomy (authoritative in `09`, `13`, `specs/document-ingestion.md`):

- **Insurance ILP** → the buyer receives a **Product Summary + Benefit Illustration**
  (the Benefit Illustration is the key fee/effect-of-deductions artefact). The
  **"PHS"** proper is the _capital-markets / fund_ document and applies to **unit
  trusts and ILP sub-funds**, not the ILP wrapper. Where a legacy doc says "user
  uploads the PHS" for an ILP, read "Product Summary + Benefit Illustration."

## Resolution layer (added 2026-06-22 — all Critical + High flaws resolved)

11. `08-gap-register.md` — **every flaw by severity + resolution status** (start here
    to see what was fixed).
12. `09-strategic-resolutions.md` — free-look wedge, anti-chatbot moat, beachhead lock,
    entry modes, cold-start seeding.
13. `10-worked-analytical-example.md` — **the demonstrated quant core**: real ILP,
    ~S$115k/36% fee drag, ~S$100k fee gap vs index, Monte Carlo, sensitivity, limits.
14. `11-unit-economics.md` — consumer freemium-first model + economic drivers.
15. `12-market-sizing-and-evidence.md` — TAM/SAM/SOM + correct problem evidence.
16. `13-product-design-ux.md` — wireframes, the report artefact, profiling instrument.
17. `14-risk-treatment.md` — slide-ready risk table.
18. `15-feasibility-extraction.md` — extraction-reliability architecture + demo set.

## The three things that convert this from "idea" to "investment-quality + buildable"

1. **The quantitative engine** (doc 6) — currently asserted, must be demonstrated.
2. **Compliant redesign of the suitability/risk module** (doc 2 §regulatory) —
   currently a licensing landmine.
3. **The data-input mechanic** (doc 5) — currently undefined; recommend
   user-uploads-PHS → LLM-extract → confirm → deterministic math.
