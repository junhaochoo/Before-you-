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
        <Link href="/compare" className="mode">
          <span className="mode-icon">
            <Icon name="mirror" size={22} />
          </span>
          <span className="mode-title">Compare several funds</span>
          <span className="mode-sub">
            Put funds side by side on cost and risk.
          </span>
        </Link>
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

      <p className="disclaimer">
        <Icon name="alert" size={18} />
        <span>{STANDARD_DISCLAIMER}</span>
      </p>
    </main>
  );
}
