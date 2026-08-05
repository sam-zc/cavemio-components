"use client";

import * as React from "react";
import { Check, Vote } from "lucide-react";
import { NumberRoll } from "./number-roll";
import { TextMorph } from "./text-morph";
import {
  EASE_THROW,
  INTERACTION_FOCUS,
  INTERACTION_PRESS,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";

/* ─────────────────────────────────────────────────────────
 * POLL: the bars race to their share
 *
 *   ask       the lit card holds the question and its options as
 *             inset rows; tap one to vote
 *   reveal    every row fills with light to its share, one after
 *             another, while the percentages roll up from zero;
 *             your pick is ringed with a check and the leader's
 *             share is set in full weight
 *   live      as votes come in the bars glide and the numbers roll;
 *             change your vote and both rows move at once
 *   closed    after closesAt the results are final
 *
 * The votes are yours: pass options with their counts and the
 * visitor's vote from your database, and record it in onVote.
 * The bars move on your vote straight away; throw an Error and
 * they go back and say why.
 * ───────────────────────────────────────────────────────── */

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface PollVoter {
  id: string;
  name: string;
  src?: string;
}

export interface PollProps {
  question: string;
  options: PollOption[];
  /** The visitor's vote, if they've voted. */
  vote?: string | null;
  /** Record a vote (or a changed one); throw an Error to say why not. */
  onVote: (optionId: string) => Promise<unknown>;
  /** After this the results are final. */
  closesAt?: Date | string | number;
  /** A few recent voters, shown as faces. */
  voters?: PollVoter[];
  /** Let people change their vote. */
  allowChange?: boolean;
  /** Who's asking, e.g. "Relay community". */
  source?: string;
  locale?: string;
  className?: string;
}

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const HOUR = 3_600_000;
const NO_VOTERS: PollVoter[] = [];
const subscribeNothing = () => () => {};
const useHydrated = () =>
  React.useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );

const mix = (color: string, amount: number, into = "transparent") =>
  `color-mix(in oklab, ${color} ${amount}%, ${into})`;
