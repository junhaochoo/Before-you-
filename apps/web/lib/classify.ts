/**
 * Product-type detection (upload-first entry) — decide whether a document is an
 * insurance / investment-linked product (ILP) or a plain investment fund / unit
 * trust, so the user never has to identify the product type themselves.
 *
 * Deterministic keyword classifier over the (already PII-redacted) document text.
 * It only WEIGHS wording that is already in the document — it never invents a
 * label and never advises. Pure + side-effect-free so classify.test.ts can assert
 * over the exact decision. The LLM fallback (lib/extract/llm.ts) is consulted by
 * the API route only when this returns low confidence.
 *
 * Compliance: this is a routing/classification step, not advice. It says "this
 * looks like an X" so we can show the right neutral explainer — it never says an
 * X is good, bad, suitable, or worth buying.
 */

export type ProductKind = "ilp" | "fund" | "unknown";
export type DetectConfidence = "high" | "medium" | "low";

export interface Classification {
  kind: ProductKind;
  confidence: DetectConfidence;
  /** Phrases in the document that pointed to an ILP (for honest "why we think so"). */
  ilpSignals: string[];
  /** Phrases in the document that pointed to a fund / unit trust. */
  fundSignals: string[];
}

interface Signal {
  /** Lowercase needle matched against the document text. */
  needle: string;
  /** Short label shown to the user when this signal fires. */
  label: string;
  /** Strong discriminators weigh 2; generic terms weigh 1. */
  weight: 1 | 2;
}

/** Wording that strongly or weakly indicates an insurance / ILP document. */
const ILP_SIGNALS: Signal[] = [
  { needle: "benefit illustration", label: "benefit illustration", weight: 2 },
  { needle: "investment-linked", label: "investment-linked policy", weight: 2 },
  { needle: "investment linked", label: "investment-linked policy", weight: 2 },
  { needle: " ilp", label: "ILP", weight: 2 },
  { needle: "(ilp", label: "ILP", weight: 2 },
  { needle: "surrender", label: "surrender value / period", weight: 2 },
  { needle: "free-look", label: "free-look period", weight: 2 },
  { needle: "free look", label: "free-look period", weight: 2 },
  { needle: "sum assured", label: "sum assured", weight: 2 },
  { needle: "death benefit", label: "death benefit", weight: 2 },
  { needle: "cost of insurance", label: "cost of insurance", weight: 2 },
  { needle: "insurance charge", label: "insurance charge", weight: 2 },
  { needle: "mortality", label: "mortality charge", weight: 2 },
  { needle: "distribution cost", label: "distribution cost", weight: 1 },
  { needle: "product summary", label: "product summary", weight: 1 },
  { needle: "premium", label: "premium", weight: 1 },
  { needle: "policy term", label: "policy term", weight: 1 },
  { needle: "policyholder", label: "policyholder", weight: 1 },
  { needle: "life assured", label: "life assured", weight: 1 },
];

/** Wording that strongly or weakly indicates an investment fund / unit trust. */
const FUND_SIGNALS: Signal[] = [
  { needle: "factsheet", label: "factsheet", weight: 2 },
  { needle: "fact sheet", label: "factsheet", weight: 2 },
  { needle: "kiid", label: "KIID", weight: 2 },
  { needle: "key information document", label: "key information document", weight: 2 },
  { needle: "unit trust", label: "unit trust", weight: 2 },
  { needle: "mutual fund", label: "mutual fund", weight: 2 },
  { needle: "ongoing charge", label: "ongoing charge (TER)", weight: 2 },
  { needle: "total expense ratio", label: "total expense ratio (TER)", weight: 2 },
  { needle: "net asset value", label: "net asset value (NAV)", weight: 2 },
  { needle: " nav", label: "NAV", weight: 1 },
  { needle: "sales charge", label: "sales charge", weight: 2 },
  { needle: "prospectus", label: "prospectus", weight: 1 },
  { needle: "sub-fund", label: "sub-fund", weight: 1 },
  { needle: "fund manager", label: "fund manager", weight: 1 },
  { needle: "benchmark index", label: "benchmark index", weight: 1 },
  { needle: "subscription fee", label: "subscription fee", weight: 1 },
  { needle: "redemption", label: "redemption", weight: 1 },
  { needle: "accumulation share", label: "accumulation share class", weight: 1 },
  { needle: "distribution share", label: "distribution share class", weight: 1 },
];

function tally(text: string, signals: Signal[]): { score: number; labels: string[] } {
  const labels: string[] = [];
  let score = 0;
  for (const s of signals) {
    if (text.includes(s.needle)) {
      score += s.weight;
      if (!labels.includes(s.label)) labels.push(s.label);
    }
  }
  return { score, labels };
}

/**
 * classifyProduct — deterministic product-type detection.
 *
 * Decision rule (kept simple + auditable):
 *   - Score each side by weighted keyword hits.
 *   - The side with the higher score wins; the gap to the loser sets confidence.
 *   - Confident enough → the API auto-routes; otherwise we show BOTH explainers
 *     and let the user pick, so a near-tie is never a silent guess.
 */
export function classifyProduct(text: string | null | undefined): Classification {
  const t = (text ?? "").toLowerCase();
  const ilp = tally(t, ILP_SIGNALS);
  const fund = tally(t, FUND_SIGNALS);

  const winnerScore = Math.max(ilp.score, fund.score);
  const margin = Math.abs(ilp.score - fund.score);

  const base = {
    ilpSignals: ilp.labels,
    fundSignals: fund.labels,
  };

  // Nothing recognisable, or too close to call → unknown (UI shows both).
  if (winnerScore === 0 || margin < 2) {
    return { kind: "unknown", confidence: "low", ...base };
  }

  const kind: ProductKind = ilp.score > fund.score ? "ilp" : "fund";
  const confidence: DetectConfidence =
    winnerScore >= 4 && margin >= 3 ? "high" : "medium";
  return { kind, confidence, ...base };
}

/** True when the deterministic verdict is decisive enough to auto-route. */
export function isConfident(c: Classification): boolean {
  return c.kind !== "unknown" && c.confidence !== "low";
}
