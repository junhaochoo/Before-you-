# Prototype Gaps — What's Lacking to Build a Full MVP

Goal: a working web app, deployable to a server, with a real frontend. This doc
lists everything the pitch leaves undefined that you must decide *before* building,
ordered by how badly it blocks the build.

## The single biggest gap: **the data layer / input mechanic**
Every module needs structured product data, but the pitch never says where it comes
from. This is the first thing to resolve. Three options:

| Option | How it works | Effort | MVP fit |
|---|---|---|---|
| **A. User uploads the document** (PHS / brochure / fact sheet PDF) → LLM extracts fields | User already holds the doc they were pitched | Medium | **✅ Recommended for MVP** — solves "decode *this* product", stays unconflicted, no licensing/data-deal needed |
| B. Structured product database (curated fund/ILP fees) | Pre-load common products | High (data sourcing, upkeep, possible licensing) | ❌ Too heavy for MVP; data-staleness + IP risk |
| C. Manual structured entry (user types fee %, etc.) | Form-based | Low | ✅ Fallback / always offer as override — but poor UX as the *only* path |

**Recommendation:** MVP = **A with C as fallback/edit layer**. User uploads PHS →
LLM extracts (product type, fees, guarantee language, lock-in, surrender charges,
key risks, projected returns) → fields shown in an **editable** form the user can
correct → deterministic math runs on the confirmed fields. The LLM extracts; it
does **not** advise. All quantitative outputs come from deterministic code, not the
LLM (this is critical for accuracy, defensibility, and the course's rigor bar).

## Gap-by-module: what each of the 5 modules needs that the pitch omits

### 01 Product Scan ("reads summary, flags key terms")
- **Missing:** the *taxonomy of products* (ILP? unit trust? structured note?
  endowment? FD? bond?) — each has different fields. **Scope MVP to 1–2 types**
  (recommend: ILP + unit trust, the highest-fee/highest-confusion classes).
- **Missing:** the **term dictionary / red-flag rubric** — the actual list of
  phrases and their plain-English meaning + why they matter (e.g. "indicative",
  "non-guaranteed", "surrender charge", "participating fund", "AUM fee", "bid-offer
  spread"). This rubric IS the product's IP; it must be authored, not improvised.
- **Missing:** guarantee-detection logic — does the doc state a capital guarantee,
  *who* provides it (issuer vs insurer vs none), and under what conditions.

### 02 Fee Lens ("full cost impact before purchase")
- **Missing:** the **fee model itself** (the math). See `06-analytical-component.md`
  — this is where the quantitative core lives. Needs: upfront/sales charge, annual
  management/wrap fee, fund-level TER, bid-offer spread, surrender/exit schedule,
  insurance/mortality charges (for ILPs). MVP needs a defined fee taxonomy + the
  compounding fee-drag formula.

### 03 RiskFit ("tests suitability against profile") — **redesign required**
- **Legal:** as named it is regulated advice. **Rename to "RiskFit Lens"** and make
  it output *neutral facts in context* (concentration %, dollar downside, lock-in
  vs the user's stated horizon) — **never** a "suitable/unsuitable" verdict. See
  regulatory doc §5.
- **Missing:** the **profiling instrument** — what questions build the "profile"?
  Minimum viable set: liquid savings, monthly income/expenses (liquidity buffer),
  investment horizon, existing concentration, stated objective. Keep it short.
- **Missing:** the **scoring/translation logic** — deterministic rules mapping
  profile + product to *contextual flags*, not a recommendation.

### 04 Decision Gap Checklist ("missing info / open questions")
- **Missing:** the **canonical checklist** — the master list of what a complete
  decision needs, so "gaps" = canonical minus what's present in the doc. This is
  authorable from MAS PHS structure (overview, risks, fees, exit) + the term rubric.
- This is the **easiest high-value module to build** and is fully compliant
  (it only produces *questions*). Good candidate for the MVP's hero feature.

### 05 Portfolio Mirror ("how this decision changes the portfolio") — **hardest**
- **Missing:** how the user's **existing portfolio** is captured. Manual entry for
  MVP (asset class + amount). Account-aggregation (SGFinDex) is a *later* stage —
  out of scope for the prototype.
- **Missing:** the portfolio math — concentration (Herfindahl/HHI), liquidity ratio
  shift, simple risk-contribution. Define in `06-analytical-component.md`.
- **Recommendation:** ship a **simplified Portfolio Mirror** in MVP (concentration +
  liquidity-impact only); defer correlation/risk-contribution to v2.

## Cross-cutting build gaps (not in the pitch at all)
1. **Accounts & persistence** — sign-up, saved reports, profile storage (the
   monetisation tiers assume accounts). Auth + a datastore.
2. **PDPA / data handling** — uploaded documents and financial profiles are
   sensitive personal data. Need consent, encryption at rest, retention/deletion,
   and ideally *ephemeral* processing (don't retain the raw doc longer than needed).
3. **LLM extraction reliability** — hallucinated fees are a credibility (and
   liability) killer. Need: structured extraction with confidence flags, the
   user-confirmation step, and "we couldn't find this — please enter it" rather than
   guessing. Deterministic math only on *confirmed* numbers.
4. **Disclaimers & compliance copy** — surfaced on every report.
5. **No-product-recommendation guardrail** — the LLM must be constrained to
   *explain and question*, never to recommend buy/sell or rank products to purchase.
6. **Content authoring** — the term rubric, checklist, and question bank are
   *content* deliverables, not code. They are the durable IP and the slowest thing
   to get right.

## Recommended MVP thin-slice (build this, not all five modules)
A demo-able, gradeable, deployable slice:

1. **Upload a PHS/fact sheet** (scope to ILP **or** unit trust) → LLM extract →
   editable confirmation form.
2. **Fee Lens** (the quantitative hero): deterministic total-cost-of-ownership +
   fee-drag-over-time chart, in **dollars**, with a Monte-Carlo or scenario-based
   downside band. *(This carries the course's analytical-rigor grade.)*
3. **RiskFit Lens (compliant)**: enter liquid savings + horizon → show
   concentration %, dollar downside, lock-in-vs-horizon flag. Context, not verdict.
4. **Decision Gap Checklist + questions to ask** (compliant, high-value, cheap).
5. **Defer for v2:** full Portfolio Mirror, multi-product, account aggregation,
   crowd-sourced fee benchmarks, family access.

This slice is buildable, compliant, demonstrates real quant, and tells a complete
story end-to-end — exactly what both the grade and an investor want to see.

## Suggested tech shape (lightweight, deployable)
- **Frontend:** React/Next.js (SPA + report view + charts). Deploy to Vercel/Netlify
  or a Node server.
- **Backend:** thin API for upload, LLM extraction call, and the deterministic
  finance engine (the math runs server-side or even client-side; keep it
  deterministic and testable).
- **LLM:** one provider for *extraction only*, tightly prompted, JSON-schema output,
  confidence flags. Per the course/CLAUDE.md, model name + key come from `.env`.
- **Storage:** a small DB for accounts/saved reports; encrypt sensitive fields;
  short retention for raw uploads.
- **The finance engine is the crown jewel** — pure, deterministic, unit-tested
  functions. This is what makes the demo credible and the grade defensible.
