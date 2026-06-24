"use client";

import { useState } from "react";
import type { FundExtractionResult } from "@/lib/extract/fundSchema";
import { Icon } from "./icons";

export interface FundExtractionResponse {
  fields: FundExtractionResult;
  anyFound: boolean;
  redactions: number;
  model: string;
  error?: string | null;
  /** Where the charges were read from — factsheet filename or "Pasted fee table". */
  source?: string;
}

/**
 * Fund-factsheet intake (Q2) — upload a PDF factsheet/KIID or paste its fee
 * table. Calls /api/extract with mode="fund", which redacts PII before the LLM
 * and returns the fund name + charges (sales charge, ongoing charge/TER,
 * platform fee). Returns and risk are NOT read — they stay user assumptions on
 * the compare page. Falls back cleanly to manual entry on any failure.
 */
export function FundIntake({
  onExtracted,
}: {
  onExtracted: (r: FundExtractionResponse) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [pasted, setPasted] = useState("");

  async function runFile(file: File) {
    setBusy(true);
    setStatus(
      "Reading the factsheet… any personal details are removed before anything else.",
    );
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("mode", "fund");
      const res = await fetch("/api/extract", { method: "POST", body: fd });
      await handle(res, file.name);
    } catch {
      setStatus("Could not read that file. Try pasting the fee table instead.");
    } finally {
      setBusy(false);
    }
  }

  async function runText() {
    if (!pasted.trim()) return;
    setBusy(true);
    setStatus("Reading the text… any personal details are removed first.");
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pasted, mode: "fund" }),
      });
      await handle(res, "Pasted fee table");
    } catch {
      setStatus(
        "Something went wrong. You can still add the fund manually below.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handle(res: Response, source: string) {
    const data = (await res.json()) as FundExtractionResponse & {
      error?: string;
    };
    if (!res.ok || data.error || !data.anyFound) {
      setStatus(
        data.error === "no_api_key"
          ? "Automatic reading isn't switched on yet — add the fund manually below (everything still works)."
          : "We couldn't read the charges automatically — add the fund manually below (everything still works).",
      );
      return;
    }
    setStatus(
      "Read it — we added a fund card below with the charges we found. Please check them; returns and risk stay your assumptions.",
    );
    onExtracted({ ...data, source });
  }

  return (
    <details className="form-card">
      <summary>Upload a fund factsheet (optional)</summary>
      <p className="muted">
        Upload a factsheet / KIID or paste its fee table. We read the{" "}
        <strong>charges</strong> (sales charge, ongoing charge/TER, platform
        fee) and the fund name — never a projected return. Personal details are
        stripped before the document is read.
      </p>
      <div className="intake">
        <label className="upload-btn">
          <Icon name="file" size={17} /> Choose a PDF
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
            placeholder="Paste the fund's fee / charges text here…"
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
