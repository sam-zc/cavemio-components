"use client";

import * as React from "react";
import { CopyButton } from "./copy-button";
import { Input } from "./input";
import { NumberRoll } from "./number-roll";
import { QUEUE_ART as ART, QUEUE_SIZE as SIZE } from "./queue-art";
import { StatusButton, type ActionStatus } from "./status-button";
import { TextMorph } from "./text-morph";
import {
  EASE_OUT,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";

/* ─────────────────────────────────────────────────────────
 * WAITLIST: your place in an actual line
 *
 *   line     a green door on the left of the lit stage and a
 *            line of illustrated people waiting for it; the
 *            spot at the end is a dashed outline that says You?
 *   join     an email and Join: you step into the line, lit,
 *            with your number over your head
 *   skip     every friend who joins through your link: you hop
 *            over the person ahead, they take your place and
 *            wander off, the line closes up and your number
 *            rolls down
 *   in       admitted: the door swings open and you walk in
 *
 * onJoin gets the email and returns your place; position (and
 * admitted) can come from your server afterwards, and every
 * drop in position plays a hop.
 * ───────────────────────────────────────────────────────── */

export interface WaitlistProps {
  /** Add the email; return their place in line and their invite link. Throw to say why not. */
  onJoin: (email: string) => Promise<{ position: number; link?: string }>;
  /** Their place after joining, from your server; each drop plays a hop. */
  position?: number;
  /** Friends who have joined through their link. */
  referrals?: number;
  /** Places each friend moves them up, for the line under the title. */
  perFriend?: number;
  /** Let in: the door opens and they walk through. */
  admitted?: boolean;
  /** What they're waiting for, in the copy. */
  product?: string;
  className?: string;
}

const mix = (color: string, amount: number, into = "transparent") =>
  `color-mix(in oklab, ${color} ${amount}%, ${into})`;
const PF = "var(--primary-foreground)";
const CARD: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 95, "var(--foreground)")})`,
  boxShadow: `0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 85)}`,
};
/* The one lit surface, with a pavement of thin line slabs under the line. */
const STAGE: React.CSSProperties = {
  backgroundColor: "var(--primary)",
  backgroundImage: [
    `radial-gradient(50% 80% at 12% 70%, ${mix("oklch(0.85 0.12 80)", 26)} 0%, transparent 70%)`,
    `linear-gradient(175deg, transparent 40%, ${mix("black", 20)} 100%)`,
    `linear-gradient(90deg, ${mix(PF, 12)} 1px, transparent 1px)`,
  ].join(", "),
  backgroundSize: "auto, auto, 34px 18px",
  backgroundRepeat: "no-repeat, no-repeat, repeat-x",
  backgroundPosition: "0 0, 0 0, 0 100%",
  boxShadow: `inset 0 1px 0 ${mix(PF, 36)}, inset 0 0 0 1px ${mix(PF, 12)}`,
};
const LIT: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${mix(PF, 16)}, transparent 60%)`,
  boxShadow: `inset 0 1px 0 ${mix(PF, 32)}, inset 0 0 0 1px ${mix("black", 10)}`,
};

const W = 364;
const H = 176;
const GROUND = 164;
const PERSON_H = 90;
const DOOR_H = 124;
const SLOT0 = 122;
const GAP = 40;
const YOU_SLOT = 5;
const PEOPLE = ["p1", "p2", "p4", "p5", "p6"] as const;
type Who = (typeof PEOPLE)[number] | "p3";
const YOU: Who = "p3";
const slotX = (slot: number) => SLOT0 + slot * GAP;
const widthOf = (who: Who) => (SIZE[who].w / SIZE[who].h) * PERSON_H;

type Person = { id: number; who: Who; slot: number; leaving?: boolean };
const startLine = (): Person[] =>
  [0, 1, 2, 3, 4].map((i) => ({
    id: i,
    who: PEOPLE[i % PEOPLE.length],
    slot: i,
  }));

