# Strategic Resolutions (resolves A1–A5) — the deep fixes

## A1 — The adoption-timing problem → the FREE-LOOK WEDGE

**Flaw:** the product needs users to pause at the moment of the pitch, when they are
least able to. **Resolution: reframe the primary usage moment around the regulatory
free-look period.**

Singapore insurance/ILP purchases carry a **14-day free-look period** (from the date
the policy contract is received) during which the buyer can cancel. This is a
_natural, high-intent, low-pressure_ window the original pitch entirely misses.

> **Accuracy note (red-team H1):** for an ILP the free-look refund is **NOT fully
> "free"** — it returns premiums paid **less any market-value loss** on units already
> invested and **less minor expenses** (e.g. medical). So the honest hook is "cancel
> with **little or no penalty**," not "walk away free." The market-value-adjustment
> trap is itself one more thing the tool explains.

It transforms the timing problem:

- **Before purchase (hard moment):** offer a 60-second **Quick Scan** + a printable
  "questions to ask" sheet — low friction, fits the pressured moment.
- **During free-look (the wedge — hero acquisition moment):** _"You've signed — but
  you can still cancel, with little or no penalty, for the next 14 days. Let's check
  what you actually bought before the window closes."_ High intent, buyer's-remorse
  energy, a clear deadline that drives action and word-of-mouth. **This is the
  consumer hook that makes a freemium model actually convert.**
- **Anytime (review):** review an existing/legacy product → drives Portfolio Mirror
  and family use.

**Three timing modes** map cleanly to the funnel: Quick Scan (acquisition) → Free-Look
Full Report (conversion to paid) → ongoing review (retention).

## A2 — "Why not just use ChatGPT?" → the defensible moat

**One-slide answer (build it explicitly into the deck):**

| Free chatbot                                               | Before You Sign                                                                                           |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Plausible-sounding fees, can hallucinate numbers           | **Deterministic, unit-tested fee math**; extracts then _asks you to confirm_; "not found" never "guessed" |
| No memory of your finances                                 | **Persisted profile + portfolio context** across every report                                             |
| Will happily give regulated "buy/don't-buy" advice (risky) | **Compliance guardrails** — facts, math, questions only                                                   |
| Unstructured, different each time                          | **Audited rubric + checklist** — same rigorous structure every time                                       |
| No benchmark                                               | **Fee/term benchmarks** ("top-quartile for ILPs")                                                         |
| No artefact                                                | **Saved report + printable adviser-question sheet**                                                       |

The moat is **not** the document-reading (commodity) — it is the \*deterministic math

- persisted context + compliance discipline + structured rubric\*. Say this plainly.

## A3 — Beachhead lock → pre-retiree + ILP

**Decision made.** Everything in the MVP and proposal narrative anchors on **a
mass-affluent 40–60-year-old being sold a S$100,000 ILP.** Rationale:

- Highest ticket, highest fee-drag (RIY 1.5–3.0%), highest regret.
- Cleanest "Person A" concentration math (large % of liquid wealth).
- ILPs are the **fastest-growing** life-insurance category (43% of new business; +41%
  in 2024) — a _growing_ problem, strong "why now."
- **CASE: ~45% of ILP buyers reportedly didn't understand the fees** — direct problem
  evidence (⚠️ secondary-sourced; verify primary before the deck — red-team H3).
- The free-look wedge (A1) applies natively to ILPs.

Expansion (mention, don't build first): unit trusts → structured notes → endowment →
family/household. Same engine, new extraction templates.

## A4 — Document-availability → three entry modes

**Flaw:** the user may not have the PHS yet (verbal hard sell). **Resolution:**

1. **Upload mode** — user has the ILP **Product Summary + Benefit Illustration**
   (+ sub-fund fact sheet / PHS) → LLM extract. _(Red-team M1: for insurance ILPs the
   regulated documents are the Product Summary and Benefit Illustration — not a
   capital-markets "PHS". The **Benefit Illustration** is the key artefact: by
   regulation it already shows the effect-of-deductions and early-surrender cost, so
   the fee data we need is concentrated there — a feasibility positive. We
   differentiate by adding personal/portfolio context, downside simulation, the BTIR
   comparison, and plain-English decoding the Benefit Illustration does not provide.)_
2. **"What I was told" mode** — user enters the _verbal claims_ ("agent said 7% a
   year, capital guaranteed") → the tool returns the **document and questions to
   demand** + flags claims that need written proof. _Most compliant mode (pure
   question-generation), and works in the live pitch moment._
3. **Free-look mode** — post-signing, user uploads the policy documents they now have
   → full report before the window closes.

Mode 2 also neatly handles the "capital guarantee should not be assumed" insight from
the pitch: it converts a verbal claim into "ask where the document states this and who
provides it."

## A5 — Cold-start / no benchmark data → public-PHS seeding

**Flaw:** "top-quartile fee" needs a corpus you don't have on day one.
**Resolution:** pre-seed a reference set from **publicly available PHS / fund fact
sheets / benefit illustrations** (fees are disclosed by regulation) for the top ILPs
and fund classes before launch. State the seeding method honestly; the user-upload
flow then grows it. Do **not** claim a live network effect at launch — claim a
_seeded benchmark that compounds_. This is credible and defensible.

## Net effect on the brief

- **Importance of problem** ↑ — growing category + RIY 1.5–3.0% + fee-only rejection
  - MAS action (CASE 45% as supporting colour, pending primary verification).
- **Originality** ↑ — the free-look wedge and the anti-chatbot moat are genuinely
  novel framings, not generic "AI reads your docs."
- **Business model** ↑ — the free-look hook is what makes consumer freemium convert.
- **Feasibility** ↑ — three entry modes + seeding remove the two biggest adoption
  blockers.
