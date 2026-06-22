# Spec — Analytical Engine (deterministic finance core)

Authority on the quantitative engine. Full derivations in
`../01-analysis/06-analytical-component.md`. Build order: Engine 1 → 2 → 3 → 4.

## Principles
- Pure, deterministic, **unit-tested** functions. No LLM in the math path.
- Every output exposes its assumptions (return, vol) as user-adjustable inputs.
- Inputs arrive only after user confirmation of extracted fields.

## Engine 1 — Fee drag / total cost of ownership
- In: principal, horizon, gross return, upfront charge, annual mgmt fee, TER,
  bid-offer spread, surrender schedule, (ILP) insurance charge.
- Out: total fees (S$), fee drag (%), break-even surrender year, gross-vs-net curve.

## Engine 2 — Downside simulation
- Scenario band (deterministic) **and** Monte Carlo (N=10,000, normal/lognormal/t).
- Out: P5/P50/P95 final value, probability of loss, expected shortfall, max drawdown.
- Params seeded by asset class; user-adjustable; labelled "scenarios, not forecasts".

## Engine 3 — RiskFit Lens (compliant context)
- Out: concentration = A/(L+A); liquidity buffer months = (L−A)/C; stress dollar
  impact = A×P5 drawdown; lock-in-vs-horizon flag. **Context only, no verdict.**

## Engine 4 — Portfolio Mirror (simplified for MVP)
- Out: HHI before/after, liquidity ratio shift. (v2: covariance risk-contribution.)

## Engine 5 — Fee backtest (stretch)
- Net-of-fee product vs low-cost benchmark over rolling historical windows;
  output the historical fee-gap distribution. Factual comparison only.

## Test obligations
- Golden-value unit tests for each formula (hand-checked cases).
- Monte Carlo seeded RNG for reproducible test runs.
- Property test: fees ≥ 0, net ≤ gross, concentration ∈ [0,1].
