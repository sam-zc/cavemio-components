"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Delete, Eye, EyeOff, X } from "lucide-react";
import { CopyButton } from "./copy-button";
import { NumberRoll } from "./number-roll";
import { StatusButton, type ActionStatus } from "./status-button";
import { TextMorph } from "./text-morph";
import { Faces } from "./faces";
import { useRowMotion } from "./use-row-motion";
import {
  INTERACTION_FOCUS,
  INTERACTION_PRESS,
  interactionIcon,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";

/* ─────────────────────────────────────────────────────────
 * WALLET: a balance you can send from, in one surface
 *
 *   card      the balance sits on a card-shaped panel in your
 *             --primary, lit from its top corner and engraved
 *             with fine fine lines like a banknote; the figure
 *             rolls the way it changed, and hiding it folds the
 *             digits into dots
 *   send      the card itself turns into the transfer: the figure
 *             gives way to the amount you type (each new place
 *             rolls open), the actions and activity fold away and
 *             a keypad folds in, all in one surface
 *   sent      the button goes Sending → Sent with a drawn check,
 *             the card turns back, the balance rolls down by the
 *             amount and the new row slides into Activity
 *   request   the same surface asks instead; a request shows as a
 *             pending row until your server marks it paid, then
 *             "Requested" morphs into "Paid" and the balance rolls up
 *
 * The money is yours, not the card's: pass balance and
 * transactions, and do the transfer in onSend / onRequest. Resolve
 * and the card shows it sent; throw and it keeps the amount and
 * says why.
 * ───────────────────────────────────────────────────────── */

export interface WalletContact {
  id: string;
  name: string;
  /** Photo URL; initials on a tint from your chart colours when missing. */
  src?: string;
}

export interface WalletTransaction {
  id: string;
  title: string;
  date: Date | string | number;
  /** Signed, in major units: negative is money out, positive is money in. */
  amount: number;
  /** A request that hasn't been paid yet shows as pending. */
  status?: "pending" | "paid";
  /** Photo URL for the person; initials when missing. */
  src?: string;
  /** A merchant's logo or glyph, shown on a tinted tile instead of initials. */
  icon?: React.ReactNode;
}

export interface WalletTransfer {
  contact: WalletContact;
  /** In major units, always positive. */
  amount: number;
  note: string;
}

export interface WalletProps {
  /** The account holder, on the card. */
  name?: string;
  /** What the account is called, at the top of the card. */
  label?: string;
  /** The last four digits of the card or account, shown masked. */
  last4?: string;
  balance: number;
  contacts?: WalletContact[];
  /** Newest first. */
  transactions?: WalletTransaction[];
  /** Move the money; resolve when your server has it, throw an Error with a message to say why it failed. */
  onSend?: (transfer: WalletTransfer) => Promise<unknown>;
  /** Ask someone for money; resolve once the request exists (add it to transactions as pending). */
  onRequest?: (transfer: WalletTransfer) => Promise<unknown>;
  /** ISO 4217 code. */
  currency?: string;
  locale?: string;
  /** Shown with a copy button while requesting. */
  paymentLink?: string;
  /** Hide the balance (controlled). */
  hidden?: boolean;
  defaultHidden?: boolean;
  onHiddenChange?: (hidden: boolean) => void;
  /** Rows shown before "See all". */
  visibleTransactions?: number;
  className?: string;
}

type Mode = "home" | "send" | "request";

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const MORPH = 460;
const MAX_DIGITS = 9;
const NO_CONTACTS: WalletContact[] = [];
const NO_TRANSACTIONS: WalletTransaction[] = [];
const KEYS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ".",
  "0",
  "back",
] as const;

const subscribeNothing = () => () => {};
/** False on the server and while hydrating: text is formatted in one fixed locale until then, so the server's and the visitor's never disagree. */
const useHydrated = () =>
  React.useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );

