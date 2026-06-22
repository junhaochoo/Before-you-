# Risk Treatment — Deliverable-Ready (resolves F1–F3)

The full analysis lives in `05-risks-and-constraints.md`. This is the *slide-ready*
treatment for the proposal: lead risks, each with a concrete mitigation, ordered by
how much an examiner/investor cares.

## The risk slide (lead with regulatory — it shows sophistication)
| # | Risk | Severity | Mitigation (one line) |
|---|---|---|---|
| 1 | **Unlicensed financial advice (FAA)** — "suitability" = regulated advice | 🔴 | Information/education only: facts, math, questions; **no buy/suitability verdict**; RiskFit reframed as *context*; disclaimers everywhere |
| 2 | **PDPA** — uploaded docs + financial profiles are sensitive data | 🔴 | Consent, encryption, data-minimisation, short/ephemeral retention of raw docs, deletion-on-request |
| 2b | **Third-party LLM data transfer** (red-team M2) — sending a Benefit Illustration (name, NRIC, age, financials) to an external/cross-border LLM | 🔴 | **Redact PII before extraction** (strip name/NRIC; send only the fee/structure table); enterprise LLM tier with a **contractual no-training guarantee**; stated data-residency posture; consent at upload |
| 3 | **Extraction error / hallucinated fee** — wrong number = lost trust + liability | 🔴 | Confidence flags + **mandatory user confirmation** + "not found, please enter" + deterministic math only on confirmed values + PHS regression fixtures |
| 4 | **Adoption timing** — users don't pause at the pitch | 🟠 | **Free-look wedge** (high-intent post-signing window) + three entry modes |
| 5 | **Model assumptions** — sim params aren't forecasts | 🟠 | Sliders + explicit "scenarios not predictions" + sensitivity table |
| 6 | **Regulatory obsolescence** — MAS improves PHS disclosure | 🟠 | Differentiate on personal + cross-product context the PHS structurally can't give |
| 7 | **Defamation** — flagging a named product's fees | 🟡 | Anchor every claim to the document's own words + neutral math |
| 8 | **Channel hostility** — banks/agencies dislike a fee-exposer | 🟡 | Consumer-side + fee-only partners; don't depend on incumbents |
| 9 | **Low purchase frequency** — weak B2C retention | 🟡 | Free-look + family + review cadence lift frequency |

## F2 — The compliant RiskFit design is LOCKED (decided, not "described")
Product rule, enforced in code + copy (`specs/compliance-guardrails.md`):
- Output = neutral arithmetic (concentration %, dollar downside, lock-in-vs-horizon)
  + general industry context + questions.
- **Never** "suitable/unsuitable", "you should/shouldn't", or a product ranking-to-buy.
- A guardrail test suite asserts no report path emits a verdict; disclaimer present
  on every render.
This is presented as a *feature* (your unconflicted, non-advice posture), not an
apology.

## F3 — Liability posture
- Deterministic, unit-tested math (no LLM in the number path).
- Prominent disclaimers + "general information only" framing.
- Professional-indemnity insurance noted as an operating cost at scale.
- Clear T&Cs: the tool informs and generates questions; it does not advise or
  execute, and the user remains the decision-maker.

## Why this scores
The brief's closing expectation is "grounded in real-world constraints." A risk
slide that *leads with the correct regulatory boundary* (and turns it into
positioning), then covers data, model, and adoption honestly, is precisely what
moves the proposal from "student idea" to "investment-quality."
