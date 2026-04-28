"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { TextMorph } from "./text-morph";
import { Kbd } from "./kbd";

/* ─────────────────────────────────────────────────────────
 * COMMAND PALETTE: ⌘K, from the pill that was always there
 *
 *   closed    an action label followed by a Kbd shortcut badge
 *   opening   the pill itself lifts and grows into the palette:
 *             position, size and corners ease from pill to panel
 *             while its placeholder becomes the field's
 *   search    results narrow as you type, the letters that match
 *             are marked, the panel's height eases to fit and a
 *             highlight glides between rows
 *   nested    "Change theme…" opens its own list in place: it
 *             slides in from the right as a chip joins the field;
 *             Backspace slides back
 *   running   a command's shortcut blurs into a spinner, then a
 *             check that draws itself, and the palette folds back
 *             into the pill, which it lands as exactly (hotkey
 *             and all), so the hand-off never shows
 *   empty     "No results for “xyz”", morphing as you type
 *
 * A real dialog: focus moves in and back, arrow keys, Home/End,
 * Enter, Escape (back, then close) and the hotkey to toggle.
 * ───────────────────────────────────────────────────────── */

export interface CommandItem {
  id: string;
  label: string;
  /** Rows are grouped under this heading, in the order groups first appear. */
  group?: string;
  icon?: React.ReactNode;
  /** Shown on the right, e.g. ["⌘", "N"]. */
  shortcut?: string[];
  /** Other words that should find it, e.g. ["dark", "light"] for "Change theme". */
  keywords?: string[];
  description?: string;
  /** Navigate here when chosen. */
  href?: string;
  /** Run it. Return a promise to show progress on the row before the palette closes. */
  onSelect?: (context: { signal: AbortSignal }) => void | Promise<unknown>;
  /** A nested list, opened in place (e.g. "Change theme…"). */
  items?: CommandItem[];
}

export interface CommandFilter {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface CommandPaletteProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect"
> {
  items: CommandItem[];
  placeholder?: string;
  /** Accessible name of the search field. */
  searchLabel?: string;
  /** The letter that opens it with ⌘ (or Ctrl). Empty string turns the hotkey off. */
  hotkey?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Show the command menu trigger. Without it, open with the hotkey or the open prop. */
  showTrigger?: boolean;
  /** The pill's words. */
  triggerLabel?: string;
  /** Leading trigger icon. Defaults to search; pass null to omit it. */
  triggerIcon?: React.ReactNode;
  /** Caller-owned active search scopes. The caller also filters items. */
  filters?: CommandFilter[];
  filtersLabel?: string;
  onFilterRemove?: (id: string) => void;
  /** Optional help copy, links, or actions alongside the keyboard hints. */
  footer?: React.ReactNode;
}

type Phase = "closed" | "opening" | "open" | "closing";
type Page = { title: string; items: CommandItem[] };
type Row = { item: CommandItem; marks: number[]; score: number };
type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
  radius: number;
};
type RunState = { id: string; state: "pending" | "done" | "error" };

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const OPEN_DURATION = 440;
const CLOSE_DURATION = 320;
const WIDTH = 640;
const ROW = 40;
const LIST_MAX = 440;
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

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

/** Icons trade places through a blur: the old one shrinks away as the new one grows in. */
const swap = (on: boolean, reduced: boolean): React.CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: on ? "none" : "scale(0.6)",
  filter: on ? "none" : "blur(3px)",
  transition: reduced
    ? "none"
    : `opacity 220ms ${EASE}, transform 340ms ${EASE}, filter 220ms ${EASE}`,
});

/** Where the query's letters land in the text: one run if it's there whole, otherwise in order. */
function match(text: string, query: string): number[] | null {
  const t = text.toLowerCase();
  const q = query.toLowerCase().replace(/\s+/g, " ").trim();
  if (!q) return [];
  const at = t.indexOf(q);
  if (at >= 0) return Array.from({ length: q.length }, (_, i) => at + i);
  const marks: number[] = [];
  let j = 0;
  for (let i = 0; i < t.length && j < q.length; i++) {
    if (q[j] === " ") j++;
    if (t[i] === q[j]) {
      marks.push(i);
      j++;
    }
  }
  return j >= q.length ? marks : null;
}