/* Light is drawn from the theme's own colours: a lit corner of primary-foreground over --primary, a deeper
 * edge mixed toward black, and 1px edges (a highlight along the top, a faint ring all round). */
const mix = (color: string, amount: number, into = "transparent") =>
  `color-mix(in oklab, ${color} ${amount}%, ${into})`;
const PANEL: React.CSSProperties = {
  backgroundColor: "var(--primary)",
  backgroundImage: `radial-gradient(120% 110% at 0% 0%, ${mix("var(--primary-foreground)", 24)} 0%, transparent 52%), linear-gradient(165deg, transparent 35%, ${mix("black", 26)} 100%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 38)}, inset 0 0 0 1px ${mix("var(--primary-foreground)", 12)}`,
};
const CARD: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 95, "var(--foreground)")})`,
  boxShadow: `0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 85)}`,
};
const RAISED: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 93, "var(--foreground)")})`,
  boxShadow: `inset 0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 90)}`,
};
const LIT: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${mix("var(--primary-foreground)", 16)}, transparent 60%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 32)}, inset 0 0 0 1px ${mix("black", 10)}`,
};

/** A stable tint from your chart colours, so the same person always has the same colour. */
function tint(seed: string): React.CSSProperties {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const chart = `var(--chart-${(h % 5) + 1}, var(--primary))`;
  return {
    background: mix(chart, 20, "var(--card)"),
    color: mix(chart, 72, "var(--foreground)"),
    boxShadow: `inset 0 0 0 1px ${mix(chart, 26)}`,
  };
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

/** A person (photo or initials) or a merchant (its glyph on a rounded tile), tinted the same way everywhere. */
function Face({
  name,
  src,
  icon,
  size,
}: {
  name: string;
  src?: string;
  icon?: React.ReactNode;
  size: number;
}) {
  return (
    <span
      aria-hidden="true"
      className={`relative flex shrink-0 select-none items-center justify-center overflow-hidden font-medium ${icon ? "rounded-[12px]" : "rounded-full"}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.36),
        ...tint(name),
      }}
    >
      {icon ? (
        <span className="flex [&_svg]:size-[46%] size-full items-center justify-center">
          {icon}
        </span>
      ) : (
        initials(name)
      )}
      {src && (
        <img
          src={src}
          alt=""
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </span>
  );
}

/** Fine fine lines engraved into the card, rippling out from its top corner. */
function Engraving() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 200"
      preserveAspectRatio="xMaxYMin slice"
      className="pointer-events-none absolute inset-0 size-full text-primary-foreground"
      fill="none"
      stroke="currentColor"
    >
      {Array.from({ length: 16 }, (_, i) => (
        <ellipse
          key={i}
          cx="316"
          cy="-6"
          rx={34 + i * 15}
          ry={20 + i * 9.5}
          transform="rotate(-16 316 -6)"
          strokeWidth="0.75"
          strokeOpacity={i % 4 === 0 ? 0.13 : 0.07}
        />
      ))}
    </svg>
  );
}

/** The card's two faces in one place: the balance and the transfer, sliding past each other. */
function CardFaces({
  composing,
  reduced,
  ready,
  children,
}: {
  composing: boolean;
  reduced: boolean;
  ready: boolean;
  children: [React.ReactNode, React.ReactNode];
}) {
  const face = (on: boolean, side: number): React.CSSProperties => ({
    opacity: on ? 1 : 0,
    transform: on || reduced ? "none" : `translateX(${side * 18}px)`,
    filter: on || reduced ? "none" : "blur(4px)",
    transition: !ready
      ? "none"
      : reduced
        ? "opacity 160ms ease-out"
        : on
          ? `opacity 320ms ${EASE} 90ms, transform ${MORPH}ms ${EASE}, filter 320ms ${EASE} 90ms`
          : `opacity 140ms ease-out, transform ${MORPH}ms ${EASE}, filter 200ms ease-out`,
  });
  return (
    <>
      <div
        inert={composing || undefined}
        aria-hidden={composing || undefined}
        className={`absolute inset-0 flex flex-col ${composing ? "pointer-events-none" : ""}`}
        style={face(!composing, -1)}
      >
        {children[0]}
      </div>
      <div
        inert={!composing || undefined}
        aria-hidden={!composing || undefined}
        className={`absolute inset-0 flex flex-col ${composing ? "" : "pointer-events-none"}`}
        style={face(composing, 1)}
      >
        {children[1]}
      </div>
    </>
  );
}

