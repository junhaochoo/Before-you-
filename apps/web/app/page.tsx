import Link from "next/link";
import { Icon } from "./components/icons";
import { StartIntake } from "./components/StartIntake";

/**
 * Entry screen — upload-first. Clean and minimal.
 */
export default function Home() {
  return (
    <main>
      <section className="hero">
        <h1>Know what you&apos;re signing.</h1>
        <p className="lede">
          Upload any financial document. We&apos;ll tell you what it really
          costs.
        </p>
      </section>

      <section className="start">
        <StartIntake />
      </section>

      <section className="manual">
        <div className="manual-options">
          <Link href="/analyze" className="manual-option">
            <span className="manual-option-icon">
              <Icon name="file" size={20} />
            </span>
            <span className="manual-option-title">Check a policy</span>
            <span className="manual-option-sub">
              See the real cost of a policy.
            </span>
          </Link>
          <Link href="/compare" className="manual-option">
            <span className="manual-option-icon">
              <Icon name="mirror" size={20} />
            </span>
            <span className="manual-option-title">Compare funds</span>
            <span className="manual-option-sub">
              Compare charges side by side.
            </span>
          </Link>
          <Link href="/needs" className="manual-option">
            <span className="manual-option-icon">
              <Icon name="fit" size={20} />
            </span>
            <span className="manual-option-title">Figure out your needs</span>
            <span className="manual-option-sub">
              No product yet — start here.
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
