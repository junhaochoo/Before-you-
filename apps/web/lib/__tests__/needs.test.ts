/**
 * Needs-matching guardrail + behaviour suite.
 *
 * Extends the obligation #1 compliance guardrail (no buy/sell/suitability
 * verdict, no good/bad-product label) to the goals→checklist surface in
 * lib/needs.ts — the same structural absence checks the report copy carries in
 * guardrails.test.ts. Plus behavioural tests for matchNeeds (deterministic
 * order, de-duplicated questions, unknown ids ignored).
 */
import { describe, it, expect } from "vitest";
import { NEEDS, matchNeeds, type Need } from "../needs";

/** Every user-facing string the needs surface can render. */
function allNeedsCopy(): string {
  const parts: string[] = [];
  for (const n of NEEDS) {
    parts.push(
      n.label,
      n.plain,
      ...n.lookFor,
      ...n.worksAgainst,
      ...n.questions,
    );
  }
  return parts.join(" \n ").toLowerCase();
}

describe("Needs guardrail — obligation #1: no verdict, no good/bad label", () => {
  const copy = allNeedsCopy();
  const forbidden = [
    "you should buy",
    "you should not buy",
    "you shouldn't buy",
    "is suitable for you",
    "suitable for you",
    "unsuitable for you",
    "we recommend",
    "i recommend",
    "buy this product",
    "don't buy",
    "good product",
    "bad product",
    "best product",
    "worst product",
    "right for you",
    "good fit",
    "bad fit",
    "perfect match",
    "this is a good investment",
    "this is a bad investment",
  ];

  for (const phrase of forbidden) {
    it(`never says "${phrase}"`, () => {
      expect(copy).not.toContain(phrase);
    });
  }
});

describe("Needs guardrail — every need is well-formed", () => {
  it("each need carries a label, plain summary, and at least one of each list", () => {
    for (const n of NEEDS) {
      expect(n.label.length).toBeGreaterThan(0);
      expect(n.plain.length).toBeGreaterThan(0);
      expect(n.lookFor.length).toBeGreaterThan(0);
      expect(n.worksAgainst.length).toBeGreaterThan(0);
      expect(n.questions.length).toBeGreaterThan(0);
    }
  });

  it("need ids are unique", () => {
    const ids = NEEDS.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every question ends with a question mark", () => {
    for (const n of NEEDS) {
      for (const q of n.questions) {
        expect(q.trim().endsWith("?")).toBe(true);
      }
    }
  });
});

describe("matchNeeds — behaviour", () => {
  it("returns selected needs in NEEDS order regardless of input order", () => {
    const order = NEEDS.map((n) => n.id);
    const a = order[2];
    const b = order[0];
    const { needs } = matchNeeds([a, b]);
    expect(needs.map((n) => n.id)).toEqual([b, a]);
  });

  it("ignores unknown ids", () => {
    const real = NEEDS[0].id;
    const { needs } = matchNeeds([real, "does-not-exist"]);
    expect(needs.map((n) => n.id)).toEqual([real]);
  });

  it("de-duplicates the consolidated question list", () => {
    const { questions } = matchNeeds(NEEDS.map((n) => n.id));
    expect(new Set(questions).size).toBe(questions.length);
  });

  it("returns empty results for an empty selection", () => {
    const m = matchNeeds([]);
    expect(m.needs).toEqual([]);
    expect(m.questions).toEqual([]);
  });

  it("consolidated questions are the union of selected needs' questions", () => {
    const sel: Need[] = [NEEDS[0], NEEDS[1]];
    const expected = new Set([...sel[0].questions, ...sel[1].questions]);
    const { questions } = matchNeeds(sel.map((n) => n.id));
    expect(new Set(questions)).toEqual(expected);
  });
});
