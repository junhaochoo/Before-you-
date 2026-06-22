# Red Team — Round 2 + Convergence

**Posture:** L5_DELEGATED · **Round:** 2 · **Scope:** verify Round-1 fixes landed,
re-read adversarially for newly-introduced issues, sweep for residue.

## Round-1 fix verification (all 10 findings)

| ID  | Finding                                 | Fixed in                                  | Verified                                   |
| --- | --------------------------------------- | ----------------------------------------- | ------------------------------------------ |
| H1  | "walk away free" wrong for ILP (MVA)    | `09`, `08`, `13`                          | ✅ only corrective note remains            |
| H2  | index-fund comparison ignores insurance | `10` (BTIR framing)                       | ✅ grep confirms BTIR                      |
| H3  | CASE 45% unverified                     | `09`×2, `12`                              | ✅ all caveated, no uncaveated instances   |
| M1  | ILP doc taxonomy ("PHS")                | `09`, `13`, `specs`, INDEX note           | ✅ canonical taxonomy + normalization note |
| M2  | third-party LLM / PDPA                  | `14`, `15`, `specs`                       | ✅ PII-redaction + no-training tier added  |
| M3  | sizing not reconciled                   | `12`                                      | ✅ labelled rough + weighting caveat       |
| M4  | single vs regular premium               | `10`                                      | ✅ regular-premium note added              |
| L1  | Monte Carlo lognormal-primary           | `10`, `specs/analytical-engine` (already) | ✅                                         |
| L2  | fast-follower rebuttal                  | `12`                                      | ✅                                         |
| L3  | "areas of concern" framing              | `specs/compliance-guardrails`             | ✅                                         |

## Round-2 adversarial re-read — soft spots considered

1. **BTIR "excess cost ≈ S$90–100k" is illustrative** — the term-premium outlay
   reduces the invested leg; exact figure is engine-computed. _Disposition: accepted —
   explicitly labelled illustrative; not a precise claim._
2. **BTIR assumes the buyer needs the life cover** — if no dependents, even term is
   unneeded and the benchmark collapses toward a pure fund. _Disposition: handled by
   the compliance guardrail — BTIR is presented as a factual alternative comparison,
   NOT as "you don't need this insurance" (that judgement would itself be regulated
   advice). No fix needed; noted._
3. **Surrender "~year 10" in Engine 3** is illustrative/product-specific. _Disposition:
   low; sits in an illustrative context; the engine reads the actual surrender
   schedule from the Benefit Illustration._
   **No new CRITICAL/HIGH findings in Round 2.**

## Convergence statement (honest, artifact-appropriate)

This workspace is an **analysis/proposal**, not yet code. Therefore:

- **Applicable criteria — MET:** 0 unresolved Critical/High defensibility findings;
  every load-bearing quantitative claim independently recomputed (✅ clean); every
  load-bearing external fact either primary-verified or explicitly caveated
  (free-look 14-day + MVA ✅; LIA market figures ✅; RIY ✅; ILP doc taxonomy ✅;
  CASE 45% ⚠️ caveated-pending-primary); residue sweep clean across 2 passes.
- **Deferred to the build phase (N/A now — no code exists):** convergence criteria
  4–7 (AST/grep spec-compliance, new-module tests, 0 mock data, eval-harness). These
  attach when `/implement` produces the MVP. The `specs/` carry the test obligations
  (golden-value math tests, extraction fixtures, the no-advice-verdict guardrail
  suite) so they are enforceable at build time.

**Verdict: the resolution layer is internally consistent, evidence-grounded, and
defensible. Round 2 clean. Analysis-phase convergence reached.**

## Carry-forward to `/implement` (regression obligations)

The build's guardrail/eval suite MUST encode, as permanent regression checks:

- No report path emits a buy/sell/suitability verdict or "good/bad product" label (L3).
- Deterministic math only on user-confirmed fields; "not found" never guessed (G1).
- PII redacted before any LLM call (M2).
- Free-look copy never says "free" without the MVA qualifier (H1).
- Benchmark comparison uses BTIR, not a naked index fund (H2).
