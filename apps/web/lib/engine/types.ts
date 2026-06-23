/**
 * Shared types for the "Before You Sign" deterministic finance engine.
 *
 * Design principle (specs/analytical-engine.md + compliance-guardrails.md):
 *   - These functions are PURE and DETERMINISTIC. No LLM, no I/O, no randomness
 *     except the explicitly-seeded Monte Carlo PRNG in downside.ts.
 *   - Every output is a fact or a number. NOTHING here emits a buy/sell/suitability
 *     verdict or a "good/bad product" label. That boundary is enforced by the
 *     guardrail suite (Wave 2, W2-7).
 *   - All assumptions (return, volatility, fees) are inputs the user can vary.
 */

/** Premium structure of the product under analysis. */
export type PremiumMode = "single" | "regular";

/**
 * Product fee/structure inputs. All rates are annual decimals (0.015 = 1.5%),
 * extracted from the Benefit Illustration and user-confirmed before any math runs.
 */
export interface ProductInputs {
  /** Principal / single premium invested, S$. */
  principal: number;
  /** Investment horizon in years. */
  horizonYears: number;
  /** Gross expected annual fund return, decimal (e.g. 0.06). */
  grossReturn: number;
  /** Upfront / sales / premium-allocation charge, decimal of principal. */
  upfrontCharge: number;
  /** Bid-offer spread, decimal. */
  bidOfferSpread: number;
  /** Annual management / wrap fee, decimal. */
  annualManagementFee: number;
  /** Fund total expense ratio (TER), decimal. */
  fundTER: number;
  /** Annual insurance / mortality charge, decimal (ILP). */
  insuranceCharge: number;
  /** Fixed annual policy admin fee, S$ (deducted each year). */
  annualAdminFee: number;
  /** Premium mode. Default "single". */
  premiumMode?: PremiumMode;
  /**
   * Regular-premium schedule: for premiumMode "regular", the fraction of each
   * year's premium actually allocated to units (1 - allocation charge).
   * Index 0 = year 1. Missing years default to 1.0 (fully allocated).
   */
  allocationSchedule?: number[];
  /** Annual premium for regular-premium mode, S$. Ignored for single premium. */
  annualPremium?: number;
  /**
   * Surrender penalty schedule: penalty as a decimal of account value if
   * surrendered at the END of that year. Index 0 = year 1.
   */
  surrenderSchedule?: number[];
}

/** Output of Engine 1 (fee drag / total cost of ownership). */
export interface FeeLensResult {
  finalGross: number;
  finalNet: number;
  totalFeesPaid: number;
  /** Fee drag as a decimal of the fee-free outcome (0.36 = 36%). */
  feeDrag: number;
  /** Gross compounding curve, value at end of each year (index 0 = year 1). */
  grossCurve: number[];
  /** Net-of-fee compounding curve, value at end of each year. */
  netCurve: number[];
  /** Smallest year t where net value net of surrender penalty >= principal, or null. */
  breakEvenSurrenderYear: number | null;
}

/** Output of the BTIR (Buy-Term-and-Invest-the-Rest) benchmark. */
export interface BtirResult {
  /** Terminal value of the low-cost invested leg, S$. */
  investedLegFinal: number;
  /** ILP net terminal value (from FeeLensResult), S$. */
  ilpNetFinal: number;
  /** Excess cost of the ILP versus BTIR (investedLegFinal - ilpNetFinal), S$. */
  excessCost: number;
  /** Factual label — NEVER a recommendation. */
  framing: "factual-alternative-comparison";
}