export function Waitlist({
  onJoin,
  position: positionProp,
  referrals = 0,
  perFriend = 50,
  admitted = false,
  product = "early access",
  className = "",
}: WaitlistProps) {
  const reduced = useInteractionReducedMotion();
  const baseId = React.useId();
  const [email, setEmail] = React.useState("");
  const [join, setJoin] = React.useState<{
    status: ActionStatus;
    error?: string;
  }>({ status: "idle" });
  const [mine, setMine] = React.useState<{
    position: number;
    link?: string;
  } | null>(null);
  const [line, setLine] = React.useState<Person[]>(startLine);
  const [youSlot, setYouSlot] = React.useState(YOU_SLOT);
  const [skipped, setSkipped] = React.useState(0);
  const nextId = React.useRef(5);
  const youRef = React.useRef<HTMLDivElement>(null);
  const timers = React.useRef<number[]>([]);
  React.useEffect(
    () => () => timers.current.forEach((t) => window.clearTimeout(t)),
    [],
  );

  const joined = mine !== null;
  const position = positionProp ?? mine?.position ?? 0;

  // a drop in position plays one hop per place-jump (up to three, however far it went)
  const [seen, setSeen] = React.useState(position);
  const [hops, setHops] = React.useState(0);
  if (seen !== position) {
    if (joined && seen > 0 && position < seen && !reduced)
      setHops((h) =>
        Math.min(
          3,
          h +
            Math.max(
              1,
              Math.min(
                3,
                Math.round((seen - position) / Math.max(1, perFriend)),
              ),
            ),
        ),
      );
    setSeen(position);
  }

  // one hop: you jump over the person ahead and swap places; they wander off; the line closes up behind a newcomer at the door
  React.useEffect(() => {
    if (hops <= 0) return;
    const ahead = line.find((p) => !p.leaving && p.slot === YOU_SLOT - 1);
    if (!ahead) return;
    youRef.current?.animate(
      [
        { transform: "translateY(0)" },
        { transform: "translateY(-34px)", offset: 0.45 },
        { transform: "translateY(0)" },
      ],
      { duration: 520, easing: "cubic-bezier(0.33, 0, 0.3, 1)" },
    );
    const t1 = window.setTimeout(() => {
      setYouSlot(YOU_SLOT - 1);
      setLine((l) =>
        l.map((p) => (p.id === ahead.id ? { ...p, slot: YOU_SLOT } : p)),
      );
      setSkipped((s) => s + 1);
    }, 0);
    const t2 = window.setTimeout(() => {
      const id = nextId.current++;
      setLine((l) => [
        // a newcomer at the door who doesn't look like the person they'll stand behind
        {
          id,
          who: PEOPLE.filter(
            (w) => w !== l.find((p) => p.slot === 0 && !p.leaving)?.who,
          )[id % (PEOPLE.length - 1)],
          slot: 0,
        },
        ...l
          .filter((p) => !p.leaving)
          .map((p) =>
            p.id === ahead.id
              ? { ...p, slot: YOU_SLOT + 2, leaving: true }
              : { ...p, slot: p.slot + 1 },
          ),
      ]);
      setYouSlot(YOU_SLOT);
    }, 620);
    const t3 = window.setTimeout(() => {
      setLine((l) => l.filter((p) => !p.leaving));
      setHops((h) => h - 1);
    }, 1250);
    timers.current.push(t1, t2, t3);
    // the line state is read once per hop
  }, [hops]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (join.status === "pending") return;
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setJoin({ status: "error", error: "That doesn’t look like an email." });
      return;
    }
    setJoin({ status: "pending" });
    try {
      const res = await onJoin(email.trim());
      setJoin({ status: "success" });
      setMine(res);
      setSeen(positionProp ?? res.position);
    } catch (err) {
      setJoin({
        status: "error",
        error:
          err instanceof Error && err.message
            ? err.message
            : "Couldn’t add you. Try again.",
      });
    }
  };

  const mood = admitted
    ? "You’re in"
    : hops > 0
      ? "Excuse me, coming through"
      : skipped > 0
        ? `Skipped ${skipped} ahead`
        : joined
          ? "You’re in line"
          : "Join the line";
  const ease = `cubic-bezier(0.22, 1, 0.36, 1)`;
  const move = reduced
    ? "none"
    : `transform 560ms ${ease}, opacity 380ms ${EASE_OUT}`;

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
            {/* the door they're all waiting for */}
            {(["door", "doorOpen"] as const).map((d) => (
              <img
                key={d}
                src={ART[d]}
                alt=""
                draggable={false}
                className="pointer-events-none absolute max-w-none select-none"
                style={{
                  left: 10,
                  top: GROUND + 6 - DOOR_H,
                  height: DOOR_H,
                  width: (SIZE[d].w / SIZE[d].h) * DOOR_H,
                  opacity: (d === "doorOpen") === admitted ? 1 : 0,
                  transition: reduced ? "none" : "opacity 420ms ease-out",
                }}
              />
            ))}
            {line.map((p) => (
              <Figure
                key={p.id}
                who={p.who}
                x={slotX(p.slot)}
                style={{ opacity: p.leaving ? 0 : 1, transition: move }}
              />
            ))}
            {/* you: a dashed outline until you join, then lit, with your number */}
            <div
              className="absolute left-0 top-0"
              style={{
                transform: `translateX(${admitted ? 40 : slotX(youSlot)}px)`,
                opacity: admitted ? 0 : 1,
                transition: reduced
                  ? "none"
                  : `transform ${admitted ? 1400 : 520}ms ${ease}, opacity 600ms ease-in ${admitted ? 900 : 0}ms`,
              }}
            >
              <div
                className="absolute rounded-t-full border-[1.5px] border-dashed"
                style={{
                  left: -16,
                  top: GROUND - 64,
                  width: 32,
                  height: 64,
                  borderColor: mix(PF, 55),
                  opacity: joined ? 0 : 1,
                  transition: move,
                }}
              />
              <div
                ref={youRef}
                style={{
                  opacity: joined ? 1 : 0,
                  transform: joined ? "none" : "translateY(10px)",
                  transition: move,
                }}
              >
                <Figure who={YOU} x={0} lit />
              </div>
              <span
                className="absolute flex h-6 items-center whitespace-nowrap rounded-full px-2 text-[12px] font-semibold tabular-nums"
                style={{
                  left: 0,
                  top: GROUND - PERSON_H - 32,
                  transform: "translateX(-50%)",
                  background: PF,
                  color: "var(--primary)",
                }}
              >
                {joined ? (
                  <>
                    #<NumberRoll value={position} direction="down" />
                  </>
                ) : (
                  "You?"
                )}
              </span>
            </div>
          </Scene>
          <p className="absolute left-3.5 top-3 z-10 text-[12.5px] font-medium text-primary-foreground/85">
            <TextMorph>{mood}</TextMorph>
          </p>
        </div>

        {/* before joining: the form; after: your place and your link, in one surface */}
        <div className="grid">
          <div
            className="col-start-1 row-start-1 grid"
            style={{
              gridTemplateRows: joined ? "0fr" : "1fr",
              opacity: joined ? 0 : 1,
              pointerEvents: joined ? "none" : undefined,
              transition: reduced
                ? "none"
                : `grid-template-rows 460ms ${EASE_OUT}, opacity 220ms`,
            }}
          >
            <div className="min-w-0 overflow-clip" inert={joined}>
              <form className="px-3 pb-2 pt-3" onSubmit={submit} noValidate>
                <h2
                  id={`${baseId}-title`}
                  className="text-[15px] font-medium tracking-[-0.01em]"
                >
                  Join the waitlist
                </h2>
                <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                  Get in line for {product}. Friends you invite move you up.
                </p>
                <div className="mt-3 flex flex-col gap-2 @[300px]:flex-row">
                  <Input
                    className="@[300px]:flex-1"
                    type="email"
                    aria-label="Email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    value={email}
                    onValueChange={(v) => {
                      setEmail(v);
                      if (join.status === "error") setJoin({ status: "idle" });
                    }}
                    error={join.status === "error" ? join.error : undefined}
                  />
                  <StatusButton
                    type="submit"
                    status={join.status}
                    labels={{
                      idle: "Join",
                      pending: "Joining",
                      success: "Joined",
                      error: "Join",
                    }}
                    className="h-9 shrink-0 px-5 text-[13.5px]"
                    style={LIT}
                  />
                </div>
              </form>
            </div>
          </div>
          <div
            className="col-start-1 row-start-1 grid"
            style={{
              gridTemplateRows: joined ? "1fr" : "0fr",
              opacity: joined ? 1 : 0,
              pointerEvents: joined ? undefined : "none",
              transition: reduced
                ? "none"
                : `grid-template-rows 460ms ${EASE_OUT}, opacity 260ms 120ms`,
            }}
          >
            <div className="min-w-0 overflow-clip" inert={!joined}>
              <div className="px-3 pb-2 pt-3">
                <p className="text-[15px] font-medium tracking-[-0.01em]">
                  {admitted ? "You’re in" : "You’re on the list"}
                </p>
                <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                  {admitted ? (
                    `Welcome to ${product}. Check your inbox for the way in.`
                  ) : (
                    <>
                      Each friend who joins moves you up {perFriend} places.{" "}
                      <span className="whitespace-nowrap tabular-nums text-foreground">
                        <NumberRoll value={referrals} />{" "}
                        {referrals === 1 ? "friend" : "friends"} so far.
                      </span>
                    </>
                  )}
                </p>
                {mine?.link && !admitted && (
                  <div className="mt-3 flex h-9 items-center gap-2 rounded-full border border-border bg-background pl-3.5 pr-1">
                    <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-muted-foreground">
                      {mine.link}
                    </span>
                    <CopyButton
                      text={mine.link}
                      label="Copy link"
                      showLabel
                      size="sm"
                      variant="secondary"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only" role="status">
        {joined
          ? admitted
            ? "You’re in."
            : `You’re number ${position.toLocaleString("en-US")} in line.`
          : ""}
      </span>
    </section>
  );
}

/** The street, drawn at 364 × 176 and scaled to the stage. */
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

/** One person, standing on the ground with their feet at x. */
function Figure({
  who,
  x,
  lit,
  style,
}: {
  who: Who;
  x: number;
  lit?: boolean;
  style?: React.CSSProperties;
}) {
  const w = widthOf(who);
  return (
    <div
      className="absolute left-0 top-0"
      style={{ transform: `translateX(${x}px)`, ...style }}
    >
      {lit && (
        <span
          className="absolute"
          style={{
            left: -34,
            top: GROUND - 10,
            width: 68,
            height: 18,
            background: `radial-gradient(closest-side, ${mix(PF, 45)}, transparent)`,
          }}
        />
      )}

      <img
        src={ART[who]}
        alt=""
        draggable={false}
        className="pointer-events-none absolute max-w-none select-none"
        style={{
          left: -w / 2,
          top: GROUND - PERSON_H,
          width: w,
          height: PERSON_H,
        }}
      />
    </div>
  );
}

export default Waitlist;
