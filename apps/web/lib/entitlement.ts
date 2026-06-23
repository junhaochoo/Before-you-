/**
 * Entitlement contract shared between the API routes and the client (F6).
 *
 * The "account" for the MVP is the paid entitlement itself: after a successful
 * Stripe Checkout the return route stores the Stripe checkout-session id in this
 * HTTP-only cookie. Entitlement is then proven by retrieving that session from
 * Stripe and checking payment_status === "paid" — a forged cookie value fails
 * the Stripe lookup, so no separate signing secret or database is needed.
 */
export const ENTITLEMENT_COOKIE = "bys_entitlement";

/**
 * Cookie sentinel for the DEMO unlock (DEMO_UNLOCK=1). When demo mode is on, the
 * checkout route writes this value instead of a Stripe session id, and the
 * entitlement route honours it WITHOUT any Stripe lookup. It is NOT a paid
 * session — every surface that shows it labels it as a demonstration.
 */
export const DEMO_ENTITLEMENT_VALUE = "demo-unlock";

/**
 * Demo unlock is opt-in per deployment via DEMO_UNLOCK=1. Server-only — only the
 * API routes call this. It lets a deployment WITHOUT Stripe (e.g. the Vercel
 * demo) show the full/paid report without taking a real payment.
 */
export function demoUnlockEnabled(): boolean {
  return process.env.DEMO_UNLOCK === "1";
}

export interface EntitlementState {
  /** True when a paid Stripe session OR an enabled demo unlock backs the cookie. */
  entitled: boolean;
  /** False when the deployment has no STRIPE_SECRET_KEY (real payments off). */
  configured: boolean;
  /** Email Stripe collected at checkout, if any. */
  email?: string | null;
  /** True when this deployment offers the no-payment demo unlock (DEMO_UNLOCK=1). */
  demoAvailable?: boolean;
  /** True when the current entitlement came from the demo unlock, not a payment. */
  demo?: boolean;
}
