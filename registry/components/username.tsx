"use client";

import * as React from "react";
import { HANDLE_ART as ART, HANDLE_GEO as GEO } from "./handle-art";
import { Input } from "./input";
import { StatusButton, type ActionStatus } from "./status-button";
import { TextMorph } from "./text-morph";
import {
  EASE_OUT,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";

/* ─────────────────────────────────────────────────────────
 * USERNAME: a penguin holds up the name you want
 *
 *   write    as you type, the name appears on Handle's sign,
 *            letter by letter
 *   free     check() says it's available: he beams, a green tick
 *            lands on the corner of his sign
 *   taken    it isn't: his sign goes blank and his face falls,
 *            and its owner, a smug penguin in a scarf, slides in
 *            hugging a sign with your name on it ("@ana is mine")
 *   try      suggestions come back as chips; one tap writes it
 *   claim    Claim @name → Claiming → Claimed
 *
 * check(name, signal) and onClaim(name) are yours; the field
 * lowercases as you type and keeps to the characters you allow.
 * ───────────────────────────────────────────────────────── */

export interface UsernameProps {
  /** Is the name free? Aborted when a newer name starts. Suggestions show when it isn't. */
  check: (
    name: string,
    signal: AbortSignal,
  ) => Promise<{ available: boolean; suggestions?: string[] }>;
  /** Keep the name; throw to say why not. */
  onClaim: (name: string) => Promise<unknown>;
  defaultValue?: string;
  minLength?: number;
  maxLength?: number;
  /** Characters allowed (the whole name is tested). */
  pattern?: RegExp;
  /** Says what's allowed when the pattern fails. */
  patternHint?: string;
  /** "@", or your domain ("relay.app/"). */
  prefix?: string;
  title?: string;
  /** What the penguin is called in his lines. */
  name?: string;
  className?: string;
}

type Phase =
  "empty" | "short" | "invalid" | "checking" | "free" | "taken" | "error";

const mix = (color: string, amount: number, into = "transparent") =>
  `color-mix(in oklab, ${color} ${amount}%, ${into})`;
const PF = "var(--primary-foreground)";
const CARD: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 95, "var(--foreground)")})`,
  boxShadow: `0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 85)}`,
};
/* The one lit surface: an ice floe's soft glow under the penguins, and faint snow. */
const STAGE: React.CSSProperties = {
  backgroundColor: "var(--primary)",
  backgroundImage: [
    `radial-gradient(60% 40% at 50% 100%, ${mix(PF, 26)} 0%, transparent 70%)`,
    `linear-gradient(175deg, transparent 40%, ${mix("black", 20)} 100%)`,
    `radial-gradient(circle, ${mix(PF, 28)} 0 1px, transparent 1.5px)`,
    `radial-gradient(circle, ${mix(PF, 18)} 0 1px, transparent 1.5px)`,
  ].join(", "),
  backgroundSize: "auto, auto, 46px 38px, 31px 27px",
  backgroundPosition: "0 0, 0 0, 0 0, 14px 9px",
  boxShadow: `inset 0 1px 0 ${mix(PF, 36)}, inset 0 0 0 1px ${mix(PF, 12)}`,
};
const LIT: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${mix(PF, 16)}, transparent 60%)`,
  boxShadow: `inset 0 1px 0 ${mix(PF, 32)}, inset 0 0 0 1px ${mix("black", 10)}`,
};
const INK = "oklch(0.25 0.02 260)";

/* the scene, drawn at 364 × 176 and scaled to the stage */
const W = 364;
const H = 176;
const GROUND = 172;
const OURS = { x: 118, h: 124 };
const OWNER = { x: 272, out: W + 80, h: 124 };
type Pose = "hope" | "joy" | "sad" | "owner";

