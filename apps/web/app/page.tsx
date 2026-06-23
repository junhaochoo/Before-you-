import Link from "next/link";
import { STANDARD_DISCLAIMER, NO_CONFLICT_BADGE, FREE_LOOK_COPY } from "@/lib/copy";

/**
 * Entry screen — three modes (13-product-design-ux.md Screen 1). For the MVP, all
 * three lead to the manual-entry analyzer; document upload (mode 1) is wired in
 * Wave 3. The free-look copy carries the market-value-adjustment qualifier
 * (red-team H1) — it never says "walk away free".
 */
export default function Home() {
  return (
    <main>
      <h1>Before You Sign</h1>
      <p className="lede">Understand the real cost and consequence before you commit.</p>
      <p>
        <span className="badge">✓ {NO_CONFLICT_BADGE}</span>
      </p>

      <div className="modes">
        <Link href="/analyze" className="mode">
          <span className="mode-icon">📄</span>
          <span className="mode-title">Upload my Product Summary / Benefit Illustration</span>
          <span className="mode-sub">We read the fees and structure for you. (Upload arrives in the next build; for now, enter details.)</span>
        </Link>
        <Link href="/analyze" className="mode">
          <span className="mode-icon">💬</span>
          <span className="mode-title">I only have what the agent told me</span>
          <span className="mode-sub">Enter the details yourself — zero upload needed.</span>
        </Link>
        <Link href="/analyze" className="mode">
          <span className="mode-icon">⏳</span>
          <span className="mode-title">I've signed — check before free-look ends</span>
          <span className="mode-sub">{FREE_LOOK_COPY}</span>
        </Link>
      </div>

      <p className="muted">We don't sell anything. We don't tell you what to buy.</p>
      <p className="disclaimer">⚠ {STANDARD_DISCLAIMER}</p>
    </main>
  );
}
