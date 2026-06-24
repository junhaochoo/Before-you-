/**
 * POST /api/extract (W3-2 / W3-4 / W3-6).
 *
 * Pipeline (specs/document-ingestion.md, 15-feasibility-extraction.md G1):
 *   1. Get text — from an uploaded PDF (multipart 'file') OR pasted text (JSON 'text').
 *   2. Redact PII deterministically BEFORE the LLM (carry-forward obligation #3).
 *   3. LLM extracts redacted text -> schema (never advises, never guesses a fee).
 *   4. Return fields + per-field confidence. The client shows a confirm screen;
 *      NO finance math runs until the user confirms (obligation #2).
 *
 * Logs only counts/status — never document content, PII, or the API key.
 */
import { NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";
import { redactPII } from "@/lib/extract/redact";
import {
  extractFields,
  extractFundFields,
  classifyProductLLM,
} from "@/lib/extract/llm";
import { classifyProduct, isConfident } from "@/lib/classify";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    let rawText = "";
    let mode = "insurance"; // "insurance" (ILP analyzer) | "fund" (fund factsheet)
    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (typeof form.get("mode") === "string") mode = String(form.get("mode"));
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "no_file" }, { status: 400 });
      }
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdf = await getDocumentProxy(bytes);
      const { text } = await extractText(pdf, { mergePages: true });
      rawText = Array.isArray(text) ? text.join("\n") : text;
    } else {
      const body = await req.json().catch(() => ({}));
      rawText = typeof body.text === "string" ? body.text : "";
      if (typeof body.mode === "string") mode = body.mode;
    }

    if (!rawText.trim()) {
      return NextResponse.json({ error: "empty_document" }, { status: 400 });
    }

    // Step 2 — PII redaction BEFORE the model sees anything.
    const redaction = redactPII(rawText);

    // Step 2b — Auto-detect the product family so the user never has to identify
    // it themselves. Deterministic keyword classifier first (free, instant); the
    // LLM is consulted ONLY when the keywords are ambiguous AND a key is present.
    // Classification is routing, not advice — it picks which neutral explainer to
    // show, never whether the product is good or worth buying.
    if (mode === "auto") {
      let cls = classifyProduct(redaction.redacted);
      let classifier = "keyword";
      if (!isConfident(cls)) {
        const llm = await classifyProductLLM(redaction.redacted);
        if (llm.kind !== "unknown" && !llm.error) {
          cls = { ...cls, kind: llm.kind, confidence: llm.confidence };
          classifier = "llm";
        }
      }

      // Unknown — return the signals only; the client shows BOTH explainers and
      // lets the user pick. No extraction is run (nothing to route to yet).
      if (cls.kind === "unknown") {
        console.info("extract.classify", {
          kind: "unknown",
          classifier,
          chars: rawText.length,
          redactions: redaction.total,
        });
        return NextResponse.json({
          kind: "unknown",
          classification: cls,
          fields: null,
          anyFound: false,
          redactions: redaction.total,
          model: null,
          error: null,
        });
      }

      // Confident — extract with the matching schema and tag the detected kind so
      // the client can route to the right path and show the right explainer.
      const detected =
        cls.kind === "fund"
          ? await extractFundFields(redaction.redacted)
          : await extractFields(redaction.redacted);

      console.info("extract.classify", {
        kind: cls.kind,
        classifier,
        confidence: cls.confidence,
        chars: rawText.length,
        redactions: redaction.total,
        anyFound: detected.anyFound,
        model: detected.model,
        error: detected.error ?? null,
      });

      return NextResponse.json({
        kind: cls.kind,
        classification: cls,
        fields: detected.result,
        anyFound: detected.anyFound,
        redactions: redaction.total,
        model: detected.model,
        error: detected.error ?? null,
      });
    }

    // Step 3 — LLM extraction on the redacted text only. The fund mode extracts
    // only charges + name (never a forward return); insurance mode is the ILP schema.
    const outcome =
      mode === "fund"
        ? await extractFundFields(redaction.redacted)
        : await extractFields(redaction.redacted);

    console.info("extract.ok", {
      mode,
      chars: rawText.length,
      redactions: redaction.total,
      anyFound: outcome.anyFound,
      model: outcome.model,
      error: outcome.error ?? null,
    });

    return NextResponse.json({
      kind: mode === "fund" ? "fund" : "ilp",
      fields: outcome.result,
      anyFound: outcome.anyFound,
      redactions: redaction.total,
      model: outcome.model,
      error: outcome.error ?? null,
    });
  } catch (e) {
    console.error("extract.error", {
      error: e instanceof Error ? e.message : "unknown",
    });
    return NextResponse.json({ error: "extraction_failed" }, { status: 500 });
  }
}
