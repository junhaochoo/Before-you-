/**
 * computeReport — the single typed facade the UI consumes (W1-6).
 *
 * One call takes the confirmed product inputs + personal context + assumptions and
 * returns every number for the five report lenses. The UI never recomputes finance;
 * it renders this object. No figure is ever hardcoded in the UI.
 *
 * Spec: specs/analytical-engine.md, specs/report-modules.md.
 */
import type { ProductInputs, FeeLensResult, BtirResult } from "./types";
import { computeFeeLens, computeBtir } from "./fees";
import { computeDownside, type DownsideParams, type DownsideResult } from "./downside";
import {
  computeRiskFit,
  computePortfolioMirror,
  type PersonalContext,
  type Holding,
  type RiskFitResult,
  type PortfolioMirrorResult,
} from "./context";
import { computeSensitivity, type SensitivityGrid } from "./sensitivity";

export interface ReportInputs {
  product: ProductInputs;
  context: PersonalContext;
  holdings?: Holding[];
  /** BTIR low-cost benchmark TER, decimal. Default 0.0025 (0.25%). */
  btirLowCostTER?: number;
  /** One-off term-premium outlay for BTIR, S$. Default 0. */
  btirTermPremiumUpfront?: number;
  /** Monte Carlo overrides; mu/sigma default to the product's grossReturn / 0.15. */
  downside?: Partial<DownsideParams>;
}

export interface Report {
  feeLens: FeeLensResult;
  btir: BtirResult;
  downside: DownsideResult;
  riskFit: RiskFitResult;
  portfolio: PortfolioMirrorResult;
  sensitivity: SensitivityGrid;
  /** Compliance disclaimer carried on every report (compliance-guardrails.md rule 5). */
  disclaimer: string;
}

export const STANDARD_DISCLAIMER =
  "General information only. Not financial advice. Not a recommendation. " +
  "Consult a licensed financial adviser.";

export function computeReport(inputs: ReportInputs): Report {
  const { product, context } = inputs;

  const feeLens = computeFeeLens(product);

  const btir = computeBtir(
    feeLens.finalNet,
    product.principal,
    product.grossReturn,
    product.horizonYears,
    inputs.btirLowCostTER ?? 0.0025,
    inputs.btirTermPremiumUpfront ?? 0,
  );

  const downside = computeDownside(product, {
    mu: inputs.downside?.mu ?? product.grossReturn,
    sigma: inputs.downside?.sigma ?? 0.15,
    paths: inputs.downside?.paths ?? 10_000,
    model: inputs.downside?.model ?? "lognormal",
    tDof: inputs.downside?.tDof,
    seed: inputs.downside?.seed,
  });

  const lockInEndYear =
    product.surrenderSchedule && product.surrenderSchedule.length > 0
      ? product.surrenderSchedule.length
      : null;

  const riskFit = computeRiskFit(product.principal, context, downside, 0.2, lockInEndYear);

  const portfolio = computePortfolioMirror(inputs.holdings ?? [], product.principal, true);

  const sensitivity = computeSensitivity(product.horizonYears);

  return {
    feeLens,
    btir,
    downside,
    riskFit,
    portfolio,
    sensitivity,
    disclaimer: STANDARD_DISCLAIMER,
  };
}

// Re-exports for consumers (UI, tests).
export * from "./types";
export * from "./fees";
export * from "./downside";
export * from "./context";
export * from "./sensitivity";
