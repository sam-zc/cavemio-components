"use client";

import * as React from "react";
import { Lock } from "lucide-react";
import { Input } from "./input";
import { NumberRoll } from "./number-roll";
import { Select } from "./select";
import { StatusButton, type ActionStatus } from "./status-button";
import { TextMorph } from "./text-morph";
import {
  EASE_THROW,
  INTERACTION_FOCUS,
  INTERACTION_PRESS,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";

/* ─────────────────────────────────────────────────────────
 * CHECKOUT: steps that stack into a receipt
 *
 *   steps     contact, shipping, delivery and payment on one
 *             surface; the step you're on is open, a rail of light
 *             runs down the numbers as you finish them
 *   stack     a finished step folds into one line under its title
 *             ("Iris Okafor, 12 Elm Street, Leeds · Change") with
 *             a check drawn in its number
 *   delivery  speeds show the day they arrive; the total on the
 *             lit summary rolls when you switch
 *   placed    Place order goes Placing order → your order number,
 *             and the steps lock
 *
 * Payment is your provider's: put its element (Stripe's Payment
 * Element, PayPal buttons, anything) in the `payment` slot, so this
 * block never sees card data. onPlaceOrder gets the order; resolve
 * with { number } to show it, throw an Error to say why not.
 * ───────────────────────────────────────────────────────── */

export interface CheckoutLine {
  id: string;
  name: string;
  /** e.g. "Sand · M". */
  detail?: string;
  quantity: number;
  /** Unit price, major units. */
  price: number;
  image?: string;
  icon?: React.ReactNode;
}

export interface CheckoutAddress {
  name: string;
  line1: string;
  line2: string;
  city: string;
  postcode: string;
  country: string;
}

export interface CheckoutDelivery {
  id: string;
  label: string;
  /** e.g. "Royal Mail Tracked". */
  detail?: string;
  price: number;
  /** Days from today it arrives: one number, or the earliest and latest. */
  days: number | [number, number];
}

export interface CheckoutOrder {
  email: string;
  address: CheckoutAddress;
  delivery: CheckoutDelivery;
  lines: CheckoutLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface CheckoutProps {
  lines: CheckoutLine[];
  deliveries: CheckoutDelivery[];
  /** Off the subtotal, major units. */
  discount?: number;
  /** Tax rate on the goods and delivery, e.g. 0.2 for 20%. */
  taxRate?: number;
  countries?: { value: string; label: string }[];
  defaultEmail?: string;
  defaultAddress?: Partial<CheckoutAddress>;
  /** Your payment provider's element, shown in the payment step. */
  payment?: React.ReactNode;
  /** Place the order; resolve with { number } to show it, throw an Error to say why not. */
  onPlaceOrder: (order: CheckoutOrder) => Promise<unknown>;
  currency?: string;
  locale?: string;
  className?: string;
}

type Step = "contact" | "shipping" | "delivery" | "payment";
const STEPS: { id: Step; title: string }[] = [
  { id: "contact", title: "Contact" },
  { id: "shipping", title: "Shipping address" },
  { id: "delivery", title: "Delivery" },
  { id: "payment", title: "Payment" },
];
const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "AU", label: "Australia" },
  { value: "IN", label: "India" },
];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EASE = "cubic-bezier(0.16,1,0.3,1)";
const DAY = 86_400_000;

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
const SUMMARY: React.CSSProperties = {
  backgroundColor: "var(--primary)",
  backgroundImage: `radial-gradient(120% 70% at 100% 0%, ${mix("var(--primary-foreground)", 22)} 0%, transparent 55%), linear-gradient(175deg, transparent 40%, ${mix("black", 24)} 100%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 36)}, inset 0 0 0 1px ${mix("var(--primary-foreground)", 12)}`,
};
const CARD: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 95, "var(--foreground)")})`,
  boxShadow: `0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 85)}`,
};
const INVERSE: React.CSSProperties = {
  background: "var(--primary-foreground)",
  color: "var(--primary)",
  boxShadow: `inset 0 -1px 0 ${mix("black", 8)}`,
};

function tint(seed: string): React.CSSProperties {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const chart = `var(--chart-${(h % 5) + 1}, var(--primary))`;
  return {
    background: mix(chart, 22, "var(--primary-foreground)"),
    color: mix(chart, 80, "black"),
  };
}

const money = (currency: string, n: number): Intl.NumberFormatOptions => ({
  style: "currency",
  currency,
  minimumFractionDigits: n % 1 ? 2 : 0,
  maximumFractionDigits: 2,
});
const round = (n: number) => Math.round(n * 100) / 100;

/** A fold that keeps its children laid out, so its height eases open and shut. */
function Fold({
  open,
  reduced,
  children,
}: {
  open: boolean;
  reduced: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="grid grid-cols-1"
      style={{
        gridTemplateRows: open ? "1fr" : "0fr",
        opacity: open ? 1 : 0,
        transition: reduced
          ? "opacity 160ms"
          : `grid-template-rows 440ms ${EASE}, opacity ${open ? 320 : 140}ms ${EASE} ${open ? 80 : 0}ms`,
      }}
    >
      <div className="min-h-0 overflow-clip" inert={!open || undefined}>
        {children}
      </div>
    </div>
  );
}

export function Checkout({
  lines,
  deliveries,
  discount = 0,
  taxRate = 0,
  countries = COUNTRIES,
  defaultEmail = "",
  defaultAddress,
  payment,
  onPlaceOrder,
  currency = "USD",
  locale,
  className = "",
}: CheckoutProps) {
  const reduced = useInteractionReducedMotion();
  const hydrated = useHydrated();
  const baseId = React.useId();
  const [step, setStep] = React.useState<Step>("contact");
  const [done, setDone] = React.useState<ReadonlySet<Step>>(() => new Set());
  const [email, setEmail] = React.useState(defaultEmail);
  const [address, setAddress] = React.useState<CheckoutAddress>({
    name: "",
    line1: "",
    line2: "",
    city: "",
    postcode: "",
    country: countries[0]?.value ?? "",
    ...defaultAddress,
  });
  const [deliveryId, setDeliveryId] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof CheckoutAddress | "email", string>>
  >({});
  const [place, setPlace] = React.useState<{
    status: ActionStatus;
    number?: string;
    error?: string;
  }>({ status: "idle" });
  const [today, setToday] = React.useState<number | null>(null);
  const [said, setSaid] = React.useState("");
  const bodies = React.useRef(new Map<Step, HTMLElement>());

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setToday(Date.now()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const delivery = deliveries.find((d) => d.id === deliveryId) ?? null;
  const subtotal = round(lines.reduce((n, l) => n + l.price * l.quantity, 0));
  const off = Math.min(discount, subtotal);
  const shipping = delivery?.price ?? 0;
  const tax = round((subtotal - off + shipping) * taxRate);
  const total = round(subtotal - off + shipping + tax);
  const placed = place.status === "success";
  const busy = place.status === "pending" || placed;
  const index = STEPS.findIndex((s) => s.id === step);
  const ready =
    done.has("contact") && done.has("shipping") && done.has("delivery");

  const fmt = (n: number) => money(currency, n);
  const loc = locale ?? (hydrated ? undefined : "en-US");
  const cash = (n: number) => new Intl.NumberFormat(loc, fmt(n)).format(n);
  const arrives = (d: CheckoutDelivery) => {
    if (today === null) return "";
    const [a, b] = Array.isArray(d.days) ? d.days : [d.days, d.days];
    const day = new Intl.DateTimeFormat(loc, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    return a === b
      ? `Arrives ${day.format(today + a * DAY)}`
      : `Arrives ${day.formatRange(today + a * DAY, today + b * DAY)}`;
  };
  const country =
    countries.find((c) => c.value === address.country)?.label ??
    address.country;
  const summaries: Record<Step, string> = {
    contact: email,
    shipping: [
      address.name,
      address.line1,
      address.line2,
      `${address.city} ${address.postcode}`.trim(),
      country,
    ]
      .filter(Boolean)
      .join(", "),
    delivery: delivery
      ? `${delivery.label} · ${delivery.price ? cash(delivery.price) : "Free"}`
      : "",
    payment: "",
  };

  const open = (s: Step) => {
    if (busy) return;
    setStep(s);
    window.setTimeout(
      () =>
        bodies.current
          .get(s)
          ?.querySelector<HTMLElement>("input,button[role=radio],button")
          ?.focus({ preventScroll: true }),
      reduced ? 0 : 320,
    );
  };

  const finish = (s: Step) => {
    if (s === "contact") {
      const problem = EMAIL.test(email.trim())
        ? undefined
        : email.trim()
          ? "That email doesn’t look right"
          : "Add your email";
      setErrors({ email: problem });
      if (problem) return;
    }
    if (s === "shipping") {
      const need: (keyof CheckoutAddress)[] = [
        "name",
        "line1",
        "city",
        "postcode",
      ];
      const problems = Object.fromEntries(
        need.filter((k) => !address[k].trim()).map((k) => [k, "Required"]),
      );
      setErrors(problems);
      if (Object.keys(problems).length) return;
    }
    if (s === "delivery" && !delivery) return;
    setDone((d) => new Set([...d, s]));
    const next =
      STEPS.find(
        (x, i) => i > STEPS.findIndex((y) => y.id === s) && !done.has(x.id),
      )?.id ?? "payment";
    setSaid(`${STEPS.find((x) => x.id === s)?.title} saved.`);
    open(next);
  };

  const placeOrder = async () => {
    if (!ready || !delivery || busy) return;
    setPlace({ status: "pending" });
    try {
      const result = await onPlaceOrder({
        email: email.trim(),
        address,
        delivery,
        lines,
        subtotal,
        discount: off,
        shipping,
        tax,
        total,
      });
      const number =
        result && typeof result === "object" && "number" in result
          ? String((result as { number: unknown }).number)
          : undefined;
      setPlace({ status: "success", number });
      setSaid(number ? `Order ${number} placed.` : "Order placed.");
    } catch (e) {
      setPlace({
        status: "error",
        error:
          e instanceof Error && e.message
            ? e.message
            : "Couldn’t place the order. Try again.",
      });
    }
  };

  const field = (
    k: keyof CheckoutAddress,
    label: string,
    autoComplete: string,
    extra?: Partial<React.ComponentProps<typeof Input>>,
  ) => (
    <Input
      label={label}
      autoComplete={autoComplete}
      value={address[k]}
      error={errors[k]}
      onValueChange={(v) => {
        setAddress((a) => ({ ...a, [k]: v }));
        if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
      }}
      {...extra}
    />
  );

  const next = `inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-primary px-5 text-[13.5px] font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-default disabled:opacity-45 ${INTERACTION_PRESS} ${INTERACTION_FOCUS}`;

  return (
    <section
      aria-labelledby={`${baseId}-title`}
      className={`w-full max-w-[860px] rounded-[28px] p-2 text-card-foreground ${className}`}
      style={CARD}
    >
      {/* Its natural width where the parent sizes to its content, without forcing it on narrow screens. */}
      <div
        aria-hidden="true"
        data-natural-width
        className="grid h-0"
        style={{ gridTemplateColumns: "minmax(0, 860px)" }}
      />
      <div className="@container w-full">
        <h2 id={`${baseId}-title`} className="sr-only">
          Checkout
        </h2>
        <div className="grid grid-cols-1 gap-2 @[700px]:grid-cols-[minmax(0,1fr)_320px] @[700px]:items-start">
          {/* Flat: the steps, finished ones stacked as one line each. */}
          <ol className="relative px-2 py-1" inert={placed || undefined}>
            {/* The rail of light down the numbers, as far as you've got. */}
            <span
              aria-hidden="true"
              className="absolute bottom-6 left-[19.5px] top-6 w-px bg-border"
            />
            <span
              aria-hidden="true"
              className="absolute left-[19.5px] top-6 w-px origin-top bg-primary"
              style={{
                height: "calc(100% - 48px)",
                transform: `scaleY(${Math.min(done.size, STEPS.length - 1) / (STEPS.length - 1)})`,
                transition: reduced ? "none" : `transform 620ms ${EASE}`,
              }}
            />
            {STEPS.map((s, i) => {
              const isOn = s.id === step;
              const isDone = done.has(s.id) && !isOn;
              const reachable =
                isDone ||
                i <= index ||
                STEPS.slice(0, i).every((p) => done.has(p.id));
              return (
                <li key={s.id} className="relative py-2.5 pl-9">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-[13px] flex size-6 items-center justify-center rounded-full text-[11.5px] font-medium tabular-nums"
                    style={{
                      background: isDone ? "var(--primary)" : "var(--card)",
                      color: isDone
                        ? "var(--primary-foreground)"
                        : isOn
                          ? "var(--primary)"
                          : "var(--muted-foreground)",
                      boxShadow: isDone
                        ? "none"
                        : `inset 0 0 0 ${isOn ? 1.5 : 1}px ${isOn ? "var(--primary)" : "var(--border)"}`,
                      transition: reduced
                        ? "none"
                        : `background-color 300ms ${EASE}, box-shadow 300ms ${EASE}, color 300ms`,
                    }}
                  >
                    {isDone ? (
                      <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
                        <path
                          d="M3.5 8.5 6.5 11.5 12.5 4.5"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray={24}
                          className="motion-safe:animate-[ui-draw_420ms_cubic-bezier(0.16,1,0.3,1)_120ms_both]"
                        />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <div className="flex min-h-7 items-center justify-between gap-3">
                    <h3
                      className={`text-[14.5px] font-medium tracking-[-0.01em] ${isOn || isDone ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {s.title}
                    </h3>
                    {isDone && !placed && (
                      <button
                        type="button"
                        onClick={() => open(s.id)}
                        aria-label={`Change ${s.title.toLowerCase()}`}
                        className={`-mr-1.5 h-7 cursor-pointer rounded-full px-2.5 text-[12.5px] text-primary hover:bg-primary/10 ${INTERACTION_PRESS} ${INTERACTION_FOCUS}`}
                      >
                        Change
                      </button>
                    )}
                  </div>
                  {/* The finished step, as a line of the receipt. */}
                  <Fold
                    open={isDone && Boolean(summaries[s.id])}
                    reduced={reduced}
                  >
                    <p className="truncate pb-0.5 text-[13px] text-muted-foreground">
                      {summaries[s.id]}
                    </p>
                  </Fold>
                  <Fold open={isOn} reduced={reduced}>
                    <div
                      ref={(el) => {
                        if (el) bodies.current.set(s.id, el);
                      }}
                      className="pb-1 pt-3"
                    >
                      {s.id === "contact" && (
                        <form
                          noValidate
                          className="flex flex-col gap-3 @[480px]:flex-row @[480px]:items-start"
                          onSubmit={(e) => {
                            e.preventDefault();
                            finish("contact");
                          }}
                        >
                          <Input
                            aria-label="Email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder="you@email.com"
                            value={email}
                            error={errors.email}
                            onValueChange={(v) => {
                              setEmail(v);
                              if (errors.email)
                                setErrors((e) => ({ ...e, email: undefined }));
                            }}
                            className="@[480px]:flex-1"
                          />
                          <button type="submit" className={next}>
                            Continue
                          </button>
                        </form>
                      )}
                      {s.id === "shipping" && (
                        <form
                          noValidate
                          className="grid grid-cols-1 gap-3 @[480px]:grid-cols-2"
                          onSubmit={(e) => {
                            e.preventDefault();
                            finish("shipping");
                          }}
                        >
                          <div className="@[480px]:col-span-2">
                            {field("name", "Full name", "name")}
                          </div>
                          <div className="@[480px]:col-span-2">
                            {field("line1", "Address", "address-line1")}
                          </div>
                          <div className="@[480px]:col-span-2">
                            {field(
                              "line2",
                              "Apartment, suite (optional)",
                              "address-line2",
                            )}
                          </div>
                          {field("city", "City", "address-level2")}
                          {field("postcode", "Postcode", "postal-code")}
                          <div className="@[480px]:col-span-2">
                            <Select
                              label="Country"
                              options={countries}
                              value={address.country}
                              onValueChange={(v) =>
                                setAddress((a) => ({ ...a, country: v }))
                              }
                            />
                          </div>
                          <div className="@[480px]:col-span-2">
                            <button type="submit" className={next}>
                              Continue
                            </button>
                          </div>
                        </form>
                      )}
                      {s.id === "delivery" && (
                        <div>
                          <div
                            role="radiogroup"
                            aria-label="Delivery speed"
                            className="overflow-clip rounded-[18px] border border-border"
                          >
                            {deliveries.map((d) => {
                              const on = d.id === deliveryId;
                              return (
                                <button
                                  key={d.id}
                                  type="button"
                                  role="radio"
                                  aria-checked={on}
                                  onClick={() => setDeliveryId(d.id)}
                                  onKeyDown={(e) => {
                                    const i2 =
                                      deliveries.indexOf(d) +
                                      (e.key === "ArrowDown" ||
                                      e.key === "ArrowRight"
                                        ? 1
                                        : e.key === "ArrowUp" ||
                                            e.key === "ArrowLeft"
                                          ? -1
                                          : 0);
                                    if (
                                      i2 === deliveries.indexOf(d) ||
                                      !deliveries[i2]
                                    )
                                      return;
                                    e.preventDefault();
                                    setDeliveryId(deliveries[i2].id);
                                    (
                                      e.currentTarget.parentElement?.children[
                                        i2
                                      ] as HTMLElement | undefined
                                    )?.focus();
                                  }}
                                  tabIndex={
                                    on || (!deliveryId && d === deliveries[0])
                                      ? 0
                                      : -1
                                  }
                                  className={`flex w-full cursor-pointer items-center gap-3 border-t border-border px-3.5 py-2.5 text-left first:border-t-0 ${on ? "bg-primary/[0.05]" : "hover:bg-accent/60"} ${INTERACTION_FOCUS} focus-visible:ring-inset focus-visible:ring-offset-0`}
                                >
                                  <span
                                    aria-hidden="true"
                                    className="flex size-[18px] shrink-0 items-center justify-center rounded-full"
                                    style={{
                                      boxShadow: `inset 0 0 0 ${on ? 5 : 1.5}px ${on ? "var(--primary)" : mix("var(--foreground)", 22, "var(--border)")}`,
                                      transition: reduced
                                        ? "none"
                                        : `box-shadow 260ms ${EASE_THROW}`,
                                    }}
                                  />
                                  <span className="min-w-0 flex-1">
                                    <span className="block text-[13.5px] font-medium text-foreground">
                                      {d.label}
                                    </span>
                                    <span className="block text-[12px] leading-snug text-muted-foreground">
                                      {arrives(d)}
                                      {d.detail ? ` · ${d.detail}` : ""}
                                    </span>
                                  </span>
                                  <span className="shrink-0 text-[13.5px] tabular-nums text-foreground">
                                    {d.price ? cash(d.price) : "Free"}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                          <button
                            type="button"
                            disabled={!delivery}
                            onClick={() => finish("delivery")}
                            className={`${next} mt-3`}
                          >
                            Continue
                          </button>
                        </div>
                      )}
                      {s.id === "payment" && (
                        <div className="text-[13px] text-muted-foreground">
                          {payment ?? <p>You’ll pay on the next page.</p>}
                          <p className="mt-2.5 inline-flex items-center gap-1.5 text-[12px]">
                            <Lock aria-hidden="true" className="size-3" />
                            {reachable && ready
                              ? "Place your order from the summary."
                              : "Finish the steps above first."}
                          </p>
                        </div>
                      )}
                    </div>
                  </Fold>
                </li>
              );
            })}
          </ol>

          {/* The one lit surface: the summary, with the order's main action. */}
          <div
            className="rounded-[22px] p-4 text-primary-foreground"
            style={SUMMARY}
          >
            <div className="flex items-baseline justify-between">
              <p className="text-[13.5px] font-medium">Order summary</p>
              <p className="text-[12px] text-primary-foreground/70">
                {lines.reduce((n, l) => n + l.quantity, 0)} items
              </p>
            </div>
            <ul className="mt-3 space-y-2.5">
              {lines.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center gap-2.5 text-[13px]"
                >
                  {/* The tile clips its photo; the quantity sits on its corner, outside the clip. */}
                  <span aria-hidden="true" className="relative shrink-0">
                    <span
                      className="relative flex size-9 items-center justify-center overflow-hidden rounded-[10px] text-[12px] font-medium [&_svg]:size-[18px]"
                      style={tint(l.name)}
                    >
                      {l.icon ?? l.name.slice(0, 1)}
                      {l.image && (
                        <img
                          src={l.image}
                          alt=""
                          decoding="async"
                          className="absolute inset-0 size-full object-cover"
                        />
                      )}
                    </span>
                    {l.quantity > 1 && (
                      <span
                        className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10.5px] font-medium tabular-nums"
                        style={{
                          background: "var(--primary-foreground)",
                          color: "var(--primary)",
                          boxShadow: "0 0 0 2px var(--primary)",
                        }}
                      >
                        {l.quantity}
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{l.name}</span>
                    {l.detail && (
                      <span className="block truncate text-[11.5px] text-primary-foreground/65">
                        {l.detail}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {cash(l.price * l.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl
              className="mt-3.5 space-y-1.5 border-t pt-3 text-[13px]"
              style={{ borderColor: mix("var(--primary-foreground)", 18) }}
            >
              <div className="flex justify-between gap-3">
                <dt className="text-primary-foreground/70">Subtotal</dt>
                <dd className="tabular-nums">{cash(subtotal)}</dd>
              </div>
              {off > 0 && (
                <div className="flex justify-between gap-3">
                  <dt className="text-primary-foreground/70">Discount</dt>
                  <dd className="tabular-nums">−{cash(off)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <dt className="text-primary-foreground/70">Delivery</dt>
                <dd className="tabular-nums">
                  {!delivery ? (
                    <span className="text-primary-foreground/60">
                      Next step
                    </span>
                  ) : shipping ? (
                    <NumberRoll
                      value={shipping}
                      locales={locale}
                      format={fmt(shipping)}
                      duration={700}
                    />
                  ) : (
                    <TextMorph>Free</TextMorph>
                  )}
                </dd>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between gap-3">
                  <dt className="text-primary-foreground/70">Tax</dt>
                  <dd className="tabular-nums">
                    <NumberRoll
                      value={tax}
                      locales={locale}
                      format={fmt(tax)}
                      duration={700}
                    />
                  </dd>
                </div>
              )}
            </dl>
            <div
              className="mt-3 flex items-end justify-between gap-3 border-t pt-3"
              style={{ borderColor: mix("var(--primary-foreground)", 18) }}
            >
              <span className="text-[13px] text-primary-foreground/70">
                Total
              </span>
              <span className="text-[32px] font-medium leading-none tracking-[-0.04em] tabular-nums">
                <NumberRoll
                  value={total}
                  locales={locale}
                  format={fmt(total)}
                  duration={1000}
                />
              </span>
            </div>

            <StatusButton
              status={place.status}
              labels={{
                idle: "Place order",
                pending: "Placing order",
                success: place.number
                  ? `Order ${place.number}`
                  : "Order placed",
                error: "Try again",
              }}
              disabled={!ready && place.status === "idle"}
              onClick={() => void placeOrder()}
              className="mt-3.5 h-11 w-full text-[14.5px] hover:opacity-95 disabled:opacity-50"
              style={
                place.status === "error"
                  ? { background: "var(--primary-foreground)" }
                  : INVERSE
              }
            />
            <p
              role={place.error ? "alert" : undefined}
              className="mt-2 text-center text-[11.5px] text-primary-foreground/70"
            >
              {place.error ??
                (placed
                  ? `A receipt is on its way to ${email.trim()}.`
                  : ready
                    ? "You won’t be charged until you place it."
                    : "Finish the steps to place your order.")}
            </p>
          </div>
        </div>

        <span className="sr-only" role="status">
          {said}
        </span>
      </div>
    </section>
  );
}

export default Checkout;
