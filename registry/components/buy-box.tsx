"use client";

import * as React from "react";
import { BellRing, ShoppingBag } from "lucide-react";
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
 * BUY BOX: the swatch that repaints the product
 *
 *   stage     the product stands on a pedestal of engraved rings
 *             in a stage painted in the colour you picked; a new
 *             colour floods the stage and ripples the rings
 *   options   swatches and sizes from your variants; what isn't
 *             made or is sold out is struck through; the price
 *             rolls when the variant costs more or less
 *   add       Add to bag goes Adding → Added and the product is
 *             thrown into the bag in the corner, which bumps as
 *             its count rolls
 *   sold out  the button becomes Notify me, and an email field
 *             grows out of it
 *
 * The catalogue is yours: pass options and variants (price and
 * stock per variant), and do the work in onAddToCart and onNotify.
 * Throw an Error and its message shows under the button.
 * ───────────────────────────────────────────────────────── */

export interface BuyBoxValue {
  id: string;
  label: string;
  /** A CSS colour: makes this a swatch, and paints the stage when picked. */
  swatch?: string;
}

export interface BuyBoxOption {
  id: string;
  /** e.g. "Colour", "Size". */
  label: string;
  values: BuyBoxValue[];
}

export interface BuyBoxVariant {
  id: string;
  /** The value id picked for each option, e.g. { colour: "sand", size: "m" }. */
  options: Record<string, string>;
  price: number;
  /** The old price, shown struck through. */
  compareAt?: number;
  /** Left in stock; leave out for plenty, 0 is sold out. */
  stock?: number;
  /** A photo of this variant; the stage shows `icon` when missing. */
  image?: string;
}

export interface BuyBoxProps {
  name: string;
  brand?: string;
  options: BuyBoxOption[];
  variants: BuyBoxVariant[];
  /** Starting picks; defaults to the first variant in stock. */
  defaultSelection?: Record<string, string>;
  /** The product's glyph on the stage when there's no image. */
  icon?: React.ReactNode;
  /** Items already in the bag. */
  bagCount?: number;
  /** "Only 3 left" from this many down. */
  lowStockAt?: number;
  /** Add to the bag; throw an Error to say why not. */
  onAddToCart: (variant: BuyBoxVariant, quantity: number) => Promise<unknown>;
  /** Shows Notify me on sold-out variants. */
  onNotify?: (variant: BuyBoxVariant, email: string) => Promise<unknown>;
  currency?: string;
  locale?: string;
  className?: string;
}

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
const CARD: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 95, "var(--foreground)")})`,
  boxShadow: `0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 85)}`,
};
const LIT: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${mix("var(--primary-foreground)", 16)}, transparent 60%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 32)}, inset 0 0 0 1px ${mix("black", 10)}`,
};
const money = (currency: string, n: number): Intl.NumberFormatOptions => ({
  style: "currency",
  currency,
  minimumFractionDigits: n % 1 ? 2 : 0,
  maximumFractionDigits: 2,
});

const matches = (
  v: BuyBoxVariant,
  pick: Record<string, string>,
  skip?: string,
) =>
  Object.entries(pick).every(([k, val]) => k === skip || v.options[k] === val);

/** The pedestal: fine engraved rings the product stands on. */
function Rings({
  ringsRef,
}: {
  ringsRef: React.RefObject<SVGSVGElement | null>;
}) {
  return (
    <svg
      ref={ringsRef}
      aria-hidden="true"
      viewBox="0 0 200 80"
      className="absolute bottom-[6%] left-1/2 w-[78%] -translate-x-1/2 overflow-visible"
      fill="none"
      stroke="currentColor"
    >
      {Array.from({ length: 7 }, (_, i) => (
        <ellipse
          key={i}
          cx="100"
          cy="40"
          rx={30 + i * 12}
          ry={8 + i * 3.6}
          strokeWidth="0.8"
          strokeOpacity={0.34 - i * 0.04}
        />
      ))}
    </svg>
  );
}

