"use client";

import * as React from "react";
import { ArrowUpRight, Package } from "lucide-react";
import { CopyButton } from "./copy-button";
import { NumberRoll } from "./number-roll";
import { StatusButton, type ActionStatus } from "./status-button";
import { TextMorph } from "./text-morph";
import { useRowMotion } from "./use-row-motion";
import {
  EASE_THROW,
  INTERACTION_FOCUS,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";

/* ─────────────────────────────────────────────────────────
 * ORDER STATUS: the parcel on its route
 *
 *   route     the lit card carries the order's route, Ordered →
 *             Packed → Shipped → Out for delivery → Delivered, as a
 *             thin line; a parcel rides it to where the order is
 *             and every stop it passes lights as it goes by
 *   arriving  the day it arrives is large; when the date moves the
 *             weekday morphs and the day rolls
 *   events    the carrier's scans, newest first; a new one slides
 *             in at the top
 *   cancel    before it ships, Cancel order asks once, then goes
 *             Cancelling → Cancelled and the route dims
 *
 * The order is yours: pass status, eta and events from your
 * database or the carrier's webhook (a refetch, a poll or a
 * socket); onCancel does the cancelling.
 * ───────────────────────────────────────────────────────── */

export type OrderStage = "ordered" | "packed" | "shipped" | "out" | "delivered";

export interface OrderEvent {
  id: string;
  at: Date | string | number;
  title: string;
  /** Where it happened, e.g. "Leeds depot". */
  place?: string;
}

export interface OrderStatusProps {
  /** Shown as "Order #HL-2048". */
  number: string;
  status: OrderStage | "cancelled";
  /** When it's expected; when it arrived once delivered. */
  eta?: Date | string | number;
  /** e.g. "by 9pm", after the date. */
  window?: string;
  /** Where it's going, one line. */
  address?: string;
  carrier?: string;
  tracking?: string;
  trackingUrl?: string;
  /** Newest first. */
  events?: OrderEvent[];
  /** Offered until the order ships; throw an Error to say why not. */
  onCancel?: () => Promise<unknown>;
  /** Events shown before Show all. */
  visibleEvents?: number;
  locale?: string;
  className?: string;
}

const STAGES: { id: OrderStage; label: string; short: string }[] = [
  { id: "ordered", label: "Order placed", short: "Ordered" },
  { id: "packed", label: "Packed", short: "Packed" },
  { id: "shipped", label: "Shipped", short: "Shipped" },
  { id: "out", label: "Out for delivery", short: "Out" },
  { id: "delivered", label: "Delivered", short: "Delivered" },
];
const EASE = "cubic-bezier(0.16,1,0.3,1)";
const RIDE = 1100;
const NONE: OrderEvent[] = [];

const subscribeNothing = () => () => {};
/** False on the server and while hydrating: text is formatted in one fixed locale until then, so the server's and the visitor's never disagree. */
const useHydrated = () =>
  React.useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );

const mix = (color: string, amount: number, into = "transparent") =>
  `color-mix(in oklab, ${color} ${amount}%, ${into})`;
