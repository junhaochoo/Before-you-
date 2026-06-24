/**
 * Product education (upload-first entry) — plain-English explainers for the TWO
 * product families this tool handles: insurance / investment-linked policies
 * (ILPs) and plain investment funds / unit trusts. Shown at the top of the
 * result so someone who knows nothing about financial products first learns
 * WHAT they are looking at, before any numbers.
 *
 * Compliance contract (specs/compliance-guardrails.md, mirrored by copy.ts +
 * fundEducation.ts + needs.ts): every string here is a neutral FACT about what
 * the product IS and how it WORKS. It NEVER says a product is good, bad, safe,
 * suitable, worth buying, or better than an alternative. "What it's designed to
 * give you" describes the product's stated purpose — it is not a reason to buy.
 *
 * Pure data + a lookup so productEducation.test.ts can assert over the exact
 * strings the UI renders.
 */
import type { ProductKind } from "./classify";

export interface ProductExplainer {
  kind: Exclude<ProductKind, "unknown">;
  /** Plain label for the product family. */
  label: string;
  /** One-line "you've got X" headline for the result. */
  headline: string;
  /** What the product actually is, in two or three plain sentences. */
  whatItIs: string;
  /** The charges you pay — neutral facts, each a single bullet. */
  payingFor: string[];
  /** What the product is DESIGNED to give you (purpose, not a recommendation). */
  designedToGiveYou: string[];
  /** Facts worth checking in the document — never framed as a warning to act on. */
  watchFor: string[];
}

const ILP: ProductExplainer = {
  kind: "ilp",
  label: "Insurance / investment-linked policy (ILP)",
  headline: "This looks like an insurance or investment-linked policy (ILP).",
  whatItIs:
    "An ILP is an insurance policy and an investment rolled into one product. " +
    "Part of what you pay buys life-insurance cover; the rest is invested in " +
    "sub-funds you choose, and that invested part can rise or fall in value. " +
    "It is sold by an insurer, usually as a long-term policy.",
  payingFor: [
    "Insurance charges — the cost of the life cover, usually deducted from your units each month, and these often rise as you get older.",
    "Fund charges — an ongoing yearly fee on the sub-funds your money is invested in.",
    "Administration and policy fees — flat or percentage charges for running the policy.",
    "Upfront or distribution charges — a slice taken in the early years, so less of your money is actually invested at the start.",
  ],
  designedToGiveYou: [
    "Life-insurance cover and a long-term investment held together in one policy.",
    "The ability to switch between the insurer's sub-funds over time.",
  ],
  watchFor: [
    "A surrender period — cashing out in the early years can return less than you paid in.",
    "Whether any 'capital guarantee' applies only if you hold to maturity, and which company stands behind it.",
    "A free-look period — a short window just after signing when you can cancel, subject to any market value adjustment.",
  ],
};

const FUND: ProductExplainer = {
  kind: "fund",
  label: "Investment fund / unit trust",
  headline: "This looks like an investment fund or unit trust.",
  whatItIs:
    "A fund pools your money with other investors' and a manager invests it " +
    "together. You own units whose value rises and falls with what the fund " +
    "holds — shares, bonds, property or cash. There is no insurance attached, " +
    "and no surrender period.",
  payingFor: [
    "Sales charge — a one-off fee when you buy in, taken off the amount that actually gets invested.",
    "Ongoing charge (TER) — the fund's total yearly running cost, charged every year whether it goes up or down.",
    "Platform fee — a separate yearly fee if a platform or distributor holds the fund for you, on top of the fund's own charge.",
  ],
  designedToGiveYou: [
    "A diversified, professionally managed holding without you picking individual shares or bonds yourself.",
    "Units you can usually buy and sell at a price set each day.",
  ],
  watchFor: [
    "What the fund actually holds (shares, bonds, property or cash) — this sets how much it can grow and how far it can fall.",
    "The total of all the charges over your whole holding period, because fees compound.",
    "There is no insurance cover and no capital guarantee unless the document explicitly says so.",
  ],
};

const BY_KIND: Record<Exclude<ProductKind, "unknown">, ProductExplainer> = {
  ilp: ILP,
  fund: FUND,
};

/** Both explainers, for the "we're not sure — which sounds like yours?" screen. */
export const PRODUCT_EXPLAINERS: ProductExplainer[] = [ILP, FUND];

/** Look up the explainer for a detected product kind (null for "unknown"). */
export function explainerFor(
  kind: ProductKind | null | undefined,
): ProductExplainer | null {
  if (kind === "ilp" || kind === "fund") return BY_KIND[kind];
  return null;
}