export function BuyBox({
  name,
  brand,
  options,
  variants,
  defaultSelection,
  icon,
  bagCount = 0,
  lowStockAt = 5,
  onAddToCart,
  onNotify,
  currency = "USD",
  locale,
  className = "",
}: BuyBoxProps) {
  const reduced = useInteractionReducedMotion();
  const hydrated = useHydrated();
  const baseId = React.useId();
  const [pick, setPick] = React.useState<Record<string, string>>(
    () =>
      defaultSelection ??
      (variants.find((v) => v.stock !== 0) ?? variants[0])?.options ??
      {},
  );
  const [quantity, setQuantity] = React.useState(1);
  const [add, setAdd] = React.useState<{
    status: ActionStatus;
    error?: string;
  }>({ status: "idle" });
  const [notify, setNotify] = React.useState<{
    open: boolean;
    email: string;
    status: ActionStatus;
    error?: string;
  }>({ open: false, email: "", status: "idle" });
  const [added, setAdded] = React.useState(0);
  const [ready, setReady] = React.useState(false);
  const [said, setSaid] = React.useState("");

  const sectionRef = React.useRef<HTMLElement>(null);
  const productRef = React.useRef<HTMLDivElement>(null);
  const bagRef = React.useRef<HTMLSpanElement>(null);
  const ringsRef = React.useRef<SVGSVGElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const variant =
    variants.find(
      (v) =>
        matches(v, pick) && options.every((o) => v.options[o.id] !== undefined),
    ) ?? null;
  const swatchOption = options.find((o) => o.values.some((v) => v.swatch));
  const swatch =
    swatchOption?.values.find((v) => v.id === pick[swatchOption.id])?.swatch ??
    "var(--primary)";
  const price = variant?.price ?? Math.min(...variants.map((v) => v.price));
  const soldOut = variant?.stock === 0;
  const low =
    variant?.stock !== undefined &&
    variant.stock > 0 &&
    variant.stock <= lowStockAt;
  const saving =
    variant?.compareAt && variant.compareAt > variant.price
      ? Math.round((1 - variant.price / variant.compareAt) * 100)
      : 0;
  const busy = add.status === "pending";
  const bag = bagCount + added;

  /** Is this value made with the rest of what's picked, and in stock? */
  const state = (optionId: string, valueId: string): "ok" | "out" | "none" => {
    const made = variants.filter(
      (v) => v.options[optionId] === valueId && matches(v, pick, optionId),
    );
    if (!made.length) return "none";
    return made.some((v) => v.stock !== 0) ? "ok" : "out";
  };

  const choose = (optionId: string, valueId: string) => {
    if (busy) return;
    const next = { ...pick, [optionId]: valueId };
    // Not made with the rest of the picks: move the others to the closest variant that is.
    const exact = variants.some((v) => matches(v, next));
    const fallback = exact
      ? next
      : (
          variants.find(
            (v) => v.options[optionId] === valueId && v.stock !== 0,
          ) ?? variants.find((v) => v.options[optionId] === valueId)
        )?.options;
    setPick(fallback ?? next);
    setAdd({ status: "idle" });
    if (notify.open)
      setNotify((n) => ({
        ...n,
        open: false,
        status: "idle",
        error: undefined,
      }));
    if (
      optionId === swatchOption?.id &&
      !reduced &&
      valueId !== pick[optionId]
    ) {
      // The rings are centred with `translate`, so the ripple only scales.
      ringsRef.current?.animate(
        [
          { transform: "scale(0.9)", opacity: 0.35 },
          { transform: "scale(1)", opacity: 1 },
        ],
        { duration: 620, easing: EASE_THROW },
      );
    }
  };

  // The product is thrown into the bag: a copy arcs from the stage to the bag, which bumps as it lands.
  const fly = () => {
    const section = sectionRef.current;
    const from = productRef.current;
    const to = bagRef.current;
    if (!section || !from || !to || reduced) {
      setAdded((n) => n + quantity);
      return;
    }
    const box = section.getBoundingClientRect();
    // Screen px to the block's own px, so the throw lands true inside a scaled or zoomed container too.
    const k = box.width / (section.offsetWidth || box.width) || 1;
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const copy = from.cloneNode(true) as HTMLElement;
    copy.setAttribute("aria-hidden", "true");
    Object.assign(copy.style, {
      position: "absolute",
      left: `${(a.left - box.left) / k}px`,
      top: `${(a.top - box.top) / k}px`,
      width: `${a.width / k}px`,
      height: `${a.height / k}px`,
      margin: "0",
      zIndex: "20",
      pointerEvents: "none",
      willChange: "transform",
    });
    section.appendChild(copy);
    const dx = (b.left + b.width / 2 - (a.left + a.width / 2)) / k;
    const dy = (b.top + b.height / 2 - (a.top + a.height / 2)) / k;
    const s = Math.min(b.height / a.height, 0.3);
    const flight = copy.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        {
          transform: `translate(${dx * 0.55}px, ${dy * 0.35 - 40}px) scale(${(1 + s) / 2}) rotate(-8deg)`,
          opacity: 1,
          offset: 0.5,
        },
        {
          transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(-14deg)`,
          opacity: 0.2,
        },
      ],
      { duration: 680, easing: "cubic-bezier(0.5,0,0.25,1)", fill: "forwards" },
    );
    flight.onfinish = flight.oncancel = () => {
      copy.remove();
      setAdded((n) => n + quantity);
      bagRef.current?.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.16)" },
          { transform: "scale(1)" },
        ],
        { duration: 420, easing: EASE_THROW },
      );
    };
  };

  const addToBag = async () => {
    if (!variant || busy || soldOut) return;
    setAdd({ status: "pending" });
    try {
      await onAddToCart(variant, quantity);
      setAdd({ status: "success" });
      setSaid(`Added ${quantity} ${name} to your bag.`);
      fly();
    } catch (e) {
      setAdd({
        status: "error",
        error:
          e instanceof Error && e.message
            ? e.message
            : "Couldn’t add that. Try again.",
      });
    }
  };

  const sendNotify = async () => {
    if (!variant || !onNotify) return;
    if (!notify.open) {
      setNotify((n) => ({ ...n, open: true }));
      window.setTimeout(
        () => emailRef.current?.focus({ preventScroll: true }),
        reduced ? 0 : 300,
      );
      return;
    }
    if (!EMAIL.test(notify.email.trim()))
      return setNotify((n) => ({
        ...n,
        status: "idle",
        error: "Add an email we can write to",
      }));
    setNotify((n) => ({ ...n, status: "pending", error: undefined }));
    try {
      await onNotify(variant, notify.email.trim());
      setNotify((n) => ({ ...n, status: "success" }));
      setSaid("We’ll email you when it’s back.");
    } catch (e) {
      setNotify((n) => ({
        ...n,
        status: "error",
        error:
          e instanceof Error && e.message
            ? e.message
            : "Couldn’t save that. Try again.",
      }));
    }
  };

  const stock = soldOut
    ? "Sold out"
    : low
      ? `Only ${variant?.stock} left`
      : variant
        ? "In stock, ships today"
        : "Pick an option";
  const fmt = (n: number) => money(currency, n);

  return (
    <section
      ref={sectionRef}
      aria-labelledby={`${baseId}-name`}
      className={`relative w-full max-w-[400px] rounded-[28px] p-2 text-card-foreground ${className}`}
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
        {/* The one lit surface: the stage, painted in the colour you picked. */}
        <div
          className="relative h-[220px] overflow-clip rounded-[22px]"
          style={{
            backgroundColor: mix(swatch, 48, "var(--card)"),
            backgroundImage: `radial-gradient(120% 90% at 0% 0%, ${mix("white", 34)} 0%, transparent 55%), linear-gradient(175deg, transparent 45%, ${mix("black", 14)} 100%)`,
            boxShadow: `inset 0 1px 0 ${mix("white", 40)}, inset 0 0 0 1px ${mix(swatch, 30)}`,
            color: mix(swatch, 62, "black"),
            transition: reduced
              ? "none"
              : `background-color 520ms ${EASE}, color 520ms ${EASE}, box-shadow 520ms ${EASE}`,
          }}
        >
          <Rings ringsRef={ringsRef} />
          <div
            ref={productRef}
            className="absolute inset-x-0 top-[14%] mx-auto flex size-[128px] items-center justify-center [&_svg]:size-[92px]"
          >
            {variant?.image ? (
              <img
                key={variant.image}
                src={variant.image}
                alt=""
                decoding="async"
                className="size-full object-contain motion-safe:animate-[ui-fade-in_420ms_ease-out_both]"
              />
            ) : (
              <span aria-hidden="true" className="flex [&_svg]:stroke-[1.2]">
                {icon ?? <ShoppingBag />}
              </span>
            )}
          </div>
          {saving > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-foreground px-2 py-1 text-[11.5px] font-medium tabular-nums text-background">
              −<NumberRoll value={saving} duration={600} />%
            </span>
          )}
          <span
            ref={bagRef}
            className="absolute right-3 top-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-card px-3 text-[12.5px] font-medium text-foreground shadow-[inset_0_0_0_1px_var(--border)]"
            aria-label={`${bag} in your bag`}
          >
            <ShoppingBag aria-hidden="true" className="size-3.5" />
            <NumberRoll value={bag} duration={600} aria-hidden="true" />
          </span>
        </div>

        <div className="px-2 pb-1 pt-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {brand && (
                <p className="text-[12px] text-muted-foreground">{brand}</p>
              )}
              <h2
                id={`${baseId}-name`}
                className="text-[18px] font-medium leading-tight tracking-[-0.02em]"
              >
                {name}
              </h2>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[22px] font-medium leading-none tracking-[-0.03em] tabular-nums">
                <NumberRoll
                  value={price}
                  locales={locale}
                  format={fmt(price)}
                  duration={800}
                />
              </p>
              {saving > 0 && variant?.compareAt && (
                <p className="mt-1 text-[12px] text-muted-foreground tabular-nums line-through">
                  {new Intl.NumberFormat(
                    locale ?? (hydrated ? undefined : "en-US"),
                    fmt(variant.compareAt),
                  ).format(variant.compareAt)}
                </p>
              )}
            </div>
          </div>

          {options.map((o) => {
            const chosen = o.values.find((v) => v.id === pick[o.id]);
            return (
              <div key={o.id} className="mt-3.5">
                <p className="text-[12.5px] text-muted-foreground">
                  {o.label} ·{" "}
                  <TextMorph className="text-foreground">
                    {chosen?.label ?? "Choose"}
                  </TextMorph>
                </p>
                <div
                  role="radiogroup"
                  aria-label={o.label}
                  className="mt-2 flex flex-wrap gap-1.5"
                >
                  {o.values.map((v) => {
                    const on = v.id === pick[o.id];
                    const st = state(o.id, v.id);
                    const label = `${v.label}${st === "out" ? ", sold out" : st === "none" ? ", not made in this combination" : ""}`;
                    return v.swatch ? (
                      <button
                        key={v.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        aria-label={label}
                        title={v.label}
                        onClick={() => choose(o.id, v.id)}
                        className={`relative size-8 cursor-pointer rounded-full ${INTERACTION_PRESS} ${INTERACTION_FOCUS}`}
                        style={{
                          background: v.swatch,
                          boxShadow: on
                            ? `inset 0 0 0 1px ${mix("black", 14)}, 0 0 0 2px var(--card), 0 0 0 3.5px var(--primary)`
                            : `inset 0 0 0 1px ${mix("black", 14)}, 0 0 0 2px var(--card), 0 0 0 2px transparent`,
                          opacity: st === "ok" ? 1 : 0.45,
                          transition: reduced
                            ? "none"
                            : `box-shadow 280ms ${EASE_THROW}, opacity 200ms`,
                        }}
                      >
                        {st !== "ok" && (
                          <span
                            aria-hidden="true"
                            className="absolute left-1/2 top-1/2 h-px w-[130%] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-foreground/60"
                          />
                        )}
                      </button>
                    ) : (
                      <button
                        key={v.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        aria-label={label}
                        onClick={() => choose(o.id, v.id)}
                        className={`h-9 min-w-11 cursor-pointer rounded-full px-3 text-[13px] tabular-nums ${INTERACTION_PRESS} ${INTERACTION_FOCUS} ${
                          on
                            ? "bg-primary/[0.08] font-medium text-primary shadow-[inset_0_0_0_1.5px_var(--primary)]"
                            : "text-foreground shadow-[inset_0_0_0_1px_var(--border)] hover:bg-accent"
                        } ${st !== "ok" ? "text-muted-foreground line-through decoration-1" : ""}`}
                      >
                        {v.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <p
            className={`mt-3.5 flex items-center gap-1.5 text-[12.5px] ${soldOut ? "text-red-600 dark:text-red-400" : low ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}
          >
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${soldOut ? "bg-red-500" : low ? "bg-amber-500" : "bg-emerald-500"}`}
            />
            <TextMorph>{stock}</TextMorph>
          </p>

          <div className="mt-2.5">
            <Faces active={notify.open ? 1 : 0} reduced={reduced} ready={ready}>
              <div className="flex items-center gap-2">
                <StepperInput
                  label="Quantity"
                  value={quantity}
                  min={1}
                  max={variant?.stock && variant.stock > 0 ? variant.stock : 10}
                  onValueChange={setQuantity}
                  disabled={soldOut || busy}
                />
                {soldOut && onNotify ? (
                  <button
                    type="button"
                    onClick={() => void sendNotify()}
                    className={`inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full text-[14.5px] font-medium text-foreground shadow-[inset_0_0_0_1px_var(--border)] hover:bg-accent ${INTERACTION_PRESS} ${INTERACTION_FOCUS}`}
                  >
                    <BellRing aria-hidden="true" className="size-4" />
                    Notify me
                  </button>
                ) : (
                  <StatusButton
                    status={add.status}
                    labels={{
                      idle: soldOut ? "Sold out" : "Add to bag",
                      pending: "Adding",
                      success: "Added",
                      error: "Try again",
                    }}
                    icon={<ShoppingBag aria-hidden="true" />}
                    disabled={!variant || soldOut}
                    onReset={() => setAdd({ status: "idle" })}
                    resetAfter={1500}
                    onClick={() => void addToBag()}
                    className="h-11 flex-1 text-[14.5px] disabled:opacity-45"
                    style={add.status === "error" ? undefined : LIT}
                  />
                )}
              </div>
              <form
                className="flex items-start gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendNotify();
                }}
              >
                <Input
                  ref={emailRef}
                  aria-label="Email for a restock note"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  value={notify.email}
                  error={notify.error}
                  disabled={
                    notify.status === "pending" || notify.status === "success"
                  }
                  onValueChange={(email) =>
                    setNotify((n) => ({
                      ...n,
                      email,
                      error: undefined,
                      status: n.status === "error" ? "idle" : n.status,
                    }))
                  }
                  className="flex-1"
                />
                <StatusButton
                  type="submit"
                  status={notify.status}
                  labels={{
                    idle: "Notify me",
                    pending: "Saving",
                    success: "You’re on the list",
                    error: "Try again",
                  }}
                  className="h-9 shrink-0 px-4 text-[13px]"
                  style={notify.status === "error" ? undefined : LIT}
                />
              </form>
            </Faces>
            {add.error && (
              <p
                role="alert"
                className="mt-1.5 text-[12px] text-red-600 dark:text-red-400"
              >
                {add.error}
              </p>
            )}
          </div>
        </div>

        <span className="sr-only" role="status">
          {said}
        </span>
      </div>
    </section>
  );
}

export default BuyBox;
