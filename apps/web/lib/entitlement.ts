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

export interface EntitlementState {
  /** True only when a real, paid Stripe session backs the cookie. */
  entitled: boolean;
  /** False when the deployment has no STRIPE_SECRET_KEY (payments off). */
  configured: boolean;
  /** Email Stripe collected at checkout, if any. */
  email?: string | null;
}
