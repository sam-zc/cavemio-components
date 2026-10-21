"use client";

import * as React from "react";
import { playStrip, preloadStrips } from "./cast-sprite";
import { SKIM_ART, SKIM_FRAMES } from "./skim-art";
import { StatusButton, type ActionStatus } from "./status-button";
import {
  EASE_OUT,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";

/* ─────────────────────────────────────────────────────────
 * TERMS: Skim reads them with you
 *
 *   reading  Skim, an owl in reading glasses, sits on the lit
 *            stage with his book; his bubble gives the section
 *            you're on in one plain line ("Your files stay
 *            yours."), and changes as you scroll into the next
 *   dizzy    scroll too fast (or Skip to the end) and his eyes
 *            spin
 *   yawn     linger 4s on one section and he yawns, and again
 *            every 6s you stay
 *   read     reach the end: thumbs up, "Nothing sneaky", and
 *            Accept turns on
 *   accepted Accept → Accepting → Accepted
 *
 * The terms are your sections ({ title, body, tldr }); onAccept
 * gets the version so you can record which one was agreed to.
 * ───────────────────────────────────────────────────────── */

export interface TermsSection {
  id: string;
  title: string;
  body: React.ReactNode;
  /** The section in one plain line, in Skim's bubble. */
  tldr: string;
}

export interface TermsProps {
  sections: TermsSection[];
  /** Which terms these are; onAccept gets it back. */
  version: string;
  /** "Updated 21 October 2026", under the title. */
  updated?: string;
  /** Record the acceptance; throw to say it didn't save. */
  onAccept: (version: string) => Promise<unknown>;
  /** Shows Not now beside Accept. */
  onDecline?: () => void;
  /** Accept stays off until the terms have been scrolled to the end. */
  requireRead?: boolean;
  title?: string;
  /** What the owl is called in his lines. */
  name?: string;
  className?: string;
}

type Pose = "reading" | "dizzy" | "yawn" | "proud";

const mix = (color: string, amount: number, into = "transparent") =>
  `color-mix(in oklab, ${color} ${amount}%, ${into})`;
const PF = "var(--primary-foreground)";
const CARD: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 95, "var(--foreground)")})`,
  boxShadow: `0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 85)}`,
};
/* The one lit surface, ruled faintly like a page: he's reading, after all. */
const STAGE: React.CSSProperties = {
  backgroundColor: "var(--primary)",
  backgroundImage: [
    `radial-gradient(70% 90% at 15% 100%, ${mix(PF, 20)} 0%, transparent 65%)`,
    `linear-gradient(175deg, transparent 40%, ${mix("black", 20)} 100%)`,
    `repeating-linear-gradient(180deg, transparent 0 17px, ${mix(PF, 9)} 17px 18px)`,
  ].join(", "),
  boxShadow: `inset 0 1px 0 ${mix(PF, 36)}, inset 0 0 0 1px ${mix(PF, 12)}`,
};
const LIT: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${mix(PF, 16)}, transparent 60%)`,
  boxShadow: `inset 0 1px 0 ${mix(PF, 32)}, inset 0 0 0 1px ${mix("black", 10)}`,
};
/* one animation frame on the stage (he fills almost all of its height) */
const OWL_FRAME_H = 112;
const OWL_FRAME_W = (SKIM_FRAMES.w / SKIM_FRAMES.h) * OWL_FRAME_H;

/** A line that lifts out through a blur as the next one rises in (sentences don't letter-morph well). */
function Line({ text, reduced }: { text: string; reduced: boolean }) {
  const [shown, setShown] = React.useState([{ text, key: 0 }]);
  const [last, setLast] = React.useState(text);
  if (last !== text) {
    setLast(text);
    setShown((s) => [...s.slice(-1), { text, key: s[s.length - 1].key + 1 }]);
  }
  const mounted = React.useRef(false);
  React.useEffect(() => {
    mounted.current = true;
  }, []);
  return (
    <span className="grid">
      {shown.map((l, i) => {
        const current = i === shown.length - 1;
        return (
          <span
            key={l.key}
            className="col-start-1 row-start-1"
            aria-hidden={!current}
            ref={(el) => {
              if (!el || reduced) return;
              if (current && el.dataset.in !== "1" && mounted.current) {
                el.dataset.in = "1";
                el.animate(
                  [
                    {
                      opacity: 0,
                      transform: "translateY(5px)",
                      filter: "blur(4px)",
                    },
                    { opacity: 1, transform: "none", filter: "blur(0)" },
                  ],
                  {
                    duration: 360,
                    delay: 80,
                    easing: EASE_OUT,
                    fill: "backwards",
                  },
                );
              } else if (!current && el.dataset.out !== "1") {
                el.dataset.out = "1";
                el.animate(
                  [
                    { opacity: 1 },
                    {
                      opacity: 0,
                      transform: "translateY(-5px)",
                      filter: "blur(4px)",
                    },
                  ],
                  { duration: 200, easing: "ease-in", fill: "forwards" },
                ).onfinish = () =>
                  setShown((s) => s.filter((x) => x.key !== l.key));
              }
            }}
            style={reduced && !current ? { opacity: 0 } : undefined}
          >
            {l.text}
          </span>
        );
      })}
    </span>
  );
}