function rank(items: CommandItem[], query: string): Row[] {
  const q = query.trim();
  if (!q) return items.map((item) => ({ item, marks: [], score: 0 }));
  const rows: Row[] = [];
  for (const item of items) {
    const marks = match(item.label, q);
    if (marks) {
      const contiguous =
        marks.length > 1 &&
        marks[marks.length - 1] - marks[0] === marks.length - 1;
      const start = marks[0] ?? 0;
      const wordStart = start === 0 || item.label[start - 1] === " ";
      const score =
        (contiguous ? 60 : 30) +
        (start === 0 ? 40 : wordStart ? 20 : 0) -
        (marks[marks.length - 1] - start) * 0.5;
      rows.push({ item, marks, score });
    } else if (
      item.keywords?.some((k) => match(k, q)) ||
      (item.description && match(item.description, q))
    ) {
      rows.push({ item, marks: [], score: 10 });
    }
  }
  return rows.sort((a, b) => b.score - a.score);
}

function Marked({ text, marks }: { text: string; marks: number[] }) {
  if (!marks.length) return <>{text}</>;
  const set = new Set(marks);
  return (
    <>
      {Array.from(text).map((ch, i) =>
        set.has(i) ? (
          <span key={i} className="font-medium text-foreground">
            {ch}
          </span>
        ) : (
          <React.Fragment key={i}>{ch}</React.Fragment>
        ),
      )}
    </>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={`size-4 shrink-0 ${className}`}
    >
      <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m10.5 10.5 3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Check({ drawn, reduced }: { drawn: boolean; reduced: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4">
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        style={{
          strokeDashoffset: drawn ? 0 : 1,
          transition:
            drawn && !reduced ? `stroke-dashoffset 360ms ${EASE} 80ms` : "none",
        }}
      />
    </svg>
  );
}

/** One page of results. Kept as its own piece so the page you leave can slide out while the next slides in. */
function Results({
  rows,
  active,
  run,
  reduced,
  listId,
  optionId,
  setActive,
  choose,
  rowRefs,
}: {
  rows: Row[];
  active: number;
  run: RunState | null;
  reduced: boolean;
  listId?: string;
  optionId?: (i: number) => string;
  setActive?: (i: number) => void;
  choose?: (i: number) => void;
  rowRefs?: React.MutableRefObject<(HTMLDivElement | null)[]>;
}) {
  return (
    <div
      id={listId}
      role={listId ? "listbox" : undefined}
      aria-label={listId ? "Commands" : undefined}
    >
      {rows.map((row, i) => {
        const { item } = row;
        const heading =
          item.group && item.group !== rows[i - 1]?.item.group
            ? item.group
            : null;
        const running = run?.id === item.id;
        const state = running ? run.state : null;
        return (
          <React.Fragment key={item.id}>
            {heading && (
              <div
                role="presentation"
                className={`px-3 pb-1 pt-2 text-[12px] font-medium text-muted-foreground ${i > 0 ? "mt-1 border-t border-border" : ""}`}
              >
                {heading}
              </div>
            )}
            <div
              ref={(el) => {
                if (rowRefs) rowRefs.current[i] = el;
              }}
              id={optionId?.(i)}
              role="option"
              aria-selected={i === active}
              aria-disabled={Boolean(run) || undefined}
              onPointerMove={() => i !== active && setActive?.(i)}
              onClick={() => choose?.(i)}
              className="relative flex cursor-pointer items-center gap-3 rounded-xl px-3 text-[13.5px] text-foreground/80"
              style={{ height: ROW }}
            >
              {item.icon && (
                <span
                  aria-hidden="true"
                  className="flex size-5 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-5 [&_svg]:stroke-[1.7] [&_img]:size-5 [&_img]:object-contain"
                >
                  {item.icon}
                </span>
              )}
              <span className="min-w-0 truncate">
                <Marked text={item.label} marks={row.marks} />
                {item.items && <span className="text-muted-foreground">…</span>}
              </span>
              {item.description && (
                <span className="hidden min-w-0 flex-1 truncate text-[12px] text-muted-foreground sm:block">
                  {item.description}
                </span>
              )}
              {/* The right edge: shortcut or chevron, which blurs into a spinner and then a check while it runs. */}
              <span className="relative ml-auto flex h-5 shrink-0 items-center justify-end">
                <span
                  className="flex items-center gap-1"
                  style={swap(!state, reduced)}
                >
                  {item.items ? (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 12 12"
                      className="size-3 text-muted-foreground"
                    >
                      <path
                        d="m4.5 2.5 3.5 3.5-3.5 3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    item.shortcut?.map((k) => <Kbd key={k}>{k}</Kbd>)
                  )}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 right-0 flex items-center"
                  style={swap(state === "pending", reduced)}
                >
                  <span
                    className={`size-3.5 rounded-full border-[1.5px] border-border border-t-foreground/70 motion-reduce:animate-none ${state === "pending" ? "animate-spin" : ""}`}
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 right-0 flex items-center text-[var(--success,var(--color-emerald-600))]"
                  style={swap(state === "done", reduced)}
                >
                  <Check drawn={state === "done"} reduced={reduced} />
                </span>
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function CommandPalette({
  items,
  placeholder = "Search or jump to…",
  hotkey = "k",
  searchLabel = "Search commands",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  showTrigger = true,
  triggerLabel = "Search...",
  triggerIcon = <SearchIcon />,
  filters = [],
  filtersLabel = "Recent searches",
  onFilterRemove,
  footer,
  className = "",
  ...props
}: CommandPaletteProps) {
  const reduced = useReducedMotion();
  const id = React.useId();
  const [phase, setPhase] = React.useState<Phase>(
    defaultOpen ? "open" : "closed",
  );
  const [query, setQuery] = React.useState("");
  const [stack, setStack] = React.useState<Page[]>([]);
  const [active, setActive] = React.useState(0);
  const [run, setRun] = React.useState<RunState | null>(null);
  const [from, setFrom] = React.useState<Rect | null>(null);
  const [listHeight, setListHeight] = React.useState(0);
  const [highlight, setHighlight] = React.useState({
    top: 0,
    ready: false,
    depth: 0,
  });
  const [leaving, setLeaving] = React.useState<
    { key: number; rows: Row[]; active: number; dir: number; top: number }[]
  >([]);
  const [enterDir, setEnterDir] = React.useState(0);
  const [portal, setPortal] = React.useState<HTMLElement | null>(null);

  const [viewport, setViewport] = React.useState({
    width: 0,
    height: 0,
    top: 0,
  });
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const footerRef = React.useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = React.useState(48);
  const wasMounted = React.useRef(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const paneRef = React.useRef<HTMLDivElement>(null);
  const rowRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const returnFocus = React.useRef<HTMLElement | null>(null);
  const timer = React.useRef(0);
  const commandRun = React.useRef<AbortController | null>(null);
  const failureMotion = React.useRef<Animation | null>(null);
  const [error, setError] = React.useState("");
  const leaveKey = React.useRef(0);

  const isOpen = phase === "open";
  const mounted = phase !== "closed";
  const page = stack[stack.length - 1];
  const pageItems = page ? page.items : items;
  const rows = React.useMemo(() => rank(pageItems, query), [pageItems, query]);

  React.useEffect(() => {
    // Browser-only portal discovery after hydration.

    setPortal(document.body);
  }, []);

  // Where the pill is, so the palette can grow out of it (and fold back into it).
  const pillRect = (): Rect | null => {
    const el = triggerRef.current;
    if (!el || !showTrigger) return null;
    const r = el.getBoundingClientRect();
    // Off screen, or hidden (a pill tucked away on narrow screens has no box): open in place instead.
    if (!r.width || r.bottom < 0 || r.top > window.innerHeight) return null;
    return {
      left: r.left,
      top: r.top,
      width: r.width,
      height: r.height,
      radius: parseFloat(getComputedStyle(el).borderTopLeftRadius),
    };
  };

  const target = (): Rect => {
    const vw = viewport.width || document.documentElement.clientWidth;
    const vh = viewport.height || window.innerHeight;
    const width = Math.min(WIDTH, vw - 24);
    const compactTop = Math.max(16, Math.min(96, Math.round(vh * 0.16)));
    // Shorten travel when the full result area fits, without taking space from
    // the list on short screens. Reserve the maximum height so searching or
    // entering a nested page does not move the shell's anchor.
    const fullHeight = 52 + LIST_MAX + 12 + footerHeight;
    const top = Math.max(
      compactTop,
      Math.min(160, Math.round(vh * 0.16), vh - fullHeight - 16),
    );
    return {
      left: (vw - width) / 2,
      top: viewport.top + top,
      width,
      height: 0,
      radius: 14,
    };
  };

  // Reset before mounting the input. A post-mount effect can erase typing
  // delivered during the opening frames, making Enter choose the wrong row.
  const resetSession = React.useCallback(() => {
    commandRun.current?.abort();
    failureMotion.current?.cancel();
    window.clearTimeout(timer.current);
    setError("");
    setQuery("");
    setStack([]);
    setActive(0);
    setRun(null);
    setLeaving([]);
    setHighlight({ top: 0, ready: false, depth: 0 });
  }, []);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!next) {
        commandRun.current?.abort();
        failureMotion.current?.cancel();
      }
      if (openProp === undefined) {
        window.clearTimeout(timer.current);
        if (next) {
          if (phase === "closed") {
            returnFocus.current = document.activeElement as HTMLElement | null;
            resetSession();
          }
          setFrom(pillRect());
          setPhase(reduced ? "open" : "opening");
        } else {
          setFrom(pillRect());
          if (reduced) setPhase("closed");
          else {
            setPhase("closing");
            timer.current = window.setTimeout(
              () => setPhase("closed"),
              CLOSE_DURATION,
            );
          }
        }
      }
      onOpenChange?.(next);
    },

    [openProp, onOpenChange, reduced, showTrigger, phase, resetSession],
  );

  // Controlled: follow the prop through the same phases.
  React.useEffect(() => {
    if (openProp === undefined) return;
    window.clearTimeout(timer.current);
    if (openProp && (phase === "closed" || phase === "closing")) {
      if (phase === "closed") {
        returnFocus.current = document.activeElement as HTMLElement | null;
        // Synchronize the controlled prop before exposing a new search session.

        resetSession();
      }
      setFrom(pillRect());
      setPhase(reduced ? "open" : "opening");
    } else if (!openProp && (phase === "open" || phase === "opening")) {
      commandRun.current?.abort();
      failureMotion.current?.cancel();
      setFrom(pillRect());
      if (reduced) setPhase("closed");
      else {
        setPhase("closing");
        timer.current = window.setTimeout(
          () => setPhase("closed"),
          CLOSE_DURATION,
        );
      }
    }
  }, [openProp]);

  // Paint at the pill's size first, then let it grow.
  React.useEffect(() => {
    if (phase !== "opening") return;
    let inner = 0;
    const outer = requestAnimationFrame(
      () => (inner = requestAnimationFrame(() => setPhase("open"))),
    );
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [phase]);

  // Accept typing from the first mounted frame, including while the pill grows.
  React.useLayoutEffect(() => {
    if (mounted) inputRef.current?.focus({ preventScroll: true });
  }, [mounted, portal]);

  React.useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      commandRun.current?.abort();
      failureMotion.current?.cancel();
    },
    [],
  );

  // The page behind stays where it is.
  React.useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    const gap = window.innerWidth - html.clientWidth;
    const before = {
      overflow: html.style.overflow,
      paddingRight: html.style.paddingRight,
    };
    html.style.overflow = "hidden";
    if (gap > 0) html.style.paddingRight = `${gap}px`;
    return () => {
      html.style.overflow = before.overflow;
      html.style.paddingRight = before.paddingRight;
    };
  }, [mounted]);

  // Keep the background inert for the full morph, then restore focus after
  // that inert state is released (including controlled and reduced-motion close).
  React.useEffect(() => {
    if (!mounted || !overlayRef.current) return;
    const siblings = Array.from(document.body.children).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement &&
        el !== overlayRef.current &&
        !el.contains(overlayRef.current),
    );
    const before = siblings.map((el) => el.inert);
    siblings.forEach((el) => {
      el.inert = true;
    });
    return () =>
      siblings.forEach((el, i) => {
        el.inert = before[i];
      });
  }, [mounted, portal]);

  React.useEffect(() => {
    if (mounted) {
      wasMounted.current = true;
      return;
    }
    if (!wasMounted.current) return;
    wasMounted.current = false;
    const back = returnFocus.current;
    const frame = requestAnimationFrame(() =>
      (back && document.contains(back) ? back : triggerRef.current)?.focus({
        preventScroll: true,
      }),
    );
    return () => cancelAnimationFrame(frame);
  }, [mounted]);

  React.useEffect(() => {
    if (!mounted) return;
    const measure = () =>
      setViewport({
        width: document.documentElement.clientWidth,
        height: window.visualViewport?.height ?? window.innerHeight,
        top: window.visualViewport?.offsetTop ?? 0,
      });
    measure();
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("scroll", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("scroll", measure);
    };
  }, [mounted]);

  // Switching preferences during a transition settles it without clearing the query.
  React.useLayoutEffect(() => {
    if (!reduced) return;
    failureMotion.current?.cancel();
    window.clearTimeout(timer.current);
    // Settle an in-flight animation immediately when the OS preference changes.

    setPhase((value) =>
      value === "closing" ? "closed" : value === "opening" ? "open" : value,
    );
    setLeaving((value) => (value.length ? [] : value));
  }, [reduced]);

  // The list's height, so the panel can ease to fit the results.
  React.useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () =>
      setListHeight((h) => (h === el.offsetHeight ? h : el.offsetHeight));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, portal]);

  React.useLayoutEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const measure = () => setFooterHeight(el.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, portal]);

  // Keep the active row in range as the results change.
  React.useEffect(() => {
    // Clamp keyboard selection after an external catalog update.

    setActive((a) => Math.min(a, Math.max(0, rows.length - 1)));
  }, [rows.length]);

  // The highlight glides to the active row; the list scrolls only as far as it must.
  React.useLayoutEffect(() => {
    const row = rowRefs.current[active];
    const list = listRef.current;
    const pane = paneRef.current;
    if (!row || !list || !pane) return;
    // The highlight belongs to this pane, so it shares the rows' coordinates
    // and slide transform. Scrolling still uses the full list-content offset.
    const top = row.offsetTop;
    const listTop = pane.offsetTop + top;
    setHighlight((h) =>
      h.top === top && h.ready && h.depth === stack.length
        ? h
        : {
            top,
            // A new page takes its initial position without gliding from the
            // previous page. Subsequent selection changes still animate.
            ready: h.depth === stack.length && (h.ready || isOpen),
            depth: stack.length,
          },
    );
    if (active === 0) list.scrollTop = 0;
    else if (listTop < list.scrollTop) list.scrollTop = listTop - 4;
    else if (listTop + ROW > list.scrollTop + list.clientHeight)
      list.scrollTop = listTop + ROW - list.clientHeight + 4;
  }, [active, rows, isOpen, listHeight, stack.length]);

  // A new page slides in from the side you went.
  React.useLayoutEffect(() => {
    if (!enterDir || reduced) return;
    const animation = paneRef.current?.animate(
      [
        {
          opacity: 0,
          filter: "blur(4px)",
          transform: `translateX(${enterDir * 28}px)`,
        },
        { opacity: 1, filter: "blur(0px)", transform: "none" },
      ],
      { duration: 360, easing: EASE, delay: 40, fill: "backwards" },
    );
    return () => animation?.cancel();
  }, [stack.length, enterDir, reduced]);

  React.useEffect(() => {
    if (!leaving.length) return;
    const t = window.setTimeout(() => setLeaving([]), 260);
    return () => window.clearTimeout(t);
  }, [leaving]);

  const go = (dir: 1 | -1, next: Page[]) => {
    if (!reduced)
      setLeaving((l) => [
        ...l,
        {
          key: ++leaveKey.current,
          rows,
          active,
          dir,
          top: paneRef.current?.offsetTop ?? 0,
        },
      ]);
    setEnterDir(dir);
    setStack(next);
    setQuery("");
    setActive(0);
    setHighlight((h) => ({ ...h, ready: false }));
  };

  const choose = async (i: number) => {
    const row = rows[i];
    if (!row || run) return;
    const { item } = row;
    setActive(i);
    if (item.items)
      return go(1, [
        ...stack,
        { title: item.label.replace(/…$/, ""), items: item.items },
      ]);
    if (item.href && !item.onSelect) {
      setOpen(false);
      window.location.assign(item.href);
      return;
    }
    commandRun.current?.abort();
    const controller = new AbortController();
    failureMotion.current?.cancel();
    commandRun.current = controller;
    setError("");
    try {
      const result = item.onSelect?.({ signal: controller.signal });
      if (!result) return setOpen(false);
      setRun({ id: item.id, state: "pending" });
      await result;
      if (controller.signal.aborted) return;
      setRun({ id: item.id, state: "done" });
      timer.current = window.setTimeout(
        () => setOpen(false),
        reduced ? 0 : 520,
      );
    } catch {
      if (controller.signal.aborted) return;
      setError(`${item.label} failed. Try again.`);
      setRun(null);
      if (!reduced)
        failureMotion.current =
          rowRefs.current[i]?.animate(
            [
              { transform: "none" },
              { transform: "translateX(-4px)" },
              { transform: "translateX(4px)" },
              { transform: "translateX(-2px)" },
              { transform: "none" },
            ],
            { duration: 380, easing: "ease-out" },
          ) ?? null;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Tab") {
      const controls = Array.from(
        overlayRef.current?.querySelectorAll<HTMLElement>(
          'input, button:not(:disabled), a[href], [tabindex="0"]',
        ) ?? [],
      ).filter(
        (el) => !el.closest("[inert]") && el.getClientRects().length > 0,
      );
      const index = controls.indexOf(document.activeElement as HTMLElement);
      e.preventDefault();
      controls[
        (index + (e.shiftKey ? -1 : 1) + controls.length) % controls.length
      ]?.focus();
      return;
    }
    if (e.key !== "Escape" && e.target !== inputRef.current) return;
    const moves: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowUp: active - 1,
      Home: 0,
      End: rows.length - 1,
    };
    if (e.key in moves && rows.length) {
      if ((e.key === "Home" || e.key === "End") && query) return;
      e.preventDefault();
      setActive((moves[e.key] + rows.length) % rows.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(active);
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (query) setQuery("");
      else if (stack.length) go(-1, stack.slice(0, -1));
      else setOpen(false);
    } else if (e.key === "Backspace" && !query && stack.length) {
      e.preventDefault();
      go(-1, stack.slice(0, -1));
    }
  };

  const duration = phase === "closing" ? CLOSE_DURATION : OPEN_DURATION;
  const final = mounted && portal ? target() : null;
  const shape = isOpen || !from ? final : from;
  const listVisible = Math.min(
    listHeight,
    LIST_MAX,
    Math.max(
      40,
      (viewport.height || 600) -
        ((final?.top ?? 0) - viewport.top) -
        52 -
        footerHeight -
        28,
    ),
  );
  const panelHeight = 52 + (listVisible ? listVisible + 12 : 0) + footerHeight;
  const empty = rows.length === 0;

  const triggerContent = (
    <>
      {triggerIcon && (
        <span
          aria-hidden="true"
          className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4 [&_img]:size-4"
        >
          {triggerIcon}
        </span>
      )}
      {triggerLabel}
    </>
  );

  const panel =
    mounted && final && shape ? (
      <div
        ref={overlayRef}
        className="cavemio-command-palette fixed inset-0 z-[100]"
        onKeyDown={onKeyDown}
        data-phase={phase}
      >
        {/* A faint veil over the page; clicking it closes. */}
        <div
          aria-hidden="true"
          onPointerDown={() => setOpen(false)}
          className="absolute inset-0 bg-background/55"
          style={{
            opacity: isOpen ? 1 : 0,
            transition: reduced ? "none" : `opacity ${duration}ms ${EASE}`,
          }}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          className="absolute overflow-hidden bg-popover text-popover-foreground"
          style={{
            left: shape.left,
            top: shape.top,
            width: shape.width,
            height: isOpen || !from ? panelHeight : from.height,
            borderRadius: shape.radius,
            backgroundColor: !isOpen && from ? "transparent" : "var(--popover)",
            boxShadow: "inset 0 0 0 1px var(--border)",
            opacity: !from && !isOpen ? 0 : 1,
            transform:
              !from && !isOpen ? "scale(0.97) translateY(-6px)" : "none",
            transition: reduced
              ? "none"
              : `left ${duration}ms ${EASE}, top ${duration}ms ${EASE}, width ${duration}ms ${EASE}, height ${duration}ms ${EASE}, border-radius ${duration}ms ${EASE}, background-color ${duration}ms ${EASE}, opacity 240ms ${EASE}, transform ${duration}ms ${EASE}`,
          }}
        >
          {(run || error) && (
            <p role="status" className="sr-only">
              {run
                ? `${rows.find((row) => row.item.id === run.id)?.item.label ?? "Command"}: ${run.state === "pending" ? "Running" : "Complete"}`
                : error}
            </p>
          )}
          {/* The pill's face, hotkey and all, fading as the panel grows out of it and back as it folds in. */}
          {from && (
            <span
              aria-hidden="true"
              data-command-trigger-copy=""
              className="pointer-events-none absolute left-0 top-0 flex items-center whitespace-nowrap"
              style={{
                height: from.height,
                opacity: isOpen ? 0 : 1,
                transition: reduced
                  ? "none"
                  : isOpen
                    ? "opacity 100ms ease-out"
                    : "opacity 140ms ease-out 160ms",
              }}
            >
              <Kbd hotkey={hotkey} label={triggerContent} />
            </span>
          )}

          <div
            inert={phase === "closing"}
            className="absolute left-0 top-0 flex flex-col"
            style={{
              width: final.width,
              opacity: isOpen ? 1 : 0,
              transition: reduced
                ? "none"
                : isOpen
                  ? "opacity 240ms ease-out 60ms"
                  : "opacity 100ms ease-out",
            }}
          >
            <div className="flex h-[52px] shrink-0 items-center gap-2.5 border-b border-border px-5">
              <SearchIcon className="text-muted-foreground" />
              {/* Where you are, as a chip that opens in when you go into a list. */}
              <span
                className="grid shrink-0"
                style={{
                  gridTemplateColumns: page ? "1fr" : "0fr",
                  opacity: page ? 1 : 0,
                  transition: reduced
                    ? "none"
                    : `grid-template-columns 360ms ${EASE}, opacity 240ms ${EASE}`,
                }}
              >
                <span className="min-w-0 overflow-hidden">
                  <span className="mr-0.5 flex h-6 items-center whitespace-nowrap rounded-md bg-muted px-2 text-[12px] font-medium text-foreground">
                    <TextMorph>{page?.title ?? ""}</TextMorph>
                  </span>
                </span>
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder={
                  page ? `Search ${page.title.toLowerCase()}…` : placeholder
                }
                aria-label={searchLabel}
                role="combobox"
                aria-expanded="true"
                aria-controls={`${id}-list`}
                aria-activedescendant={
                  rows.length ? `${id}-opt-${active}` : undefined
                }
                aria-autocomplete="list"
                spellCheck={false}
                className="h-full min-w-0 flex-1 bg-transparent text-[14.5px] text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                ref={closeRef}
                type="button"
                aria-label="Close search"
                onClick={() => setOpen(false)}
                className={`rounded-md p-1 ${FOCUS}`}
              >
                <Kbd>esc</Kbd>
              </button>
            </div>

            <div
              ref={listRef}
              className="relative overflow-y-auto overscroll-contain px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{
                height: listVisible ? listVisible + 12 : 0,
                transition:
                  reduced || !isOpen ? "none" : `height 300ms ${EASE}`,
              }}
            >
              <div ref={innerRef} className="relative py-1.5">
                {!page && filters.length > 0 && (
                  <div
                    className="border-b border-border px-3 py-2"
                    data-command-filters=""
                  >
                    <p className="mb-1 text-[12px] font-medium text-muted-foreground">
                      {filtersLabel}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {filters.map((filter) => (
                        <button
                          key={filter.id}
                          type="button"
                          aria-label={`Remove ${filter.label} filter`}
                          disabled={!onFilterRemove}
                          onClick={() => {
                            inputRef.current?.focus({ preventScroll: true });
                            onFilterRemove?.(filter.id);
                            setActive(0);
                          }}
                          className={`flex min-h-8 max-w-full items-center gap-1.5 rounded-lg bg-muted px-2.5 text-[12px] text-muted-foreground enabled:cursor-pointer enabled:hover:bg-accent enabled:hover:text-foreground ${FOCUS}`}
                        >
                          {filter.icon && (
                            <span
                              aria-hidden="true"
                              className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4 [&_img]:size-4"
                            >
                              {filter.icon}
                            </span>
                          )}
                          <span className="truncate">{filter.label}</span>
                          {onFilterRemove && (
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 16 16"
                              fill="none"
                              className="size-3.5 shrink-0"
                            >
                              <path
                                d="m4 4 8 8M12 4l-8 8"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {leaving.map((l) => (
                  <LeavingPane key={l.key} dir={l.dir} top={l.top}>
                    <Results
                      rows={l.rows}
                      active={l.active}
                      run={null}
                      reduced={reduced}
                    />
                  </LeavingPane>
                ))}
                <div ref={paneRef} key={stack.length} className="relative">
                  {!empty && (
                    <span
                      aria-hidden="true"
                      data-command-highlight=""
                      className="absolute inset-x-0 rounded-xl bg-accent"
                      style={{
                        top: 0,
                        height: ROW,
                        transform: `translateY(${highlight.top}px)`,
                        transition:
                          highlight.ready && !reduced
                            ? `transform 200ms ${EASE}`
                            : "none",
                      }}
                    />
                  )}
                  <Results
                    rows={rows}
                    active={active}
                    run={run}
                    reduced={reduced}
                    listId={`${id}-list`}
                    optionId={(i) => `${id}-opt-${i}`}
                    setActive={(i) => !run && setActive(i)}
                    choose={choose}
                    rowRefs={rowRefs}
                  />
                </div>
                {empty && (
                  <p
                    role="status"
                    className="flex min-w-0 items-center overflow-hidden px-3 text-[13px] text-muted-foreground"
                    style={{ height: ROW }}
                  >
                    <TextMorph>
                      {query
                        ? `No results for “${query.trim()}”`
                        : "Nothing here yet"}
                    </TextMorph>
                  </p>
                )}
              </div>
            </div>

            <div
              ref={footerRef}
              className="flex min-h-12 shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-border px-5 py-3 text-[12px] text-muted-foreground"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="flex items-center gap-1.5">
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd>Navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <Kbd>↵</Kbd>Select
                </span>
                {page && (
                  <span className="flex items-center gap-1.5">
                    <Kbd>⌫</Kbd>Back
                  </span>
                )}
              </div>
              {footer && (
                <div
                  data-command-footer=""
                  className="min-w-0 leading-5 [&_a]:underline [&_a]:underline-offset-4 [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-ring"
                >
                  {footer}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <div className={`inline-flex ${className}`} {...props}>
      <Kbd
        ref={triggerRef}
        hotkey={hotkey}
        label={triggerContent}
        onTrigger={(event) =>
          setOpen(
            event.type === "click" ||
              !(phase === "open" || phase === "opening"),
          )
        }
        stopPropagation
        hidden={!showTrigger}
        aria-label={triggerLabel}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        style={{
          display: showTrigger ? undefined : "none",
          opacity: mounted ? 0 : 1,
          transition:
            mounted || reduced || from ? "none" : "opacity 160ms ease-out",
        }}
      />
      {portal && panel ? createPortal(panel, portal) : null}
    </div>
  );
}

/** The page you left: it slides out toward the side you came from, then removes itself. */
function LeavingPane({
  dir,
  top,
  children,
}: {
  dir: number;
  top: number;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const animation = ref.current?.animate(
      [
        { opacity: 1, filter: "blur(0px)", transform: "none" },
        {
          opacity: 0,
          filter: "blur(4px)",
          transform: `translateX(${-dir * 28}px)`,
        },
      ],
      { duration: 240, easing: EASE, fill: "forwards" },
    );
    return () => animation?.cancel();
  }, [dir]);
  return (
    <div
      ref={ref}
      inert
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0"
      style={{ top }}
    >
      {children}
    </div>
  );
}
