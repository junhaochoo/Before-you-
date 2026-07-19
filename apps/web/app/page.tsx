import Link from "next/link";
import Image from "next/image";
import { Icon } from "./components/icons";
import { StartIntake } from "./components/StartIntake";
import { PrivacyConsent } from "./components/PrivacyConsent";

const painPoints = [
  "Salespeople earn commissions — your interests come second",
  "Policy documents are deliberately hard to compare",
  "The real cost hides in the fine print",
  "You feel pressured to sign before you understand",
];

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

      <section className="trust-badges">
        <span className="trust-badge">
          <Icon name="check" size={16} />
          We earn nothing from your decision
        </span>
        <span className="trust-badge">
          <Icon name="file" size={16} />
          First report free
        </span>
      </section>

      <section className="pain-points">
        <h2>Sound familiar?</h2>
        <ul>
          {painPoints.map((point) => (
            <li key={point}>
              <Icon name="alert" size={16} />
              {point}
            </li>
          ))}
        </ul>
      </section>

      <section className="how-it-works">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <div className="step-body">
              <h3>Upload your document</h3>
              <p>Drop a PDF or paste text. Takes under a minute.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <div className="step-body">
              <h3>We analyze the fees and terms</h3>
              <p>
                We decode the fine print and calculate the real cost over time.
              </p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <div className="step-body">
              <h3>You see what it really costs</h3>
              <p>
                Get a plain-English report with total cost, risks, and questions
                to ask.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="start">
        <p className="start-label">Get started</p>
        <StartIntake />
      </section>

      <PrivacyConsent />
    </main>
  );
}
