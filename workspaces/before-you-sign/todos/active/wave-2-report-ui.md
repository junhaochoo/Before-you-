# Wave 2 — Report UI: the five lenses + the demo money-shot

Value-anchor: User goal "fully developed frontend" (`briefs/00` §"User's Additional
Goal") + `13-product-design-ux.md` (wireframes → React) + `report-modules.md`. This is
the presentable prototype: with Wave 1 + Wave 2, a grader can run every number live via
manual entry, even before ingestion (Wave 3) exists.

Implements: `specs/report-modules.md`, `specs/compliance-guardrails.md`,
`03-user-flows/01-core-flow.md`, `01-analysis/13-product-design-ux.md`.

Depends on: Wave 1 (`computeReport` facade). Inter-wave gate before Wave 3:
G1 redteam (incl. guardrail suite green) + G2/G3/G4 feed-forward.

---

## W2-1 — Design system + app shell (BUILD)

Calm, non-salesy palette; large legible number components (dollar figures are the hero);
mobile-first layout; tap-to-explain pattern for jargon; the persistent "We earn nothing
from your decision" no-conflict badge; the standard disclaimer banner component.

- Acceptance: a Storybook-or-route gallery renders the number, badge, disclaimer, and
  tap-to-explain primitives; mobile + desktop breakpoints verified; disclaimer component
  is a single source reused by every report module (`compliance-guardrails.md` rule 5).
- Invariants: 2 (disclaimer single-source, mobile-first). LOC: ~200. Loop: component tests.

## W2-2 — Personal-context input form (BUILD)

The 5-input profiling instrument (`13-product-design-ux.md` C2): liquid savings, monthly
expenses, horizon, existing holdings (optional), stated objective. Feeds neutral
arithmetic only — **no "aggressive/conservative" scoring label**.

- Acceptance: form validates types/ranges; produces the context inputs `computeReport`
  needs; a guardrail-tagged test asserts no risk-tolerance label is emitted.
- Invariants: 2 (validation, no-scoring-label). LOC: ~150. Loop: component tests.

## W2-3 — Product-input form (manual-entry mode) (BUILD)

The editable product-fields form (fees, surrender schedule, guarantee, projected return,
single-vs-regular premium) matching the `document-ingestion.md` extraction schema. This
is what lets Wave 2 run end-to-end WITHOUT ingestion. Confidence/source-span fields
present but inert until Wave 3 populates them.

- Acceptance: a user can hand-enter the worked-example ILP and reach a full report;
  schema shape matches `document-ingestion.md` so Wave 3 can populate the same form.
- Invariants: 2 (schema parity with ingestion, no-math-on-empty). LOC: ~180. Loop: tests.

## W2-4 — Fee Lens + gross-vs-net chart (BUILD + WIRE)

The hero module (`report-modules.md` §02): headline "S$X over Y years, reduce final value
by Z%", break-even surrender year, and the Recharts **diverging gross-vs-net compounding
curve** (the demo's signature visual). Plus the BTIR excess-cost line.

- Acceptance: on worked-example inputs renders ≈ S$115k / ≈36% / curves visibly diverge /
  BTIR excess ≈ S$90–100k; numbers come from `computeReport`, zero hardcoded figures.
- Invariants: 2 (live-wired numbers, no mock data). LOC: ~180. Loop: component+e2e.

## W2-5 — Downside ("What if") module + assumption sliders (BUILD + WIRE)

`report-modules.md` downside surface: P5/P50/P95, probability of loss, expected shortfall,
single-year stress, all phrased "scenarios, not forecasts". **Return/volatility sliders**
re-run the engine live and re-render (the honest-limitations requirement, graded).

- Acceptance: sliders move → engine recomputes → chart/numbers update; worst-5% framing
  present; "scenarios not forecasts" caveat on the module.
- Invariants: 2 (live recompute, caveat present). LOC: ~160. Loop: component+e2e.

## W2-6 — RiskFit Lens + Portfolio Mirror + Product Scan + Decision-Gap (BUILD + WIRE)

The remaining four lenses (`report-modules.md` §01/03/04/05): Product Scan glossary +
guarantee check; RiskFit context (concentration %, dollar downside, buffer months,
lock-in-vs-horizon — **context, not verdict**); Portfolio Mirror HHI/liquidity
before-after bars; Decision-Gap checklist + printable "questions to ask your adviser".

- Acceptance: all four render from `computeReport`; guarantee check reads "states / does
  not state… provider \_\_\_"; every flag is a neutral fact or question (`compliance-
guardrails.md` L3 framing), never an evaluative verdict.
- Invariants: 4 (4 module contracts) + the shared no-verdict invariant. LOC: ~260.
  NOTE: at the upper edge of one shard — split into 6a (Scan+Decision-Gap) and 6b
  (RiskFit+Portfolio) at `/implement` if it overflows. Loop: component tests.

## W2-7 — Compliance guardrail regression suite (BUILD) — carry-forward obligations

The permanent guardrail test suite (`compliance-guardrails.md` §Test obligations +
redteam carry-forward). Asserts across EVERY report path: (1) no buy/sell/suitability
verdict or good/bad-product label; (4) free-look copy carries the MVA qualifier;
(5) benchmark is BTIR-labelled. Disclaimer present on every rendered report. (G1/M2
obligations 2+3 are asserted in Wave 3 where extraction exists.)

- Acceptance: suite fails red if a verdict string, an un-qualified "free" free-look line,
  or a naked-index benchmark label is introduced anywhere; runs in CI on every change.
  Use probe/structural assertions appropriately (avoid naive keyword-only matching for
  the semantic "is this a verdict" check — pair a structural check with a clear rubric).
- Invariants: 3 (verdict-absence, MVA-qualifier, BTIR-label). LOC: ~160. Loop: this IS
  the loop.

## W2-8 — Report page assembly + print/save stub (BUILD + WIRE)

Compose the five lenses into the single report artefact (`13-product-design-ux.md`
Screen 3), with the disclaimer header, no-conflict badge, and a "Print questions sheet"
action. Save/PDF is a stub here (full persistence + PDF is Wave 4).

- Acceptance: end-to-end manual-entry → full report renders matching the wireframe order;
  print-questions produces a clean printable sheet; **user-flow walk receipt** captured
  (`rules/user-flow-validation.md`).
- Invariants: 2 (assembly order, disclaimer-on-every-report). LOC: ~140. Loop: e2e walk.

---

## Verification (Wave 2 — COMPLETE 2026-06-22)

All eight todos implemented in `apps/web/app/` + `apps/web/lib/`.

- **Tests:** 64/64 passing (41 engine + 23 guardrail). Guardrail suite
  (`lib/__tests__/guardrails.test.ts`) encodes carry-forward obligations #1 (no
  verdict / good-bad label), #4 (free-look MVA qualifier), #5 (BTIR not naked index),
  plus disclaimer-present.
- **Build:** `npm run build` clean on Next 16 (3 routes prerender, zero warnings after
  client-gating the Recharts container). `tsc --noEmit` clean.
- **User-flow walk (served production build):**
  - `GET /` — entry screen renders 3 modes (Upload / "I only have what the agent told
    me" / free-look-with-MVA-qualifier); "We don't sell anything" present.
  - `GET /analyze` — all five lenses render LIVE-computed: Fee Lens
    (S$114,882 / 36% / S$205,832 / S$320,714 + gross-vs-net chart), BTIR
    (S$100,088, "term insurance", "factual comparison, not a recommendation"),
    downside (P50 S$201,374 / P5 S$62,555 / 16% loss / ES), RiskFit (80% / 20%
    context), Portfolio Mirror (HHI 100%→68%, liquidity 100%→20%), Decision Gaps +
    print-questions button. Zero hardcoded figures — all from `computeReport`.
- **Files:** `lib/format.ts`, `lib/copy.ts` (single-sourced compliance copy);
  `app/components/ui.tsx` (W2-1), `GrossNetChart.tsx` (W2-4), `Report.tsx`
  (W2-4/5/6/8 five lenses + sliders + print); `app/analyze/page.tsx` (W2-2/W2-3
  forms + live engine); `app/page.tsx` (entry modes); `app/globals.css`;
  `lib/__tests__/guardrails.test.ts` (W2-7).
- **Compliance-by-design:** disclaimer single-sourced + on every report;
  RiskFit/Portfolio render facts only (no verdict); concentration threshold shown as
  "general context, not advice"; free-look carries MVA qualifier; BTIR factual framing.
- **Polish:** rounded a float artifact in the portfolio bar width (cosmetic; visible
  text already correct via `pct()`).

**Next:** Wave 2 → Wave 3 inter-wave gate, then Wave 3 (document upload: PDF parse →
PII redaction → LLM extraction → confirm form). Wave 3 needs the LLM key in `.env`.
