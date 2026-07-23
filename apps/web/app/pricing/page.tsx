import Link from "next/link";
import { Icon } from "../components/icons";

export const metadata = {
  title: "Pricing — Before You Sign",
};

const tiers = [
  {
    name: "For Everyone",
    price: "Free",
    period: "",
    description: "For anyone who wants to understand what they're signing.",
    features: [
      "Unlimited document analyses",
      "Side-by-side fund comparisons",
      "Personalized question checklists",
      "Plain-English breakdowns",
      "PDF report generation",
      "Share & export reports",
    ],
    cta: "Get started free",
    href: "/login?mode=signup",
    highlight: false,
  },
  {
    name: "For Financial Advisors",
    price: "$49",
    period: "/month",
    description:
      "For advisors who want to serve clients with clarity and confidence.",
    features: [
      "Everything in Free",
      "Client management",
      "Branded reports",
      "Priority support",
    ],
    cta: "Get started",
    href: "/login?mode=signup",
    highlight: false,
  },
  {
    name: "For HR & Compliance",
    price: "$149",
    period: "/month",
    description:
      "For teams onboarding staff and managing employee financial benefits.",
    features: [
      "Everything in Financial Advisors",
      "Team management",
      "Compliance-ready reports",
      "Dedicated account manager",
      "Custom integrations",
    ],
    cta: "Get started",
    href: "/login?mode=signup",
    highlight: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description:
      "For organisations with custom security and integration needs.",
    features: [
      "Everything in HR & Compliance",
      "Custom integrations",
      "SLA & dedicated support",
      "On-premise available",
    ],
    cta: "Contact us",
    href: "mailto:hello@beforeyousign.sg",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <main
      style={{ maxWidth: "960px", margin: "0 auto", padding: "2.5rem 1.25rem" }}
    >
      <h1 style={{ marginBottom: "0.5rem" }}>Pricing</h1>
      <p
        style={{
          color: "var(--muted)",
          marginBottom: "2.5rem",
          fontSize: "1.05rem",
        }}
      ></p>

      {/* Tier cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "3rem",
        }}
      >
        {tiers.map((tier) => (
          <div
            key={tier.name}
            data-tier={tier.name === "For HR & Compliance" ? "hr" : undefined}
            style={{
              background: tier.highlight ? "var(--ink)" : "#fff",
              color: tier.highlight ? "#fff" : "var(--ink)",
              border: tier.highlight ? "none" : "1px solid var(--line)",
              borderRadius: "1rem",
              padding: "1.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "0",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            <p
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                margin: "0 0 0.5rem",
                opacity: tier.highlight ? 0.7 : 1,
              }}
            >
              {tier.name}
            </p>
            <div style={{ marginBottom: "0.5rem" }}>
              <span
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: tier.highlight ? "#fff" : "var(--ink)",
                }}
              >
                {tier.price}
              </span>
              {tier.period && (
                <span style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                  {tier.period}
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: "0.85rem",
                opacity: 0.7,
                margin: "0 0 1.25rem",
                lineHeight: 1.5,
              }}
            >
              {tier.description}
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 1.5rem",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {tier.features.map((f) => (
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
                      color: tier.highlight
                        ? "rgba(255,255,255,0.8)"
                        : "var(--accent)",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={tier.href}
              className="btn"
              style={{
                background: tier.highlight ? "var(--accent)" : "transparent",
                border: tier.highlight ? "none" : "1px solid var(--line)",
                color: tier.highlight ? "#fff" : "var(--ink)",
                textAlign: "center",
                justifyContent: "center",
                fontSize: "0.85rem",
              }}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Why free */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h3
          style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}
        >
          Why is the individual plan free?
        </h3>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          We are independently funded — by founders, friends, and family who
          believe in this mission. We don&apos;t sell data, serve ads, or earn
          referral fees from any financial product. Our goal is simple: help
          Singaporeans make smarter financial decisions with better information.
        </p>
      </section>

      {/* Secure & private */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h3
          style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}
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
