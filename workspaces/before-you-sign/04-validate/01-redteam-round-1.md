# Red Team — Round 1 Findings (resolution audit)

**Posture:** L5_DELEGATED (fresh repo) · **Round:** 1 · **Scope:** audit every
resolution in `09`–`15` + specs for defensibility; verify load-bearing external
facts; recompute the headline math; hunt for unclosed gaps.

**Method:** This workspace is an analysis/proposal, not code — so AST/`pytest`
spec-compliance does not apply. Adapted the red-team discipline to: (1) independent
recomputation of all quantitative claims, (2) primary-source verification of cited
external facts (evidence-first-claims rule), (3) adversarial gap-hunt from a skeptical
examiner/investor perspective.

---

## A. MATH RE-DERIVATION (independent) — ✅ CLEAN
Recomputed every figure in `10-worked-analytical-example.md` from scratch:
| Claim | Independent recompute | Verdict |
|---|---|---|
| Gross 100k×1.06^20 | 1.06^20 = 3.20714 → S$320,714 | ✅ matches |
| Net (factor 1.041^20 ×97k − admin) | 2.23315×97,000 = 216,615; − annuity(360,4.1%,20)=10,828 → S$205,787 | ✅ ~S$205,900 |
| Total fees | 320,714 − 205,800 = S$114,914 | ✅ ~S$115,000 |
| Fee drag | 1 − 205,800/320,714 = 35.8% | ✅ ~36% |
| Index fund 100k×1.0575^20 | 3.05846 → S$305,846 | ✅ ~S$306,000 |
| Fee gap | 305,846 − 205,800 = S$100,046 | ✅ ~S$100,000 |
**No math finding.** The headline survives independent recomputation.

---

## B. FINDINGS

### 🔴 H1 — "Walk away FREE" is factually wrong for ILPs (free-look has MVA)
`09-strategic-resolutions.md` A1 repeatedly says the free-look lets you "walk away,
free." **Verified false for ILPs:** the free-look refund on an ILP = premiums paid
**adjusted for any market-value loss** on units already invested, **less medical/
other expenses** (LIA / MoneySense / Manulife). For the very product we beachhead on,
"free" overstates it.
- **Impact:** an examiner who knows insurance will catch this instantly; it undercuts
  the credibility of the hero strategic resolution.
- **Fix:** reword to "cancel with **little or no penalty** — premiums returned, less
  any market-value change on units already invested and minor expenses." Turn the MVA
  itself into *another thing the tool explains*. (The wedge still holds — the window
  is real and high-intent; only the word "free" was wrong.)

### 🔴 H2 — Index-fund comparison ignores the bundled insurance (apples-to-oranges)
`10` compares the ILP to a pure low-cost index fund and attributes the ~S$100k gap to
"fees." But an ILP **bundles life insurance**; a sharp critic says "you're paying for
protection the index fund doesn't give." As written, the comparison is rebuttable.
- **Fix:** reframe as **Buy-Term-and-Invest-the-Rest (BTIR)** — the standard fee-only
  argument (Providend's exact thesis): compare the ILP against *(cheap term insurance
  for the same cover) + (the remainder in a low-cost fund)*. Then the cost gap is
  apples-to-apples and far harder to rebut. State explicitly that part of the ILP
  charge buys insurance, and the analysis isolates the *excess* cost.

### 🔴 H3 — The "CASE 45%" cornerstone stat is unverified (secondary sources only)
The "~45% of ILP buyers didn't understand the fees (CASE 2022)" stat traces only to
**secondary content-marketing blogs**, not a primary CASE publication I could locate.
Per `evidence-first-claims.md`, presenting it as established fact is not defensible.
- **Fix:** label it "reported in secondary sources; primary CASE citation to be
  verified before the deck," AND ensure the problem case **stands without it** — it
  does: RIY 1.5–3.0% (MoneySense), fee-only rejection (Providend 20+ yrs, MoneyOwl),
  MAS's own PHS-enhancement action, and the math are all independently solid.

