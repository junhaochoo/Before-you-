"use client";

import { useState } from "react";
import type { ExtractionResult } from "@/lib/extract/schema";

export interface ExtractionResponse {
  fields: ExtractionResult;
  anyFound: boolean;
  redactions: number;
  model: string;
  error?: string | null;
}

/**
 * Document intake (W3-1/W3-6) — upload a PDF or paste the text. Calls /api/extract,
 * which redacts PII before the LLM and returns fields + per-field confidence. The
 * parent then shows the confirm screen; no math runs until the user confirms.
 */
export function DocumentIntake({
  onExtracted,
}: {
  onExtracted: (r: ExtractionResponse) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [pasted, setPasted] = useState("");

  async function runFile(file: File) {
    setBusy(true);
    setStatus(
      "Reading your document… personal details are removed before anything else.",
    );
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/extract", { method: "POST", body: fd });
      await handle(res);
    } catch {
      setStatus("Could not read that file. Try pasting the text instead.");
    } finally {
      setBusy(false);
    }
  }

  async function runText() {
    if (!pasted.trim()) return;
    setBusy(true);
    setStatus(
      "Reading the text… personal details are removed before anything else.",
    );
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pasted }),
      });
      await handle(res);
    } catch {
      setStatus(
        "Something went wrong. You can still enter the details manually below.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handle(res: Response) {
    const data = (await res.json()) as ExtractionResponse & { error?: string };
    // Any failure (no key, quota exhausted, unreadable, no fields found) falls back
    // cleanly to manual entry — the confirm gate only engages on a successful read.
    if (!res.ok || data.error || !data.anyFound) {
      setStatus(
        data.error === "no_api_key"
          ? "Automatic reading isn't switched on yet — please enter the details manually below (everything still works)."
          : "We couldn't read the figures automatically — please enter them manually below (everything still works).",
      );
      return;
    }
    setStatus(
      `Read it. We removed ${data.redactions} piece(s) of personal data first. ` +
        "Please check every field below before we calculate anything.",
    );
    onExtracted(data);
  }

  return (
    <details className="form-card" open>
      <summary>Upload or paste your document (optional)</summary>
      <p className="muted">
        We strip your name, NRIC and policy number <strong>before</strong> the
        document is read. Nothing is calculated until you confirm the figures.
      </p>
      <div className="intake">
        <label className="upload-btn">
          📄 Choose a PDF
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
            placeholder="Paste the fee / benefit-illustration text here…"
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
            Read text
          </button>
        </div>
      </div>
      {status && <p className="intake-status">{status}</p>}
    </details>
  );
}
