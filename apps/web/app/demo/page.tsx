"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "../components/icons";

const demos = [
  {
    id: "ilp",
    label: "Investment-Linked Policy",
    shortLabel: "ILP",
    icon: "file",
    description: "A popular insurance-investment hybrid sold in Singapore.",
    input: {
      title: "Brightwealth ILP — Benefit Illustration",
      preview:
        "Sum Assured: S$100,000 | Annual Premium: S$12,000 | Policy Term: 20 years\nPremium Payment Term: 10 years\nFund: Growth Fund (SGX-listed equities, global bonds)\nManagement Fee: 1.5% p.a. | Surrender Charge: 5% (Yr 1) → 0% (Yr 10+)\nMaturity Benefit: Account Value minus Surrender Charge\nDeath Benefit: Greater of Sum Assured or Account Value",
    },
    analysis: [
      {
        label: "Total fees in Year 1",
        value: "S$2,840",
        detail: "1.5% management + S$1,340 admin charges",
      },
      {
        label: "Effective return reduction",
        value: "–3.8%",
        detail: "Fees eat 3.8% of your returns every year",
      },
      {
        label: "Break-even year",
        value: "Year 6",
        detail: "You need to hold 6+ years to recover front-loaded costs",
      },
      {
        label: "Surrender charge period",
        value: "10 years",
        detail: "Early exit loses 5%–1% of account value",
      },
    ],
    verdict: {
      headline: "High-cost product — read the full report before signing.",
      body: "This ILP charges S$2,840 in fees in Year 1 alone on a S$12,000 premium. Most first-year premium goes to agent commission. Hold less than 6 years and fees may exceed gains.",
      badge: "High Cost",
    },
  },
  {
    id: "fund",
    label: "Fund Factsheet",
    shortLabel: "Fund",
    icon: "file",
    description: "An retail fund sold through banks and financial advisors.",
    input: {
      title: "Pacific Asian Growth Fund — Factsheet Summary",
      preview:
        "Fund Size: S$420M | Launched: 2015 | ISIN: SG9999001234\nManagement Fee: 1.35% p.a. | Initial Charge: 3% | Renewal Commission: 0.5%\nBenchmark: MSCI AC Asia ex-Japan | 3-yr Return: +8.2% p.a.\nTop Holdings: Alibaba, Tencent, Samsung, DBS, AIA\nRisk Rating: Moderately Aggressive | Duration: N/A (equity fund)",
    },
    analysis: [
      {
        label: "Ongoing charge",
        value: "1.35%/yr",
        detail: "Plus 3% initial charge = 4.35% before your money works",
      },
      {
        label: "3-year performance",
        value: "+8.2%",
        detail: "Gross return; net of fees = +6.85% per year",
      },
      {
        label: "Hidden cost (trail)",
        value: "+0.5%/yr",
        detail: "Renewal commission built into the fund — you don't see it",
      },
      {
        label: "Comparable ETF cost",
        value: "0.20%/yr",
        detail: "An MSCI Asia ETF costs 85% less for similar exposure",
      },
    ],
    verdict: {
      headline: "Solid fund, but fees are well above market average.",
      body: "The 1.35% fee is 6× higher than a comparable ETF. Over 10 years on S$50,000, you could save ~S$7,000 by switching to a low-cost alternative.",
      badge: "High Fee",
    },
  },
  {
    id: "savings",
    label: "Savings Plan",
    shortLabel: "Savings",
    icon: "file",
    description: "A regular savings plan with insurance wrapper.",
    input: {
      title: "SecureSave Endowment — Product Summary",
      preview:
        "Sum Assured: S$50,000 | Monthly Premium: S$300 | Duration: 10 years\nMaturity Benefit: S$40,000 guaranteed + bonuses\nSurrender Value (Yr 3): S$3,200 | Loyalty Bonus: S$600 (at maturity only)\nDeath Benefit: Sum Assured + accumulated bonuses\nNon-forfeiture: Policy lapses if 3 months premium unpaid",
    },
    analysis: [
      {
        label: "Total premiums paid",
        value: "S$36,000",
        detail: "S$300 × 12 months × 10 years",
      },
      {
        label: "Guaranteed maturity",
        value: "S$40,000",
        detail: "S$4,000 guaranteed gain over 10 years = ~1.0% p.a.",
      },
      {
        label: "Total bonuses at maturity",
        value: "S$2,100",
        detail: "Estimated; not guaranteed — depends on insurer's performance",
      },
      {
        label: "Effective return",
        value: "~1.7% p.a.",
        detail: "Better than cash, but far below equities long-run average",
      },
    ],
    verdict: {
      headline:
        "Low return, but capital is guaranteed. Suitable as a savings buffer.",
      body: "This plan is best suited as a forced savings discipline tool, not an investment. The guaranteed portion protects capital, but you should not expect investment growth.",
      badge: "Low Return",
    },
  },
];

export default function DemoPage() {
  const [active, setActive] = useState(0);
  const demo = demos[active];

  return (
    <main>
      <Link href="/" className="back">
        <Icon name="arrow-left" size={15} /> Back
      </Link>

      <h1 style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
        See it in action
      </h1>
      <p
        style={{
          color: "var(--muted)",
          marginTop: 0,
          marginBottom: "2rem",
          maxWidth: "50ch",
        }}
      >
        Select a document type below to see exactly what Before You Sign
        analyzes and what your report looks like.
      </p>

      {/* Product selector */}
      <div className="demo-tabs">
        {demos.map((d, i) => (
          <button
            key={d.id}
            type="button"
            className={`demo-tab${active === i ? " on" : ""}`}
            onClick={() => setActive(i)}
          >
            <Icon name={d.icon as "file"} size={16} />
            {d.label}
          </button>
        ))}
      </div>

      {/* Three-column layout */}
      <div className="demo-layout">
        {/* Input column */}
        <div className="demo-col">
          <p className="demo-col-label">1. Your document</p>
          <div className="demo-doc">
            <p className="demo-doc-title">{demo.input.title}</p>
            <pre className="demo-doc-text">{demo.input.preview}</pre>
          </div>
        </div>

        {/* Analysis column */}
        <div className="demo-col">
          <p className="demo-col-label">2. What we analyze</p>
          <div className="demo-metrics">
            {demo.analysis.map((item) => (
              <div key={item.label} className="demo-metric">
                <div className="demo-metric-value">{item.value}</div>
                <div className="demo-metric-label">{item.label}</div>
                <div className="demo-metric-detail">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Output column */}
        <div className="demo-col">
          <p className="demo-col-label">3. Your report</p>
          <div className="demo-report">
            <div
              className={`demo-badge ${demo.verdict.badge === "High Cost" ? "warn" : demo.verdict.badge === "High Fee" ? "warn" : "good"}`}
            >
              {demo.verdict.badge}
            </div>
            <h3>{demo.verdict.headline}</h3>
            <p>{demo.verdict.body}</p>
            <div className="demo-report-cta">
              <Link href="/login" className="btn">
                Get your real report
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
          Want to see what your own document says?
        </p>
        <Link href="/login" className="btn">
          Upload your document — first report free
        </Link>
      </div>
    </main>
  );
}
