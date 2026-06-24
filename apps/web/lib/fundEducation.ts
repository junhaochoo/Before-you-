/**
 * Fund education (F14) — plain-English decoders for the terms a fund factsheet
 * uses but rarely explains: the charges, what the fund holds (asset class), the
 * credit quality of its bonds, and any ESG / sustainability label.
 *
 * Compliance contract (specs/compliance-guardrails.md, mirrored by copy.ts +
 * needs.ts): every string here is a neutral FACT. This module NEVER says a fund
 * or asset class is suitable/unsuitable, good/bad, safe, or a buy/avoid. It
 * decodes terminology so the user can read a factsheet for themselves — the
 * judgement stays with the user and their licensed adviser.
 *
 * Pure + side-effect-free so the guardrail suite (fundEducation.test.ts) can
 * assert over the exact strings the UI renders. The decode* functions are
 * deterministic keyword matchers over a value the LLM copied VERBATIM from the
 * document — they classify wording, they never invent a figure.
 */

export interface Explainer {
  /** Stable id used for selection / highlight state. */
  key: string;
  /** Short label shown as the term. */
  label: string;
  /** What it means, in plain English (neutral fact, never a verdict). */
  plain: string;
}

/**
 * FUND_BASICS — for someone who has never bought a fund: the handful of neutral
 * facts that actually decide how a fund turns out. NOT a checklist of "good"
 * traits and NOT advice — each item is a question to ask, never an answer.
 */
export const FUND_BASICS: Explainer[] = [
  {
    key: "cost",
    label: "What it costs",
    plain:
      "Every fund charges fees — a one-off entry charge and a yearly running cost. Fees are taken whether the fund rises or falls, and they compound, so a 1%–2% yearly cost can quietly remove a large share of your growth over many years.",
  },
  {
    key: "holdings",
    label: "What it actually holds",
    plain:
      "A fund is just a basket of underlying things — shares, bonds, property or a mix. What it holds drives both how much it can grow and how far it can fall. Two funds with similar fees can behave completely differently.",
  },
  {
    key: "downside",
    label: "How far it can fall",
    plain:
      "Past or projected 'typical' returns hide the swings. The numbers that matter are the range of outcomes, the worst dip along the way, and the chance of ending below what you put in — not a single headline figure.",
  },
  {
    key: "access",
    label: "How long your money is tied up",
    plain:
      "Some products lock your money in or charge to exit early; most plain funds let you sell, but the price you get still moves daily. Know whether you can reach the money when you need it, and at what cost.",
  },
  {
    key: "horizon",
    label: "How long you plan to hold",
    plain:
      "The same fund looks very different over 3 years versus 20. A longer horizon gives swings more time to even out, but it also means more years of fees. Match the fund to when you'll actually need the money.",
  },
];

/**
 * FUND_OUTCOME_GLOSSARY — plain-English meaning of the result numbers this tool
 * shows per fund, so the figures aren't read as promises. Neutral definitions only.
 */
export const FUND_OUTCOME_GLOSSARY: { term: string; plainEnglish: string }[] = [
  {
    term: "Typical outcome",
    plainEnglish:
      "The middle of many simulated scenarios — half came out higher, half lower. It is a midpoint, not a forecast or a promise.",
  },
  {
    term: "Range (bad to good)",
    plainEnglish:
      "A likely span of outcomes: the 1-in-20 bad case on the low end and the 1-in-20 good case on the high end. Real results can still land outside this span.",
  },
  {
    term: "Worst dip along the way",
    plainEnglish:
      "How far the value typically fell from its highest point at some stage before the end. Even funds that finish up can drop sharply in between — this is the bump you'd have to sit through.",
  },
  {
    term: "Chance of ending below what you put in",
    plainEnglish:
      "Out of many simulated scenarios, how often the final value was less than the amount you invested. A plain way to see downside risk.",
  },
  {
    term: "Fee hurdle",
    plainEnglish:
      "The return the fund has to earn each year just to cover its own costs — before you make a single dollar. The higher the hurdle, the harder the fund has to work for you to come out ahead.",
  },
];

/** Tap-to-explain fund charge terms (the fund-path equivalent of copy.ts GLOSSARY). */
export const FUND_GLOSSARY: { term: string; plainEnglish: string }[] = [
  {
    term: "Sales charge",
    plainEnglish:
      "A one-off fee taken when you buy in — it comes straight off the amount that actually gets invested.",
  },
  {
    term: "Ongoing charge (TER)",
    plainEnglish:
      "The total yearly running cost of the fund, charged every year whether the fund goes up or down.",
  },
  {
    term: "Platform fee",
    plainEnglish:
      "A separate yearly fee charged by the platform or distributor that holds the fund for you — on top of the fund's own charge.",
  },
  {
    term: "Fee drag",
    plainEnglish:
      "The share of your potential growth that charges quietly remove over the whole holding period, because fees compound too.",
  },
];

/** What a fund mainly holds. Growth potential and how far it can fall are paired facts. */
export const ASSET_CLASSES: Explainer[] = [
  {
    key: "equities",
    label: "Equities (shares)",
    plain:
      "Shares in companies. Historically the strongest long-term growth, but also the widest swings — the value can fall sharply and stay down for years.",
  },
  {
    key: "bonds",
    label: "Bonds (fixed income)",
    plain:
      "Loans to governments or companies that pay interest. Usually steadier than shares, but they can still lose value — especially if interest rates rise or a borrower fails to repay.",
  },
  {
    key: "cash",
    label: "Cash / money market",
    plain:
      "Cash-like holdings such as deposits and short-term instruments. The steadiest of the four, but returns are low and may not keep pace with inflation.",
  },
  {
    key: "mixed",
    label: "Mixed / multi-asset",
    plain:
      "A blend of shares, bonds and sometimes cash in one fund. The exact mix sets how much it can grow and how far it can fall.",
  },
  {
    key: "property",
    label: "Property / REITs",
    plain:
      "Property or property companies. Pays income with some growth potential, but values move with property markets and can be hard to sell quickly.",
  },
];

