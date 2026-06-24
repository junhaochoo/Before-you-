"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  hasConsent,
  setConsent,
  setIntakeHandoff,
  type IntakeHandoff,
} from "@/lib/storage";
import type { Classification, ProductKind } from "@/lib/classify";
import { PRODUCT_EXPLAINERS } from "@/lib/productEducation";
import { Icon } from "./icons";

interface AutoResponse {
  kind: ProductKind;
  classification?: Classification;
  fields: unknown;
  anyFound: boolean;
  redactions: number;
  error?: string | null;
}

const DEST: Record<"ilp" | "fund", string> = {
  ilp: "/analyze",
  fund: "/compare",
};

/**
 * StartIntake (upload-first entry) — a SINGLE place to begin. The user uploads or
 * pastes their document and we work out what it is; they never pick a product
 * type first. On a confident detection we route straight to the matching tool
 * with the figures pre-filled and a plain-English explainer on top. When we're
 * not sure, we show what each product is and let the user choose.
 *
 * PII is stripped server-side BEFORE anything is read (/api/extract). Nothing is
 * calculated until the user confirms on the next screen.
 */
export function StartIntake() {
  const router = useRouter();
  const [consent, setConsentState] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [pasted, setPasted] = useState("");
  const [unsure, setUnsure] = useState<Classification | null>(null);

  useEffect(() => {
    setConsentState(hasConsent());
  }, []);

  /** Route to the matching tool, carrying the detected kind + extracted fields. */
  function go(kind: "ilp" | "fund", fields: unknown, detected: boolean) {
    const handoff: IntakeHandoff = { kind, fields, detected };
    setIntakeHandoff(handoff);
    router.push(DEST[kind]);
  }

  async function send(init: RequestInit) {
    setBusy(true);
    setUnsure(null);
    setStatus(
      "Reading your document… personal details are removed before anything else.",
    );
    try {
      const res = await fetch("/api/extract", init);
      const data = (await res.json()) as AutoResponse;

      if (data.kind === "ilp" || data.kind === "fund") {
        setStatus(
          data.anyFound
            ? "Read it — taking you to your report…"
            : "We worked out what this is — taking you there…",
        );
        go(data.kind, data.fields, Boolean(data.anyFound));
        return;
      }

      // Unknown — show both explainers and let the user pick.
      setStatus(null);
      setUnsure(
        data.classification ?? {
          kind: "unknown",
          confidence: "low",
          ilpSignals: [],
          fundSignals: [],
        },
      );
    } catch {
      setStatus(
        "Something went wrong reading that. You can pick your product type below instead.",
      );
      setUnsure({
        kind: "unknown",
        confidence: "low",
        ilpSignals: [],
        fundSignals: [],
      });
    } finally {
      setBusy(false);
    }
  }

  function runFile(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("mode", "auto");
    void send({ method: "POST", body: fd });
  }

  function runText() {
    if (!pasted.trim()) return;
    void send({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: pasted, mode: "auto" }),
    });
  }

  if (!consent) {
    return (
      <div className="form-card consent-card start-card">
        <h3>Before you upload — your privacy</h3>
        <p className="muted">
          We remove your name, NRIC and policy number <strong>before</strong>{" "}
          any document is read, and we don&apos;t keep your uploads. We never
          sell your data or earn from your decision.
        </p>
        <label className="consent-check">
          <input
            type="checkbox"
            onChange={(e) => {
              setConsent(e.target.checked);
              setConsentState(e.target.checked);
            }}
          />
          I understand and consent to my document being processed this way
          (PDPA).
        </label>
      </div>
    );
  }

  return (
    <div className="form-card start-card">
      <div className="intake">
        <label className="upload-btn">
          <Icon name="scan" size={18} /> Upload your document
          <input
            type="file"
            accept="application/pdf"
            disabled={busy}
            onChange={(e) => e.target.files?.[0] && runFile(e.target.files[0])}
          />
        </label>
        <span className="muted">or</span>
        <div className="paste">
          <textarea
            placeholder="Paste the text from your benefit illustration or fund factsheet here…"
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            rows={3}
          />
          <button
            type="button"
            className="btn"
            disabled={busy || !pasted.trim()}
            onClick={runText}
          >
            Read it
          </button>
        </div>
      </div>

      {status && <p className="intake-status">{status}</p>}

      {unsure && (
        <div className="detect-choice">
          <h3>We couldn&apos;t tell for sure — which sounds like yours?</h3>
          <p className="muted">
            Here&apos;s what each one is. Pick the one that matches your
            document.
          </p>
          <div className="detect-options">
            {PRODUCT_EXPLAINERS.map((e) => (
              <button
                key={e.kind}
                type="button"
                className="detect-option"
                onClick={() => go(e.kind, null, false)}
              >
                <span className="detect-option-title">{e.label}</span>
                <span className="detect-option-sub">{e.whatItIs}</span>
                <span className="detect-option-go">
                  This is mine <Icon name="arrow-right" size={15} />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
