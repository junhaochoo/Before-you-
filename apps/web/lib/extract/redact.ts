/**
 * PII redaction — runs DETERMINISTICALLY before any LLM call (W3-3, red-team M2,
 * specs/document-ingestion.md 1b). Strips name / NRIC / policy number / contact
 * details so only the fee/structure/effect-of-deductions content reaches the model.
 *
 * Carry-forward obligation #3: PII redacted before any LLM call. This is the function
 * the API route MUST call before sending text to the provider; the guardrail test
 * asserts the redacted output contains none of the seeded identifiers.
 *
 * Pure and synchronous so it is fully unit-testable.
 */

export interface RedactionReport {
  redacted: string;
  /** Count of redactions applied, by category. */
  counts: {
    nric: number;
    policy: number;
    namedLine: number;
    email: number;
    phone: number;
  };
  total: number;
}

// Singapore NRIC/FIN: leading S/T/F/G/M, 7 digits, checksum letter.
const NRIC = /\b[STFGM]\d{7}[A-Z]\b/gi;
// Email.
const EMAIL = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
// SG phone: 8 digits optionally with +65 / spaces.
const PHONE = /(?:\+?65[ -]?)?\b[689]\d{3}[ -]?\d{4}\b/g;
// Policy / proposal numbers labelled explicitly.
const POLICY =
  /\b(policy|proposal|certificate|contract)\s*(no\.?|number|#)\s*:?\s*[A-Z0-9-]{4,}/gi;
// Identity-bearing labelled lines — redact the VALUE after the label, keep the label.
const NAMED_LINE =
  /\b(name|insured|life assured|policy ?holder|policyowner|proposer|owner|applicant)\b\s*:?\s*([^\n\r]{1,80})/gi;

export function redactPII(text: string): RedactionReport {
  const counts = { nric: 0, policy: 0, namedLine: 0, email: 0, phone: 0 };

  let out = text.replace(NRIC, () => {
    counts.nric++;
    return "[NRIC_REDACTED]";
  });
  out = out.replace(EMAIL, () => {
    counts.email++;
    return "[EMAIL_REDACTED]";
  });
  out = out.replace(POLICY, (m) => {
    counts.policy++;
    // keep the label word, redact the identifier
    const label = m.split(/\s+/)[0];
    return `${label} [POLICY_NO_REDACTED]`;
  });
  out = out.replace(PHONE, () => {
    counts.phone++;
    return "[PHONE_REDACTED]";
  });
  out = out.replace(NAMED_LINE, (_m, label: string) => {
    counts.namedLine++;
    return `${label}: [NAME_REDACTED]`;
  });

  const total =
    counts.nric +
    counts.policy +
    counts.namedLine +
    counts.email +
    counts.phone;
  return { redacted: out, counts, total };
}
