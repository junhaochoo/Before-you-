import Link from "next/link";
import Image from "next/image";
import { Icon } from "./components/icons";
import { StartIntake } from "./components/StartIntake";
import { PrivacyConsent } from "./components/PrivacyConsent";

const steps = [
  {
    num: "1",
    title: "Upload your document",
    desc: "Drop a PDF, paste text, or enter fund details. Takes under a minute.",
    icon: "upload",
  },
  {
    num: "2",
    title: "We analyze the fees and terms",
    desc: "We decode the fine print and calculate the real cost over time.",
    icon: "search",
  },
  {
    num: "3",
    title: "You see what it really costs",
    desc: "Get a plain-English report showing total cost, risks, and what questions to ask.",
    icon: "check",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
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

      {/* Trust badges */}
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

      {/* How it works */}
      <section className="how-it-works">
        <h2>How it works</h2>
        <div className="steps">
          {steps.map((step) => (
            <div key={step.num} className="step">
              <div className="step-num">{step.num}</div>
              <div className="step-body">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upload form */}
      <section className="start">
        <p className="start-label">Get started</p>
        <StartIntake />
      </section>

      <PrivacyConsent />
    </main>
  );
}
