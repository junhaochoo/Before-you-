# Assessment — "Before You Sign" vs the FNCE6041 Brief

**Verdict (one line):** A genuinely strong *problem* and *positioning* — among the
better fintech ideas because the pain is real, the insight (risk needs personal
context) is sharp, and the unconflicted angle is defensible. But as submitted it is
an **ideation pitch, not yet an investment-quality proposal**: it is thin exactly
where this course is graded hardest — the **analytical/quantitative component** —
and it is silent on the **regulatory boundary** that decides whether it can exist.

## Scorecard against the brief's six required elements

| Brief requirement | Pitch coverage | Grade | What's missing |
|---|---|---|---|
| **1. Problem, users, market** | Strong problem framing + memorable worked example | **A–** | Target user not segmented; no market sizing; no quantified evidence of harm (now sourced — FIDReC) |
| **2. Product design & UX** | 5 clear modules, good "key question" framing | **B** | No user journey, no data-input mechanics (where does the product data come from?), no screens; modules described as *what* not *how* |
| **3. Business model** | 5-tier freemium ladder exists | **B–** | No unit economics, no CAC/WTP reasoning, B2C-only (fragile), no pricing rationale; ignores B2B2C which is the stronger path |
| **4. Analytical / quantitative component** | Implied (fee impact, downside scenarios, portfolio impact) but **not specified** | **C / FAIL-RISK** | **This is the graded core and it is the biggest gap.** No model, no formulas, no backtest/simulation specified. See `06-analytical-component.md` |
| **5. Risks & constraints** | Not addressed | **D** | No regulatory analysis (the FAA advice boundary is existential), no operational/data risks, no model limitations. See `05-risks-and-constraints.md` |
| **6. Investment-quality packaging** | Clean ideation slide | **B–** | Needs the full narrative arc, the numbers, and the "why now / why us / why feasible" |

## What is genuinely strong (lead with these)
1. **The problem is real and evidenced.** Information asymmetry at point-of-sale;
   FIDReC complaints at a 20-year high; the regulator itself is mandating better
   disclosure. This de-risks the "importance of the problem" evaluation criterion.
2. **The core insight is excellent and quantifiable.** "Same investment, different
   consequence" (Person A vs B) is both an emotional hook *and* a natural seed for
   the analytical engine (concentration / liquidity-impact math).
3. **The positioning is defensible.** Unconflicted, consumer-side, decode-don't-sell.
   This is a real USP, not a slogan — the selling channel cannot copy it.
4. **The module decomposition is sound** and maps cleanly to build-able features.

## What will lose marks / block the prototype (fix these)
1. **The analytical component is asserted, not demonstrated.** For a *Financial
   Analytics* course this is the centre of gravity. Must become concrete models
   with formulas, inputs, outputs, and at least one simulation/backtest. (Full
   proposal in `06-analytical-component.md`.)
2. **The regulatory boundary is unaddressed and existential.** "RiskFit — tests
   suitability" as written is regulated financial advice. The proposal must show
   awareness and a compliant design. (`01-research/01-regulatory-singapore.md`.)
3. **The data layer is undefined.** Every module needs product data — but the pitch
   never says where it comes from. This is the #1 *prototype-feasibility* gap.
   (`03-prototype-gaps.md`.)
4. **Business model lacks economics.** A 5-tier B2C ladder with no WTP evidence is
   weak; the defensible economics are B2B2C. (`04-business-model.md`.)
5. **"Suitability against profile" needs a defined profiling method** that stays on
   the legal side of the line and is analytically defensible (not a black box).

## How well does it fit the user's build goal (MVP on a web server)?
**Feasible and well-scoped for an MVP** *if* the data-input mechanic is resolved
(user uploads the PHS/brochure → LLM extraction → structured fields → deterministic
fee/risk math → report). The riskiest parts to build are (a) reliable document
extraction and (b) the portfolio module; both can be **scoped down** for the MVP
(see `03-prototype-gaps.md` for the recommended thin-slice). The analytical engine
is genuinely build-able with deterministic finance math (no ML required for v1),
which is ideal: it satisfies the course's rigor bar *and* runs in a browser.

## Bottom line
Keep the idea — it's one of the stronger problem/positioning combinations available.
Spend the group's remaining effort on the three things that convert it from "nice
idea" to "investment-quality + buildable": **(1) the quantitative engine, (2) the
compliant design of the suitability/risk module, (3) the data-input mechanic.**
Everything else is packaging.
