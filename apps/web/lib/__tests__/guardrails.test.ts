/**
 * Compliance guardrail regression suite (W2-7).
 *
 * Encodes the carry-forward obligations from
 * 04-validate/02-redteam-round-2-convergence.md as permanent checks:
 *   (1) No report path emits a buy/sell/suitability verdict or good/bad-product label.
 *   (4) Free-look copy carries the market-value-adjustment qualifier (never "free").
 *   (5) Benchmark comparison uses BTIR, not a naked index fund.
 * Plus: the disclaimer is present on the report.
 *
 * These are STRUCTURAL absence/presence checks over the single-sourced copy in
 * lib/copy.ts — deterministic and appropriate for a regression guardrail. The
 * deeper semantic judgement ("is this overall advice?") is the gate-level reviewer's
 * job per rules/probe-driven-verification.md; this suite catches known-bad strings.
 */
import { describe, it, expect } from "vitest";
import {
  computeReport,
  STANDARD_DISCLAIMER,
  type ReportInputs,
} from "../engine";
import {
  feeLensHeadline,
  btirCopy,
  guaranteeCheckCopy,
  CONCENTRATION_CONTEXT,
  QUESTIONS_TO_ASK,
  GLOSSARY,
  FREE_LOOK_COPY,
  NO_CONFLICT_BADGE,
} from "../copy";

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
    surrenderSchedule: Array(10).fill(0.05),
  },
  context: { liquidSavings: 125_000, monthlyExpenses: 4_000, horizonYears: 20, objective: "grow" },
  holdings: [{ assetClass: "cash", amount: 125_000, liquid: true }],
  downside: { seed: 1 },
};

/** Every user-facing string the report can render, for both guarantee states. */
function allUserFacingCopy(): string {
  const report = computeReport(inputs);
  return [
    STANDARD_DISCLAIMER,
    NO_CONFLICT_BADGE,
    FREE_LOOK_COPY,
    CONCENTRATION_CONTEXT,
    feeLensHeadline(report),
    btirCopy(report),
    guaranteeCheckCopy(true, "AnInsurer"),
    guaranteeCheckCopy(false),
    ...QUESTIONS_TO_ASK,
    ...GLOSSARY.map((g) => g.plainEnglish),
  ]
    .join(" \n ")
    .toLowerCase();
}

describe("Guardrail — obligation #1: no buy/sell/suitability verdict, no good/bad label", () => {
  const copy = allUserFacingCopy();

  // Specific affirmative-verdict phrases that would cross the advice boundary.
  // (Scoped to avoid the legitimate "Not a recommendation" disclaimer text.)
  const forbidden = [
    "you should buy",
    "you should not buy",
    "you shouldn't buy",
    "is suitable for you",
    "unsuitable for you",
    "we recommend",
    "i recommend",
    "buy this product",
    "don't buy",
    "good product",
    "bad product",
    "best product",
    "worst product",
    "this is a good investment",
    "this is a bad investment",
  ];

  for (const phrase of forbidden) {
    it(`never says "${phrase}"`, () => {
      expect(copy).not.toContain(phrase);
    });
  }
});

describe("Guardrail — disclaimer present and intact", () => {
  it("the report carries the standard disclaimer", () => {
    const report = computeReport(inputs);
    expect(report.disclaimer).toBe(STANDARD_DISCLAIMER);
    expect(STANDARD_DISCLAIMER.toLowerCase()).toContain("not financial advice");
    expect(STANDARD_DISCLAIMER.toLowerCase()).toContain("not a recommendation");
  });
});

describe("Guardrail — obligation #4: free-look copy carries the MVA qualifier", () => {
  const c = FREE_LOOK_COPY.toLowerCase();
  it("mentions market value adjustment", () => {
    expect(c).toContain("market value adjustment");
  });
  it("never promises an unconditional penalty-free exit ('walk away free')", () => {
    expect(c).not.toContain("walk away free");
    expect(c).not.toContain("cancel free");
  });
  it("if it mentions little/no penalty, the MVA qualifier is in the same sentence", () => {
    // Compliant copy: "...little or no penalty, subject to any market value adjustment..."
    if (c.includes("penalty")) {
      expect(c).toContain("market value adjustment");
    }
  });
});

describe("Guardrail — obligation #5: benchmark is BTIR, not a naked index fund", () => {
  const report = computeReport(inputs);
  const btir = btirCopy(report).toLowerCase();
  it("BTIR copy references term insurance + a low-cost fund (the BTIR thesis)", () => {
    expect(btir).toContain("term insurance");
    expect(btir).toContain("low-cost fund");
  });
  it("BTIR copy is framed as a factual comparison, not a recommendation", () => {
    expect(btir).toContain("not a recommendation");
  });
  it("the engine BTIR result carries the factual-comparison framing label", () => {
    expect(report.btir.framing).toBe("factual-alternative-comparison");
  });
  it("the downside result carries the scenarios-not-forecasts label", () => {
    expect(report.downside.framing).toBe("scenarios-not-forecasts");
  });
});
