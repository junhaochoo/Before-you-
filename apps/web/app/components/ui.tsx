"use client";

import { useState, type ReactNode } from "react";
import { STANDARD_DISCLAIMER, NO_CONFLICT_BADGE } from "@/lib/copy";
import { Icon } from "./icons";

/** The standard disclaimer — single-source, carried on every report. */
export function Disclaimer() {
  return (
    <p className="disclaimer" role="note">
      <Icon name="alert" size={18} />
      <span>{STANDARD_DISCLAIMER}</span>
    </p>
  );
}

export function NoConflictBadge() {
  return (
    <span className="badge">
      <Icon name="check" size={15} />
      {NO_CONFLICT_BADGE}
    </span>
  );
}

/** Large, legible number — the dollar figures are the hero (13-product-design-ux.md). */
export function NumberStat({
  label,
  value,
  sub,
  tone = "ink",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "ink" | "good" | "warn";
}) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className={`stat-value stat-${tone}`}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

/** A report module card. */
export function Lens({
  icon,
  title,
  note,
  children,
}: {
  icon: ReactNode;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section className="lens">
      <h3>
        <span aria-hidden>{icon}</span> {title}
      </h3>
      {note && <p className="lens-note">{note}</p>}
      {children}
    </section>
  );
}

/** Jargon term with tap-to-explain (accessibility: plain language, no jargon un-explained). */
export function TapToExplain({
  term,
  plainEnglish,
}: {
  term: string;
  plainEnglish: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <span className="explain">
      <button
        type="button"
        className="explain-term"
        onClick={() => setOpen((o) => !o)}
      >
        {term} <Icon name="info" size={14} />
      </button>
      {open && <span className="explain-body">{plainEnglish}</span>}
    </span>
  );
}

/** Labelled slider — the honest-assumptions control for return / volatility. */
export function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <label className="slider">
      <span className="slider-label">
        {label}: <strong>{format(value)}</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  step = 1,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <span className="field-input">
        {prefix && <span className="affix">{prefix}</span>}
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {suffix && <span className="affix">{suffix}</span>}
      </span>
    </label>
  );
}
