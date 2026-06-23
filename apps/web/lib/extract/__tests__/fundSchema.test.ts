/**
 * Fund extraction schema tests (Q2) — defensive validation of LLM JSON.
 */
import { describe, it, expect } from "vitest";
import {
  validateFundExtraction,
  emptyFundExtraction,
  anyFundFieldFound,
} from "../fundSchema";

describe("validateFundExtraction", () => {
  it("returns an all-not_found result for garbage input", () => {
    for (const bad of [null, undefined, 42, "x", []]) {
      const r = validateFundExtraction(bad);
      expect(anyFundFieldFound(r)).toBe(false);
      expect(r.sales_charge_pct.value).toBeNull();
    }
  });

  it("extracts well-formed charge fields", () => {
    const r = validateFundExtraction({
      name: { value: "Global Equity Fund", confidence: "high" },
      sales_charge_pct: { value: 3, confidence: "high", source: "fee table" },
      ongoing_charge_pct: { value: 1.25, confidence: "high" },
      platform_fee_pct: { value: 0.5, confidence: "medium" },
    });
    expect(r.name.value).toBe("Global Equity Fund");
    expect(r.sales_charge_pct.value).toBe(3);
    expect(r.ongoing_charge_pct.value).toBe(1.25);
    expect(r.platform_fee_pct.value).toBe(0.5);
    expect(anyFundFieldFound(r)).toBe(true);
  });

  it("nulls the value when confidence is not_found, even if a value is supplied", () => {
    const r = validateFundExtraction({
      sales_charge_pct: { value: 3, confidence: "not_found" },
    });
    expect(r.sales_charge_pct.value).toBeNull();
    expect(r.sales_charge_pct.confidence).toBe("not_found");
  });

  it("coerces numeric strings and rejects non-numeric ones", () => {
    const r = validateFundExtraction({
      sales_charge_pct: { value: "2.5", confidence: "high" },
      ongoing_charge_pct: { value: "n/a", confidence: "low" },
    });
    expect(r.sales_charge_pct.value).toBe(2.5);
    expect(r.ongoing_charge_pct.value).toBeNull();
  });

  it("emptyFundExtraction is fully not_found", () => {
    expect(anyFundFieldFound(emptyFundExtraction())).toBe(false);
  });
});
