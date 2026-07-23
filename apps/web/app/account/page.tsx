"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "../components/icons";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("bys_email") || "";
    setEmail(storedEmail);
    const reports = JSON.parse(localStorage.getItem("bys_reports") || "[]");
    setSaved(Array.isArray(reports) ? reports.length : 0);
  }, []);

  function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    // Simulate password change
    setTimeout(() => {
      setLoading(false);
      setMessage("Password updated successfully.");
    }, 800);
  }

  function handleDeleteAccount() {
    if (
      !confirm(
        "Are you sure you want to delete your account? This cannot be undone.",
      )
    ) {
      return;
    }
    localStorage.removeItem("bys_logged_in");
    localStorage.removeItem("bys_email");
    localStorage.removeItem("bys_reports");
    window.location.href = "/";
  }

  return (
    <main
      style={{ maxWidth: "560px", margin: "0 auto", padding: "2.5rem 1.25rem" }}
    >
      <Link
        href="/dashboard"
        className="back"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          marginBottom: "1.5rem",
        }}
      >
        <Icon name="arrow-left" size={15} /> Back to dashboard
      </Link>

      <h1 style={{ marginBottom: "2rem" }}>Account settings</h1>

      {/* Account info */}
      <section style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            marginBottom: "1rem",
            color: "var(--ink)",
          }}
        >
          Account information
        </h2>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.75rem",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              {email ? email[0].toUpperCase() : "?"}
            </div>
            <div>
              <p style={{ fontWeight: 600, color: "var(--ink)" }}>
                {email || "Not signed in"}
              </p>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                {saved} saved {saved === 1 ? "report" : "reports"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Change password */}
      <section style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            marginBottom: "1rem",
            color: "var(--ink)",
          }}
        >
          Change password
        </h2>
        <form
          onSubmit={handlePasswordChange}
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <div className="login-field">
            <label>Current password</label>
            <input
              type="password"
              placeholder="Enter current password"
              required
            />
          </div>
          <div className="login-field">
            <label>New password</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              required
              minLength={8}
            />
          </div>
          <div className="login-field">
            <label>Confirm new password</label>
            <input type="password" placeholder="Repeat new password" required />
          </div>
          {message && (
            <p style={{ color: "var(--accent)", fontSize: "0.9rem" }}>
              {message}
            </p>
          )}
          <button
            type="submit"
            className="btn"
            disabled={loading}
            style={{ alignSelf: "flex-start" }}
          >
            {loading ? "Saving…" : "Update password"}
          </button>
        </form>
      </section>

      {/* Danger zone */}
      <section
        style={{
          marginBottom: "2rem",
          padding: "1.25rem",
          border: "1px solid #e53e3e",
          borderRadius: "0.75rem",
        }}
      >
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
            color: "#e53e3e",
          }}
        >
          Danger zone
        </h2>
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--muted)",
            marginBottom: "1rem",
          }}
        >
          Deleting your account will remove all saved reports and sign you out.
          This cannot be undone.
        </p>
        <button
          type="button"
          onClick={handleDeleteAccount}
          style={{
            background: "#e53e3e",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.5rem 1rem",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          Delete account
        </button>
      </section>
    </main>
  );
}
