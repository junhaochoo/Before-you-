import Link from "next/link";
import Image from "next/image";
import { Icon } from "./components/icons";
import { StartIntake } from "./components/StartIntake";
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

      <section className="stats">
        <div className="stat">
          <Icon name="users" size={28} className="stat-icon" />
          <span className="stat-num">76%</span>
          <span className="stat-label">
            of Singaporeans don&apos;t understand financial docs
          </span>
          <a
            href="https://www.moneysense.gov.sg/articles/2023/10/are-singaporeans-confident-about-their-finances"
            target="_blank"
            rel="noopener"
            className="stat-source"
          >
            MAS MoneySense survey →
          </a>
        </div>
        <div className="stat">
          <Icon name="dollar-sign" size={28} className="stat-icon" />
          <span className="stat-num">$1.2B</span>
          <span className="stat-label">
            insurance commissions paid yearly in SG
          </span>
          <a
            href="https://www.moneysense.gov.sg"
            target="_blank"
            rel="noopener"
            className="stat-source"
          >
            MAS MoneySense →
          </a>
        </div>
      </section>

      <section className="pain-points">
        <h2>Sound familiar?</h2>
        <ul>
          <li>
            <Icon name="alert" size={16} />
            Salespeople earn commissions
          </li>
          <li>
            <Icon name="alert" size={16} />
            Policies are hard to compare
          </li>
          <li>
            <Icon name="alert" size={16} />
            Real cost hides in fine print
          </li>
          <li>
            <Icon name="alert" size={16} />
            Pressure to sign fast
          </li>
        </ul>
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
          <div className="step">
            <div className="step-num">2</div>
            <div className="step-body">
              <h3>We analyze</h3>
              <p>Decode fees and terms</p>
            </div>
          </div>
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
        <StartIntake />
      </section>

      <PrivacyConsent />
    </main>
  );
}
