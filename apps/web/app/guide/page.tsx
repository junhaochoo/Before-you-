import Link from "next/link";
import { Icon } from "../components/icons";

export const metadata = {
  title: "User Guide — Before You Sign",
};

export default function GuidePage() {
  return (
    <main
      style={{ maxWidth: "720px", margin: "0 auto", padding: "2.5rem 1.25rem" }}
    >
      <Link
        href="/dashboard"
        className="back"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          marginBottom: "2rem",
        }}
      >
        <Icon name="arrow-left" size={15} /> Back to dashboard
      </Link>

      <h1 style={{ marginBottom: "0.5rem" }}>User Guide</h1>
      <p style={{ color: "var(--muted)", marginBottom: "2.5rem" }}>
        Everything you need to know to get the most from Before You Sign.
      </p>

      {/* Quick navigation */}
      <nav
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "3rem",
          padding: "1rem",
          background: "var(--surface)",
          borderRadius: "0.75rem",
          border: "1px solid var(--line)",
        }}
      >
        {[
          { href: "#analyze", label: "Analyze a product" },
          { href: "#compare", label: "Compare funds" },
          { href: "#goals", label: "Match my goals" },
          { href: "#reports", label: "Saved reports" },
          { href: "#account", label: "Account settings" },
        ].map(({ href, label }) => (
          <a
            key={href}
            href={href}
            style={{
              padding: "0.35rem 0.75rem",
              background: "#fff",
              border: "1px solid var(--line)",
              borderRadius: "2rem",
              fontSize: "0.85rem",
              color: "var(--ink)",
              textDecoration: "none",
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Section 1 */}
      <section id="analyze" style={{ marginBottom: "3rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="file" size={20} style={{ color: "#fff" }} />
          </div>
          <h2 style={{ fontSize: "1.25rem", margin: 0 }}>
            Analyze a financial product
          </h2>
        </div>
        <p
          style={{
            color: "var(--muted)",
            marginBottom: "1rem",
            lineHeight: 1.7,
          }}
        >
          Upload or paste a product document — insurance policies,
          investment-linked fund fact sheets, or savings plans — and get a
          plain-language breakdown of what you're actually signing.
        </p>
        <ol
          style={{
            paddingLeft: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            lineHeight: 1.7,
            color: "var(--ink)",
          }}
        >
          <li>
            Go to{" "}
            <Link
              href="/analyze"
              style={{ color: "var(--accent)", fontWeight: 600 }}
            >
              Analyze
            </Link>{" "}
            from the dashboard or nav.
          </li>
          <li>
            Choose a document type: <strong>Insurance</strong>,{" "}
            <strong>Fund Factsheet</strong>, or <strong>Savings Plan</strong>.
          </li>
          <li>
            Paste the product name and upload the document (photo or PDF).
          </li>
          <li>
            Answer a few short questions about your situation — age, investment
            horizon, risk tolerance.
          </li>
          <li>
            Receive a report with: total estimated fees, risk flags, surrender
            value projections, and a plain-English summary.
          </li>
        </ol>
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          <strong>Note:</strong> This tool gives you factual information to ask
          better questions. It is not financial advice. Always consult a
          licensed financial advisor for personalized recommendations.
        </div>
      </section>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--line)",
          margin: "0 0 3rem",
        }}
      />

      {/* Section 2 */}
      <section id="compare" style={{ marginBottom: "3rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="mirror" size={20} style={{ color: "#fff" }} />
          </div>
          <h2 style={{ fontSize: "1.25rem", margin: 0 }}>
            Compare funds side by side
          </h2>
        </div>
        <p
          style={{
            color: "var(--muted)",
            marginBottom: "1rem",
            lineHeight: 1.7,
          }}
        >
          Put two fund fact sheets head-to-head. See estimated fees, risk
          ratings, and performance metrics in one view — so you can compare on
          equal terms.
        </p>
        <ol
          style={{
            paddingLeft: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            lineHeight: 1.7,
            color: "var(--ink)",
          }}
        >
          <li>
            Go to{" "}
            <Link
              href="/compare"
              style={{ color: "var(--accent)", fontWeight: 600 }}
            >
              Compare Funds
            </Link>{" "}
            from the dashboard.
          </li>
          <li>
            Select two fund fact sheets (or enter the fund names and details
            manually).
          </li>
          <li>Set the same investment amount and time horizon for both.</li>
          <li>
            Review the comparison table: fees, risk, historical performance, and
            more.
          </li>
          <li>
            Download or screenshot the comparison to bring to your advisor.
          </li>
        </ol>
      </section>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--line)",
          margin: "0 0 3rem",
        }}
      />

      {/* Section 3 */}
      <section id="goals" style={{ marginBottom: "3rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="ask" size={20} style={{ color: "#fff" }} />
          </div>
          <h2 style={{ fontSize: "1.25rem", margin: 0 }}>
            Match your financial goals
          </h2>
        </div>
        <p
          style={{
            color: "var(--muted)",
            marginBottom: "1rem",
            lineHeight: 1.7,
          }}
        >
          Answer a short series of questions about what you want this money to
          do — and get a checklist of questions to ask before signing anything.
        </p>
        <ol
          style={{
            paddingLeft: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            lineHeight: 1.7,
            color: "var(--ink)",
          }}
        >
          <li>
            Go to{" "}
            <Link
              href="/needs"
              style={{ color: "var(--accent)", fontWeight: 600 }}
            >
              Match My Goals
            </Link>{" "}
            from the dashboard.
          </li>
          <li>
            Select your primary goal: retirement, education, emergency fund, or
            wealth building.
          </li>
          <li>
            Answer 5–8 questions about your timeline, risk comfort, and
            liquidity needs.
          </li>
          <li>
            Receive a personalized checklist of questions to bring to your
            advisor — organized by priority.
          </li>
        </ol>
      </section>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--line)",
          margin: "0 0 3rem",
        }}
      />

      {/* Section 4 */}
      <section id="reports" style={{ marginBottom: "3rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="save" size={20} style={{ color: "#fff" }} />
          </div>
          <h2 style={{ fontSize: "1.25rem", margin: 0 }}>
            Saving and loading reports
          </h2>
        </div>
        <p
          style={{
            color: "var(--muted)",
            marginBottom: "1rem",
            lineHeight: 1.7,
          }}
        >
          Any analysis you run can be saved to your dashboard and revisited
          later. Reports are stored locally in your browser.
        </p>
        <ol
          style={{
            paddingLeft: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            lineHeight: 1.7,
            color: "var(--ink)",
          }}
        >
          <li>
            After running an analysis, tap <strong>Save report</strong> at the
            bottom of your results.
          </li>
          <li>
            Give it a label (e.g., "ILP — Prudential 2024") so you can find it
            later.
          </li>
          <li>
            Find all saved reports in your{" "}
            <Link
              href="/dashboard"
              style={{ color: "var(--accent)", fontWeight: 600 }}
            >
              Dashboard
            </Link>{" "}
            under Saved reports.
          </li>
          <li>
            Tap <strong>Load</strong> to restore a saved report and update it
            with new inputs.
          </li>
          <li>
            Tap <strong>Delete</strong> to remove a saved report.
          </li>
        </ol>
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#e8f4fd",
            border: "1px solid #b3d7fa",
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          <strong>Tip:</strong> Reports are saved to this browser. If you switch
          devices or clear your browser data, saved reports will not be
          available.
        </div>
      </section>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--line)",
          margin: "0 0 3rem",
        }}
      />

      {/* Section 5 */}
      <section id="account" style={{ marginBottom: "3rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="user" size={20} style={{ color: "#fff" }} />
          </div>
          <h2 style={{ fontSize: "1.25rem", margin: 0 }}>
            Managing your account
          </h2>
        </div>
        <p
          style={{
            color: "var(--muted)",
            marginBottom: "1rem",
            lineHeight: 1.7,
          }}
        >
          Access account settings from the user icon dropdown in the top right
          corner.
        </p>
        <ul
          style={{
            paddingLeft: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            lineHeight: 1.7,
            color: "var(--ink)",
          }}
        >
          <li>
            <strong>Change password:</strong> Go to Account settings → enter
            your current password and new password twice → Update password.
          </li>
          <li>
            <strong>Delete account:</strong> Go to Account settings → scroll to
            Danger zone → Delete account. This removes all saved reports and
            signs you out. This cannot be undone.
          </li>
        </ul>
      </section>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--line)",
          margin: "0 0 3rem",
        }}
      />

      {/* CTA */}
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          background: "var(--surface)",
          borderRadius: "0.75rem",
          border: "1px solid var(--line)",
        }}
      >
        <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
          Ready to get started?
        </p>
        <p
          style={{
            color: "var(--muted)",
            marginBottom: "1rem",
            fontSize: "0.9rem",
          }}
        >
          Analyze your first product in under 5 minutes.
        </p>
        <Link href="/analyze" className="btn">
          Analyze a product
        </Link>
      </div>
    </main>
  );
}
