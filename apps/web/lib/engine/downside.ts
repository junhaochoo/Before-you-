/**
 * Engine 2 — Downside / "What happens if I buy this?" simulation.
 *
 * Spec: specs/analytical-engine.md §Engine 2; 01-analysis/06-analytical-component.md;
 * 01-analysis/10-worked-analytical-example.md §Engine 2.
 *
 * Turns "safe growth" into a distribution of dollar outcomes. Primary model is
 * LOGNORMAL annual returns (not Normal — Normal allows returns below −100% over
 * multi-year compounding). Calibrated so the MEDIAN annual multiplier = (1 + μ),
 * with log-volatility = σ. A Student-t variant is offered for fat tails.
 *
 * Honest caveat (surfaced in-product): these are SCENARIOS from assumed parameters,
 * not forecasts. μ and σ are user-adjustable via sliders.
 *
 * Determinism: the PRNG is explicitly SEEDED so a given seed reproduces identical
 * P5/P50/P95 run-to-run (required for the golden tests and reproducible demos).
 */
import type { ProductInputs } from "./types";

export type ReturnModel = "lognormal" | "student-t";

export interface DownsideParams {
  /** Mean annual return assumption, decimal (e.g. 0.06). */
  mu: number;
  /** Annual volatility, decimal (e.g. 0.15). */
  sigma: number;
  /** Number of Monte Carlo paths. Default 10,000. */
  paths?: number;
  /** Return model. Default "lognormal". */
  model?: ReturnModel;
  /** Degrees of freedom for the Student-t variant. Default 5. */
  tDof?: number;
  /** RNG seed for reproducibility. Default 12345. */
  seed?: number;
}

export interface DownsideResult {
  p5: number;
  p50: number;
  p95: number;
  /** Probability the terminal value is below the principal (nominal loss). */
  probabilityOfLoss: number;
  /** Expected shortfall: mean terminal value of the worst 5% of paths, S$. */
  expectedShortfall: number;
  /** Median of the per-path maximum drawdown, decimal (0.30 = 30%). */
  medianMaxDrawdown: number;
  /** Single-year stress: a one-year shock of stressPct on the principal, S$ (negative). */
  singleYearStressDollar: number;
  paths: number;
  model: ReturnModel;
  /** Compliance label — these are scenarios, not forecasts. */
  framing: "scenarios-not-forecasts";
}

/** mulberry32 — small, fast, deterministic PRNG. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Box-Muller transform — one standard normal from two uniforms. */
function standardNormal(rng: () => number): number {
  let u1 = 0;
  while (u1 === 0) u1 = rng(); // avoid log(0)
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/** Student-t sample via normal / sqrt(chi-square/df), approximated from normals. */
function studentT(rng: () => number, df: number): number {
  const z = standardNormal(rng);
  // chi-square(df) ≈ sum of df squared standard normals.
  let chi = 0;
  for (let i = 0; i < df; i++) {
    const n = standardNormal(rng);
    chi += n * n;
  }
  return z / Math.sqrt(chi / df);
}

function percentile(sorted: number[], q: number): number {
  const idx = (sorted.length - 1) * q;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

/**
 * Simulate net-of-fee terminal value paths and summarise the distribution.
 *
 * Fees are applied consistently with Engine 1: the initial value is net of upfront
 * and spread, each year the sampled gross multiplier is reduced by the annual fee
 * rate, and the fixed admin fee is deducted.
 */
export function computeDownside(p: ProductInputs, params: DownsideParams): DownsideResult {
  const N = params.paths ?? 10_000;
  const model = params.model ?? "lognormal";
  const seed = params.seed ?? 12345;
  const df = params.tDof ?? 5;
  const T = p.horizonYears;
  const rng = mulberry32(seed);

  const feeRate = p.annualManagementFee + p.fundTER + p.insuranceCharge;
  const admin = p.annualAdminFee;
  const v0 = p.principal * (1 - p.upfrontCharge) * (1 - p.bidOfferSpread);

  // Lognormal calibration: median annual multiplier = (1 + μ); log-vol = σ.
  const nu = Math.log(1 + params.mu);
  const sigmaLog = params.sigma;

  const terminals: number[] = new Array(N);
  const maxDrawdowns: number[] = new Array(N);

  for (let i = 0; i < N; i++) {
    let v = v0;
    let peak = v0;
    let maxDD = 0;
    for (let t = 0; t < T; t++) {
      const shock = model === "student-t" ? studentT(rng, df) : standardNormal(rng);
      // Lognormal gross multiplier; for Student-t we scale the same way for fat tails.
      const grossMult = Math.exp(nu + sigmaLog * shock);
      v = v * grossMult * (1 - feeRate) - admin;
      if (v < 0) v = 0;
      if (v > peak) peak = v;
      const dd = peak > 0 ? (peak - v) / peak : 0;
      if (dd > maxDD) maxDD = dd;
    }
    terminals[i] = v;
    maxDrawdowns[i] = maxDD;
  }

  terminals.sort((a, b) => a - b);
  maxDrawdowns.sort((a, b) => a - b);

  const lossCount = terminals.filter((x) => x < p.principal).length;
  const worst5Count = Math.max(1, Math.floor(N * 0.05));
  const worst5 = terminals.slice(0, worst5Count);
  const expectedShortfall = worst5.reduce((s, x) => s + x, 0) / worst5.length;

  // Single-year stress: a 1-in-20-bad-year shock on the principal (default −20%).
  const stressPct = -0.2;
  const singleYearStressDollar = p.principal * stressPct;

  return {
    p5: percentile(terminals, 0.05),
    p50: percentile(terminals, 0.5),
    p95: percentile(terminals, 0.95),
    probabilityOfLoss: lossCount / N,
    expectedShortfall,
    medianMaxDrawdown: percentile(maxDrawdowns, 0.5),
    singleYearStressDollar,
    paths: N,
    model,
    framing: "scenarios-not-forecasts",
  };
}
