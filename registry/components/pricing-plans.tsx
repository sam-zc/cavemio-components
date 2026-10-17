"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { Faces, FACES_MORPH } from "./faces";
import { NumberRoll } from "./number-roll";
import { PricingToggle } from "./pricing-toggle";
import { StatusButton, type ActionStatus } from "./status-button";
import { StepperInput } from "./stepper-input";
import { TextMorph } from "./text-morph";
import {
  INTERACTION_FOCUS,
  INTERACTION_PRESS,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";

/* ─────────────────────────────────────────────────────────
 * PRICING PLANS: plans that turn into their own checkout
 *
 *   plans     flat thin line cards; the featured plan is the lit
 *             surface, ruled with fine ledger fine lines. Billing
 *             toggles roll every price the way it moved
 *   choose    the plan you pick turns into its checkout in place,
 *             a slip on the same card: seats on a stepper, the
 *             line items and the total rolling as seats or billing
 *             change, while the other plans step back
 *   checkout  Continue goes Opening checkout → Redirecting through
 *             your onCheckout (create the Stripe or Paddle session
 *             there); a failure keeps the slip and says why
 *   current   with currentPlanId, buttons read Current plan,
 *             Upgrade or Downgrade, for a billing settings page
 * ───────────────────────────────────────────────────────── */

export type Billing = "monthly" | "yearly";

export interface PricingPlan {
  id: string;
  name: string;
  description?: string;
  /** Per month, in major units; per seat when perSeat. Yearly is the monthly rate when billed yearly. */
  price: { monthly: number; yearly: number };
  perSeat?: boolean;
  minSeats?: number;
  maxSeats?: number;
  features: string[];
  /** The plan on the lit surface. */
  featured?: boolean;
  /** A short tag beside the name, e.g. "Most popular". */
  badge?: string;
  /** Button label; defaults to "Get <name>", "Start free" or Upgrade / Downgrade. */
  cta?: string;
  /** A link instead of checkout, e.g. "Contact sales" for an enterprise plan. */
  href?: string;
}

export interface PricingCheckout {
  plan: PricingPlan;
  billing: Billing;
  seats: number;
  /** What's due now, in major units: a month, or a year when billed yearly. */
  total: number;
}

export interface PricingPlansProps {
  plans: PricingPlan[];
  billing?: Billing;
  defaultBilling?: Billing;
  onBillingChange?: (billing: Billing) => void;
  /** The plan the account is on, for a billing settings page. */
  currentPlanId?: string;
  /** Start checkout; resolve once you're redirecting (or done), throw an Error to show its message. */
  onCheckout?: (checkout: PricingCheckout) => Promise<unknown>;
  currency?: string;
  locale?: string;
  className?: string;
}

const EASE = "cubic-bezier(0.16,1,0.3,1)";

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

/* The lit plan: --primary with a lit corner from --primary-foreground, a deeper lower edge and 1px light edges. */
const LIT_SURFACE: React.CSSProperties = {
  backgroundColor: "var(--primary)",
  backgroundImage: `radial-gradient(120% 90% at 0% 0%, ${mix("var(--primary-foreground)", 22)} 0%, transparent 55%), linear-gradient(170deg, transparent 45%, ${mix("black", 22)} 100%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 36)}, inset 0 0 0 1px ${mix("var(--primary-foreground)", 12)}`,
};
/* Its signature: fine ledger rules, fading out from the top right. */
const LEDGER: React.CSSProperties = {
  backgroundImage: `repeating-linear-gradient(180deg, transparent 0 11px, ${mix("var(--primary-foreground)", 10)} 11px 12px)`,
  maskImage: "radial-gradient(130% 80% at 100% 0%, black 0%, transparent 70%)",
  WebkitMaskImage:
    "radial-gradient(130% 80% at 100% 0%, black 0%, transparent 70%)",
};
const LIT_ACTION: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${mix("var(--primary-foreground)", 16)}, transparent 60%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 32)}, inset 0 0 0 1px ${mix("black", 10)}`,
};
const COLS: Record<number, string> = {
  1: "",
  2: "@[640px]:grid-cols-2",
  3: "@[640px]:grid-cols-3",
  4: "@[760px]:grid-cols-2 @[1040px]:grid-cols-4",
};

function useMoney(locale: string | undefined, currency: string) {
  return React.useMemo(() => {
    const whole = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    const cents = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    });
    return { format: (n: number) => (n % 1 ? cents : whole).format(n) };
  }, [locale, currency]);
}

const priceFormat = (
  currency: string,
  n: number,
): Intl.NumberFormatOptions => ({
  style: "currency",
  currency,
  minimumFractionDigits: n % 1 ? 2 : 0,
  maximumFractionDigits: n % 1 ? 2 : 0,
});

export function PricingPlans({
  plans,
  billing: billingProp,
  defaultBilling = "monthly",
  onBillingChange,
  currentPlanId,
  onCheckout,
  currency = "USD",
  locale,
  className = "",
}: PricingPlansProps) {
  const reduced = useInteractionReducedMotion();
  const hydrated = useHydrated();
  const money = useMoney(locale ?? (hydrated ? undefined : "en-US"), currency);
  const baseId = React.useId();
  const [ownBilling, setOwnBilling] = React.useState<Billing>(defaultBilling);
  const billing = billingProp ?? ownBilling;
  const [dir, setDir] = React.useState(1);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [seats, setSeats] = React.useState<Record<string, number>>({});
  const [status, setStatus] = React.useState<{
    id: string;
    status: ActionStatus;
    error?: string;
  } | null>(null);
  const [ready, setReady] = React.useState(false);
  const slipRefs = React.useRef(new Map<string, HTMLDivElement>());
  const ctaRefs = React.useRef(new Map<string, HTMLElement>());

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  React.useEffect(() => {
    if (!ready || !openId) return;
    slipRefs.current.get(openId)?.focus({ preventScroll: true });
  }, [openId, ready]);

  const setBilling = (next: Billing) => {
    if (next === billing) return;
    setDir(next === "yearly" ? 1 : -1);
    if (billingProp === undefined) setOwnBilling(next);
    onBillingChange?.(next);
  };

  // The toggle's badge says what yearly saves, from the plans themselves.
  const save = Math.max(
    0,
    ...plans
      .filter((p) => p.price.monthly > 0)
      .map((p) => Math.round((1 - p.price.yearly / p.price.monthly) * 100)),
  );
  const options = React.useMemo(
    () => [
      { value: "monthly", label: "Monthly" },
      {
        value: "yearly",
        label: "Yearly",
        ...(save > 0 ? { badge: `Save ${save}%` } : {}),
      },
    ],
    [save],
  );

  const current = plans.find((p) => p.id === currentPlanId);
  const seatsOf = (p: PricingPlan) =>
    p.perSeat ? Math.max(p.minSeats ?? 1, seats[p.id] ?? p.minSeats ?? 1) : 1;
  const totalOf = (p: PricingPlan) =>
    p.price[billing] * seatsOf(p) * (billing === "yearly" ? 12 : 1);
  const busy = status?.status === "pending" || status?.status === "success";

  const close = () => {
    if (busy || !openId) return;
    const id = openId;
    setOpenId(null);
    setStatus(null);
    window.setTimeout(
      () => ctaRefs.current.get(id)?.focus({ preventScroll: true }),
      reduced ? 0 : FACES_MORPH,
    );
  };

  const checkout = async (p: PricingPlan) => {
    if (busy) return;
    setStatus({ id: p.id, status: "pending" });
    try {
      await onCheckout?.({
        plan: p,
        billing,
        seats: seatsOf(p),
        total: totalOf(p),
      });
      setStatus({ id: p.id, status: "success" });
    } catch (e) {
      setStatus({
        id: p.id,
        status: "error",
        error:
          e instanceof Error && e.message
            ? e.message
            : "Couldn’t start checkout. Try again.",
      });
    }
  };

  const ctaLabel = (p: PricingPlan) => {
    if (p.id === currentPlanId) return "Current plan";
    if (current)
      return p.price.monthly >= current.price.monthly
        ? `Upgrade to ${p.name}`
        : `Switch to ${p.name}`;
    return p.cta ?? (p.price.monthly === 0 ? "Start free" : `Get ${p.name}`);
  };

  return (
    <div
      className={`w-full ${className}`}
      onKeyDown={(e) => {
        if (e.key === "Escape" && openId) {
          e.preventDefault();
          close();
        }
      }}
    >
      {/* Its natural width where the parent sizes to its content, without forcing it on narrow screens. */}
      <div
        aria-hidden="true"
        data-natural-width
        className="grid h-0"
        style={{ gridTemplateColumns: "minmax(0, 960px)" }}
      />
      <div className="@container w-full">
        <div className="flex justify-center">
          <PricingToggle
            value={billing}
            onValueChange={(v) => setBilling(v as Billing)}
            options={options}
          />
        </div>

        <ul
          className={`mt-6 grid grid-cols-1 items-stretch gap-3 ${COLS[Math.min(plans.length, 4)] ?? ""}`}
        >
          {plans.map((p) => {
            const lit = Boolean(p.featured);
            const isOpen = openId === p.id;
            const isCurrent = p.id === currentPlanId;
            const amount = p.price[billing];
            const free = p.price.monthly === 0;
            const st = status?.id === p.id ? status : null;
            const n = seatsOf(p);
            const total = totalOf(p);
            const note = free
              ? "Free forever"
              : billing === "yearly"
                ? `${money.format(amount * 12)}${p.perSeat ? " per seat" : ""} billed yearly`
                : p.perSeat
                  ? "Per seat, billed monthly"
                  : "Billed monthly";
            const muted = lit
              ? "text-primary-foreground/70"
              : "text-muted-foreground";
            const dimmed = openId !== null && !isOpen;

            return (
              <li
                key={p.id}
                className={`relative flex flex-col overflow-clip rounded-[28px] ${isOpen ? "self-start" : ""} ${lit ? "text-primary-foreground" : "border border-border bg-card text-card-foreground"}`}
                style={{
                  ...(lit ? LIT_SURFACE : {}),
                  opacity: dimmed ? 0.5 : 1,
                  transform: dimmed && !reduced ? "scale(0.985)" : "none",
                  transition: reduced
                    ? "opacity 160ms"
                    : `opacity 320ms ${EASE}, transform ${FACES_MORPH}ms ${EASE}`,
                }}
              >
                {lit && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={LEDGER}
                  />
                )}
                <Faces
                  active={isOpen ? 1 : 0}
                  reduced={reduced}
                  ready={ready}
                  className="flex-1"
                >
                  {/* The plan. */}
                  <div className="flex h-full flex-col p-6">
                    <div className="flex items-center gap-2">
                      <h3
                        id={`${baseId}-${p.id}`}
                        className="text-[16px] font-medium tracking-[-0.01em]"
                      >
                        {p.name}
                      </h3>
                      {(p.badge || isCurrent) && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11.5px] font-medium ${lit ? "bg-primary-foreground/15 text-primary-foreground" : "bg-primary/10 text-primary"}`}
                        >
                          {isCurrent ? "Your plan" : p.badge}
                        </span>
                      )}
                    </div>
                    {p.description && (
                      <p
                        className={`mt-1.5 text-[13.5px] leading-relaxed ${muted}`}
                      >
                        {p.description}
                      </p>
                    )}

                    <div className="mt-6 flex items-baseline gap-1.5">
                      <span className="text-[clamp(40px,7cqw,52px)] font-medium leading-none tracking-[-0.045em] tabular-nums">
                        {free ? (
                          "Free"
                        ) : (
                          <NumberRoll
                            value={amount}
                            locales={locale}
                            format={priceFormat(currency, amount)}
                          />
                        )}
                      </span>
                      {!free && (
                        <span className={`text-[13.5px] ${muted}`}>
                          {p.perSeat ? "/seat/mo" : "/mo"}
                        </span>
                      )}
                    </div>
                    <div
                      className={`relative mt-2 h-5 overflow-hidden text-[12.5px] ${muted}`}
                    >
                      <span
                        key={note}
                        className="absolute inset-0 truncate motion-safe:animate-[ui-note-in_380ms_cubic-bezier(0.23,1,0.32,1)_both]"
                        style={
                          {
                            "--ui-from": `${dir > 0 ? 100 : -100}%`,
                          } as React.CSSProperties
                        }
                      >
                        {note}
                      </span>
                    </div>

                    <div className="mt-6">
                      {p.href && !isCurrent ? (
                        <a
                          ref={(el) => {
                            if (el) ctaRefs.current.set(p.id, el);
                          }}
                          href={p.href}
                          className={`flex h-12 w-full items-center justify-center rounded-full text-[15px] font-medium ${INTERACTION_PRESS} ${INTERACTION_FOCUS} ${lit ? "bg-primary-foreground text-primary" : "text-foreground shadow-[inset_0_0_0_1px_var(--border)] hover:bg-accent"}`}
                        >
                          {p.cta ?? "Contact sales"}
                        </a>
                      ) : free && !isCurrent ? (
                        <StatusButton
                          status={st?.status ?? "idle"}
                          labels={{
                            idle: ctaLabel(p),
                            pending: "Setting up",
                            success: "You’re in",
                            error: "Try again",
                          }}
                          variant="outline"
                          onClick={() => void checkout(p)}
                          className="h-12 w-full text-[15px]"
                        />
                      ) : (
                        <button
                          ref={(el) => {
                            if (el) ctaRefs.current.set(p.id, el);
                          }}
                          type="button"
                          disabled={isCurrent}
                          aria-expanded={isOpen}
                          onClick={() => {
                            setStatus(null);
                            setOpenId(p.id);
                          }}
                          className={`flex h-12 w-full cursor-pointer items-center justify-center rounded-full text-[15px] font-medium disabled:cursor-default ${INTERACTION_PRESS} ${INTERACTION_FOCUS} ${
                            isCurrent
                              ? lit
                                ? "bg-primary-foreground/15 text-primary-foreground/80"
                                : "bg-muted text-muted-foreground"
                              : lit
                                ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                          }`}
                          style={!lit && !isCurrent ? LIT_ACTION : undefined}
                        >
                          {ctaLabel(p)}
                        </button>
                      )}
                    </div>
                    {st?.status === "error" && free && (
                      <p
                        role="alert"
                        className="mt-2 text-center text-[12.5px] text-red-600 dark:text-red-400"
                      >
                        {st.error}
                      </p>
                    )}

                    <ul
                      className={`mt-6 space-y-2.5 border-t pt-5 text-[13.5px] ${lit ? "border-primary-foreground/15" : "border-border"}`}
                    >
                      {p.features.map((f) => (
                        <li key={f} className="flex gap-2.5">
                          <span
                            className={`mt-px flex size-[18px] shrink-0 items-center justify-center rounded-full ${lit ? "bg-primary-foreground/15" : "bg-primary/10 text-primary"}`}
                          >
                            <Check
                              aria-hidden="true"
                              className="size-3"
                              strokeWidth={2.5}
                            />
                          </span>
                          <span
                            className={
                              lit
                                ? "text-primary-foreground/90"
                                : "text-foreground"
                            }
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Its checkout: a slip on the same card. */}
                  <div className="p-2.5">
                    <div
                      ref={(el) => {
                        if (el) slipRefs.current.set(p.id, el);
                        else slipRefs.current.delete(p.id);
                      }}
                      tabIndex={-1}
                      role="group"
                      aria-label={`Checkout for ${p.name}`}
                      className="rounded-[20px] border border-border bg-card p-4 text-card-foreground outline-none"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[15px] font-medium tracking-[-0.01em]">
                          {p.name} ·{" "}
                          <TextMorph>
                            {billing === "yearly" ? "Yearly" : "Monthly"}
                          </TextMorph>
                        </p>
                        <button
                          type="button"
                          aria-label="Back to plans"
                          onClick={close}
                          className={`-mr-1.5 flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground ${INTERACTION_PRESS} ${INTERACTION_FOCUS}`}
                        >
                          <X aria-hidden="true" className="size-4" />
                        </button>
                      </div>

                      {p.perSeat && (
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="text-[13.5px] text-muted-foreground">
                            Seats
                          </span>
                          <StepperInput
                            label="Seats"
                            value={n}
                            onValueChange={(v) =>
                              !busy && setSeats((s) => ({ ...s, [p.id]: v }))
                            }
                            min={p.minSeats ?? 1}
                            max={p.maxSeats ?? 500}
                            size="sm"
                            disabled={busy}
                          />
                        </div>
                      )}

                      <dl className="mt-4 space-y-2 border-t border-border pt-4 text-[13.5px]">
                        <div className="flex justify-between gap-3">
                          <dt className="text-muted-foreground">
                            {money.format(amount)}
                            {p.perSeat ? " × " : ""}
                            {p.perSeat && (
                              <NumberRoll value={n} duration={500} />
                            )}
                            {p.perSeat ? (n === 1 ? " seat" : " seats") : ""}
                            {billing === "yearly" ? " × 12 months" : " a month"}
                          </dt>
                          <dd className="tabular-nums">
                            <NumberRoll
                              value={total}
                              locales={locale}
                              format={priceFormat(currency, total)}
                              duration={700}
                            />
                          </dd>
                        </div>
                        {billing === "monthly" &&
                        p.price.yearly < p.price.monthly ? (
                          <div className="flex justify-between gap-3 text-[12.5px]">
                            <dt className="text-muted-foreground">
                              Yearly saves{" "}
                              {money.format(
                                (p.price.monthly - p.price.yearly) * 12 * n,
                              )}
                            </dt>
                            <dd>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => setBilling("yearly")}
                                className={`cursor-pointer rounded-full text-primary underline-offset-4 hover:underline disabled:cursor-default ${INTERACTION_FOCUS}`}
                              >
                                Switch
                              </button>
                            </dd>
                          </div>
                        ) : billing === "yearly" ? (
                          <div className="flex justify-between gap-3 text-[12.5px]">
                            <dt className="text-muted-foreground">You save</dt>
                            <dd className="tabular-nums text-emerald-600 dark:text-emerald-400">
                              <NumberRoll
                                value={
                                  (p.price.monthly - p.price.yearly) * 12 * n
                                }
                                locales={locale}
                                format={priceFormat(
                                  currency,
                                  (p.price.monthly - p.price.yearly) * 12 * n,
                                )}
                                duration={700}
                              />
                            </dd>
                          </div>
                        ) : null}
                      </dl>

                      <div className="mt-4 flex items-end justify-between gap-3 border-t border-border pt-4">
                        <span className="text-[13.5px] text-muted-foreground">
                          Due today
                        </span>
                        <span className="text-[32px] font-medium leading-none tracking-[-0.04em] tabular-nums">
                          <NumberRoll
                            value={total}
                            locales={locale}
                            format={priceFormat(currency, total)}
                            duration={900}
                          />
                        </span>
                      </div>

                      <StatusButton
                        status={st?.status ?? "idle"}
                        labels={{
                          idle: "Continue to checkout",
                          pending: "Opening checkout",
                          success: "Redirecting",
                          error: "Try again",
                        }}
                        onClick={() => void checkout(p)}
                        className="mt-4 h-12 w-full text-[15px]"
                        style={st?.status === "error" ? undefined : LIT_ACTION}
                      />
                      <p
                        role={st?.status === "error" ? "alert" : undefined}
                        className={`mt-2 min-h-[18px] text-center text-[12.5px] ${st?.status === "error" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
                      >
                        {st?.status === "error" ? st.error : "Cancel any time."}
                      </p>
                    </div>
                  </div>
                </Faces>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default PricingPlans;
