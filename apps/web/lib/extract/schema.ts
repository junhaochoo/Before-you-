/**
 * Extraction schema (specs/document-ingestion.md §Extraction schema).
 *
 * The LLM extracts TEXT into this schema and nothing more — it never advises and
 * never computes a financial figure. Every field carries a confidence; a fee that
 * is not in the document is emitted as confidence "not_found", NEVER guessed.
 */

export type Confidence = "high" | "medium" | "low" | "not_found";

export interface ExtractedField<T> {
  value: T | null;
  confidence: Confidence;
  /** Where in the document the value was found (e.g. "p.4, Effect of Deductions"). */
  source?: string;
}

export interface ExtractionResult {
  product_type: ExtractedField<string>;
  issuer: ExtractedField<string>;
  guarantee: {
    stated: ExtractedField<boolean>;
    provider: ExtractedField<string>;
  };
  fees: {
    upfront_pct: ExtractedField<number>;
    annual_mgmt_pct: ExtractedField<number>;
    ter_pct: ExtractedField<number>;
    bid_offer_pct: ExtractedField<number>;
    insurance_charge_pct: ExtractedField<number>;
    annual_admin_fee_sgd: ExtractedField<number>;
  };
  lock_in_years: ExtractedField<number>;
  projected_return_pct: ExtractedField<number>;
  key_risks: string[];
}

const field = <T>(): ExtractedField<T> => ({
  value: null,
  confidence: "not_found",
});

/** A fully "not found" result — the safe default the engine treats as needs-input. */
export function emptyExtraction(): ExtractionResult {
  return {
    product_type: field<string>(),
    issuer: field<string>(),
    guarantee: { stated: field<boolean>(), provider: field<string>() },
    fees: {
      upfront_pct: field<number>(),
      annual_mgmt_pct: field<number>(),
      ter_pct: field<number>(),
      bid_offer_pct: field<number>(),
      insurance_charge_pct: field<number>(),
      annual_admin_fee_sgd: field<number>(),
    },
    lock_in_years: field<number>(),
    projected_return_pct: field<number>(),
    key_risks: [],
  };
}

const CONFIDENCES: Confidence[] = ["high", "medium", "low", "not_found"];

/** Coerce arbitrary parsed JSON into a valid ExtractionResult (defensive). */
export function validateExtraction(raw: unknown): ExtractionResult {
  const base = emptyExtraction();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Record<string, unknown>;

  const num = <T>(
    f: unknown,
    cast: (v: unknown) => T | null,
  ): ExtractedField<T> => {
    if (!f || typeof f !== "object") return field<T>();
    const o = f as Record<string, unknown>;
    const confidence = CONFIDENCES.includes(o.confidence as Confidence)
      ? (o.confidence as Confidence)
      : "not_found";
    const value = confidence === "not_found" ? null : cast(o.value);
    return {
      value,
      confidence,
      source: typeof o.source === "string" ? o.source : undefined,
    };
  };

  const asNum = (v: unknown): number | null => {
    const n = typeof v === "string" ? parseFloat(v) : (v as number);
    return typeof n === "number" && !Number.isNaN(n) ? n : null;
  };
  const asStr = (v: unknown): string | null =>
    typeof v === "string" ? v : null;
  const asBool = (v: unknown): boolean | null =>
    typeof v === "boolean" ? v : null;

  const fees = (r.fees ?? {}) as Record<string, unknown>;
  const guarantee = (r.guarantee ?? {}) as Record<string, unknown>;

  return {
    product_type: num(r.product_type, asStr),
    issuer: num(r.issuer, asStr),
    guarantee: {
      stated: num(guarantee.stated, asBool),
      provider: num(guarantee.provider, asStr),
    },
    fees: {
      upfront_pct: num(fees.upfront_pct, asNum),
      annual_mgmt_pct: num(fees.annual_mgmt_pct, asNum),
      ter_pct: num(fees.ter_pct, asNum),
      bid_offer_pct: num(fees.bid_offer_pct, asNum),
      insurance_charge_pct: num(fees.insurance_charge_pct, asNum),
      annual_admin_fee_sgd: num(fees.annual_admin_fee_sgd, asNum),
    },
    lock_in_years: num(r.lock_in_years, asNum),
    projected_return_pct: num(r.projected_return_pct, asNum),
    key_risks: Array.isArray(r.key_risks)
      ? r.key_risks.filter((x) => typeof x === "string")
      : [],
  };
}
