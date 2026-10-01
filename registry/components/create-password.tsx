"use client";

import * as React from "react";
import { Hide, type HideHandle, type Point } from "./hide-chameleon";
import { PasswordInput } from "./password-input";
import { StatusButton, type ActionStatus } from "./status-button";
import { TextMorph } from "./text-morph";
import {
  EASE_OUT,
  EASE_THROW,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";

/* ─────────────────────────────────────────────────────────
 * CREATE PASSWORD: the stronger it is, the harder Hide is to find
 *
 *   spot     Hide, a chameleon, sits on a branch on the lit
 *            stage in full colour, watching the caret
 *   catch    each rule the password meets, his tongue shoots
 *            out to its circle and leaves a check there; lose
 *            one and he takes the check back and swallows it
 *   blend    with every check a front of colour change runs a
 *            little further from his tail to his snout; with
 *            all of them he's gone but for his eye
 *   exposed  Show password and his colour floods back, eye
 *            squeezed shut, cheek flushed
 *   startle  wipe the field and his cover's blown: he jumps
 *   breached with checkBreaches, a password seen in a breach
 *            turns him red and says how often
 *   done     Continue → Saving → Password set, and a wink
 *
 * onSubmit gets the password; keep it however you keep them.
 * ───────────────────────────────────────────────────────── */

export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { id: "length", label: "8+ characters", test: (p) => p.length >= 8 },
  { id: "number", label: "A number", test: (p) => /\d/.test(p) },
  { id: "capital", label: "A capital letter", test: (p) => /[A-Z]/.test(p) },
  { id: "symbol", label: "A symbol", test: (p) => /[^A-Za-z0-9\s]/.test(p) },
];

export interface CreatePasswordProps {
  /** Keep the password (your sign-up or reset endpoint); throw an Error to say why not. */
  onSubmit: (password: string) => Promise<unknown>;
  /** How many known breaches the password appears in (0 if none), e.g. from Have I Been Pwned's range API. */
  checkBreaches?: (password: string, signal: AbortSignal) => Promise<number>;
  rules?: PasswordRule[];
  /** The account's email or username, so password managers save the pair. */
  username?: string;
  onValueChange?: (password: string) => void;
  title?: string;
  description?: string;
  submitLabel?: string;
  /** What the chameleon is called in his lines. */
  name?: string;
  className?: string;
}

const mix = (color: string, amount: number, into = "transparent") =>
  `color-mix(in oklab, ${color} ${amount}%, ${into})`;
const PF = "var(--primary-foreground)";
const CARD: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 95, "var(--foreground)")})`,
  boxShadow: `0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 85)}`,
};
/* The one lit surface, engraved with fine scales like his skin: whatever he blends into, it's this. */
const SCALE = `radial-gradient(circle at 50% 0%, transparent 5.1px, ${mix(PF, 11)} 5.6px, transparent 6.3px)`;
const STAGE: React.CSSProperties = {
  backgroundColor: "var(--primary)",
  backgroundImage: [
    `radial-gradient(90% 70% at 50% 100%, ${mix(PF, 18)} 0%, transparent 62%)`,
    `radial-gradient(120% 90% at 0% 0%, ${mix(PF, 16)} 0%, transparent 55%)`,
    `linear-gradient(175deg, transparent 40%, ${mix("black", 22)} 100%)`,
    SCALE,
    SCALE,
  ].join(", "),
  backgroundSize: "auto, auto, auto, 12px 7px, 12px 7px",
  backgroundPosition: "0 0, 0 0, 0 0, 0 0, 6px 3.5px",
  boxShadow: `inset 0 1px 0 ${mix(PF, 36)}, inset 0 0 0 1px ${mix(PF, 12)}`,
};
const LIT: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${mix(PF, 16)}, transparent 60%)`,
  boxShadow: `inset 0 1px 0 ${mix(PF, 32)}, inset 0 0 0 1px ${mix("black", 10)}`,
};
/* Hide's own colours; each can be overridden. */
const HIDE = {
  "--hide-pupil": "oklch(0.2 0.03 150)",
  "--hide-tongue": "oklch(0.74 0.14 6)",
  "--hide-tongue-line": "oklch(0.44 0.11 8)",
  "--hide-blush": "oklch(0.7 0.17 15)",
  "--hide-check": "var(--color-emerald-500, oklch(0.7 0.16 162))",
} as React.CSSProperties;

let measure: CanvasRenderingContext2D | null = null;
/** Where the caret is on screen, near enough for an eye to follow. */
function caretAt(input: HTMLInputElement): Point {
  const r = input.getBoundingClientRect();
  const cs = getComputedStyle(input);
  measure ??= document.createElement("canvas").getContext("2d");
  const upto = input.selectionStart ?? input.value.length;
  const text =
    input.type === "password" ? "•".repeat(upto) : input.value.slice(0, upto);
  let w = 0;
  if (measure) {
    measure.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    w = measure.measureText(text).width;
  }
  return {
    x:
      r.left +
      Math.min(r.width - 6, parseFloat(cs.paddingLeft) + w - input.scrollLeft),
    y: r.top + r.height / 2,
  };
}

