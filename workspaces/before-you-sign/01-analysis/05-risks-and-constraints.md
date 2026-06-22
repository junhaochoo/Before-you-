# Risks, Constraints & Limitations

Organised as the brief asks: regulatory, operational, and model/technology — plus
business risks. Each with a concrete mitigation. This whole document is a graded
requirement (brief element #5) and is currently absent from the pitch.

## 1. Regulatory risks (highest severity)

| Risk | Detail | Mitigation |
|---|---|---|
| **Unlicensed financial advice (FAA)** | "RiskFit — tests suitability" as written is a *personalised recommendation* = regulated advice; operating without a Financial Adviser's licence is an offence | Redesign to **information/education** only: output facts, math, and *questions* — never "suitable/unsuitable" or buy/don't-buy. Rename "RiskFit" → "RiskFit Lens (context, not advice)". Prominent disclaimers. (See `01-research/01-regulatory-singapore.md`.) |
| **Drifting across the line via "personalisation"** | Tailoring outputs to the user's profile is exactly what defines advice | Keep personalisation to **neutral arithmetic** (your number × the product's number); show thresholds as *general industry context*, not directives |
| **PDPA (data protection)** | Uploaded documents + financial profiles are sensitive personal data | Consent at collection; encryption at rest/in transit; data minimisation; short retention / ephemeral processing of raw docs; deletion on request; clear privacy policy |
| **Defamation / disparagement of issuers** | Flagging a named product's fees as "high" could draw issuer complaints | Anchor every claim to the **document's own words** + neutral math; "high relative to typical X" with a cited basis; avoid editorialising |
| **Regulatory obsolescence** | MAS's PHS enhancements + pre-transaction alerts (2025–26) partly cover fee/risk disclosure | Differentiate on **personal context + cross-product/portfolio synthesis** — things the per-product, issuer-authored PHS structurally cannot do |
| **IP / data licensing** | A curated product/fee database may infringe issuer IP or licensing terms | MVP avoids this by analysing the **user's own uploaded document**, not a scraped database |

> **Net:** the regulatory posture is *survivable and even advantageous* if the
> product stays disciplined on the information/education side. The boundary is the
> positioning, not just a constraint.

## 2. Operational risks

| Risk | Detail | Mitigation |
|---|---|---|
| **Document variety & extraction reliability** | PHS/brochures vary by issuer & product type; bad extraction → wrong fees → broken trust | Scope MVP to 1–2 product types; structured-schema extraction with **confidence flags**; **user-confirmation step** before any math; "couldn't find — please enter" instead of guessing |
| **Content maintenance** | The term rubric, checklist, question-bank, and fee benchmarks decay as products & rules change | Treat content as a maintained product with an owner & review cadence; version it |
| **Liability if a number is wrong** | A user relies on a miscalculated fee/downside | Deterministic, unit-tested math; show assumptions; disclaimers; never present LLM output as a computed figure |
| **Trust / credibility cold-start** | A new consumer tool handling money decisions must earn trust fast | Lead with transparency (show the math, cite the doc), MoneySense/employer endorsement, no-conflict guarantee front-and-centre |
| **Cost of LLM at scale** | Extraction cost per document erodes margin | Cap with cheaper models for extraction, caching, batching; deterministic math is ~free |
| **Adversarial / junk uploads** | Users upload the wrong file or garbage | Validation, file-type/format checks, graceful failure |

## 3. Model & technology limitations (be honest — this is graded)

| Limitation | Detail | Mitigation / honest framing |
|---|---|---|
| **Simulation parameters are assumptions** | Monte Carlo μ/σ are estimates, not forecasts | Surface them; let users vary them via sliders; label outputs as scenarios not predictions |
| **Garbage-in on returns** | Product "projected returns" are issuer figures | Show net-of-fee impact on *their own* number; offer a neutral benchmark comparison |
| **LLM extraction errors / hallucination** | Model may misread a figure | Confidence flags + mandatory user confirmation; deterministic math only on confirmed values |
| **No access to full holdings** | Portfolio Mirror relies on what the user enters | MVP = manual entry; clearly scope; aggregation (SGFinDex) is a later, consent-based stage |
| **Insurance/ILP complexity** | Mortality charges, bonuses, par-fund mechanics are intricate | Scope carefully; model the dominant cost drivers; disclose simplifications |
| **Behavioural limits** | A tool can inform but not stop a determined/pressured buyer | Frame as decision *hygiene*, not a guarantee; "questions to ask" empowers the moment of sale |

## 4. Business / market risks

| Risk | Detail | Mitigation |
|---|---|---|
| **Low purchase frequency (B2C)** | Consumers buy products rarely → weak subscription retention | Lead B2B2C (always-on access via employer/adviser); B2C as funnel |
| **Willingness to pay** | Hard to charge consumers for a one-off report | Price as cheap insurance on a large decision; push value to B2B2C buyers |
| **Incumbent/channel hostility** | Banks & tied agencies may dislike a fee-exposer | Don't depend on their cooperation; partner with the *fee-only* side & employers |
| **Defensibility of the "reading" feature** | LLM doc-reading is commoditising | Moat is the **rubric + fee math + personal/portfolio context + unconflicted brand**, not the reading |

## 5. What to put on the "Risks" slide
Lead with the **FAA advice boundary** (shows regulatory sophistication — examiners
love this), then **data/PDPA**, then **extraction reliability**, then **model
assumptions** (honest limitations), then **B2C frequency/WTP**. For each: one-line
risk + one-line mitigation. This single slide moves the proposal from "student idea"
to "grounded in real-world constraints" — exactly the brief's closing expectation.
