import { Icon } from "../components/icons";

export const metadata = {
  title: "Privacy & Trust — Before You Sign",
};

const principles = [
  {
    icon: "shield",
    title: "Your documents stay on your device",
    body: "We never upload, store, or access your files. Everything is processed locally in your browser.",
  },
  {
    icon: "file",
    title: "We don't sell your data. Period.",
    body: "No ads. No data brokerage. No affiliate links. Our revenue comes from subscriptions only.",
  },
  {
    icon: "check-circle",
    title: "No tracking or analytics",
    body: "We don't use tracking pixels, behavioural analytics, or any third-party monitoring tools.",
  },
  {
    icon: "shield",
    title: "Encrypted connections only",
    body: "All data in transit is protected with TLS encryption. Your documents are never sent to our servers.",
  },
];

const rights = [
  {
    label: "Right to deletion",
    desc: "Ask us to delete your account and data at any time.",
  },
  {
    label: "Right to portability",
    desc: "Export all your data in a machine-readable format.",
  },
  {
    label: "Right to access",
    desc: "Request a copy of everything we hold about you.",
  },
  {
    label: "Right to correction",
    desc: "Have inaccurate data corrected or removed.",
  },
];

export default function PrivacyPage() {
  return (
    <main
      style={{ maxWidth: "860px", margin: "0 auto", padding: "3rem 1.25rem" }}
    >
      <h1 style={{ marginBottom: "0.5rem" }}>Your privacy, protected.</h1>
      <p
        style={{
          color: "var(--muted)",
          fontSize: "1.05rem",
          marginBottom: "3rem",
          lineHeight: 1.6,
        }}
      >
        We believe understanding what you sign shouldn't come at the cost of
        your privacy. Here's exactly how we handle your data.
      </p>

      {/* Core principles infographic */}
      <section style={{ marginBottom: "3.5rem" }}>
        <h2
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            marginBottom: "1.5rem",
          }}
        >
          How we handle your data
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {principles.map((p) => (
            <div
              key={p.title}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: "1rem",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "var(--accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name={p.icon as any}
                  size={22}
                  style={{ color: "var(--accent)" }}
                />
              </div>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  margin: 0,
                  color: "var(--ink)",
                }}
              >
                {p.title}
              </p>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "var(--muted)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What we DON'T do — visual "stop" block */}
      <section style={{ marginBottom: "3.5rem" }}>
        <h2
          style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}
        >
          What we never do
        </h2>
        <div
          style={{
            background: "#fdf3ee",
            border: "1px solid #f0c8a8",
            borderRadius: "1rem",
            padding: "1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {[
            "Sell or share your personal data",
            "Show targeted advertisements",
            "Track your browsing behaviour",
            "Store your documents on our servers",
            "Share data with third parties",
            "Use analytics that identify you",
          ].map((item) => (
            <div
              key={item}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Icon
                name="alert"
                size={16}
                style={{ color: "#c0392b", flexShrink: 0 }}
              />
              <span style={{ fontSize: "0.88rem", color: "#7a3010" }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Your rights */}
      <section style={{ marginBottom: "3.5rem" }}>
        <h2
          style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}
        >
          Your rights under PDPA
        </h2>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "0.9rem",
            marginBottom: "1.25rem",
            lineHeight: 1.6,
          }}
        >
          As a Singapore-based service, we comply with the Personal Data
          Protection Act (PDPA). You have the right to:
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          {rights.map((r) => (
            <div
              key={r.label}
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
              }}
            >
              <Icon
                name="check-circle"
                size={16}
                style={{
                  color: "var(--good, #2e7d52)",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              />
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    margin: "0 0 0.2rem",
                  }}
                >
                  {r.label}
                </p>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "0.8rem",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {r.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* T&Cs summary */}
      <section style={{ marginBottom: "3rem" }}>
        <h2
          style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}
        >
          Terms of service at a glance
        </h2>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "1rem",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem",
          }}
        >
          {[
            {
              title: "Educational tool only",
              desc: "Before You Sign provides information, not financial advice. Always consult a licensed financial advisor for personalised guidance.",
            },
            {
              title: "Accuracy not guaranteed",
              desc: "While we strive for precision, always verify critical information independently before making financial decisions.",
            },
            {
              title: "Your content, your responsibility",
              desc: "You retain all rights to documents you upload. We never claim ownership over any uploaded content.",
            },
            {
              title: "Subscription terms",
              desc: "Paid plans are billed monthly or annually. Cancel anytime with no cancellation fees.",
            },
          ].map((t) => (
            <div
              key={t.title}
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  flexShrink: 0,
                  marginTop: "7px",
                }}
              />
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    margin: "0 0 0.2rem",
                  }}
                >
                  {t.title}
                </p>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "0.82rem",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {t.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section
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
            Questions about privacy?
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
      </section>
    </main>
  );
}
