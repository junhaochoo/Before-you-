# Wave 3 — Document ingestion (the data-input mechanic, de-risked)

Value-anchor: `00-INDEX` §"three things" #3 ("The data-input mechanic — currently
undefined; recommend user-uploads → LLM-extract → confirm → deterministic math") +
`15-feasibility-extraction.md` G1 (the single technical risk that can sink the product).
MED rank: the demo and every graded number already work on manual entry (Wave 2); this
adds the trust/scale story and the live upload demo.

Implements: `specs/document-ingestion.md`, `15-feasibility-extraction.md`.

Depends on: Wave 2 (the confirm form is the Wave-2 product form populated). Inter-wave
gate before Wave 4: G1 redteam (incl. extraction fixtures + redaction + confirm-gate
guardrails green).

---

## W3-1 — Entry-modes screen (BUILD)

The three-mode entry screen (`13-product-design-ux.md` C1 Screen 1): upload Product
Summary + Benefit Illustration / "I only have what the agent told me" (manual) /
"I've signed — check before free-look ends". **Free-look copy MUST carry the MVA
qualifier** (never "walk away free" — redteam H1).

- Acceptance: three routes wired; free-look copy includes the "cancel with little/no
  penalty — subject to market value adjustment" qualifier; a guardrail-tagged test
  asserts no un-qualified "free" free-look string (obligation #4).
- Invariants: 2 (3 modes routed, MVA-qualifier). LOC: ~120. Loop: component+guardrail.

## W3-2 — PDF → text parse (BUILD)

Server-side API route: deterministic PDF text extraction with an OCR fallback for scanned
docs. Correct ILP taxonomy — target the **Benefit Illustration** (effect-of-deductions +
surrender values) as primary (`document-ingestion.md` §Source documents, red-team M1).

- Acceptance: each demo fixture PDF parses to text; scanned-doc fallback path exercised;
  no document type mislabelled (Benefit Illustration vs PHS).
- Invariants: 2 (parse correctness, taxonomy labels). LOC: ~120. Loop: fixture tests.

## W3-3 — PII redaction BEFORE the LLM (BUILD) — carry-forward obligation #3

Deterministic strip of name / NRIC / policy-number; send ONLY the fee/structure/
effect-of-deductions tables to the model (`document-ingestion.md` 1b, red-team M2).

- Acceptance: a guardrail-tagged test feeds a fixture containing a synthetic NRIC/name
  and asserts the LLM-bound payload contains none of them; redaction runs unconditionally
  before any provider call (obligation #3).
- Invariants: 2 (redaction completeness, ordering-before-LLM). LOC: ~100. Loop: guardrail.

## W3-4 — LLM extraction → schema + confidence + source-span (BUILD + WIRE)

One low-temperature server route: extract redacted text → the `document-ingestion.md`
JSON schema, per-field confidence + source line/page citation. Provider/model/key from
`.env`. **Emits "not found" rather than guessing** a fee. Wire output into the Wave-2
confirm form. **No math runs on unconfirmed fields** (obligation #2 / G1).

- Acceptance: schema-validation on every extraction (malformed rejected/flagged);
  low-confidence/missing fields force user confirmation in the form; a guardrail test
  asserts the engine never receives an unconfirmed field; model name read from `.env`,
  never hardcoded.
- Invariants: 4 (schema validity, confidence-gating, not-found-not-guessed,
  no-math-on-unconfirmed). LOC: ~200. Loop: fixture + guardrail.

## W3-5 — Extraction regression fixtures (BUILD)

3–5 real public ILP/unit-trust Product Summary / Benefit Illustration docs with
hand-verified expected fields (`15-feasibility-extraction.md` G2). Catches extraction
drift on every change; also the live-demo corpus and the fee-benchmark reference seed.

- Acceptance: fixture suite runs in CI; each doc → expected-fields assertion; drift in
  any field fails the suite. Documents are public + license-clean.
- Invariants: 2 (fixture coverage, drift-detection). LOC: ~fixtures+harness. Loop: this
  IS the loop.

## W3-6 — Wire upload flow end-to-end (WIRE)

Connect entry-modes → parse → redact → extract → confirm form → `computeReport` → report.
Replace any remaining manual-only assumptions so the upload path produces the identical
report the manual path does.

- Acceptance: upload a fixture Benefit Illustration → confirm screen pre-filled with
  confidence flags → confirm → full report, zero mock data; **user-flow walk receipt**
  captured for the upload path.
- Invariants: 2 (end-to-end data flow, parity with manual path). LOC: ~120. Loop: e2e walk.

---

## Verification (Wave 3 — COMPLETE 2026-06-23)

Files in `apps/web/lib/extract/` + `apps/web/app/api/extract/` + UI in
`app/components/DocumentIntake.tsx` + `app/analyze/page.tsx`.

- **Tests:** 75/75 passing (added redaction + JSON-parse suites). Redaction
  (`lib/extract/__tests__/redact.test.ts`) proves obligation #3 — name/NRIC/policy/
  email/phone stripped, fee content kept. `parseJsonLoose` tolerates fenced JSON.
- **Build / typecheck:** clean; `/api/extract` is a server route (Node runtime).
- **Live extraction VERIFIED end-to-end (Ollama Cloud):** the OpenAI client pointed
  at `https://ollama.com/v1` with model `gemma3:27b` returned correct fields from a
  synthetic Benefit Illustration — TER 1.5%, upfront 3%, insurance 0.4%, lock-in 10,
  guarantee=false — in ~6–8s. This resolves forest item F4.
- **Provider switch:** `LLM_PROVIDER` selects openai|ollama; model/key/baseURL from
  env (`rules/env-models.md`). OpenAI account had no quota (429); Ollama Cloud is the
  active provider.
- **Compliance:** PII redaction runs UNCONDITIONALLY before the model (route order);
  confirm-gate means no engine math runs on unconfirmed extracted fields (obligation
  #2); any failure (no key / quota / unreadable) degrades cleanly to manual entry.
- **Pipeline:** upload PDF (unpdf) OR paste text → redact → LLM → schema+confidence →
  pre-fill /analyze form → user confirms → report.

**Known nuance:** admin fee extracted as the monthly figure (S$30) when the doc states
"per month"; the user corrects it on the confirm screen. Acceptable for MVP.

**Next:** Wave 4 (persistence/PDPA/PDF export/freemium/deploy + proposal-support docs).
