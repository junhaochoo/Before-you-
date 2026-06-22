# Research 01 — Regulatory Context (Singapore / MAS)

This is the single most decisive constraint on the product. Get it wrong and the
product is either illegal-to-operate or strategically neutered. Get it right and
the regulatory boundary becomes the product's positioning moat.

## 1. The advice/information boundary (the make-or-break line)

Under the **Financial Advisers Act 2001 (FAA)**, "providing financial advice" on
investment products is a **licensed/regulated activity**. You need a Financial
Adviser's licence (or an exemption, e.g. held under a CMS licence / Banking Act /
Insurance Act) to do it.

**What is NOT financial advice (the safe harbour we must live inside):**
- **Factual information** — "objective, verifiable, accuracy cannot reasonably be
  questioned", general in nature and commonly known. *Example MAS gives:*
  information on financial terminology and the basic features of an insurance or
  investment product is **not** financial advice.
- **Broad, non-personalised educational content** — general financial-planning
  considerations **not tailored to an individual's specific circumstances or
  objectives**.

**What IS financial advice (the line we must not cross):**
- A **personalised recommendation** taking into account a specific client's
  financial objectives, risk tolerance, financial situation, investment
  experience and particular needs — and concluding that a product **is/is not
  suitable** for that client.

> **Implication for "Before You Sign":** "Product Scan", "Fee Lens", and
> "Decision Gap Checklist" sit safely in the *factual/educational* zone. The
> **"RiskFit Report — tests suitability against the user's profile"** as named
> crosses (or straddles) the line into **personalised advice**. This is the #1
> design risk. The fix is framing + mechanics (see §5).

Sources: MAS FAA Guidelines (FAA-G04), MAS FAQs on FAA/FAR (28 Nov 2024),
Guidelines on Provision of Financial Advisory Service (10 Jul 2019).

## 2. Robo / digital advisory rules (if we ever move toward advice)

MAS **Guidelines on Provision of Digital Advisory Services (CMG-G02)** govern
automated advice. A digital adviser offering only basic advisory services must be
licensed as an FA under the FAA unless exempted. The Guidelines add expectations
on: governance & supervision of algorithms, technology risk management, AML/CFT,
disclosure, and **suitability of advice**. MAS relaxed some barriers (e.g. the
5-year track record / S$1bn AUM requirement) to facilitate digital advisers —
signalling MAS is *open* to digital models that are properly governed.

> **Implication:** A licensed-advice version of the product is *feasible* but is a
> heavy lift (licence, compliance, capital, algorithm governance). For an MVP and
> a course prototype, **stay unlicensed** by staying in the information/education
> zone. Treat "become a licensed digital adviser" as a later, deliberate stage —
> not the MVP.

## 3. Product disclosure regime — the problem is real AND moving

- The **Product Highlights Sheet (PHS)** already exists under the Securities and
  Futures Act: issuers must present key features, risks, fees & charges, and exit
  mechanisms concisely. So the *raw material* the product would decode already
  exists in a semi-standardised document — useful for our data layer.
- **But MAS is actively enhancing disclosure (2025–2026):** mandated diagrams
  showing amount invested after charges, a red heading band for complex products,
  enhanced fee/risk disclosure, and **pre-transaction alerts for complex
  products**. (Consultation closed 1 Sep 2025; MAS concluded it in 2026.)

> **Double-edged:** (a) Validation — the regulator agrees disclosure is hard to
> understand, so the problem is real. (b) Competitive/obsolescence risk — some of
> "Fee Lens" and the guarantee-check could be partly satisfied by improved
> regulator-mandated PHS. Our wedge must be **personal context** (the Person
> A/Person B insight) and **cross-product / portfolio-level** synthesis, which the
> PHS will never provide because the PHS is per-product and issuer-authored.

## 4. Consumer-harm evidence (problem importance)

- **FIDReC** (Financial Industry Disputes Resolution Centre) received **4,355
  claims in FY2024/25 — a 20-year high, ~50% surge** y-o-y. Banks/finance
  companies were the most-claimed-against category. Fraud/scam claims up ~63% y-o-y.
- This is strong, citable evidence that consumers are entering financial
  transactions they don't fully understand. (Note: a large share is scam-driven;
  we should cite carefully and not overclaim that all of it is mis-selling.)

Sources: The Edge Singapore / Singapore Law Watch on FIDReC FY2024/25 report.

## 5. How to stay legal — the design rules that follow

1. **Position as an education / literacy / "question-generator" tool**, never an
   adviser. Output = *questions to ask*, *facts to verify*, *costs made visible*,
   *what to check in the document* — not "you should/shouldn't buy this."
2. **RiskFit becomes "RiskFit Lens": context, not verdict.** Instead of "this is
   (un)suitable for you", output *neutral, factual* observations: "This product
   would represent **80% of the liquid savings you entered**. A 20% decline would
   equal **S$20,000**. Industry guidance often flags single-product concentration
   above X%." Show the math; let the user draw the conclusion. No buy/don't-buy
   recommendation, no "suitable/unsuitable" label.
3. **No product recommendations, no comparison-to-buy, no lead routing to a
   specific product/issuer** in the unlicensed version (lead-gen to a *named
   product* edges toward arranging/advising and also destroys neutrality).
4. **Prominent disclaimers**: "general information only, not financial advice,
   not a recommendation; consult a licensed financial adviser."
5. **Don't store/ingest more personal data than needed**; PDPA applies (see
   `05-risks-and-constraints.md`).
6. **User-supplied inputs**: the user uploads/enters the product document and
   their own numbers. We analyse *the document the user already has*. We are a
   lens on the user's own data, not a distributor of products.

> The boundary is not a limitation to apologise for — it is the **positioning**.
> "We don't sell you anything and we don't tell you what to buy. We make the cost
> and the consequence visible, in your own context, before you sign." That is
> simultaneously the compliance posture, the trust moat, and the marketing line.
