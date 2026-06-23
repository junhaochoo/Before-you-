/** Display formatting helpers (pure). */

export const sgd = (n: number): string =>
  "S$" + Math.round(n).toLocaleString("en-SG", { maximumFractionDigits: 0 });

export const pct = (n: number, dp = 0): string => (n * 100).toFixed(dp) + "%";

export const months = (n: number): string => n.toFixed(1) + " months";

export const years = (n: number): string => `year ${Math.round(n)}`;
