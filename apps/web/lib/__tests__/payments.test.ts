/**
 * Payments surface tests (F6) — pure pricing + the Stripe-configured gate.
 *
 * No network: the no-key paths throw before any fetch, and stripeConfigured()
 * reads only the environment. This pins the freemium contract: a deployment
 * without a key is cleanly "not configured" rather than fake-enabled.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { FULL_REPORT_PRICE, priceLabel } from "../pricing";
import {
  stripeConfigured,
  createCheckoutSession,
  retrieveCheckoutSession,
} from "../stripe";

describe("pricing", () => {
  it("amount is a positive integer number of cents", () => {
    expect(FULL_REPORT_PRICE.amountCents).toBeGreaterThan(0);
    expect(Number.isInteger(FULL_REPORT_PRICE.amountCents)).toBe(true);
  });

  it("currency is lowercase (Stripe expects this)", () => {
    expect(FULL_REPORT_PRICE.currency).toBe(
      FULL_REPORT_PRICE.currency.toLowerCase(),
    );
  });

  it("priceLabel renders whole dollars without decimals", () => {
    // 900 cents = S$9
    expect(priceLabel()).toBe("S$9");
  });

  it("the product name carries no buy/sell/suitability verdict", () => {
    const blob =
      `${FULL_REPORT_PRICE.productName} ${FULL_REPORT_PRICE.productDescription}`.toLowerCase();
    for (const phrase of [
      "you should buy",
      "suitable for you",
      "we recommend",
      "best product",
    ]) {
      expect(blob).not.toContain(phrase);
    }
  });
});

describe("stripe configuration gate", () => {
  const original = process.env.STRIPE_SECRET_KEY;
  beforeEach(() => {
    delete process.env.STRIPE_SECRET_KEY;
  });
  afterEach(() => {
    if (original === undefined) delete process.env.STRIPE_SECRET_KEY;
    else process.env.STRIPE_SECRET_KEY = original;
  });

  it("reports not-configured when no key is set", () => {
    expect(stripeConfigured()).toBe(false);
  });

  it("reports configured when a key is set", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_dummy";
    expect(stripeConfigured()).toBe(true);
  });

  it("createCheckoutSession refuses (throws) with no key — never a fake success", async () => {
    await expect(
      createCheckoutSession({
        origin: "https://example.test",
        amountCents: FULL_REPORT_PRICE.amountCents,
        currency: FULL_REPORT_PRICE.currency,
        productName: FULL_REPORT_PRICE.productName,
        productDescription: FULL_REPORT_PRICE.productDescription,
      }),
    ).rejects.toThrow(/not configured/);
  });

  it("retrieveCheckoutSession refuses (throws) with no key", async () => {
    await expect(retrieveCheckoutSession("cs_test_x")).rejects.toThrow(
      /not configured/,
    );
  });
});
