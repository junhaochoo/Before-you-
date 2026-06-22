# Product Design & UX (resolves C1–C4)

Wireframes are ASCII for the proposal; they become the React frontend for the MVP.

## C2 — The risk-profiling instrument (short, defensible, compliant)
Five inputs only (minimise friction; each feeds deterministic context, never a verdict):
1. **Liquid savings** (S$) — for concentration & buffer math.
2. **Monthly expenses** (S$) — for liquidity-buffer-in-months.
3. **Investment horizon** (years / "when might you need this money") — for lock-in flag.
4. **Existing holdings** (asset class + amount, optional) — for Portfolio Mirror.
5. **Stated objective** (preserve / income / grow) — to phrase *questions*, not advice.

These produce only neutral arithmetic (Engine 3). No scoring into "aggressive/
conservative" labels that imply a recommendation.

## C1 — Core screens (wireframes)

**Screen 1 — Entry (three modes, A4):**
```
┌────────────────────────────────────────────┐
│  Before You Sign                            │
│  Understand the real cost before you commit │
│                                             │
│  [ 📄 Upload my Product Summary / Benefit    │
│      Illustration ]                         │
│  [ 💬 I only have what the agent told me ]   │
│  [ ⏳ I've signed — check before free-look    │
│      ends (cancel w/ little/no penalty) ]   │
│                                             │
│  We don't sell anything. We don't tell you  │
│  what to buy. Not financial advice.         │
└────────────────────────────────────────────┘
```

**Screen 2 — Extract & confirm (trust UX, C4 + G1):**
```
┌────────────────────────────────────────────┐
│  Here's what we read. Please confirm.       │
│  Product type:  ILP            ✓ confident  │
│  Upfront charge: 3%            ✓ confident  │
│  Fund fee (TER): 1.5%          ⚠ please check│
│  Insurance charge: NOT FOUND   ✎ enter      │
│  Capital guarantee: NOT STATED  (we flag it) │
│  [ Confirm & continue ]   [ source: p.4 ]    │
└────────────────────────────────────────────┘
```
Every field shows confidence; low-confidence/missing forces user input; each links to
the document line it came from. **No math runs until confirmed.**

**Screen 3 — The Report (hero artefact):**
```
┌──────────────── BEFORE YOU SIGN — REPORT ────────────────┐
│ ⚠ General information only. Not advice. Consult a licensed FA.│
│                                                           │
│ 💰 FEE LENS                                               │
│   Over 20 years, ~S$115,000 (≈36%) of your potential      │
│   S$321,000 goes to fees → you keep ~S$206,000.           │
│   [ gross ▁▂▃▅▇  vs  net ▁▁▂▃▄ ]  ← diverging curves      │
│   vs a low-cost index fund: ~S$100,000 difference.        │
│                                                           │
│ ⚖ RISKFIT (context, not advice)                          │
│   This = 80% of your liquid savings.                      │
│   A 1-in-20 bad year ≈ −S$20,000 → ~1 month buffer left.  │
│   Locked in (surrender penalty) until ~year 10.           │
│                                                           │
│ 📉 WHAT IF (downside)                                     │
│   Worst 5%: end below what you put in. Chance of loss: __%│
│                                                           │
│ ❓ DECISION GAPS — questions to ask                       │
│   • Where does the document state a capital guarantee?    │
│   • Who provides it, and under what conditions?           │
│   • What is the surrender value in years 1–5?             │
│   [ 🖨 Print questions sheet ]   [ 💾 Save report ]        │
└───────────────────────────────────────────────────────────┘
```

## C3 — Onboarding friction (progressive disclosure)
- **Free Quick Scan** asks for *only the document* → instant term flags + guarantee
  check + questions sheet. No financials required → low first-run friction.
- Financial profile is requested **only when** the user opens RiskFit / Portfolio /
  Full Report (the moment the value justifies the input).
- "I only have what the agent told me" mode needs *zero* upload → lowest friction,
  highest compliance.

## C4 — Trust UX (earn belief in the numbers)
- **Show your work:** every figure links to the source line + shows the formula +
  shows assumptions (return/vol sliders).
- **Confidence flags + user confirmation** on every extracted field.
- **No-conflict badge** prominent: "We earn nothing from your decision."
- **Disclaimer** on every report; never a buy/sell/suitability verdict.

## Design-system notes (for the build)
- Calm, trustworthy, non-salesy palette; large legible numbers (the dollar figures
  are the hero); the gross-vs-net diverging chart is the signature visual.
- Mobile-first (the free-look check happens on a phone, often in the bank branch).
- Accessibility: plain language, no jargon without a tap-to-explain.
