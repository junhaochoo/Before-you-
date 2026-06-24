/**
 * Funds comparison facade — extends the deterministic engine from a single
 * insurance product to a SIDE-BY-SIDE comparison of several investment funds
 * (unit trusts / mutual funds), e.g. comparing the three funds a relationship
 * manager put in front of someone.
 *
 * Reuses the existing, tested engines unchanged:
 *   - computeFeeLens  — total cost of ownership / fee drag (a fund has a sales
 *     charge, an ongoing TER, and a platform/wrap fee; no insurance or surrender).
 *   - computeDownside — Monte Carlo scenarios from per-fund return + volatility.
 *
 * COMPLIANCE (specs/compliance-guardrails.md): this module produces FACTS and
 * NUMBERS only. It identifies the highest/lowest-COST fund as a factual cost
 * statement — it NEVER ranks funds by "good/bad", never names a winner, and
 * never emits a buy/sell/suitability verdict. Cost is one factual axis the user
 * weighs themselves.
 */
import type { ProductInputs } from "./types";
import { computeFeeLens } from "./fees";
import { computeDownside } from "./downside";
import { STANDARD_DISCLAIMER } from "./index";

/** One fund the user is comparing. Charges/return/volatility come from its factsheet. */
export interface FundInput {
  id: string;
  name: string;
  /** Assumed average annual return, decimal (e.g. 0.05). User-adjustable assumption. */
  expectedReturn: number;
  /** Assumed annual volatility, decimal (e.g. 0.13). Higher = wider range of outcomes. */
  volatility: number;
  /** Upfront sales / subscription charge, decimal of amount invested. */
  salesCharge: number;
  /** Ongoing fund charge / TER (total expense ratio), decimal per year. */
  ter: number;
  /** Annual platform / wrap / distribution fee, decimal per year. */
  platformFee: number;
  /**
   * Display-only descriptive labels read VERBATIM from a factsheet (F14). They
   * never enter the cost/return computation — the engine ignores them — and are
   * surfaced only to decode terminology for the user. Absent when entered by hand.
   */
  assetClass?: string;
  creditQuality?: string;
  esg?: string;
  /**
   * Where the charges came from (display-only provenance, never computed on):
   * a factsheet filename, "Pasted fee table", or undefined when typed by hand.
   * Lets the card cite the source of each figure (reliability).
   */
  source?: string;
}

/** Inputs held constant across every fund so the comparison is apples-to-apples. */
export interface FundGlobals {
  /** Amount invested, S$ (same for each fund). */
  principal: number;
  /** Investment horizon in years (same for each fund). */
  horizonYears: number;
}

/** Per-fund computed outcome — every figure derived, nothing hardcoded. */
export interface FundResult {
  id: string;
  name: string;
  input: FundInput;
  /** Fee-free counterfactual terminal value, S$. */
  finalGross: number;
  /** Net-of-fees terminal value, S$. */
  finalNet: number;
  /** Total fees paid over the horizon, S$. */
  totalFeesPaid: number;
  /** Fee drag as a decimal of the fee-free outcome (0.18 = 18%). */
  feeDrag: number;
  /** Net-of-fee compounding curve (value at end of each year). */
  netCurve: number[];
  /** Typical (median) Monte Carlo outcome, S$. */
  p50: number;
  /** 1-in-20 bad case (5th percentile), S$. */
  p5: number;
  /** 1-in-20 GOOD case (95th percentile), S$ — the top of the likely range. */
  p95: number;
  /** Probability the terminal value is below the amount invested. */
  probabilityOfLoss: number;
  /** Typical worst peak-to-trough dip along the way, decimal (0.30 = down 30%). */
  medianMaxDrawdown: number;
  /** One-off entry charge in dollars (sales charge × amount invested), S$. */
  oneOffEntryCost: number;
  /** Yearly running cost rate (ongoing charge/TER + platform fee), decimal/yr. */
  yearlyCostRate: number;
  /** Yearly running cost in dollars on the starting amount, S$/yr (a plain-English approximation). */
  yearlyCostApprox: number;
  /**
   * Fee hurdle: the annual return the fund must earn JUST to cover its costs
   * before the investor makes anything — the ongoing cost plus the one-off entry
   * charge spread over the horizon. A neutral fact, decimal/yr.
   */
  feeHurdleRate: number;
  /** Extra fees this fund costs versus the cheapest fund in the set, S$ (0 for the cheapest). */
  extraFeeVsCheapest: number;
}