### 🟠 M1 — ILP document taxonomy is wrong ("PHS") — and the fix is a strength
I labelled the source document "PHS" throughout. **For insurance ILPs the documents
are: Product Summary + Benefit Illustration (Policy Illustration) + Fund fact sheet
/ sub-fund PHS.** The **Benefit Illustration is the key artefact — it already shows
the effect-of-deductions and early-surrender cost** by regulation.
- **Impact:** (a) terminology accuracy; (b) the extraction spec must target the right
  document; (c) honest positioning — the Benefit Illustration *already* shows
  effect-of-deductions, so we must differentiate (we add personal/portfolio context,
  downside sim, BTIR comparison, plain-English decoding — it doesn't).
- **Fix:** correct taxonomy in `09`, `13`, `specs/document-ingestion.md`; add the
  Benefit Illustration as a named substitute in the competitor map; turn "the data is
  concentrated in the Benefit Illustration" into a *feasibility positive*.

### 🟠 M2 — PDPA: uploading financial docs to a third-party LLM is under-treated
Sending a user's Benefit Illustration (name, age, sum assured, financials) to an
external LLM provider is a cross-party/possibly cross-border data transfer — a real
PDPA + data-residency concern I waved at but didn't mitigate.
- **Fix:** add mitigation — **PII redaction before extraction** (strip name/NRIC;
  send only the fee/structure table), an enterprise LLM tier with a **no-training**
  contractual guarantee, explicit consent, and a stated data-residency posture. Add
  to `14-risk-treatment.md` and `15-feasibility-extraction.md`.

### 🟠 M3 — Market sizing claims a reconciliation it doesn't actually perform
`12` says "show top-down and bottom-up and reconcile," but the buyer-count
(~100k–200k/yr) is a loose guess; weighted-premium → headcount is genuinely ambiguous
(single-premium weighted at 10% vs regular at 100%), so the conversion is unreliable.
- **Fix:** present SAM as an **explicit, clearly-labelled rough estimate with the
  weighting caveat**, not a reconciled figure; lead with the defensible top-down
  anchor (S$2.5bn ILP NBP, +41%/+31% growth) and treat headcount as illustrative.

### 🟡 M4 — Worked example only covers single-premium; mass-market ILPs are regular-premium
The S$100k lump-sum case fits a pre-retiree with a windfall, but the *typical*
mass-market ILP is **regular-premium**, where early-year allocation charges make drag
**worse**. Not wrong, but incomplete.
- **Fix:** add a one-paragraph note that the engine generalises to regular-premium and
  that early-year allocation charges make the drag *higher*, not lower (strengthens
  the thesis).

### 🟡 L1 — Monte Carlo should be lognormal-primary, not Normal
Normal(6%,15%) allows returns < −100% over compounding; lognormal (or Student-t for
tails) is the correct primary for multi-year terminal-value sims.
- **Fix:** make lognormal the primary method in `10` + `specs/analytical-engine.md`.

### 🟡 L2 — No rebuttal to a fast-follower (Seedly / a robo adds this feature)
The unconflicted moat (A2) answers "chatbot," but not "why can't Seedly or a robo
build this?"
- **Fix:** add one line — robo-advisers *won't* (it cannibalises their product and
  re-introduces conflict); a content/community site *could* add a calculator but
  lacks the deterministic engine + persisted profile + compliance discipline + the
  free-look-timed funnel; first-mover on the seeded benchmark corpus compounds.

### 🟡 L3 — Free-tier "areas of concern" on a NAMED product needs a guardrail note
Flagging "N areas of concern" about a specific named product edges toward an implied
negative recommendation.
- **Fix:** guardrail — frame concerns as *"the document does not state X"* / *"these
  are questions to clarify,"* never *"this product is bad."* Add to compliance spec.

---

## C. UNCLOSED-GAP SWEEP (did we miss anything?)
Checked the brief's six elements + the user's three asks against the resolution set:
- Problem/users/market ✅ (H3 caveat aside) · Product/UX ✅ · Business model ✅ ·
  Analytical ✅ (H2 fix) · Risks ✅ (M2 add) · Feasibility ✅ (M1 strength).
- No NEW uncovered brief requirement found. Remaining items are the 10 findings above,
  all defensibility/accuracy refinements, not missing scope.

## D. Disposition
All 10 findings fixed autonomously in Round 1 (see `02-round-1-fixes.md`). Re-audit in
Round 2 for convergence.
