import { explainerFor } from "@/lib/productEducation";
import type { ProductKind } from "@/lib/classify";
import { Icon } from "./icons";

/**
 * ProductExplainer — leads a result with a plain-English account of WHAT the
 * product is, before any numbers, so a user who knows nothing about financial
 * products understands what they are looking at. Renders nothing for "unknown".
 *
 * Every string comes from lib/productEducation.ts, which is a neutral-fact module
 * (no buy/sell/suitability verdict) asserted by productEducation.test.ts.
 */
export function ProductExplainer({
  kind,
  open = true,
}: {
  kind: ProductKind | null | undefined;
  open?: boolean;
}) {
  const e = explainerFor(kind);
  if (!e) return null;

  return (
    <details className="form-card explainer" open={open}>
      <summary>
        <Icon name="info" size={16} /> What this is — {e.label}
      </summary>

      <p className="explainer-headline">{e.headline}</p>
      <p>{e.whatItIs}</p>

      <h4 className="edu-head">
        <Icon name="fee" size={15} /> What you&apos;re paying for
      </h4>
      <ul className="edu-list">
        {e.payingFor.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      <h4 className="edu-head">
        <Icon name="fit" size={15} /> What it&apos;s designed to give you
      </h4>
      <ul className="edu-list">
        {e.designedToGiveYou.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>

      <h4 className="edu-head">
        <Icon name="alert" size={15} /> Worth checking in the document
      </h4>
      <ul className="edu-list">
        {e.watchFor.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>

      <p className="muted explainer-foot">
        These are neutral facts about how this kind of product works — not a
        view on whether it is right for you.
      </p>
    </details>
  );
}
