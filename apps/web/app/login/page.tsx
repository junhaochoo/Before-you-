"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "../components/icons";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simulate auth — wire to your auth provider (Auth0, Supabase, etc.)
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/dashboard";
    }, 800);
  }

  return (
    <main
      style={{ maxWidth: "440px", margin: "0 auto", padding: "3rem 1.25rem" }}
    >
      <Link href="/" className="back">
        <Icon name="arrow-left" size={15} /> Back
      </Link>

      <h1 style={{ marginTop: "0.5rem", marginBottom: "0.25rem" }}>
        {isSignUp ? "Create your account" : "Welcome back"}
      </h1>
      <p style={{ color: "var(--muted)", margin: "0 0 2rem" }}>
        {isSignUp
          ? "First report free. No credit card needed."
          : "Sign in to access your reports."}
      </p>

      <form
        className="form-card"
        onSubmit={handleSubmit}
        style={{ padding: "1.75rem" }}
      >
        {isSignUp && (
          <div className="field" style={{ marginBottom: "1rem" }}>
            <label htmlFor="name">Full name</label>
            <div className="field-input">
              <input
                id="name"
                type="text"
                placeholder="Jane Tan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        <div className="field" style={{ marginBottom: "1rem" }}>
          <label htmlFor="email">Email address</label>
          <div className="field-input">
            <input
              id="email"
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field" style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="password">Password</label>
          <div className="field-input">
            <input
              id="password"
              type="password"
              placeholder={isSignUp ? "Min. 8 characters" : "Your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isSignUp ? 8 : 1}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn"
          disabled={loading}
          style={{ width: "100%", justifyContent: "center" }}
        >
          {loading ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: "1.5rem",
          color: "var(--muted)",
          fontSize: "0.9rem",
        }}
      >
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          style={{
            background: "none",
            border: "none",
            color: "var(--accent)",
            cursor: "pointer",
            font: "inherit",
            fontSize: "inherit",
            fontWeight: 600,
            padding: 0,
            textDecoration: "underline",
          }}
        >
          {isSignUp ? "Log in" : "Sign up free"}
        </button>
      </p>
    </main>
  );
}
