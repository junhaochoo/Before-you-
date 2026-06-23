/**
 * Engine 1 — Fee drag / total cost of ownership, and the BTIR benchmark.
 *
 * Spec: specs/analytical-engine.md §Engine 1; derivation in
 * 01-analysis/06-analytical-component.md; demonstrated numbers in
 * 01-analysis/10-worked-analytical-example.md.
 *
 * Net-of-fee annual recursion:
 *   V(0) = P · (1 − s) · (1 − b)              // net of upfront + bid-offer spread
 *   V(t) = V(t−1) · (1 + g − m − f − i) − admin   // fees compound; fixed admin deducted
 *   Final_gross = P · (1 + g)^T               // fee-free counterfactual
 */
import type { ProductInputs, FeeLensResult, BtirResult } from "./types";

/** Annual net growth factor (1 + g − m − f − i). */
function netFactor(p: ProductInputs): number {
  return 1 + p.grossReturn - p.annualManagementFee - p.fundTER - p.insuranceCharge;
}

/**
 * Engine 1 — compute the gross-vs-net curves and the headline fee numbers.
 *
 * Handles single-premium (the worked example: a pre-retiree investing a lump sum)
 * and regular-premium (monthly), where early-year allocation charges make fee drag
 * worse — modelled via the per-year allocationSchedule.
 */
export function computeFeeLens(p: ProductInputs): FeeLensResult {
  const T = p.horizonYears;
  const f = netFactor(p);
  const admin = p.annualAdminFee;
  const mode = p.premiumMode ?? "single";

  const grossCurve: number[] = [];
  const netCurve: number[] = [];

  // Gross (fee-free) counterfactual curve.
  for (let t = 1; t <= T; t++) {
    grossCurve.push(p.principal * Math.pow(1 + p.grossReturn, t));
  }

  // Net curve.
  if (mode === "single") {
    let v = p.principal * (1 - p.upfrontCharge) * (1 - p.bidOfferSpread);
    for (let t = 1; t <= T; t++) {
      v = v * f - admin;
      netCurve.push(v);
    }
  } else {
    // Regular premium: each year a premium is paid, allocated per the schedule,
    // net of upfront + spread, then the whole account grows and admin is deducted.
    const premium = p.annualPremium ?? 0;
    let v = 0;
    for (let t = 1; t <= T; t++) {
      const alloc = p.allocationSchedule?.[t - 1] ?? 1;
      const contributed = premium * alloc * (1 - p.upfrontCharge) * (1 - p.bidOfferSpread);
      v = (v + contributed) * f - admin;
      netCurve.push(v);
    }
  }

  const finalGross = grossCurve[T - 1];
  const finalNet = netCurve[T - 1];
  const totalFeesPaid = finalGross - finalNet;
  const feeDrag = 1 - finalNet / finalGross;

  // Break-even surrender year: smallest t where the surrender value (net value less
  // the surrender penalty for that year) is at least the principal.
  let breakEvenSurrenderYear: number | null = null;
  const principalRef = mode === "single" ? p.principal : (p.annualPremium ?? 0) * T;
  for (let t = 1; t <= T; t++) {
    const penalty = p.surrenderSchedule?.[t - 1] ?? 0;
    const surrenderValue = netCurve[t - 1] * (1 - penalty);
    if (surrenderValue >= principalRef) {
      breakEvenSurrenderYear = t;
      break;
    }
  }

  return {
    finalGross,
    finalNet,
    totalFeesPaid,
    feeDrag,
    grossCurve,
    netCurve,
    breakEvenSurrenderYear,
  };
}

/**
 * BTIR benchmark — Buy-Term-and-Invest-the-Rest (red-team H2).
 *
 * A naked index-fund comparison is rebuttable because an ILP bundles life cover.
 * The defensible, apples-to-apples benchmark invests the remainder in a low-cost
 * global fund (after setting aside cheap term-insurance premium) and isolates the
 * ILP's EXCESS cost over getting the same market exposure more cheaply.
 *
 * Factual comparison only — never "buy the ETF instead" (that would be advice).
 *
 * @param ilpNetFinal     ILP net terminal value (from computeFeeLens).
 * @param principal       Amount invested, S$.
 * @param grossReturn     Gross annual return assumption (same as the ILP scenario).
 * @param horizonYears    Horizon.
 * @param lowCostTER      Low-cost fund TER, decimal (e.g. 0.0025 = 0.25%).
 * @param termPremiumUpfront  One-off term-premium outlay removed from the invested
 *                            leg (illustrative; defaults to 0).
 */
export function computeBtir(
  ilpNetFinal: number,
  principal: number,
  grossReturn: number,
  horizonYears: number,
  lowCostTER: number,
  termPremiumUpfront = 0,
): BtirResult {
  const invested = principal - termPremiumUpfront;
  const investedLegFinal = invested * Math.pow(1 + grossReturn - lowCostTER, horizonYears);
  return {
    investedLegFinal,
    ilpNetFinal,
    excessCost: investedLegFinal - ilpNetFinal,
    framing: "factual-alternative-comparison",
  };
}
