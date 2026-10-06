"use client";

import * as React from "react";
import { Check, Star, X } from "lucide-react";
import { Faces } from "./faces";
import { NumberRoll } from "./number-roll";
import { StatusButton, type ActionStatus } from "./status-button";
import { Textarea } from "./textarea";
import { TextMorph } from "./text-morph";
import {
  EASE_THROW,
  INTERACTION_FOCUS,
  INTERACTION_PRESS,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";

/* ─────────────────────────────────────────────────────────
 * FEEDBACK: the score that changes the question
 *
 *   ask       the lit surface holds the question and a scale
 *             (0–10, or five stars); a light along its top
 *             follows the score you're on
 *   score     the thumb is thrown to your score and the number
 *             rolls into the chip beside the question
 *   follow    the follow-up opens under it and fits the score:
 *             "What went wrong?" for a 3, "What do you love?" for
 *             a 9, each with its own quick tags; change band and
 *             the question and tags swap the way the score moved
 *   thanks    Send goes Sending → Sent, and the follow-up turns
 *             into the thanks with what you said
 *
 * Where it goes is yours: onSubmit gets { score, band, tags,
 * comment } and sends it to your API, a sheet or an analytics
 * tool. Throw an Error and its message shows under the button.
 * ───────────────────────────────────────────────────────── */

export type FeedbackBand = "low" | "mid" | "high";

export interface FeedbackPrompt {
  question: string;
  tags: string[];
}

export interface FeedbackAnswer {
  score: number;
  band: FeedbackBand;
  tags: string[];
  comment: string;
}

export interface FeedbackProps {
  question?: string;
  /** 0–10 (net promoter) or one to five stars. */
  scale?: "nps" | "stars";
  /** Words under each end of the scale. */
  ends?: [string, string];
  /** The follow-up for each band; defaults fit a product. */
  prompts?: Partial<Record<FeedbackBand, FeedbackPrompt>>;
  onSubmit: (answer: FeedbackAnswer) => Promise<unknown>;
  /** Shows a close button. */
  onDismiss?: () => void;
  className?: string;
}

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const PROMPTS: Record<FeedbackBand, FeedbackPrompt> = {
  low: {
    question: "What went wrong?",
    tags: [
      "Too slow",
      "Hard to use",
      "Missing a feature",
      "Bugs",
      "Too expensive",
    ],
  },
  mid: {
    question: "What would make it a 10?",
    tags: ["Faster", "Easier to start", "More integrations", "Better docs"],
  },
  high: {
    question: "What do you love most?",
    tags: ["Speed", "Design", "Support", "Saves me time"],
  },
};
const NPS_ENDS: [string, string] = ["Not likely", "Very likely"];
const STAR_ENDS: [string, string] = ["Poor", "Great"];
const STAR_WORDS = ["Poor", "Fair", "Okay", "Good", "Great"];

const mix = (color: string, amount: number, into = "transparent") =>
  `color-mix(in oklab, ${color} ${amount}%, ${into})`;
const PANEL: React.CSSProperties = {
  backgroundColor: "var(--primary)",
  backgroundImage: `linear-gradient(175deg, transparent 35%, ${mix("black", 26)} 100%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 36)}, inset 0 0 0 1px ${mix("var(--primary-foreground)", 12)}`,
};
const CARD: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 95, "var(--foreground)")})`,
  boxShadow: `0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 85)}`,
};
const LIT: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${mix("var(--primary-foreground)", 16)}, transparent 60%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 32)}, inset 0 0 0 1px ${mix("black", 10)}`,
};
const TRACK: React.CSSProperties = {
  background: mix("black", 16),
  boxShadow: `inset 0 1px 1px ${mix("black", 16)}, inset 0 0 0 1px ${mix("var(--primary-foreground)", 10)}`,
};

const bandOf = (scale: "nps" | "stars", s: number): FeedbackBand =>
  scale === "nps"
    ? s <= 6
      ? "low"
      : s <= 8
        ? "mid"
        : "high"
    : s <= 2
      ? "low"
      : s === 3
        ? "mid"
        : "high";
const RANK: Record<FeedbackBand, number> = { low: 0, mid: 1, high: 2 };

