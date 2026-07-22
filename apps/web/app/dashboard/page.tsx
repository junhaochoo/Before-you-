"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "../components/icons";
import { listSaved, deleteSaved, type SavedReport } from "@/lib/storage";

export default function DashboardPage() {
  const [saved, setSaved] = useState<SavedReport[]>([]);

  useEffect(() => {
    setSaved(listSaved());
  }, []);

  function loadReport(r: SavedReport) {
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

  return (
    <main>
      {/* Welcome */}
      <div className="dash-welcome">
        <div>
          <h1 className="dash-welcome-heading">Your dashboard</h1>
          <p className="dash-welcome-sub">
            Analyze, compare, and understand financial products with confidence.
          </p>
        </div>
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
          {saved.length > 0 && (
            <span className="dash-count">{saved.length}</span>
          )}
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
    </main>
  );
}
