/**
 * Activation tier tests — the free FIRST full report (pricing framework's
 * activation step). Pure helpers only, no network: server-side email
 * validation, the cookie-value round-trip, and the guard that a forged or
 * junk-carrying activation cookie is NOT honoured (ui-backend-defense: the
 * cookie is client-held input; parse re-validates).
 */
import { describe, it, expect } from "vitest";
import {
  ACTIVATION_ENTITLEMENT_PREFIX,
  DEMO_ENTITLEMENT_VALUE,
  activationValueFor,
  normalizeActivationEmail,
  parseActivationValue,
} from "../entitlement";

describe("normalizeActivationEmail", () => {
  it("accepts a plain email and normalises case + whitespace", () => {
    expect(normalizeActivationEmail("  Jane.Tan@Example.COM ")).toBe(
      "jane.tan@example.com",
    );
  });

  it("rejects non-strings, empties and junk shapes", () => {
    for (const bad of [
      null,
      undefined,
      42,
      {},
      [],
      "",
      "   ",
      "no-at-sign.com",
      "two@@example.com",
      "a@b", // no TLD
      "spaces in@example.com",
      "a@b.c", // 1-char TLD
    ]) {
      expect(normalizeActivationEmail(bad)).toBeNull();
    }
  });

  it("rejects over-length input (254-char cap)", () => {
    const long = `${"a".repeat(250)}@example.com`;
    expect(normalizeActivationEmail(long)).toBeNull();
  });
});

describe("activation cookie value round-trip", () => {
  it("builds a prefixed value and parses it back to the email", () => {
    const value = activationValueFor("jane.tan@example.com");
    expect(value.startsWith(ACTIVATION_ENTITLEMENT_PREFIX)).toBe(true);
    expect(parseActivationValue(value)).toBe("jane.tan@example.com");
  });

  it("does not mistake other entitlement values for an activation grant", () => {
    // A Stripe checkout-session id and the demo sentinel must both parse null.
    expect(parseActivationValue("cs_test_a1B2c3D4")).toBeNull();
    expect(parseActivationValue(DEMO_ENTITLEMENT_VALUE)).toBeNull();
    expect(parseActivationValue(undefined)).toBeNull();
    expect(parseActivationValue(null)).toBeNull();
    expect(parseActivationValue("")).toBeNull();
  });

  it("rejects a forged activation cookie carrying a non-email payload", () => {
    expect(
      parseActivationValue(`${ACTIVATION_ENTITLEMENT_PREFIX}not-an-email`),
    ).toBeNull();
    expect(parseActivationValue(ACTIVATION_ENTITLEMENT_PREFIX)).toBeNull();
  });
});
