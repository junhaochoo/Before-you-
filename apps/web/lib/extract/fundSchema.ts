/**
 * Fund-factsheet extraction schema (Q2 — fund upload).
 *
 * The LLM reads a fund factsheet / KIID / prospectus fee table and extracts the
 * CHARGES + name into this schema and nothing more. It never advises, never
 * ranks funds, and never extracts a forward "expected return" — projected
 * returns are assumptions the user sets on the compare page, not facts to be
 * lifted from a marketing figure (compliance-guardrails.md). A value not present
 * is "not_found", never guessed.
 *
 * Percentages are in PERCENT units (1.5% -> 1.5), matching the insurance schema;
 * the compare UI divides by 100 to store decimals.
 */
import type { Confidence, ExtractedField } from "./schema";

export interface FundExtractionResult {
  name: ExtractedField<string>;
  /** Upfront sales / subscription / entry charge, percent. */
  sales_charge_pct: ExtractedField<number>;
  /** Ongoing charge / TER / management fee, percent per year. */
  ongoing_charge_pct: ExtractedField<number>;
  /** Platform / wrap / distribution fee, percent per year. */
  platform_fee_pct: ExtractedField<number>;
}

const field = <T>(): ExtractedField<T> => ({
  value: null,
  confidence: "not_found",
});

export function emptyFundExtraction(): FundExtractionResult {
  return {
    name: field<string>(),
    sales_charge_pct: field<number>(),
    ongoing_charge_pct: field<number>(),
    platform_fee_pct: field<number>(),
  };
}

const CONFIDENCES: Confidence[] = ["high", "medium", "low", "not_found"];

/** Coerce arbitrary parsed JSON into a valid FundExtractionResult (defensive). */
export function validateFundExtraction(raw: unknown): FundExtractionResult {
  const base = emptyFundExtraction();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Record<string, unknown>;

  const fld = <T>(
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

  return {
    name: fld(r.name, asStr),
    sales_charge_pct: fld(r.sales_charge_pct, asNum),
    ongoing_charge_pct: fld(r.ongoing_charge_pct, asNum),
    platform_fee_pct: fld(r.platform_fee_pct, asNum),
  };
}

export function anyFundFieldFound(r: FundExtractionResult): boolean {
  return [
    r.name,
    r.sales_charge_pct,
    r.ongoing_charge_pct,
    r.platform_fee_pct,
  ].some((f) => f.confidence !== "not_found");
}
