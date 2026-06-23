/**
 * GET /api/entitlement (F6) — does this visitor have the paid full report?
 *
 * Reads the HTTP-only cookie set by the checkout return route and re-verifies it
 * against Stripe every time (a forged cookie value fails the lookup). Returns the
 * entitlement state the analyzer uses to unlock the full report. When the
 * deployment has no Stripe key, reports { entitled: false, configured: false }
 * so the UI can show an honest "payments not configured" state.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { retrieveCheckoutSession, stripeConfigured } from "@/lib/stripe";
import { ENTITLEMENT_COOKIE, type EntitlementState } from "@/lib/entitlement";

export const runtime = "nodejs";

export async function GET() {
  const configured = stripeConfigured();
  const sid = (await cookies()).get(ENTITLEMENT_COOKIE)?.value;

  if (!configured || !sid) {
    const body: EntitlementState = { entitled: false, configured };
    return NextResponse.json(body);
  }

  try {
    const session = await retrieveCheckoutSession(sid);
    const entitled = Boolean(session && session.payment_status === "paid");
    const body: EntitlementState = {
      entitled,
      configured,
      email: session?.customer_details?.email ?? null,
    };
    return NextResponse.json(body);
  } catch (e) {
    console.error("entitlement.check.error", {
      error: e instanceof Error ? e.message : "unknown",
    });
    const body: EntitlementState = { entitled: false, configured };
    return NextResponse.json(body);
  }
}
