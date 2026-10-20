"use client";

import * as React from "react";
import { ArrowDownToLine, ChevronLeft } from "lucide-react";
import { Faces, FACES_MORPH } from "./faces";
import { NumberRoll } from "./number-roll";
import { SegmentedControl } from "./segmented-control";
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
 * SUBSCRIPTION: a plan you can see through to its next bill
 *
 *   plan      the lit card holds the plan, its price and a ring
 *             that fills through the billing period, the days left
 *             in its middle; under it usage, the card on file and
 *             invoices, all flat
 *   pause     Cancel plan turns the lower half into "Pause
 *             instead?": pick one, two or three months and the date
 *             billing resumes rolls to match
 *   cancel    only past the offer, a reason and a note, then
 *             Cancel subscription; the card says when it ends
 *   resume    a paused or ending plan offers Resume in place
 *
 * Billing is yours: pass the plan, status, period and usage from
 * your provider, and do the work in onPause, onCancel, onResume and
 * onUpdateCard (open your provider's portal there). Throw an Error
 * and its message shows where it happened.
 * ───────────────────────────────────────────────────────── */

export type SubscriptionStatus =
  "active" | "trialing" | "past_due" | "paused" | "canceling";

export interface SubscriptionPlan {
  name: string;
  /** Per interval, major units. */
  price: number;
  interval: "month" | "year";
  seats?: number;
}

export interface SubscriptionUsage {
  id: string;
  label: string;
  used: number;
  limit: number;
  /** e.g. "runs", "GB". */
  unit?: string;
}

export interface SubscriptionCard {
  /** e.g. "Visa". */
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface SubscriptionInvoice {
  id: string;
  date: Date | string | number;
  amount: number;
  status: "paid" | "open" | "failed";
  /** A PDF or hosted invoice page. */
  url?: string;
}

export interface SubscriptionProps {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  periodStart: Date | string | number;
  /** When it renews, or ends while canceling. */
  periodEnd: Date | string | number;
  /** When billing resumes, while paused. */
  resumesAt?: Date | string | number;
  usage?: SubscriptionUsage[];
  card?: SubscriptionCard;
  invoices?: SubscriptionInvoice[];
  /** Open your provider's portal (or a form) to change the card. */
  onUpdateCard?: () => Promise<unknown>;
  /** Go to your plans, e.g. the Pricing plans block. */
  onChangePlan?: () => void;
  /** Pause billing for this many months; shows the offer before cancelling. */
  onPause?: (months: number) => Promise<unknown>;
  onCancel?: (reason: string, comment: string) => Promise<unknown>;
  /** Undo a pause or a cancel that hasn't ended yet. */
  onResume?: () => Promise<unknown>;
  pauseMonths?: number[];
  reasons?: string[];
  currency?: string;
  locale?: string;
  className?: string;
}

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const DAY = 86_400_000;
const PAUSE = [1, 2, 3];
const REASONS = [
  "Too expensive",
  "Not using it enough",
  "Missing a feature",
  "Switching to another tool",
  "Something else",
];
const NONE: never[] = [];
const subscribeNothing = () => () => {};
/** False on the server and while hydrating, so dates are written once, in the visitor's own zone. */
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
  backgroundImage: `radial-gradient(120% 90% at 100% 0%, ${mix("var(--primary-foreground)", 22)} 0%, transparent 55%), linear-gradient(175deg, transparent 40%, ${mix("black", 24)} 100%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 36)}, inset 0 0 0 1px ${mix("var(--primary-foreground)", 12)}`,
};
const CARD: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 95, "var(--foreground)")})`,
  boxShadow: `0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 85)}`,
};
const ACTION: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${mix("var(--primary-foreground)", 16)}, transparent 60%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 32)}, inset 0 0 0 1px ${mix("black", 10)}`,
};
const errorOf = (e: unknown, fallback: string) =>
  e instanceof Error && e.message ? e.message : fallback;