/** Credit quality describes repayment risk for a fund's borrowers — a risk measure, not a promise. */
export const CREDIT_QUALITY_NOTE =
  "Credit quality describes how likely the fund's borrowers are to repay. It is a measure of risk, not a guarantee of either returns or safety.";

export const CREDIT_TIERS: Explainer[] = [
  {
    key: "investment-grade",
    label: "Investment grade (AAA to BBB)",
    plain:
      "Borrowers rated AAA down to BBB, judged more likely to repay. Typically lower interest and a lower chance of default — but still not risk-free.",
  },
  {
    key: "high-yield",
    label: "High yield (BB and below)",
    plain:
      "Borrowers rated BB or lower, sometimes called 'high yield' or 'junk'. They pay more interest to make up for a higher chance of default.",
  },
];

/** ESG / sustainability labels — definitions vary and say nothing about returns or safety. */
export const ESG_NOTE =
  "ESG or sustainability labels describe how a fund weighs environmental, social and governance factors. Definitions vary between providers, and labels such as SFDR Article 8 or 9 are not a measure of returns or safety — check what the label actually requires.";

/** lowercase helper for the decoders. */
const lc = (s: string) => s.toLowerCase();

/**
 * decodeAssetClass — map a verbatim asset-class phrase to its plain explanation.
 * Returns null when the wording matches none of the known classes (we never guess).
 */
export function decodeAssetClass(
  text: string | null | undefined,
): Explainer | null {
  if (!text) return null;
  const t = lc(text);
  const has = (...needles: string[]) => needles.some((n) => t.includes(n));
  // Order matters: a "multi-asset" fund mentions both equities and bonds.
  if (
    has(
      "multi-asset",
      "multi asset",
      "balanced",
      "mixed",
      "diversified",
      "allocation",
    )
  )
    return byKey(ASSET_CLASSES, "mixed");
  if (has("propert", "real estate", "reit"))
    return byKey(ASSET_CLASSES, "property");
  if (has("money market", "cash", "deposit", "liquidity"))
    return byKey(ASSET_CLASSES, "cash");
  if (
    has(
      "bond",
      "fixed income",
      "fixed-income",
      "credit",
      "debt",
      "gilt",
      "treasur",
    )
  )
    return byKey(ASSET_CLASSES, "bonds");
  if (has("equit", "share", "stock")) return byKey(ASSET_CLASSES, "equities");
  return null;
}

/**
 * decodeCreditQuality — map a verbatim credit phrase / rating to its tier. Falls
 * back to the general note (never null) when a credit term is present but the
 * tier is unclear, since any credit mention is worth the general context.
 */
export function decodeCreditQuality(
  text: string | null | undefined,
): Explainer | null {
  if (!text) return null;
  const t = lc(text);
  const has = (...needles: string[]) => needles.some((n) => t.includes(n));
  if (
    has("investment grade", "investment-grade") ||
    /\b(aaa|aa|a|bbb)\b/.test(t)
  )
    return byKey(CREDIT_TIERS, "investment-grade");
  if (
    has("high yield", "high-yield", "junk", "sub-investment", "speculative") ||
    /\b(bb|b|ccc|cc|c|d)\b/.test(t)
  )
    return byKey(CREDIT_TIERS, "high-yield");
  return {
    key: "credit-general",
    label: "Credit quality",
    plain: CREDIT_QUALITY_NOTE,
  };
}

/**
 * decodeEsg — any ESG / sustainability wording resolves to the neutral ESG note.
 * Returns null when nothing ESG-related is present.
 */
export function decodeEsg(text: string | null | undefined): Explainer | null {
  if (!text) return null;
  const t = lc(text);
  const has = (...needles: string[]) => needles.some((n) => t.includes(n));
  if (
    has(
      "esg",
      "sustainab",
      "responsible",
      "ethical",
      "article 8",
      "article 9",
      "green",
    )
  )
    return { key: "esg", label: "ESG / sustainability", plain: ESG_NOTE };
  return null;
}

function byKey(list: Explainer[], key: string): Explainer {
  const found = list.find((e) => e.key === key);
  // Every key passed here is a literal from this module, so this is always defined.
  return found as Explainer;
}

/**
 * The three risk levels the compare page offers, as decimal volatilities. Kept in
 * sync with compare/page.tsx RISK_OPTIONS (Lower / Medium / Higher).
 */
export const RISK_LEVEL = {
  lower: 0.08,
  medium: 0.13,
  higher: 0.18,
} as const;

/**
 * Seed a sensible RISK LEVEL (not a forecast) from what a factsheet says the fund
 * holds — so the downside scenarios populate themselves and a user who has never
 * heard the word "volatility" never has to pick a number. Equities swing widest,
 * bonds/cash are steadier, a mix sits in between. This is the asset class's
 * GENERAL behaviour, not a claim about this specific fund; the user can still
 * change it. Returns the Medium default when the holding can't be decoded.
 */
export function riskLevelForAssetClass(
  assetClassText: string | null | undefined,
): number {
  const decoded = decodeAssetClass(assetClassText);
  switch (decoded?.key) {
    case "equities":
      return RISK_LEVEL.higher;
    case "bonds":
    case "cash":
      return RISK_LEVEL.lower;
    case "property":
    case "mixed":
      return RISK_LEVEL.medium;
    default:
      return RISK_LEVEL.medium;
  }
}
