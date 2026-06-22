# Master Gap Register — every flaw to resolve before the proposal is "investment-quality"

Severity: 🔴 Critical (blocks grade / build / legality) · 🟠 High (materially caps a
grade element) · 🟡 Medium (polish that separates A from A+).

Each gap has: the flaw, why it costs marks, and the resolution direction. Resolving
all 🔴 + 🟠 is what moves every brief element from B/C into A territory.

---

## A. STRATEGIC / CROSS-CUTTING FLAWS (the deep ones — fix these first)

### A1 🔴 The adoption-timing problem (currently fatal, unaddressed)

The product needs the user to **pause and run a report at the exact moment they are
being pitched** — when they are most excited, most pressured, and least likely to
stop. The buyer who most needs it (pressured, low-literacy) is the _least_ likely to
use it; the buyer who _would_ use it is already the careful type who needs it least.
This is the single biggest threat to the whole idea and the pitch ignores it.

- **Why it costs marks:** "feasibility of implementation" + "soundness of business
  model" both collapse if no one uses it at the decision point.
- **Resolution:** (1) Exploit Singapore's **14-day free-look period** for insurance/
  ILPs — reposition part of the product as a _post-signing, pre-commitment_ safety
  net ("you've signed but can still cancel with little/no penalty — let's check before
  day 14"). [Free-look refund precision per red-team H1.]
  This is a natural, high-intent usage window the pitch completely misses. (2)
  **B2B2C embedding** so the tool is pushed to the user by an employer/adviser
  _before_ they shop, not discovered in the moment. (3) A 60-second "quick scan"
  entry point for the pressured moment, full report later.

### A2 🔴 "Why would I not just paste this into ChatGPT?"

With free LLMs, "reads the document and explains it" is commoditised. The proposal
has no crisp answer to the substitution threat.

- **Why it costs marks:** "originality" + "feasibility" — examiners will ask this.
- **Resolution:** crisp, defensible answer = (a) **deterministic fee/risk math** a
  chatbot can't reliably do, (b) **your personal & portfolio context** persisted
  across reports, (c) a **structured, audited rubric** (no hallucinated fees;
  confidence flags + user confirmation), (d) **compliance guardrails** (a chatbot
  will happily give regulated advice; you won't), (e) **saved profile + benchmarks**.
  Build this into a one-slide "why us vs a chatbot" comparison.

### A3 🟠 Beachhead is undefined (trying to serve everyone = serving no one)

Five user types, three product types, B2C+B2B2C all at once. No single
wedge to nail first.

- **Why it costs marks:** "focused, practical" is an explicit brief expectation.
- **Resolution:** pick ONE beachhead for the MVP + proposal narrative (see decision
  needed below). Recommended: **mass-affluent pre-retiree being sold an ILP** — the
  highest ticket, highest fee-drag, highest regret, clearest "Person A" math.

### A4 🟠 Document-availability assumption is shaky

The flow assumes the user _has_ the PHS/brochure. Often the hard sell is verbal and
the document only appears at/after signing.

- **Resolution:** support three entry modes — (1) upload document, (2) "I only have
  what the agent told me" → guided structured entry of the verbal claims → the tool
  generates the _questions and documents to demand_, (3) post-signing free-look
  review. Mode 2 is also the most compliant (pure question-generation).

### A5 🟠 Cold-start / no benchmark data on day one

"This 1.8% fee is top-quartile" requires a corpus you don't have at launch.

- **Resolution:** seed a reference set from **publicly available PHS / fund fact
  sheets** (fees are disclosed) before launch; state the seeding method; grow it
  with usage. Don't claim a network effect you can't bootstrap.

---

## B. PROBLEM / USERS / MARKET (lift A– → A)

### B1 🟠 No market sizing (TAM/SAM/SOM)

No numbers on how many of these products are sold annually in SG, average ticket, or
addressable spend. An investment-quality pitch needs a sized opportunity.

- **Resolution:** build a TAM/SAM/SOM from public figures (SG insurance/ILP new
  business premiums, unit-trust AUM, MAS/LIA statistics); state assumptions.

### B2 🟠 Problem evidence is partly the wrong evidence

FIDReC's surge is heavily **scam**-driven; that is not the same as _mis-selling /
information-asymmetry at point of sale_, which is the problem you actually solve.

- **Resolution:** cite evidence specific to **product mis-selling, fee opacity, and
  free-look/surrender behaviour** (LIA persistency/lapse data, mis-selling cases,
  MAS Fair Dealing findings, the MAS PHS-enhancement consultation as regulator
  acknowledgement). Keep the FIDReC number as colour, not the core proof.

### B3 🟡 "Why now" not articulated

- **Resolution:** three converging tailwinds — cheap LLM document-reading (supply),
  MAS disclosure push + complaints (demand/regulatory), high commission-driven
  distribution (structural). One slide.

### B4 🟡 Competitor map lacks named local players

- **Resolution:** name and position the real SG/adjacent set (MoneySense, Seedly,
  MoneyOwl [closed — instructive], Providend/fee-only planners, robo-advisers,
  comparison sites) — including _failed_ ones and why you differ.

---

## C. PRODUCT DESIGN / UX (lift B → A)

### C1 🔴 No screens / wireframes / report artefact

The brief grades "product design and user experience" and there is currently nothing
to see. A described module is not a designed product.

- **Resolution:** wireframe the core flow + design what a finished **report** looks
  like (the Fee Lens chart, the RiskFit context panel, the questions sheet). For the
  MVP this becomes the actual frontend.

### C2 🟠 The risk-profiling instrument is undefined

"Tests suitability against profile" — but what questions? what scoring?

- **Resolution:** define a short, defensible profiling questionnaire (liquid savings,
  expenses, horizon, existing concentration, objective) and the **deterministic**
  rules that turn it into _contextual flags_ (not a verdict — see D-compliance).

### C3 🟠 Onboarding friction underestimated

Upload a document + key in your finances = heavy first-run. High drop-off.

- **Resolution:** progressive disclosure — instant value from the free scan with
  minimal input; ask for financials only when the user reaches RiskFit/Portfolio.

### C4 🟡 Trust UX undefined

Users won't trust money numbers from an unknown tool.

- **Resolution:** "show your work" everywhere (cite the document line, show the
  formula, show assumptions), confidence flags, no-conflict badge, disclaimers.

---

## D. BUSINESS MODEL (lift B– → A)

### D1 🔴 No numbers anywhere (the brief explicitly wants "key drivers of economics")

No pricing points, no CAC, no LTV, no conversion, not even illustrative.

- **Resolution:** an illustrative unit-economics model — B2C price points, free→paid
  conversion %, B2B2C per-seat pricing, CAC by channel, marginal cost per report
  (dominated by LLM extraction cost), gross margin, simple LTV/CAC. Assumptions
  stated. This is also a mini analytical artefact (doubles into element 4).

### D2 🟠 B2B2C demand is asserted, not validated

Will employers / fee-only advisers actually buy?

- **Resolution:** name the buyer, their budget line (wellness benefits; client-trust
  tooling), the value quantified (e.g. one avoided bad ILP > annual seat cost), and
  a go-to-market sequence. Cite the existence of corporate financial-wellness spend.

### D3 🟠 Monetisation vs neutrality tension not resolved on the data play

Selling aggregated fee data could compromise the unconflicted brand if mishandled.

- **Resolution:** explicit rule — never sell user-level data, never sell to the
  issuers analysed; only anonymised, aggregated insight to non-conflicted buyers.

### D4 🟡 No go-to-market sequencing / milestones

- **Resolution:** phase it — consumer free tool (brand+data) → fee-only adviser
  partners → employer benefit → benchmark data. Tie to the build roadmap.

---

## E. ANALYTICAL / QUANTITATIVE COMPONENT (lift C → A — biggest single win)

### E1 🔴 Models are specified but never demonstrated with real numbers

A spec is not analysis. The course grades _demonstrated_ quantitative reasoning.

- **Resolution:** produce a **fully worked example** on a _real, representative_ ILP/
  unit trust: actual fee schedule → fee-drag in dollars → Monte Carlo downside →
  concentration math → the report it produces. Numbers, charts, the lot.

### E2 🔴 Parameter sourcing is hand-waved

μ, σ per asset class and the fee inputs need defensible sources, or the simulation is
"garbage in."

- **Resolution:** cite sources for asset-class return/vol assumptions (long-run
  index data) and pull real fee figures from a public PHS. State every assumption;
  add a **sensitivity analysis** (how the answer moves with μ, σ, fee).

### E3 🟠 No validation / backtest with real historical data

- **Resolution:** the fee-gap backtest (Engine 5) on real historical index series vs
  a real product fee load — concrete "this fee structure would have consumed X% of
  market return over 1995–2025." High-credibility, high-grade.

### E4 🟠 No statement of model limitations alongside the model

Honest limitation disclosure is itself a graded expectation.

- **Resolution:** for each engine, a one-line "what this does NOT capture" (sequence
  risk, regime change, issuer projection bias, parameter uncertainty).

---

## F. RISKS & CONSTRAINTS (lift D → A)

### F1 🔴 Not yet in the proposal at all

The analysis exists (`05-risks-and-constraints.md`) but the _deliverable_ has no risk
treatment. The brief grades this directly.

- **Resolution:** a structured risk slide — FAA advice boundary (lead), PDPA, model
  assumptions, extraction reliability, adoption, each with a mitigation.

### F2 🟠 The compliant redesign of RiskFit is described but not "decided"

- **Resolution:** lock the design rule: facts/math/questions only, no verdict; bake
  it into the spec and the UI copy; make it a feature, not an apology.

### F3 🟡 No liability / professional-indemnity treatment

- **Resolution:** note PI-insurance + disclaimers + deterministic-math-only as the
  liability posture.

---

## G. FEASIBILITY / IMPLEMENTATION (lift → A)

### G1 🔴 Extraction reliability is the core technical risk, unmitigated in the plan

A hallucinated fee destroys trust and creates liability.

- **Resolution:** structured-schema extraction + confidence flags + mandatory user
  confirmation + "not found, please enter" + deterministic math only on confirmed
  values + a regression fixture set of real PHS documents.

### G2 🟠 No demo dataset

You can't demo or test without sample products.

- **Resolution:** assemble 3–5 real public PHS documents as the demo/test corpus.

### G3 🟡 Scope creep across 5 modules × 3 product types

- **Resolution:** MVP thin-slice already defined (`03-prototype-gaps.md`) — enforce
  it: one product type, Fee Lens + downside as hero, compliant RiskFit, Decision Gap.

---

## RESOLUTION STATUS (2026-06-22 — all Critical + High resolved in docs)

| Gap                                  | Status               | Resolved in                                    |
| ------------------------------------ | -------------------- | ---------------------------------------------- |
| A1 timing                            | ✅                   | `09` free-look wedge + 3 entry modes           |
| A2 anti-chatbot                      | ✅                   | `09` moat table                                |
| A3 beachhead                         | ✅                   | `09` (pre-retiree + ILP, locked)               |
| A4 doc availability                  | ✅                   | `09` three entry modes                         |
| A5 cold-start                        | ✅                   | `09` public-PHS seeding                        |
| B1 sizing                            | ✅                   | `12` TAM/SAM/SOM (LIA-anchored)                |
| B2 evidence                          | ✅                   | `12` CASE 45% + RIY + fee-only signal          |
| B3 why-now / B4 competitors          | ✅                   | `12`                                           |
| C1 wireframes/report                 | ✅                   | `13` screens + report artefact                 |
| C2 profiling instrument              | ✅                   | `13` 5-input instrument                        |
| C3 onboarding / C4 trust UX          | ✅                   | `13`                                           |
| D1 unit economics                    | ✅                   | `11` (consumer freemium-first + drivers)       |
| D2 B2B2C / D3 neutrality / D4 GTM    | ✅                   | `11`                                           |
| E1 worked example                    | ✅                   | `10` real ILP, S$115k/36% drag, S$100k fee gap |
| E2 parameter sourcing                | ✅                   | `10` sourced inputs + sensitivity              |
| E3 backtest / E4 limitations         | ✅                   | `10`                                           |
| F1 risk slide                        | ✅                   | `14` deliverable-ready                         |
| F2 RiskFit locked / F3 liability     | ✅                   | `14` + `specs/compliance-guardrails.md`        |
| G1 extraction reliability            | ✅                   | `15` confirm-step architecture                 |
| G2 demo dataset / G3 scope           | ✅                   | `15`                                           |
| 🟡 Medium polish (B3/B4/C4/D4/E4/F3) | ✅ folded into above | —                                              |

**Net:** every 🔴 Critical and 🟠 High gap now has a concrete, sourced resolution.
Remaining work is execution (build the MVP) + assembling the deck, not analysis.

## Resolution priority (what to do, in order)

1. **A1, A2, A3** — fix the strategic flaws (timing wedge, anti-chatbot moat,
   beachhead). Everything else hangs off these.
2. **E1, E2** — build the worked quantitative example. Biggest single grade lift.
3. **D1** — the unit-economics model (also feeds element 4).
4. **C1** — wireframes + the report artefact (the MVP frontend).
5. **B1, B2, F1** — sizing, correct evidence, risk slide.
6. Everything 🟡 — polish to push A → A+.
