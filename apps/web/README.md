# Before You Sign — MVP web app

Understand the real cost and consequence of a financial product **before** you sign.
A compliant, no-advice tool that reads an Investment-Linked Policy (ILP), computes the
fee drag, downside, and concentration with a **deterministic finance engine**, and shows
the result as a plain-English report.

> General information only. Not financial advice. Not a recommendation.

## What it does

- **Deterministic finance engine** (`lib/engine/`) — fee drag / total cost of ownership,
  Monte-Carlo downside (P5/P50/P95, probability of loss, expected shortfall), BTIR
  benchmark, concentration & liquidity context, portfolio HHI, sensitivity grid. Pure,
  unit-tested TypeScript — the LLM never computes a number.
- **Report UI** (`app/`) — five lenses, the gross-vs-net chart, live assumption sliders,
  free vs full tier, save & print/PDF.
- **Document ingestion** (`lib/extract/`, `app/api/extract/`) — upload a PDF or paste
  text → **PII redacted before the model** → LLM extracts fields → you confirm → report.
- **Compliance guardrails** (`lib/__tests__/guardrails.test.ts`) — a regression suite that
  blocks any buy/sell/suitability verdict, enforces the disclaimer, the BTIR benchmark,
  and the free-look market-value-adjustment wording.

## Run locally

```bash
cd apps/web
npm install
cp .env.example .env.local      # then fill in keys (see below)
npm run dev                     # http://localhost:3000
```

`npm test` runs the engine + guardrail + redaction suites. `npm run build` produces the
production build.

## Configuration (`.env.local` — never commit)

Document reading uses one LLM call **only to extract text into a schema**. Choose a
provider; the engine math never uses it.

```ini
# Ollama Cloud (OpenAI-compatible) — used in this project
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=https://ollama.com/v1
OLLAMA_API_KEY=...            # rotate after the assignment
OLLAMA_MODEL=gemma3:27b

# OR OpenAI
# LLM_PROVIDER=openai
# OPENAI_API_KEY=...
# LLM_MODEL=gpt-4o-mini
```

If no working key is configured, the app falls back cleanly to **manual entry** — every
report still works.

## Deploy (Vercel — recommended for Next.js)

1. Push this repo to GitHub.
2. In Vercel: **New Project** → import the repo → set **Root Directory** to `apps/web`.
3. Add the env vars above under **Settings → Environment Variables** (do NOT commit them).
4. Deploy. Vercel auto-detects Next.js; no extra config needed.

The app is a standard Next.js App-Router project, so any Node host (`npm run build` then
`npm run start`) works too.

## Project layout

```
apps/web/
  lib/engine/      deterministic finance engine (the graded core) + tests
  lib/extract/     PII redaction + LLM extraction + schema (+ tests)
  lib/copy.ts      single-sourced, compliance-checked user-facing copy
  app/             entry screen, /analyze (interactive report), /api/extract
docs/ANALYTICS.md  how the analytics map to the assignment grading
```
