/**
 * Single-source pricing for the full report (F6 freemium model).
 *
 * The amount is defined ONCE here and read SERVER-SIDE by the checkout route —
 * the client only ever displays priceLabel(). The browser never sends a price;
 * the server sets unit_amount from this constant so the charge can't be tampered
 * with from the client (ui-backend-defense.md: never trust the UI for value).
 */
export const FULL_REPORT_PRICE = {
  /** ISO currency, lowercase as Stripe expects. */
  currency: "sgd",
  /** Smallest currency unit (cents). S$9.00 = 900. */
  amountCents: 900,
  productName: "Before You Sign — Full Report",
  productDescription:
    "Full report: fee breakdown, dollar downside scenarios, your concentration & buffer, the gross-vs-net chart, and the adviser questions.",
} as const;

/** Human display label, e.g. "S$9" or "S$9.50". */
export function priceLabel(): string {
  const dollars = FULL_REPORT_PRICE.amountCents / 100;
  const body = dollars % 1 === 0 ? dollars.toFixed(0) : dollars.toFixed(2);
  return `S$${body}`;
}
