/**
 * Needs matching — maps a user's stated GOALS to the features they should check
 * and the questions they should ask, BEFORE they sign (brief modules 3 + 4:
 * RiskFit + Decision Gap, without a verdict).
 *
 * Compliance contract (specs/compliance-guardrails.md, mirrored by copy.ts):
 * every string here is a neutral FACT or a QUESTION. This module NEVER says a
 * product is suitable/unsuitable, good/bad, or that the user should buy/avoid
 * anything. "Matching" means: given your goal, here is what to look for and ask —
 * the judgement stays with the user and their licensed adviser.
 *
 * Pure + side-effect-free so the guardrail suite (needs.test.ts) can assert over
 * the exact strings the UI renders.
 */

export interface Need {
  /** Stable id used for selection state. */
  id: string;
  /** Short goal label shown on the selectable chip. */
  label: string;
  /** What this goal means, in plain English. */
  plain: string;
  /** Document features / terms to look for if this is your goal (facts). */
  lookFor: string[];
  /** Factors that commonly work against this goal (neutral, not a verdict). */
  worksAgainst: string[];
  /** Questions to put to the adviser — the highest-value, fully compliant lens. */
  questions: string[];
}

export const NEEDS: Need[] = [
  {
    id: "preserve",
    label: "Protect my capital",
    plain:
      "You care most about not losing the money you put in, even if that means lower growth.",
    lookFor: [
      "Where the document states a capital guarantee, and who provides it.",
      "The exact conditions under which any guarantee applies.",
      "The surrender value in each of the first five years.",
    ],
    worksAgainst: [
      "A bid-offer spread or upfront sales charge reduces your capital from day one.",
      "A surrender or lock-in period can return less than you paid if you exit early.",
      "A market value adjustment can cut your exit value when markets are down.",
    ],
    questions: [
      "Where does the document state a capital guarantee, and who provides it?",
      "Under what exact conditions does any guarantee apply?",
      "What is the surrender value in each of years 1–5?",
    ],
  },
  {
    id: "income",
    label: "Get regular income",
    plain:
      "You want predictable payouts during the holding period, not just a lump sum at the end.",
    lookFor: [
      "Whether payouts are guaranteed or projected, and the stated rate of each.",
      "Whether income is paid from returns or partly from your own capital.",
      "How long the income is paid for and any conditions that can reduce it.",
    ],
    worksAgainst: [
      "A projected (non-guaranteed) payout can fall if the fund underperforms.",
      "Income paid out of capital steadily reduces the amount still invested.",
    ],
    questions: [
      "Which part of the payout is guaranteed and which is projected?",
      "Is any income paid out of my own capital rather than returns?",
      "Under what conditions can the income be reduced or stopped?",
    ],
  },
  {
    id: "growth",
    label: "Grow my money long term",
    plain:
      "You are investing for years ahead and want the largest reasonable end value.",
    lookFor: [
      "The total effect of deductions over your whole holding period.",
      "The ongoing fund charge (TER) and any annual platform fee.",
      "How the figures change across optimistic, middle, and poor scenarios.",
    ],
    worksAgainst: [
      "High annual charges compound against you and can erase years of growth.",
      "An upfront charge means less of your money starts working from day one.",
    ],
    questions: [
      "What is the total effect of deductions over my holding period?",
      "How do the projected outcomes change between good and poor scenarios?",
      "What is the lowest-cost way to hold a similar mix of assets?",
    ],
  },
  {
    id: "inflation",
    label: "Stay ahead of inflation",
    plain:
      "You want your money to keep its real spending power over time, not just grow on paper.",
    lookFor: [
      "Whether projected returns are shown before or after inflation.",
      "The return you would need after all charges just to beat inflation.",
      "How much of the projected return is eaten by fees each year.",
    ],
    worksAgainst: [
      "Charges are deducted in full even in years when returns are low.",
      "A guaranteed but very low return can still lose to inflation in real terms.",
    ],
    questions: [
      "What return do I need after all charges just to keep pace with inflation?",
      "Are the projected figures shown in today's money or future money?",
    ],
  },
  {
    id: "access",
    label: "Keep my money accessible",
    plain:
      "You may need to reach this money at short notice, so flexibility matters.",
    lookFor: [
      "Any lock-in or surrender period, and the penalty for exiting in each year.",
      "Whether partial withdrawals are allowed and any limits on them.",
      "Any market value adjustment that could apply when you exit.",
    ],
    worksAgainst: [
      "A multi-year surrender schedule can make early exit costly.",
      "A market value adjustment can reduce what you receive at a bad time.",
    ],
    questions: [
      "What happens to my money if I stop paying or need to exit early?",
      "What is the penalty for exiting in each of the first five years?",
      "Are partial withdrawals allowed, and what are the limits?",
    ],
  },
  {
    id: "protection",
    label: "Insurance protection",
    plain:
      "You want cover for your family if something happens to you, alongside any investment.",
    lookFor: [
      "The sum assured and exactly which events are covered.",
      "The portion of each premium that pays for insurance versus investment.",
      "How the insurance charge changes as you get older.",
    ],
    worksAgainst: [
      "Bundled products can cost more than buying cover and investing separately.",
      "Insurance charges that rise with age can reduce the invested amount over time.",
    ],
    questions: [
      "How does the insurance charge change as I get older?",
      "What share of each premium pays for insurance rather than investment?",
      "What would equivalent standalone term cover cost?",
    ],
  },
  {
    id: "legacy",
    label: "Leave money to my family",
    plain:
      "You are planning what your family receives, so payout terms on death matter most.",
    lookFor: [
      "The death benefit amount and how it is calculated.",
      "Whether the death benefit is the sum assured, the account value, or the higher of the two.",
      "Any conditions or exclusions that reduce what your family receives.",
    ],
    worksAgainst: [
      "Early surrender charges can reduce the value passed on if you exit before death.",
      "A death benefit tied only to account value falls when markets are down.",
    ],
    questions: [
      "Exactly how is the death benefit calculated, and is it guaranteed?",
      "What conditions or exclusions could reduce what my family receives?",
    ],
  },
];

