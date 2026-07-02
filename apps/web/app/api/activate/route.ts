/**
 * POST /api/activate — claim the free FIRST full report (activation tier).
 *
 * The pricing framework's activation step: the user leaves an email and the
 * first full report unlocks free; subsequent reports are the one-off S$9
 * purchase. No Stripe involvement — the grant is the entitlement cookie with
 * the activation prefix, plus a separate long-lived "used" marker so signing
 * out does not mint a second free report (best-effort, same trust class as
 * the demo unlock: it gates a free tier, not a payment).
 *
 * Server-side validation per ui-backend-defense: the body must be a JSON
 * object and the email must pass normalizeActivationEmail — the client form
 * is ergonomics, not the boundary. Logs carry intent + outcome only; the
 * email itself is never logged.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ENTITLEMENT_COOKIE,
  ACTIVATION_USED_COOKIE,
  activationValueFor,
  normalizeActivationEmail,
} from "@/lib/entitlement";

export const runtime = "nodejs";

const YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    console.info("activate.rejected", { reason: "bad_json" });
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    console.info("activate.rejected", { reason: "bad_shape" });
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const email = normalizeActivationEmail(
    (body as Record<string, unknown>).email,
  );
  if (!email) {
    console.info("activate.rejected", { reason: "invalid_email" });
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const jar = await cookies();
  if (jar.get(ACTIVATION_USED_COOKIE)?.value) {
    console.info("activate.rejected", { reason: "already_used" });
    return NextResponse.json({ error: "activation_used" }, { status: 409 });
  }
  if (jar.get(ENTITLEMENT_COOKIE)?.value) {
    // Already entitled (paid, demo, or activation) — nothing to grant.
    console.info("activate.noop", { reason: "already_entitled" });
    return NextResponse.json({ ok: true, already: true });
  }

  console.info("activate.ok");
  const res = NextResponse.json({ ok: true });
  const cookieOpts = {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: YEAR_SECONDS,
  };
  res.cookies.set(ENTITLEMENT_COOKIE, activationValueFor(email), cookieOpts);
  res.cookies.set(ACTIVATION_USED_COOKIE, "1", cookieOpts);
  return res;
}
