import Link from "next/link";
import { Icon } from "../components/icons";

export const metadata = {
  title: "About — Before You Sign",
  description:
    "Before You Sign is an independent tool that helps you understand the real cost of financial products before you commit.",
};

export default function AboutPage() {
  return (
    <main>
      <Link href="/" className="back">
        <Icon name="arrow-left" size={15} /> Back
      </Link>

      <h1 style={{ marginTop: "0.5rem" }}>About Before You Sign</h1>

      <div className="about-body">
        <section className="lens">
          <h3>Why we built this</h3>
          <p className="headline">
            Financial products are complicated by design. The people selling
            them are paid to close deals — not to make sure you fully understand
            what you&apos;re signing. We built Before You Sign to give you the
            information you actually need, before you sign anything.
          </p>
        </section>

        <section className="lens">
          <h3>What we do</h3>
          <p className="headline">
            We decode the fine print in your insurance or investment document —
            flagging fees, showing realistic returns, and comparing your
            options. No sales pitch. No commission. Just the facts.
          </p>
        </section>

        <section className="lens">
          <h3>What we don&apos;t do</h3>
          <p className="headline">
            We don&apos;t sell financial products. We don&apos;t take
            commissions. We don&apos;t give personalised financial advice. We
            provide factual information so you can make your own decisions.
          </p>
        </section>

        <section className="lens">
          <h3>Your privacy</h3>
          <p className="headline">
            Your documents are processed and immediately discarded. We
            don&apos;t store them. We don&apos;t share them. PII is stripped
            server-side before anything is read. See our privacy approach below
            every report.
          </p>
        </section>

        <section className="lens">
          <h3>Who runs this</h3>
          <p className="headline">
            Before You Sign is an independent Singapore-based project. We have
            no affiliation with any insurance company or financial institution.
            Our goal is to make financial literacy more accessible.
          </p>
        </section>
      </div>

      <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
        <Link href="/login" className="btn">
          Get started — it&apos;s free
        </Link>
      </div>
    </main>
  );
}
