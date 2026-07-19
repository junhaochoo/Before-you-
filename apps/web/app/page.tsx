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

      <PrivacyConsent />

      <section className="start">
        <StartIntake />
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

      <section className="paths">
        <h2>Or pick a path</h2>
        <div className="path-cards">
          <Link href="/analyze" className="path-card">
            <Image
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80"
              alt="Policy document"
              width={400}
              height={200}
              style={{ objectFit: "cover", borderRadius: "8px" }}
            />
            <div className="path-card-content">
              <Icon name="file" size={24} />
              <h3>Check a policy</h3>
              <p>See what it costs</p>
            </div>
          </Link>
          <Link href="/compare" className="path-card">
            <Image
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80"
              alt="Charts and graphs"
              width={400}
              height={200}
              style={{ objectFit: "cover", borderRadius: "8px" }}
            />
            <div className="path-card-content">
              <Icon name="mirror" size={24} />
              <h3>Compare funds</h3>
              <p>Side by side</p>
            </div>
          </Link>
          <Link href="/needs" className="path-card">
            <Image
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80"
              alt="Person thinking"
              width={400}
              height={200}
              style={{ objectFit: "cover", borderRadius: "8px" }}
            />
            <div className="path-card-content">
              <Icon name="fit" size={24} />
              <h3>Know your needs</h3>
              <p>Figure it out</p>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
