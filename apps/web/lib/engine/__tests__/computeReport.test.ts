/**
 * End-to-end facade test (W1-6) — computeReport produces every lens's numbers
 * from one call, reproducing the worked example, with the compliance disclaimer.
 */
import { describe, it, expect } from "vitest";
import { computeReport, STANDARD_DISCLAIMER, type ReportInputs } from "../index";

const inputs: ReportInputs = {
  product: {
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
    surrenderSchedule: Array(10).fill(0.05), // lock-in to year 10
  },
  context: {
    liquidSavings: 125_000,
    monthlyExpenses: 4_000,
    horizonYears: 20,
    objective: "grow",
  },
  holdings: [{ assetClass: "cash", amount: 125_000, liquid: true }],
  downside: { seed: 42 },
};

describe("computeReport — full report facade", () => {
  const report = computeReport(inputs);

  it("covers all five lenses + sensitivity", () => {
    expect(report.feeLens).toBeDefined();
    expect(report.btir).toBeDefined();
    expect(report.downside).toBeDefined();
    expect(report.riskFit).toBeDefined();
    expect(report.portfolio).toBeDefined();
    expect(report.sensitivity).toBeDefined();
  });

  it("reproduces the headline fee drag (~36%)", () => {
    expect(report.feeLens.feeDrag).toBeGreaterThan(0.34);
    expect(report.feeLens.feeDrag).toBeLessThan(0.38);
  });

  it("reproduces the concentration headline (80%)", () => {
    expect(report.riskFit.concentration).toBeCloseTo(0.8, 5);
  });

  it("derives lock-in end year from the surrender schedule (year 10)", () => {
    expect(report.riskFit.lockInEndYear).toBe(10);
  });

  it("carries the standard compliance disclaimer", () => {
    expect(report.disclaimer).toBe(STANDARD_DISCLAIMER);
    expect(report.disclaimer).toContain("Not financial advice");
  });
});