const LIT: React.CSSProperties = {
  backgroundColor: "var(--primary)",
  backgroundImage: `radial-gradient(120% 80% at 0% 0%, ${mix("var(--primary-foreground)", 22)} 0%, transparent 55%), linear-gradient(175deg, transparent 40%, ${mix("black", 24)} 100%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 36)}, inset 0 0 0 1px ${mix("var(--primary-foreground)", 12)}`,
};
const CARD: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 95, "var(--foreground)")})`,
  boxShadow: `0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 85)}`,
};
const ROW: React.CSSProperties = {
  background: mix("black", 14),
  boxShadow: `inset 0 1px 1px ${mix("black", 12)}, inset 0 0 0 1px ${mix("var(--primary-foreground)", 10)}`,
};

function tint(seed: string): React.CSSProperties {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const chart = `var(--chart-${(h % 5) + 1}, var(--primary))`;
  return {
    background: mix(chart, 20, "var(--card)"),
    color: mix(chart, 75, "var(--foreground)"),
  };
}
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

export function Poll({
  question,
  options,
  vote: voteProp,
  onVote,
  closesAt,
  voters = NO_VOTERS,
  allowChange = true,
  source,
  locale,
  className = "",
}: PollProps) {
  const reduced = useInteractionReducedMotion();
  const hydrated = useHydrated();
  const baseId = React.useId();
  const [now, setNow] = React.useState<number | null>(null);
  // The vote on screen: yours as soon as you tap, until your server agrees (or refuses).
  const [mine, setMine] = React.useState<{
    id: string | null;
    pending: boolean;
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [changing, setChanging] = React.useState(false);
  const [said, setSaid] = React.useState("");

  React.useEffect(() => {
    const tick = () => setNow(Date.now());
    const frame = requestAnimationFrame(tick);
    const timer = window.setInterval(tick, 60_000);
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(timer);
    };
  }, []);

  const server = voteProp ?? null;
  const vote = mine ? mine.id : server;
  const closes = closesAt !== undefined ? new Date(closesAt).getTime() : null;
  const closed = closes !== null && now !== null && now >= closes;
  const showing = vote !== null || closed;
  // The first reveal races the bars in one after another; later changes all move at once.
  const firstReveal = server === null && mine !== null;

  // Counts with your vote moved in straight away, so the bars answer the tap.
  const counts = options.map(
    (o) =>
      o.votes +
      (mine && mine.id !== server
        ? (o.id === mine.id ? 1 : 0) - (o.id === server ? 1 : 0)
        : 0),
  );
  const total = counts.reduce((a, b) => a + b, 0);
  const top = Math.max(...counts);

  const left = closes === null || now === null ? null : closes - now;
  const timeLeft = closed
    ? "Final results"
    : left === null
      ? ""
      : left > 48 * HOUR
        ? `${Math.round(left / (24 * HOUR))} days left`
        : left > HOUR
          ? `${Math.round(left / HOUR)} hours left`
          : "Closing soon";

  const cast = async (id: string) => {
    if (closed || (mine?.pending ?? false)) return;
    if (vote === id && !changing) return;
    setChanging(false);
    setError(null);
    setMine({ id, pending: true });
    try {
      await onVote(id);
      setMine({ id, pending: false });
      setSaid(`Voted for ${options.find((o) => o.id === id)?.label}.`);
    } catch (e) {
      setMine(null);
      setError(
        e instanceof Error && e.message
          ? e.message
          : "Couldn’t record your vote. Try again.",
      );
    }
  };

  // Your vote reached your data: hand the display back to it.
  if (mine && !mine.pending && server === mine.id) setMine(null);

  const fmt = new Intl.NumberFormat(locale ?? (hydrated ? undefined : "en-US"));
  const shown = voters.slice(0, 3);
  const others = Math.max(0, total - shown.length);

  return (
    <section
      aria-labelledby={`${baseId}-q`}
      className={`w-full max-w-[400px] rounded-[28px] p-2 text-card-foreground ${className}`}
      style={CARD}
    >
      {/* Its natural width where the parent sizes to its content, without forcing it on narrow screens. */}
      <div
        aria-hidden="true"
        data-natural-width
        className="grid h-0"
        style={{ gridTemplateColumns: "minmax(0, 400px)" }}
      />
      <div className="@container w-full">
        {/* The one lit surface: the question and its options, which fill to their share. */}
        <div className="rounded-[22px] p-4 text-primary-foreground" style={LIT}>
          <div className="flex items-center justify-between gap-3 text-[12px] text-primary-foreground/70">
            <span className="inline-flex min-w-0 items-center gap-1.5 truncate">
              <Vote aria-hidden="true" className="size-3.5 shrink-0" />
              {source ?? "Poll"}
            </span>
            <span className="shrink-0 tabular-nums">
              <NumberRoll value={total} locales={locale} duration={700} />{" "}
              {total === 1 ? "vote" : "votes"}
              {timeLeft ? ` · ${timeLeft}` : ""}
            </span>
          </div>
          <h2
            id={`${baseId}-q`}
            className="mt-2 text-[17px] font-medium leading-snug tracking-[-0.015em]"
          >
            {question}
          </h2>

          <ul
            className="mt-3 space-y-1.5"
            role={showing ? "list" : "radiogroup"}
            aria-labelledby={`${baseId}-q`}
          >
            {options.map((o, i) => {
              const share = total ? counts[i] / total : 0;
              const pct = Math.round(share * 100);
              const yours = vote === o.id;
              const leads = showing && counts[i] === top && top > 0;
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    role={showing ? undefined : "radio"}
                    aria-checked={showing ? undefined : false}
                    aria-label={
                      showing
                        ? `${o.label}, ${pct}%${yours ? ", your vote" : changing ? ". Change your vote to this" : ""}`
                        : `Vote for ${o.label}`
                    }
                    disabled={
                      closed ||
                      (mine?.pending ?? false) ||
                      (showing && (!changing || yours))
                    }
                    onClick={() => void cast(o.id)}
                    className={`relative flex h-11 w-full cursor-pointer items-center gap-2 overflow-clip rounded-[14px] px-3.5 text-left text-[14px] disabled:cursor-default ${INTERACTION_PRESS} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70 ${!showing || (changing && !yours) ? "hover:brightness-110" : ""}`}
                    style={{
                      ...ROW,
                      boxShadow:
                        yours && showing
                          ? `inset 0 0 0 1.5px var(--primary-foreground)`
                          : ROW.boxShadow,
                      transition: reduced
                        ? "none"
                        : `box-shadow 320ms ${EASE_THROW}`,
                    }}
                  >
                    {/* The share, as light filling the row. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-full origin-left"
                      style={{
                        background: mix(
                          "var(--primary-foreground)",
                          yours ? 34 : 18,
                        ),
                        transform: `scaleX(${showing ? share : 0})`,
                        transition: reduced
                          ? "none"
                          : `transform ${firstReveal ? 900 : 700}ms ${EASE} ${firstReveal ? i * 70 : 0}ms, background-color 300ms`,
                      }}
                    />
                    <span
                      className={`relative min-w-0 flex-1 truncate ${leads ? "font-medium" : ""}`}
                    >
                      {o.label}
                    </span>
                    <span className="relative flex shrink-0 items-center gap-1.5 tabular-nums">
                      <span
                        className="grid"
                        style={{
                          gridTemplateColumns: yours ? "1fr" : "0fr",
                          transition: reduced
                            ? "none"
                            : `grid-template-columns 320ms ${EASE}`,
                        }}
                      >
                        <span className="min-w-0 overflow-hidden">
                          <Check
                            aria-hidden="true"
                            className="size-4"
                            strokeWidth={2.5}
                          />
                        </span>
                      </span>
                      <span
                        className={
                          leads ? "font-medium" : "text-primary-foreground/85"
                        }
                        style={{
                          opacity: showing ? 1 : 0,
                          transition: "opacity 300ms",
                        }}
                      >
                        <NumberRoll value={showing ? pct : 0} duration={900} />%
                      </span>
                      {!showing && (
                        <span
                          aria-hidden="true"
                          className="absolute right-0 size-[18px] rounded-full"
                          style={{
                            boxShadow: `inset 0 0 0 1.5px ${mix("var(--primary-foreground)", 55)}`,
                          }}
                        />
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Flat: who voted, and changing your mind. */}
        <div className="flex min-h-11 items-center justify-between gap-3 px-3 pb-1 pt-2">
          <span className="flex min-w-0 items-center gap-2">
            {shown.length > 0 && (
              <span aria-hidden="true" className="flex shrink-0 -space-x-1.5">
                {shown.map((v) => (
                  <span
                    key={v.id}
                    className="relative flex size-6 items-center justify-center overflow-hidden rounded-full text-[9.5px] font-medium ring-2 ring-card"
                    style={tint(v.name)}
                  >
                    {initials(v.name)}
                    {v.src && (
                      <img
                        src={v.src}
                        alt=""
                        className="absolute inset-0 size-full object-cover"
                      />
                    )}
                  </span>
                ))}
              </span>
            )}
            <span className="truncate text-[12.5px] text-muted-foreground">
              {error ? (
                <span role="alert" className="text-red-600 dark:text-red-400">
                  {error}
                </span>
              ) : shown.length ? (
                `${shown.map((v) => v.name.split(" ")[0]).join(", ")}${others ? ` and ${fmt.format(others)} others` : ""}`
              ) : changing ? (
                "Tap another option to move your vote"
              ) : showing ? (
                "Results update as votes come in"
              ) : (
                "Vote to see the results"
              )}
            </span>
          </span>
          {allowChange && !closed && vote !== null && (
            <button
              type="button"
              onClick={() => setChanging((c) => !c)}
              disabled={mine?.pending ?? false}
              className={`h-8 shrink-0 cursor-pointer rounded-full px-3 text-[12.5px] text-foreground hover:bg-accent ${INTERACTION_PRESS} ${INTERACTION_FOCUS}`}
            >
              <TextMorph>{changing ? "Keep my vote" : "Change vote"}</TextMorph>
            </button>
          )}
        </div>

        <span className="sr-only" role="status">
          {said}
        </span>
      </div>
    </section>
  );
}

export default Poll;
