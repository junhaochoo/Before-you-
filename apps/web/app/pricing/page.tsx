import Link from "next/link";
import { Icon } from "../components/icons";

export const metadata = {
  title: "Pricing — Before You Sign",
};

const tiers = [
  {
    name: "Free",
    price: "Free",
    period: "",
    description: "Free scan and your first full report.",
    included: ["Free document scan", "First full report free", "Basic Q&A"],
    excluded: [
      "Subsequent full reports (S$9 each)",
      "Premium subscription",
      "Family access",
    ],
    cta: "Get started free",
    href: "/login?mode=signup",
  },
  {
    name: "Paid Report",
    price: "S$9",
    period: "per report",
    description: "One-off full report whenever you need it.",
    included: [
      "Full document analysis",
      "Dollar downside scenarios",
      "Concentration & buffer insights",
      "Gross-vs-net chart",
      "AI adviser questions",
      "PDF report",
    ],
    excluded: ["Subscription savings", "Family access"],
    cta: "Get a report",
    href: "/login?mode=signup",
  },
  {
    name: "Premium",
    popular: true,
    price: "S$7",
    period: "/month",
    description: "For when you need repeated analyses and saved data.",
    included: [
      "Everything in Paid Report",
      "Unlimited document analyses",
      "Save & revisit your reports",
      "Priority support",
    ],
    excluded: ["Family access"],
    cta: "Subscribe",
    href: "/login?mode=signup",
  },
  {
    name: "Family Access",
    price: "S$108",
    period: "/year",
    description: "Share the protection with your whole household.",
    included: [
      "Everything in Premium",
      "Up to 5 family members",
      "Shared report history",
      "Annual savings vs monthly",
    ],
    excluded: [],
    cta: "Get family access",
    href: "/login?mode=signup",
  },
];

export default function PricingPage() {
  return (
    <main
      style={{ maxWidth: "960px", margin: "0 auto", padding: "3rem 1.25rem" }}
    >
      <h1 style={{ marginBottom: "0.5rem" }}>Pricing</h1>
      <p
        style={{
          color: "var(--muted)",
          fontSize: "1.05rem",
          marginBottom: "3rem",
          lineHeight: 1.6,
        }}
      >
        No hidden fees. No surprises. Cancel anytime.
      </p>

      {/* Tier cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "3.5rem",
          alignItems: "start",
        }}
      >
        {tiers.map((tier) => (
          <div
            key={tier.name}
            style={{
              background: tier.popular ? "var(--ink)" : "#fff",
              color: tier.popular ? "#fff" : "var(--ink)",
              border: tier.popular ? "none" : "1px solid var(--line)",
              borderRadius: "1.25rem",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "0",
              position: "relative",
              boxShadow: tier.popular ? "var(--sh-lg)" : "none",
            }}
          >
            {tier.popular && (
              <div
                style={{
                  position: "absolute",
                  top: "-14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--accent)",
                  color: "#fff",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  padding: "0.3rem 0.9rem",
                  borderRadius: "999px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Most popular
              </div>
            )}

            <p
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 0.75rem",
                opacity: tier.popular ? 0.7 : 1,
              }}
            >
              {tier.name}
            </p>

            <div
              style={{
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "baseline",
                gap: "0.25rem",
              }}
            >
              <span
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: tier.popular ? "#fff" : "var(--ink)",
                  lineHeight: 1,
                }}
              >
                {tier.price}
              </span>
              {tier.period && (
                <span style={{ fontSize: "0.85rem", opacity: 0.6 }}>
                  {tier.period}
                </span>
              )}
            </div>

            <p
              style={{
                fontSize: "0.82rem",
                opacity: 0.7,
                margin: "0 0 1.5rem",
                lineHeight: 1.5,
              }}
            >
              {tier.description}
            </p>

            <div
              style={{
                height: "1px",
                background: tier.popular
                  ? "rgba(255,255,255,0.15)"
                  : "var(--line)",
                marginBottom: "1.25rem",
              }}
            />

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 1.75rem",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              {tier.included.map((f) => (
                <li
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                    fontSize: "0.85rem",
                  }}
                >
                  <Icon
                    name="check-circle"
                    size={14}
                    style={{
                      color: tier.popular
                        ? "rgba(255,255,255,0.9)"
                        : "var(--accent)",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  />
                  <span>{f}</span>
                </li>
              ))}
              {tier.excluded.map((f) => (
                <li
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                    fontSize: "0.82rem",
                    opacity: 0.45,
                  }}
                >
                  <Icon
                    name="alert"
                    size={14}
                    style={{
                      color: tier.popular ? "rgba(255,255,255,0.6)" : "#8a96a8",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  />
                  <span style={{ textDecoration: "line-through" }}>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href={tier.href}
              style={{
                display: "block",
                background: tier.popular ? "var(--accent)" : "transparent",
                border: tier.popular ? "none" : "1px solid var(--line)",
                color: tier.popular ? "#fff" : "var(--ink)",
                textAlign: "center",
                justifyContent: "center",
                padding: "0.7rem 1rem",
                borderRadius: "0.75rem",
                fontWeight: 600,
                fontSize: "0.88rem",
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Secure & private */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2
          style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}
        >
          Secure and private
        </h2>
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
          <p style={{ fontWeight: 600, margin: "0 0 0.25rem" }}>
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
