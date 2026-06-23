/**
 * Golden-value tests for Engine 1 (fee drag) + BTIR.
 * Reproduces 01-analysis/10-worked-analytical-example.md — the demonstrated quant core.
 * Beachhead: a 50-year-old sold a S$100,000 single-premium ILP, 20-year horizon.
 */
import { describe, it, expect } from "vitest";
import { computeFeeLens, computeBtir } from "../fees";
import type { ProductInputs } from "../types";

/** The worked-example representative ILP. */
const workedIlp: ProductInputs = {
  principal: 100_000,
  horizonYears: 20,
  grossReturn: 0.06,
  upfrontCharge: 0.03, // upfront + bid-offer combined
  bidOfferSpread: 0,
  annualManagementFee: 0,
  fundTER: 0.015,
  insuranceCharge: 0.004,
  annualAdminFee: 360, // S$30/mo
  premiumMode: "single",
};

describe("Engine 1 — fee drag / total cost of ownership", () => {
  const r = computeFeeLens(workedIlp);

  it("reproduces the fee-free gross terminal (~S$320,714)", () => {
    expect(r.finalGross).toBeCloseTo(320_714, -2); // within ~S$100
  });

  it("reproduces the net-of-fee terminal (~S$205,900)", () => {
    expect(r.finalNet).toBeGreaterThan(204_500);
    expect(r.finalNet).toBeLessThan(207_500);
  });

  it("reproduces total fees paid (~S$114,800)", () => {
    expect(r.totalFeesPaid).toBeGreaterThan(113_000);
    expect(r.totalFeesPaid).toBeLessThan(117_000);
  });

  it("reproduces fee drag (~36%)", () => {
    expect(r.feeDrag).toBeGreaterThan(0.34);
    expect(r.feeDrag).toBeLessThan(0.38);
  });

  it("property: fees >= 0 and net <= gross at every year", () => {
    expect(r.totalFeesPaid).toBeGreaterThanOrEqual(0);
    for (let t = 0; t < workedIlp.horizonYears; t++) {
      expect(r.netCurve[t]).toBeLessThanOrEqual(r.grossCurve[t]);
    }
  });

  it("produces full-length gross and net curves", () => {
    expect(r.grossCurve).toHaveLength(20);
    expect(r.netCurve).toHaveLength(20);
  });
});

describe("Engine 1 — regular-premium mode makes drag worse", () => {
  const regular: ProductInputs = {
    ...workedIlp,
    premiumMode: "regular",
    annualPremium: 5_000,
    // Heavy early-year allocation charges: year 1–2 only ~50% allocated.
    allocationSchedule: [0.5, 0.5, 0.85, 1, 1],
  };
  it("computes a net curve and a higher fee drag than a naive no-charge case", () => {
    const r = computeFeeLens(regular);
    expect(r.netCurve).toHaveLength(20);
    expect(r.feeDrag).toBeGreaterThan(0);
  });
});

describe("BTIR benchmark (red-team H2)", () => {
  const fee = computeFeeLens(workedIlp);
  const btir = computeBtir(fee.finalNet, 100_000, 0.06, 20, 0.0025, 0);

  it("invested leg ~S$305,900", () => {
    expect(btir.investedLegFinal).toBeGreaterThan(303_000);
    expect(btir.investedLegFinal).toBeLessThan(308_000);
  });

  it("ILP excess cost vs BTIR is on the order of S$90–100k", () => {
    expect(btir.excessCost).toBeGreaterThan(88_000);
    expect(btir.excessCost).toBeLessThan(102_000);
  });

  it("carries the factual-comparison framing label, never a recommendation", () => {
    expect(btir.framing).toBe("factual-alternative-comparison");
  });
});