const addMonths = (t: number, m: number) => {
  const d = new Date(t);
  d.setMonth(d.getMonth() + m);
  return d.getTime();
};

/** The billing period as a ring: how far through it you are, the days left in the middle. */
function PeriodRing({
  share,
  days,
  dim,
  reduced,
}: {
  share: number;
  days: number | null;
  dim: boolean;
  reduced: boolean;
}) {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <span
      className="relative flex size-[56px] shrink-0 items-center justify-center"
      style={{ opacity: dim ? 0.55 : 1, transition: "opacity 400ms" }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 56 56"
        className="absolute inset-0 size-full -rotate-90"
      >
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke={mix("var(--primary-foreground)", 22)}
          strokeWidth="3"
        />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke="var(--primary-foreground)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          style={{
            strokeDashoffset: c * (1 - share),
            transition: reduced ? "none" : `stroke-dashoffset 900ms ${EASE}`,
          }}
        />
        {/* Fine ticks round the ring, one per week of the period. */}
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={i}
            x1="28"
            y1="1.5"
            x2="28"
            y2="3.5"
            stroke={mix("var(--primary-foreground)", 35)}
            strokeWidth="0.8"
            transform={`rotate(${i * 30} 28 28)`}
          />
        ))}
      </svg>
      <span className="relative text-center leading-none">
        <span className="block text-[16px] font-medium tabular-nums">
          {days === null ? "–" : <NumberRoll value={days} duration={800} />}
        </span>
        <span className="mt-0.5 block text-[9.5px] uppercase tracking-[0.08em] text-primary-foreground/70">
          {days === 1 ? "day" : "days"}
        </span>
      </span>
    </span>
  );
}

