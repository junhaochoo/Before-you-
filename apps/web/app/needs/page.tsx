"use client";

import { useMemo, useState } from "react";
import { NEEDS, matchNeeds, matchFreeText } from "@/lib/needs";
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
  const [text, setText] = useState("");
  // null = not submitted yet; otherwise the ids the last free-text match found.
  const [lastMatch, setLastMatch] = useState<string[] | null>(null);

  const match = useMemo(() => matchNeeds(selected), [selected]);

  function toggle(id: string) {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  }

  /** Deterministic free-text match — adds the recognised goals to the selection. */
  function applyText() {
    const ids = matchFreeText(text);
    setLastMatch(ids);
    if (ids.length > 0) {
      setSelected((s) => Array.from(new Set([...s, ...ids])));
    }
  }

  /** Labels for the goals the last free-text submission recognised. */
  const recognised = (lastMatch ?? [])
    .map((id) => NEEDS.find((n) => n.id === id)?.label)
    .filter((l): l is string => Boolean(l));

  return (
    <main className="wide">
      <a href="/" className="back">
        <Icon name="arrow-left" size={16} /> Back
      </a>

      <section className="hero">
        <h1>What do you want this money to do?</h1>
        <p className="lede">
          Tell us in your own words — or tap a few goals. We&apos;ll turn them
          into a checklist of what to look for and what to ask, before you sign.
        </p>
      </section>

      <header className="report-head">
        <h2>Match my goals</h2>
        <NoConflictBadge />
      </header>
      <Disclaimer />

      {/* Chat-first: describe goals in your own words (deterministic, no AI key needed) */}
      <div className="goal-chat">
        <label className="goal-chat-label" htmlFor="goal-text">
          Tell us in your own words what you want this money to do.
        </label>
        <div className="goal-chat-row">
          <textarea
            id="goal-text"
            className="goal-chat-input"
            rows={2}
            placeholder="e.g. I want steady income in retirement but I can't afford to lose what I put in…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) applyText();
            }}
          />
          <button
            type="button"
            className="btn"
            disabled={!text.trim()}
            onClick={applyText}
          >
            <Icon name="ask" size={17} /> Find what to check
          </button>
        </div>
        {lastMatch !== null &&
          (recognised.length > 0 ? (
            <p className="goal-chat-feedback">
              <Icon name="check" size={15} /> Recognised:{" "}
              <strong>{recognised.join(", ")}</strong>. Added below — fine-tune
              with the suggestions if needed.
            </p>
          ) : (
            <p className="goal-chat-feedback muted">
              We couldn&apos;t pick out a goal from that. Try different words,
              or tap a suggestion below.
            </p>
          ))}
      </div>

      {/* Goal suggestions — tap to add or remove */}
      <p className="lens-note" style={{ marginTop: "0.4rem" }}>
        Or pick from common goals — tap to add or remove. You can change these
        any time.
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
