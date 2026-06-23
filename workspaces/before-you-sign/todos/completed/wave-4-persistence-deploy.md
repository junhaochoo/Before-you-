# Wave 4 — Persistence, export, freemium gating, deploy

Value-anchor: User goal "deployable to a web server… fully developed frontend"
(`briefs/00`) + "sound, revenue-generating business model" → `04-business-model.md`
(consumer-freemium-first, locked in `.session-notes`). MED rank: productionises an
already-working, already-graded prototype.

Implements: `01-analysis/04-business-model.md`, `01-analysis/11-unit-economics.md`,
`specs/compliance-guardrails.md` §7 (PDPA), `15-feasibility-extraction.md` §"build shape".

Depends on: Waves 1–3. Terminal `/redteam` (the final wave gate) follows this wave.

---

## W4-1 — Accounts + saved-reports persistence (BUILD)

Small DB (SQLite for local/demo or Vercel/Neon Postgres for deploy) + an ORM (Prisma).
Accounts; saved reports. **Encrypt sensitive fields; short-retain raw uploads with a
deletion path** (`compliance-guardrails.md` §7 PDPA; `document-ingestion.md` retention).

- Acceptance: create account → save report → reload → read-back matches (state-persistence
  read-back per testing rules); raw upload auto-deleted per retention; a delete-my-data
  path works.
- Invariants: 3 (read-back integrity, encryption-at-rest, retention/deletion). LOC: ~220.
  Loop: integration tests against real DB.

## W4-2 — PDPA consent + privacy surface (BUILD + WIRE)

Explicit consent gate before any upload/processing; privacy notice; data-residency +
no-training statement for the LLM tier (`15-feasibility-extraction.md` 1b).

- Acceptance: consent required before processing; declining blocks the LLM path cleanly;
  privacy copy present. Guardrail test: no processing without recorded consent.
- Invariants: 2 (consent-gate, no-process-without-consent). LOC: ~100. Loop: guardrail.

## W4-3 — PDF / print export of the report (BUILD + WIRE)

Full report → downloadable PDF + the standalone printable "questions to ask your adviser"
sheet (`03-user-flows/01-core-flow.md` step 6). Disclaimer + no-conflict badge on the
exported artefact.

- Acceptance: report exports to a clean PDF carrying the disclaimer; questions sheet
  prints standalone; numbers match the on-screen report exactly.
- Invariants: 2 (export fidelity, disclaimer-on-export). LOC: ~140. Loop: e2e.

## W4-4 — Freemium tiering + upsell points (BUILD + WIRE)

Gate per the locked model (`.session-notes`: consumer-freemium-first): free Quick Scan
(term flags + guarantee check + questions sheet, no financials) vs paid full report (fee
breakdown, dollar impact, downside, contextual fit). Upsell at natural points
(`03-user-flows` step 6; `04-business-model.md`). Payment can be a stub/checkout
placeholder for the MVP demo.

- Acceptance: free tier reachable with zero financials (lowest-friction path per
  `13-product-design-ux.md` C3); paid surfaces gated behind an upgrade action; the
  no-conflict / no-lead-routing rule honoured (`compliance-guardrails.md` rule 6).
- Invariants: 3 (free/paid gate, low-friction free path, no-commission neutrality).
  LOC: ~160. Loop: e2e.

## W4-5 — Deploy to a web server (BUILD)

Deploy the Next.js app to a public URL (Vercel or a Node host). Env vars (LLM key/model)
configured in the host, not committed. Production build + smoke check.

- Acceptance: live URL serves the full manual + upload flow end-to-end; `.env` values set
  in host config; production `npm run build` clean; a post-deploy smoke walk receipt
  captured (`rules/user-flow-validation.md`).
- Invariants: 2 (env-in-host-not-repo, prod parity with local). LOC: ~config. Loop: smoke.

## W4-6 — Proposal-support docs + README (BUILD)

Project `README.md` (run/deploy instructions) + a short "how the analytics work" doc the
team can lift into the investment-quality deck: the worked-example numbers, the
sensitivity finding (fee drag driven by fee load not return), the model-limitations
section, and the compliance-by-design summary.

- Acceptance: README runs clean from a fresh clone (note the SSH signing-key + `.env`
  setup trap from `.session-notes`); analytics doc maps each engine → a brief grading
  element (#4 financial component, #5 risks/limitations). No code-claims unverified
  (`rules/verify-claims-before-write.md`).
- Invariants: 2 (reproducible-from-clone, claims-verified). LOC: ~docs. Loop: clone walk.

---

## Verification (Wave 4 — COMPLETE 2026-06-23)

Re-ranked at the wave-3→4 gate for assignment value (highest-value items first); full
accounts+DB deliberately scoped down to in-browser save (MVP scope call, G3).

- **W4-2 PDPA consent** — consent gate fronts the document upload; manual entry needs no
  consent; privacy/no-retention/no-conflict copy. `lib/storage.ts::hasConsent/setConsent`.
- **W4-4 Freemium tier** — `ReportView` `tier` prop: Free Quick Scan = Product Scan +
  Decision-Gap questions (no financials, lowest friction per `13-product-design-ux.md` C3);
  Full Report = all five lenses; upgrade CTA unlocks. Verified in prerendered HTML.
- **W4-1/W4-3 Save + PDF** — `lib/storage.ts` localStorage save/list/load/delete;
  Download-PDF + Print via `window.print()` (print CSS hides controls). DB+accounts deferred.
- **W4-6 Docs** — `apps/web/README.md` (run + Vercel deploy guide + env) and
  `docs/ANALYTICS.md` (engine→grading-element map, headline finding, BTIR rationale, model
  limitations, compliance-by-design) for lifting into the deck.
- **W4-5 Deploy-ready** — production `npm run build` clean; Vercel guide written (Root
  Directory = `apps/web`, env vars set in host). ACTUAL DEPLOY = user action (their host +
  keys); cannot deploy into the user's account unattended.
- **Tests/build:** 75/75 green; build clean; `/analyze` + `/` + `/api/extract` all present.

**Status:** All four waves built. Remaining for the user: (a) commit to git, (b) deploy to
Vercel, (c) verify the "45% understood ILP fees" stat (F2) before the final deck.

## Not in MVP scope (deferred, value-anchored — `15-feasibility-extraction.md` G3)

These are bounded out-of-scope, NOT forgotten — each re-validated if a later wave's
gate re-ranks them up:

- **Engine 5 fee backtest** (stretch) — slide-only if the deck needs it; not a code todo
  unless time allows (`analytical-engine.md` §Engine 5).
- **Full Portfolio Mirror covariance/risk-contribution** — ship HHI-only now; covariance
  is v2 (`analytical-engine.md` §Engine 4).
- **Unit trusts / multi-product-type, account aggregation, B2B2C co-branded entry** —
  one product type (ILP) only for MVP (`15-feasibility-extraction.md` G3).
