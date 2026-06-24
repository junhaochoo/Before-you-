import Link from "next/link";
import { STANDARD_DISCLAIMER, NO_CONFLICT_BADGE } from "@/lib/copy";
import { Icon } from "./components/icons";
import { StartIntake } from "./components/StartIntake";

/**
 * Entry screen — upload-first. The user never has to know whether they hold an
 * insurance/ILP or an investment fund: they upload (or paste) the document and we
 * work out what it is, explain it in plain English, and take them to the matching
 * tool. The two product paths (/analyze, /compare) and the goals tool (/needs)
 * stay reachable as quiet fallbacks for people who already know what they have or
 * don't have a document yet.
 */
export default function Home() {
  return (
    <main>
      <section className="hero">
        <h1>Know the real cost.</h1>
        <p className="lede">
          See what a product truly costs you — before you sign.
        </p>
        <p>
          <span className="badge">
            <Icon name="check" size={15} />
            {NO_CONFLICT_BADGE}
          </span>
        </p>
      </section>

      <section className="start">
        <div className="start-head">
          <h2>Not sure what you&apos;re being sold?</h2>
          <p className="muted">
            Upload the document or paste the text — we&apos;ll tell you what it
            is and what it means for you. No jargon, and no need to know the
            product type first.
          </p>
        </div>
        <StartIntake />
      </section>

      {/* Manual entry — a first-class path, never gated behind an upload. An
          informed user can go straight to a tool and key in the details. */}
      <section className="manual">
        <p className="manual-lead">
          <strong>No document, or prefer to type it in?</strong> You don&apos;t
          need to upload anything — go straight to a tool and enter the details
          yourself.
        </p>
        <div className="manual-options">
          <Link href="/analyze" className="manual-option">
            <span className="manual-option-icon">
              <Icon name="file" size={20} />
            </span>
            <span className="manual-option-title">Check a policy or ILP</span>
            <span className="manual-option-sub">
              Enter the fees, surrender period and any guarantee by hand.
            </span>
          </Link>
          <Link href="/compare" className="manual-option">
            <span className="manual-option-icon">
              <Icon name="mirror" size={20} />
            </span>
            <span className="manual-option-title">Compare funds</span>
            <span className="manual-option-sub">
              Type each fund&apos;s charges and put them side by side.
            </span>
          </Link>
          <Link href="/needs" className="manual-option">
            <span className="manual-option-icon">
              <Icon name="fit" size={20} />
            </span>
            <span className="manual-option-title">Start from your goals</span>
            <span className="manual-option-sub">
              No product yet — turn what you want into what to check and ask.
            </span>
          </Link>
        </div>
      </section>

      <p className="disclaimer">
        <Icon name="alert" size={18} />
        <span>{STANDARD_DISCLAIMER}</span>
      </p>
    </main>
  );
}
