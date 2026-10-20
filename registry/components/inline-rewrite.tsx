"use client";

import * as React from "react";
import { NumberRoll } from "./number-roll";
import { TextMorph } from "./text-morph";

/* ─────────────────────────────────────────────────────────
 * INLINE REWRITE: drag a dial, the paragraph rewrites itself
 *
 *   dial      one thumb on a track of versions (Shorter, Original,
 *             Longer; or Blunt, Neutral, Warm). Drag it, tap the
 *             track or use the arrow keys; its label morphs and
 *             it settles onto the nearest stop with a little throw
 *   rewrite   the paragraph changes in place, word by word: the
 *             words both versions share glide to their new places,
 *             the ones that go blur out where they stood, the new
 *             ones rise in one after another and glow for a moment
 *             so you can see what changed. The box eases to its
 *             new height
 *   on demand versions without text are written the first time the
 *             dial settles on them (onRewrite): a spinner opens in
 *             the thumb and a sheen runs over the paragraph until
 *             the new words arrive
 *   count     the word count rolls; +added and −cut against the
 *             original roll beside it
 * ───────────────────────────────────────────────────────── */

export interface RewriteVersion {
  label: string;
  /** Leave it out to have onRewrite write it the first time it's chosen. */
  text?: string;
}

export interface RewriteRequest {
  index: number;
  label: string;
  /** The paragraph as it reads now, and the original version. */
  current: string;
  original: string;
  /** Aborted if the component unmounts first. */
  signal: AbortSignal;
}

export interface InlineRewriteProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue"
> {
  versions: RewriteVersion[];
  /** The chosen version's index. */
  value?: number;
  defaultValue?: number;
  onValueChange?: (index: number) => void;
  /** The version the counts compare against. Defaults to the one chosen first. */
  originalIndex?: number;
  onRewrite?: (request: RewriteRequest) => Promise<string>;
  /** Visible heading and accessible name for the slider, e.g. "Tone". */
  label?: string;
  /** Optional help text, shown beside the heading in an info tooltip. */
  description?: string;
  /** Let new words glow for a moment after each rewrite. */
  highlight?: boolean;
}

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const SHEEN =
  "[mask-image:linear-gradient(90deg,rgb(0_0_0/0.4)_35%,#000_50%,rgb(0_0_0/0.4)_65%)] [mask-size:200%_100%] animate-[ui-sheen_1.4s_linear_infinite] motion-reduce:animate-none motion-reduce:[mask-image:none]";

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const useReducedMotion = () =>
  React.useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(reducedQuery).matches,
    () => false,
  );

const split = (text: string) => text.split(/\s+/).filter(Boolean);
const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));

/** Longest common subsequence table over words: dp[i][j] is the match length of a[i..] and b[j..]. */
function table(a: string[], b: string[]) {
  const dp = Array.from(
    { length: a.length + 1 },
    () => new Uint16Array(b.length + 1),
  );
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      dp[i][j] =
        a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
  return dp;
}

type Word = { key: number; text: string };
type Leaving = Word & { x: number; y: number; batch: number };

/** Keep the words two texts share (and their keys); everything else is new. */
function morphWords(
  previous: Word[],
  next: string[],
  nextKey: () => number,
): Word[] {
  const a = previous.map((w) => w.text);
  const dp = table(a, next);
  const out: Word[] = [];
  let i = 0;
  let j = 0;
  while (j < next.length) {
    if (i < a.length && a[i] === next[j]) {
      out.push(previous[i]);
      i++;
      j++;
    } else if (i < a.length && dp[i + 1][j] >= dp[i][j + 1]) i++;
    else out.push({ key: nextKey(), text: next[j++] });
  }
  return out;
}

