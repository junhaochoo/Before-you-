/**
 * Tests for the funds-comparison facade (lib/engine/funds.ts).
 * Scenario: the three funds a relationship manager put in front of someone —
 * a higher-cost income fund, a mid-cost balanced fund, and a credit fund —
 * compared on the SAME amount + horizon so only the fund differs.
 */
import { describe, it, expect } from "vitest";
import {
  computeFundComparison,
  type FundInput,
  type FundGlobals,
} from "../funds";
import { computeFeeLens } from "../fees";

const globals: FundGlobals = { principal: 100_000, horizonYears: 10 };

// Generic A/B/C funds — names + figures are user inputs, not claims about real products.
const funds: FundInput[] = [
  // "House" income fund — highest total cost (RM-pushed, higher fees).
  {
    id: "a",
    name: "Fund A",
    expectedReturn: 0.04,
    volatility: 0.08,
    salesCharge: 0.03,
    ter: 0.014,
    platformFee: 0.005,
  },
  // Balanced income & growth — mid cost, higher return + risk.
  {
    id: "b",
    name: "Fund B",
    expectedReturn: 0.06,
    volatility: 0.13,
    salesCharge: 0.02,
    ter: 0.011,
    platformFee: 0.0,
  },
  // Diversified credit — lowest cost.
  {
    id: "c",
    name: "Fund C",
    expectedReturn: 0.05,
    volatility: 0.1,
    salesCharge: 0.01,
    ter: 0.009,
    platformFee: 0.0,
  },
];

describe("computeFundComparison", () => {
  const cmp = computeFundComparison(globals, funds);

  it("returns one result per fund, preserving order", () => {
    expect(cmp.funds.map((f) => f.id)).toEqual(["a", "b", "c"]);
  });

  it("each fund's fee figures match a direct computeFeeLens of the mapped product", () => {
    const direct = computeFeeLens({
      principal: 100_000,
      horizonYears: 10,
      grossReturn: 0.04,
      upfrontCharge: 0.03,
      bidOfferSpread: 0,
      annualManagementFee: 0.005,
      fundTER: 0.014,
      insuranceCharge: 0,
      annualAdminFee: 0,
      premiumMode: "single",
    });
    expect(cmp.funds[0].totalFeesPaid).toBeCloseTo(direct.totalFeesPaid, 6);
    expect(cmp.funds[0].finalNet).toBeCloseTo(direct.finalNet, 6);
  });

  it("identifies the highest- and lowest-COST fund factually", () => {
    expect(cmp.highestFeeFundId).toBe("a"); // 3% load + 1.4% TER + 0.5% platform
    expect(cmp.lowestFeeFundId).toBe("c"); // 1% load + 0.9% TER + 0% platform
  });

  it("feeSpread equals the most- minus least-expensive total fees", () => {
    const fees = cmp.funds.map((f) => f.totalFeesPaid);
    expect(cmp.feeSpread).toBeCloseTo(Math.max(...fees) - Math.min(...fees), 6);
    expect(cmp.feeSpread).toBeGreaterThan(0);
  });

  it("extraFeeVsCheapest is zero for the cheapest fund and positive otherwise", () => {
    const cheapest = cmp.funds.find((f) => f.id === cmp.lowestFeeFundId)!;
    expect(cheapest.extraFeeVsCheapest).toBeCloseTo(0, 6);
    const dearest = cmp.funds.find((f) => f.id === cmp.highestFeeFundId)!;
    expect(dearest.extraFeeVsCheapest).toBeGreaterThan(0);
  });

  it("is deterministic — same inputs reproduce identical downside figures", () => {
    const again = computeFundComparison(globals, funds);
    expect(again.funds[1].p50).toBe(cmp.funds[1].p50);
    expect(again.funds[1].p5).toBe(cmp.funds[1].p5);
  });

  it("emits no verdict — only the standard not-advice disclaimer", () => {
    expect(cmp.disclaimer).toContain("Not financial advice");
    expect(cmp.disclaimer).toContain("Not a recommendation");
  });

  it("handles a single fund without cost-extreme labels", () => {
    const one = computeFundComparison(globals, [funds[0]]);
    expect(one.highestFeeFundId).toBeNull();
    expect(one.lowestFeeFundId).toBeNull();
    expect(one.feeSpread).toBe(0);
    expect(one.funds[0].extraFeeVsCheapest).toBeCloseTo(0, 6);
  });
});