/**
 * Free-text keywords per goal — the deterministic dictionary behind the chat-first
 * interface (F15). The user types their goal in their own words; we match those
 * words to goals with NO AI call, so it works on every deployment regardless of
 * whether an LLM key is configured. Keywords are substrings, matched lowercased.
 */
const NEED_KEYWORDS: Record<string, string[]> = {
  preserve: [
    "protect my capital",
    "protect capital",
    "preserve",
    "lose",
    "losing",
    "no loss",
    "safe",
    "security",
    "secure",
    "principal",
    "guarantee",
    "guaranteed",
    "capital",
  ],
  income: [
    "income",
    "payout",
    "pay out",
    "dividend",
    "regular",
    "monthly",
    "cash flow",
    "yield",
    "distribution",
    "passive",
  ],
  growth: [
    "grow",
    "growth",
    "long term",
    "long-term",
    "compound",
    "build wealth",
    "wealth",
    "retire",
    "retirement",
    "appreciate",
    "maximise",
    "maximize",
    "highest return",
  ],
  inflation: [
    "inflation",
    "real return",
    "purchasing power",
    "spending power",
    "rising prices",
    "cost of living",
    "keep up",
  ],
  access: [
    "access",
    "accessible",
    "liquid",
    "liquidity",
    "withdraw",
    "flexible",
    "flexibility",
    "emergency",
    "short notice",
    "anytime",
    "any time",
    "rainy day",
  ],
  protection: [
    "insurance",
    "protection",
    "protect my family",
    "cover",
    "coverage",
    "death",
    "critical illness",
    "sum assured",
    "premium",
  ],
  legacy: [
    "legacy",
    "inherit",
    "inheritance",
    "estate",
    "leave money",
    "leave to",
    "beneficiary",
    "bequest",
    "pass on",
    "children",
    "loved ones",
    "next generation",
  ],
};

/**
 * matchFreeText — given free text the user typed, return the goal ids whose
 * keywords appear in it, in NEEDS order, de-duplicated. Empty / no-match returns
 * []. Pure + deterministic (no AI), so the chat works on every deployment.
 */
export function matchFreeText(text: string): string[] {
  const t = (text || "").toLowerCase();
  if (!t.trim()) return [];
  return NEEDS.filter((n) =>
    (NEED_KEYWORDS[n.id] || []).some((kw) => t.includes(kw)),
  ).map((n) => n.id);
}

export interface NeedMatch {
  /** The full Need objects the user selected, in NEEDS order. */
  needs: Need[];
  /** De-duplicated union of every selected need's adviser questions. */
  questions: string[];
}

/**
 * matchNeeds — given the goal ids the user selected, return the matching Need
 * detail plus a de-duplicated consolidated question list. Unknown ids are
 * ignored; order follows NEEDS so the output is deterministic.
 */
export function matchNeeds(selectedIds: string[]): NeedMatch {
  const selected = new Set(selectedIds);
  const needs = NEEDS.filter((n) => selected.has(n.id));
  const seen = new Set<string>();
  const questions: string[] = [];
  for (const n of needs) {
    for (const q of n.questions) {
      if (!seen.has(q)) {
        seen.add(q);
        questions.push(q);
      }
    }
  }
  return { needs, questions };
}