/** The paragraph: words as their own boxes so each can move, leave or arrive. */
function Words({
  text,
  reduced,
  highlight,
  className,
}: {
  text: string;
  reduced: boolean;
  highlight: boolean;
  className: string;
}) {
  const boxRef = React.useRef<HTMLParagraphElement>(null);
  const seq = React.useRef(1_000_000); // above the first render's keys
  const [words, setWords] = React.useState<Word[]>(() =>
    split(text).map((t, i) => ({ key: i + 1, text: t })),
  );
  const [leaving, setLeaving] = React.useState<Leaving[]>([]);
  const shown = React.useRef(text);
  const flip = React.useRef<{
    first: Map<number, DOMRect>;
    height: number;
  } | null>(null);
  const batch = React.useRef(0);

  // Before the new words render: note where every word is, and keep the leaving ones where they stood.
  React.useLayoutEffect(() => {
    if (text === shown.current) return;
    shown.current = text;
    const next = morphWords(words, split(text), () => ++seq.current);
    const box = boxRef.current;
    if (!box || reduced) {
      setWords(next);
      setLeaving([]);
      return;
    }
    const b = box.getBoundingClientRect();
    const first = new Map<number, DOMRect>();
    box.querySelectorAll<HTMLElement>("[data-k]").forEach((el) => {
      // Undo the last glow's reach over the spaces (it never moved anything) so boxes are just the words.
      el.style.marginLeft = el.style.paddingLeft = el.style.borderRadius = "";
      first.set(Number(el.dataset.k), el.getBoundingClientRect());
    });
    const keep = new Set(next.map((w) => w.key));
    const id = ++batch.current;
    const gone: Leaving[] = [];
    for (const w of words) {
      const r = first.get(w.key);
      if (!keep.has(w.key) && r)
        gone.push({ ...w, x: r.left - b.left, y: r.top - b.top, batch: id });
    }
    flip.current = { first, height: b.height };
    setWords(next);
    if (gone.length) {
      setLeaving((l) => [...l, ...gone]);
      window.setTimeout(
        () => setLeaving((l) => l.filter((w) => w.batch !== id)),
        320,
      );
    }
  }, [text, reduced, words]);

  // After: glide the kept words from where they were, raise the new ones, blur the leaving ones away.
  React.useLayoutEffect(() => {
    const f = flip.current;
    const box = boxRef.current;
    if (!f || !box) return;
    flip.current = null;
    const els = Array.from(box.querySelectorAll<HTMLElement>("[data-k]"));
    box.getAnimations().forEach((a) => a.cancel());
    els.forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
    const height = box.getBoundingClientRect().height;
    const rects = els.map((el) => el.getBoundingClientRect());
    if (Math.abs(height - f.height) > 0.5)
      box.animate([{ height: `${f.height}px` }, { height: `${height}px` }], {
        duration: 480,
        easing: EASE,
      });
    const primary = highlight
      ? getComputedStyle(box).getPropertyValue("--primary").trim()
      : "";
    const glow = primary
      ? `color-mix(in oklab, ${primary} 16%, transparent)`
      : "rgb(0 0 0 / 0.06)";
    const isNew = els.map((el) => !f.first.has(Number(el.dataset.k)));
    const sameLine = (i: number, j: number) =>
      Math.abs(rects[i].top - rects[j].top) < 2;
    let fresh = 0;
    els.forEach((el, i) => {
      const was = f.first.get(Number(el.dataset.k));
      if (was) {
        const dx = was.left - rects[i].left;
        const dy = was.top - rects[i].top;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5)
          el.animate(
            [
              { transform: `translate(${dx}px, ${dy}px)` },
              { transform: "none" },
            ],
            { duration: 480, easing: EASE },
          );
        return;
      }
      const delay = Math.min(90 + fresh++ * 14, 420);
      el.animate(
        [
          { opacity: 0, transform: "translateY(0.35em)", filter: "blur(4px)" },
          { opacity: 1, transform: "none", filter: "blur(0px)" },
        ],
        { duration: 380, delay, easing: EASE, fill: "backwards" },
      );
      if (!highlight) return;
      // New words side by side glow as one run: reach back over the space between them, round only the run's ends.
      const joinsBefore = i > 0 && isNew[i - 1] && sameLine(i - 1, i);
      const joinsAfter =
        i < els.length - 1 && isNew[i + 1] && sameLine(i, i + 1);
      if (joinsBefore) {
        const gap = Math.max(0, rects[i].left - rects[i - 1].right);
        el.style.marginLeft = `${-gap}px`;
        el.style.paddingLeft = `${gap}px`;
      }
      el.style.borderRadius = `${joinsBefore ? 0 : 4}px ${joinsAfter ? 0 : 4}px ${joinsAfter ? 0 : 4}px ${joinsBefore ? 0 : 4}px`;
      el.animate(
        [
          { backgroundColor: glow },
          { backgroundColor: glow, offset: 0.35 },
          { backgroundColor: "transparent" },
        ],
        {
          duration: 1800,
          delay,
          easing: "ease-out",
          fill: "backwards",
        },
      );
    });
    box
      .querySelectorAll<HTMLElement>("[data-leave]:not([data-out])")
      .forEach((el) => {
        el.dataset.out = "";
        el.animate(
          [
            { opacity: 1, transform: "none", filter: "blur(0px)" },
            {
              opacity: 0,
              transform: "translateY(-0.2em) scale(0.96)",
              filter: "blur(4px)",
            },
          ],
          { duration: 240, easing: EASE, fill: "forwards" },
        );
      });
  }, [words, highlight]);

  return (
    <p ref={boxRef} className={`relative ${className}`}>
      {words.map((w, i) => (
        <React.Fragment key={w.key}>
          {i > 0 && " "}
          <span data-k={w.key} className="inline-block">
            {w.text}
          </span>
        </React.Fragment>
      ))}
      {leaving.map((w) => (
        <span
          key={`gone-${w.batch}-${w.key}`}
          data-leave=""
          aria-hidden="true"
          className="pointer-events-none absolute whitespace-nowrap"
          style={{ left: w.x, top: w.y }}
        >
          {w.text}
        </span>
      ))}
    </p>
  );
}