export function CreatePassword({
  onSubmit,
  checkBreaches,
  rules = PASSWORD_RULES,
  username,
  onValueChange,
  title = "Create a password",
  description,
  submitLabel = "Continue",
  name = "Hide",
  className = "",
}: CreatePasswordProps) {
  const reduced = useInteractionReducedMotion();
  const baseId = React.useId();
  const [password, setPassword] = React.useState("");
  const [shown, setShown] = React.useState(false);
  const [placed, setPlaced] = React.useState<Record<string, boolean>>({});
  const [breach, setBreach] = React.useState<{
    password: string;
    count: number;
  } | null>(null);
  const [act, setAct] = React.useState<{
    status: ActionStatus;
    checking?: boolean;
    error?: string;
  }>({ status: "idle" });
  const [startled, setStartled] = React.useState(false);
  const [said, setSaid] = React.useState("");
  const overlayRef = React.useRef<SVGSVGElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hide = React.useRef<HideHandle>(null);
  const circles = React.useRef(new Map<string, HTMLElement>());
  // what the tongue has done and is about to do; the latest password for its callbacks
  const placedRef = React.useRef<Record<string, boolean>>({});
  const pending = React.useRef(new Set<string>());
  const latest = React.useRef("");
  const typedAt = React.useRef(0);
  const startleTimer = React.useRef(0);
  const checkRef = React.useRef(checkBreaches);

  React.useEffect(() => {
    checkRef.current = checkBreaches;
  });
  React.useEffect(() => () => window.clearTimeout(startleTimer.current), []);

  const met = rules.map((r) => r.test(password));
  const allMet = met.every(Boolean);
  const done = rules.filter((r) => placed[r.id]).length;
  const breached = Boolean(
    breach && breach.password === password && breach.count > 0,
  );
  const busy = act.status === "pending";

  // Once every rule is met, ask about breaches after a pause in the typing; a newer password aborts the older ask.
  React.useEffect(() => {
    if (!allMet || !checkRef.current) return;
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => {
      checkRef.current?.(password, ctrl.signal).then(
        (count) => !ctrl.signal.aborted && setBreach({ password, count }),
        () => {},
      );
    }, 450);
    return () => {
      window.clearTimeout(timer);
      ctrl.abort();
    };
  }, [allMet, password]);

  const place = (next: Record<string, boolean>) => {
    placedRef.current = next;
    setPlaced(next);
  };

  /** Send the tongue wherever a check is wrong, one rule at a time. */
  const reconcile = () => {
    const value = latest.current;
    if (reduced) {
      place(Object.fromEntries(rules.map((r) => [r.id, r.test(value)])));
      return;
    }
    for (const r of rules) {
      const want = r.test(value);
      const target = circles.current.get(r.id);
      if (
        pending.current.has(r.id) ||
        want === Boolean(placedRef.current[r.id]) ||
        !target
      )
        continue;
      pending.current.add(r.id);
      hide.current?.flick(target, want ? "give" : "take", () => {
        pending.current.delete(r.id);
        place({ ...placedRef.current, [r.id]: want });
        setSaid(`${r.label}: ${want ? "done" : "missing"}.`);
        // the password may have moved on while the tongue was out
        window.setTimeout(reconcile, 0);
      });
    }
  };

  const change = (next: string) => {
    const before = Object.values(placedRef.current).filter(Boolean).length;
    latest.current = next;
    setPassword(next);
    onValueChange?.(next);
    if (act.status === "error" || act.status === "success")
      setAct({ status: "idle" });
    if (!next) {
      // wiped: the checks fall away at once and, if he was well hidden, he jumps
      pending.current.clear();
      place({});
      if (before >= 2) {
        hide.current?.startle();
        setStartled(true);
        window.clearTimeout(startleTimer.current);
        startleTimer.current = window.setTimeout(
          () => setStartled(false),
          1800,
        );
      }
      return;
    }
    setStartled(false);
    reconcile();
  };

  const followCaret = () => {
    const input = inputRef.current;
    if (input) hide.current?.look(caretAt(input));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allMet || breached || busy) return;
    const value = password;
    try {
      const check = checkRef.current;
      if (check && !(breach && breach.password === value)) {
        setAct({ status: "pending", checking: true });
        let count = 0;
        try {
          count = await check(value, new AbortController().signal);
        } catch {
          // a breach service that's down shouldn't stop a sign-up
        }
        setBreach({ password: value, count });
        if (count > 0) {
          setAct({ status: "idle" });
          return;
        }
      }
      setAct({ status: "pending" });
      await onSubmit(value);
      setAct({ status: "success" });
      hide.current?.wink();
    } catch (err) {
      setAct({
        status: "error",
        error:
          err instanceof Error && err.message
            ? err.message
            : "Couldn’t save that. Try again.",
      });
    }
  };

  const mood =
    act.status === "success"
      ? `${name} is safe with you`
      : startled
        ? "Hey! I was hiding."
        : breached
          ? `${name} has been spotted`
          : shown && password
            ? `${name} feels exposed`
            : done === rules.length
              ? `Where did ${name} go?`
              : done > 0
                ? `${name} is blending in`
                : `${name} is easy to spot`;

  const error = breached
    ? `Seen in ${breach!.count.toLocaleString("en-US")} data breach${breach!.count === 1 ? "" : "es"}. Try another.`
    : act.status === "error"
      ? act.error
      : undefined;
  const ready = allMet && !breached;

  return (
    <section
      aria-labelledby={`${baseId}-title`}
      className={`relative w-full max-w-[380px] rounded-[28px] p-2 text-card-foreground ${className}`}
      style={{ ...CARD, ...HIDE }}
      onPointerMove={(e) => {
        // the pointer, unless he's watching the caret
        if (e.pointerType === "mouse" && e.timeStamp - typedAt.current > 1400)
          hide.current?.look({ x: e.clientX, y: e.clientY });
      }}
      onPointerLeave={() => hide.current?.look(null)}
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
          className="relative isolate overflow-clip rounded-[22px] text-primary-foreground"
          style={STAGE}
        >
          <p className="absolute left-3.5 top-3 z-10 text-[12.5px] font-medium text-primary-foreground/85">
            <TextMorph>{mood}</TextMorph>
          </p>
          <Hide
            ref={hide}
            camo={done / Math.max(1, rules.length)}
            alarm={breached}
            exposed={shown && password.length > 0}
            reduced={reduced}
            overlay={overlayRef}
          />
        </div>

        <form className="px-2 pb-1 pt-3" onSubmit={submit} noValidate>
          <h2
            id={`${baseId}-title`}
            className="px-1 text-[15px] font-medium tracking-[-0.01em]"
          >
            {title}
          </h2>
          <p className="mt-0.5 px-1 text-[12.5px] text-muted-foreground">
            {description ??
              `The stronger it is, the harder ${name} is to find.`}
          </p>

          {username !== undefined && (
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={username}
              readOnly
              hidden
            />
          )}
          <PasswordInput
            ref={inputRef}
            aria-label="Password"
            name="password"
            autoComplete="new-password"
            placeholder="Enter a password"
            className="mt-3"
            value={password}
            onValueChange={change}
            shown={shown}
            onShownChange={(on) => {
              setShown(on);
              setSaid(on ? "Password shown." : "Password hidden.");
            }}
            error={error}
            disabled={busy}
            onKeyDown={(e) => {
              typedAt.current = e.timeStamp;
            }}
            onKeyUp={followCaret}
            onSelect={followCaret}
            onFocus={followCaret}
            onClick={followCaret}
            onBlur={() => hide.current?.look(null)}
          />

          <ul
            aria-label="Your password needs"
            className="mt-2.5 grid grid-cols-1 gap-x-3 gap-y-1.5 px-1 @[270px]:grid-cols-2"
          >
            {rules.map((r) => {
              const on = Boolean(placed[r.id]);
              return (
                <li
                  key={r.id}
                  className="flex min-w-0 items-center gap-2 text-[12.5px]"
                >
                  <span
                    ref={(el) => {
                      if (el) circles.current.set(r.id, el);
                      else circles.current.delete(r.id);
                    }}
                    className="relative grid size-4 shrink-0 place-items-center rounded-full"
                    style={{
                      boxShadow: `inset 0 0 0 1px ${mix("var(--foreground)", 22, "var(--border)")}`,
                    }}
                  >
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "var(--hide-check)",
                        opacity: on ? 1 : 0,
                        transform: on ? "scale(1)" : "scale(0.4)",
                        transition: reduced
                          ? "none"
                          : `opacity 200ms ${EASE_OUT}, transform 420ms ${EASE_THROW}`,
                      }}
                    />
                    <svg
                      viewBox="0 0 16 16"
                      className="relative size-3"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3.8 8.3 6.6 11 12.2 5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        pathLength={1}
                        strokeDasharray={1}
                        style={{
                          strokeDashoffset: on ? 0 : 1,
                          transition: reduced
                            ? "none"
                            : on
                              ? `stroke-dashoffset 320ms ${EASE_OUT} 60ms`
                              : "stroke-dashoffset 120ms",
                        }}
                      />
                    </svg>
                  </span>
                  <span
                    className={`truncate transition-colors duration-300 ${on ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {r.label}
                    <span className="sr-only">
                      {on ? ", done" : ", not yet"}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          <StatusButton
            type="submit"
            status={act.status}
            labels={{
              idle: submitLabel,
              pending: act.checking ? "Checking" : "Saving",
              success: "Password set",
              error: "Try again",
            }}
            disabled={!ready && !busy}
            className="mt-3 h-10 w-full text-[13.5px] disabled:bg-[color-mix(in_oklab,var(--foreground)_7%,transparent)] disabled:text-muted-foreground"
            style={ready && act.status !== "error" ? LIT : undefined}
          />
        </form>
      </div>

      {/* His tongue is drawn over the whole block, from his mouth to a rule and back. */}
      <svg
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 size-full overflow-visible"
      />

      <span className="sr-only" role="status">
        {said}
      </span>
    </section>
  );
}

export default CreatePassword;
