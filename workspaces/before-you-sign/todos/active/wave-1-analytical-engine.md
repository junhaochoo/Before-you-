# Wave 1 — Scaffold + Analytical Engine (the graded core)

Value-anchor: Brief element #4 ("Financial/analytical component… rigorous reasoning and
quantitative thinking") + `00-INDEX` §"three things" #1 ("The quantitative engine —
currently asserted, must be demonstrated"). This is the highest-marks element; every
other wave renders its output.

Implements: `specs/analytical-engine.md`, `01-analysis/06-analytical-component.md`,
`01-analysis/10-worked-analytical-example.md`.

Inter-wave gate before Wave 2: G1 redteam-to-convergence on the engine + G2 journal
DISCOVERY of any spec/worked-example drift + G3 spec update + G4 re-rank.

---

## W1-1 — Project scaffold (BUILD)

Initialise the Next.js + TypeScript app at `apps/web/`. App Router, strict TS, ESLint,
Prettier, Vitest configured, Recharts + a PDF-text lib + the LLM provider SDK added as
deps (not wired yet). `.env.example` committed; `.env` git-ignored. Tailwind (or CSS
modules) for the design system. A bare landing route renders.

- Acceptance: `npm run dev` serves a page; `npm run test` runs an empty Vitest suite
  green; `npm run build` succeeds; `.env` is git-ignored and `.env.example` lists the
  LLM provider/model/key vars.
- Invariants: 1 (env-as-source-of-truth). LOC: ~boilerplate. Feedback loop: build+test.

## W1-2 — Engine 1: Fee drag / total cost of ownership (BUILD)

Pure function(s) in `apps/web/lib/engine/fees.ts` implementing the net-of-fee annual
recursion from `analytical-engine.md` §Engine 1 and `06-analytical-component.md`:
`V(0)=P(1−s)(1−b)`, `V(t)=V(t−1)(1+g−m−f−i)`, plus fixed-dollar admin drag. Outputs:
total fees paid (S$), fee drag (%), break-even surrender year, gross-vs-net curve arrays.
Support BOTH single-premium and regular-premium (per-year allocation schedule, worked
example M4).

- Acceptance: golden-value unit test reproduces the worked example within tolerance —
  gross ≈ S$320,714; net ≈ S$205,900; total fees ≈ S$114,800; fee drag ≈ 36%. Property
  tests: fees ≥ 0; net ≤ gross.
- Invariants: 3 (recursion correctness, fee ≥ 0, net ≤ gross). LOC: ~150. Loop: tests.

## W1-3 — Engine 1 BTIR benchmark (BUILD)

Add the Buy-Term-and-Invest-the-Rest comparison leg (`10-worked-analytical-example.md`
§"use BTIR, not a naked index fund" — red-team H2): invested remainder at a low-cost TER
minus term-premium outlay; output the ILP **excess cost** vs BTIR. Factual comparison
only — never "buy the ETF instead."

