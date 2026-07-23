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
    setTimeout(() => {
      localStorage.setItem("bys_logged_in", "1");
      localStorage.setItem("bys_email", email);
      window.location.href = "/dashboard";
    }, 600);
  }

  return (
    <main
      style={{ maxWidth: "400px", margin: "0 auto", padding: "4rem 1.25rem" }}
    >
      <Link href="/" className="back">
        <Icon name="arrow-left" size={15} /> Back
      </Link>

      <h1 style={{ marginTop: "0.5rem", marginBottom: "2rem" }}>
        {isSignUp ? "Create account" : "Welcome back"}
      </h1>

      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <div className="login-field">
            <label>Full name</label>
            <input
              type="text"
              placeholder="Jane Tan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="login-field">
          <label>Email address</label>
          <input
            type="email"
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="login-field">
          <label>Password</label>
          <input
            type="password"
            placeholder={isSignUp ? "Min. 8 characters" : "Your password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={isSignUp ? 8 : 1}
          />
        </div>

        <button
          type="submit"
          className="btn"
          disabled={loading}
          style={{
            width: "100%",
            justifyContent: "center",
            marginTop: "1.5rem",
          }}
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