/** A typed amount kept as a string ("12.5"), so keys never meet floating point. */
function press(raw: string, key: string) {
  if (key === "back") return raw.slice(0, -1);
  if (key === ".") return raw.includes(".") ? raw : `${raw || "0"}.`;
  if (raw.includes(".")) return raw.split(".")[1].length >= 2 ? raw : raw + key;
  if (raw === "0") return key;
  return raw.length >= MAX_DIGITS ? raw : raw + key;
}

function useMoney(locale: string | undefined, currency: string) {
  return React.useMemo(() => {
    const full = new Intl.NumberFormat(locale, { style: "currency", currency });
    const signed = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      signDisplay: "exceptZero",
    });
    const decimal =
      new Intl.NumberFormat(locale)
        .formatToParts(1.5)
        .find((p) => p.type === "decimal")?.value ?? ".";
    const day = new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
    });
    const time = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return {
      format: (n: number) => full.format(n),
      signed: (n: number) => signed.format(n).replace("-", "−"),
      decimal,
      when: (d: Date | string | number) => {
        const date = new Date(d);
        return `${day.format(date)} · ${time.format(date)}`;
      },
    };
  }, [locale, currency]);
}

export function Wallet({
  name = "You",
  label: accountLabel = "Balance",
  last4,
  balance,
  contacts = NO_CONTACTS,
  transactions = NO_TRANSACTIONS,
  onSend,
  onRequest,
  currency = "USD",
  locale,
  paymentLink,
  hidden: hiddenProp,
  defaultHidden = false,
  onHiddenChange,
  visibleTransactions = 2,
  className = "",
}: WalletProps) {
  const reduced = useInteractionReducedMotion();
  const hydrated = useHydrated();
  const money = useMoney(locale ?? (hydrated ? undefined : "en-US"), currency);
  const baseId = React.useId();

  const [mode, setMode] = React.useState<Mode>("home");
  const [contactId, setContactId] = React.useState<string | null>(null);
  const [raw, setRaw] = React.useState("");
  const [note, setNote] = React.useState("");
  const [status, setStatus] = React.useState<ActionStatus>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [said, setSaid] = React.useState("");
  const [expanded, setExpanded] = React.useState(false);
  const [ownHidden, setOwnHidden] = React.useState(defaultHidden);
  const hidden = hiddenProp ?? ownHidden;

  // What the card shows lags the props while a transfer is on screen, so the balance rolls and the new row
  // arrives where you can see them: once the card has turned back.
  const [shown, setShown] = React.useState({ balance, transactions });
  const [ready, setReady] = React.useState(false);
  const returning = React.useRef(false);

  const composeRef = React.useRef<HTMLDivElement>(null);
  const sendRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const ghostRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  React.useEffect(() => {
    if (mode !== "home") return;
    const delay = returning.current && !reduced ? MORPH * 0.6 : 0;
    returning.current = false;
    const timer = window.setTimeout(
      () =>
        setShown((p) =>
          p.balance === balance && p.transactions === transactions
            ? p
            : { balance, transactions },
        ),
      delay,
    );
    return () => window.clearTimeout(timer);
  }, [mode, balance, transactions, reduced]);

  // Focus follows the surface: into the transfer when it opens, back to Send when it closes.
  React.useEffect(() => {
    if (!ready || mode === "home") return;
    composeRef.current?.focus({ preventScroll: true });
  }, [mode, ready]);

  const composing = mode !== "home";
  const sending = mode === "send";
  const contact = contacts.find((c) => c.id === contactId) ?? null;
  const first = contact?.name.split(" ")[0] ?? "";
  const amount = Number(raw || "0");
  const cents = Math.round(amount * 100);
  const over = sending && cents > Math.round(shown.balance * 100);
  const valid = Boolean(contact) && cents > 0 && !over;
  const busy = status === "pending" || status === "success";
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;

  const rows = expanded
    ? shown.transactions
    : shown.transactions.slice(0, visibleTransactions);
  const ranks = React.useMemo(
    () => new Map(shown.transactions.map((t, i) => [t.id, i])),
    [shown.transactions],
  );
  useRowMotion(listRef, { reduced, ranks, ghosts: ghostRef });

  const open = (next: Mode, id: string | null = null) => {
    setMode(next);
    setContactId(id);
    setRaw("");
    setNote("");
    setStatus("idle");
    setError(null);
    setSaid("");
  };

  const close = (focusSend = true) => {
    if (status === "pending") return;
    returning.current = true;
    setMode("home");
    setStatus("idle");
    setError(null);
    if (focusSend)
      window.setTimeout(
        () => sendRef.current?.focus({ preventScroll: true }),
        reduced ? 0 : MORPH,
      );
  };

  const key = (k: string) => {
    if (busy) return;
    setError(null);
    if (status === "error") setStatus("idle");
    setRaw((r) => press(r, k));
  };

  const submit = async () => {
    if (!valid || !contact || busy) return;
    const transfer = { contact, amount: cents / 100, note: note.trim() };
    const run = sending ? onSend : onRequest;
    setStatus("pending");
    setError(null);
    try {
      await run?.(transfer);
      setStatus("success");
      setSaid(
        sending
          ? `Sent ${money.format(transfer.amount)} to ${contact.name}`
          : `Asked ${contact.name} for ${money.format(transfer.amount)}`,
      );
      window.setTimeout(() => close(), reduced ? 900 : 1100);
    } catch (e) {
      setStatus("error");
      setError(
        e instanceof Error && e.message
          ? e.message
          : "That didn't go through. Try again.",
      );
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!composing) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if ((e.target as HTMLElement).tagName === "INPUT") {
      if (e.key === "Enter") {
        e.preventDefault();
        void submit();
      }
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^[0-9]$/.test(e.key) || e.key === "." || e.key === ",") {
      e.preventDefault();
      key(e.key === "," ? "." : e.key);
    } else if (e.key === "Backspace") {
      e.preventDefault();
      key("back");
    } else if (
      e.key === "Enter" &&
      (e.target as HTMLElement).tagName !== "BUTTON"
    ) {
      e.preventDefault();
      void submit();
    }
  };

  const action = !contact
    ? sending
      ? "Choose who to pay"
      : "Choose who to ask"
    : cents === 0
      ? "Enter an amount"
      : over
        ? "More than your balance"
        : `${sending ? "Send" : "Request"} ${money.format(cents / 100)}`;

  const sub =
    error ??
    (over
      ? "That’s more than you have."
      : sending
        ? `Available ${hidden ? "••••" : money.format(shown.balance)}`
        : contact
          ? `${first} gets a request to pay you`
          : "They’ll get a request to pay you");

  const onCard = `cursor-pointer ${INTERACTION_PRESS} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70`;
  const big = `inline-flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full text-[15px] font-medium ${INTERACTION_PRESS} ${INTERACTION_FOCUS}`;
  const figure =
    "text-[clamp(38px,12.5cqw,52px)] font-medium leading-none tracking-[-0.045em] tabular-nums";

  return (
    <section
      aria-label="Wallet"
      onKeyDown={onKeyDown}
      className={`w-full max-w-[400px] rounded-[32px] p-2.5 text-card-foreground ${className}`}
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
        {/* The one colour surface: a card that turns into the transfer. */}
        <div
          className="relative aspect-[1.6/1] overflow-clip rounded-[24px] text-primary-foreground"
          style={PANEL}
        >
          <Engraving />
          <CardFaces composing={composing} reduced={reduced} ready={ready}>
            <div className="flex h-full flex-col justify-between px-5 pb-[18px] pt-4">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-[13.5px] font-medium tracking-[-0.01em] text-primary-foreground/90">
                  {accountLabel}
                </span>
                <button
                  type="button"
                  aria-label={hidden ? "Show balance" : "Hide balance"}
                  aria-pressed={hidden}
                  onClick={() => {
                    if (hiddenProp === undefined) setOwnHidden(!hidden);
                    onHiddenChange?.(!hidden);
                  }}
                  className={`-mr-1.5 relative flex size-8 items-center justify-center rounded-full text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground ${onCard}`}
                >
                  <Eye
                    aria-hidden="true"
                    className="absolute size-[17px]"
                    style={interactionIcon(!hidden, reduced)}
                  />
                  <EyeOff
                    aria-hidden="true"
                    className="absolute size-[17px]"
                    style={interactionIcon(hidden, reduced)}
                  />
                </button>
              </div>

              <div>
                <p className="text-[12.5px] text-primary-foreground/65">
                  Available
                </p>
                <p className={`mt-1.5 grid ${figure}`}>
                  <span className="sr-only">
                    {hidden ? "Balance hidden" : money.format(shown.balance)}
                  </span>
                  <span
                    aria-hidden="true"
                    className="[grid-area:1/1]"
                    style={{
                      opacity: hidden ? 0 : 1,
                      filter: hidden && !reduced ? "blur(6px)" : "none",
                      transition: reduced
                        ? "opacity 160ms"
                        : `opacity 260ms ${EASE}, filter 260ms ${EASE}`,
                    }}
                  >
                    <NumberRoll
                      value={shown.balance}
                      locales={locale}
                      format={{ style: "currency", currency }}
                      duration={1100}
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    className="self-center text-[0.6em] tracking-[0.18em] [grid-area:1/1]"
                    style={{
                      opacity: hidden ? 1 : 0,
                      filter: hidden || reduced ? "none" : "blur(6px)",
                      transition: reduced
                        ? "opacity 160ms"
                        : `opacity 260ms ${EASE} 80ms, filter 260ms ${EASE} 80ms`,
                    }}
                  >
                    ••••••
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 text-[13px] text-primary-foreground/80">
                <span className="truncate font-medium">{name}</span>
                {last4 && (
                  <span className="shrink-0 font-mono text-[12.5px] tracking-[0.14em] text-primary-foreground/70">
                    •••• {last4}
                  </span>
                )}
              </div>
            </div>

            <div
              ref={composeRef}
              tabIndex={-1}
              role="group"
              aria-labelledby={`${baseId}-title`}
              className="flex h-full flex-col justify-between px-5 pb-[18px] pt-4 outline-none"
            >
              <div className="flex items-center justify-between gap-3">
                <h3
                  id={`${baseId}-title`}
                  className="truncate text-[13.5px] font-medium tracking-[-0.01em] text-primary-foreground/90"
                >
                  <TextMorph>{`${sending ? "Send" : "Request"}${contact ? (sending ? ` to ${first}` : ` from ${first}`) : ""}`}</TextMorph>
                </h3>
                <button
                  type="button"
                  aria-label="Cancel"
                  onClick={() => close()}
                  className={`-mr-1.5 flex size-8 items-center justify-center rounded-full text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground ${onCard}`}
                >
                  <X aria-hidden="true" className="size-[17px]" />
                </button>
              </div>
              <div>
                <p className="text-[12.5px] text-primary-foreground/65">
                  {sending ? "Amount" : "Asking for"}
                </p>
                <p
                  className={`mt-1.5 ${figure} ${raw ? "" : "text-primary-foreground/45"}`}
                  style={{ transition: "color 200ms" }}
                >
                  <span className="sr-only">{`Amount ${money.format(amount)}`}</span>
                  <span aria-hidden="true">
                    <NumberRoll
                      value={amount}
                      locales={locale}
                      format={{
                        style: "currency",
                        currency,
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: 2,
                      }}
                      suffix={raw.endsWith(".") ? money.decimal : ""}
                      duration={520}
                    />
                  </span>
                </p>
              </div>
              <p
                role={error || over ? "alert" : undefined}
                className="truncate text-[13px] text-primary-foreground/80"
              >
                {sub}
              </p>
            </div>
          </CardFaces>
        </div>

        {/* Request and Send, folded away while the card is the transfer. */}
        <div
          inert={composing || undefined}
          className="grid"
          style={{
            gridTemplateRows: composing ? "0fr" : "1fr",
            opacity: composing ? 0 : 1,
            transition: reduced
              ? "opacity 160ms"
              : `grid-template-rows ${MORPH}ms ${EASE}, opacity ${composing ? 140 : 320}ms ${EASE}`,
          }}
        >
          <div className="min-h-0 overflow-clip">
            <div className="flex gap-2 px-0.5 pt-2.5">
              <button
                type="button"
                onClick={() => open("request")}
                className={`${big} text-foreground`}
                style={RAISED}
              >
                <ArrowDown aria-hidden="true" className="size-[18px]" />
                Request
              </button>
              <button
                ref={sendRef}
                type="button"
                onClick={() => open("send")}
                className={`${big} bg-primary text-primary-foreground`}
                style={LIT}
              >
                <ArrowUp aria-hidden="true" className="size-[18px]" />
                Send
              </button>
            </div>
          </div>
        </div>

        {contacts.length > 0 && (
          <div className="px-3 pt-5">
            <p className="text-[12.5px] text-muted-foreground">
              <TextMorph>
                {composing ? (sending ? "To" : "From") : "Send again"}
              </TextMorph>
            </p>
            <div
              role={composing ? "radiogroup" : "group"}
              aria-label={
                composing
                  ? sending
                    ? "Who to pay"
                    : "Who to ask"
                  : "Send again"
              }
              className="-mx-1 mt-2.5 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {contacts.map((c) => {
                const on = composing && c.id === contactId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role={composing ? "radio" : undefined}
                    aria-checked={composing ? on : undefined}
                    aria-label={composing ? c.name : `Send to ${c.name}`}
                    onClick={() => {
                      if (!composing) return open("send", c.id);
                      if (busy) return;
                      setContactId(c.id);
                      setError(null);
                      if (status === "error") setStatus("idle");
                    }}
                    className={`flex min-w-[56px] max-w-[66px] flex-1 cursor-pointer flex-col items-center gap-1.5 rounded-[14px] py-1.5 ${INTERACTION_PRESS} ${INTERACTION_FOCUS}`}
                  >
                    <span
                      className="flex rounded-full"
                      style={{
                        boxShadow: on
                          ? "0 0 0 2px var(--card), 0 0 0 3.5px var(--primary)"
                          : "0 0 0 2px var(--card), 0 0 0 2px transparent",
                        opacity: composing && contactId && !on ? 0.45 : 1,
                        transition: reduced
                          ? "none"
                          : `box-shadow 260ms ${EASE}, opacity 260ms ${EASE}`,
                      }}
                    >
                      <Face name={c.name} src={c.src} size={44} />
                    </span>
                    <span
                      className={`max-w-full truncate text-[12px] ${on ? "font-medium text-foreground" : "text-muted-foreground"}`}
                    >
                      {c.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <Faces active={composing ? 1 : 0} reduced={reduced} ready={ready}>
          <div className="px-3 pb-1.5 pt-3">
            <div className="flex h-7 items-center justify-between">
              <h3 className="text-[12.5px] font-normal text-muted-foreground">
                Activity
              </h3>
              {shown.transactions.length > visibleTransactions && (
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setExpanded((v) => !v)}
                  className={`-mr-2 cursor-pointer rounded-full px-2 py-1 text-[12.5px] text-foreground hover:bg-accent ${INTERACTION_FOCUS}`}
                >
                  <TextMorph>{expanded ? "Show less" : "See all"}</TextMorph>
                </button>
              )}
            </div>
            <div className="relative">
              <div
                ref={ghostRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              />
              {rows.length ? (
                <ul ref={listRef} className="relative">
                  {rows.map((t) => {
                    const pending = t.status === "pending";
                    return (
                      <li
                        key={t.id}
                        data-row-id={t.id}
                        className="flex items-center gap-3 border-t border-border py-3 first:border-t-0"
                      >
                        <Face
                          name={t.title.replace(/^(To|From)\s+/, "")}
                          src={t.src}
                          icon={t.icon}
                          size={42}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14.5px] font-medium tracking-[-0.01em] text-foreground">
                            {t.title}
                          </span>
                          <span
                            className="block text-[12.5px] text-muted-foreground"
                            suppressHydrationWarning
                          >
                            {money.when(t.date)}
                          </span>
                        </span>
                        <span className="flex flex-col items-end">
                          <span
                            className={`text-[15px] font-medium tracking-[-0.01em] tabular-nums ${pending ? "text-muted-foreground" : t.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}
                            style={{ transition: "color 300ms" }}
                          >
                            {money.signed(t.amount)}
                          </span>
                          {t.status && (
                            <span className="text-[11.5px] text-muted-foreground">
                              <TextMorph>
                                {pending ? "Requested" : "Paid"}
                              </TextMorph>
                            </span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="py-6 text-center text-[13px] text-muted-foreground">
                  No activity yet
                </p>
              )}
            </div>
          </div>

          <div className="px-1 pb-1 pt-4">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={60}
              disabled={busy}
              placeholder={sending ? "What’s it for?" : "Add a note"}
              aria-label="Note (optional)"
              enterKeyHint={sending ? "send" : "done"}
              className="h-11 w-full rounded-full border border-border bg-transparent px-4 text-[14px] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 max-sm:text-[16px]"
            />
            <div className="mt-2.5 grid grid-cols-3 gap-1.5">
              {KEYS.map((k) => (
                <button
                  key={k}
                  type="button"
                  tabIndex={-1}
                  aria-label={
                    k === "back" ? "Delete" : k === "." ? "Decimal point" : k
                  }
                  onClick={() => key(k)}
                  className={`flex h-12 cursor-pointer items-center justify-center rounded-[16px] text-[20px] font-medium tabular-nums text-foreground hover:bg-accent active:bg-accent ${INTERACTION_PRESS} [-webkit-tap-highlight-color:transparent]`}
                >
                  {k === "back" ? (
                    <Delete
                      aria-hidden="true"
                      className="size-5 text-muted-foreground"
                    />
                  ) : k === "." ? (
                    money.decimal
                  ) : (
                    k
                  )}
                </button>
              ))}
            </div>
            <StatusButton
              status={status}
              labels={{
                idle: action,
                pending: sending ? "Sending" : "Requesting",
                success: sending ? "Sent" : "Requested",
                error: "Try again",
              }}
              disabled={!valid && status !== "error" && !busy}
              onClick={() => void submit()}
              className="mt-2.5 h-12 w-full text-[15px] disabled:opacity-50"
              style={status === "error" ? undefined : LIT}
            />
            {!sending && paymentLink && (
              <div className="mt-2 flex items-center justify-center gap-1 text-[12.5px] text-muted-foreground">
                Or share
                <CopyButton
                  text={paymentLink}
                  label={paymentLink}
                  copiedLabel="Link copied"
                  showLabel
                  size="sm"
                />
              </div>
            )}
          </div>
        </Faces>

        <span className="sr-only" role="status">
          {said}
        </span>
      </div>
    </section>
  );
}

export default Wallet;