export function Terms({
  sections,
  version,
  updated,
  onAccept,
  onDecline,
  requireRead = true,
  title = "Terms of Service",
  name = "Skim",
  className = "",
}: TermsProps) {
  const reduced = useInteractionReducedMotion();
  const baseId = React.useId();
  const pane = React.useRef<HTMLDivElement>(null);
  const bar = React.useRef<HTMLDivElement>(null);
  const owl = React.useRef<HTMLDivElement>(null);
  const [at, setAt] = React.useState(0);
  const [read, setRead] = React.useState(false);
  const [atEnd, setAtEnd] = React.useState(false);
  const [mood, setMood] = React.useState<"" | "dizzy" | "yawn">("");
  const [status, setStatus] = React.useState<ActionStatus>("idle");
  const last = React.useRef({ y: 0, t: 0 });
  const dizzyTimer = React.useRef(0);
  const yawnTimer = React.useRef(0);

  // linger on one section and he yawns: a 2.2s yawn after 4s without a scroll, then again every 6s you stay; any scroll wakes him
  const restartYawn = React.useCallback(() => {
    window.clearTimeout(yawnTimer.current);
    const yawn = (after: number) => {
      yawnTimer.current = window.setTimeout(() => {
        setMood((m) => (m === "" ? "yawn" : m));
        yawnTimer.current = window.setTimeout(() => {
          setMood((m) => (m === "yawn" ? "" : m));
          yawn(6000);
        }, 2400);
      }, after);
    };
    yawn(4000);
  }, []);
  React.useEffect(() => {
    restartYawn();
    return () => {
      window.clearTimeout(yawnTimer.current);
      window.clearTimeout(dizzyTimer.current);
    };
  }, [restartYawn]);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    const k = max > 0 ? el.scrollTop / max : 1;
    bar.current?.style.setProperty("transform", `scaleX(${k})`);
    // too fast to read: his eyes spin
    const dy = Math.abs(el.scrollTop - last.current.y);
    const dt = e.timeStamp - last.current.t;
    last.current = { y: el.scrollTop, t: e.timeStamp };
    if (dy > el.clientHeight * 1.2 || (dt > 0 && dt < 120 && dy / dt > 1.8)) {
      setMood("dizzy");
      window.clearTimeout(dizzyTimer.current);
      dizzyTimer.current = window.setTimeout(() => setMood(""), 1100);
    } else setMood((m) => (m === "yawn" ? "" : m));
    restartYawn();
    // the section at the reading line, a third of the way down
    const line = el.scrollTop + el.clientHeight / 3;
    let i = 0;
    el.querySelectorAll<HTMLElement>("[data-section]").forEach((s, j) => {
      if (s.offsetTop <= line) i = j;
    });
    if (el.scrollTop >= max - 4) i = sections.length - 1;
    setAt(i);
    setAtEnd(el.scrollTop >= max - 4);
    if (el.scrollTop >= max - 4) setRead(true);
  };

  const skip = () => {
    const el = pane.current;
    if (!el) return;
    setMood("dizzy");
    window.clearTimeout(dizzyTimer.current);
    dizzyTimer.current = window.setTimeout(() => setMood(""), 1300);
    el.scrollTo({
      top: el.scrollHeight,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  const accept = async () => {
    if (status === "pending" || status === "success") return;
    setStatus("pending");
    try {
      await onAccept(version);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const pose: Pose =
    mood === "dizzy"
      ? "dizzy"
      : status === "success" || (atEnd && mood === "")
        ? "proud"
        : mood === "yawn"
          ? "yawn"
          : "reading";
  const [shownPose, setShownPose] = React.useState(pose);
  if (shownPose !== pose) setShownPose(pose);
  const sprite = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    preloadStrips(Object.values(SKIM_ART));
  }, []);
  // each pose is a loop of frames; the yawn plays once and he goes back to reading
  React.useEffect(() => {
    const clip = SKIM_FRAMES.clips[shownPose];
    playStrip(sprite.current, {
      src: SKIM_ART[shownPose],
      frames: clip.frames,
      fps: clip.fps,
      size: OWL_FRAME_W,
      height: OWL_FRAME_H,
      loop: shownPose !== "yawn",
      reduced,
    });
    if (!reduced && shownPose !== "yawn")
      owl.current?.animate(
        [
          { transform: "scale(0.96) translateY(2px)", opacity: 0.6 },
          { transform: "none", opacity: 1 },
        ],
        { duration: 260, easing: EASE_OUT },
      );
  }, [shownPose, reduced]);

  const say =
    status === "success"
      ? "Thanks for reading. Well, skimming."
      : pose === "dizzy"
        ? "Whoa. Slow down, I’m reading."
        : atEnd
          ? "That’s everything. Nothing sneaky."
          : pose === "yawn"
            ? `Still on ${sections[at]?.title.toLowerCase() ?? "this"}…`
            : (sections[at]?.tldr ?? "");
  const canAccept = !requireRead || read;

  return (
    <section
      aria-labelledby={`${baseId}-title`}
      className={`relative w-full max-w-[380px] rounded-[28px] p-2 text-card-foreground ${className}`}
      style={CARD}
    >
      {/* Its natural width where the parent sizes to its content, without forcing it on narrow screens. */}
      <div
        aria-hidden="true"
        data-natural-width
        className="grid h-0"
        style={{ gridTemplateColumns: "minmax(0, 380px)" }}
      />
      <div className="@container w-full">
        <div
          className="relative flex h-[132px] items-end overflow-clip rounded-[22px] text-primary-foreground"
          style={STAGE}
        >
          {/* Skim, animated: each pose is a loop of frames */}
          <div
            ref={owl}
            aria-hidden="true"
            className="relative mb-1 ml-1 shrink-0"
            style={{
              height: OWL_FRAME_H,
              width: OWL_FRAME_W,
              transformOrigin: "50% 100%",
            }}
          >
            <div ref={sprite} className="size-full" />
          </div>
          {/* his bubble: the section in one plain line */}
          <div className="relative mb-auto mr-3 mt-4 min-w-0 flex-1">
            <span
              aria-hidden="true"
              className="absolute -left-[5px] top-6 size-2.5 rotate-45 rounded-[2px]"
              style={{ background: PF }}
            />
            <div
              className="relative rounded-[14px] px-3 py-2"
              style={{ background: PF, color: "var(--primary)" }}
            >
              <p className="text-[11px] font-medium opacity-70">
                {name}’s summary · {Math.min(at + 1, sections.length)} of{" "}
                {sections.length}
              </p>
              <p
                className="mt-0.5 text-[13px] font-medium leading-[1.35] @max-[340px]:text-[12px]"
                aria-live="polite"
              >
                <Line text={say} reduced={reduced} />
              </p>
            </div>
          </div>
        </div>

        <div className="px-3 pt-3">
          <div className="flex items-baseline justify-between gap-3">
            <h2
              id={`${baseId}-title`}
              className="text-[15px] font-medium tracking-[-0.01em]"
            >
              {title}
            </h2>
            {!read && (
              <button
                type="button"
                onClick={skip}
                className="shrink-0 cursor-pointer text-[12px] text-muted-foreground underline decoration-border underline-offset-2 hover:text-foreground"
              >
                Skip to the end
              </button>
            )}
          </div>
          {updated && (
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              {updated}
            </p>
          )}
        </div>

        {/* the terms themselves, with how far you've read along the bottom */}
        <div className="relative mx-2 mt-2.5 overflow-clip rounded-[14px] border border-border bg-background">
          <div
            ref={pane}
            tabIndex={0}
            role="region"
            aria-label={title}
            onScroll={onScroll}
            className="h-[188px] overflow-y-auto overscroll-contain px-3.5 py-3 text-[12.5px] leading-[1.6] text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset"
          >
            {sections.map((s, i) => (
              <div key={s.id} data-section className={i ? "mt-3.5" : ""}>
                <h3 className="text-[12.5px] font-medium text-foreground">
                  {i + 1}. {s.title}
                </h3>
                <div className="mt-1 [&_p+p]:mt-2">{s.body}</div>
              </div>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-border" />
          <div
            ref={bar}
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-primary"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        <div className="flex items-center gap-2 px-2 pb-1 pt-3">
          {onDecline && (
            <StatusButton
              variant="outline"
              labels={{ idle: "Not now" }}
              onClick={onDecline}
              className="h-10 flex-1 text-[13.5px]"
              disabled={status === "pending"}
            />
          )}
          <StatusButton
            status={status}
            labels={{
              idle: canAccept ? "Accept" : "Read to the end to accept",
              pending: "Accepting",
              success: "Accepted",
              error: "Try again",
            }}
            onClick={accept}
            disabled={!canAccept}
            className="h-10 flex-[2] text-[13.5px] disabled:bg-[color-mix(in_oklab,var(--foreground)_7%,transparent)] disabled:text-muted-foreground"
            style={canAccept && status !== "error" ? LIT : undefined}
          />
        </div>
      </div>
    </section>
  );
}

export default Terms;
