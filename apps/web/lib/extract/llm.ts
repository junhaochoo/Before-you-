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

export interface ExtractionOutcome {
  result: ExtractionResult;
  /** True if the model produced any field above not_found. */
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
