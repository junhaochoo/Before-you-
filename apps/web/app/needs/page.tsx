"use client";

import { useMemo, useState } from "react";
import { NEEDS, matchNeeds } from "@/lib/needs";
import { Disclaimer, NoConflictBadge } from "../components/ui";
import { Icon } from "../components/icons";

/**
 * Needs matching — the user picks the goals that matter to them, and the page
 * assembles a tailored checklist of what to LOOK FOR in the document, what often
 * WORKS AGAINST that goal, and the QUESTIONS to ask an adviser. It never names a
 * winner or says a product is suitable (compliance-guardrails.md) — the match is
 * goal → things-to-check, and the judgement stays with the user.
 *
 * All content comes from lib/needs.ts (pure + guardrail-tested). The page only
 * tracks which goals are selected.
 */
export default function NeedsPage() {
  const [selected, setSelected] = useState<string[]>([]);

  const match = useMemo(() => matchNeeds(selected), [selected]);

  function toggle(id: string) {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  }

  return (
    <main className="wide">
      <a href="/" className="back">
        <Icon name="arrow-left" size={16} /> Back
      </a>

      <section className="hero">
        <h1>What do you want this money to do?</h1>
        <p className="lede">
          Pick the goals that matter to you. We&apos;ll turn them into a
          checklist of what to look for and what to ask — before you sign.
        </p>
      </section>

      <header className="report-head">
        <h2>Match my goals</h2>
        <NoConflictBadge />
      </header>
      <Disclaimer />

      {/* Goal selector */}
      <p className="lens-note" style={{ marginTop: "0.4rem" }}>
        Select all that apply. You can change these any time.
      </p>
      <div className="goal-picker" role="group" aria-label="Your goals">
        {NEEDS.map((n) => {
          const on = selected.includes(n.id);
          return (
            <button
              key={n.id}
              type="button"
              className={`goal-chip${on ? " on" : ""}`}
              aria-pressed={on}
              onClick={() => toggle(n.id)}
            >
              <Icon name={on ? "check" : "ask"} size={16} />
              {n.label}
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {match.needs.length === 0 && (
        <p className="muted" style={{ marginTop: "1.5rem" }}>
          Choose one or more goals above to see what to check and what to ask.
        </p>
      )}

      {/* Per-goal guidance */}
      {match.needs.map((n) => (
        <section className="lens" key={n.id}>
          <h3>
            <span aria-hidden>
              <Icon name="fit" size={20} />
            </span>{" "}
            {n.label}
          </h3>
          <p className="lens-note">{n.plain}</p>

          <div className="need-cols">
            <div className="need-col">
              <h4>
                <Icon name="scan" size={15} /> Look for in the document
              </h4>
              <ul className="need-list look">
                {n.lookFor.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="need-col">
              <h4>
                <Icon name="alert" size={15} /> Often works against this
              </h4>
              <ul className="need-list watch">
                {n.worksAgainst.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      {/* Consolidated questions */}
      {match.questions.length > 0 && (
        <section className="lens">
          <h3>
            <span aria-hidden>
              <Icon name="ask" size={20} />
            </span>{" "}
            Questions to ask your adviser
          </h3>
          <p className="lens-note">
            Bring these to any meeting. Clear answers, in writing, are the best
            protection you have.
          </p>
          <ul className="need-list ask">
            {match.questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </section>
      )}

      <p className="muted" style={{ marginTop: "1.25rem" }}>
        This checklist helps you read a product against your own goals. It does
        not say whether any product is right for you — that decision stays with
        you and a licensed adviser.
      </p>
    </main>
  );
}
