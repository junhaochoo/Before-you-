"use client";

import type { Report } from "@/lib/engine";
import { sgd, pct, months } from "@/lib/format";
import {
  feeLensHeadline,
  btirCopy,
  guaranteeCheckCopy,
  CONCENTRATION_CONTEXT,
  QUESTIONS_TO_ASK,
  GLOSSARY,
} from "@/lib/copy";
import {
  Disclaimer,
  NoConflictBadge,
  NumberStat,
  Lens,
  TapToExplain,
  Slider,
} from "./ui";
import { GrossNetChart } from "./GrossNetChart";

export interface GuaranteeInfo {
  stated: boolean;
  provider?: string;
}

/**
 * The hero report artefact (13-product-design-ux.md Screen 3). Assembles the five
 * lenses. Every figure comes from `report` (computeReport) — nothing hardcoded.
 * Carries the disclaimer (top) and emits no buy/sell/suitability verdict anywhere.
 */
export function ReportView({
  report,
  guarantee,
  mu,
  sigma,
  onMu,
  onSigma,
  tier = "full",
  onUpgrade,
}: {
  report: Report;
  guarantee: GuaranteeInfo;
  mu: number;
  sigma: number;
  onMu: (v: number) => void;
  onSigma: (v: number) => void;
  /** Free Quick Scan shows only the compliant, no-financials lenses (W4-4). */
  tier?: "free" | "full";
  onUpgrade?: () => void;
}) {
  const { feeLens, downside, riskFit, portfolio } = report;
  const full = tier === "full";

  return (
    <div className="report">
      <header className="report-head">
        <h2>Before You Sign — {full ? "Full Report" : "Free Quick Scan"}</h2>
        <NoConflictBadge />
      </header>
      <Disclaimer />

      {/* 02 — FEE LENS (hero) — full report only */}
      {full && (
      <Lens icon="💰" title="Fee Lens">
        <p className="headline">{feeLensHeadline(report)}</p>
        <div className="stat-row">
          <NumberStat
            label="Total fees over the period"
            value={sgd(feeLens.totalFeesPaid)}
            tone="warn"
          />
          <NumberStat
            label="Share of your potential lost to fees"
            value={pct(feeLens.feeDrag)}
            tone="warn"
          />
          <NumberStat label="What you keep" value={sgd(feeLens.finalNet)} />
        </div>
        <GrossNetChart
          grossCurve={feeLens.grossCurve}
          netCurve={feeLens.netCurve}
        />
        <p className="compare">{btirCopy(report)}</p>
        {feeLens.breakEvenSurrenderYear != null && (
          <p className="muted">
            You could first exit without a loss from charges around year{" "}
            <strong>{feeLens.breakEvenSurrenderYear}</strong>.
          </p>
        )}
      </Lens>
      )}

      {/* 03 — WHAT IF (downside) — full report only */}
      {full && (
      <Lens
        icon="📉"
        title="What if? — downside scenarios"
        note="These are scenarios from the assumptions below, not forecasts. Move the sliders to test other assumptions."
      >
        <div className="sliders">
          <Slider
            label="Assumed average return"
            min={0}
            max={0.12}
            step={0.005}
            value={mu}
            onChange={onMu}
            format={(v) => pct(v, 1)}
          />
          <Slider
            label="Assumed volatility"
            min={0.05}
            max={0.3}
            step={0.01}
            value={sigma}
            onChange={onSigma}
            format={(v) => pct(v, 0)}
          />
        </div>
        <div className="stat-row">
          <NumberStat
            label="Typical (median) outcome"
            value={sgd(downside.p50)}
          />
          <NumberStat
            label="1-in-20 bad case (P5)"
            value={sgd(downside.p5)}
            tone="warn"
          />
          <NumberStat
            label="Chance of ending below what you put in"
            value={pct(downside.probabilityOfLoss)}
            tone="warn"
          />
        </div>
        <p className="muted">
          Across {downside.paths.toLocaleString()} {downside.model} scenarios.
          In the worst 5%, the average outcome is about{" "}
          <strong>{sgd(downside.expectedShortfall)}</strong>. A single bad year
          on this amount is roughly{" "}
          <strong>{sgd(downside.singleYearStressDollar)}</strong>.
        </p>
      </Lens>
      )}

      {/* 03b — RISKFIT (context, not a verdict) — full report only */}
      {full && (
      <Lens
        icon="⚖"
        title="RiskFit — your context (not advice)"
        note="Neutral facts about your own numbers. We do not tell you whether this is suitable for you."
      >
        <div className="stat-row">
          <NumberStat
            label="Share of your liquid savings"
            value={pct(riskFit.concentration)}
            tone={riskFit.concentration > 0.2 ? "warn" : "ink"}
          />
          <NumberStat
            label="Buffer left after buying"
            value={months(riskFit.liquidityBufferMonths)}
          />
          <NumberStat
            label="A 1-in-20 bad year is about"
            value={sgd(riskFit.stressDollarImpact)}
            tone="warn"
          />
        </div>
        <p className="muted">{CONCENTRATION_CONTEXT}</p>
        {riskFit.lockInEndYear != null && (
          <p className="muted">
            Surrender penalties run until about year{" "}
            <strong>{riskFit.lockInEndYear}</strong>; you said your horizon is{" "}
            <strong>{report.sensitivity.horizonYears} years</strong>.{" "}
            {riskFit.lockInExceedsHorizon
              ? "Your horizon is shorter than the lock-in — a fact worth clarifying."
              : ""}
          </p>
        )}
        {riskFit.exceedsLiquidSavings && (
          <p className="muted">
            This product is larger than your stated liquid savings.
          </p>
        )}
      </Lens>
      )}

      {/* 01 — PRODUCT SCAN (free + full) */}
      <Lens icon="🔍" title="Product Scan">
        <p>{guaranteeCheckCopy(guarantee.stated, guarantee.provider)}</p>
        <p className="muted">Tap a term to see what it means:</p>
        <p className="glossary">
          {GLOSSARY.map((g) => (
            <TapToExplain
              key={g.term}
              term={g.term}
              plainEnglish={g.plainEnglish}
            />
          ))}
        </p>
      </Lens>

      {/* 05 — PORTFOLIO MIRROR — full report only */}
      {full && (
      <Lens
        icon="📊"
        title="Portfolio Mirror"
        note="How this purchase changes your overall mix."
      >
        <div className="mirror">
          <MirrorBar
            label="Concentration (HHI)"
            before={portfolio.hhiBefore}
            after={portfolio.hhiAfter}
          />
          <MirrorBar
            label="Liquid share of wealth"
            before={portfolio.liquidityRatioBefore}
            after={portfolio.liquidityRatioAfter}
          />
        </div>
      </Lens>
      )}

      {/* Free-tier upgrade prompt */}
      {!full && (
        <div className="upgrade">
          <h3>See the full picture</h3>
          <p className="muted">
            The free scan flags terms and gaps. The full report adds the fee breakdown,
            the dollar downside, your concentration &amp; buffer, and the gross-vs-net chart.
          </p>
          <button type="button" className="btn" onClick={() => onUpgrade?.()}>
            Unlock the full report
          </button>
        </div>
      )}

      {/* 04 — DECISION GAP (free + full) */}
      <Lens icon="❓" title="Decision Gaps — questions to ask your adviser">
        <ul className="questions">
          {QUESTIONS_TO_ASK.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
        <button type="button" className="btn" onClick={() => window.print()}>
          🖨 Print questions sheet
        </button>
      </Lens>
    </div>
  );
}

function MirrorBar({
  label,
  before,
  after,
}: {
  label: string;
  before: number;
  after: number;
}) {
  const barWidth = (v: number) =>
    `${Math.round(Math.min(100, v * 100) * 10) / 10}%`;
  return (
    <div className="mirror-row">
      <div className="mirror-label">{label}</div>
      <div className="mirror-bars">
        <div className="mirror-bar">
          <span style={{ width: barWidth(before) }} />
          <em>before {pct(before)}</em>
        </div>
        <div className="mirror-bar">
          <span style={{ width: barWidth(after) }} />
          <em>after {pct(after)}</em>
        </div>
      </div>
    </div>
  );
}
