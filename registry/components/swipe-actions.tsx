"use client";

/* ─────────────────────────────────────────────────────────
 * SWIPE ACTIONS: a list row that slides over its actions
 *
 *   reveal    drag the row (or swipe two fingers on a
 *             trackpad) and the actions under that edge share
 *             the space it uncovers: each cell grows with the
 *             finger and its icon scales in once there's room
 *   open      let go past half the rail, or flick, and the row
 *             springs open with the actions at full size; tap
 *             the row, anywhere else or Escape to close it.
 *             Opening one row closes the others
 *   arm       keep going past most of the row and the first
 *             action takes the whole space, its icon riding the
 *             row's edge (a tick on phones). Let go to run it
 *   remove    an action that removes the row (archive, delete)
 *             slides it off and folds its height away at once;
 *             if the work fails, the row unfolds, slides back,
 *             shakes, and its time reads "Failed"
 *   hover     with a mouse, the row's time gives way to the same
 *             actions as icons, so nothing needs a swipe
 *
 * The icon buttons are the accessible actions: Tab reaches them,
 * and results are announced. The swipe cells repeat them for
 * pointers and stay out of the tab order.
 * ───────────────────────────────────────────────────────── */

import * as React from "react";
import {
  EASE_OUT,
  INTERACTION_FOCUS,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";
import { type SwipeSide, useSwipeRow } from "./use-swipe-row";

export type SwipeTone = "neutral" | "primary" | "destructive";

export interface SwipeAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  tone?: SwipeTone;
  /** The row leaves the list (archive, delete): it slides out and folds away at once, and comes back if onAction throws. Remove the item from your list when it resolves. */
  removes?: boolean;
  onAction: () => void | Promise<void>;
}

export interface SwipeActionsProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Names the row for screen readers, e.g. the message subject. */
  label: string;
  /** Under the left edge, revealed by swiping right. The first one runs on a full swipe. */
  leading?: SwipeAction[];
  /** Under the right edge, revealed by swiping left, listed from the edge inward. The first one runs on a full swipe. */
  trailing?: SwipeAction[];
  /** At the row's end, e.g. the time. With a mouse it gives way to the actions on hover. */
  meta?: React.ReactNode;
  /** Unfold on mount, for a row put back by an undo. */
  enter?: boolean;
  /** A thin line under the row, folding away with it. */
  divider?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const CELL = 76;
const NONE: SwipeAction[] = [];
const TONES: Record<SwipeTone, string> = {
  neutral:
    "bg-muted text-foreground shadow-[inset_1px_0_0_var(--border),inset_-1px_0_0_var(--border)]",
  primary: "bg-primary text-primary-foreground",
  destructive: "bg-destructive text-white",
};
// Cells start off the row; after that the engine owns their transforms, so these objects never change.
const OFF: Record<SwipeSide, React.CSSProperties> = {
  leading: { transform: "translate3d(-100%,0,0)", visibility: "hidden" },
  trailing: { transform: "translate3d(100%,0,0)", visibility: "hidden" },
};
const HIDDEN: React.CSSProperties = { opacity: 0 };

