/**
 * Fund-education guardrail + behaviour suite (F14).
 *
 * Extends obligation #1 (no buy/sell/suitability verdict, no good/bad label) to
 * the fund-education surface in lib/fundEducation.ts — the same structural
 * absence checks the report and needs surfaces carry. Plus behavioural tests for
 * the deterministic decode* classifiers (verbatim wording -> plain explanation).
 */
import { describe, it, expect } from "vitest";
import {
  FUND_GLOSSARY,
  ASSET_CLASSES,
  CREDIT_TIERS,
  CREDIT_QUALITY_NOTE,
  ESG_NOTE,
  decodeAssetClass,
  decodeCreditQuality,
  decodeEsg,
} from "../fundEducation";

/** Every user-facing string the fund-education surface can render. */
function allFundEducationCopy(): string {
  const parts: string[] = [CREDIT_QUALITY_NOTE, ESG_NOTE];
  for (const g of FUND_GLOSSARY) parts.push(g.term, g.plainEnglish);
  for (const e of [...ASSET_CLASSES, ...CREDIT_TIERS])
    parts.push(e.label, e.plain);
  return parts.join(" \n ").toLowerCase();
}

describe("Fund education guardrail — obligation #1: no verdict, no good/bad label", () => {
  const copy = allFundEducationCopy();
  const forbidden = [
    "you should buy",
    "you should not buy",
    "you shouldn't buy",
    "is suitable for you",
    "suitable for you",
    "unsuitable for you",
    "we recommend",
    "i recommend",
    "buy this fund",
    "avoid this fund",
    "don't buy",
    "good fund",
    "bad fund",
    "best fund",
    "worst fund",
    "good investment",
    "bad investment",
    "safe choice",
    "right for you",
  ];
  for (const phrase of forbidden) {
    it(`never says "${phrase}"`, () => {
      expect(copy).not.toContain(phrase);
    });
  }
});

describe("Fund education — every explainer is well-formed", () => {
  it("each glossary entry has a term and plain English", () => {
    for (const g of FUND_GLOSSARY) {
      expect(g.term.length).toBeGreaterThan(0);
      expect(g.plainEnglish.length).toBeGreaterThan(0);
    }
  });
  it("each asset-class and credit-tier explainer has key, label, plain", () => {
    for (const e of [...ASSET_CLASSES, ...CREDIT_TIERS]) {
      expect(e.key.length).toBeGreaterThan(0);
      expect(e.label.length).toBeGreaterThan(0);
      expect(e.plain.length).toBeGreaterThan(0);
    }
  });
  it("asset-class keys are unique", () => {
    const keys = ASSET_CLASSES.map((e) => e.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("decodeAssetClass — verbatim wording -> class", () => {
  it("maps equity wording", () => {
    expect(decodeAssetClass("Global Equities")?.key).toBe("equities");
    expect(decodeAssetClass("US stock fund")?.key).toBe("equities");
  });
  it("maps bond / fixed income wording", () => {
    expect(decodeAssetClass("Asian Bonds")?.key).toBe("bonds");
    expect(decodeAssetClass("Fixed Income")?.key).toBe("bonds");
  });
  it("maps cash / money market wording", () => {
    expect(decodeAssetClass("SGD Money Market")?.key).toBe("cash");
  });
  it("maps property / REIT wording", () => {
    expect(decodeAssetClass("Global REITs")?.key).toBe("property");
  });
  it("prefers mixed when both equities and bonds appear", () => {
    expect(decodeAssetClass("Multi-Asset (equities and bonds)")?.key).toBe(
      "mixed",
    );
    expect(decodeAssetClass("Balanced fund")?.key).toBe("mixed");
  });
  it("returns null for unrecognised or empty wording", () => {
    expect(decodeAssetClass("unicorn tokens")).toBeNull();
    expect(decodeAssetClass("")).toBeNull();
    expect(decodeAssetClass(null)).toBeNull();
    expect(decodeAssetClass(undefined)).toBeNull();
  });
});

describe("decodeCreditQuality — verbatim wording -> tier", () => {
  it("maps investment-grade wording and ratings", () => {
    expect(decodeCreditQuality("Investment Grade")?.key).toBe(
      "investment-grade",
    );
    expect(decodeCreditQuality("Average rating BBB")?.key).toBe(
      "investment-grade",
    );
  });
  it("maps high-yield wording and ratings", () => {
    expect(decodeCreditQuality("High Yield")?.key).toBe("high-yield");
    expect(decodeCreditQuality("rated BB")?.key).toBe("high-yield");
  });
  it("falls back to the general note when a credit term is unclear", () => {
    const r = decodeCreditQuality("mixed credit");
    expect(r?.key).toBe("credit-general");
    expect(r?.plain).toBe(CREDIT_QUALITY_NOTE);
  });
  it("returns null for empty input", () => {
    expect(decodeCreditQuality("")).toBeNull();
    expect(decodeCreditQuality(null)).toBeNull();
  });
});

describe("decodeEsg — any ESG wording -> the neutral ESG note", () => {
  it("maps ESG / sustainability wording", () => {
    expect(decodeEsg("ESG")?.plain).toBe(ESG_NOTE);
    expect(decodeEsg("Sustainable Equity")?.plain).toBe(ESG_NOTE);
    expect(decodeEsg("SFDR Article 8")?.plain).toBe(ESG_NOTE);
  });
  it("returns null when nothing ESG-related is present", () => {
    expect(decodeEsg("Global Equities")).toBeNull();
    expect(decodeEsg("")).toBeNull();
    expect(decodeEsg(null)).toBeNull();
  });
});
