# Build Roadmap — "Before You Sign" MVP

Status: DRAFT — awaiting human approval (the `/todos` structural gate).
Generated: 2026-06-22. Source of truth: `../../specs/` + `../../01-analysis/`.

## What we are building (one sentence)

A deployable single web app (Next.js + TypeScript) where a pre-retiree uploads (or
manually enters) an Investment-Linked Policy document and gets a compliant "Before You
Sign" report — driven by a **deterministic, unit-tested finance engine** (the graded
course core) with **one** low-temperature LLM call used only to extract text into a
schema.

## Tech shape (locked by `15-feasibility-extraction.md` § "Recommended build shape")

- **One Next.js app at `apps/web/`** (App Router, TypeScript). No separate Python
  backend — the finance engine is pure TypeScript and runs the same code client-side
  for the live demo and server-side for tests.
- **Finance engine** `apps/web/lib/engine/` — pure functions, Vitest golden-value tests.
- **LLM extraction** — one server-side API route; provider/model/key from `.env`
  (repo convention: `.env` is the single source of truth — never hardcode the model).
- **Charts** — Recharts (gross-vs-net diverging curve is the signature visual).
- **PDF parse** — server-side JS text extraction + PII redaction BEFORE the LLM call.
- **Persistence** — deferred to Wave 4 (saved reports start in-browser for the demo;
  DB + encryption is the productionising step).

> Note: repo `CLAUDE.md` describes a Kailash SDK project. This MVP is intentionally a
> plain web app per `.session-notes` — Kailash specialists are NOT in scope here. The
> only inherited convention that applies is `.env` as the single source of model/key.

## Wave declaration (COMPULSORY — `rules/wave-loop.md` MUST-1)

Four value-ranked waves. An inter-wave gate (redteam-to-convergence + feed-forward)
fires at every boundary before the next wave launches. Value rank cites the brief and
specs (the only user-anchored sources).

| Wave  | Milestone group                                                                                                 | Value    | Primary anchor                                                                                                                                                                                                  | Inv. surface           |
| ----- | --------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **1** | Scaffold + Analytical Engine (Engines 1–4) + golden tests                                                       | **HIGH** | Brief element #4 "Financial/analytical component (course core)… rigorous reasoning and quantitative thinking"; `00-INDEX` §"three things": "The quantitative engine — currently asserted, must be demonstrated" | ~8, live test harness  |
| **2** | Report UI: 5 lenses + gross-vs-net chart + context form + sliders + compliance framing + guardrail suite        | **HIGH** | User goal: "fully developed frontend"; `13-product-design-ux.md`; `report-modules.md`; `compliance-guardrails.md` (the boundary "to guard most carefully")                                                      | ~10, live test harness |
| **3** | Document ingestion: upload → PII redact → LLM extract → confirm; manual entry; entry modes; extraction fixtures | **MED**  | `00-INDEX` §"three things" #3 "the data-input mechanic"; `document-ingestion.md`; `15-feasibility-extraction.md` G1                                                                                             | ~7, live fixtures      |
| **4** | Persistence + PDPA + PDF/print export + freemium gating + deploy to web server + proposal-support docs          | **MED**  | User goal: "deployable to a web server"; "sound, revenue-generating business model"; `04-business-model.md`                                                                                                     | ~6                     |

**Why this order (named trade-off, `rules/value-prioritization.md` MUST-1):** Wave 1
before Wave 2 because the engine is the single most-graded element and everything else
renders its output. Wave 2 (frontend) before Wave 3 (ingestion) is the deliberate
trade-off: the live demo and every graded number can run end-to-end on **manual entry**
(Wave 2), so the frontend + engine is a complete, presentable prototype even if
ingestion slips. Ingestion is the trust/scale story, not a blocker for the demo or the
grade. Deploy + business-model support last because they productionise an
already-working prototype. **Later waves are provisional** (`wave-loop.md` MUST-4):
re-validated and re-ranked at each inter-wave gate, not frozen.

**Compliance is cross-cutting, not a late wave.** The compliance _rules_ (no verdict,
disclaimer on every report, neutral arithmetic only) are baked into the Wave-2 module
contracts from first render. The guardrail _test suite_ that enforces the 5 carry-forward
regression obligations lands in Wave 2 alongside the modules it guards.

## Carry-forward regression obligations (`04-validate/02-redteam-round-2-convergence.md`)

The build's guardrail/eval suite MUST encode these as permanent regression checks:

1. No report path emits a buy/sell/suitability verdict or "good/bad product" label (L3).
2. Deterministic math only on user-confirmed fields; "not found" never guessed (G1).
3. PII redacted before any LLM call (M2).
4. Free-look copy never says "free" without the MVA qualifier (H1).
5. Benchmark comparison uses BTIR, not a naked index fund (H2).

These are tracked as explicit todos (W2-7 guardrail suite; W3-3 redaction; W3-4 confirm-gate).

## Index of wave files

- `wave-1-analytical-engine.md` — W1-1 … W1-6
- `wave-2-report-ui.md` — W2-1 … W2-8
- `wave-3-document-ingestion.md` — W3-1 … W3-6
- `wave-4-persistence-deploy.md` — W4-1 … W4-6

## Open items carried from analysis (not build-blocking)

- **F2** — verify the primary source for the "45% didn't understand ILP fees" stat
  before the final deck (currently caveated, per redteam H3). Not a code todo.
- **F3** — L5 roster enrollment — only needed before a future `/release`. Not now.
