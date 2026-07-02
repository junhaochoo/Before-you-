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

/**
 * Free first-report activation (the pricing framework's activation tier): the
 * FIRST full report is free after the user leaves an email. The grant is the
 * entitlement cookie itself, prefixed so the entitlement route can tell it
 * apart from a Stripe session id without any lookup.
 */
export const ACTIVATION_ENTITLEMENT_PREFIX = "activation:";

/**
 * Long-lived marker set when the free activation report is claimed, separate
 * from the entitlement cookie so signing out does NOT grant a second free
 * report. Best-effort only (a cleared browser resets it) — the same trust
 * class as the demo unlock: it gates a free tier, not a payment.
 */
export const ACTIVATION_USED_COOKIE = "bys_activation_used";

/**
 * Server-side email validation (ui-backend-defense: the UI's form validation
 * is ergonomics, not a boundary). Conservative shape check + length cap;
 * returns the trimmed, lowercased email, or null when unusable.
 */
export function normalizeActivationEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (email.length < 6 || email.length > 254) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return null;
  return email;
}

/** Build the activation cookie value for a (pre-normalized) email. */
export function activationValueFor(email: string): string {
  return `${ACTIVATION_ENTITLEMENT_PREFIX}${email}`;
}

/**
 * Parse an entitlement-cookie value as an activation grant. Returns the email
 * it was issued to, or null when the value is not a (valid) activation grant.
 * Re-validates the email so a hand-crafted cookie carrying junk stays out.
 */
export function parseActivationValue(
  value: string | undefined | null,
): string | null {
  if (!value || !value.startsWith(ACTIVATION_ENTITLEMENT_PREFIX)) return null;
  return normalizeActivationEmail(
    value.slice(ACTIVATION_ENTITLEMENT_PREFIX.length),
  );
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
  /** True when the current entitlement is the free first-report activation. */
  activation?: boolean;
  /** True when this visitor can still claim the free first full report. */
  activationAvailable?: boolean;
}