export function Subscription({
  plan,
  status,
  periodStart,
  periodEnd,
  resumesAt,
  usage = NONE,
  card,
  invoices = NONE,
  onUpdateCard,
  onChangePlan,
  onPause,
  onCancel,
  onResume,
  pauseMonths = PAUSE,
  reasons = REASONS,
  currency = "USD",
  locale,
  className = "",
}: SubscriptionProps) {
  const reduced = useInteractionReducedMotion();
  const hydrated = useHydrated();
  const baseId = React.useId();
  const loc = locale ?? (hydrated ? undefined : "en-US");
  const [now, setNow] = React.useState<number | null>(null);
  const [ready, setReady] = React.useState(false);
  const [step, setStep] = React.useState<0 | 1 | 2>(0);
  const [months, setMonths] = React.useState(
    pauseMonths[Math.min(1, pauseMonths.length - 1)] ?? 1,
  );
  const [reason, setReason] = React.useState<string | null>(null);
  const [comment, setComment] = React.useState("");
  const [act, setAct] = React.useState<{
    kind: "pause" | "cancel" | "resume" | "card" | null;
    status: ActionStatus;
    error?: string;
  }>({ kind: null, status: "idle" });
  const [said, setSaid] = React.useState("");
  const faceRefs = React.useRef<(HTMLElement | null)[]>([]);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setNow(Date.now());
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const start = new Date(periodStart).getTime();
  const end = new Date(periodEnd).getTime();
  const share =
    now === null ? 0 : Math.min(1, Math.max(0, (now - start) / (end - start)));
  // While paused the ring counts down to when billing comes back, not to the old renewal.
  const until =
    status === "paused" && resumesAt !== undefined
      ? new Date(resumesAt).getTime()
      : end;
  const daysLeft =
    now === null ? null : Math.max(0, Math.ceil((until - now) / DAY));
  const date = (t: Date | string | number) =>
    hydrated
      ? new Intl.DateTimeFormat(loc, {
          month: "short",
          day: "numeric",
          year:
            new Date(t).getFullYear() !== new Date(now ?? end).getFullYear()
              ? "numeric"
              : undefined,
        }).format(new Date(t))
      : "";
  const money = (n: number) =>
    new Intl.NumberFormat(loc, {
      style: "currency",
      currency,
      minimumFractionDigits: n % 1 ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(n);
  const resumeAt = addMonths(end, months);
  const busy = act.status === "pending" || act.status === "success";

  const state =
    status === "paused"
      ? `Paused until ${date(resumesAt ?? end)}`
      : status === "canceling"
        ? `Ends ${date(end)}`
        : status === "trialing"
          ? `Trial ends ${date(end)}`
          : status === "past_due"
            ? "Payment failed"
            : `Renews ${date(end)}`;

  const go = (s: 0 | 1 | 2) => {
    if (busy) return;
    setStep(s);
    setAct({ kind: null, status: "idle" });
    // Focus follows once the surface is mostly turned.
    window.setTimeout(
      () => faceRefs.current[s]?.focus({ preventScroll: true }),
      reduced ? 0 : FACES_MORPH / 2,
    );
  };

  const run = async (
    kind: "pause" | "cancel" | "resume" | "card",
    fn: (() => Promise<unknown>) | undefined,
    done: string,
  ) => {
    if (!fn || busy) return;
    setAct({ kind, status: "pending" });
    try {
      await fn();
      setAct({ kind, status: "success" });
      setSaid(done);
      window.setTimeout(
        () => {
          if (kind !== "card") setStep(0);
          setAct({ kind: null, status: "idle" });
        },
        kind === "card" ? 1200 : reduced ? 600 : 900,
      );
    } catch (e) {
      setAct({
        kind,
        status: "error",
        error: errorOf(e, "That didn’t go through. Try again."),
      });
    }
  };

  const st = (kind: "pause" | "cancel" | "resume" | "card") =>
    act.kind === kind ? act.status : "idle";
  const ghost = `inline-flex h-10 cursor-pointer items-center justify-center rounded-full px-4 text-[13.5px] font-medium ${INTERACTION_PRESS} ${INTERACTION_FOCUS}`;
  const ending = status === "paused" || status === "canceling";

  return (
    <section
      aria-labelledby={`${baseId}-plan`}
      className={`w-full max-w-[440px] rounded-[28px] p-2 text-card-foreground ${className}`}
      style={CARD}
    >
      {/* Its natural width where the parent sizes to its content, without forcing it on narrow screens. */}
      <div
        aria-hidden="true"
        data-natural-width
        className="grid h-0"
        style={{ gridTemplateColumns: "minmax(0, 440px)" }}
      />
      <div className="@container w-full">
        {/* The one lit surface: the plan, and the ring of its billing period. */}
        <div
          className="rounded-[22px] p-4 text-primary-foreground"
          style={{
            ...LIT,
            filter: ending ? "saturate(0.55)" : "none",
            transition: reduced ? "none" : `filter 500ms ${EASE}`,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[12.5px] text-primary-foreground/70">
                Your plan
              </p>
              <h2
                id={`${baseId}-plan`}
                className="mt-0.5 text-[20px] font-medium leading-tight tracking-[-0.02em]"
              >
                {plan.name}
                {plan.seats ? (
                  <span className="text-primary-foreground/70">
                    {" "}
                    · {plan.seats} seats
                  </span>
                ) : null}
              </h2>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-[30px] font-medium leading-none tracking-[-0.04em] tabular-nums">
                  <NumberRoll
                    value={plan.price}
                    locales={locale}
                    format={{
                      style: "currency",
                      currency,
                      minimumFractionDigits: plan.price % 1 ? 2 : 0,
                      maximumFractionDigits: 2,
                    }}
                    duration={800}
                  />
                </span>
                <span className="text-[13px] text-primary-foreground/70">
                  /{plan.interval === "year" ? "yr" : "mo"}
                </span>
              </p>
            </div>
            <PeriodRing
              share={ending ? 1 : share}
              days={daysLeft}
              dim={ending}
              reduced={reduced}
            />
          </div>
          <p
            className={`mt-3 inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[12.5px] font-medium ${status === "past_due" ? "text-amber-200" : ""}`}
            style={{ background: mix("var(--primary-foreground)", 14) }}
            role="status"
          >
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${status === "past_due" ? "bg-amber-400" : ending ? "bg-primary-foreground/55" : "bg-emerald-300"}`}
            />
            <TextMorph>{hydrated ? state : " "}</TextMorph>
          </p>
        </div>

        {/* Flat: the details, or the way out, which always offers a pause first. */}
        <Faces active={step} reduced={reduced} ready={ready}>
          <div
            ref={(el) => {
              faceRefs.current[0] = el;
            }}
            tabIndex={-1}
            className="px-2 pb-1 pt-1 outline-none"
          >
            {usage.length > 0 && (
              <div className="space-y-2.5 px-1 pt-3">
                {usage.map((u) => {
                  const pct = Math.min(1, u.used / u.limit);
                  const hot = pct >= 0.9;
                  return (
                    <div key={u.id}>
                      <div className="flex items-baseline justify-between gap-3 text-[13px]">
                        <span className="text-foreground">{u.label}</span>
                        <span className="tabular-nums text-muted-foreground">
                          <NumberRoll
                            value={u.used}
                            locales={locale}
                            className={
                              hot
                                ? "font-medium text-amber-600 dark:text-amber-400"
                                : "text-foreground"
                            }
                          />{" "}
                          / {new Intl.NumberFormat(loc).format(u.limit)}
                          {u.unit ? ` ${u.unit}` : ""}
                        </span>
                      </div>
                      <div
                        className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted"
                        role="meter"
                        aria-label={u.label}
                        aria-valuemin={0}
                        aria-valuemax={u.limit}
                        aria-valuenow={u.used}
                      >
                        <span
                          className={`block h-full origin-left rounded-full ${hot ? "bg-amber-500" : "bg-primary"}`}
                          style={{
                            transform: `scaleX(${ready ? pct : 0})`,
                            transition: reduced
                              ? "none"
                              : `transform 900ms ${EASE}`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {card && (
              <div className="mt-3 flex h-12 items-center gap-3 border-t border-border px-1 pt-3">
                <span
                  aria-hidden="true"
                  className="flex h-7 w-10 shrink-0 items-center justify-center rounded-[6px] border border-border bg-background font-mono text-[9px] font-medium uppercase tracking-[0.06em] text-foreground"
                >
                  {card.brand.slice(0, 4)}
                </span>
                <span className="min-w-0 flex-1 text-[13px]">
                  <span className="block truncate text-foreground">
                    {card.brand} •••• {card.last4}
                  </span>
                  <span className="block text-[12px] text-muted-foreground">
                    Expires {String(card.expMonth).padStart(2, "0")}/
                    {String(card.expYear).slice(-2)}
                  </span>
                </span>
                {onUpdateCard && (
                  <StatusButton
                    variant="ghost"
                    size="sm"
                    status={st("card")}
                    labels={{
                      idle: "Update",
                      pending: "Opening",
                      success: "Opened",
                      error: "Try again",
                    }}
                    onClick={() =>
                      void run("card", onUpdateCard, "Opened the payment page.")
                    }
                    className="-mr-1 shrink-0 text-foreground"
                  />
                )}
              </div>
            )}
            {act.kind === "card" && act.error && (
              <p
                role="alert"
                className="px-1 pt-1 text-[12px] text-red-600 dark:text-red-400"
              >
                {act.error}
              </p>
            )}

            {invoices.length > 0 && (
              <div className="mt-3 border-t border-border px-1 pt-2.5">
                <p className="text-[12px] text-muted-foreground">Invoices</p>
                <ul className="mt-1">
                  {invoices.slice(0, 3).map((inv) => (
                    <li
                      key={inv.id}
                      className="flex h-9 items-center gap-3 text-[13px]"
                    >
                      <span className="min-w-0 flex-1 text-foreground">
                        {date(inv.date)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${inv.status === "paid" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : inv.status === "open" ? "bg-amber-500/10 text-amber-700 dark:text-amber-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}
                      >
                        {inv.status === "paid"
                          ? "Paid"
                          : inv.status === "open"
                            ? "Open"
                            : "Failed"}
                      </span>
                      <span className="w-[72px] text-right tabular-nums text-foreground">
                        {money(inv.amount)}
                      </span>
                      {inv.url ? (
                        <a
                          href={inv.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Download the invoice of ${date(inv.date)}`}
                          className={`-mr-1 flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground ${INTERACTION_FOCUS}`}
                        >
                          <ArrowDownToLine
                            aria-hidden="true"
                            className="size-3.5"
                          />
                        </a>
                      ) : (
                        <span className="w-6" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-2.5 flex gap-2 border-t border-border pt-3">
              {ending && onResume ? (
                <StatusButton
                  status={st("resume")}
                  labels={{
                    idle: status === "paused" ? "Resume now" : "Keep my plan",
                    pending: "Resuming",
                    success: "Resumed",
                    error: "Try again",
                  }}
                  onClick={() =>
                    void run("resume", onResume, "Your plan is back on.")
                  }
                  className="h-10 flex-1 text-[13.5px]"
                  style={st("resume") === "error" ? undefined : ACTION}
                />
              ) : (
                onChangePlan && (
                  <button
                    type="button"
                    onClick={onChangePlan}
                    className={`${ghost} flex-1 text-foreground shadow-[inset_0_0_0_1px_var(--border)] hover:bg-accent`}
                  >
                    Change plan
                  </button>
                )
              )}
              {!ending && (onPause || onCancel) && (
                <button
                  type="button"
                  onClick={() => go(onPause ? 1 : 2)}
                  className={`${ghost} text-muted-foreground hover:bg-accent hover:text-foreground`}
                >
                  Cancel plan
                </button>
              )}
            </div>
            {act.kind === "resume" && act.error && (
              <p
                role="alert"
                className="px-1 pt-1.5 text-[12px] text-red-600 dark:text-red-400"
              >
                {act.error}
              </p>
            )}
          </div>

          {/* Before you go: a pause, with the date it all comes back. */}
          <div
            ref={(el) => {
              faceRefs.current[1] = el;
            }}
            tabIndex={-1}
            role="group"
            aria-labelledby={`${baseId}-pause`}
            className="px-3 pb-1.5 pt-3.5 outline-none"
          >
            <h3
              id={`${baseId}-pause`}
              className="text-[16px] font-medium tracking-[-0.01em]"
            >
              Pause instead?
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              Keep everything as it is and pick up where you left off. You won’t
              be charged while it’s paused.
            </p>
            <SegmentedControl
              label="Pause for"
              block
              className="mt-3"
              value={String(months)}
              onValueChange={(v) => setMonths(Number(v))}
              options={pauseMonths.map((m) => ({
                value: String(m),
                label: m === 1 ? "1 month" : `${m} months`,
              }))}
            />
            <p className="mt-2.5 text-[13px] text-muted-foreground">
              Billing resumes on{" "}
              <TextMorph className="font-medium text-foreground">
                {hydrated ? date(resumeAt) : " "}
              </TextMorph>
            </p>
            <StatusButton
              status={st("pause")}
              labels={{
                idle:
                  months === 1
                    ? "Pause for 1 month"
                    : `Pause for ${months} months`,
                pending: "Pausing",
                success: "Paused",
                error: "Try again",
              }}
              onClick={() =>
                void run(
                  "pause",
                  onPause && (() => onPause(months)),
                  `Paused for ${months} months.`,
                )
              }
              className="mt-3.5 h-11 w-full text-[14.5px]"
              style={st("pause") === "error" ? undefined : ACTION}
            />
            {act.kind === "pause" && act.error && (
              <p
                role="alert"
                className="mt-1.5 text-center text-[12px] text-red-600 dark:text-red-400"
              >
                {act.error}
              </p>
            )}
            <div className="mt-1.5 flex justify-between">
              <button
                type="button"
                onClick={() => go(0)}
                disabled={busy}
                className={`${ghost} -ml-2 h-9 px-3 text-muted-foreground hover:bg-accent hover:text-foreground`}
              >
                Keep my plan
              </button>
              {onCancel && (
                <button
                  type="button"
                  onClick={() => go(2)}
                  disabled={busy}
                  className={`${ghost} -mr-2 h-9 px-3 text-muted-foreground hover:bg-accent hover:text-foreground`}
                >
                  No, cancel it
                </button>
              )}
            </div>
          </div>

          {/* Cancel: a reason, then the end date. */}
          <div
            ref={(el) => {
              faceRefs.current[2] = el;
            }}
            tabIndex={-1}
            role="group"
            aria-labelledby={`${baseId}-cancel`}
            className="px-3 pb-1.5 pt-3 outline-none"
          >
            <div className="-ml-1.5 flex items-center gap-1">
              <button
                type="button"
                aria-label="Back"
                disabled={busy}
                onClick={() => go(onPause ? 1 : 0)}
                className={`flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground ${INTERACTION_PRESS} ${INTERACTION_FOCUS}`}
              >
                <ChevronLeft aria-hidden="true" className="size-[18px]" />
              </button>
              <h3
                id={`${baseId}-cancel`}
                className="text-[16px] font-medium tracking-[-0.01em]"
              >
                Why are you leaving?
              </h3>
            </div>
            <div
              role="radiogroup"
              aria-labelledby={`${baseId}-cancel`}
              className="mt-2.5 flex flex-wrap gap-1.5"
            >
              {reasons.map((r) => {
                const on = r === reason;
                return (
                  <button
                    key={r}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    disabled={busy}
                    onClick={() => setReason(r)}
                    className={`h-8 cursor-pointer rounded-full px-3 text-[12.5px] ${INTERACTION_PRESS} ${INTERACTION_FOCUS} ${on ? "bg-primary/[0.08] font-medium text-primary shadow-[inset_0_0_0_1.5px_var(--primary)]" : "text-foreground shadow-[inset_0_0_0_1px_var(--border)] hover:bg-accent"}`}
                    style={{
                      transition: reduced
                        ? "none"
                        : `box-shadow 260ms ${EASE_THROW}, background-color 200ms`,
                    }}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
            <Textarea
              aria-label="Anything we could have done better?"
              placeholder="Anything we could have done better? (optional)"
              value={comment}
              onValueChange={setComment}
              disabled={busy}
              minRows={2}
              maxRows={4}
              maxLength={500}
              showCount={false}
              className="mt-2.5"
            />
            <StatusButton
              variant="outline"
              status={st("cancel")}
              labels={{
                idle: "Cancel subscription",
                pending: "Cancelling",
                success: "Cancelled",
                error: "Try again",
              }}
              disabled={!reason && st("cancel") === "idle"}
              onClick={() =>
                void run(
                  "cancel",
                  onCancel && (() => onCancel(reason ?? "", comment.trim())),
                  `Cancelled. ${plan.name} stays on until ${date(end)}.`,
                )
              }
              className="mt-2.5 h-11 w-full text-[14.5px] text-red-600 disabled:opacity-45 dark:text-red-400"
            />
            <p
              role={act.kind === "cancel" && act.error ? "alert" : undefined}
              className={`mt-1.5 text-center text-[12px] ${act.kind === "cancel" && act.error ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
            >
              {act.kind === "cancel" && act.error
                ? act.error
                : hydrated
                  ? `You keep ${plan.name} until ${date(end)}.`
                  : " "}
            </p>
          </div>
        </Faces>

        <span className="sr-only" role="status">
          {said}
        </span>
      </div>
    </section>
  );
}

export default Subscription;
