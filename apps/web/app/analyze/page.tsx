"use client";

import { useEffect, useMemo, useState } from "react";
import { computeReport, type ReportInputs } from "@/lib/engine";
import { NumberField } from "../components/ui";
import { ReportView, type GuaranteeInfo } from "../components/Report";
import { DocumentIntake, type ExtractionResponse } from "../components/DocumentIntake";
import {
  listSaved,
  saveReport,
  deleteSaved,
  hasConsent,
  setConsent,
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
  const [objective, setObjective] = useState<"preserve" | "income" | "grow">("grow");

  // Assumptions.
  const [mu, setMu] = useState(0.06);
  const [sigma, setSigma] = useState(0.15);

  // Wave 3 confirm gate + Wave 4 tier / consent / saved reports.
  const [confirmed, setConfirmed] = useState(true);
  const [toVerify, setToVerify] = useState<string[]>([]);
  const [tier, setTier] = useState<"free" | "full">("full");
  const [consent, setConsentState] = useState(false);
  const [saved, setSaved] = useState<SavedReport[]>([]);

  useEffect(() => {
    setConsentState(hasConsent());
    setSaved(listSaved());
  }, []);

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
        surrenderSchedule: lockInYears > 0 ? Array(lockInYears).fill(0.05) : undefined,
      },
      context: { liquidSavings, monthlyExpenses, horizonYears, objective },
      holdings: [{ assetClass: "cash", amount: liquidSavings, liquid: true }],
      downside: { mu, sigma, paths: 4000, seed: 42 },
    };
    return computeReport(inputs);
  }, [
    principal, horizonYears, upfrontCharge, fundTER, insuranceCharge, annualAdminFee,
    lockInYears, liquidSavings, monthlyExpenses, objective, mu, sigma,
  ]);

  const guarantee: GuaranteeInfo = { stated: guaranteeStated, provider: undefined };

  const snapshot = () => ({
    principal, horizonYears, upfrontCharge, fundTER, insuranceCharge, annualAdminFee,
    lockInYears, guaranteeStated, liquidSavings, monthlyExpenses, objective, mu, sigma,
  });

  function loadSnapshot(s: Record<string, unknown>) {
    const n = (k: string, d: number) => (typeof s[k] === "number" ? (s[k] as number) : d);
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
    if (s.objective === "preserve" || s.objective === "income" || s.objective === "grow") {
      setObjective(s.objective);
    }
    setMu(n("mu", 0.06));
    setSigma(n("sigma", 0.15));
    setConfirmed(true);
  }

  function applyExtraction(resp: ExtractionResponse) {
    const f = resp.fields;
    const verify: string[] = [];
    const take = <T,>(field: { value: T | null; confidence: string }, set: (v: T) => void, label: string, transform?: (v: T) => T) => {
      if (field.confidence !== "not_found" && field.value != null) {
        set(transform ? transform(field.value) : field.value);
        if (field.confidence === "low" || field.confidence === "medium") verify.push(`${label} (please double-check)`);
      } else {
        verify.push(`${label} (not found — please enter)`);
      }
    };
    const pctToDec = (v: number) => v / 100;
    take(f.fees.upfront_pct, setUpfront, "Upfront / spread charge", pctToDec);
    take(f.fees.ter_pct, setFundTER, "Fund fee (TER)", pctToDec);
    take(f.fees.insurance_charge_pct, setInsurance, "Insurance charge", pctToDec);
    take(f.fees.annual_admin_fee_sgd, setAdmin, "Admin fee / yr");
    take(f.lock_in_years, setLockIn, "Surrender lock-in");
    if (f.guarantee.stated.confidence !== "not_found" && f.guarantee.stated.value != null) {
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
      <a href="/" className="back">← Back</a>
      <h1>Analyze a product</h1>

      {consent ? (
        <DocumentIntake onExtracted={applyExtraction} />
      ) : (
        <div className="form-card consent-card">
          <h3>Before you upload — your privacy</h3>
          <p className="muted">
            We remove your name, NRIC and policy number <strong>before</strong> any document is
            read, and we don't keep your uploads. We never sell your data or earn from your
            decision. Manual entry below needs no upload at all.
          </p>
          <label className="consent-check">
            <input
              type="checkbox"
              onChange={(e) => {
                setConsent(e.target.checked);
                setConsentState(e.target.checked);
              }}
            />
            I understand and consent to my document being processed this way (PDPA).
          </label>
        </div>
      )}

      <details className="form-card" open>
        <summary>The product (edit anything we read or you were told)</summary>
        <div className="grid">
          <NumberField label="Amount invested" prefix="S$" value={principal} step={1000} onChange={setPrincipal} />
          <NumberField label="Horizon (years)" value={horizonYears} onChange={setHorizon} />
          <NumberField label="Upfront / spread charge" suffix="%" value={round2(upfrontCharge * 100)} step={0.1} onChange={(v) => setUpfront(v / 100)} />
          <NumberField label="Fund fee (TER)" suffix="%" value={round2(fundTER * 100)} step={0.1} onChange={(v) => setFundTER(v / 100)} />
          <NumberField label="Insurance charge / yr" suffix="%" value={round2(insuranceCharge * 100)} step={0.1} onChange={(v) => setInsurance(v / 100)} />
          <NumberField label="Admin fee / yr" prefix="S$" value={annualAdminFee} step={10} onChange={setAdmin} />
          <NumberField label="Surrender lock-in (years)" value={lockInYears} onChange={setLockIn} />
          <label className="field">
            <span>Capital guarantee stated?</span>
            <span className="field-input">
              <input type="checkbox" checked={guaranteeStated} onChange={(e) => setGuaranteeStated(e.target.checked)} />
            </span>
          </label>
        </div>
      </details>

      <details className="form-card" open>
        <summary>Your context (used only for neutral arithmetic)</summary>
        <div className="grid">
          <NumberField label="Liquid savings" prefix="S$" value={liquidSavings} step={1000} onChange={setLiquid} />
          <NumberField label="Monthly expenses" prefix="S$" value={monthlyExpenses} step={100} onChange={setExpenses} />
          <label className="field">
            <span>What's this money for?</span>
            <span className="field-input">
              <select value={objective} onChange={(e) => setObjective(e.target.value as typeof objective)}>
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
              <button type="button" className={tier === "free" ? "on" : ""} onClick={() => setTier("free")}>
                Free Quick Scan
              </button>
              <button type="button" className={tier === "full" ? "on" : ""} onClick={() => setTier("full")}>
                Full Report
              </button>
            </div>
            <div className="report-actions">
              <button type="button" className="btn ghost" onClick={doSave}>💾 Save</button>
              <button type="button" className="btn ghost" onClick={() => window.print()}>⬇ Download PDF</button>
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
            onUpgrade={() => setTier("full")}
          />

          {saved.length > 0 && (
            <div className="form-card saved-list">
              <h3>Saved reports</h3>
              <ul>
                {saved.map((r) => (
                  <li key={r.id}>
                    <span>{r.label} <em className="muted">· {new Date(r.savedAt).toLocaleDateString("en-SG")}</em></span>
                    <span className="saved-actions">
                      <button type="button" className="link" onClick={() => loadSnapshot(r.inputs)}>Load</button>
                      <button type="button" className="link danger" onClick={() => setSaved(deleteSaved(r.id))}>Delete</button>
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
            We never calculate on numbers we read until you've checked them. Edit anything above
            that looks wrong, then confirm.
          </p>
          {toVerify.length > 0 && (
            <ul className="verify-list">
              {toVerify.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          )}
          <button type="button" className="btn" onClick={() => setConfirmed(true)}>
            ✓ Confirm &amp; generate report
          </button>
        </div>
      )}
    </main>
  );
}

const round2 = (n: number) => Math.round(n * 100) / 100;
