"use client";

import { useEffect, useMemo, useState } from "react";
import { computeReport, type ReportInputs } from "@/lib/engine";
import { priceLabel } from "@/lib/pricing";
import type { EntitlementState } from "@/lib/entitlement";
import { NumberField } from "../components/ui";
import { Icon } from "../components/icons";
import { ReportView, type GuaranteeInfo } from "../components/Report";
import {
  DocumentIntake,
  type ExtractionResponse,
} from "../components/DocumentIntake";
import { ProductExplainer } from "../components/ProductExplainer";
import {
  listSaved,
  saveReport,
  deleteSaved,
  hasConsent,
  setConsent,
  takeIntakeHandoff,
  type SavedReport,
} from "@/lib/storage";

/**
 * The interactive analyzer (Waves 2–4). Owns inputs, runs the deterministic engine
 * live, and renders the report. Adds: PDPA consent gate for uploads (W4-2), free vs
 * full tier (W4-4), and save / PDF (W4-1/W4-3).
 */
export default function AnalyzePage() {
  // Product inputs.
  const [principal, setPrincipal] = useState(100_000);
  const [horizonYears, setHorizon] = useState(20);
  const [upfrontCharge, setUpfront] = useState(0.03);
  const [fundTER, setFundTER] = useState(0.015);
  const [insuranceCharge, setInsurance] = useState(0.004);
  const [annualAdminFee, setAdmin] = useState(360);
  const [lockInYears, setLockIn] = useState(10);
  const [guaranteeStated, setGuaranteeStated] = useState(false);

  // Personal context.
  const [liquidSavings, setLiquid] = useState(125_000);
  const [monthlyExpenses, setExpenses] = useState(4_000);
  const [objective, setObjective] = useState<"preserve" | "income" | "grow">(
    "grow",
  );

  // Assumptions.
  const [mu, setMu] = useState(0.06);
  // Risk level — one of the three picker values (Lower/Medium/Higher); Medium default.
  const [sigma, setSigma] = useState(0.13);

  // True once the user has entered their OWN savings/expenses — gates the RiskFit
  // & easy-to-reach-money sections so they never compute on placeholder numbers.
  const [contextProvided, setContextProvided] = useState(false);

  // Wave 3 confirm gate + Wave 4 tier / consent / saved reports.
  const [confirmed, setConfirmed] = useState(true);
  const [toVerify, setToVerify] = useState<string[]>([]);
  const [tier, setTier] = useState<"free" | "full">("free");
  const [consent, setConsentState] = useState(false);
  const [saved, setSaved] = useState<SavedReport[]>([]);

  // F6 — paid entitlement ("account") + checkout state.
  const [entitled, setEntitled] = useState(false);
  const [paymentsConfigured, setPaymentsConfigured] = useState(true);
  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutMsg, setCheckoutMsg] = useState<CheckoutMsg>(null);
  // Demo unlock (no-payment full report; only when the deployment sets DEMO_UNLOCK=1).
  const [demoAvailable, setDemoAvailable] = useState(false);
  const [demoEntitled, setDemoEntitled] = useState(false);

  useEffect(() => {
    setConsentState(hasConsent());
    setSaved(listSaved());

    // Surface the Stripe / demo return status, then strip it from the URL.
    const params = new URLSearchParams(window.location.search);
    if (params.get("unlocked") === "1")
      setCheckoutMsg(params.get("demo") === "1" ? "demo_unlocked" : "unlocked");
    else if (params.get("checkout") === "cancelled")
      setCheckoutMsg("cancelled");
    else if (params.get("checkout") === "failed") setCheckoutMsg("failed");
    if (params.has("unlocked") || params.has("checkout")) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    // Resolve entitlement (the paid full-report account, or the demo unlock).
    fetch("/api/entitlement")
      .then((r) => r.json() as Promise<EntitlementState>)
      .then((d) => {
        setEntitled(Boolean(d.entitled));
        setPaymentsConfigured(d.configured !== false);
        setDemoAvailable(Boolean(d.demoAvailable));
        setDemoEntitled(Boolean(d.demo));
        setAccountEmail(d.email ?? null);
        if (d.entitled) setTier("full");
      })
      .catch(() => {
        /* entitlement check failed — stay on the free scan */
      });
  }, []);

  // Upload-first handoff — when the user arrived from the home-page detector, the
  // figures it read are pre-filled here and the confirm gate engages (no math
  // until they check the numbers). Routed-on-classification-only (no fields) just
  // shows the explainer and leaves manual entry below.
  useEffect(() => {
    const h = takeIntakeHandoff();
    if (h?.kind === "ilp" && h.detected && h.fields) {
      applyExtraction({
        fields: h.fields as ExtractionResponse["fields"],
        anyFound: true,
        redactions: 0,
        model: "",
      });
    }
    // applyExtraction is a stable in-component function; run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Begin Stripe Checkout (or reveal the full report if already entitled). */
  async function handleUpgrade() {
    if (entitled) {
      setTier("full");
      return;
    }
    setCheckingOut(true);
    setCheckoutMsg(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      if (res.status === 501) {
        setCheckoutMsg("not_configured");
        return;
      }
      const data = (await res.json()) as { url?: string };
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setCheckoutMsg("failed");
    } catch {
      setCheckoutMsg("failed");
    } finally {
      setCheckingOut(false);
    }
  }

  /** Clear the entitlement cookie ("sign out" of the paid account). */
  async function handleSignOut() {
    await fetch("/api/signout", { method: "POST" }).catch(() => {});
    setEntitled(false);
    setDemoEntitled(false);
    setAccountEmail(null);
    setTier("free");
    setCheckoutMsg(null);
  }

  const report = useMemo(() => {
    const inputs: ReportInputs = {
      product: {
        principal,
        horizonYears,
        grossReturn: mu,
        upfrontCharge,
        bidOfferSpread: 0,
        annualManagementFee: 0,
        fundTER,
        insuranceCharge,
        annualAdminFee,
        premiumMode: "single",
        surrenderSchedule:
          lockInYears > 0 ? Array(lockInYears).fill(0.05) : undefined,
      },
      context: { liquidSavings, monthlyExpenses, horizonYears, objective },
      holdings: [{ assetClass: "cash", amount: liquidSavings, liquid: true }],
      downside: { mu, sigma, paths: 4000, seed: 42 },
    };
    return computeReport(inputs);
  }, [
    principal,
    horizonYears,
    upfrontCharge,
    fundTER,
    insuranceCharge,
    annualAdminFee,
    lockInYears,
    liquidSavings,
    monthlyExpenses,
    objective,
    mu,
    sigma,
  ]);

  const guarantee: GuaranteeInfo = {
    stated: guaranteeStated,
    provider: undefined,
  };

  const snapshot = () => ({
    principal,
    horizonYears,
    upfrontCharge,
    fundTER,
    insuranceCharge,
    annualAdminFee,
    lockInYears,
    guaranteeStated,
    liquidSavings,
    monthlyExpenses,
    objective,
    mu,
    sigma,
  });

  function loadSnapshot(s: Record<string, unknown>) {
    const n = (k: string, d: number) =>
      typeof s[k] === "number" ? (s[k] as number) : d;
    setPrincipal(n("principal", 100_000));
    setHorizon(n("horizonYears", 20));
    setUpfront(n("upfrontCharge", 0.03));
    setFundTER(n("fundTER", 0.015));
    setInsurance(n("insuranceCharge", 0.004));
    setAdmin(n("annualAdminFee", 360));
    setLockIn(n("lockInYears", 10));
    setGuaranteeStated(s.guaranteeStated === true);
    setLiquid(n("liquidSavings", 125_000));
    setExpenses(n("monthlyExpenses", 4_000));
    if (
      s.objective === "preserve" ||
      s.objective === "income" ||
      s.objective === "grow"
    ) {
      setObjective(s.objective);
    }
    setMu(n("mu", 0.06));
    setSigma(n("sigma", 0.13));
    setConfirmed(true);
    setContextProvided(true);
  }

  function applyExtraction(resp: ExtractionResponse) {
    const f = resp.fields;
    const verify: string[] = [];
    const take = <T,>(
      field: { value: T | null; confidence: string },
      set: (v: T) => void,
      label: string,
      transform?: (v: T) => T,
    ) => {
      if (field.confidence !== "not_found" && field.value != null) {
        set(transform ? transform(field.value) : field.value);
        if (field.confidence === "low" || field.confidence === "medium")
          verify.push(`${label} (please double-check)`);
      } else {
        verify.push(`${label} (not found — please enter)`);
      }
    };
    const pctToDec = (v: number) => v / 100;
    take(f.fees.upfront_pct, setUpfront, "Upfront / spread charge", pctToDec);
    take(f.fees.ter_pct, setFundTER, "Fund fee (TER)", pctToDec);
    take(
      f.fees.insurance_charge_pct,
      setInsurance,
      "Insurance charge",
      pctToDec,
    );
    take(f.fees.annual_admin_fee_sgd, setAdmin, "Admin fee / yr");
    take(f.lock_in_years, setLockIn, "Surrender lock-in");
    if (
      f.guarantee.stated.confidence !== "not_found" &&
      f.guarantee.stated.value != null
    ) {
      setGuaranteeStated(f.guarantee.stated.value);
    }
    setToVerify(verify);
    setConfirmed(false);
  }

  function doSave() {
    const label = `S$${principal.toLocaleString("en-SG")} product · ${horizonYears}y`;
    setSaved(saveReport(label, snapshot()));
  }

  return (
    <main className="wide">
      <a href="/" className="back">
        <Icon name="arrow-left" size={16} /> Back
      </a>
      <h1>Analyze a product</h1>
      <p className="page-scope">
        For <strong>insurance &amp; investment-linked products</strong> — fees,
        a surrender period, a guarantee, or a free-look window. Comparing plain
        funds instead?{" "}
        <a href="/compare" className="link">
          Compare funds →
        </a>
      </p>

      {/* Plain-English "what this is" — leads the result before any numbers. */}
      <ProductExplainer kind="ilp" />

      {/* F6 — account / entitlement strip */}
      <div className="account-strip">
        {entitled ? (
          <>
            <span className="account-state on">
              <Icon name="check" size={15} />{" "}
              {demoEntitled
                ? "Full report unlocked · demo"
                : "Full access unlocked"}
              {!demoEntitled && accountEmail ? ` · ${accountEmail}` : ""}
            </span>
            <button type="button" className="link" onClick={handleSignOut}>
              {demoEntitled ? "Exit demo" : "Sign out"}
            </button>
          </>
        ) : (
          <span className="account-state">
            <Icon name="info" size={15} />{" "}
            {demoAvailable && !paymentsConfigured
              ? "Free scan — preview the full report (demo, no payment)"
              : `Free scan — unlock the full report for ${priceLabel()}`}
          </span>
        )}
      </div>

      {checkoutMsg && (
        <div className={`checkout-banner ${checkoutMsg}`} role="status">
          {checkoutMsg === "unlocked" &&
            "Payment received — your full report is unlocked. Thank you."}
          {checkoutMsg === "demo_unlocked" &&
            "Demo mode — the full report is unlocked without any payment, for demonstration only."}
          {checkoutMsg === "cancelled" &&
            "Checkout cancelled — no payment was made."}
          {checkoutMsg === "failed" &&
            "We couldn't confirm a payment. You have not been charged — please try again."}
          {checkoutMsg === "not_configured" &&
            "Payments aren't set up on this deployment yet. Add Stripe test keys to enable checkout."}
        </div>
      )}

      {consent ? (
        <DocumentIntake onExtracted={applyExtraction} />
      ) : (
        <div className="form-card consent-card">
          <h3>Before you upload — your privacy</h3>
          <p className="muted">
            We remove your name, NRIC and policy number <strong>before</strong>{" "}
            any document is read, and we don't keep your uploads. We never sell
            your data or earn from your decision. Manual entry below needs no
            upload at all.
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

      <details className="form-card" open>
        <summary>The product (edit anything we read or you were told)</summary>
        <div className="grid">
          <NumberField
            label="Amount invested"
            prefix="S$"
            value={principal}
            step={1000}
            onChange={setPrincipal}
          />
          <NumberField
            label="Horizon (years)"
            value={horizonYears}
            onChange={setHorizon}
          />
          <NumberField
            label="Upfront / spread charge"
            suffix="%"
            value={round2(upfrontCharge * 100)}
            step={0.1}
            onChange={(v) => setUpfront(v / 100)}
          />
          <NumberField
            label="Fund fee (TER)"
            suffix="%"
            value={round2(fundTER * 100)}
            step={0.1}
            onChange={(v) => setFundTER(v / 100)}
          />
          <NumberField
            label="Insurance charge / yr"
            suffix="%"
            value={round2(insuranceCharge * 100)}
            step={0.1}
            onChange={(v) => setInsurance(v / 100)}
          />
          <NumberField
            label="Admin fee / yr"
            prefix="S$"
            value={annualAdminFee}
            step={10}
            onChange={setAdmin}
          />
          <NumberField
            label="Surrender lock-in (years)"
            value={lockInYears}
            onChange={setLockIn}
          />
          <label className="field">
            <span>Capital guarantee stated?</span>
            <span className="field-input">
              <input
                type="checkbox"
                checked={guaranteeStated}
                onChange={(e) => setGuaranteeStated(e.target.checked)}
              />
            </span>
          </label>
        </div>
      </details>

      <details className="form-card" open>
        <summary>Your context (used only for neutral arithmetic)</summary>
        <div className="grid">
          <NumberField
            label="Liquid savings"
            prefix="S$"
            value={liquidSavings}
            step={1000}
            onChange={(v) => {
              setLiquid(v);
              setContextProvided(true);
            }}
          />
          <NumberField
            label="Monthly expenses"
            prefix="S$"
            value={monthlyExpenses}
            step={100}
            onChange={(v) => {
              setExpenses(v);
              setContextProvided(true);
            }}
          />
          <label className="field">
            <span>What's this money for?</span>
            <span className="field-input">
              <select
                value={objective}
                onChange={(e) =>
                  setObjective(e.target.value as typeof objective)
                }
              >
                <option value="preserve">Preserve it</option>
                <option value="income">Income</option>
                <option value="grow">Grow it</option>
              </select>
            </span>
          </label>
        </div>
      </details>

      {confirmed ? (
        <>
          <div className="report-controls">
            <div className="tier-toggle" role="group" aria-label="Report tier">
              <button
                type="button"
                className={tier === "free" ? "on" : ""}
                onClick={() => setTier("free")}
              >
                Free Quick Scan
              </button>
              <button
                type="button"
                className={tier === "full" ? "on" : ""}
                onClick={() => (entitled ? setTier("full") : handleUpgrade())}
              >
                {entitled
                  ? "Full Report"
                  : demoAvailable && !paymentsConfigured
                    ? "Preview Full Report (demo)"
                    : `Unlock Full Report — ${priceLabel()}`}
              </button>
            </div>
            <div className="report-actions">
              <button type="button" className="btn ghost" onClick={doSave}>
                <Icon name="save" size={17} /> Save
              </button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => window.print()}
              >
                <Icon name="download" size={17} /> PDF
              </button>
            </div>
          </div>

          <ReportView
            report={report}
            guarantee={guarantee}
            mu={mu}
            sigma={sigma}
            onMu={setMu}
            onSigma={setSigma}
            tier={tier}
            onUpgrade={handleUpgrade}
            entitled={entitled}
            paymentsConfigured={paymentsConfigured}
            demoAvailable={demoAvailable}
            checkingOut={checkingOut}
            contextProvided={contextProvided}
            productKind="ilp"
          />

          {saved.length > 0 && (
            <div className="form-card saved-list">
              <h3>Saved reports</h3>
              <ul>
                {saved.map((r) => (
                  <li key={r.id}>
                    <span>
                      {r.label}{" "}
                      <em className="muted">
                        · {new Date(r.savedAt).toLocaleDateString("en-SG")}
                      </em>
                    </span>
                    <span className="saved-actions">
                      <button
                        type="button"
                        className="link"
                        onClick={() => loadSnapshot(r.inputs)}
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        className="link danger"
                        onClick={() => setSaved(deleteSaved(r.id))}
                      >
                        Delete
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="confirm-gate">
          <h3>Please confirm the figures before we calculate</h3>
          <p className="muted">
            We never calculate on numbers we read until you've checked them.
            Edit anything above that looks wrong, then confirm.
          </p>
          {toVerify.length > 0 && (
            <ul className="verify-list">
              {toVerify.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          )}
          <button
            type="button"
            className="btn"
            onClick={() => setConfirmed(true)}
          >
            <Icon name="check" size={18} /> Confirm &amp; generate report
          </button>
        </div>
      )}
    </main>
  );
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Stripe return / checkout status surfaced as a one-line banner. */
type CheckoutMsg =
  | "unlocked"
  | "demo_unlocked"
  | "cancelled"
  | "failed"
  | "not_configured"
  | null;
