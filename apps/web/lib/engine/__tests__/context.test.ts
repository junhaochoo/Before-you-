/**
 * Golden-value + property tests for Engine 3 (RiskFit) + Engine 4 (Portfolio Mirror).
 * 01-analysis/10-worked-analytical-example.md §Engine 3 & §Engine 4.
 */
import { describe, it, expect } from "vitest";
import {
  computeRiskFit,
  computePortfolioMirror,
  type PersonalContext,
} from "../context";

const ctx: PersonalContext = {
  liquidSavings: 125_000,
  monthlyExpenses: 4_000,
  horizonYears: 20,
  objective: "grow",
};

describe("Engine 3 — RiskFit context (Person-A/B insight, compliant)", () => {
  const r = computeRiskFit(100_000, ctx, undefined, 0.2, 10);

  it("concentration = product / liquid savings = 80%", () => {
    expect(r.concentration).toBeCloseTo(0.8, 5);
  });

  it("liquidity buffer after purchase = (125k − 100k)/4k = 6.25 months", () => {
    expect(r.liquidityBufferMonths).toBeCloseTo(6.25, 5);
  });

  it("stress dollar impact on S$100k ≈ −S$20,000", () => {
    expect(r.stressDollarImpact).toBeCloseTo(-20_000, -2);
  });

  it("lock-in flag is factual: horizon 20 vs lock-in to year 10 → no mismatch", () => {
    expect(r.lockInEndYear).toBe(10);
    expect(r.lockInExceedsHorizon).toBe(false);
  });

  it("surfaces a lock-in mismatch when horizon is shorter than lock-in", () => {
    const short = computeRiskFit(
      100_000,
      { ...ctx, horizonYears: 5 },
      undefined,
      0.2,
      10,
    );
    expect(short.lockInExceedsHorizon).toBe(true);
  });

  it("property: concentration is in [0,1] when the product fits within liquid savings", () => {
    expect(r.concentration).toBeGreaterThanOrEqual(0);
    expect(r.concentration).toBeLessThanOrEqual(1);
  });

  it("flags when the product amount exceeds liquid savings (factual, no verdict)", () => {
    const over = computeRiskFit(150_000, ctx);
    expect(over.exceedsLiquidSavings).toBe(true);
  });
});

describe("Engine 4 — Portfolio Mirror (HHI + liquidity shift)", () => {
  it("near-all-cash start: buying the ILP drops the liquidity ratio sharply", () => {
    const r = computePortfolioMirror(
      [{ assetClass: "cash", amount: 125_000, liquid: true }],
      100_000,
      true,
    );
    // total stays 125k; liquid falls from 125k to 25k.
    expect(r.liquidityRatioBefore).toBeCloseTo(1, 5);
    expect(r.liquidityRatioAfter).toBeCloseTo(0.2, 5);
  });

  it("well-diversified start: adding one large product raises HHI (more concentrated)", () => {
    // Five equal 20k holdings → HHI before = 5 × 0.2² = 0.20 (well diversified).
    // Adding a 100k product (now 50% of 200k total) pushes HHI up to ~0.30.
    // NOTE: the direction is purely mechanical — for an ALREADY-concentrated start
    // (e.g. {30k,30k,40k}, HHI 0.34) the same product can LOWER HHI by dilution.
    // The engine reports the numbers factually and asserts no direction itself.
    const existing = [
      { assetClass: "equity-sg", amount: 20_000, liquid: true },
      { assetClass: "equity-global", amount: 20_000, liquid: true },
      { assetClass: "bonds", amount: 20_000, liquid: true },
      { assetClass: "reits", amount: 20_000, liquid: true },
      { assetClass: "cash", amount: 20_000, liquid: true },
    ];
    const r = computePortfolioMirror(existing, 100_000, false);
    expect(r.hhiBefore).toBeCloseTo(0.2, 5);
    expect(r.hhiAfter).toBeGreaterThan(r.hhiBefore);
  });

  it("property: HHI is in [0,1]", () => {
    const r = computePortfolioMirror(
      [{ assetClass: "cash", amount: 125_000, liquid: true }],
      100_000,
      true,
    );
    for (const h of [r.hhiBefore, r.hhiAfter]) {
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThanOrEqual(1);
    }
  });
});
