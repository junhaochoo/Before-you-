"use client";

import { useEffect, useMemo, useState } from "react";
import {
  computeFundComparison,
  type FundInput,
  type FundGlobals,
} from "@/lib/engine/funds";
import { sgd, pct } from "@/lib/format";
import {
  Disclaimer,
  NoConflictBadge,
  NumberStat,
  TapToExplain,
} from "../components/ui";
import { Icon } from "../components/icons";
import {
  FundIntake,
  type FundExtractionResponse,
} from "../components/FundIntake";
import { ProductExplainer } from "../components/ProductExplainer";
import {
  FUND_GLOSSARY,
  ASSET_CLASSES,
  CREDIT_TIERS,
  CREDIT_QUALITY_NOTE,
  ESG_NOTE,
  decodeAssetClass,
  decodeCreditQuality,
  decodeEsg,
} from "@/lib/fundEducation";
import { hasConsent, setConsent, takeIntakeHandoff } from "@/lib/storage";

/**
 * Funds comparison — put several funds side by side on the SAME amount + horizon,
 * so only the fund differs. Surfaces cost, fee drag, and downside scenarios as
 * facts. Never names a winner (compliance-guardrails.md). The figures the user
 * enters come from each fund's own factsheet; returns/risk are assumptions.
 */

const RISK_OPTIONS: { label: string; value: number }[] = [
  { label: "Lower", value: 0.08 },
  { label: "Medium", value: 0.13 },
  { label: "Higher", value: 0.18 },
];

let nextId = 100;
const newId = () => `f${nextId++}`;

/** Editable defaults — generic placeholders; rename + retype from your factsheets. */
const DEFAULT_FUNDS: FundInput[] = [
  {
    id: "f1",
    name: "Fund A",
    expectedReturn: 0.04,
    volatility: 0.08,
    salesCharge: 0.03,
    ter: 0.014,
    platformFee: 0.005,
  },
  {
    id: "f2",
    name: "Fund B",
    expectedReturn: 0.065,
    volatility: 0.18,
    salesCharge: 0.02,
    ter: 0.011,
    platformFee: 0.0,
  },
  {
    id: "f3",
    name: "Fund C",
    expectedReturn: 0.05,
    volatility: 0.13,
    salesCharge: 0.015,
    ter: 0.01,
    platformFee: 0.0,
  },
];

