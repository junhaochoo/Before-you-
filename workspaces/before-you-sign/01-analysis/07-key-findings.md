# Key Findings (the three that matter most)

## 1. DISCOVERY — The MAS advice/information boundary IS the product
Under Singapore's Financial Advisers Act, *personalised suitability recommendations*
are licensed financial advice; *factual information* and *broad non-personalised
education* are not. The pitch's "RiskFit — tests suitability against the user's
profile" sits on the wrong side as written. The reframe is the **positioning + moat**,
not a constraint: "We don't sell you anything and we don't tell you what to buy — we
make the cost and consequence visible, in your own context, before you sign." Every
module outputs facts, math, and *questions* — never a buy/suitability verdict.
(Detail: `01-research/01-regulatory-singapore.md`.)

## 2. GAP — Two omissions block both the grade and the build
- **Data layer undefined** (blocks the prototype): every module needs structured
  product data; the pitch never says where it comes from. Fix: user uploads the PHS →
  LLM extraction → user-confirmed fields → deterministic math. Unconflicted,
  unlicensed, buildable.
- **Analytical component asserted, not demonstrated** (blocks the grade): for a
  *Financial Analytics* course this is the centre of gravity and the thinnest part of
  the pitch. Fix: a deterministic engine (fee-drag/TCO, Monte Carlo downside with
  VaR/ES/drawdown, concentration/liquidity, portfolio HHI, optional fee backtest).
  LLM extracts; deterministic code computes every number.
  (Detail: `06-analytical-component.md`, `03-prototype-gaps.md`.)

## 3. CONNECTION — "Unconflicted" links the regulatory stance and the business model
The compliance choice (information-only, no recommendation) and the revenue choice
are the *same* decision. Being unconflicted takes commission/lead-gen off the table —
it would destroy the trust moat *and* edge toward regulated advising. That forces the
durable model to **B2B2C** (employers + fee-only advisers), with the consumer
freemium ladder as funnel/brand and anonymised fee benchmarks as later upside. The
product is high-stakes, low-frequency per consumer: fatal for pure B2C subscription,
ideal for B2B2C always-on access. (Detail: `04-business-model.md`.)
