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
        Free for everyone. Unlimited. No catches.
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
          Free. For everyone. Unlimited.
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
            "Unlimited document analyses",
            "Side-by-side fund comparisons",
            "Personalized question checklists",
            "Plain-English breakdowns",
            "PDF report generation",
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
          We are independently funded — by founders, friends, and family who
          believe in this mission. We don&apos;t sell data, serve ads, or earn
          referral fees from any financial product. Our goal is simple: help
          Singaporeans make smarter financial decisions with better information.
        </p>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          3 in 4 Singaporeans can&apos;t read insurance terms. We want to change
          that.
        </p>
      </section>

      {/* Secure & private */}
      <section style={{ marginBottom: "3rem" }}>
        <h3
          style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}
        >
          Secure and private
        </h3>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          Your documents are stored only on your device. We never access, share,
          or monetise your personal data. Before You Sign is built for your
          privacy — because what you analyse is nobody else&apos;s business.
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
