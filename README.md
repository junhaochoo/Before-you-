# Before You Sign

> Helping consumers understand the real cost, risk, and suitability of a financial product **before** they buy it.

A fintech proposal and prototype plan developed for **FNCE6041 – Financial Analytics and Innovation** (SMU MBA). Originating idea by Ivory Lim; analysis, business model, quantitative engine, and red-team validation in this repo.

## The idea in one line

Consumers see the sales pitch ("safe growth", "7% a year", "suitable for your profile") before they see the consequence. **Before You Sign** decodes the actual product document, quantifies the fees and downside in dollars, and places the decision in the buyer's *personal and portfolio context* — without ever selling anything or telling them what to buy.

## What's in this repository

All project work lives in **[`workspaces/before-you-sign/`](workspaces/before-you-sign/)**. Start with the analysis index:

| Area | Path |
|---|---|
| 📂 **Analysis index (read first)** | [`01-analysis/00-INDEX.md`](workspaces/before-you-sign/01-analysis/00-INDEX.md) |
| 🎯 Pitch assessment vs the brief | `01-analysis/02-pitch-assessment-vs-brief.md` |
| 🧩 Gap register + resolution status | `01-analysis/08-gap-register.md` |
| 📊 Worked quantitative engine (fee-drag, Monte Carlo, BTIR) | `01-analysis/10-worked-analytical-example.md` |
| 💰 Business model + unit economics | `01-analysis/11-unit-economics.md` |
| 🎨 Product / UX design + wireframes | `01-analysis/13-product-design-ux.md` |
| ⚖️ Regulatory & risk treatment | `01-analysis/05-risks-and-constraints.md`, `14-risk-treatment.md` |
| 📐 MVP build specs | [`specs/`](workspaces/before-you-sign/specs/) |
| 🧪 Red-team validation | [`04-validate/`](workspaces/before-you-sign/04-validate/) |
| 📄 Original pitch | [`Ivory's Pitch.pdf`](Ivory's%20Pitch.pdf) |

## Headline finding

On a representative **S$100,000 ILP over 20 years at 6% growth, roughly S$115,000 (≈36%) of the potential value goes to fees** — and the excess cost versus a Buy-Term-and-Invest-the-Rest alternative is on the order of the entire original investment. The product makes that visible before the buyer signs.

## Status

Analysis and validation complete (red-teamed to convergence). MVP build (web app + deterministic finance engine) is the next phase.

---

*Note: the `.claude/` directory contains development tooling and is not part of the project deliverable.*