export function Feedback({
  question = "How likely are you to recommend us to a friend?",
  scale = "nps",
  ends,
  prompts,
  onSubmit,
  onDismiss,
  className = "",
}: FeedbackProps) {
  const reduced = useInteractionReducedMotion();
  const baseId = React.useId();
  const [score, setScore] = React.useState<number | null>(null);
  const [hover, setHover] = React.useState<number | null>(null);
  const [tags, setTags] = React.useState<string[]>([]);
  const [comment, setComment] = React.useState("");
  const [status, setStatus] = React.useState<ActionStatus>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [sent, setSent] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const tagsRef = React.useRef<HTMLDivElement>(null);
  const scaleRef = React.useRef<HTMLDivElement>(null);
  const followRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const nps = scale === "nps";
  const values = nps
    ? Array.from({ length: 11 }, (_, i) => i)
    : [1, 2, 3, 4, 5];
  const [lo, hi] = ends ?? (nps ? NPS_ENDS : STAR_ENDS);
  const band = score === null ? null : bandOf(scale, score);
  const prompt = band
    ? {
        ...PROMPTS[band],
        ...(band === "mid" && !nps
          ? { question: "What would make it better?" }
          : {}),
        ...prompts?.[band],
      }
    : null;
  const shown = hover ?? score;
  const idx = shown === null ? -1 : values.indexOf(shown);
  const busy = status === "pending" || status === "success";

  // A new band brings its own question and tags in from the side the score moved.
  const lastBand = React.useRef<FeedbackBand | null>(null);
  React.useLayoutEffect(() => {
    const was = lastBand.current;
    lastBand.current = band;
    if (!band || !was || was === band || reduced) return;
    const dir = RANK[band] > RANK[was] ? 1 : -1;
    tagsRef.current
      ?.querySelectorAll<HTMLElement>("[data-tag], [data-prompt]")
      .forEach((el, i) =>
        el.animate(
          [
            {
              opacity: 0,
              transform: `translateX(${dir * 14}px)`,
              filter: "blur(4px)",
            },
            { opacity: 1, transform: "none", filter: "blur(0px)" },
          ],
          { duration: 380, delay: i * 35, easing: EASE, fill: "backwards" },
        ),
      );
  }, [band, reduced]);

  const pick = (s: number) => {
    if (busy || sent) return;
    if (score === null)
      window.setTimeout(
        () =>
          followRef.current?.scrollIntoView({
            block: "nearest",
            behavior: reduced ? "auto" : "smooth",
          }),
        420,
      );
    if (score !== null && bandOf(scale, s) !== band) setTags([]);
    setScore(s);
    setError(null);
    if (status === "error") setStatus("idle");
  };

  const submit = async () => {
    if (score === null || !band || busy) return;
    setStatus("pending");
    setError(null);
    try {
      await onSubmit({ score, band, tags, comment: comment.trim() });
      setStatus("success");
      window.setTimeout(() => setSent(true), reduced ? 300 : 650);
    } catch (e) {
      setStatus("error");
      setError(
        e instanceof Error && e.message
          ? e.message
          : "Couldn’t send that. Try again.",
      );
    }
  };

  const onScaleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const i = Math.max(0, score === null ? -1 : values.indexOf(score));
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowUp")
      next = Math.min(values.length - 1, score === null ? 0 : i + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown")
      next = Math.max(0, score === null ? 0 : i - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = values.length - 1;
    else if (/^[0-9]$/.test(e.key) && values.includes(Number(e.key)))
      next = values.indexOf(Number(e.key));
    if (next < 0) return;
    e.preventDefault();
    pick(values[next]);
    scaleRef.current
      ?.querySelector<HTMLElement>(`[data-value="${values[next]}"]`)
      ?.focus();
  };

  // The light along the panel's top sits over the score you're on.
  const glow = idx < 0 ? 0.5 : (idx + 0.5) / values.length;

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
        {/* The one lit surface: the question and its scale. */}
        <div
          className="relative overflow-clip rounded-[22px] p-4 text-primary-foreground"
          style={PANEL}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              transform: `translateX(${(glow - 0.5) * 100}%)`,
              transition: reduced ? "none" : `transform 620ms ${EASE}`,
            }}
          >
            <span
              className="absolute inset-x-[-30%] -top-1/2 h-full"
              style={{
                background: `radial-gradient(50% 60% at 50% 50%, ${mix("var(--primary-foreground)", score === null ? 18 : 30)}, transparent 70%)`,
                transition: "background 400ms",
              }}
            />
          </span>

          <div className="relative flex items-start gap-3">
            <h2
              id={`${baseId}-q`}
              className="min-w-0 flex-1 pt-0.5 text-[15px] font-medium leading-snug tracking-[-0.01em]"
            >
              {question}
            </h2>
            <span
              aria-hidden="true"
              className="flex h-12 min-w-12 shrink-0 items-center justify-center rounded-[14px] px-2 text-[26px] font-medium leading-none tracking-[-0.04em] tabular-nums"
              style={TRACK}
            >
              {shown === null ? (
                <span className="text-primary-foreground/40">?</span>
              ) : (
                <NumberRoll value={shown} duration={700} />
              )}
            </span>
            {onDismiss && (
              <button
                type="button"
                aria-label="Close"
                onClick={onDismiss}
                className={`-mr-1.5 -mt-1 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground ${INTERACTION_PRESS}`}
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            )}
          </div>

          <div
            ref={scaleRef}
            role="radiogroup"
            aria-labelledby={`${baseId}-q`}
            onKeyDown={onScaleKey}
            onPointerLeave={() => setHover(null)}
            className={`relative mt-3.5 grid rounded-full p-1 ${nps ? "h-10" : "h-11"}`}
            style={{
              ...TRACK,
              gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))`,
            }}
          >
            {nps && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-1 left-1 top-1 rounded-full"
                style={{
                  width: `calc((100% - 8px) / ${values.length})`,
                  background: "var(--primary-foreground)",
                  boxShadow: `0 1px 0 ${mix("black", 14)}`,
                  opacity:
                    idx < 0 ? 0 : hover !== null && hover !== score ? 0.55 : 1,
                  transform: `translateX(${Math.max(0, idx) * 100}%)`,
                  transition:
                    reduced || !ready
                      ? "opacity 160ms"
                      : `transform 460ms ${EASE_THROW}, opacity 200ms`,
                }}
              />
            )}
            {values.map((v, i) => {
              const on = v === score;
              const filled = !nps && shown !== null && v <= shown;
              return (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  data-value={v}
                  aria-checked={on}
                  aria-label={
                    nps
                      ? String(v)
                      : `${v} ${v === 1 ? "star" : "stars"}, ${STAR_WORDS[v - 1]}`
                  }
                  tabIndex={on || (score === null && i === 0) ? 0 : -1}
                  disabled={sent}
                  onClick={() => pick(v)}
                  onPointerMove={(e) =>
                    e.pointerType === "mouse" && hover !== v && setHover(v)
                  }
                  className={`relative z-10 flex cursor-pointer items-center justify-center rounded-full text-[13px] font-medium tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70 disabled:cursor-default ${INTERACTION_PRESS}`}
                  style={{
                    color:
                      nps && (hover ?? score) === v
                        ? "var(--primary)"
                        : undefined,
                    transition: "color 200ms",
                  }}
                >
                  {nps ? (
                    <span
                      className={
                        on || hover === v ? "" : "text-primary-foreground/80"
                      }
                    >
                      {v}
                    </span>
                  ) : (
                    <Star
                      aria-hidden="true"
                      className="size-[22px]"
                      strokeWidth={1.6}
                      style={{
                        fill: filled
                          ? "var(--primary-foreground)"
                          : "transparent",
                        color: filled
                          ? "var(--primary-foreground)"
                          : mix("var(--primary-foreground)", 55),
                        transform: filled && !reduced ? "scale(1.08)" : "none",
                        transition: reduced
                          ? "none"
                          : `fill 220ms ${EASE} ${i * 40}ms, color 220ms ${EASE} ${i * 40}ms, transform 360ms ${EASE_THROW} ${i * 40}ms`,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <div className="relative mt-1.5 flex justify-between px-1 text-[11.5px] text-primary-foreground/65">
            <span>{lo}</span>
            {!nps && shown !== null && (
              <span className="text-primary-foreground/90">
                <TextMorph>{STAR_WORDS[shown - 1]}</TextMorph>
              </span>
            )}
            <span>{hi}</span>
          </div>
        </div>

        {/* Flat: the follow-up that fits the score, then the thanks. */}
        <div
          className="grid"
          style={{
            gridTemplateRows: score === null ? "0fr" : "1fr",
            opacity: score === null ? 0 : 1,
            transition: reduced
              ? "opacity 160ms"
              : `grid-template-rows 460ms ${EASE}, opacity 320ms ${EASE} 80ms`,
          }}
        >
          <div
            ref={followRef}
            className="min-h-0 overflow-clip"
            inert={score === null || undefined}
          >
            <Faces active={sent ? 1 : 0} reduced={reduced} ready={ready}>
              <form
                className="px-2 pb-1 pt-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  void submit();
                }}
              >
                <div ref={tagsRef}>
                  <p
                    data-prompt
                    className="px-1 text-[14px] font-medium tracking-[-0.01em]"
                  >
                    {prompt?.question}
                  </p>
                  <div
                    role="group"
                    aria-label={prompt?.question}
                    className="mt-2 flex flex-wrap gap-1.5"
                  >
                    {prompt?.tags.map((t) => {
                      const on = tags.includes(t);
                      return (
                        <button
                          key={`${band}-${t}`}
                          data-tag
                          type="button"
                          aria-pressed={on}
                          disabled={busy}
                          onClick={() =>
                            setTags((list) =>
                              on ? list.filter((x) => x !== t) : [...list, t],
                            )
                          }
                          className={`inline-flex h-8 cursor-pointer items-center rounded-full px-3 text-[12.5px] disabled:cursor-default ${INTERACTION_PRESS} ${INTERACTION_FOCUS} ${
                            on
                              ? "bg-primary/[0.08] font-medium text-primary shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_40%,transparent)]"
                              : "text-foreground shadow-[inset_0_0_0_1px_var(--border)] hover:bg-accent"
                          }`}
                        >
                          <span
                            className="grid"
                            style={{
                              gridTemplateColumns: on ? "1fr" : "0fr",
                              transition: reduced
                                ? "none"
                                : `grid-template-columns 300ms ${EASE}`,
                            }}
                          >
                            <span className="min-w-0 overflow-hidden">
                              <Check
                                aria-hidden="true"
                                className="mr-1 size-3.5"
                                strokeWidth={2.5}
                              />
                            </span>
                          </span>
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <Textarea
                  aria-label="Anything else?"
                  value={comment}
                  onValueChange={setComment}
                  disabled={busy}
                  placeholder="Anything else? (optional)"
                  minRows={2}
                  maxRows={5}
                  maxLength={1000}
                  showCount={false}
                  className="mt-2.5"
                />
                <StatusButton
                  type="submit"
                  status={status}
                  labels={{
                    idle: "Send feedback",
                    pending: "Sending",
                    success: "Sent",
                    error: "Try again",
                  }}
                  className="mt-2.5 h-11 w-full text-[14.5px]"
                  style={status === "error" ? undefined : LIT}
                />
                {error && (
                  <p
                    role="alert"
                    className="mt-1.5 text-center text-[12px] text-red-600 dark:text-red-400"
                  >
                    {error}
                  </p>
                )}
              </form>

              <div
                className="flex items-start gap-3 px-3 pb-2 pt-4"
                role="status"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="size-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.5 8.5 6.5 11.5 12.5 4.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      pathLength={1}
                      strokeDasharray={1}
                      style={{
                        strokeDashoffset: sent ? 0 : 1,
                        transition:
                          sent && !reduced
                            ? `stroke-dashoffset 460ms ${EASE} 240ms`
                            : "none",
                      }}
                    />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-[14.5px] font-medium tracking-[-0.01em]">
                    {sent ? "Thanks, that helps." : ""}
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                    {sent && score !== null
                      ? `You gave ${nps ? score : `${score} of 5`}${tags.length ? ` · ${tags.join(", ")}` : ""}`
                      : ""}
                  </p>
                </div>
              </div>
            </Faces>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Feedback;