export interface FundComparison {
  globals: FundGlobals;
  funds: FundResult[];
  disclaimer: string;
  /** id of the fund with the HIGHEST total fees — a factual cost label, not a verdict. */
  highestFeeFundId: string | null;
  /** id of the fund with the LOWEST total fees — a factual cost label, not a verdict. */
  lowestFeeFundId: string | null;
  /** Difference in total fees between the most and least expensive fund, S$. */
  feeSpread: number;
}

/** Map a fund + shared globals onto the engine's ProductInputs (single-premium shape). */
function toProductInputs(g: FundGlobals, f: FundInput): ProductInputs {
  return {
    principal: g.principal,
    horizonYears: g.horizonYears,
    grossReturn: f.expectedReturn,
    upfrontCharge: f.salesCharge,
    bidOfferSpread: 0,
    annualManagementFee: f.platformFee,
    fundTER: f.ter,
    insuranceCharge: 0,
    annualAdminFee: 0,
    premiumMode: "single",
  };
}

/**
 * Compute the full side-by-side comparison. Deterministic: the Monte Carlo seed
 * is fixed so the same inputs always produce the same scenario figures.
 */
export function computeFundComparison(
  globals: FundGlobals,
  funds: FundInput[],
  opts?: { paths?: number; seed?: number },
): FundComparison {
  const paths = opts?.paths ?? 3000;
  const seed = opts?.seed ?? 42;

  // First pass: fees + downside per fund.
  const partials = funds.map((f) => {
    const product = toProductInputs(globals, f);
    const fee = computeFeeLens(product);
    const down = computeDownside(product, {
      mu: f.expectedReturn,
      sigma: f.volatility,
      paths,
      seed,
    });
    return {
      id: f.id,
      name: f.name,
      input: f,
      finalGross: fee.finalGross,
      finalNet: fee.finalNet,
      totalFeesPaid: fee.totalFeesPaid,
      feeDrag: fee.feeDrag,
      netCurve: fee.netCurve,
      p50: down.p50,
      p5: down.p5,
      p95: down.p95,
      probabilityOfLoss: down.probabilityOfLoss,
      medianMaxDrawdown: down.medianMaxDrawdown,
    };
  });

  const fees = partials.map((p) => p.totalFeesPaid);
  const minFee = fees.length ? Math.min(...fees) : 0;
  const maxFee = fees.length ? Math.max(...fees) : 0;
  const horizon = Math.max(1, globals.horizonYears);

  const results: FundResult[] = partials.map((p) => {
    const yearlyCostRate = p.input.ter + p.input.platformFee;
    return {
      ...p,
      oneOffEntryCost: globals.principal * p.input.salesCharge,
      yearlyCostRate,
      yearlyCostApprox: globals.principal * yearlyCostRate,
      // Ongoing cost + the entry charge amortised across the holding period:
      // what the fund must out-earn each year before the investor is ahead.
      feeHurdleRate: yearlyCostRate + p.input.salesCharge / horizon,
      extraFeeVsCheapest: p.totalFeesPaid - minFee,
    };
  });

  // Factual cost extremes (only meaningful with ≥2 funds).
  let highestFeeFundId: string | null = null;
  let lowestFeeFundId: string | null = null;
  if (results.length >= 2) {
    highestFeeFundId = results.reduce((a, b) =>
      b.totalFeesPaid > a.totalFeesPaid ? b : a,
    ).id;
    lowestFeeFundId = results.reduce((a, b) =>
      b.totalFeesPaid < a.totalFeesPaid ? b : a,
    ).id;
  }

  return {
    globals,
    funds: results,
    disclaimer: STANDARD_DISCLAIMER,
    highestFeeFundId,
    lowestFeeFundId,
    feeSpread: maxFee - minFee,
  };
}
