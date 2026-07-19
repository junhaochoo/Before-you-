import Link from "next/link";
import Image from "next/image";
import { Icon } from "./components/icons";
import { PrivacyConsent } from "./components/PrivacyConsent";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="hero-pain">
            Signed something you don&apos;t fully understand?
          </p>
          <h1>Don&apos;t sign until you know.</h1>
          <p className="lede">Upload your document. Get the facts.</p>
        </div>
        <div className="hero-image">
          <Image
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80"
            alt="Person signing document"
            width={600}
            height={400}
            style={{ objectFit: "cover", borderRadius: "12px" }}
          />
        </div>
      </section>

      {/* Impact stats — shown after the introduction */}
      <section className="big-stats">
        <div className="big-stat">
          <span className="big-stat-num">76%</span>
          <span className="big-stat-label">
            of Singaporeans lack confidence about financial products
          </span>
        </div>
        <div className="big-stat-divider" />
        <div className="big-stat">
          <span className="big-stat-num">S$115k</span>
          <span className="big-stat-label">
            in fees eats ~36% of a S$100k ILP over 20 years
          </span>
          <a
            href="https://www.lia.org.sg"
            target="_blank"
            rel="noopener"
            className="big-stat-source"
          >
            LIA / industry data →
          </a>
        </div>
        <div className="big-stat-divider" />
        <div className="big-stat">
          <span className="big-stat-num">+41%</span>
          <span className="big-stat-label">
            ILP sales surged in 2024 — fastest-growing segment
          </span>
          <a
            href="https://www.lia.org.sg"
            target="_blank"
            rel="noopener"
            className="big-stat-source"
          >
            LIA data →
          </a>
        </div>
      </section>

      <section className="pain-points">
        <h2>Sound familiar?</h2>
        <div className="pain-point-cards">
          <div className="pain-card">
            <Image
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&q=80"
              alt="Stressed about financial products"
              width={400}
              height={500}
              style={{ objectFit: "cover" }}
            />
            <p>
              Agents earn commissions on every sale — what you don&apos;t know
              affects their payout
            </p>
          </div>
          <div className="pain-card">
            <Image
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&q=80"
              alt="Overwhelmed by fine print"
              width={400}
              height={500}
              style={{ objectFit: "cover" }}
            />
            <p>Key fees are buried in the fine print</p>
          </div>
          <div className="pain-card">
            <Image
              src="https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=500&q=80"
              alt="Stressed about signing"
              width={400}
              height={500}
              style={{ objectFit: "cover" }}
            />
            <p>You&apos;re asked to sign before you fully understand</p>
          </div>
          <div className="pain-card">
            <Image
              src="https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=500&q=80"
              alt="Worried about financial decisions"
              width={400}
              height={500}
              style={{ objectFit: "cover" }}
            />
            <p>Policies are complex and nearly impossible to compare</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <div className="step-body">
              <h3>Upload</h3>
              <p>Drop a PDF or paste text</p>
            </div>
          </div>
          <span className="step-arrow">→</span>
          <div className="step">
            <div className="step-num">2</div>
            <div className="step-body">
              <h3>We analyze</h3>
              <p>Decode fees and terms</p>
            </div>
          </div>
          <span className="step-arrow">→</span>
          <div className="step">
            <div className="step-num">3</div>
            <div className="step-body">
              <h3>You see costs</h3>
              <p>Plain-English report</p>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-badges">
        <span className="trust-badge">
          <Icon name="check" size={16} />
          No financial interest
        </span>
        <span className="trust-badge">
          <Icon name="file" size={16} />
          First report free
        </span>
        <span className="trust-badge">
          <Icon name="shield" size={16} />
          Privacy protected
        </span>
      </section>

      <section className="start">
        <p className="start-label">Get started</p>
        <div
          className="form-card start-card"
          style={{ textAlign: "center", padding: "2rem" }}
        >
          <p
            style={{
              margin: "0 0 1.25rem",
              fontSize: "1.05rem",
              color: "var(--ink-2)",
            }}
          >
            Create your free account to get started.
            <br />
            Your first report is on us.
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/login" className="btn">
              Sign up free
            </Link>
            <Link href="/login" className="btn ghost">
              Log in
            </Link>
          </div>
        </div>
      </section>

      <PrivacyConsent />
    </main>
  );
}
