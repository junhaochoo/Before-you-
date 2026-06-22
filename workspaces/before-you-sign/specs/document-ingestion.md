# Spec — Document Ingestion (data layer)

Authority on how product data enters the system. Rationale in
`../01-analysis/03-prototype-gaps.md`.

## Source documents (red-team M1 — correct ILP taxonomy)
For insurance ILPs the regulated documents are: **Product Summary**, **Benefit
Illustration (Policy Illustration)**, and **sub-fund fact sheet / PHS**. The
**Benefit Illustration is the primary target** — by regulation it shows the
effect-of-deductions and early-surrender values, so the fee data is concentrated
there. (A "Product Highlights Sheet" alone is the capital-markets-product document,
not the ILP one — do not mislabel.)

## Flow
1. User uploads the ILP **Product Summary + Benefit Illustration** (+ sub-fund fact
   sheet), or selects manual entry.
1b. **PII redaction before the LLM (red-team M2):** deterministically strip
   name/NRIC/policy-number; send only the fee/structure/effect-of-deductions tables.
   Enterprise LLM tier with contractual no-training; stated data residency.
2. LLM extraction → JSON schema (below), with per-field **confidence**.
3. Editable confirmation form; low-confidence or missing fields flagged
   "please verify / enter". **No math runs on unconfirmed fields.**
4. Confirmed fields persist (encrypted) to the report.

## Extraction schema (MVP — scope to ILP + unit trust)
- `product_type`, `issuer`, `guarantee` {stated: bool, provider, conditions}
- `fees` {upfront_pct, annual_mgmt_pct, ter_pct, bid_offer_pct, insurance_charge_pct}
- `surrender_schedule` [{year, penalty_pct}]
- `lock_in_years`, `projected_return_pct` (issuer figure), `key_risks` [text]
- `flagged_terms` [{term, plain_english, why_it_matters}]

## Rules
- Extraction is text→schema only; never infers a fee not in the document — emits
  "not found" instead of guessing.
- Provider/model/key from `.env` (per repo convention); cheapest adequate model.
- Raw upload retained ephemerally; deleted per retention policy (PDPA).

## Test obligations
- Schema-validation on every extraction; reject/flag malformed.
- Fixture PHS documents → expected extracted fields (regression set).
- Confidence threshold forces user confirmation below cutoff.
