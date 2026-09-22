"use client";

import * as React from "react";
import { ArrowRight, Tag, X } from "lucide-react";
import { Faces } from "./faces";
import { Input } from "./input";
import { NumberRoll } from "./number-roll";
import { StatusButton, type ActionStatus } from "./status-button";
import { StepperInput } from "./stepper-input";
import { TextMorph } from "./text-morph";
import {
  EASE_THROW,
  INTERACTION_FOCUS,
  INTERACTION_PRESS,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";

/* ─────────────────────────────────────────────────────────
 * CART: a receipt that does the maths in front of you
 *
 *   items     rows with a tile, a stepper and a line total that
 *             rolls; changes are sent once you stop pressing, and
 *             a refusal ("Only 2 left") puts the row back and says so
 *   remove    the row folds into "Removed · Undo" over a draining
 *             thin line; nothing is removed until it runs out
 *   code      the code you apply is stamped onto the cart as a
 *             chip, and the discount rolls into the receipt
 *   receipt   the lit surface: a rail of light fills toward free
 *             shipping, every line and the total roll as you go
 *
 * The cart is yours: pass items, and do the work in onQuantity-
 * Change, onRemove, onApplyCode and onCheckout. Each is one async
 * call to your API; throw an Error and its message shows where
 * the thing happened.
 * ───────────────────────────────────────────────────────── */

export interface CartItem {
  id: string;
  name: string;
  /** A line under the name, e.g. "Sand · M". */
  variant?: string;
  /** Unit price in major units. */
  price: number;
  quantity: number;
  /** Most you can have, e.g. what's in stock. */
  max?: number;
  /** Product photo; a tinted tile with the icon or initials when missing. */
  image?: string;
  icon?: React.ReactNode;
}

export interface CartDiscount {
  code: string;
  /** Off the subtotal, e.g. 20 for 20%. */
  percent?: number;
  /** A fixed amount off, in major units. */
  amount?: number;
}

export interface CartSummary {
  items: { id: string; quantity: number }[];
  code: string | null;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export interface CartProps {
  items: CartItem[];
  /** The applied code, if you keep it (controlled); otherwise the cart remembers what onApplyCode returned. */
  discount?: CartDiscount | null;
  /** Flat shipping cost below the free-shipping threshold. */
  shipping?: number;
  /** Order value (after discount) that ships free; draws the rail on the receipt. */
  freeShippingAt?: number;
  /** Save a new quantity; throw an Error (e.g. "Only 2 left") to put it back. */
  onQuantityChange?: (id: string, quantity: number) => Promise<unknown>;
  /** Remove an item once its Undo runs out. */
  onRemove?: (id: string) => Promise<unknown>;
  /** Check a code and return what it's worth; throw an Error to say why not. */
  onApplyCode?: (code: string) => Promise<CartDiscount>;
  onRemoveCode?: () => Promise<unknown>;
  /** Start checkout; resolve once you're redirecting. */
  onCheckout?: (summary: CartSummary) => Promise<unknown>;
  title?: string;
  currency?: string;
  locale?: string;
  className?: string;
}

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const UNDO_MS = 4000;
const SEND_AFTER = 450;
const NO_DISCOUNT = null;

const mix = (color: string, amount: number, into = "transparent") =>
  `color-mix(in oklab, ${color} ${amount}%, ${into})`;
const RECEIPT: React.CSSProperties = {
  backgroundColor: "var(--primary)",
  backgroundImage: `radial-gradient(120% 90% at 0% 0%, ${mix("var(--primary-foreground)", 22)} 0%, transparent 55%), linear-gradient(170deg, transparent 40%, ${mix("black", 24)} 100%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 36)}, inset 0 0 0 1px ${mix("var(--primary-foreground)", 12)}`,
};
const CARD: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 95, "var(--foreground)")})`,
  boxShadow: `0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 85)}`,
};
/* The action on the lit receipt: the light colour with the brand colour as its text. */
const INVERSE: React.CSSProperties = {
  background: "var(--primary-foreground)",
  color: "var(--primary)",
  boxShadow: `inset 0 -1px 0 ${mix("black", 8)}`,
};
/* The rail's ruler: an engraved tick every tenth of the way, the light running over it. */
const TICKS: React.CSSProperties = {
  backgroundImage: `repeating-linear-gradient(90deg, ${mix("var(--primary-foreground)", 28)} 0 1px, transparent 1px 10%)`,
};

function tint(seed: string): React.CSSProperties {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const chart = `var(--chart-${(h % 5) + 1}, var(--primary))`;
  return {
    background: mix(chart, 18, "var(--card)"),
    color: mix(chart, 72, "var(--foreground)"),
    boxShadow: `inset 0 0 0 1px ${mix(chart, 24)}`,
  };
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const money = (currency: string, n: number): Intl.NumberFormatOptions => ({
  style: "currency",
  currency,
  minimumFractionDigits: n % 1 ? 2 : 0,
  maximumFractionDigits: 2,
});
const errorOf = (e: unknown, fallback: string) =>
  e instanceof Error && e.message ? e.message : fallback;

/** A line that comes and goes by height, keeping its last content while it folds. */
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
          : `grid-template-rows 420ms ${EASE}, opacity ${open ? 320 : 140}ms ${EASE}`,
      }}
    >
      <div className="min-h-0 overflow-clip">{children}</div>
    </div>
  );
}

type Row = {
  qty?: number;
  settled?: boolean;
  pending?: boolean;
  error?: string;
  removing?: boolean;
  gone?: boolean;
};

export function Cart({
  items,
  discount: discountProp,
  shipping,
  freeShippingAt,
  onQuantityChange,
  onRemove,
  onApplyCode,
  onRemoveCode,
  onCheckout,
  title = "Your cart",
  currency = "USD",
  locale,
  className = "",
}: CartProps) {
  const reduced = useInteractionReducedMotion();
  const baseId = React.useId();
  const [rows, setRows] = React.useState<Record<string, Row>>({});
  const [ready, setReady] = React.useState(false);
  const [ownDiscount, setOwnDiscount] = React.useState<CartDiscount | null>(
    NO_DISCOUNT,
  );
  const discount = discountProp !== undefined ? discountProp : ownDiscount;
  const [code, setCode] = React.useState("");
  const [codeStatus, setCodeStatus] = React.useState<ActionStatus>("idle");
  const [codeError, setCodeError] = React.useState<string | null>(null);
  const [checkout, setCheckout] = React.useState<{
    status: ActionStatus;
    error?: string;
  }>({ status: "idle" });
  const [said, setSaid] = React.useState("");
  const timers = React.useRef(new Map<string, number>());
  const rowEls = React.useRef(new Map<string, HTMLElement>());
  const chipRef = React.useRef<HTMLDivElement>(null);
  const codeInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    const all = timers.current;
    return () => {
      cancelAnimationFrame(frame);
      all.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // When your items change, quantities you've saved give way to what you now say.
  const [seenItems, setSeenItems] = React.useState(items);
  if (items !== seenItems) {
    setSeenItems(items);
    setRows((r) =>
      Object.fromEntries(
        Object.entries(r).filter(
          ([id, row]) => items.some((i) => i.id === id) && !row.settled,
        ),
      ),
    );
  }

  const patch = (id: string, next: Partial<Row> | null) =>
    setRows((r) => {
      const copy = { ...r };
      if (next === null) delete copy[id];
      else copy[id] = { ...copy[id], ...next };
      return copy;
    });

  const qtyOf = (i: CartItem) => rows[i.id]?.qty ?? i.quantity;
  const live = items.filter((i) => !rows[i.id]?.removing && !rows[i.id]?.gone);
  const count = live.reduce((n, i) => n + qtyOf(i), 0);
  const subtotal =
    Math.round(live.reduce((n, i) => n + i.price * qtyOf(i), 0) * 100) / 100;
  const off = discount
    ? Math.min(
        subtotal,
        Math.round(
          (discount.percent
            ? (subtotal * discount.percent) / 100
            : (discount.amount ?? 0)) * 100,
        ) / 100,
      )
    : 0;
  const after = subtotal - off;
  const free = freeShippingAt !== undefined && after >= freeShippingAt;
  const ship = live.length === 0 || free ? 0 : (shipping ?? 0);
  const total = Math.round((after + ship) * 100) / 100;
  const progress = freeShippingAt ? Math.min(1, after / freeShippingAt) : 0;
  const busy = checkout.status === "pending" || checkout.status === "success";

  const setQty = (item: CartItem, q: number) => {
    patch(item.id, { qty: q, settled: false, error: undefined });
    window.clearTimeout(timers.current.get(item.id));
    // Sent once you stop pressing, so five taps are one request.
    timers.current.set(
      item.id,
      window.setTimeout(async () => {
        if (!onQuantityChange) return patch(item.id, { settled: true });
        patch(item.id, { pending: true });
        try {
          await onQuantityChange(item.id, q);
          patch(item.id, { pending: false, settled: true });
        } catch (e) {
          setRows((r) => ({
            ...r,
            [item.id]: { error: errorOf(e, "Couldn’t update that.") },
          }));
          rowEls.current
            .get(item.id)
            ?.animate(
              [
                { transform: "none" },
                { transform: "translateX(-4px)" },
                { transform: "translateX(4px)" },
                { transform: "none" },
              ],
              { duration: 340, easing: "ease-out" },
            );
        }
      }, SEND_AFTER),
    );
  };

  const remove = (item: CartItem) => {
    window.clearTimeout(timers.current.get(item.id));
    patch(item.id, { removing: true, error: undefined });
    setSaid(`${item.name} removed. Undo is available for a few seconds.`);
    timers.current.set(
      item.id,
      window.setTimeout(async () => {
        patch(item.id, { gone: true });
        try {
          await onRemove?.(item.id);
        } catch (e) {
          patch(item.id, {
            gone: false,
            removing: false,
            error: errorOf(e, "Couldn’t remove that."),
          });
        }
      }, UNDO_MS),
    );
  };

  const undo = (item: CartItem) => {
    window.clearTimeout(timers.current.get(item.id));
    patch(item.id, { removing: false });
    setSaid(`${item.name} is back in your cart.`);
    window.setTimeout(
      () =>
        rowEls.current
          .get(item.id)
          ?.querySelector<HTMLElement>("input,button")
          ?.focus({ preventScroll: true }),
      60,
    );
  };

  const apply = async () => {
    const value = code.trim();
    if (!value || codeStatus === "pending") return;
    if (!onApplyCode) return;
    setCodeStatus("pending");
    setCodeError(null);
    try {
      const d = await onApplyCode(value);
      setOwnDiscount(d);
      setCodeStatus("idle");
      setCode("");
      setSaid(`Code ${d.code} applied.`);
    } catch (e) {
      setCodeStatus("error");
      setCodeError(errorOf(e, "That code didn’t work."));
    }
  };

  const removeCode = async () => {
    setOwnDiscount(null);
    setSaid("Code removed.");
    window.setTimeout(
      () => codeInputRef.current?.focus({ preventScroll: true }),
      80,
    );
    try {
      await onRemoveCode?.();
    } catch {
      // The code stays off here; your server is the judge on the next checkout.
    }
  };

  // The code is stamped on: it lands big and tilted out of a blur and is thrown down flat.
  const stamped = discount?.code ?? null;
  const lastStamp = React.useRef<string | null>(null);
  React.useLayoutEffect(() => {
    const was = lastStamp.current;
    lastStamp.current = stamped;
    if (!ready || !stamped || stamped === was || reduced) return;
    chipRef.current?.animate(
      [
        {
          transform: "scale(1.5) rotate(-9deg)",
          opacity: 0,
          filter: "blur(6px)",
        },
        {
          transform: "scale(0.94) rotate(1.5deg)",
          opacity: 1,
          filter: "blur(0px)",
          offset: 0.55,
        },
        { transform: "none", opacity: 1, filter: "blur(0px)" },
      ],
      { duration: 560, easing: EASE_THROW },
    );
  }, [stamped, ready, reduced]);

  const pay = async () => {
    if (busy || !live.length) return;
    setCheckout({ status: "pending" });
    try {
      await onCheckout?.({
        items: live.map((i) => ({ id: i.id, quantity: qtyOf(i) })),
        code: discount?.code ?? null,
        subtotal,
        discount: off,
        shipping: ship,
        total,
      });
      setCheckout({ status: "success" });
    } catch (e) {
      setCheckout({
        status: "error",
        error: errorOf(e, "Couldn’t start checkout. Try again."),
      });
    }
  };

  const fmt = (n: number) => money(currency, n);

  return (
    <section
      aria-labelledby={`${baseId}-title`}
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
        <div className="flex items-baseline justify-between px-3 pb-1 pt-2.5">
          <h2
            id={`${baseId}-title`}
            className="text-[15px] font-medium tracking-[-0.01em]"
          >
            {title}
          </h2>
          <p className="text-[12.5px] tabular-nums text-muted-foreground">
            <NumberRoll value={count} duration={600} />{" "}
            <TextMorph>{count === 1 ? "item" : "items"}</TextMorph>
          </p>
        </div>

        <Fold
          open={live.length === 0 && !items.some((i) => rows[i.id]?.removing)}
          reduced={reduced}
        >
          <p className="px-3 py-6 text-center text-[13.5px] text-muted-foreground">
            Your cart is empty.
          </p>
        </Fold>

        <ul className="px-1">
          {items.map((item) => {
            const row = rows[item.id] ?? {};
            const q = qtyOf(item);
            return (
              <li
                key={item.id}
                className="grid grid-cols-1"
                style={{
                  gridTemplateRows: row.gone ? "0fr" : "1fr",
                  opacity: row.gone ? 0 : 1,
                  transition: reduced
                    ? "opacity 160ms"
                    : `grid-template-rows 380ms ${EASE} 100ms, opacity 200ms ${EASE}`,
                }}
              >
                <div className="min-h-0 overflow-clip">
                  <div
                    ref={(el) => {
                      if (el) rowEls.current.set(item.id, el);
                      else rowEls.current.delete(item.id);
                    }}
                    className="border-b border-border/70 py-2"
                  >
                    <Faces
                      active={row.removing ? 1 : 0}
                      reduced={reduced}
                      ready={ready}
                    >
                      <div className="flex gap-3 px-2">
                        <span
                          aria-hidden="true"
                          className="relative flex size-[52px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] text-[14px] font-medium [&_svg]:size-[22px]"
                          style={tint(item.name)}
                        >
                          {item.icon ?? initials(item.name)}
                          {item.image && (
                            <img
                              src={item.image}
                              alt=""
                              decoding="async"
                              className="absolute inset-0 size-full object-cover"
                            />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-[14px] font-medium leading-tight tracking-[-0.01em]">
                                {item.name}
                              </p>
                              {item.variant && (
                                <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                                  {item.variant}
                                </p>
                              )}
                            </div>
                            <span
                              className="shrink-0 text-[14px] font-medium tabular-nums tracking-[-0.01em]"
                              style={{
                                opacity: row.pending ? 0.55 : 1,
                                transition: "opacity 200ms",
                              }}
                            >
                              <NumberRoll
                                value={item.price * q}
                                locales={locale}
                                format={fmt(item.price * q)}
                                duration={700}
                              />
                            </span>
                          </div>
                          <div className="mt-1.5 flex items-center justify-between gap-2">
                            <StepperInput
                              label={`Quantity of ${item.name}`}
                              value={q}
                              min={1}
                              max={item.max ?? 99}
                              size="sm"
                              onValueChange={(v) => setQty(item, v)}
                            />
                            <button
                              type="button"
                              onClick={() => remove(item)}
                              className={`-mr-1 h-7 cursor-pointer rounded-full px-2 text-[12px] text-muted-foreground hover:bg-accent hover:text-foreground ${INTERACTION_PRESS} ${INTERACTION_FOCUS}`}
                            >
                              Remove
                            </button>
                          </div>
                          <Fold open={!!row.error} reduced={reduced}>
                            <p
                              role="alert"
                              className="pt-1.5 text-[12px] text-red-600 dark:text-red-400"
                            >
                              {row.error}
                            </p>
                          </Fold>
                        </div>
                      </div>

                      <div className="relative flex h-10 items-center justify-between gap-3 overflow-clip rounded-[14px] px-3 text-[13px]">
                        <span className="truncate text-muted-foreground">
                          <span className="text-foreground">{item.name}</span>{" "}
                          removed
                        </span>
                        <button
                          type="button"
                          onClick={() => undo(item)}
                          className={`-mr-1.5 h-7 shrink-0 cursor-pointer rounded-full px-2.5 font-medium text-primary hover:bg-primary/10 ${INTERACTION_PRESS} ${INTERACTION_FOCUS}`}
                        >
                          Undo
                        </button>
                        {/* How long Undo has left, draining away. */}
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-3 bottom-0 h-px origin-left bg-primary/50"
                          style={{
                            transform: row.removing ? "scaleX(0)" : "scaleX(1)",
                            transition:
                              row.removing && !reduced
                                ? `transform ${UNDO_MS}ms linear`
                                : "none",
                          }}
                        />
                      </div>
                    </Faces>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* The code: a field, then a chip stamped onto the cart. */}
        <div className="px-2 pb-2 pt-2.5">
          <Faces active={discount ? 1 : 0} reduced={reduced} ready={ready}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void apply();
              }}
            >
              <Input
                ref={codeInputRef}
                aria-label="Discount code"
                placeholder="Discount code"
                value={code}
                autoCapitalize="characters"
                spellCheck={false}
                error={codeError ?? undefined}
                leading={<Tag aria-hidden="true" />}
                onValueChange={(v) => {
                  setCode(v);
                  if (codeStatus === "error") {
                    setCodeStatus("idle");
                    setCodeError(null);
                  }
                }}
                inputClassName="uppercase placeholder:normal-case tracking-[0.02em]"
                trailing={
                  <StatusButton
                    type="submit"
                    size="sm"
                    variant="ghost"
                    status={codeStatus === "error" ? "idle" : codeStatus}
                    labels={{ idle: "Apply", pending: "Checking" }}
                    disabled={!code.trim()}
                    className="mr-0.5 text-foreground disabled:opacity-40"
                  />
                }
              />
            </form>
            <div className="flex h-9 items-center">
              <div
                ref={chipRef}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-dashed border-primary/45 bg-primary/[0.06] pl-3 pr-1 text-[13px] text-primary"
              >
                <Tag aria-hidden="true" className="size-3.5" />
                <span className="font-mono text-[12.5px] font-medium tracking-[0.06em]">
                  {discount?.code}
                </span>
                <span className="text-primary/75">
                  {discount?.percent
                    ? `${discount.percent}% off`
                    : discount
                      ? "off"
                      : ""}
                </span>
                <button
                  type="button"
                  aria-label={`Remove code ${discount?.code ?? ""}`}
                  onClick={() => void removeCode()}
                  className={`flex size-7 cursor-pointer items-center justify-center rounded-full hover:bg-primary/10 ${INTERACTION_PRESS} ${INTERACTION_FOCUS}`}
                >
                  <X aria-hidden="true" className="size-3.5" />
                </button>
              </div>
            </div>
          </Faces>
        </div>

        {/* The one lit surface: the receipt. */}
        <div
          className="rounded-[22px] p-4 text-primary-foreground"
          style={RECEIPT}
        >
          {freeShippingAt !== undefined && (
            <div className="mb-3.5">
              <div className="relative h-[18px] text-[12.5px]">
                {[false, true].map((on) => (
                  <p
                    key={String(on)}
                    aria-hidden={on !== free}
                    className="absolute inset-0 truncate"
                    style={{
                      opacity: on === free ? 1 : 0,
                      transform:
                        on === free || reduced
                          ? "none"
                          : `translateY(${on ? 6 : -6}px)`,
                      filter: on === free || reduced ? "none" : "blur(3px)",
                      transition: reduced
                        ? "opacity 160ms"
                        : `opacity 280ms ${EASE}, transform 420ms ${EASE}, filter 280ms ${EASE}`,
                    }}
                  >
                    {on ? (
                      <span className="font-medium">
                        Free shipping unlocked
                      </span>
                    ) : (
                      <span className="text-primary-foreground/80">
                        Add{" "}
                        <NumberRoll
                          value={Math.max(0, freeShippingAt - after)}
                          locales={locale}
                          format={fmt(Math.max(0, freeShippingAt - after))}
                          duration={700}
                          className="font-medium text-primary-foreground"
                        />{" "}
                        for free shipping
                      </span>
                    )}
                  </p>
                ))}
              </div>
              <div
                className="relative mt-2 h-2.5"
                role="meter"
                aria-label="Toward free shipping"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2"
                  style={TICKS}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
                  style={{ background: mix("var(--primary-foreground)", 22) }}
                />
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 h-[2px] w-full origin-left -translate-y-1/2 rounded-full"
                  style={{
                    background: "var(--primary-foreground)",
                    transform: `scaleX(${progress})`,
                    transition: reduced ? "none" : `transform 700ms ${EASE}`,
                  }}
                />
                {/* The head of the light rides the right edge of a full-width layer that slides in from the left: one composited
                    transform, and nothing past the receipt's right edge to scroll to. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    transform: `translateX(${(progress - 1) * 100}%)`,
                    transition: reduced ? "none" : `transform 700ms ${EASE}`,
                  }}
                >
                  <span
                    className="absolute right-0 top-1/2 size-2.5 translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background: "var(--primary-foreground)",
                      boxShadow: `0 0 0 3px ${mix("var(--primary-foreground)", 22)}`,
                    }}
                  />
                </span>
              </div>
            </div>
          )}

          <dl className="space-y-1.5 text-[13px]">
            <div className="flex justify-between gap-3">
              <dt className="text-primary-foreground/70">Subtotal</dt>
              <dd className="tabular-nums">
                <NumberRoll
                  value={subtotal}
                  locales={locale}
                  format={fmt(subtotal)}
                  duration={800}
                />
              </dd>
            </div>
            <Fold open={off > 0} reduced={reduced}>
              <div className="flex justify-between gap-3">
                <dt className="text-primary-foreground/70">
                  Discount{" "}
                  <span className="font-mono text-[11.5px] tracking-[0.06em] text-primary-foreground/85">
                    {discount?.code}
                  </span>
                </dt>
                <dd className="tabular-nums">
                  <NumberRoll
                    value={-off}
                    locales={locale}
                    format={fmt(off)}
                    duration={800}
                  />
                </dd>
              </div>
            </Fold>
            {(shipping !== undefined || freeShippingAt !== undefined) && (
              <div className="flex justify-between gap-3">
                <dt className="text-primary-foreground/70">Shipping</dt>
                <dd className="tabular-nums">
                  {ship === 0 ? (
                    <TextMorph>Free</TextMorph>
                  ) : (
                    <NumberRoll
                      value={ship}
                      locales={locale}
                      format={fmt(ship)}
                      duration={600}
                    />
                  )}
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
            <span className="text-[clamp(30px,9cqw,36px)] font-medium leading-none tracking-[-0.04em] tabular-nums">
              <NumberRoll
                value={total}
                locales={locale}
                format={fmt(total)}
                duration={1000}
              />
            </span>
          </div>

          <StatusButton
            status={checkout.status}
            labels={{
              idle: "Check out",
              pending: "Opening checkout",
              success: "Redirecting",
              error: "Try again",
            }}
            icon={<ArrowRight aria-hidden="true" />}
            disabled={!live.length}
            onClick={() => void pay()}
            className="mt-3.5 h-11 w-full text-[14.5px] hover:opacity-95 disabled:opacity-50"
            style={
              checkout.status === "error"
                ? { background: "var(--primary-foreground)" }
                : INVERSE
            }
          />
          <p
            role={checkout.error ? "alert" : undefined}
            className="mt-2 text-center text-[11.5px] text-primary-foreground/65"
          >
            {checkout.error ?? "Taxes are worked out at checkout."}
          </p>
        </div>

        <span className="sr-only" role="status">
          {said}
        </span>
      </div>
    </section>
  );
}

export default Cart;
