/**
 * GET /api/checkout/return (F6) — Stripe success redirect target.
 *
 * Stripe sends the user here with ?session_id=… after checkout. We verify the
 * session is genuinely paid (server-side Stripe lookup — the id alone proves
 * nothing until Stripe confirms payment_status === "paid"), then set the
 * HTTP-only entitlement cookie and bounce back to the analyzer. Any failure
 * redirects with ?checkout=failed and sets no cookie.
 */
import { NextResponse } from "next/server";
import { retrieveCheckoutSession, stripeConfigured } from "@/lib/stripe";
import { ENTITLEMENT_COOKIE } from "@/lib/entitlement";

export const runtime = "nodejs";

function originOf(req: Request): string {
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  return host ? `${proto}://${host}` : new URL(req.url).origin;
}

export async function GET(req: Request) {
  const origin = originOf(req);
  const sessionId = new URL(req.url).searchParams.get("session_id");
  const fail = (reason: string) =>
    NextResponse.redirect(`${origin}/analyze?checkout=${reason}`, {
      status: 303,
    });

  if (!stripeConfigured() || !sessionId) {
    console.error("checkout.return.error", {
      reason: !sessionId ? "no_session_id" : "not_configured",
    });
    return fail("failed");
  }

  try {
    const session = await retrieveCheckoutSession(sessionId);
    if (!session || session.payment_status !== "paid") {
      console.info("checkout.return.unpaid", {
        id: sessionId,
        status: session?.payment_status ?? "not_found",
      });
      return fail("failed");
    }
    console.info("checkout.return.ok", { id: session.id });
    const res = NextResponse.redirect(`${origin}/analyze?unlocked=1`, {
      status: 303,
    });
    res.cookies.set(ENTITLEMENT_COOKIE, session.id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  } catch (e) {
    console.error("checkout.return.error", {
      error: e instanceof Error ? e.message : "unknown",
    });
    return fail("failed");
  }
}