const CARD_LIT: React.CSSProperties = {
  backgroundColor: "var(--primary)",
  backgroundImage: `radial-gradient(120% 80% at 0% 0%, ${mix("var(--primary-foreground)", 22)} 0%, transparent 55%), linear-gradient(175deg, transparent 40%, ${mix("black", 24)} 100%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 36)}, inset 0 0 0 1px ${mix("var(--primary-foreground)", 12)}`,
};
const CARD: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 95, "var(--foreground)")})`,
  boxShadow: `0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 85)}`,
};

export function OrderStatus({
  number,
  status,
  eta,
  window: timeWindow,
  address,
  carrier,
  tracking,
  trackingUrl,
  events = NONE,
  onCancel,
  visibleEvents = 3,
  locale,
  className = "",
}: OrderStatusProps) {
  const reduced = useInteractionReducedMotion();
  // Dates depend on the visitor's locale and time zone, so they're written once the block is in the browser.
  const hydrated = useHydrated();
  const baseId = React.useId();
  const [cancel, setCancel] = React.useState<{
    status: ActionStatus;
    confirm: boolean;
    error?: string;
  }>({ status: "idle", confirm: false });
  const [expanded, setExpanded] = React.useState(false);
  const listRef = React.useRef<HTMLOListElement>(null);
  const ghostRef = React.useRef<HTMLDivElement>(null);

  const cancelled = status === "cancelled" || cancel.status === "success";
  const at = Math.max(
    0,
    STAGES.findIndex((s) => s.id === status),
  );
  const stage = cancelled ? null : STAGES[at];
  const progress = at / (STAGES.length - 1);

  // Where the parcel set off from, so stops light up as it passes them, not all at once.
  const [from, setFrom] = React.useState(at);
  const [seenAt, setSeenAt] = React.useState(at);
  if (at !== seenAt) {
    setFrom(seenAt);
    setSeenAt(at);
  }
  const passDelay = (i: number) =>
    reduced || at <= from || i <= from
      ? 0
      : ((i - from) / (at - from)) * RIDE * 0.85;

  const fmt = React.useMemo(
    () => ({
      weekday: new Intl.DateTimeFormat(locale, { weekday: "long" }),
      month: new Intl.DateTimeFormat(locale, { month: "short" }),
      time: new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit",
      }),
      day: new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }),
    }),
    [locale],
  );
  const etaDate = eta !== undefined && hydrated ? new Date(eta) : null;

  const rows = expanded ? events : events.slice(0, visibleEvents);
  const ranks = React.useMemo(
    () => new Map(events.map((e, i) => [e.id, i])),
    [events],
  );
  useRowMotion(listRef, { reduced, ranks, ghosts: ghostRef });

  const canCancel =
    Boolean(onCancel) &&
    (cancel.status === "success" ||
      (!cancelled && (status === "ordered" || status === "packed")));
  const cancelOrder = async () => {
    if (!onCancel || cancel.status === "pending") return;
    if (!cancel.confirm) return setCancel({ status: "idle", confirm: true });
    setCancel({ status: "pending", confirm: true });
    try {
      await onCancel();
      setCancel({ status: "success", confirm: true });
    } catch (e) {
      setCancel({
        status: "error",
        confirm: true,
        error:
          e instanceof Error && e.message
            ? e.message
            : "Couldn’t cancel. Try again.",
      });
    }
  };

  React.useEffect(() => {
    if (!cancel.confirm || cancel.status !== "idle") return;
    const timer = window.setTimeout(
      () => setCancel({ status: "idle", confirm: false }),
      4000,
    );
    return () => window.clearTimeout(timer);
  }, [cancel]);

  const headline = cancelled
    ? "Cancelled"
    : status === "delivered"
      ? "Delivered"
      : "Arriving";

  return (
    <section
      aria-labelledby={`${baseId}-title`}
      className={`w-full max-w-[420px] rounded-[28px] p-2 text-card-foreground ${className}`}
      style={CARD}
    >
      {/* Its natural width where the parent sizes to its content, without forcing it on narrow screens. */}
      <div
        aria-hidden="true"
        data-natural-width
        className="grid h-0"
        style={{ gridTemplateColumns: "minmax(0, 420px)" }}
      />
      <div className="@container w-full">
        {/* The one lit surface: the arrival and the route. */}
        <div
          className="rounded-[22px] p-4 text-primary-foreground"
          style={{
            ...CARD_LIT,
            filter: cancelled ? "saturate(0.35)" : "none",
            transition: reduced ? "none" : `filter 500ms ${EASE}`,
          }}
        >
          <div className="flex items-center justify-between gap-3 text-[12.5px]">
            <h2
              id={`${baseId}-title`}
              className="font-mono text-primary-foreground/75"
            >
              Order #{number}
            </h2>
            <span
              className="rounded-full px-2 py-0.5 font-medium"
              style={{ background: mix("var(--primary-foreground)", 16) }}
              role="status"
            >
              <TextMorph>
                {cancelled ? "Cancelled" : (stage?.label ?? "")}
              </TextMorph>
            </span>
          </div>

          <p className="mt-3 text-[12.5px] text-primary-foreground/70">
            <TextMorph>{headline}</TextMorph>
          </p>
          <p
            className="mt-0.5 flex items-baseline gap-[0.28em] text-[30px] font-medium leading-none tracking-[-0.035em]"
            suppressHydrationWarning
          >
            {etaDate && !cancelled ? (
              <>
                <TextMorph>{fmt.weekday.format(etaDate)}</TextMorph>
                <span className="tabular-nums">
                  <NumberRoll value={etaDate.getDate()} duration={800} />
                </span>
                <TextMorph className="text-primary-foreground/70">
                  {fmt.month.format(etaDate)}
                </TextMorph>
              </>
            ) : (
              <span className="text-primary-foreground/60">
                {cancelled
                  ? "Not on its way"
                  : hydrated
                    ? "Date to follow"
                    : " "}
              </span>
            )}
          </p>
          {(timeWindow || address) && !cancelled && (
            <p className="mt-1.5 truncate text-[12.5px] text-primary-foreground/70">
              {[
                status === "delivered" ? null : timeWindow,
                address ? `to ${address}` : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}

          {/* The route: stops on a thin line, the parcel riding to where the order is. */}
          <div
            className="relative mt-5 px-3"
            style={{
              opacity: cancelled ? 0.5 : 1,
              transition: "opacity 400ms",
            }}
          >
            <div className="relative h-6">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
                style={{ background: mix("var(--primary-foreground)", 26) }}
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-1/2 h-[2px] origin-left -translate-y-1/2 rounded-full"
                style={{
                  background: "var(--primary-foreground)",
                  transform: `scaleX(${progress})`,
                  transition: reduced ? "none" : `transform ${RIDE}ms ${EASE}`,
                }}
              />
              <ol className="absolute inset-0 flex items-center justify-between">
                {STAGES.map((s, i) => {
                  const lit = !cancelled && i <= at;
                  return (
                    <li
                      key={s.id}
                      className="relative flex size-0 items-center justify-center"
                      aria-current={i === at && !cancelled ? "step" : undefined}
                    >
                      <span className="sr-only">{`${s.label}${lit ? (i === at ? ", current" : ", done") : ""}`}</span>
                      <span
                        aria-hidden="true"
                        className="absolute size-2.5 rounded-full"
                        style={{
                          background: lit
                            ? "var(--primary-foreground)"
                            : "var(--primary)",
                          boxShadow: `0 0 0 1.5px ${lit ? "var(--primary-foreground)" : mix("var(--primary-foreground)", 45)}`,
                          transform:
                            lit && !reduced ? "scale(1)" : "scale(0.8)",
                          transition: reduced
                            ? "none"
                            : `background-color 240ms ${EASE} ${passDelay(i)}ms, transform 420ms ${EASE_THROW} ${passDelay(i)}ms, box-shadow 240ms ${passDelay(i)}ms`,
                        }}
                      />
                    </li>
                  );
                })}
              </ol>
              {/* The parcel rides the right edge of a full-width layer that slides in from the left: one composited transform,
                    and nothing past the card's right edge to scroll to. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  transform: `translateX(${(progress - 1) * 100}%)`,
                  transition: reduced ? "none" : `transform ${RIDE}ms ${EASE}`,
                }}
              >
                <span
                  className="absolute right-0 top-1/2 flex size-7 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[9px]"
                  style={{
                    background: "var(--primary-foreground)",
                    color: "var(--primary)",
                    boxShadow: `0 0 0 3px ${mix("var(--primary-foreground)", 22)}`,
                    opacity: cancelled ? 0 : 1,
                    transition: "opacity 300ms",
                  }}
                >
                  <Package className="size-4" strokeWidth={1.9} />
                </span>
              </span>
            </div>
            <div aria-hidden="true" className="relative mt-2 h-4 text-[11px]">
              {STAGES.map((s, i) => (
                <span
                  key={s.id}
                  className="absolute top-0 whitespace-nowrap"
                  style={{
                    left: `${(i / (STAGES.length - 1)) * 100}%`,
                    transform:
                      i === 0
                        ? "translateX(-12px)"
                        : i === STAGES.length - 1
                          ? "translateX(calc(-100% + 12px))"
                          : "translateX(-50%)",
                    color:
                      !cancelled && i <= at
                        ? "var(--primary-foreground)"
                        : mix("var(--primary-foreground)", 55),
                    fontWeight: i === at && !cancelled ? 500 : 400,
                    transition: `color 240ms ${passDelay(i)}ms`,
                  }}
                >
                  {s.short}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Flat: tracking, the scans, and Cancel while it can be. */}
        {(carrier || tracking) && (
          <div className="mx-1 mt-2 flex h-10 items-center gap-2 rounded-full px-3 text-[13px] shadow-[inset_0_0_0_1px_var(--border)]">
            <span className="shrink-0 text-muted-foreground">
              {carrier ?? "Tracking"}
            </span>
            {tracking && (
              <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-foreground">
                {tracking}
              </span>
            )}
            {tracking && (
              <CopyButton
                text={tracking}
                label="Copy tracking number"
                size="sm"
                variant="ghost"
                className="shrink-0"
              />
            )}
            {trackingUrl && (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noreferrer"
                className={`-mr-1 inline-flex h-7 shrink-0 items-center gap-0.5 rounded-full px-2 text-[12.5px] text-primary hover:bg-primary/10 ${INTERACTION_FOCUS}`}
              >
                Track
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </a>
            )}
          </div>
        )}

        {events.length > 0 && (
          <div className="px-3 pb-1 pt-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[12.5px] font-normal text-muted-foreground">
                Updates
              </h3>
              {events.length > visibleEvents && (
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setExpanded((v) => !v)}
                  className={`-mr-2 cursor-pointer rounded-full px-2 py-1 text-[12.5px] text-foreground hover:bg-accent ${INTERACTION_FOCUS}`}
                >
                  <TextMorph>
                    {expanded ? "Show less" : `Show all ${events.length}`}
                  </TextMorph>
                </button>
              )}
            </div>
            <div className="relative mt-1">
              <div
                ref={ghostRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              />
              <ol ref={listRef} className="relative">
                {rows.map((e, i) => {
                  const when = new Date(e.at);
                  return (
                    <li
                      key={e.id}
                      data-row-id={e.id}
                      className="relative flex gap-3 py-2 pl-4"
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute left-0 top-[13px] size-[7px] rounded-full ${i === 0 && !cancelled ? "bg-primary shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_18%,transparent)]" : "bg-border"}`}
                      />
                      {i < rows.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="absolute bottom-[-7px] left-[3px] top-[24px] w-px bg-border"
                        />
                      )}
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-[13.5px] ${i === 0 ? "font-medium text-foreground" : "text-foreground/85"}`}
                        >
                          {e.title}
                        </span>
                        {e.place && (
                          <span className="block truncate text-[12px] text-muted-foreground">
                            {e.place}
                          </span>
                        )}
                      </span>
                      <span
                        className="shrink-0 pt-px text-right text-[12px] tabular-nums text-muted-foreground"
                        suppressHydrationWarning
                      >
                        {hydrated ? fmt.day.format(when) : ""}
                        <span className="block">
                          {hydrated ? fmt.time.format(when) : ""}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        )}

        {canCancel && (
          <div className="flex flex-col items-center px-3 pb-1.5 pt-1">
            <StatusButton
              variant="ghost"
              status={cancel.status}
              labels={{
                idle: cancel.confirm
                  ? "Yes, cancel this order"
                  : "Cancel order",
                pending: "Cancelling",
                success: "Cancelled",
                error: "Try again",
              }}
              onClick={() => void cancelOrder()}
              className={`h-9 px-4 text-[13px] ${cancel.confirm && cancel.status === "idle" ? "text-red-600 hover:text-red-600 dark:text-red-400 dark:hover:text-red-400" : ""}`}
            />
            {cancel.error && (
              <p
                role="alert"
                className="mt-1 text-center text-[12px] text-red-600 dark:text-red-400"
              >
                {cancel.error}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default OrderStatus;
