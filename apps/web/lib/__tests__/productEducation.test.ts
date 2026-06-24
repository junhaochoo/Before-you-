/**
 * Product-education guardrail suite — the "what this is" explainers shown at the
 * top of every result MUST stay neutral facts: they explain what an ILP or a
 * fund IS and how it works, and NEVER say a product is good, bad, safe, suitable,
 * or worth buying (specs/compliance-guardrails.md obligation #1).
 *
 * STRUCTURAL absence/presence checks over the single-sourced copy in
 * lib/productEducation.ts — the same shape as fundEducation.test.ts and
 * guardrails.test.ts. Deeper semantic judgement is the gate-level reviewer's job.
 */
import { describe, it, expect } from "vitest";
import {
  PRODUCT_EXPLAINERS,
  explainerFor,
  type ProductExplainer,
} from "../productEducation";

/** Every user-facing string an explainer can render, lower-cased. */
function allCopy(e: ProductExplainer): string {
  return [
    e.label,
    e.headline,
    e.whatItIs,
    ...e.payingFor,
    ...e.designedToGiveYou,
    ...e.watchFor,
  ]
    .join(" \n ")
    .toLowerCase();
}

const ALL = PRODUCT_EXPLAINERS.map(allCopy).join(" \n ");

describe("Guardrail — explainers carry no buy/sell/suitability verdict", () => {
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
    "good investment",
    "bad investment",
    "is safe",
    "guaranteed returns",
    "better than",
    "worth buying",
  ];
  for (const phrase of forbidden) {
    it(`never says "${phrase}"`, () => {
      expect(ALL).not.toContain(phrase);
    });
  }
});

describe("Both product families are covered with the layman facts", () => {
  it("exposes exactly the ILP and fund explainers", () => {
    expect(PRODUCT_EXPLAINERS.map((e) => e.kind).sort()).toEqual([
      "fund",
      "ilp",
    ]);
  });

  it("the ILP explainer names insurance + investment and the surrender period", () => {
    const ilp = explainerFor("ilp");
    expect(ilp).not.toBeNull();
    const copy = allCopy(ilp as ProductExplainer);
    expect(copy).toContain("insurance");
    expect(copy).toContain("invest");
    expect(copy).toContain("surrender");
  });

  it("the fund explainer names units, the ongoing charge, and 'no insurance'", () => {
    const fund = explainerFor("fund");
    expect(fund).not.toBeNull();
    const copy = allCopy(fund as ProductExplainer);
    expect(copy).toContain("unit");
    expect(copy).toContain("ongoing charge");
    expect(copy).toContain("no insurance");
  });

  it("every explainer states what you pay for and what to check", () => {
    for (const e of PRODUCT_EXPLAINERS) {
      expect(e.payingFor.length).toBeGreaterThan(0);
      expect(e.watchFor.length).toBeGreaterThan(0);
      expect(e.designedToGiveYou.length).toBeGreaterThan(0);
    }
  });
});

describe("explainerFor — unknown / missing kinds resolve to null (never a guess)", () => {
  it("returns null for unknown", () => {
    expect(explainerFor("unknown")).toBeNull();
  });
  it("returns null for null / undefined", () => {
    expect(explainerFor(null)).toBeNull();
    expect(explainerFor(undefined)).toBeNull();
  });
});
