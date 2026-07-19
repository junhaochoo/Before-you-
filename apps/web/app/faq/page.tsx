import Link from "next/link";
import { Icon } from "../components/icons";

export const metadata = {
  title: "FAQ — Before You Sign",
  description:
    "Common questions about Before You Sign — how it works, privacy, pricing, and more.",
};

const faqs = [
  {
    q: "What documents can I upload?",
    a: "You can upload any insurance or investment product document — benefit illustrations, fund factsheets, product summaries, or policy documents. We accept PDFs or you can paste the text directly.",
  },
  {
    q: "Is my document stored?",
    a: "No. Your document is processed and immediately discarded. We never store uploads. Personal information (name, NRIC, policy number) is stripped server-side before anything is read.",
  },
  {
    q: "What does Before You Sign actually tell me?",
    a: "We decode fees, coverage, exclusions, and terms into plain English. We show you realistic return projections and compare against industry benchmarks. We don't give advice — we give facts.",
  },
  {
    q: "Is this financial advice?",
    a: "No. Before You Sign provides factual information and education only. We don't tell you what to buy or sell. All decisions are yours.",
  },
  {
    q: "How much does it cost?",
    a: "Your first report is free. After that, we offer affordable monthly and annual plans. No credit card required to start.",
  },
  {
    q: "Is my data protected under PDPA?",
    a: "Yes. We're compliant with Singapore's Personal Data Protection Act (PDPA). We don't sell or share your data. Documents are processed securely and never stored after your report is generated.",
  },
  {
    q: "Who runs Before You Sign?",
    a: "We're an independent Singapore-based project with no affiliation to any insurance company or financial institution. Our goal is to make financial literacy more accessible.",
  },
  {
    q: "Can I use this on my phone?",
    a: "Yes. Before You Sign works on mobile and desktop browsers. No app download needed.",
  },
];

export default function FaqPage() {
  return (
    <main>
      <Link href="/" className="back">
        <Icon name="arrow-left" size={15} /> Back
      </Link>

      <h1 style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>FAQ</h1>
      <p
        style={{
          color: "var(--muted)",
          marginTop: 0,
          marginBottom: "2.5rem",
          maxWidth: "50ch",
        }}
      >
        Answers to the most common questions about Before You Sign.
      </p>

      <div className="faq-list">
        {faqs.map((faq, i) => (
          <div key={i} className="faq-item">
            <h3>{faq.q}</h3>
            <p>{faq.a}</p>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "var(--accent-soft)",
          border: "1px solid rgba(212, 106, 26, 0.15)",
          borderRadius: "var(--r-xl)",
          padding: "2rem",
          textAlign: "center",
          marginTop: "3rem",
        }}
      >
        <p
          style={{
            margin: "0 0 1rem",
            fontSize: "1rem",
            color: "var(--ink-2)",
          }}
        >
          Still have questions?
        </p>
        <a href="mailto:hello@beforeyousign.sg" className="btn">
          Contact us
        </a>
      </div>
    </main>
  );
}
