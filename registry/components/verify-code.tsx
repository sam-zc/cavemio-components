"use client";

import * as React from "react";
import { CodeInput } from "./code-input";
import { Coo, type CooHandle } from "./coo-pigeon";
import { NumberRoll } from "./number-roll";
import { StatusButton, type ActionStatus } from "./status-button";
import { TextMorph } from "./text-morph";
import {
  EASE_OUT,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";

/* ─────────────────────────────────────────────────────────
 * VERIFY CODE: the pigeon who carried it
 *
 *   waiting  Coo stands on his post across the stage from the
 *            mailbox; its flag is up, your code is in there
 *   reading  every digit you type, he nods along
 *   wrong    he shakes his head; the boxes shake and clear
 *   right    the boxes close into one pill, he puffs his chest
 *            and gives two proud flaps
 *   wait     while the resend clock runs he naps on his post,
 *            z's drifting up and a thought bubble counting the
 *            seconds down; typing wakes him to read along, and
 *            at zero the bubble pops and he hops up, ready
 *   resend   he takes off with a new envelope, flies the route,
 *            pops the mailbox flag and flies home; if the send
 *            fails he comes back with the envelope in his beak
 *
 * onVerify gets the code, onResend sends another; both are
 * yours, whatever sends your codes.
 * ───────────────────────────────────────────────────────── */

export interface VerifyCodeProps {
  /** Where the code went: an email address or a phone number. */
  destination: string;
  channel?: "email" | "sms";
  length?: number;
  /** Check the code. Resolve (or return true) to accept; return false or throw to say it's wrong. */
  onVerify: (code: string) => Promise<boolean | void>;
  /** Send a new code. Return { retryAfter } (seconds) to set the next wait; throw to say it didn't go. */
  onResend: () => Promise<{ retryAfter?: number } | void | unknown>;
  /** Seconds before the first resend. */
  resendAfter?: number;
  /** Shows Change beside the address. */
  onChangeDestination?: () => void;
  title?: string;
  /** What the pigeon is called in his lines. */
  name?: string;
  autoFocus?: boolean;
  className?: string;
}

const mix = (color: string, amount: number, into = "transparent") =>
  `color-mix(in oklab, ${color} ${amount}%, ${into})`;
const PF = "var(--primary-foreground)";
const CARD: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 95, "var(--foreground)")})`,
  boxShadow: `0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 85)}`,
};
/* The one lit surface, ruled with faint airmail stripes along its foot: the sky he flies through. */
const STAGE: React.CSSProperties = {
  backgroundColor: "var(--primary)",
  backgroundImage: [
    `radial-gradient(90% 70% at 50% 0%, ${mix(PF, 20)} 0%, transparent 62%)`,
    `linear-gradient(175deg, transparent 45%, ${mix("black", 20)} 100%)`,
    `repeating-linear-gradient(-45deg, ${mix(PF, 10)} 0 7px, transparent 7px 14px, ${mix(PF, 5)} 14px 21px, transparent 21px 28px)`,
  ].join(", "),
  backgroundSize: "auto, auto, 100% 7px",
  backgroundRepeat: "no-repeat, no-repeat, repeat-x",
  backgroundPosition: "0 0, 0 0, 0 100%",
  boxShadow: `inset 0 1px 0 ${mix(PF, 36)}, inset 0 0 0 1px ${mix(PF, 12)}`,
};
const COO = {
  "--coo-route": PF,
  "--coo-z": PF,
  "--coo-bubble": PF,
  "--coo-bubble-ink": "var(--primary)",
} as React.CSSProperties;

type Flight = "home" | "away" | "failed";

export function VerifyCode({
  destination,
  channel = "email",
  length = 6,
  onVerify,
  onResend,
  resendAfter = 30,
  onChangeDestination,
  title,
  name = "Coo",
  autoFocus,
  className = "",
}: VerifyCodeProps) {
  const reduced = useInteractionReducedMotion();
  const baseId = React.useId();
  const coo = React.useRef<CooHandle>(null);
  const [phase, setPhase] = React.useState<
    "idle" | "checking" | "wrong" | "right"
  >("idle");
  const [left, setLeft] = React.useState(resendAfter);
  const [send, setSend] = React.useState<ActionStatus>("idle");
  const [flight, setFlight] = React.useState<Flight>("home");
  const typed = React.useRef(0);
  // typing wakes him for a while; then he nods off again if the clock is still running
  const [awake, setAwake] = React.useState(false);
  const awakeTimer = React.useRef(0);
  React.useEffect(() => () => window.clearTimeout(awakeTimer.current), []);

  // whole seconds down to zero; the route drains with them
  React.useEffect(() => {
    if (left <= 0 || flight === "away") return;
    const timer = window.setTimeout(
      () => setLeft((s) => Math.max(0, s - 1)),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [left, flight]);

  const resend = async () => {
    if (send === "pending" || left > 0 || flight === "away") return;
    setSend("pending");
    setFlight("away");
    coo.current?.send();
    let next = resendAfter;
    let ok = true;
    try {
      const res = await onResend();
      const after = (res as { retryAfter?: number } | undefined)?.retryAfter;
      if (typeof after === "number" && after >= 0) next = after;
    } catch {
      ok = false;
    }
    const home = () => {
      setFlight(ok ? "home" : "failed");
      setSend(ok ? "success" : "error");
      if (ok) {
        setLeft(next);
      }
      window.setTimeout(
        () => setSend((s) => (s === "success" ? "idle" : s)),
        1400,
      );
    };
    if (coo.current) coo.current.delivered(ok, home);
    else home();
  };

  const verify = async (code: string) => {
    setPhase("checking");
    let ok = false;
    try {
      ok = (await onVerify(code)) !== false;
    } catch {
      ok = false;
    }
    setPhase(ok ? "right" : "wrong");
    if (ok) coo.current?.puff();
    else coo.current?.ruffle();
    return ok;
  };

  const where = channel === "sms" ? "number" : "inbox";
  const mood =
    phase === "right"
      ? "Signed for. You’re in."
      : phase === "wrong"
        ? `Not the code ${name} carried`
        : phase === "checking"
          ? `${name} is checking`
          : flight === "away"
            ? `${name} is on his way`
            : flight === "failed"
              ? `${name} couldn’t get through`
              : send === "success"
                ? "A fresh code, delivered"
                : left > 0
                  ? awake
                    ? `${name} is reading along`
                    : `${name} is catching his breath`
                  : `${name} is ready to fly again`;
  const ready = left <= 0 && flight !== "away";

  return (
    <section
      aria-labelledby={`${baseId}-title`}
      className={`relative w-full max-w-[380px] rounded-[28px] p-2 text-card-foreground ${className}`}
      style={{ ...CARD, ...COO }}
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
          <Coo
            ref={coo}
            wait={flight === "away" || phase === "right" ? 0 : left}
            dozing={
              !awake &&
              flight === "home" &&
              (phase === "idle" || phase === "wrong")
            }
            reduced={reduced}
          />
          <p className="absolute inset-x-0 bottom-3 z-10 text-center text-[12.5px] font-medium text-primary-foreground/85 @max-[340px]:bottom-2 @max-[340px]:text-[11.5px]">
            <TextMorph>{mood}</TextMorph>
          </p>
        </div>

        <div className="px-3 pb-2 pt-3">
          <h2
            id={`${baseId}-title`}
            className="text-[15px] font-medium tracking-[-0.01em]"
          >
            {title ?? `Check your ${where}`}
          </h2>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">
            {name} brought a {length}-digit code to{" "}
            <span className="font-medium text-foreground">{destination}</span>
            {onChangeDestination ? (
              <>
                {" · "}
                <button
                  type="button"
                  onClick={onChangeDestination}
                  className="cursor-pointer underline decoration-border underline-offset-2 hover:text-foreground"
                >
                  Change
                </button>
              </>
            ) : (
              "."
            )}
          </p>

          <CodeInput
            className="mt-3"
            length={length}
            label="Enter the code"
            autoFocus={autoFocus}
            onValueChange={(v) => {
              setAwake(true);
              window.clearTimeout(awakeTimer.current);
              awakeTimer.current = window.setTimeout(
                () => setAwake(false),
                4000,
              );
              if (v.length > typed.current) coo.current?.peck();
              typed.current = v.length;
              if (phase === "wrong") setPhase("idle");
            }}
            onComplete={verify}
          />

          {/* the resend line folds away once the code is right */}
          <div
            className="grid"
            style={{
              gridTemplateRows: phase === "right" ? "0fr" : "1fr",
              opacity: phase === "right" ? 0 : 1,
              transition: reduced
                ? "none"
                : `grid-template-rows 420ms ${EASE_OUT}, opacity 240ms`,
            }}
          >
            <div className="min-w-0 overflow-hidden" inert={phase === "right"}>
              <div className="mt-2.5 flex h-7 items-center gap-1.5 text-[12px] text-muted-foreground">
                <span>
                  {flight === "failed"
                    ? "Couldn’t send that."
                    : "Didn’t get it?"}
                </span>
                <span className="grid items-center">
                  <span className="sr-only">
                    {ready
                      ? ""
                      : flight === "away"
                        ? "Sending a new code."
                        : "You can resend the code shortly."}
                  </span>
                  <span
                    aria-hidden="true"
                    className="col-start-1 row-start-1 flex items-baseline whitespace-nowrap tabular-nums"
                    style={{
                      opacity: ready ? 0 : 1,
                      filter: ready ? "blur(3px)" : "none",
                      transition: reduced
                        ? "none"
                        : `opacity 260ms ${EASE_OUT}, filter 260ms ${EASE_OUT}`,
                    }}
                  >
                    {flight === "away" ? (
                      <TextMorph>Sending</TextMorph>
                    ) : (
                      <>
                        Resend in {Math.floor(left / 60)}:
                        <NumberRoll
                          value={left % 60}
                          format={{ minimumIntegerDigits: 2 }}
                          direction="down"
                          duration={700}
                        />
                      </>
                    )}
                  </span>
                  <span
                    className="col-start-1 row-start-1"
                    inert={!ready}
                    style={{
                      opacity: ready ? 1 : 0,
                      filter: ready ? "none" : "blur(3px)",
                      transition: reduced
                        ? "none"
                        : `opacity 260ms ${EASE_OUT}, filter 260ms ${EASE_OUT}`,
                    }}
                  >
                    <StatusButton
                      variant="ghost"
                      size="sm"
                      status={send === "pending" ? "idle" : send}
                      labels={{
                        idle: "Resend code",
                        success: "Sent",
                        error: "Try again",
                      }}
                      onClick={resend}
                      className="-ml-2"
                    />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VerifyCode;
