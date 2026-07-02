"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { EntitlementState } from "@/lib/entitlement";
import { priceLabel } from "@/lib/pricing";
import { Icon } from "./icons";

/**
 * Global header account indicator (F6 visibility fix). Surfaces the freemium
 * state on EVERY page: "Free plan" (links to where you unlock) or "Full access ·
 * email" with sign-out. The account IS the paid entitlement — there is no
 * separate login screen by design (Stripe collects the email at checkout; a
 * secure cookie remembers it), so this badge is the whole account surface.
 */
export function AccountBadge() {
  const [state, setState] = useState<EntitlementState | null>(null);

  useEffect(() => {
    fetch("/api/entitlement")
      .then((r) => r.json() as Promise<EntitlementState>)
      .then(setState)
      .catch(() => setState({ entitled: false, configured: false }));
  }, []);

  // Render nothing until resolved — avoids a flash of the wrong state.
  if (!state) return null;

  async function signOut() {
    await fetch("/api/signout", { method: "POST" }).catch(() => {});
    window.location.reload();
  }

  if (state.entitled) {
    return (
      <span className="account-badge on">
        <Icon name="check" size={14} />
        <span className="account-badge-text">
          {state.activation ? "Free first report" : "Full access"}
          {state.email ? ` · ${state.email}` : ""}
        </span>
        <button type="button" className="account-signout" onClick={signOut}>
          Sign out
        </button>
      </span>
    );
  }

  return (
    <Link
      href="/analyze"
      className="account-badge"
      title="Unlock the full report"
    >
      <Icon name="info" size={14} />
      <span className="account-badge-text">
        {state.activationAvailable
          ? "Free plan · first report free"
          : `Free plan · full report ${priceLabel()}`}
      </span>
    </Link>
  );
}
