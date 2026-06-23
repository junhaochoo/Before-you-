/**
 * Tests for the sensitivity grid.
 * 01-analysis/10-worked-analytical-example.md §Sensitivity analysis.
 * Key finding: fee drag is driven by the FEE LOAD, not the return.
 */
import { describe, it, expect } from "vitest";
import { computeSensitivity } from "../sensitivity";

describe("Sensitivity — fee drag across return and fee-load assumptions", () => {
  const grid = computeSensitivity(20);

  it("reproduces the worked-example band (~25–43%)", () => {
    const flat = grid.drag.flat();
    expect(Math.min(...flat)).toBeGreaterThan(0.23);
    expect(Math.max(...flat)).toBeLessThan(0.45);
  });

  it("RIY 1.5% row sits around ~25%", () => {
    // row 0 = RIY 1.5%, col 1 = g 6%
    expect(grid.drag[0][1]).toBeGreaterThan(0.23);
    expect(grid.drag[0][1]).toBeLessThan(0.28);
  });

  it("RIY 2.4% row sits around ~36-37%", () => {
    expect(grid.drag[1][1]).toBeGreaterThan(0.34);
    expect(grid.drag[1][1]).toBeLessThan(0.39);
  });

  it("RIY 3.0% row sits around ~42-44%", () => {
    expect(grid.drag[2][1]).toBeGreaterThan(0.4);
    expect(grid.drag[2][1]).toBeLessThan(0.45);
  });

  it("KEY FINDING: within each RIY row, fee drag is nearly flat across returns", () => {
    for (const row of grid.drag) {
      const spread = Math.max(...row) - Math.min(...row);
      expect(spread).toBeLessThan(0.03); // < 3 percentage points across g 4%→8%
    }
  });

  it("fee drag rises monotonically with the fee load (RIY)", () => {
    for (let col = 0; col < grid.returns.length; col++) {
      expect(grid.drag[0][col]).toBeLessThan(grid.drag[1][col]);
      expect(grid.drag[1][col]).toBeLessThan(grid.drag[2][col]);
    }
  });
});
