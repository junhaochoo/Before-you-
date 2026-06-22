# The Analytical / Quantitative Engine (Course Core)

This is the most heavily graded element and the thinnest part of the pitch. Below
are concrete, defensible models — formulas, inputs, outputs — that are (a) rigorous
enough for a *Financial Analytics* course, (b) buildable in a browser with
deterministic code (no ML needed for v1), and (c) directly visualised in the report.
Pick **Engine 1 + Engine 2 as the hero**, add 3–4 as depth.

Design principle: **the LLM extracts inputs; deterministic math produces every
number.** Never let the model "compute" — it estimates text, not finance.

---

## Engine 1 — Fee Lens: Total Cost of Ownership & Fee Drag
**The headline number: "This product will cost you S$X over Y years, and reduce your
final value by Z%."**

**Inputs:** principal `P`, horizon `T` years, gross expected return `g` (annual),
sales/upfront charge `s` (% of P), annual management/wrap fee `m`, fund TER `f`,
bid-offer spread `b`, surrender/exit schedule `e(t)`, (ILP) annual insurance/mortality
charge `i`. All extracted from the PHS, user-confirmed.

**Net-of-fee growth (annual recursion):**
```
V(0)   = P · (1 − s) · (1 − b)            # net of upfront + spread
V(t)   = V(t−1) · (1 + g − m − f − i)     # each year, fees compound against you
Final_net   = V(T)
Final_gross = P · (1 + g)^T               # fee-free counterfactual
```
**Outputs:**
- **Total fees paid** = `Final_gross − Final_net` (in dollars — the hero number).
- **Fee drag** = `1 − Final_net / Final_gross` (% of wealth lost to fees).
- **Break-even surrender year** = smallest `t` where `V(t)·(1 − e(t)) ≥ P` (when you
  could exit without a loss purely from charges).
- **Chart:** two compounding curves (gross vs net) diverging over time — the visual
  is visceral and is the demo's money shot.

**Why it's rigorous:** it's the standard reduction-in-yield / fee-compounding model
regulators use; the compounding makes a "small" 1.5–2% fee erase 25–40% of a
multi-decade outcome — a result that surprises users and grades well.

---

## Engine 2 — Downside / "What happens if I buy this?" Simulation
**Turns "safe growth" into a distribution of outcomes in dollars.**

Two implementations (offer both; Monte Carlo is the rigorous one):

**(a) Scenario band (deterministic, cheap):** show value paths under
gross return `g ∈ {−2σ, −σ, 0, +σ}` around the product's stated/assumed return,
net of fees. Plain, transparent.

**(b) Monte Carlo (the rigorous hero):** model annual return as
`r_t ~ Normal(μ, σ²)` (or lognormal / Student-t for fat tails), `μ` and `σ`
seeded from the product's asset class (e.g. equity ILP μ≈5–7%, σ≈15%; balanced
μ≈4%, σ≈8%). Simulate `N = 10,000` net-of-fee paths over `T`.
**Outputs:** distribution of final value; **P5 / P50 / P95** outcomes;
**probability of loss** `P(V(T) < P)`; **expected shortfall** (mean of worst 5%);
**max drawdown** distribution. Present as: *"In the worst 5% of scenarios you end
with S$___; the chance of being underwater after `T` years is __%."*

**Why it's rigorous:** standard risk-modelling (MC, VaR/ES, drawdown). Directly
answers the pitch's headline question with quantified uncertainty, and exposes that
"7% returns a year" is a mean, not a guarantee. **Caveat to state honestly:**
parameters are assumptions, not predictions — surface them and let users vary them
(a slider). Model-limitation disclosure is itself graded (brief requirement #5).

---

## Engine 3 — RiskFit Lens: Concentration & Liquidity Impact (compliant)
**Operationalises the pitch's Person-A/Person-B insight. Context, not a verdict.**

**Inputs:** liquid savings `L`, monthly expenses `C`, this product's amount `A`,
existing holdings `{w_i}`.

**Metrics (all neutral, factual):**
- **Concentration** = `A / (L + A)` → "this product = N% of your liquid wealth."
- **Liquidity buffer after purchase** = `(L − A) / C` months of expenses remaining.
- **Stress dollar impact** = `A × drawdown%` from Engine 2's P5 → "a 1-in-20 bad
  year ≈ −S$___, leaving you __ months of expenses."
- **Lock-in vs horizon flag** = compare surrender schedule end vs user's stated
  horizon → "funds are penalised on exit until year __; you said you may need them
  in year __." (Factual mismatch surfaced, not a recommendation.)

**Output framing (must stay legal):** thresholds shown as *general industry context*
("concentration above ~20% in a single product is often flagged"), never "this is
unsuitable for you." See `01-research/01-regulatory-singapore.md` §5.

---

## Engine 4 — Portfolio Mirror: Concentration & Risk Contribution
**Before/after view of the whole portfolio.**

- **HHI concentration index:** `HHI = Σ wᵢ²` before vs after adding the product
  (rises = more concentrated).
- **Liquidity ratio shift:** liquid / total, before vs after.
- **(v2) Risk contribution:** with asset-class vols & a simple correlation matrix,
  portfolio vol `σ_p = √(wᵀΣw)` and each holding's marginal risk contribution —
  shows whether the new product *diversifies* or *piles on* existing risk.

MVP: HHI + liquidity shift (cheap, clear). Defer the covariance version to v2.

---

## Engine 5 — (Stretch) Mis-selling / Value-for-money Backtest
**A simple backtest that grades very well if time allows.**

Take a representative ILP/par-product's fee structure and **backtest net-of-fee
outcomes against a low-cost benchmark** (e.g. a global index ETF at ~0.2% TER) over
historical windows (rolling 10/20-yr). Output: distribution of the **fee gap** — how
much of the historical market return the product's fee load consumed vs the cheap
alternative. This is a concrete *backtest/simulation* (brief's exact wording) and
viscerally demonstrates the problem. Data: public index series; product fees from
PHS. Keep the comparison *factual* ("here is the historical cost difference"), not
"buy the ETF instead" (that would be advice).

---

## How this satisfies the grade
- **Pricing/cost framework:** Engine 1 (fee drag / reduction-in-yield).
- **Risk model:** Engine 2 (Monte Carlo, VaR/ES, drawdown).
- **Portfolio construction logic:** Engine 4 (HHI, risk contribution).
- **Backtest/simulation:** Engines 2 & 5.
- **Rigorous reasoning + honest limitations:** parameter sliders + explicit
  assumption disclosure (which is itself a graded requirement).

Recommendation: **build Engine 1 + Engine 2 fully** (they are the demo's spine and
the strongest grade), **add Engine 3** (it's the pitch's emotional core and cheap),
present Engine 4 simplified, and keep Engine 5 as a slide if time is short.
