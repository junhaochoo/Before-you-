/**
 * Redaction guardrail (W3-3 / W3-5) — carry-forward obligation #3:
 * PII is stripped BEFORE any LLM call. Uses a synthetic Benefit-Illustration text
 * seeded with identifiers; asserts none survive into the redacted output.
 */
import { describe, it, expect } from "vitest";
import { redactPII } from "../redact";

const SYNTHETIC_BI = `
PRODUCT SUMMARY & BENEFIT ILLUSTRATION
Name: Tan Ah Kow
Life Assured: Tan Ah Kow
NRIC: S1234567D
Policy No: POL-99887766
Email: ahkow.tan@example.com
Mobile: +65 9123 4567

Product type: Investment-Linked Policy (ILP)
Single premium: S$100,000
Upfront / premium charge: 3%
Fund management charge (TER): 1.5% p.a.
Insurance charge: 0.4% p.a.
Policy admin fee: S$30 per month
Surrender penalty applies until policy year 10.
Effect of deductions over 20 years: approximately S$114,800.
`;

describe("PII redaction (obligation #3 — runs before the LLM)", () => {
  const r = redactPII(SYNTHETIC_BI);

  it("removes the NRIC", () => {
    expect(r.redacted).not.toContain("S1234567D");
    expect(r.counts.nric).toBeGreaterThanOrEqual(1);
  });

  it("removes the policy number", () => {
    expect(r.redacted).not.toContain("POL-99887766");
    expect(r.counts.policy).toBeGreaterThanOrEqual(1);
  });

  it("removes the name from labelled identity lines", () => {
    expect(r.redacted).not.toContain("Tan Ah Kow");
    expect(r.counts.namedLine).toBeGreaterThanOrEqual(2);
  });

  it("removes email and phone", () => {
    expect(r.redacted).not.toContain("ahkow.tan@example.com");
    expect(r.redacted).not.toContain("9123 4567");
    expect(r.counts.email).toBeGreaterThanOrEqual(1);
    expect(r.counts.phone).toBeGreaterThanOrEqual(1);
  });

  it("KEEPS the fee/structure content the engine needs", () => {
    expect(r.redacted).toContain("1.5%");
    expect(r.redacted).toContain("Effect of deductions");
    expect(r.redacted).toContain("policy year 10");
    expect(r.redacted).toContain("S$100,000");
  });

  it("reports a non-zero total redaction count", () => {
    expect(r.total).toBeGreaterThanOrEqual(5);
  });
});
