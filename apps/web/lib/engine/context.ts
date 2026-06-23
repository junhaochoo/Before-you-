/**
 * Engine 3 — RiskFit Lens (concentration & liquidity context)
 * Engine 4 — Portfolio Mirror (concentration shift)
 *
 * Spec: specs/analytical-engine.md §Engine 3 & §Engine 4;
 * 01-analysis/06-analytical-component.md; 01-analysis/10-worked-analytical-example.md.
 *
 * COMPLIANCE-CRITICAL (specs/compliance-guardrails.md Hard rule 1 & 3):
 *   Every output here is NEUTRAL ARITHMETIC — a fact about the user's own numbers.
 *   "This is N% of YOUR liquid savings" is allowed; "this is too risky FOR YOU" is
 *   NOT. Nothing in this module emits a suitability verdict or a good/bad label.
 *   Thresholds (e.g. ~20% concentration) are surfaced as GENERAL INDUSTRY CONTEXT
 *   by the report layer, never as a directive — see compliance-guardrails.md L3.
 *
 * SPEC DEVIATION (recorded — specs/analytical-engine.md updated):
 *   specs/analytical-engine.md and 06-analytical-component.md wrote concentration
 *   as A/(L+A). The pitch's Person-A insight and the worked example both compute
 *   "S$100k product = 80% of S$125k liquid savings" = A/L. A/(L+A) would give 44%,
 *   contradicting every user-facing artifact (wireframe, pitch, worked example).
 *   We implement concentration = A / L (the product as a share of the user's liquid
 *   savings), which reproduces the demonstrated 80%, and updated the spec to match.
 */
import type { DownsideResult } from "./downside";

export interface PersonalContext {
  /** Liquid savings the user has available (pre-purchase total), S$. */
  liquidSavings: number;
  /** Monthly expenses, S$. */
  monthlyExpenses: number;
  /** Investment horizon / when the money might be needed, years. */
  horizonYears: number;
  /** Stated objective — used to phrase QUESTIONS, never to score a verdict. */
  objective?: "preserve" | "income" | "grow";
}

export interface RiskFitResult {
  /** Product as a share of liquid savings, decimal (0.80 = 80%). */
  concentration: number;
  /** Months of expenses remaining after the purchase, (L − A) / C. */
  liquidityBufferMonths: number;
  /** Dollar impact of a stress drawdown applied to the product amount, S$ (negative). */
  stressDollarImpact: number;
  /** Year the surrender penalty schedule ends (lock-in), or null if none. */
  lockInEndYear: number | null;
  /** Factual flag: the horizon is shorter than the lock-in period. */
  lockInExceedsHorizon: boolean;
  /** Whether the product amount exceeds liquid savings (concentration > 1). */
  exceedsLiquidSavings: boolean;
}

/**
 * Engine 3 — RiskFit context. All neutral arithmetic on the user's own figures.
 *
 * @param productAmount  Amount going into the product, S$ (A).
 * @param ctx            The user's personal context.
 * @param downside       Engine 2 result, used for the stress dollar impact.
 * @param stressDrawdownPct  Drawdown to apply for the stress figure (default 0.20).
 * @param lockInEndYear  Year the surrender schedule ends, if known.
 */
export function computeRiskFit(
  productAmount: number,
  ctx: PersonalContext,
  downside?: Pick<DownsideResult, "singleYearStressDollar">,
  stressDrawdownPct = 0.2,
  lockInEndYear: number | null = null,
): RiskFitResult {
  const A = productAmount;
  const L = ctx.liquidSavings;
  const concentration = L > 0 ? A / L : 0;
  const liquidityBufferMonths = ctx.monthlyExpenses > 0 ? (L - A) / ctx.monthlyExpenses : 0;
  const stressDollarImpact = downside
    ? downside.singleYearStressDollar
    : -A * stressDrawdownPct;

  return {
    concentration,
    liquidityBufferMonths,
    stressDollarImpact,
    lockInEndYear,
    lockInExceedsHorizon: lockInEndYear != null && ctx.horizonYears < lockInEndYear,
    exceedsLiquidSavings: concentration > 1,
  };
}

export interface Holding {
  /** Asset-class label (e.g. "cash", "equity", "ILP"). */
  assetClass: string;
  /** Amount, S$. */
  amount: number;
  /** Whether this holding is liquid (counts toward the liquidity ratio). */
  liquid: boolean;
}

export interface PortfolioMirrorResult {
  /** Herfindahl-Hirschman concentration index before adding the product, Σwᵢ². */
  hhiBefore: number;
  /** HHI after adding the product. */
  hhiAfter: number;
  /** Liquid / total before. */
  liquidityRatioBefore: number;
  /** Liquid / total after. */
  liquidityRatioAfter: number;
}

/** Σ wᵢ² over a set of amounts (weights computed internally). */
function hhi(amounts: number[]): number {
  const total = amounts.reduce((s, x) => s + x, 0);
  if (total <= 0) return 0;
  return amounts.reduce((s, x) => {
    const w = x / total;
    return s + w * w;
  }, 0);
}

/**
 * Engine 4 — Portfolio Mirror. Mechanical HHI + liquidity-ratio before/after adding
 * the product. The direction of the change depends entirely on the user's holdings;
 * this function reports the numbers factually and makes no claim about whether the
 * product "diversifies" or "concentrates" — the report renders the before/after bars.
 *
 * @param existing  Existing holdings (may be empty / all-cash).
 * @param productAmount  Amount going into the (illiquid) product, S$.
 * @param productFundedFromLiquid  Whether the product is funded by drawing down a
 *        liquid holding of the same amount (true) or is fresh money (false).
 */
export function computePortfolioMirror(
  existing: Holding[],
  productAmount: number,
  productFundedFromLiquid = true,
): PortfolioMirrorResult {
  const beforeAmounts = existing.map((h) => h.amount);
  const totalBefore = beforeAmounts.reduce((s, x) => s + x, 0);
  const liquidBefore = existing.filter((h) => h.liquid).reduce((s, x) => s + x.amount, 0);

  // After: add the product (illiquid). If funded from liquid savings, reduce the
  // largest liquid holding by the product amount.
  const after = existing.map((h) => ({ ...h }));
  if (productFundedFromLiquid) {
    let remaining = productAmount;
    const liquidSorted = after.filter((h) => h.liquid).sort((a, b) => b.amount - a.amount);
    for (const h of liquidSorted) {
      const draw = Math.min(h.amount, remaining);
      h.amount -= draw;
      remaining -= draw;
      if (remaining <= 0) break;
    }
  }
  after.push({ assetClass: "this-product", amount: productAmount, liquid: false });

  const afterAmounts = after.map((h) => h.amount);
  const totalAfter = afterAmounts.reduce((s, x) => s + x, 0);
  const liquidAfter = after.filter((h) => h.liquid).reduce((s, x) => s + x.amount, 0);

  return {
    hhiBefore: hhi(beforeAmounts),
    hhiAfter: hhi(afterAmounts),
    liquidityRatioBefore: totalBefore > 0 ? liquidBefore / totalBefore : 0,
    liquidityRatioAfter: totalAfter > 0 ? liquidAfter / totalAfter : 0,
  };
}
