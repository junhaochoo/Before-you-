/**
 * Saved-reports persistence (W4-1, MVP scope). Stores report input snapshots in the
 * browser's localStorage — no account or server DB needed for the prototype demo.
 * (A real multi-device DB + accounts is the productionising step, deferred.)
 *
 * SSR-safe: every accessor guards `typeof window`.
 */
export interface SavedReport {
  id: string;
  savedAt: string;
  label: string;
  /** Opaque input snapshot the analyzer restores on load. */
  inputs: Record<string, unknown>;
}

const KEY = "bys.savedReports.v1";
const CONSENT_KEY = "bys.pdpaConsent.v1";
const HANDOFF_KEY = "bys.intakeHandoff.v1";

/**
 * Upload-first handoff — the home page detects the product type and extracts the
 * fields, then routes to /analyze (ILP) or /compare (fund). This carries the
 * detected kind + extracted fields across that navigation. sessionStorage (not
 * localStorage) so it is scoped to the tab and cleared on read — a refresh never
 * re-applies a stale extraction.
 */
export interface IntakeHandoff {
  kind: "ilp" | "fund";
  /** The matching extraction result (ILP schema or fund schema), or null. */
  fields: unknown;
  /** True when real fields were read (vs routed on classification only). */
  detected: boolean;
}

export function setIntakeHandoff(h: IntakeHandoff): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(h));
  } catch {
    /* storage full / unavailable — the destination page just shows manual entry */
  }
}

/** Read and CLEAR the handoff (one-shot, so a refresh doesn't re-apply it). */
export function takeIntakeHandoff(): IntakeHandoff | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(HANDOFF_KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(HANDOFF_KEY);
    const h = JSON.parse(raw) as IntakeHandoff;
    return h.kind === "ilp" || h.kind === "fund" ? h : null;
  } catch {
    return null;
  }
}

export function listSaved(): SavedReport[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as SavedReport[];
  } catch {
    return [];
  }
}

export function saveReport(label: string, inputs: Record<string, unknown>): SavedReport[] {
  if (typeof window === "undefined") return [];
  const all = listSaved();
  const entry: SavedReport = {
    id: `r_${Date.now()}`,
    savedAt: new Date().toISOString(),
    label: label.trim() || "Untitled product",
    inputs,
  };
  const next = [entry, ...all].slice(0, 20);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function deleteSaved(id: string): SavedReport[] {
  if (typeof window === "undefined") return [];
  const next = listSaved().filter((r) => r.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CONSENT_KEY) === "yes";
}

export function setConsent(v: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, v ? "yes" : "no");
}
