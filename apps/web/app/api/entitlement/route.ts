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
import {
  ENTITLEMENT_COOKIE,
  DEMO_ENTITLEMENT_VALUE,
  ACTIVATION_USED_COOKIE,
  demoUnlockEnabled,
  parseActivationValue,
  type EntitlementState,
} from "@/lib/entitlement";

export const runtime = "nodejs";

export async function GET() {
  const configured = stripeConfigured();
  const demoAvailable = demoUnlockEnabled();
  const jar = await cookies();
  const sid = jar.get(ENTITLEMENT_COOKIE)?.value;
  const activationAvailable = !jar.get(ACTIVATION_USED_COOKIE)?.value;

  // Free first-report activation: the cookie IS the grant (no Stripe lookup).
  const activationEmail = parseActivationValue(sid);
  if (activationEmail) {
    const body: EntitlementState = {
      entitled: true,
      configured,
      demoAvailable,
      activation: true,
      email: activationEmail,
    };
    return NextResponse.json(body);
  }

  // Demo unlock: a no-payment full-report grant, honoured only when DEMO_UNLOCK=1.
  if (demoAvailable && sid === DEMO_ENTITLEMENT_VALUE) {
    const body: EntitlementState = {
      entitled: true,
      configured,
      demoAvailable,
      demo: true,
    };
    return NextResponse.json(body);
  }

  if (!configured || !sid) {
    const body: EntitlementState = {
      entitled: false,
      configured,
      demoAvailable,
      activationAvailable,
    };
    return NextResponse.json(body);
  }

  try {
    const session = await retrieveCheckoutSession(sid);
    const entitled = Boolean(session && session.payment_status === "paid");
    const body: EntitlementState = {
      entitled,
      configured,
      demoAvailable,
      email: session?.customer_details?.email ?? null,
      ...(entitled ? {} : { activationAvailable }),
    };
    return NextResponse.json(body);
  } catch (e) {
    console.error("entitlement.check.error", {
      error: e instanceof Error ? e.message : "unknown",
    });
    const body: EntitlementState = {
      entitled: false,
      configured,
      demoAvailable,
      activationAvailable,
    };
    return NextResponse.json(body);
  }
}
