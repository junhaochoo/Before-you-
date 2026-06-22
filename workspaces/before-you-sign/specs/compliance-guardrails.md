# Spec — Compliance Guardrails (the advice/information boundary)

Authority on what the product may and may not say/do, derived from
`../01-analysis/01-research/01-regulatory-singapore.md`. These are enforced as
product rules, not aspirations.

## Hard rules (MUST)
1. **No personalised recommendation.** Never output "suitable/unsuitable",
   "you should/shouldn't buy", or rank products to purchase. Outputs are facts,
   math, and questions.
2. **The LLM never advises and never computes finance.** It extracts text into a
   schema. All numbers come from deterministic, unit-tested code.
3. **Personalisation = neutral arithmetic only.** "This is N% of *your* number" is
   allowed; "this is too risky *for you*" is not.
4. **Thresholds shown as general industry context**, with a cited basis — never as
   a directive aimed at the user.
5. **Every report carries the disclaimer:** "General information only. Not financial
   advice. Not a recommendation. Consult a licensed financial adviser."
6. **No lead routing to a named product/issuer**; no commission/affiliate to a
   product being analysed (also a business-model rule — neutrality is the moat).
7. **PDPA:** explicit consent; encrypt sensitive data; minimise + short-retain raw
   uploads; honour deletion.

## Module-level application
- **Product Scan / Decision Gap / questions-to-ask:** fully in the safe zone
  (factual + educational). These can be the hero features.
- **Fee Lens / downside sim:** factual math on the user's confirmed inputs — safe.
- **RiskFit Lens:** safe **only if** framed as context (concentration %, dollar
  downside, lock-in-vs-horizon mismatch). Becomes regulated advice the moment it
  emits a verdict. This is the boundary to guard most carefully.

## "Areas of concern" framing (red-team L3)
The free tier's "N areas of concern" on a NAMED product must never read as "this
product is bad" (an implied negative recommendation). Frame every flag as a neutral
fact or a question: *"the document does not state X"*, *"the surrender value in year
3 is Y"*, *"a question to clarify: who provides the guarantee?"* — never an
evaluative verdict on the product.

## Test obligations
- A guardrail test suite asserting no report path emits a buy/sell/suitability verdict
  OR an evaluative "good/bad product" characterisation of a named product.
- Disclaimer present on every rendered report.
- LLM output validated against schema; low-confidence fields forced to user confirmation.