- Acceptance: golden test shows index leg ≈ S$305,900-class and ILP excess ≈ S$90–100k
  band on the worked-example inputs; a guardrail-tagged assertion confirms the public
  contract returns BTIR (not naked-index) labels (feeds W2-7 obligation #5).
- Invariants: 2 (BTIR math, factual-framing labels). LOC: ~80. Loop: tests.

## W1-4 — Engine 2: Monte Carlo downside simulation (BUILD)

`apps/web/lib/engine/downside.ts`: N=10,000 net-of-fee paths, **lognormal primary**
(μ, σ seeded by asset class), Student-t fat-tail variant, deterministic scenario band
(−2σ…+σ) as the cheap alternative. **Seeded RNG** for reproducibility. Outputs:
P5/P50/P95 terminal, probability of nominal loss, expected shortfall (mean worst 5%),
max-drawdown distribution, single-year stress (−20% ≈ −S$20k).

- Acceptance: seeded-RNG test is reproducible run-to-run; P5 < principal on the worked
  inputs; `P(loss)` and ES reported; property test asserts lognormal never yields
  return < −100%. Labelled "scenarios, not forecasts" in the public return shape.
- Invariants: 4 (seeded determinism, distribution stats correctness, lognormal floor,
  scenarios-not-forecasts labelling). LOC: ~180. Loop: tests.

## W1-5 — Engine 3 + Engine 4: RiskFit context + Portfolio Mirror (BUILD)

`apps/web/lib/engine/context.ts`: concentration `A/(L+A)`, liquidity buffer months
`(L−A)/C`, stress dollar impact `A×P5drawdown`, lock-in-vs-horizon flag. `portfolio.ts`:
HHI `Σwᵢ²` before/after + liquidity ratio shift. **Context/facts only — zero verdict
strings** (`compliance-guardrails.md` Hard rule 1 + Engine-3 framing).

- Acceptance: golden tests for each metric on worked-example profile (L=125k, C=4k →
  concentration 80%, buffer 6.25 months). Property test: concentration ∈ [0,1]. A
  guardrail-tagged test asserts no output field contains a suitability/verdict string
  (feeds W2-7 obligation #1).
- Invariants: 4 (4 metric formulas + the no-verdict invariant). LOC: ~140. Loop: tests.

## W1-6 — Sensitivity table + engine public API (BUILD)

Expose the sensitivity grid (fee drag across g∈{4,6,8}% × RIY∈{1.5,2.4,3.0}% —
`10-worked-analytical-example.md`) and a single typed `computeReport(inputs)` facade the
UI consumes. Document every assumption field as a typed, user-adjustable input.

- Acceptance: sensitivity test reproduces the ~25–43% band and the "driven by fee load,
  not return" property (row variance ≪ across columns); `computeReport` returns a fully
  typed object covering all five lenses' numbers.
- Invariants: 2 (sensitivity correctness, stable public contract). LOC: ~120. Loop: tests.

---

## Verification (Wave 1 — COMPLETE 2026-06-22)

All six todos implemented in `apps/web/lib/engine/` and proven against the worked example.

- **Test result:** 41/41 passing (`npm test`) — golden-value tests reproduce
  `10-worked-analytical-example.md`: gross S$320,714, net S$205,832, fees S$114,882,
  drag 36%, BTIR excess S$100,088, concentration 80%, buffer 6.25mo, P5 < principal,
  P(loss) ~16%, sensitivity flat-across-returns (<3pp/row).
- **Build:** `npm run build` clean on Next 16 + Turbopack; page prerenders statically.
- **User-flow walk:** served the production build, fetched `/` — landing page renders
  every figure live from `computeReport` (zero hardcoded numbers), disclaimer +
  no-conflict badge present. Receipt in session report.
- **Files:** `types.ts`, `fees.ts` (W1-2/W1-3), `downside.ts` (W1-4), `context.ts`
  (W1-5), `sensitivity.ts` + `index.ts` (W1-6); tests in `lib/engine/__tests__/`.
  Scaffold: `package.json`, `tsconfig.json`, `vitest.config.ts`, `app/`, `.env.example`.
- **Spec deviation (recorded):** concentration changed A/(L+A) → A/L to match the
  demonstrated 80% headline; `specs/analytical-engine.md §Engine 3` updated with
  rationale (specs-authority Rule 6). No surprising user-visible change — the 80%
  figure is the one the pitch/wireframe/worked example already show.
- **Compliance carry-forward (engine layer):** no engine output emits a verdict;
  BTIR carries `factual-alternative-comparison` label; downside carries
  `scenarios-not-forecasts`. Full guardrail suite lands in Wave 2 (W2-7).
- **Dependency note:** Next bumped 15.1.6 → 16.2.9 (CVE-2025-66478 patch),
  Recharts → 3.x (per repo "latest versions always" rule). All tests green post-bump.

**Next:** Wave 1 → Wave 2 inter-wave gate (wave-loop MUST-2), then Wave 2 (report UI).
