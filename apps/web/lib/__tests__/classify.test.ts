/**
 * Product-detection tests — the deterministic keyword classifier that lets the
 * upload-first entry route a document without the user identifying its type.
 *
 * These are STRUCTURAL assertions over our own classifier's decision (not a
 * semantic judgement of model output), so deterministic checks are appropriate
 * per rules/probe-driven-verification.md Rule 3.
 */
import { describe, it, expect } from "vitest";
import { classifyProduct, isConfident } from "../classify";

const ILP_DOC = `
PRODUCT SUMMARY — Benefit Illustration
This is an Investment-Linked Policy (ILP). The life assured is covered for a sum
assured of S$200,000. Cost of insurance and the monthly insurance charge are
deducted from units. A surrender charge applies in the early policy years. You may
cancel within the free-look period. Premium is payable annually.
`;

const FUND_DOC = `
FUND FACTSHEET / KIID
A unit trust investing in global equities. Net asset value (NAV) is struck daily.
The ongoing charge (TER) is 1.10% per year. A sales charge of up to 3% applies on
subscription. See the prospectus for full details. Benchmark index: MSCI World.
`;

const AMBIGUOUS_DOC = `
Thank you for your interest. Please find enclosed our brochure. Contact your
representative for more information about saving for the future.
`;

describe("classifyProduct — insurance / ILP documents", () => {
  const c = classifyProduct(ILP_DOC);
  it("detects an ILP", () => {
    expect(c.kind).toBe("ilp");
  });
  it("is confident enough to auto-route", () => {
    expect(isConfident(c)).toBe(true);
  });
  it("captures the ILP signals it matched", () => {
    expect(c.ilpSignals.length).toBeGreaterThan(0);
    expect(c.ilpSignals).toContain("benefit illustration");
  });
});

describe("classifyProduct — investment fund / unit trust documents", () => {
  const c = classifyProduct(FUND_DOC);
  it("detects a fund", () => {
    expect(c.kind).toBe("fund");
  });
  it("is confident enough to auto-route", () => {
    expect(isConfident(c)).toBe(true);
  });
  it("captures the fund signals it matched", () => {
    expect(c.fundSignals).toContain("factsheet");
    expect(c.fundSignals).toContain("unit trust");
  });
});

describe("classifyProduct — ambiguous or empty input is never a silent guess", () => {
  it("returns unknown for unrecognisable text", () => {
    const c = classifyProduct(AMBIGUOUS_DOC);
    expect(c.kind).toBe("unknown");
    expect(isConfident(c)).toBe(false);
  });
  it("returns unknown (not a throw) for empty / null input", () => {
    expect(classifyProduct("").kind).toBe("unknown");
    expect(classifyProduct(null).kind).toBe("unknown");
    expect(classifyProduct(undefined).kind).toBe("unknown");
  });
  it("returns unknown when both families are tied", () => {
    // One strong signal each → margin 0 → unknown, so the UI shows both.
    const c = classifyProduct("benefit illustration and fund factsheet");
    expect(c.kind).toBe("unknown");
  });
});

describe("classifyProduct — the stronger side wins a mixed document", () => {
  it("picks ILP when ILP signals dominate", () => {
    const mixed =
      "Benefit illustration. Surrender value. Sum assured. Death benefit. " +
      "Cost of insurance. Also mentions a sales charge once.";
    expect(classifyProduct(mixed).kind).toBe("ilp");
  });
});
