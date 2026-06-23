/**
 * Sensitivity analysis — fee drag across return and fee-load assumptions.
 *
 * Spec: 01-analysis/10-worked-analytical-example.md §Sensitivity analysis.
 *
 * Key analytical finding (and a strong, defensible grading point): fee drag is
 * driven by the FEE LOAD, not the return. It stays ~25–43% across return
 * assumptions, which rebuts "but markets might do better" — higher returns compound
 * the fee base too.
 *
 * Simplified model for the grid: fee drag is expressed via the reduction-in-yield
 * (RIY) — the total annual fee load — independent of the upfront charge:
 *   drag(g, RIY) = 1 − ((1 + g − RIY) / (1 + g))^T
 */

export interface SensitivityGrid {
  /** Gross-return assumptions used as columns (decimals). */
  returns: number[];
  /** RIY (fee-load) assumptions used as rows (decimals). */
  riys: number[];
  /** drag[rowIndex][colIndex] = fee drag as a decimal. */
  drag: number[][];
  /** Horizon used. */
  horizonYears: number;
}

export function feeDragFromRiy(grossReturn: number, riy: number, horizonYears: number): number {
  const net = Math.pow((1 + grossReturn - riy) / (1 + grossReturn), horizonYears);
  return 1 - net;
}

/**
 * Build the sensitivity grid. Defaults reproduce the worked-example table
 * (g ∈ {4%, 6%, 8%} × RIY ∈ {1.5%, 2.4%, 3.0%}, T = 20).
 */
export function computeSensitivity(
  horizonYears = 20,
  returns: number[] = [0.04, 0.06, 0.08],
  riys: number[] = [0.015, 0.024, 0.03],
): SensitivityGrid {
  const drag = riys.map((riy) => returns.map((g) => feeDragFromRiy(g, riy, horizonYears)));
  return { returns, riys, drag, horizonYears };
}
