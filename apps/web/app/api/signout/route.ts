/**
 * POST /api/signout (F6) — clear the entitlement cookie ("sign out").
 *
 * The MVP account is the paid entitlement; signing out just expires the cookie.
 * It does NOT refund or void the Stripe payment — paying again (or re-using the
 * same browser before clearing) re-establishes access.
 */
import { NextResponse } from "next/server";
import { ENTITLEMENT_COOKIE } from "@/lib/entitlement";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ENTITLEMENT_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
