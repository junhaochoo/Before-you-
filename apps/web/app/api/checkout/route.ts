/**
 * POST /api/checkout (F6) — start a Stripe Checkout for the full report.
 *
 * The price + currency are set SERVER-SIDE from lib/pricing.ts; the client sends
 * no amount (ui-backend-defense.md: never trust the UI for value). Returns
 * { url } for the client to redirect to, or { error: "not_configured" } (501)
 * when this deployment has no Stripe key — an honest, non-fake disabled state.
 *
 * Logs only intent + outcome (status, session id) — never the key or card data.
 */
import { NextResponse } from "next/server";
import { createCheckoutSession, stripeConfigured } from "@/lib/stripe";
import { FULL_REPORT_PRICE } from "@/lib/pricing";
import {
  ENTITLEMENT_COOKIE,
  DEMO_ENTITLEMENT_VALUE,
  demoUnlockEnabled,
} from "@/lib/entitlement";

export const runtime = "nodejs";

function originOf(req: Request): string {
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  return host ? `${proto}://${host}` : new URL(req.url).origin;
}

export async function POST(req: Request) {
  if (!stripeConfigured()) {
    // Demo mode: no Stripe, but DEMO_UNLOCK=1 lets us reveal the full report
    // WITHOUT a payment. Clearly flagged as a demo to the user (?demo=1).
    if (demoUnlockEnabled()) {
      console.info("checkout.create.demo_unlock");
      const res = NextResponse.json({
        url: `${originOf(req)}/analyze?unlocked=1&demo=1`,
        demo: true,
      });
      res.cookies.set(ENTITLEMENT_COOKIE, DEMO_ENTITLEMENT_VALUE, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
      return res;
    }
    console.info("checkout.create.skipped", { reason: "not_configured" });
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }
  try {
    const origin = originOf(req);
    console.info("checkout.create.start", { origin });
    const session = await createCheckoutSession({
      origin,
      amountCents: FULL_REPORT_PRICE.amountCents,
      currency: FULL_REPORT_PRICE.currency,
      productName: FULL_REPORT_PRICE.productName,
      productDescription: FULL_REPORT_PRICE.productDescription,
    });
    if (!session.url) {
      console.error("checkout.create.error", {
        reason: "no_url",
        id: session.id,
      });
      return NextResponse.json({ error: "no_checkout_url" }, { status: 502 });
    }
    console.info("checkout.create.ok", { id: session.id });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("checkout.create.error", {
      error: e instanceof Error ? e.message : "unknown",
    });
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 });
  }
}