/** A gradient track with a floating value label and a circular thumb. */
function Dial({
  labels,
  index,
  busy,
  label,
  description,
  reduced,
  onMove,
}: {
  labels: string[];
  index: number;
  busy: boolean;
  label: string;
  description?: string;
  reduced: boolean;
  onMove: (index: number, settled: boolean) => void;
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);
  const headingRef = React.useRef<HTMLDivElement>(null);
  const badgeRef = React.useRef<HTMLDivElement>(null);
  const descriptionId = React.useId();
  const [size, setSize] = React.useState({ width: 0, heading: 0, badge: 0 });
  const [ready, setReady] = React.useState(false);
  const [drag, setDrag] = React.useState<number | null>(null);
  const live = React.useRef({ index, drag: null as number | null });
  live.current = { index, drag };
  const n = labels.length;
  const disabled = n < 2;

  React.useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      setSize({
        width: track.clientWidth,
        heading: headingRef.current?.offsetWidth ?? 0,
        badge: badgeRef.current?.offsetWidth ?? 0,
      });
    };
    measure();
    const frame = requestAnimationFrame(() => setReady(true));
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    if (headingRef.current) observer.observe(headingRef.current);
    if (badgeRef.current) observer.observe(badgeRef.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const pad = Math.min(11, size.width / 2);
  const span = Math.max(1, size.width - pad * 2);
  const stopX = (i: number) =>
    n < 2 ? size.width / 2 : pad + (i * span) / (n - 1);
  const nearest = (x: number) =>
    n < 2 ? 0 : clamp(Math.round(((x - pad) / span) * (n - 1)), 0, n - 1);
  const x = drag === null ? stopX(index) : clamp(drag, pad, size.width - pad);
  // Keep the value inside the component, clear of the heading at the first stops.
  const badgeHalf = size.badge / 2;
  const badgeX = clamp(
    x,
    Math.min(size.heading + 12 + badgeHalf, size.width - badgeHalf),
    size.width - badgeHalf,
  );
  const arrowX = x - badgeX + badgeHalf;
  const transition = (property: string) =>
    drag !== null || reduced || !ready ? "none" : `${property} 420ms ${EASE}`;

  const at = (e: React.PointerEvent) =>
    e.clientX - (trackRef.current?.getBoundingClientRect().left ?? 0);
  const follow = (px: number, settled: boolean) => {
    const i = nearest(px);
    if (i !== live.current.index || settled) onMove(i, settled);
  };
  const finish = () => {
    const px = live.current.drag;
    if (px === null) return;
    live.current.drag = null;
    setDrag(null);
    follow(px, true);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const steps: Record<string, number> = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
    };
    let next: number | null = null;
    if (e.key in steps) next = clamp(index + steps[e.key], 0, n - 1);
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next === null) return;
    e.preventDefault();
    if (next !== index) onMove(next, true);
  };

  return (
    <div>
      <div className="flex h-7 items-center">
        <div ref={headingRef} className="flex items-center gap-2">
          <span className="text-[14px] font-medium text-foreground">
            {label}
          </span>
          {description && (
            <span className="group/info relative inline-flex">
              <button
                type="button"
                aria-label={`About ${label}`}
                aria-describedby={descriptionId}
                className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                  className="size-4"
                >
                  <circle cx="10" cy="10" r="8" />
                  <path d="M10 9v5" />
                  <circle
                    cx="10"
                    cy="6"
                    r=".8"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </button>
              <span
                id={descriptionId}
                role="tooltip"
                className="pointer-events-none invisible absolute left-0 top-full z-20 mt-2 w-48 rounded-lg border border-border bg-background px-3 py-2 text-[12px] leading-relaxed text-muted-foreground shadow-sm group-hover/info:visible group-focus-within/info:visible"
              >
                {description}
              </span>
            </span>
          )}
        </div>
      </div>
      <div
        ref={trackRef}
        onPointerDown={(e) => {
          if (disabled || e.button !== 0 || !e.isPrimary) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          const px = at(e);
          live.current.drag = px;
          setDrag(px);
          follow(px, false);
          thumbRef.current?.focus({ preventScroll: true });
        }}
        onPointerMove={(e) => {
          if (live.current.drag === null || !e.isPrimary) return;
          const px = at(e);
          live.current.drag = px;
          setDrag(px);
          follow(px, false);
        }}
        onPointerUp={finish}
        onPointerCancel={finish}
        onLostPointerCapture={finish}
        className={`relative mt-2 h-7 w-full touch-pan-y select-none ${
          disabled
            ? "cursor-default"
            : drag === null
              ? "cursor-pointer"
              : "cursor-grabbing"
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-muted to-primary"
            style={{ width: x, transition: transition("width") }}
          />
        </div>
        <div
          ref={badgeRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[calc(50%+20px)] flex max-w-full -translate-x-1/2 items-center rounded-xl bg-muted px-3.5 py-1 text-[13px] leading-5 text-muted-foreground dark:bg-muted"
          style={{
            left: badgeX,
            opacity: size.width ? 1 : 0,
            transition: transition("left"),
          }}
        >
          <span
            className="absolute -bottom-[3px] size-2 -translate-x-1/2 rotate-45 bg-inherit"
            style={{
              left: arrowX,
              opacity: arrowX >= 8 && arrowX <= size.badge - 8 ? 1 : 0,
            }}
          />
          <span className="relative truncate">
            <TextMorph animateWidth={false}>{labels[index] ?? ""}</TextMorph>
          </span>
        </div>
        <div
          ref={thumbRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={label}
          aria-describedby={description ? descriptionId : undefined}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={Math.max(0, n - 1)}
          aria-valuenow={Math.max(0, index)}
          aria-valuetext={labels[index]}
          aria-disabled={disabled || undefined}
          aria-busy={busy || undefined}
          onKeyDown={onKey}
          className={`absolute top-1/2 flex size-[22px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-[0_2px_6px_#0000001a,0_1px_2px_#0000000d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-border dark:bg-background ${
            disabled
              ? "cursor-default"
              : drag === null
                ? "cursor-grab"
                : "cursor-grabbing"
          }`}
          style={{
            left: x,
            opacity: size.width ? 1 : 0,
            transition: transition("left"),
          }}
        >
          {busy && (
            <span
              aria-hidden="true"
              className="size-3 animate-spin rounded-full border-[1.5px] border-current border-t-transparent motion-reduce:animate-none"
            />
          )}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="mt-1 flex justify-between gap-3 text-[13px] leading-5 text-muted-foreground"
      >
        <span>{labels[0]}</span>
        {n > 1 && <span className="text-right">{labels[n - 1]}</span>}
      </div>
    </div>
  );
}

export function InlineRewrite({
  versions,
  value,
  defaultValue = 0,
  onValueChange,
  originalIndex,
  onRewrite,
  label = "Rewrite",
  description,
  highlight = true,
  className = "",
  ...props
}: InlineRewriteProps) {
  const reduced = useReducedMotion();
  const [own, setOwn] = React.useState(defaultValue);
  const index = clamp(value ?? own, 0, versions.length - 1);
  const [first] = React.useState(index);
  const original = originalIndex ?? first;
  const [made, setMade] = React.useState<Record<number, string>>({});
  const textAt = (i: number) => versions[i]?.text ?? made[i];
  const [shown, setShown] = React.useState(() =>
    textAt(index) !== undefined ? index : original,
  );
  const [settled, setSettled] = React.useState(true);
  const [busy, setBusy] = React.useState<number | null>(null);
  const [failed, setFailed] = React.useState(false);
  const inflight = React.useRef(new Set<number>());
  const controllers = React.useRef(new Set<AbortController>());
  const latest = React.useRef({
    shown,
    original,
    value,
    onValueChange,
    onRewrite,
    versions,
    made,
  });
  latest.current = {
    shown,
    original,
    value,
    onValueChange,
    onRewrite,
    versions,
    made,
  };

  const choose = (i: number, done: boolean) => {
    setSettled(done);
    if (i === index) return;
    setFailed(false);
    if (value === undefined) setOwn(i);
    onValueChange?.(i);
  };

  // Show the chosen version as soon as it has words; write it first if it has none (once the dial settles).
  React.useEffect(() => {
    if (textAt(index) !== undefined) {
      setShown(index);
      return;
    }
    const { onRewrite: rewrite } = latest.current;
    if (!settled || !rewrite || inflight.current.has(index)) return;
    const i = index;
    const controller = new AbortController();
    controllers.current.add(controller);
    inflight.current.add(i);
    setBusy(i);
    setFailed(false);
    const at = (n: number) =>
      latest.current.versions[n]?.text ?? latest.current.made[n] ?? "";
    rewrite({
      index: i,
      label: versions[i].label,
      current: at(latest.current.shown),
      original: at(latest.current.original),
      signal: controller.signal,
    })
      .then((t) => {
        if (!controller.signal.aborted) setMade((m) => ({ ...m, [i]: t }));
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        // It didn't work: the dial goes back to what the paragraph says.
        setFailed(true);
        const back = latest.current.shown;
        if (latest.current.value === undefined) setOwn(back);
        latest.current.onValueChange?.(back);
      })
      .finally(() => {
        inflight.current.delete(i);
        controllers.current.delete(controller);
        setBusy((b) => (b === i ? null : b));
      });
  }, [index, settled, made, versions]);

  React.useEffect(() => {
    if (!failed) return;
    const timer = window.setTimeout(() => setFailed(false), 4000);
    return () => window.clearTimeout(timer);
  }, [failed]);

  React.useEffect(() => {
    const all = controllers.current;
    return () => all.forEach((c) => c.abort());
  }, []);

  const words = split(textAt(shown) ?? "");
  const base = split(textAt(original) ?? "");
  const common = React.useMemo(
    () => table(base, words)[0][0],
    [base.join(" "), words.join(" ")],
  );
  const added = words.length - common;
  const cut = base.length - common;
  const working = busy !== null && busy === index;
  const status = failed ? "Couldn’t rewrite it" : working ? "Rewriting" : "";

  return (
    <div className={`@container w-full ${className}`} {...props}>
      <Dial
        labels={versions.map((v) => v.label)}
        index={index}
        busy={working}
        label={label}
        description={description}
        reduced={reduced}
        onMove={choose}
      />

      <Words
        text={textAt(shown) ?? ""}
        reduced={reduced}
        highlight={highlight}
        className={`mt-4 text-[14px] leading-[1.65] text-foreground @md:text-[15px] ${working ? SHEEN : ""}`}
      />

      <div className="mt-3 flex items-center gap-2.5 text-[12px] tabular-nums text-muted-foreground">
        <span>
          <NumberRoll value={words.length} />{" "}
          <TextMorph>{words.length === 1 ? "word" : "words"}</TextMorph>
        </span>
        <span
          aria-hidden="true"
          className="size-[3px] rounded-full bg-muted-foreground/40"
        />
        {/* Against the original: the counts, or the word "Original" when you're on it. */}
        <span className="grid">
          <span
            className="col-start-1 row-start-1 flex gap-2"
            aria-hidden={shown === original}
            style={{
              opacity: shown === original ? 0 : 1,
              transition: `opacity 220ms ${EASE}`,
            }}
          >
            <span className="text-[var(--success,var(--color-emerald-600))]">
              +<NumberRoll value={added} />
            </span>
            <span className="text-destructive">
              −<NumberRoll value={cut} />
            </span>
          </span>
          <span
            className="col-start-1 row-start-1"
            aria-hidden={shown !== original}
            style={{
              opacity: shown === original ? 1 : 0,
              transition: `opacity 220ms ${EASE}`,
            }}
          >
            Original
          </span>
        </span>
        <span className={`ml-auto ${failed ? "text-destructive" : ""}`}>
          <TextMorph>{status}</TextMorph>
        </span>
      </div>
      <p className="sr-only" role="status">
        {failed
          ? "Couldn’t rewrite it. Try again."
          : `${versions[shown]?.label ?? ""}, ${words.length} words`}
      </p>
    </div>
  );
}
