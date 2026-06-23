# Analytics — how "Before You Sign" satisfies the course-core grading

This maps the working prototype's finance engine to the assignment's required elements.
Every figure below is **computed live** by the deterministic engine (`apps/web/lib/engine/`)
and pinned by golden-value unit tests — not asserted on a slide. Run `npm test` to reproduce.

Representative case (illustrative ILP, publicly-sourced fee ranges): a 50-year-old places a
**S$100,000 single-premium ILP**, 20-year horizon, 6% assumed gross return.

## Engine → grading element

| Brief element | Engine | What it produces (this case) |
|---|---|---|
| **Pricing / cost framework** | Engine 1 — fee drag / TCO | Fees **≈ S$114,900 (≈36%)** of the fee-free outcome; you keep **≈ S$205,800** vs **≈ S$320,700** fee-free; break-even surrender year |
| **Risk model** | Engine 2 — Monte-Carlo downside | 10,000 lognormal net-of-fee paths → P5/P50/P95, **probability of nominal loss ≈ 16%**, expected shortfall, max drawdown; P5 outcome **below principal** |
| **Cost vs alternative** | Engine 1b — BTIR benchmark | Excess cost over Buy-Term-and-Invest-the-Rest **≈ S$100,000** over 20 years |
| **Portfolio construction logic** | Engines 3–4 — concentration & HHI | Product = **80%** of liquid savings; liquidity buffer **≈ 6.25 months**; HHI + liquid-share before/after |
| **Backtest / simulation + rigour** | Engine 2 + sensitivity grid | Fee drag holds **~25–43%** across return assumptions |

## The headline analytical finding (defensible, graded)

**Fee drag is driven by the fee load, not the return.** Across gross returns of 4%–8% the
fee drag stays within a few percentage points for a given fee level. This rebuts "but markets
might do better" — higher returns compound the fee base too. (Sensitivity grid,
`lib/engine/sensitivity.ts`; test asserts each fee-level row is flat to <3pp across returns.)

## Why the BTIR benchmark, not a naked index fund

An ILP bundles life insurance, so comparing it to a pure index fund is rebuttable ("that gives
no protection"). The engine instead isolates the ILP's **excess** cost over buying cheap term
insurance **and** investing the rest in a low-cost fund — the same protection and market
exposure, more cheaply. This mirrors how fee-only advisers actually argue and is far harder to
rebut. It is presented as a **factual comparison, never "buy the ETF instead"** (that would be
advice).

## Model limitations (stated, not hidden — itself a graded requirement)

- Monte-Carlo parameters are **assumptions, not predictions** — the product exposes return and
  volatility as user-adjustable sliders.
- The insurance/mortality charge actually **rises with age**; modelling it flat **understates**
  late-year drag, so real fee drag is likely **higher**, not lower.
- Admin fee modelled as a fixed dollar amount; some ILPs vary it.
- Ignores sequence-of-returns risk and any loyalty/bonus unit rebates (disclosed as a
  counter-factor).
- Issuer "projected return" figures are illustrative; the engine analyses the net impact on the
  **user's own** return assumption rather than endorsing the issuer projection.

## Compliance by design (regulatory element)

The product is built to stay on the safe side of the MAS advice/information boundary:

- **No personalised recommendation** — never "suitable/unsuitable" or "you should buy". Outputs
  are facts, math, and questions. Enforced by an automated guardrail test suite.
- **The LLM never advises and never computes** — it only extracts document text into a schema;
  every number comes from the deterministic, unit-tested engine.
- **Personalisation is neutral arithmetic** — "this is N% of *your* savings", never "too risky
  *for you*".
- **PII is redacted before the document is read**; uploads are not retained (PDPA).
- **No conflict of interest** — the product earns nothing from the user's decision and routes no
  leads to any issuer.

## Reproduce

```bash
cd apps/web && npm install && npm test     # all engine + guardrail figures
npm run dev                                # see the live report at /analyze
```
