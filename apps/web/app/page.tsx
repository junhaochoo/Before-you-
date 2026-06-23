import Link from "next/link";
import {
  STANDARD_DISCLAIMER,
  NO_CONFLICT_BADGE,
  FREE_LOOK_COPY,
} from "@/lib/copy";
import { Icon } from "./components/icons";

/**
 * Entry screen — three modes (13-product-design-ux.md Screen 1). For the MVP, all
 * three lead to the manual-entry analyzer; document upload (mode 1) is wired in
 * Wave 3. The free-look copy carries the market-value-adjustment qualifier
 * (red-team H1) — it never says "walk away free".
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

      {/* Group 1 — insurance / investment-linked products (ILPs) */}
      <section className="mode-group">
        <div className="mode-group-head">
          <h2>Insurance or investment-linked product?</h2>
          <p className="muted">
            Policies and ILPs with fees, a surrender or lock-in period, a
            capital guarantee, or a free-look window. We read the benefit
            illustration.
          </p>
        </div>
        <div className="modes">
          <Link href="/analyze" className="mode">
            <span className="mode-icon">
              <Icon name="file" size={22} />
            </span>
            <span className="mode-title">Upload my document</span>
            <span className="mode-sub">We read the fees for you.</span>
          </Link>
          <Link href="/analyze" className="mode">
            <span className="mode-icon">
              <Icon name="chat" size={22} />
            </span>
            <span className="mode-title">Enter details myself</span>
            <span className="mode-sub">No upload needed.</span>
          </Link>
          <Link href="/analyze" className="mode">
            <span className="mode-icon">
              <Icon name="clock" size={22} />
            </span>
            <span className="mode-title">I&apos;ve already signed</span>
            <span className="mode-sub">{FREE_LOOK_COPY}</span>
          </Link>
        </div>
      </section>

      {/* Group 2 — plain investment funds / unit trusts */}
      <section className="mode-group">
        <div className="mode-group-head">
          <h2>Comparing investment funds or unit trusts?</h2>
          <p className="muted">
            Plain funds with a sales charge, an ongoing charge (TER) and maybe a
            platform fee — no insurance, no surrender period.
          </p>
        </div>
        <div className="modes">
          <Link href="/compare" className="mode">
            <span className="mode-icon">
              <Icon name="mirror" size={22} />
            </span>
            <span className="mode-title">Compare several funds</span>
            <span className="mode-sub">
              Put funds side by side on cost and risk. Upload a factsheet or
              enter the charges.
            </span>
          </Link>
        </div>
      </section>

      {/* Group 3 — product-agnostic goals tool */}
      <section className="mode-group">
        <div className="mode-group-head">
          <h2>Not sure, or starting from your goals?</h2>
          <p className="muted">
            Works for any product — turn what you want this money to do into a
            checklist of what to look for and what to ask.
          </p>
        </div>
        <div className="modes">
          <Link href="/needs" className="mode">
            <span className="mode-icon">
              <Icon name="fit" size={22} />
            </span>
            <span className="mode-title">Match my goals</span>
            <span className="mode-sub">
              Turn your goals into what to check and ask.
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
