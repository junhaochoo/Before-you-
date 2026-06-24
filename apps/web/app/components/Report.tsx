"use client";

import type { Report } from "@/lib/engine";
import { sgd, pct, months } from "@/lib/format";
import {
  feeLensHeadline,
  btirCopy,
  guaranteeCheckCopy,
  CONCENTRATION_CONTEXT,
  questionsFor,
  GLOSSARY,
} from "@/lib/copy";
import { priceLabel } from "@/lib/pricing";
import {
  Disclaimer,
  NoConflictBadge,
  NumberStat,
  Lens,
  TapToExplain,
  Slider,
} from "./ui";
import { GrossNetChart } from "./GrossNetChart";
import { Icon } from "./icons";

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
  entitled = false,
  paymentsConfigured = true,
  demoAvailable = false,
  checkingOut = false,
  contextProvided = false,
  productKind = "ilp",
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
  /** True once the user has entered their own savings/expenses — gates the
   *  RiskFit & Portfolio sections so they never compute on placeholder numbers. */
  contextProvided?: boolean;
  /** Product family, used to tailor the adviser questions. */
  productKind?: "ilp" | "fund";
  /** F6 — true once the visitor has paid for the full report. */
  entitled?: boolean;
  /** F6 — false when this deployment has no Stripe key (payments off). */
  paymentsConfigured?: boolean;
  /** Demo unlock available (DEMO_UNLOCK=1) — reveal the full report without payment. */
  demoAvailable?: boolean;
  /** F6 — true while a checkout session is being opened. */
  checkingOut?: boolean;
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
        <Lens icon={<Icon name="fee" />} title="Fee Lens">
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
          icon={<Icon name="downside" />}
          title="What if? — how outcomes could vary"
          note="These are illustrations from the two settings below, not predictions. Change them to test other assumptions."
        >
          <div className="sliders">
            <Slider
              label="Assumed yearly return"
              min={0}
              max={0.12}
              step={0.005}
              value={mu}
              onChange={onMu}
              format={(v) => pct(v, 1)}
            />
            <label className="field">
              <span>
                How bumpy the ride is (risk level){" "}
                <TapToExplain
                  term="?"
                  plainEnglish="Higher-risk holdings (like shares) can grow more but also fall further; lower-risk ones (like cash or bonds) move less. This sets how wide the good and bad cases below spread out."
                />
              </span>
              <span className="field-input">
                <select
                  value={sigma}
                  onChange={(e) => onSigma(Number(e.target.value))}
                >
                  <option value={0.08}>Lower</option>
                  <option value={0.13}>Medium</option>
                  <option value={0.18}>Higher</option>
                </select>
              </span>
            </label>
          </div>
          <div className="stat-row">
            <NumberStat label="Typical outcome" value={sgd(downside.p50)} />
            <NumberStat
              label="1-in-20 bad case"
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
            In plain terms: most of the time the result lands near the typical
            figure, but a 1-in-20 bad stretch would leave you with about{" "}
            <strong>{sgd(downside.p5)}</strong>. In the worst years, a single
            bad year on this amount is roughly{" "}
            <strong>{sgd(downside.singleYearStressDollar)}</strong>.
          </p>
        </Lens>
      )}

      {/* 03b — RISKFIT (context, not a verdict) — full report, real numbers only */}
      {full && !contextProvided && (
        <Lens
          icon={<Icon name="fit" />}
          title="RiskFit — your context (not advice)"
        >
          <p className="muted">
            Tell us your savings and monthly expenses (in{" "}
            <strong>Your context</strong> above) and this shows how big this
            purchase is for you. We don&apos;t guess your numbers — so there is
            nothing to show until you enter them.
          </p>
        </Lens>
      )}
      {full && contextProvided && (
        <Lens
          icon={<Icon name="fit" />}
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
      <Lens icon={<Icon name="scan" />} title="Product Scan">
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

      {/* 05 — PORTFOLIO MIRROR — full report, real numbers only */}
      {full && contextProvided && (
        <Lens
          icon={<Icon name="mirror" />}
          title="Easy-to-reach money"
          note="How much of your savings stays within easy reach after this purchase."
        >
          <div className="mirror">
            <MirrorBar
              label="Savings you can reach quickly"
              before={portfolio.liquidityRatioBefore}
              after={portfolio.liquidityRatioAfter}
            />
          </div>
          <p className="muted">
            Money in this product is usually locked in for years, so it no
            longer counts as savings you can reach quickly if something comes
            up.
          </p>
        </Lens>
      )}

      {/* Free-tier upgrade prompt (F6 paywall) */}
      {!full && (
        <div className="upgrade">
          <h3>See the full picture</h3>
          <p className="muted">
            The free scan flags terms and gaps. The full report adds the fee
            breakdown, the dollar downside, your concentration &amp; buffer, and
            the gross-vs-net chart — a one-time {priceLabel()}.
          </p>
          <button
            type="button"
            className="btn"
            disabled={checkingOut}
            onClick={() => onUpgrade?.()}
          >
            {checkingOut
              ? "Opening…"
              : entitled
                ? "Show my full report"
                : demoAvailable && !paymentsConfigured
                  ? "Preview the full report (demo)"
                  : `Unlock the full report — ${priceLabel()}`}
          </button>
          {paymentsConfigured ? (
            <p className="muted upgrade-note">
              Test mode — pay with Stripe&apos;s test card 4242 4242 4242 4242
              (any future date, any CVC). We never see your card details and
              earn nothing from your decision.
            </p>
          ) : demoAvailable ? (
            <p className="muted upgrade-note">
              Demonstration mode — this reveals the full paid report{" "}
              <strong>without taking any payment</strong>, so you can see
              exactly what the paid version includes.
            </p>
          ) : (
            <p className="muted upgrade-note">
              Secure payments aren&apos;t configured on this deployment yet. Add
              Stripe test keys and the full report unlocks automatically after a
              test payment.
            </p>
          )}
        </div>
      )}

      {/* 04 — DECISION GAP (free + full) */}
      <Lens
        icon={<Icon name="ask" />}
        title="Decision Gaps — questions to ask your adviser"
      >
        <ul className="questions">
          {questionsFor({
            kind: productKind,
            hasLockIn: riskFit.lockInEndYear != null,
            guaranteeStated: guarantee.stated,
          }).map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
        <button type="button" className="btn" onClick={() => window.print()}>
          <Icon name="print" size={18} /> Print questions
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
