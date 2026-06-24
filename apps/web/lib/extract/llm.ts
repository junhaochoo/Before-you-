/**
 * LLM extraction (W3-4) — server-only. Text -> schema, nothing else.
 *
 * Hard compliance rules (specs/compliance-guardrails.md rule 2):
 *   - The LLM NEVER advises and NEVER computes a financial figure.
 *   - It extracts text into the schema; a value not present is "not_found", not guessed.
 * Provider/model/key come from the environment (never hardcoded) per repo convention.
 */
import "server-only";
import OpenAI from "openai";
import {
  validateExtraction,
  emptyExtraction,
  type ExtractionResult,
} from "./schema";
import {
  validateFundExtraction,
  emptyFundExtraction,
  anyFundFieldFound,
  type FundExtractionResult,
} from "./fundSchema";
import { parseJsonLoose } from "./json";

const SYSTEM_PROMPT = `You are a careful data-extraction tool for Singapore insurance
Investment-Linked Policy (ILP) documents (Product Summary / Benefit Illustration).

Your ONLY job is to read the supplied text and extract fee/structure fields into JSON.
You MUST NOT give advice, opinions, recommendations, or any "good/bad/suitable" judgement.
You MUST NOT compute, infer, or estimate any number that is not explicitly in the text —
if a value is absent, return it with "confidence":"not_found" and "value":null. Never guess.

Return ONLY JSON matching this shape (every value field carries a confidence of
"high" | "medium" | "low" | "not_found", and an optional short "source" hint):
{
 "product_type": {"value": string|null, "confidence": ...},
 "issuer": {"value": string|null, "confidence": ...},
 "guarantee": {"stated": {"value": boolean|null, "confidence": ...},
               "provider": {"value": string|null, "confidence": ...}},
 "fees": {
   "upfront_pct": {"value": number|null, "confidence": ...},
   "annual_mgmt_pct": {"value": number|null, "confidence": ...},
   "ter_pct": {"value": number|null, "confidence": ...},
   "bid_offer_pct": {"value": number|null, "confidence": ...},
   "insurance_charge_pct": {"value": number|null, "confidence": ...},
   "annual_admin_fee_sgd": {"value": number|null, "confidence": ...}
 },
 "lock_in_years": {"value": number|null, "confidence": ...},
 "projected_return_pct": {"value": number|null, "confidence": ...},
 "key_risks": [string]
}
Percentages are decimals where obvious (1.5% -> 1.5, i.e. percent units, not 0.015).`;

const FUND_SYSTEM_PROMPT = `You are a careful data-extraction tool for investment FUND
factsheets / KIIDs / prospectus fee tables (unit trusts, mutual funds, ETFs).

Your ONLY job is to read the supplied text and extract the fund name, its CHARGES, and a few
plainly-stated descriptive labels into JSON.
You MUST NOT give advice, opinions, recommendations, or any "good/bad/suitable" judgement.
You MUST NOT extract or infer any forward "expected return" or performance figure — those are
the user's own assumptions, NOT facts to lift from the document.
You MUST NOT compute, infer, or estimate any number that is not explicitly in the text —
if a value is absent, return it with "confidence":"not_found" and "value":null. Never guess.
For the descriptive labels (asset_class, credit_quality, esg_rating) copy the document's own
wording VERBATIM; do not classify, summarise, or invent a label that is not written there.

Return ONLY JSON matching this shape (every value field carries a confidence of
"high" | "medium" | "low" | "not_found", and an optional short "source" hint):
{
 "name": {"value": string|null, "confidence": ...},
 "sales_charge_pct": {"value": number|null, "confidence": ...},
 "ongoing_charge_pct": {"value": number|null, "confidence": ...},
 "platform_fee_pct": {"value": number|null, "confidence": ...},
 "asset_class": {"value": string|null, "confidence": ...},
 "credit_quality": {"value": string|null, "confidence": ...},
 "esg_rating": {"value": string|null, "confidence": ...}
}
Map common synonyms: sales_charge_pct <- "sales charge" / "subscription fee" / "entry charge" /
"initial charge"; ongoing_charge_pct <- "ongoing charge" / "TER" / "total expense ratio" /
"management fee" / "annual fund charge"; platform_fee_pct <- "platform fee" / "wrap fee" /
"distribution fee". asset_class <- "asset class" / "invests in" / "investment focus" /
"equities" / "bonds / fixed income" / "money market"; credit_quality <- "credit rating" /
"credit quality" / "investment grade" / "high yield" / a rating like "AAA"/"BBB"/"BB";
esg_rating <- "ESG" / "sustainable" / "SFDR Article 8/9" / "sustainability rating".
Percentages are in percent units (1.5% -> 1.5, not 0.015).`;

const CLASSIFY_SYSTEM_PROMPT = `You are a careful document-CLASSIFICATION tool for Singapore
retail financial documents. Your ONLY job is to decide which ONE family a document belongs to.

You MUST NOT give advice, opinions, or any "good/bad/suitable" judgement, and you MUST NOT
extract figures. Decide ONLY the family, from these three values:
 - "ilp": an insurance or investment-linked policy — benefit illustration, product summary,
   surrender value, free-look period, sum assured, cost of insurance, premiums.
 - "fund": a plain investment fund / unit trust / ETF — factsheet, KIID, ongoing charge / TER,
   net asset value (NAV), sales charge, prospectus. No insurance, no surrender period.
 - "unknown": the text does not clearly match either family.

Return ONLY JSON: {"kind": "ilp"|"fund"|"unknown", "confidence": "high"|"medium"|"low"}.`;

