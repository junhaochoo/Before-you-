"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "../components/icons";
import { listSaved, deleteSaved, type SavedReport } from "@/lib/storage";
import type { EntitlementState } from "@/lib/entitlement";

export default function DashboardPage() {
  const [saved, setSaved] = useState<SavedReport[]>([]);
  const [entitlement, setEntitlement] = useState<EntitlementState | null>(null);

  useEffect(() => {
    setSaved(listSaved());
    fetch("/api/entitlement")
      .then((r) => r.json() as Promise<EntitlementState>)
      .then(setEntitlement)
      .catch(() => setEntitlement({ entitled: false, configured: false }));
  }, []);

  function loadReport(r: SavedReport) {
    // Restore the snapshot into sessionStorage and navigate to analyze
    try {
      sessionStorage.setItem("bys.restoreSnapshot", JSON.stringify(r.inputs));
    } catch {
      /* storage unavailable */
    }
    window.location.href = "/analyze";
  }

  function removeReport(id: string) {
    setSaved(deleteSaved(id));
  }

  const accountEmail = entitlement?.email ?? null;
  const isFullAccess = Boolean(entitlement?.entitled);

  return (
    <main>
      {/* Welcome */}
      <div className="dash-welcome">
        <div>
          <h1 className="dash-welcome-heading">
            {accountEmail ? `Welcome back` : "Your dashboard"}
          </h1>
          <p className="dash-welcome-sub">
            {isFullAccess
              ? "You have full access to all reports."
              : "Your first full report is free — no credit card needed."}
          </p>
        </div>
        {!isFullAccess && (
          <Link href="/analyze" className="btn">
            <Icon name="file" size={16} /> Start analyzing
          </Link>
        )}
      </div>

      {/* Quick actions */}
      <div className="dash-actions">
        <Link href="/analyze" className="dash-action-card">
          <div className="dash-action-icon">
            <Icon name="file" size={24} />
          </div>
          <div>
            <h3>Analyze a product</h3>
            <p>
              Insurance &amp; investment-linked policies — decode fees and terms
            </p>
          </div>
          <Icon name="arrow-right" size={18} />
        </Link>
        <Link href="/compare" className="dash-action-card">
          <div className="dash-action-icon">
            <Icon name="mirror" size={24} />
          </div>
          <div>
            <h3>Compare funds</h3>
            <p>Side-by-side fund comparison on the same amount and horizon</p>
          </div>
          <Icon name="arrow-right" size={18} />
        </Link>
        <Link href="/needs" className="dash-action-card">
          <div className="dash-action-icon">
            <Icon name="ask" size={24} />
          </div>
          <div>
            <h3>Match my goals</h3>
            <p>Get a checklist tailored to what you want this money to do</p>
          </div>
          <Icon name="arrow-right" size={18} />
        </Link>
      </div>

      {/* Saved reports */}
      <div className="dash-section">
        <div className="dash-section-head">
          <h2>Saved reports</h2>
          <span className="dash-count">{saved.length}</span>
        </div>

        {saved.length === 0 ? (
          <div className="dash-empty">
            <Icon name="save" size={32} />
            <p>No saved reports yet.</p>
            <p className="muted">
              Analyze a product and save it to access it here later.
            </p>
          </div>
        ) : (
          <div className="dash-reports">
            {saved.map((r) => (
              <div key={r.id} className="dash-report-row">
                <div className="dash-report-info">
                  <p className="dash-report-label">{r.label}</p>
                  <p className="dash-report-date">
                    {new Date(r.savedAt).toLocaleDateString("en-SG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="dash-report-actions">
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={() => loadReport(r)}
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    className="link danger"
                    onClick={() => removeReport(r.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account info */}
      <div className="dash-section">
        <div className="dash-section-head">
          <h2>Account</h2>
        </div>
        <div className="dash-account">
          {accountEmail ? (
            <>
              <div className="dash-account-row">
                <span className="muted">Email</span>
                <span>{accountEmail}</span>
              </div>
              <div className="dash-account-row">
                <span className="muted">Plan</span>
                <span
                  className={isFullAccess ? "dash-plan-full" : "dash-plan-free"}
                >
                  {isFullAccess ? "Full access" : "Free plan"}
                </span>
              </div>
              {!isFullAccess && (
                <Link
                  href="/analyze"
                  className="btn"
                  style={{ marginTop: "1rem", alignSelf: "flex-start" }}
                >
                  Unlock full access
                </Link>
              )}
            </>
          ) : (
            <>
              <p className="muted" style={{ marginBottom: "0.75rem" }}>
                No account yet. Your first full report is free.
              </p>
              <Link href="/login" className="btn ghost">
                <Icon name="user" size={16} /> Sign up free
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
