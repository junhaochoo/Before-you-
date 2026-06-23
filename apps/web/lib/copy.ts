/**
 * Compliance-sensitive user-facing copy — single-sourced and PURE so the guardrail
 * suite (W2-7) can assert over the exact strings the UI renders.
 *
 * specs/compliance-guardrails.md: every flag is a neutral FACT or a QUESTION, never
 * an evaluative verdict on a named product. Thresholds appear as general industry
 * context with a cited basis, never as a directive aimed at the user.
 */
import { STANDARD_DISCLAIMER } from "./engine";
import type { Report } from "./engine";
import { sgd, pct } from "./format";

export { STANDARD_DISCLAIMER };

export const NO_CONFLICT_BADGE = "We earn nothing from your decision";

/**
 * Free-look entry-mode copy. MUST carry the market-value-adjustment qualifier —
 * never says "walk away free" (red-team H1). The penalty is not always zero.
 */
export const FREE_LOOK_COPY =
  "I've signed — check before the free-look period ends. You may be able to cancel " +
  "with little or no penalty, subject to any market value adjustment stated in your policy.";

/** General industry context for concentration — cited basis, not a directive. */
export const CONCENTRATION_CONTEXT =
  "Industry guidance often flags single-product concentration above ~20% of liquid " +
  "wealth (general context, not advice about your situation).";

/** Decision-gap questions to ask an adviser — fully compliant, the highest-value lens. */
export const QUESTIONS_TO_ASK: string[] = [
  "Where does the document state a capital guarantee, and who provides it?",
  "Under what exact conditions does any guarantee apply?",
  "What is the surrender value in each of years 1–5?",
  "What is the total effect of deductions over my holding period?",
  "How does the insurance charge change as I get older?",
  "What happens to my money if I stop paying or need to exit early?",
];

/** Plain-English glossary for commonly obscured terms (Product Scan). */
export const GLOSSARY: { term: string; plainEnglish: string }[] = [
  { term: "Surrender value", plainEnglish: "What you actually get back if you cash out early — often far less than you paid in the first years." },
  { term: "Effect of deductions", plainEnglish: "The total amount fees and charges remove from your returns over time." },
  { term: "Bid-offer spread", plainEnglish: "A built-in gap between the buying and selling unit price — a cost you pay up front." },
  { term: "Market value adjustment", plainEnglish: "A reduction the insurer may apply if you exit when markets are down." },
  { term: "Premium allocation", plainEnglish: "The share of each early payment actually invested — the rest covers charges." },
];

/** Guarantee-check copy: states what the document does or does not say — never assumes. */
export function guaranteeCheckCopy(stated: boolean, provider?: string): string {
  return stated
    ? `The document states a capital guarantee, provided by ${provider ?? "an unnamed party"}. Confirm the exact conditions.`
    : "The document does not state a capital guarantee. Do not assume one — ask where it is stated and who provides it.";
}

/**
 * Fee Lens headline — a factual dollar statement, no verdict.
 */
export function feeLensHeadline(r: Report): string {
  const f = r.feeLens;
  return (
    `Over ${r.sensitivity.horizonYears} years, about ${sgd(f.totalFeesPaid)} ` +
    `(${pct(f.feeDrag)} of what you could have had) goes to fees. ` +
    `You end with about ${sgd(f.finalNet)} instead of ${sgd(f.finalGross)}.`
  );
}

/** BTIR comparison copy — factual alternative, never "buy the ETF instead". */
export function btirCopy(r: Report): string {
  return (
    `Compared with buying cheap term insurance and investing the rest in a low-cost ` +
    `fund, this product costs about ${sgd(r.btir.excessCost)} more over the period. ` +
    `Part of the product's charge buys insurance; this isolates the cost beyond that. ` +
    `This is a factual comparison, not a recommendation.`
  );
}