/** A penguin, standing with its feet at (x, GROUND), with `text` written on its sign. */
function Penguin({
  pose,
  x,
  h,
  text,
  tick,
  style,
}: {
  pose: Pose;
  x: number;
  h: number;
  text: string;
  tick?: boolean;
  style?: React.CSSProperties;
}) {
  const g = GEO[pose];
  const k = h / g.h;
  const w = g.w * k;
  const b = g.board;
  const len = Math.max(1, text.length);
  const font = Math.min(17, ((b.w * k * 0.82) / len) * 1.6);
  return (
    <div
      className="absolute left-0 top-0"
      style={{
        transform: `translate(${x - w / 2}px, ${GROUND - h}px)`,
        width: w,
        height: h,
        ...style,
      }}
    >
      <img
        src={ART[pose]}
        alt=""
        draggable={false}
        className="pointer-events-none absolute inset-0 size-full max-w-none select-none"
      />
      <div
        className="absolute flex items-center justify-center whitespace-nowrap font-semibold tracking-[-0.02em]"
        style={{
          left: (b.x - b.w / 2) * k,
          top: (b.y - b.h / 2) * k,
          width: b.w * k,
          height: b.h * k,
          transform: `rotate(${b.angle}deg)`,
          color: INK,
          fontSize: font,
        }}
      >
        <TextMorph>{text || " "}</TextMorph>
        <span
          className="absolute -right-1.5 -top-1.5 grid size-[18px] place-items-center rounded-full text-white"
          style={{
            background: "var(--color-emerald-500, oklch(0.7 0.16 162))",
            opacity: tick ? 1 : 0,
            transform: tick
              ? "scale(1) rotate(0deg)"
              : "scale(0.3) rotate(-30deg)",
            transition:
              "opacity 200ms, transform 420ms cubic-bezier(0.34,1.36,0.64,1)",
          }}
        >
          <svg viewBox="0 0 16 16" className="size-3" fill="none">
            <path
              d="M3.8 8.3 6.6 11 12.2 5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}

export function Username({
  check,
  onClaim,
  defaultValue = "",
  minLength = 3,
  maxLength = 20,
  pattern = /^[a-z0-9_]+$/,
  patternHint = "Letters, numbers and _ only.",
  prefix = "@",
  title = "Pick a username",
  name = "Handle",
  className = "",
}: UsernameProps) {
  const reduced = useInteractionReducedMotion();
  const baseId = React.useId();
  const [value, setValue] = React.useState(defaultValue.toLowerCase());
  const [result, setResult] = React.useState<{
    name: string;
    available: boolean;
    suggestions: string[];
  } | null>(null);
  const [failed, setFailed] = React.useState<string | null>(null);
  const [claim, setClaim] = React.useState<{
    status: ActionStatus;
    error?: string;
  }>({ status: "idle" });
  const checkRef = React.useRef(check);
  React.useEffect(() => {
    checkRef.current = check;
  });

  const valid = value.length >= minLength && pattern.test(value);
  React.useEffect(() => {
    if (!valid) return;
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => {
      checkRef.current(value, ctrl.signal).then(
        (r) =>
          !ctrl.signal.aborted &&
          setResult({
            name: value,
            available: r.available,
            suggestions: r.suggestions ?? [],
          }),
        () => !ctrl.signal.aborted && setFailed(value),
      );
    }, 380);
    return () => {
      window.clearTimeout(timer);
      ctrl.abort();
    };
  }, [value, valid]);

  const known = result && result.name === value ? result : null;
  const phase: Phase = !value
    ? "empty"
    : !pattern.test(value)
      ? "invalid"
      : value.length < minLength
        ? "short"
        : failed === value
          ? "error"
          : !known
            ? "checking"
            : known.available
              ? "free"
              : "taken";
  const claimed = claim.status === "success";
  const pose: Pose =
    claimed || phase === "free"
      ? "joy"
      : phase === "taken" || phase === "invalid"
        ? "sad"
        : "hope";
  const handle = `${prefix}${value}`;
  const mood = claimed
    ? `Hello, ${handle}`
    : phase === "free"
      ? `${handle} is all yours`
      : phase === "taken"
        ? `“${handle} is mine.”`
        : phase === "checking"
          ? `${name} is asking around`
          : phase === "invalid"
            ? `${name} can’t write that`
            : phase === "short"
              ? "A little longer"
              : phase === "error"
                ? `${name} couldn’t check`
                : `${name} will hold it up`;

  const set = (next: string) => {
    setValue(next.toLowerCase().slice(0, maxLength));
    if (claim.status !== "idle" && claim.status !== "pending")
      setClaim({ status: "idle" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase !== "free" || claim.status === "pending" || claimed) return;
    setClaim({ status: "pending" });
    try {
      await onClaim(value);
      setClaim({ status: "success" });
    } catch (err) {
      setClaim({
        status: "error",
        error:
          err instanceof Error && err.message
            ? err.message
            : "Couldn’t claim that. Try again.",
      });
    }
  };

  const fade = reduced
    ? "none"
    : `transform 520ms cubic-bezier(0.22,1,0.36,1), opacity 300ms ${EASE_OUT}`;
  const ownerIn = phase === "taken";
  const error =
    phase === "invalid"
      ? patternHint
      : phase === "error"
        ? "Couldn’t check that name. Try again."
        : claim.status === "error"
          ? claim.error
          : undefined;

  return (
    <section
      aria-labelledby={`${baseId}-title`}
      className={`relative w-full max-w-[380px] rounded-[28px] p-2 text-card-foreground ${className}`}
      style={CARD}
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
          className="relative overflow-clip rounded-[22px] text-primary-foreground"
          style={STAGE}
        >
          <Scene>
            {(["hope", "joy", "sad"] as const).map((p) => (
              <Penguin
                key={p}
                pose={p}
                x={OURS.x}
                h={OURS.h}
                text={phase === "taken" ? "" : value ? handle : prefix}
                tick={p === "joy" && (phase === "free" || claimed)}
                style={{
                  opacity: p === pose ? 1 : 0,
                  transition: reduced ? "none" : `opacity 220ms ${EASE_OUT}`,
                }}
              />
            ))}
            {/* the one who already has it */}
            <Penguin
              pose="owner"
              x={ownerIn ? OWNER.x : OWNER.out}
              h={OWNER.h}
              text={known && !known.available ? `${prefix}${known.name}` : ""}
              style={{ opacity: ownerIn ? 1 : 0, transition: fade }}
            />
          </Scene>
          <p className="absolute left-3.5 top-3 z-10 max-w-[70%] text-[12.5px] font-medium text-primary-foreground/85">
            <TextMorph>{mood}</TextMorph>
          </p>
        </div>

        <form className="px-3 pb-1 pt-3" onSubmit={submit} noValidate>
          <h2
            id={`${baseId}-title`}
            className="text-[15px] font-medium tracking-[-0.01em]"
          >
            {title}
          </h2>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">
            {minLength} to {maxLength} characters. You can change it later.
          </p>
          <Input
            className="mt-3"
            aria-label="Username"
            leading={<span className="text-[13.5px]">{prefix}</span>}
            placeholder="yourname"
            value={value}
            onValueChange={set}
            autoComplete="username"
            autoCapitalize="off"
            spellCheck={false}
            maxLength={maxLength}
            error={error}
            hint={
              phase === "taken"
                ? "Taken. Try one of these:"
                : phase === "free"
                  ? "Available."
                  : undefined
            }
          />
          {phase === "taken" && known && known.suggestions.length > 0 && (
            <div
              className="mt-2 flex flex-wrap gap-1.5"
              aria-label="Suggestions"
            >
              {known.suggestions.slice(0, 4).map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set(s)}
                  className="h-7 cursor-pointer rounded-full border border-border bg-background px-2.5 text-[12.5px] hover:bg-accent"
                  style={
                    reduced
                      ? undefined
                      : {
                          animation: `ui-fade-up 320ms ${EASE_OUT} ${i * 50}ms backwards`,
                        }
                  }
                >
                  {prefix}
                  {s}
                </button>
              ))}
            </div>
          )}
          <StatusButton
            type="submit"
            status={claim.status}
            labels={{
              idle: phase === "free" ? `Claim ${handle}` : "Claim",
              pending: "Claiming",
              success: "Claimed",
              error: "Try again",
            }}
            disabled={
              phase !== "free" && claim.status !== "pending" && !claimed
            }
            className="mt-3 h-10 w-full text-[13.5px] disabled:bg-[color-mix(in_oklab,var(--foreground)_7%,transparent)] disabled:text-muted-foreground"
            style={
              phase === "free" && claim.status !== "error" ? LIT : undefined
            }
          />
        </form>
      </div>
      <span className="sr-only" role="status">
        {phase === "free"
          ? `${handle} is available.`
          : phase === "taken"
            ? `${handle} is taken.`
            : claimed
              ? `${handle} is yours.`
              : ""}
      </span>
    </section>
  );
}

/** The stage's scene, drawn at 364 × 176 and scaled to fit. */
function Scene({ children }: { children: React.ReactNode }) {
  const host = React.useRef<HTMLDivElement>(null);
  const scene = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const h = host.current;
    const s = scene.current;
    if (!h || !s) return;
    const fit = () =>
      s.style.setProperty("transform", `scale(${h.clientWidth / W})`);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(h);
    return () => ro.disconnect();
  }, []);
  return (
    <div
      ref={host}
      aria-hidden="true"
      className="relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <div
        ref={scene}
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: W, height: H }}
      >
        {children}
      </div>
    </div>
  );
}

export default Username;