export type LlmProductKind = "ilp" | "fund" | "unknown";

export interface ClassifyOutcome {
  kind: LlmProductKind;
  confidence: "high" | "medium" | "low";
  model: string;
  error?: string;
}

/**
 * classifyProductLLM — model-based product-family classification, used by the API
 * route ONLY when the deterministic keyword classifier (lib/classify.ts) is unsure.
 * Classification only: it never advises and never reads a figure. Falls back to
 * "unknown" on any error or missing key so the caller can show both explainers.
 */
export async function classifyProductLLM(
  redactedText: string,
): Promise<ClassifyOutcome> {
  const { apiKey, baseURL, model } = providerConfig();
  if (!apiKey) {
    return { kind: "unknown", confidence: "low", model, error: "no_api_key" };
  }
  const client = new OpenAI({ apiKey, baseURL });
  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: CLASSIFY_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Classify this document text:\n\n${redactedText.slice(0, 6000)}`,
        },
      ],
    });
    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = parseJsonLoose(content) as Record<string, unknown>;
    const kind: LlmProductKind =
      parsed.kind === "ilp" || parsed.kind === "fund" ? parsed.kind : "unknown";
    const confidence =
      parsed.confidence === "high" ||
      parsed.confidence === "medium" ||
      parsed.confidence === "low"
        ? (parsed.confidence as "high" | "medium" | "low")
        : "low";
    return { kind, confidence, model };
  } catch (e) {
    return {
      kind: "unknown",
      confidence: "low",
      model,
      error: e instanceof Error ? e.message : "classify_failed",
    };
  }
}

export interface ExtractionOutcome {
  result: ExtractionResult;
  /** True if the model produced any field above not_found. */
  anyFound: boolean;
  model: string;
  error?: string;
}

export interface FundExtractionOutcome {
  result: FundExtractionResult;
  anyFound: boolean;
  model: string;
  error?: string;
}

/** Resolve provider config from env. Ollama Cloud speaks the OpenAI API. */
function providerConfig(): {
  apiKey: string | undefined;
  baseURL?: string;
  model: string;
} {
  const provider = (process.env.LLM_PROVIDER || "openai").toLowerCase();
  if (provider === "ollama") {
    return {
      // Local Ollama needs no key; Cloud does. A dummy keeps the client happy locally.
      apiKey: process.env.OLLAMA_API_KEY || "ollama",
      baseURL: process.env.OLLAMA_BASE_URL || "https://ollama.com/v1",
      model: process.env.OLLAMA_MODEL || "gemma3:27b",
    };
  }
  return {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.LLM_MODEL || "gpt-4o-mini",
  };
}

export async function extractFields(
  redactedText: string,
): Promise<ExtractionOutcome> {
  const { apiKey, baseURL, model } = providerConfig();

  if (!apiKey) {
    return {
      result: emptyExtraction(),
      anyFound: false,
      model,
      error: "no_api_key",
    };
  }

  const client = new OpenAI({ apiKey, baseURL });
  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Extract the fields from this document text:\n\n${redactedText.slice(0, 12000)}`,
        },
      ],
    });
    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = parseJsonLoose(content);
    const result = validateExtraction(parsed);
    const anyFound = anyFieldFound(result);
    return { result, anyFound, model };
  } catch (e) {
    // Do NOT log document content or the key — only the error class.
    return {
      result: emptyExtraction(),
      anyFound: false,
      model,
      error: e instanceof Error ? e.message : "extraction_failed",
    };
  }
}

export async function extractFundFields(
  redactedText: string,
): Promise<FundExtractionOutcome> {
  const { apiKey, baseURL, model } = providerConfig();

  if (!apiKey) {
    return {
      result: emptyFundExtraction(),
      anyFound: false,
      model,
      error: "no_api_key",
    };
  }

  const client = new OpenAI({ apiKey, baseURL });
  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: FUND_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Extract the fund name and charges from this factsheet text:\n\n${redactedText.slice(0, 12000)}`,
        },
      ],
    });
    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = parseJsonLoose(content);
    const result = validateFundExtraction(parsed);
    return { result, anyFound: anyFundFieldFound(result), model };
  } catch (e) {
    return {
      result: emptyFundExtraction(),
      anyFound: false,
      model,
      error: e instanceof Error ? e.message : "extraction_failed",
    };
  }
}

function anyFieldFound(r: ExtractionResult): boolean {
  const fields = [
    r.product_type,
    r.issuer,
    r.guarantee.stated,
    r.fees.upfront_pct,
    r.fees.annual_mgmt_pct,
    r.fees.ter_pct,
    r.fees.bid_offer_pct,
    r.fees.insurance_charge_pct,
    r.fees.annual_admin_fee_sgd,
    r.lock_in_years,
    r.projected_return_pct,
  ];
  return fields.some((f) => f.confidence !== "not_found");
}
