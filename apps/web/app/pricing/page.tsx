import Link from "next/link";
import { Icon } from "../components/icons";

export const metadata = {
  title: "Pricing — Before You Sign",
};

export default function PricingPage() {
  return (
    <main
      style={{ maxWidth: "720px", margin: "0 auto", padding: "2.5rem 1.25rem" }}
    >
      <h1 style={{ marginBottom: "0.5rem" }}>Pricing</h1>
      <p
        style={{
          color: "var(--muted)",
          marginBottom: "2.5rem",
          fontSize: "1.05rem",
        }}
      >
        Before You Sign is free to use. No credit card, no catch.
      </p>

      {/* Pricing card */}
      <div
        style={{
          background: "var(--surface)",
          border: "2px solid var(--accent)",
          borderRadius: "1rem",
          padding: "2.5rem",
          textAlign: "center",
          marginBottom: "3rem",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "var(--accent)",
            color: "#fff",
            padding: "0.25rem 0.75rem",
            borderRadius: "2rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            marginBottom: "1rem",
          }}
        >
          Free
        </div>
        <h2
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            margin: "0 0 0.5rem",
            color: "var(--ink)",
          }}
        >
          $0
        </h2>
        <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
          Forever. No trial period.
        </p>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 2rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            textAlign: "left",
          }}
        >
          {[
            "Unlimited product analyses",
            "Side-by-side fund comparisons",
            "Personalized question checklists",
            "PDF report generation",
            "Save up to 10 reports",
          ].map((feature) => (
            <li
              key={feature}
              style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
            >
              <Icon
                name="check-circle"
                size={18}
                style={{ color: "var(--accent)", flexShrink: 0 }}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/login?mode=signup"
          className="btn"
          style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}
        >
          Get started — it's free
        </Link>
      </div>

      {/* Why free */}
      <section style={{ marginBottom: "3rem" }}>
        <h3
          style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}
        >
          Why is it free?
        </h3>
        <p
          style={{
            color: "var(--muted)",
            lineHeight: 1.7,
            marginBottom: "1rem",
          }}
        >
          We believe everyone deserves to understand what they're signing —
          especially for large, complex financial products where the stakes are
          high and the jargon is thick.
        </p>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          Before You Sign is an independent tool. We don't sell financial
          products, accept referral fees, or earn commissions from any product
          we analyze. Our goal is transparency — so you can make confident
          decisions with your money.
        </p>
      </section>

      {/* Questions CTA */}
      <div
        style={{
          padding: "1.5rem",
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "0.75rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Icon
          name="ask"
          size={24}
          style={{ color: "var(--accent)", flexShrink: 0 }}
        />
        <div>
          <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
            Questions or feedback?
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: 0 }}>
            Email us at{" "}
            <a
              href="mailto:hello@beforeyousign.sg"
              style={{ color: "var(--accent)" }}
            >
              hello@beforeyousign.sg
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
