# Research 02 — Market Context & Competitive Landscape

## 1. Where the product sits
"Before You Sign" is a **pre-purchase decision-support / financial-literacy tool**
for retail buyers of investment & insurance products. It is *not* a robo-adviser
(doesn't allocate or recommend), *not* a brokerage (doesn't execute), *not* an
aggregator (doesn't hold accounts). Its category is closest to **"financial
product transparency / decision hygiene."**

## 2. Target users (segments, sharpest first)
1. **Mass-affluent pre-retirees (40–60)** approached by bank relationship
   managers / tied agents with ILPs, endowments, structured notes. High ticket
   sizes, high concentration risk, low product literacy, highest regret. **Primary.**
2. **Young accumulators (25–40)** buying their first ILP/unit trust/"savings
   plan", often via an agent friend. Fee drag over decades is enormous and
   invisible. High digital adoption, low willingness to pay individually.
3. **The "sandwich" decision-maker** helping parents review what an agent sold
   them (maps directly to the pitch's "Family access").
4. **(B2B buyers — see business model)** employers running financial-wellness
   benefits; fee-only/independent advisers who want a trust artefact; MoneySense /
   public-education bodies.

## 3. Market context (Singapore)
- High insurance & investment penetration; aggressive bancassurance and tied-agency
  distribution; commission-driven sales create structural information asymmetry.
- Regulator actively worried about disclosure comprehension (PHS enhancements,
  pre-transaction alerts — see regulatory doc). The problem is institutionally
  acknowledged.
- FIDReC complaints at a 20-year high — demand-side evidence that purchases are
  made without understanding.
- Strong public-literacy infrastructure (MoneySense) = potential partner/channel,
  also a "free substitute" to differentiate from.

## 4. Competitive / substitute landscape
| Substitute | What it does | Gap we exploit |
|---|---|---|
| **The PHS itself** (regulator-mandated) | Per-product key facts, fees, risks | Per-product, issuer-authored, generic; **no personal context, no cross-product/portfolio view, dense** |
| **FINRA Fund Analyzer (US)** | Fee impact of funds over time across 18,000+ funds | US-only, fund-only, no SG products, no insurance/ILP, no personal-context framing |
| **Fee-drag calculators** (PortfolioPilot etc.) | Compounding AUM-fee drag | Single mechanic (fees), no risk/suitability/document scan, no guarantee check |
| **Robo-advisers** (Endowus, StashAway, Syfe) | Build & manage a portfolio (regulated advice) | They *sell* a product/allocation; conflicted; don't decode a *third-party* product the user was pitched |
| **The selling adviser/RM** | Explains & sells | **Conflicted** — paid on commission; this is the trust gap we fill |
| **MoneySense / consumer guides** | General education | Generic, not applied to *this* product *this* user is about to buy |
| **ChatGPT / general LLM** | "Explain this product" | No structure, hallucination risk, no fee math, no portfolio context, no guardrails, no saved profile |

**White space:** a neutral, **consumer-side** tool that (a) decodes the *specific*
document the user was handed, (b) quantifies fees and downside in **dollars**, and
(c) places it in the user's **personal/portfolio context** — none of the
substitutes do all three, and crucially none is *unconflicted* (not paid to sell).

## 5. Unique selling points (scrutinised — USP ≠ value prop)
A USP must be something competitors *cannot or will not* easily copy.

1. **Unconflicted by construction.** We never sell a product, take commission, or
   route to a named product. The selling channel structurally *cannot* offer this;
   robo-advisers *will not* (it cannibalises them). **Durable USP.**
2. **Personal-context risk translation.** The Person A/Person B mechanic — turning
   "20% fall" into "S$X = N% of your liquid wealth" — is the emotional core and is
   defensible because the PHS is legally per-product and cannot reference the user.
3. **Cross-product portfolio synthesis (Portfolio Mirror).** Shows how one decision
   reshapes total concentration/risk. Issuers and the PHS will never do this.

**Weaker / contestable "USPs" to NOT over-claim:**
- "Reads the document and flags terms" — an LLM commodity; defensible only via the
  *structured rubric* and *fee math*, not the reading itself.
- "Fee transparency" — partly eroded by improved regulator-mandated PHS over time.

## 6. Platform-model & network-effect read (honest)
The product is primarily **SaaS/utility, not a two-sided marketplace** — be honest
about this in the proposal rather than forcing a platform narrative. Genuine
network/engagement angles that *are* real:
- **Crowd-sourced fee/product reference data** — each user-uploaded PHS improves a
  (anonymised, aggregated) reference set of typical fees per product class →
  "this 1.8% wrap fee is in the top quartile for ILPs." Data network effect.
- **Adviser question-bank** — the "questions to ask your adviser" library improves
  with usage and outcomes (which questions surfaced bad surprises).
- **Producer/partner edge:** fee-only advisers & employers as *producers* of trust
  (they hand the tool to clients/staff); consumers as the *consumers*; the tool as
  the *partner* facilitating an honest conversation.
- **AAA framing:** *Automate* the document-reading & fee math (cuts the cost of
  understanding); *Augment* the buyer's decision (better questions, visible
  trade-offs); *Amplify* literacy at scale (one rubric serves thousands without a
  human adviser per user).

Sources: FINRA Fund Analyzer; PortfolioPilot fee-drag calculator; MAS PHS
enhancements; FIDReC FY2024/25 report (see regulatory doc for citations).
