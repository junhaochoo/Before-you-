/**
 * Minimal Stripe client over the REST API (F6).
 *
 * We talk to Stripe directly with fetch + form-encoding instead of pulling in the
 * Stripe SDK — fewer dependencies, and the only secret is STRIPE_SECRET_KEY read
 * from the environment (never hardcoded, never logged). SERVER-ONLY: import this
 * exclusively from API route handlers, never from a client component.
 *
 * Test mode vs live mode is entirely a property of the key (sk_test_… vs sk_live_…);
 * this code is identical either way.
 */
const STRIPE_API = "https://api.stripe.com/v1";

export interface StripeCheckoutSession {
  id: string;
  url: string | null;
  payment_status?: string;
  customer_details?: { email?: string | null } | null;
}

/** True only when a Stripe secret key is configured on this deployment. */
export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function authHeader(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  return `Bearer ${key}`;
}

/**
 * Create a one-time Checkout Session for the full report. The amount + currency
 * come from lib/pricing.ts SERVER-SIDE — the client never supplies a price.
 */
export async function createCheckoutSession(opts: {
  origin: string;
  amountCents: number;
  currency: string;
  productName: string;
  productDescription: string;
}): Promise<StripeCheckoutSession> {
  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set(
    "success_url",
    `${opts.origin}/api/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
  );
  body.set("cancel_url", `${opts.origin}/analyze?checkout=cancelled`);
  body.set("line_items[0][quantity]", "1");
  body.set("line_items[0][price_data][currency]", opts.currency);
  body.set("line_items[0][price_data][unit_amount]", String(opts.amountCents));
  body.set("line_items[0][price_data][product_data][name]", opts.productName);
  body.set(
    "line_items[0][price_data][product_data][description]",
    opts.productDescription,
  );

  const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) {
    // Stripe's error body never contains our key; safe to surface the status.
    const detail = await res.text().catch(() => "");
    throw new Error(
      `stripe_checkout_create_failed: ${res.status} ${detail.slice(0, 180)}`,
    );
  }
  return (await res.json()) as StripeCheckoutSession;
}

/** Retrieve a Checkout Session to verify payment. Returns null on any failure. */
export async function retrieveCheckoutSession(
  id: string,
): Promise<StripeCheckoutSession | null> {
  const res = await fetch(
    `${STRIPE_API}/checkout/sessions/${encodeURIComponent(id)}`,
    { headers: { Authorization: authHeader() } },
  );
  if (!res.ok) return null;
  return (await res.json()) as StripeCheckoutSession;
}
