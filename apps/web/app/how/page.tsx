import Link from "next/link";
import Image from "next/image";
import { Icon } from "../components/icons";

export const metadata = {
  title: "How it works — Before You Sign",
  description:
    "See how Before You Sign decodes your financial product documents, protects your privacy, and helps you understand what you're really signing.",
};

export default function HowPage() {
  return (
    <main>
      <Link href="/" className="back">
        <Icon name="arrow-left" size={15} /> Back
      </Link>

      <h1 style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
        How it works
      </h1>
      <p
        style={{
          color: "var(--muted)",
          marginTop: 0,
          marginBottom: "3rem",
          maxWidth: "50ch",
          fontSize: "1.05rem",
        }}
      >
        Three steps to understand what you&apos;re really signing.
      </p>

      {/* Step 1 */}
      <div className="how-step">
        <div className="how-step-visual">
          <Image
            src="https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?w=700&q=80"
            alt="Uploading a document"
            width={700}
            height={460}
            style={{ objectFit: "cover", borderRadius: "12px" }}
          />
        </div>
        <div className="how-step-content">
          <div className="how-step-num">1</div>
          <h2>Upload or paste your document</h2>
          <p>
            Drop your insurance benefit illustration, fund factsheet, or any
            financial product document. We accept PDFs or you can paste the text
            directly. It takes under a minute.
          </p>
          <ul>
            <li>Accepts PDFs and plain text</li>
            <li>Works on mobile and desktop</li>
            <li>No account needed to start</li>
          </ul>
        </div>
      </div>

      {/* Step 2 */}
      <div className="how-step how-step-reverse">
        <div className="how-step-visual">
          <Image
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80"
            alt="Analysis in progress"
            width={700}
            height={460}
            style={{ objectFit: "cover", borderRadius: "12px" }}
          />
        </div>
        <div className="how-step-content">
          <div className="how-step-num">2</div>
          <h2>We decode it for you</h2>
          <p>
            Our system reads your document and extracts the key details — fees,
            coverage, returns, and terms. We strip out the jargon and surface
            what actually matters.
          </p>
          <ul>
            <li>Identifies hidden fees and charges</li>
            <li>Highlights exclusions and limitations</li>
            <li>Compares against industry benchmarks</li>
          </ul>
        </div>
      </div>

      {/* Step 3 */}
      <div className="how-step">
        <div className="how-step-visual">
          <Image
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80"
            alt="Plain English report"
            width={700}
            height={460}
            style={{ objectFit: "cover", borderRadius: "12px" }}
          />
        </div>
        <div className="how-step-content">
          <div className="how-step-num">3</div>
          <h2>Get your plain-English report</h2>
          <p>
            Receive a clear, unbiased report breaking down your product in
            simple terms. No sales pitch. No recommendations. Just the facts so
            you can decide with confidence.
          </p>
          <ul>
            <li>Plain-English explanations</li>
            <li>Realistic return projections</li>
            <li>First report free</li>
          </ul>
        </div>
      </div>

      {/* PDPA section */}
      <div className="how-pdpa">
        <div className="how-pdpa-icon">
          <Icon name="shield" size={32} />
        </div>
        <div className="how-pdpa-content">
          <h3>Your privacy is protected under PDPA</h3>
          <p>
            We take data protection seriously. Your documents are processed
            securely and never stored after your report is generated. Personal
            information is removed before anything is read.
          </p>
          <ul>
            <li>Documents are processed and immediately discarded</li>
            <li>PII (name, NRIC, policy number) is stripped server-side</li>
            <li>We never sell or share your data</li>
            <li>
              Compliant with Singapore&apos;s Personal Data Protection Act
              (PDPA)
            </li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div
        style={{ textAlign: "center", marginTop: "3rem", marginBottom: "2rem" }}
      >
        <p
          style={{
            fontSize: "1.05rem",
            color: "var(--ink-2)",
            marginBottom: "1.25rem",
          }}
        >
          Ready to understand what you&apos;re signing?
        </p>
        <Link href="/login" className="btn">
          Get started — it&apos;s free
        </Link>
      </div>
    </main>
  );
}