export function SwipeActions({
  label,
  leading = NONE,
  trailing = NONE,
  meta,
  enter = false,
  divider = true,
  disabled = false,
  children,
  className = "",
  ...props
}: SwipeActionsProps) {
  const reduced = useInteractionReducedMotion();
  const [gone, setGone] = React.useState(enter && !reduced);
  const [failed, setFailed] = React.useState(false);
  const [said, setSaid] = React.useState("");
  const busy = React.useRef(false);
  const alive = React.useRef(true);
  const body = React.useRef<HTMLDivElement>(null);
  const timers = React.useRef(new Set<ReturnType<typeof setTimeout>>());
  const lists = React.useRef({ leading, trailing });
  React.useLayoutEffect(() => {
    lists.current = { leading, trailing };
  });
  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      const t = setTimeout(
        () => {
          timers.current.delete(t);
          resolve();
        },
        reduced ? 0 : ms,
      );
      timers.current.add(t);
    });

  const run = async (
    side: SwipeSide,
    index: number,
    via: "swipe" | "cell" | "button",
  ) => {
    const action = lists.current[side][index];
    if (!action || busy.current || disabled) return;
    busy.current = true;
    setFailed(false);
    try {
      if (action.removes) {
        // Optimistic: the row leaves now, and comes back only if the work fails.
        await row.commit(side, index);
        if (!alive.current) return;
        setGone(true);
        try {
          await action.onAction();
          if (alive.current) setSaid(`${label}: ${action.label} done`);
        } catch {
          if (!alive.current) return;
          setGone(false);
          await wait(360);
          row.restore();
          await wait(420);
          fail(action);
        }
        return;
      }
      if (via === "swipe") await row.commit(side, index);
      else row.close();
      let ok = true;
      try {
        await action.onAction();
      } catch {
        ok = false;
      }
      if (!alive.current) return;
      if (via === "swipe") {
        await wait(140);
        row.restore();
      }
      if (ok) setSaid(`${label}: ${action.label} done`);
      else {
        await wait(380);
        fail(action);
      }
    } finally {
      busy.current = false;
    }
  };
  const fail = (action: SwipeAction) => {
    if (!alive.current) return;
    setFailed(true);
    setSaid(`${label}: ${action.label} failed. Try again.`);
    if (!reduced)
      body.current?.animate(
        [
          { transform: "none" },
          { transform: "translateX(-5px)" },
          { transform: "translateX(5px)" },
          { transform: "translateX(-3px)" },
          { transform: "none" },
        ],
        { duration: 380, easing: "ease-out" },
      );
    const t = setTimeout(() => {
      timers.current.delete(t);
      setFailed(false);
    }, 2600);
    timers.current.add(t);
  };

  const row = useSwipeRow({
    leading: leading.length,
    trailing: trailing.length,
    cellWidth: CELL,
    reduced,
    disabled,
    onFull: (side) => void run(side, 0, "swipe"),
  });

  React.useEffect(() => {
    alive.current = true;
    const pending = timers.current;
    return () => {
      alive.current = false;
      pending.forEach(clearTimeout);
    };
  }, []);
  // A row put back by an undo unfolds once it's mounted.
  React.useEffect(() => {
    if (!gone || !enter) return;
    let b = 0;
    const a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => setGone(false));
    });
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, []);
  // Labels changed (Read ↔ Unread): measure the faces again.
  const labels = [...leading, ...trailing].map((a) => a.label).join("|");
  React.useEffect(() => {
    row.remeasure();
  }, [labels]);

  const cellsFor = (side: SwipeSide, list: SwipeAction[]) =>
    list.map((action, i) => (
      <button
        key={`${side}-${action.id}`}
        ref={(el) => row.attachCell(side, i, el)}
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => void run(side, i, "cell")}
        className={`absolute inset-y-0 left-0 w-full cursor-pointer will-change-transform ${TONES[action.tone ?? "neutral"]}`}
        style={OFF[side]}
      >
        <span
          ref={(el) => row.attachFace(side, i, el)}
          className="absolute left-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-1 whitespace-nowrap text-[11px] font-medium will-change-transform [&_svg]:size-[18px] [&_svg]:stroke-[1.75]"
          style={HIDDEN}
        >
          {action.icon}
          {action.label}
        </span>
      </button>
    ));

  // Mouse users get the same actions as icons: the row's own edge first, so the order matches the swipe.
  const buttons = [
    ...leading.map((a, i) => ({ a, side: "leading" as const, i })),
    ...[...trailing]
      .reverse()
      .map((a) => ({ a, side: "trailing" as const, i: trailing.indexOf(a) })),
  ];

  return (
    <div
      className={`grid ${className}`}
      style={{
        gridTemplateRows: gone ? "0fr" : "1fr",
        opacity: gone ? 0 : 1,
        transition: reduced
          ? "none"
          : `grid-template-rows 380ms ${EASE_OUT} ${gone ? "120ms" : "0ms"}, opacity ${gone ? 260 : 320}ms ${EASE_OUT} ${gone ? "160ms" : "0ms"}`,
      }}
      {...props}
    >
      <div className="min-h-0 overflow-hidden">
        <div
          ref={(el) => row.attachSurface(el)}
          role="group"
          aria-label={label}
          data-failed={failed || undefined}
          onKeyDown={(e) => {
            if (e.key === "Escape" && row.open) {
              e.preventDefault();
              row.close();
            }
          }}
          className={`group/row relative isolate touch-pan-y overflow-hidden ${divider ? "border-b border-border" : ""}`}
        >
          {cellsFor("leading", leading)}
          {cellsFor("trailing", trailing)}
          <div
            ref={(el) => row.attachFront(el)}
            className={`relative z-30 flex items-center gap-3 bg-(--row-bg) px-4 py-3 transition-[background-color] duration-200 will-change-transform [--row-bg:var(--background)] pointer-fine:group-hover/row:[--row-bg:color-mix(in_oklab,var(--muted)_55%,var(--background))] ${disabled ? "opacity-60" : "cursor-grab active:cursor-grabbing"}`}
          >
            <div ref={body} className="min-w-0 flex-1">
              {children}
            </div>
            <div className="relative flex shrink-0 items-center self-stretch">
              <span className="grid text-right text-[11.5px] tabular-nums text-muted-foreground transition-opacity duration-200 pointer-fine:group-hover/row:opacity-0 group-focus-within/row:opacity-0 group-data-[moving]/row:opacity-100! group-data-[failed]/row:opacity-100!">
                <span
                  className="col-start-1 row-start-1 transition-[opacity,filter] duration-300"
                  style={{
                    opacity: failed ? 0 : 1,
                    filter: failed ? "blur(3px)" : "none",
                  }}
                >
                  {meta}
                </span>
                <span
                  className="col-start-1 row-start-1 text-red-600 transition-[opacity,filter] duration-300 dark:text-red-400"
                  style={{
                    opacity: failed ? 1 : 0,
                    filter: failed ? "none" : "blur(3px)",
                  }}
                >
                  Failed
                </span>
              </span>
              {buttons.length > 0 && (
                <div
                  className="pointer-events-none absolute right-0 top-1/2 flex -translate-y-1/2 translate-x-1 items-center gap-0.5 pl-6 opacity-0 transition-[opacity,transform] duration-200 pointer-fine:group-hover/row:pointer-events-auto pointer-fine:group-hover/row:translate-x-0 pointer-fine:group-hover/row:opacity-100 group-focus-within/row:pointer-events-auto group-focus-within/row:translate-x-0 group-focus-within/row:opacity-100 group-data-[moving]/row:pointer-events-none! group-data-[moving]/row:opacity-0! group-data-[failed]/row:pointer-events-none! group-data-[failed]/row:opacity-0!"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, var(--row-bg) 18px)",
                  }}
                >
                  {buttons.map(({ a, side, i }) => (
                    <button
                      key={`${side}-${a.id}`}
                      type="button"
                      aria-label={a.label}
                      title={a.label}
                      disabled={disabled}
                      onClick={() => void run(side, i, "button")}
                      className={`flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-[background-color,color,box-shadow] duration-150 hover:bg-background hover:shadow-[0_0_0_1px_var(--border)] disabled:cursor-default [&_svg]:size-4 [&_svg]:stroke-[1.75] ${a.tone === "destructive" ? "hover:text-red-600 dark:hover:text-red-400" : "hover:text-foreground"} ${INTERACTION_FOCUS}`}
                    >
                      {a.icon}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <span role="status" className="sr-only">
        {said}
      </span>
    </div>
  );
}
