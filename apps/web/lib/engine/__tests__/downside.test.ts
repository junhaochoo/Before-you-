/**
 * Golden-value + property tests for Engine 2 (Monte Carlo downside).
 * 01-analysis/10-worked-analytical-example.md §Engine 2.
 */
import { describe, it, expect } from "vitest";
import { computeDownside } from "../downside";
import type { ProductInputs } from "../types";

const workedIlp: ProductInputs = {
  principal: 100_000,
  horizonYears: 20,
  grossReturn: 0.06,
  upfrontCharge: 0.03,
  bidOfferSpread: 0,
  annualManagementFee: 0,
  fundTER: 0.015,
  insuranceCharge: 0.004,
  annualAdminFee: 360,
  premiumMode: "single",
};

const params = { mu: 0.06, sigma: 0.15, paths: 10_000, seed: 42 } as const;

describe("Engine 2 — Monte Carlo downside", () => {
  const r = computeDownside(workedIlp, params);

  it("is reproducible: same seed yields identical P5/P50/P95", () => {
    const r2 = computeDownside(workedIlp, params);
    expect(r2.p5).toBe(r.p5);
    expect(r2.p50).toBe(r.p50);
    expect(r2.p95).toBe(r.p95);
  });

  it("P5 (1-in-20 bad case) is materially below the principal", () => {
    expect(r.p5).toBeLessThan(100_000);
  });

  it("P50 (median) lands in the low-S$200k region (lognormal median-calibrated)", () => {
    expect(r.p50).toBeGreaterThan(175_000);
    expect(r.p50).toBeLessThan(230_000);
  });

  it("reports a non-trivial probability of nominal loss over 20 years", () => {
    expect(r.probabilityOfLoss).toBeGreaterThan(0.05);
    expect(r.probabilityOfLoss).toBeLessThan(0.35);
  });

  it("expected shortfall (mean of worst 5%) is at or below P5", () => {
    expect(r.expectedShortfall).toBeLessThanOrEqual(r.p5);
  });

  it("single-year stress on S$100k ≈ −S$20,000", () => {
    expect(r.singleYearStressDollar).toBeCloseTo(-20_000, -2);
  });

  it("property: lognormal never produces a value below zero (no <-100% returns)", () => {
    expect(r.p5).toBeGreaterThanOrEqual(0);
  });

  it("orders percentiles P5 <= P50 <= P95", () => {
    expect(r.p5).toBeLessThanOrEqual(r.p50);
    expect(r.p50).toBeLessThanOrEqual(r.p95);
  });

  it("carries the scenarios-not-forecasts compliance label", () => {
    expect(r.framing).toBe("scenarios-not-forecasts");
  });
});

describe("Engine 2 — Student-t fat-tail variant", () => {
  it("runs and is reproducible with a seed", () => {
    const a = computeDownside(workedIlp, { ...params, model: "student-t", tDof: 5 });
    const b = computeDownside(workedIlp, { ...params, model: "student-t", tDof: 5 });
    expect(a.p5).toBe(b.p5);
    expect(a.model).toBe("student-t");
  });
});
