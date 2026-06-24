/**
 * Decision-gap question-tailoring suite.
 *
 * questionsFor() renders a SUBSET of the adviser questions tailored to what the
 * document showed. The load-bearing compliance invariant: every string it can
 * return MUST come from QUESTIONS_TO_ASK (the canonical bank the guardrail suite
 * scans), so tailoring can never introduce an un-scanned, non-compliant string.
 */
import { describe, it, expect } from "vitest";
import { QUESTIONS_TO_ASK, questionsFor } from "../copy";

const ALL_CTX = [
  { kind: "ilp", hasLockIn: true, guaranteeStated: true },
  { kind: "ilp", hasLockIn: true, guaranteeStated: false },
  { kind: "ilp", hasLockIn: false, guaranteeStated: false },
  { kind: "fund", hasLockIn: false, guaranteeStated: false },
  { kind: "fund", hasLockIn: true, guaranteeStated: true },
] as const;

describe("questionsFor — compliance closure", () => {
  it("only ever returns strings from the canonical, guardrail-scanned bank", () => {
    for (const ctx of ALL_CTX) {
      for (const q of questionsFor(ctx)) {
        expect(QUESTIONS_TO_ASK).toContain(q);
      }
    }
  });
  it("always asks the three always-relevant questions", () => {
    for (const ctx of ALL_CTX) {
      const qs = questionsFor(ctx);
      expect(qs).toContain(
        "Where does the document state a capital guarantee, and who provides it?",
      );
      expect(qs).toContain(
        "What is the total effect of deductions over my holding period?",
      );
      expect(qs).toContain(
        "What happens to my money if I stop paying or need to exit early?",
      );
    }
  });
});

describe("questionsFor — tailoring", () => {
  const surrender = "What is the surrender value in each of years 1–5?";
  const insurance = "How does the insurance charge change as I get older?";
  const conditions = "Under what exact conditions does any guarantee apply?";

  it("drops the surrender-value question when there is no lock-in", () => {
    expect(
      questionsFor({ kind: "ilp", hasLockIn: false, guaranteeStated: false }),
    ).not.toContain(surrender);
    expect(
      questionsFor({ kind: "ilp", hasLockIn: true, guaranteeStated: false }),
    ).toContain(surrender);
  });

  it("drops the insurance-charge question for a plain fund", () => {
    expect(
      questionsFor({ kind: "fund", hasLockIn: false, guaranteeStated: false }),
    ).not.toContain(insurance);
    expect(
      questionsFor({ kind: "ilp", hasLockIn: false, guaranteeStated: false }),
    ).toContain(insurance);
  });

  it("only asks about guarantee conditions when a guarantee is stated", () => {
    expect(
      questionsFor({ kind: "ilp", hasLockIn: false, guaranteeStated: false }),
    ).not.toContain(conditions);
    expect(
      questionsFor({ kind: "ilp", hasLockIn: false, guaranteeStated: true }),
    ).toContain(conditions);
  });

  it("a plain fund with no lock-in and no guarantee shows the 3 core questions only", () => {
    expect(
      questionsFor({ kind: "fund", hasLockIn: false, guaranteeStated: false }),
    ).toHaveLength(3);
  });
});
