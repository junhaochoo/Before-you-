# Feasibility & Extraction Reliability (resolves G1–G2)

The single technical risk that can sink the product is a **wrong extracted number**
presented as fact. This doc makes the build defensible.

## G1 — Extraction reliability architecture (the trust-critical path)
**Principle: the LLM extracts text into a schema; it never advises and never
computes a financial figure. All numbers come from deterministic, tested code.**

Pipeline:
1. **PDF → text** (deterministic parse; OCR fallback for scanned docs).
1b. **PII redaction BEFORE the LLM (red-team M2)** — deterministically strip
   name/NRIC/policy-number; send only the fee/structure/benefit-illustration table to
   the model. Use an enterprise LLM tier with a contractual **no-training** guarantee
   and a stated data-residency posture (PDPA + the sensitivity of financial documents).
2. **LLM structured extraction** → strict JSON schema (`specs/document-ingestion.md`),
   temperature low, one field at a time where ambiguous.
3. **Per-field confidence** + **source-span citation** (which line/page it came from).
4. **Mandatory user-confirmation screen** — low-confidence or missing fields are
   flagged "please verify / enter"; the model **emits "not found" rather than
   guessing** a fee.
5. **Deterministic finance engine** runs only on **confirmed** values.
6. **Regression fixtures:** 3–5 real public PHS / benefit-illustration documents with
   hand-verified expected fields → catch extraction drift on every change.

**Why this is enough for an MVP + credible for the deck:** the failure mode (silent
wrong number) is structurally prevented — the worst case is "we couldn't read this,
please type it," which is honest and safe, not a confident wrong answer.

## G2 — Demo / test dataset
Assemble a corpus of **3–5 real, publicly available ILP/unit-trust PHS or benefit
illustrations** (fees are disclosed by regulation). Uses:
- Live demo for the presentation (upload → report end-to-end).
- Extraction regression fixtures.
- Seed for the fee-benchmark reference set (A5).

## MVP scope discipline (G3)
Enforce the thin-slice (`03-prototype-gaps.md`): **one product type (ILP)**, Fee Lens
+ downside sim as the hero, compliant RiskFit Lens, Decision-Gap checklist. Defer:
full Portfolio Mirror (ship concentration-only), unit trusts, account aggregation,
benchmark network effects, B2B2C.

## Recommended build shape (deployable)
- **Frontend:** Next.js/React (entry modes → confirm screen → report with the
  gross-vs-net chart). Deploy to Vercel/Node server.
- **Backend:** thin API — upload, LLM extraction (provider/model/key from `.env` per
  repo convention), and the **deterministic finance engine** (pure, unit-tested
  functions — the crown jewel; can even run client-side).
- **Storage:** small DB for accounts/saved reports; encrypt sensitive fields; short
  retention on raw uploads.
- **Tests:** golden-value unit tests for every formula; seeded-RNG Monte Carlo;
  extraction regression fixtures; a guardrail suite asserting no buy/suitability
  verdict is ever emitted.

This is a one-to-two-session build for an autonomous agent: the math is deterministic
and well-specified, the UI is a small number of screens, and the riskiest part
(extraction) is de-risked by the confirm-step design.