export default function ComparePage() {
  const [principal, setPrincipal] = useState(100_000);
  const [horizonYears, setHorizon] = useState(10);
  const [funds, setFunds] = useState<FundInput[]>(DEFAULT_FUNDS);
  const [consent, setConsentState] = useState(false);

  useEffect(() => {
    setConsentState(hasConsent());
  }, []);

  // Upload-first handoff — apply any fund charges the home-page detector read.
  // Routed-on-classification-only (no fields) just shows the explainer; the
  // editable fund cards below work with or without an upload.
  useEffect(() => {
    const h = takeIntakeHandoff();
    if (h?.kind === "fund" && h.detected && h.fields) {
      applyFundExtraction({
        fields: h.fields as FundExtractionResponse["fields"],
        anyFound: true,
        redactions: 0,
        model: "",
      });
    }
    // applyFundExtraction is a stable in-component function; run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const globals: FundGlobals = { principal, horizonYears };
  const cmp = useMemo(
    () => computeFundComparison(globals, funds),
    [principal, horizonYears, funds],
  );

  function patch(id: string, field: keyof FundInput, value: number | string) {
    setFunds((fs) =>
      fs.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    );
  }
  function addFund() {
    if (funds.length >= 4) return;
    setFunds((fs) => [
      ...fs,
      {
        id: newId(),
        name: `Fund ${String.fromCharCode(65 + fs.length)}`,
        expectedReturn: 0.05,
        volatility: 0.13,
        salesCharge: 0.02,
        ter: 0.011,
        platformFee: 0.0,
      },
    ]);
  }
  function removeFund(id: string) {
    if (funds.length <= 2) return;
    setFunds((fs) => fs.filter((f) => f.id !== id));
  }

  /** Add a fund card from an uploaded factsheet — charges only; missing charges
   *  default to 0 (honest "not found, please check"), returns/risk stay assumptions. */
  function applyFundExtraction(resp: FundExtractionResponse) {
    const f = resp.fields;
    const dec = (v: number | null) => (v == null ? 0 : v / 100);
    setFunds((fs) => {
      const name =
        f.name.value?.trim() || `Fund ${String.fromCharCode(65 + fs.length)}`;
      const label = (x: { value: string | null; confidence: string }) =>
        x.confidence !== "not_found" && x.value?.trim()
          ? x.value.trim()
          : undefined;
      const imported: FundInput = {
        id: newId(),
        name,
        expectedReturn: 0.05,
        volatility: 0.13,
        salesCharge: dec(f.sales_charge_pct.value),
        ter: dec(f.ongoing_charge_pct.value),
        platformFee: dec(f.platform_fee_pct.value),
        assetClass: label(f.asset_class),
        creditQuality: label(f.credit_quality),
        esg: label(f.esg_rating),
      };
      // Append when there's room; otherwise replace the last card.
      return fs.length >= 4 ? [...fs.slice(0, 3), imported] : [...fs, imported];
    });
  }

  return (
    <main className="wide">
      <a href="/" className="back">
        <Icon name="arrow-left" size={16} /> Back
      </a>

      <section className="hero">
        <h1>Compare funds side by side.</h1>
        <p className="lede">
          Same money, same horizon — see what each fund really costs and how its
          outcomes could differ.
        </p>
        <p className="page-scope">
          For <strong>investment funds &amp; unit trusts</strong> — sales
          charge, ongoing charge (TER) and platform fee. Reviewing an insurance
          or investment-linked product instead?{" "}
          <a href="/analyze" className="link">
            Analyze a product →
          </a>
        </p>
      </section>

      <header className="report-head">
        <h2>Fund comparison</h2>
        <NoConflictBadge />
      </header>
      <Disclaimer />

      {/* Plain-English "what this is" — leads the result before any numbers. */}
      <ProductExplainer kind="fund" />

      {/* Fund factsheet upload (Q2) — PDPA-gated, same as the analyzer */}
      {consent ? (
        <FundIntake onExtracted={applyFundExtraction} />
      ) : (
        <div className="form-card consent-card">
          <h3>Before you upload — your privacy</h3>
          <p className="muted">
            We remove any personal details <strong>before</strong> a factsheet
            is read, and we don&apos;t keep your uploads. We never sell your
            data or earn from your decision. Entering the charges by hand needs
            no upload.
          </p>
          <label className="consent-check">
            <input
              type="checkbox"
              onChange={(e) => {
                setConsent(e.target.checked);
                setConsentState(e.target.checked);
              }}
            />
            I understand and consent to my document being processed this way
            (PDPA).
          </label>
        </div>
      )}

      {/* Shared assumptions */}
      <details className="form-card" open>
        <summary>The money (same for every fund)</summary>
        <div className="grid">
          <label className="field">
            <span>Amount invested</span>
            <span className="field-input">
              <span className="affix">S$</span>
              <input
                type="number"
                step={1000}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
              />
            </span>
          </label>
          <label className="field">
            <span>Horizon (years)</span>
            <span className="field-input">
              <input
                type="number"
                value={horizonYears}
                onChange={(e) => setHorizon(Number(e.target.value))}
              />
            </span>
          </label>
        </div>
      </details>

      {/* Headline fact: the cost spread */}
      {cmp.funds.length >= 2 && cmp.feeSpread > 0 && (
        <p className="compare">
          Over {horizonYears} years on {sgd(principal)}, the highest-fee fund
          takes about <strong>{sgd(cmp.feeSpread)}</strong> more in fees than
          the lowest-fee one. More fees is not automatically worse — a fund may
          charge more while holding different assets or aiming for higher
          returns. This is a factual comparison, not a recommendation.
        </p>
      )}

      {/* Side-by-side fund cards */}
      <div className="fund-grid">
        {cmp.funds.map((r) => {
          const f = r.input;
          const isLow = r.id === cmp.lowestFeeFundId;
          const isHigh = r.id === cmp.highestFeeFundId;
          return (
            <section className="fund-card" key={r.id}>
              <div className="fund-card-head">
                <input
                  className="fund-name"
                  value={f.name}
                  aria-label="Fund name"
                  onChange={(e) => patch(r.id, "name", e.target.value)}
                />
                {isLow && <span className="cost-chip low">Lowest fees</span>}
                {isHigh && <span className="cost-chip high">Highest fees</span>}
              </div>

              {/* The big, clear results */}
              <div className="fund-results">
                <NumberStat
                  label="Total fees"
                  value={sgd(r.totalFeesPaid)}
                  tone="warn"
                />
                <NumberStat label="What you keep" value={sgd(r.finalNet)} />
                <NumberStat label="Typical outcome" value={sgd(r.p50)} />
              </div>
              <ul className="fund-facts">
                <li>
                  <span>{pct(r.feeDrag)}</span> of growth lost to fees
                </li>
                <li>
                  1-in-20 bad case: <span>{sgd(r.p5)}</span>
                </li>
                {r.extraFeeVsCheapest > 0 && (
                  <li>
                    <span>{sgd(r.extraFeeVsCheapest)}</span> more in fees than
                    the cheapest
                  </li>
                )}
              </ul>

              {/* Decoded descriptive labels read from the factsheet (F14) */}
              <FundProfile fund={f} />

              {/* Compact editable inputs from the factsheet */}
              <details className="fund-edit">
                <summary>Edit this fund</summary>
                <div className="fund-fields">
                  <PctField
                    label="Expected return / yr"
                    value={f.expectedReturn}
                    onChange={(v) => patch(r.id, "expectedReturn", v)}
                  />
                  <label className="field">
                    <span>Risk level</span>
                    <span className="field-input">
                      <select
                        value={f.volatility}
                        onChange={(e) =>
                          patch(r.id, "volatility", Number(e.target.value))
                        }
                      >
                        {RISK_OPTIONS.map((o) => (
                          <option key={o.label} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </span>
                  </label>
                  <PctField
                    label="Sales charge"
                    value={f.salesCharge}
                    onChange={(v) => patch(r.id, "salesCharge", v)}
                  />
                  <PctField
                    label="Fund fee (TER)"
                    value={f.ter}
                    onChange={(v) => patch(r.id, "ter", v)}
                  />
                  <PctField
                    label="Platform fee / yr"
                    value={f.platformFee}
                    onChange={(v) => patch(r.id, "platformFee", v)}
                  />
                </div>
                {funds.length > 2 && (
                  <button
                    type="button"
                    className="link danger"
                    onClick={() => removeFund(r.id)}
                  >
                    Remove fund
                  </button>
                )}
              </details>
            </section>
          );
        })}
      </div>

      {funds.length < 4 && (
        <button type="button" className="btn ghost" onClick={addFund}>
          <Icon name="file" size={16} /> Add another fund
        </button>
      )}

      {/* F14 — fund education: decode the terms a factsheet uses but rarely explains */}
      <details className="form-card">
        <summary>What these terms mean</summary>
        <p className="muted">
          Plain-English explanations — neutral facts to help you read a
          factsheet. None of this says whether a fund is right for you.
        </p>

        <h4 className="edu-head">
          <Icon name="fee" size={15} /> The charges
        </h4>
        <p className="glossary">
          {FUND_GLOSSARY.map((g) => (
            <TapToExplain
              key={g.term}
              term={g.term}
              plainEnglish={g.plainEnglish}
            />
          ))}
        </p>

        <h4 className="edu-head">
          <Icon name="mirror" size={15} /> What a fund holds (asset class)
        </h4>
        <ul className="edu-list">
          {ASSET_CLASSES.map((a) => (
            <li key={a.key}>
              <span>{a.label}</span> — {a.plain}
            </li>
          ))}
        </ul>

        <h4 className="edu-head">
          <Icon name="downside" size={15} /> Credit quality (for bond funds)
        </h4>
        <p className="muted">{CREDIT_QUALITY_NOTE}</p>
        <ul className="edu-list">
          {CREDIT_TIERS.map((c) => (
            <li key={c.key}>
              <span>{c.label}</span> — {c.plain}
            </li>
          ))}
        </ul>

        <h4 className="edu-head">
          <Icon name="fit" size={15} /> ESG / sustainability labels
        </h4>
        <p className="muted">{ESG_NOTE}</p>
      </details>

      <p className="muted" style={{ marginTop: "1.25rem" }}>
        Returns and risk levels are assumptions you can change. Charges should
        come from each fund&apos;s factsheet (look for the sales charge, the
        ongoing charge or TER, and any platform fee).
      </p>
    </main>
  );
}

/**
 * FundProfile — decodes the descriptive labels (asset class, credit quality,
 * ESG) read from a factsheet into plain English. Renders nothing when a fund was
 * entered by hand (no labels present). Neutral facts only — never a verdict.
 */
function FundProfile({ fund }: { fund: FundInput }) {
  const rows = [
    { detected: fund.assetClass, decoded: decodeAssetClass(fund.assetClass) },
    {
      detected: fund.creditQuality,
      decoded: decodeCreditQuality(fund.creditQuality),
    },
    { detected: fund.esg, decoded: decodeEsg(fund.esg) },
  ].filter((r) => r.detected && r.decoded);

  if (rows.length === 0) return null;

  return (
    <ul className="fund-profile">
      {rows.map((r, i) => (
        <li key={i}>
          <span className="fund-profile-label">{r.detected}</span>
          <span className="fund-profile-plain">{r.decoded!.plain}</span>
        </li>
      ))}
    </ul>
  );
}

/** Compact percent input (stores a decimal, displays a percent). */
function PctField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <span className="field-input">
        <input
          type="number"
          step={0.1}
          value={Math.round(value * 1000) / 10}
          onChange={(e) => onChange(Number(e.target.value) / 100)}
        />
        <span className="affix">%</span>
      </span>
    </label>
  );
}
