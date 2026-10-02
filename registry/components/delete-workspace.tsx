"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { Boo, type BooMode } from "./boo-ghost";
import { HoldToConfirm, type HoldStatus } from "./hold-to-confirm";
import { Input } from "./input";
import { StatusButton, type ActionStatus } from "./status-button";
import { TextMorph } from "./text-morph";
import {
  EASE_OUT,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";

/* ─────────────────────────────────────────────────────────
 * DELETE WORKSPACE: its ghost climbs out as you type its name
 *
 *   safe     the workspace's tile sits on the lit stage
 *   type     each letter of its name you type brings Boo, its
 *            ghost, further up out of the tile while the tile
 *            loses its colour; a wrong letter and he shivers
 *            and sinks back to where the name still matches
 *   hold     with the name right, Delete arms; holding it, Boo
 *            waves and drifts up out of the stage over the hold,
 *            and drops back if you let go
 *   deleted  the tile is an empty dashed outline, and a moment
 *            later Boo peeks up over the edge; Restore (for
 *            graceDays) brings him diving back into his tile
 *
 * onDelete and onRestore are yours; nothing happens until the
 * whole name is typed and the hold completes.
 * ───────────────────────────────────────────────────────── */

export interface DeleteWorkspaceProps {
  /** The name to type, exactly. */
  name: string;
  /** Its logo; initials on `color` without one. */
  avatar?: string;
  color?: string;
  /** What's being deleted: workspace, project, account… */
  kind?: string;
  /** What goes with it, one short line each ("12 projects and their history"). */
  consequences?: string[];
  /** Delete it; throw to keep it and offer another hold. */
  onDelete: () => Promise<unknown>;
  /** Shows Restore after the delete. */
  onRestore?: () => Promise<unknown>;
  /** Days it can be restored in, for the line after the delete. */
  graceDays?: number;
  /** How long Delete has to be held, in ms. */
  holdMs?: number;
  className?: string;
}

const mix = (color: string, amount: number, into = "transparent") =>
  `color-mix(in oklab, ${color} ${amount}%, ${into})`;
const PF = "var(--primary-foreground)";
const CARD: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 95, "var(--foreground)")})`,
  boxShadow: `0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 85)}`,
};
/* The one lit surface, with a faint spotlight on the tile: it's the thing everyone's looking at. */
const STAGE: React.CSSProperties = {
  backgroundColor: "var(--primary)",
  backgroundImage: [
    `radial-gradient(34% 46% at 50% 66%, ${mix(PF, 22)} 0%, transparent 100%)`,
    `radial-gradient(120% 90% at 0% 0%, ${mix(PF, 14)} 0%, transparent 55%)`,
    `linear-gradient(175deg, transparent 40%, ${mix("black", 24)} 100%)`,
  ].join(", "),
  boxShadow: `inset 0 1px 0 ${mix(PF, 36)}, inset 0 0 0 1px ${mix(PF, 12)}`,
};
const DANGER: React.CSSProperties = {
  background: "var(--color-red-600, oklch(0.58 0.22 27))",
  borderColor: "transparent",
  color: "white",
};
/* not armed yet: a quiet grey, not a faded version of the main colour */
const UNARMED: React.CSSProperties = {
  background: mix("var(--foreground)", 7),
  borderColor: "transparent",
  color: "var(--muted-foreground)",
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

export function DeleteWorkspace({
  name,
  avatar,
  color = "var(--chart-1, var(--primary))",
  kind = "workspace",
  consequences,
  onDelete,
  onRestore,
  graceDays = 30,
  holdMs = 1500,
  className = "",
}: DeleteWorkspaceProps) {
  const reduced = useInteractionReducedMotion();
  const baseId = React.useId();
  const boo = React.useRef<{ shiver: () => void }>(null);
  const [typed, setTyped] = React.useState("");
  const [hold, setHold] = React.useState<HoldStatus>("idle");
  const [deleted, setDeleted] = React.useState(false);
  const [restore, setRestore] = React.useState<ActionStatus>("idle");
  const [back, setBack] = React.useState(false);
  // a new round after a restore starts the hold button afresh
  const [round, setRound] = React.useState(0);
  const timers = React.useRef<number[]>([]);
  React.useEffect(
    () => () => timers.current.forEach((t) => window.clearTimeout(t)),
    [],
  );
  const later = (fn: () => void, ms: number) =>
    timers.current.push(window.setTimeout(fn, reduced ? 0 : ms));

  // how much of the name is right so far: a wrong letter sends him back to where it still matches
  let matched = 0;
  while (
    matched < typed.length &&
    matched < name.length &&
    typed[matched] === name[matched]
  )
    matched++;
  const full = typed === name;
  const rise = name.length ? matched / name.length : 0;

  const mode: BooMode = back
    ? "back"
    : deleted || hold === "success"
      ? "gone"
      : hold === "holding" || hold === "pending"
        ? "hold"
        : "type";
  const mood = back
    ? `Welcome back, ${name}`
    : deleted
      ? `${name} is gone, mostly`
      : hold === "holding" || hold === "pending"
        ? `Goodbye, ${name}`
        : hold === "success"
          ? `${name} is gone`
          : hold === "error"
            ? `${name} is still here`
            : full
              ? `Last chance for ${name}`
              : matched > 0
                ? `${name} is fading`
                : `${name} is safe and sound`;

  const change = (next: string) => {
    let m = 0;
    while (m < next.length && m < name.length && next[m] === name[m]) m++;
    // a letter that doesn't belong: he shivers on his way back down
    if (next.length > typed.length && m < next.length) boo.current?.shiver();
    setTyped(next);
  };

  const doRestore = async () => {
    if (!onRestore || restore === "pending") return;
    setRestore("pending");
    try {
      await onRestore();
      setRestore("success");
      setBack(true);
      later(() => {
        setDeleted(false);
        setBack(false);
        setTyped("");
        setHold("idle");
        setRestore("idle");
        setRound((r) => r + 1);
      }, 1400);
    } catch {
      setRestore("error");
    }
  };

  const gone = deleted || back;
  const tile = (
    <div className="relative size-full">
      <div
        className="absolute inset-0 grid place-items-center overflow-clip rounded-[16px] text-[21px] font-semibold tracking-[-0.02em] text-white"
        style={{
          background: avatar ? undefined : color,
          boxShadow: `inset 0 1px 0 ${mix("white", 30)}, 0 0 0 1px ${mix("black", 12)}`,
          filter: `grayscale(${gone && !back ? 1 : rise * 0.95})`,
          opacity: deleted && !back ? 0 : 1 - rise * 0.35,
          transform: deleted && !back ? "scale(0.86)" : "none",
          transition: reduced
            ? "none"
            : `filter 380ms ${EASE_OUT}, opacity 380ms ${EASE_OUT}, transform 480ms ${EASE_OUT}`,
        }}
      >
        {avatar ? (
          <img src={avatar} alt="" className="size-full object-cover" />
        ) : (
          initials(name)
        )}
      </div>
      {/* where it was */}
      <div
        className="absolute inset-0 rounded-[16px] border-[1.5px] border-dashed"
        style={{
          borderColor: mix(PF, 55),
          opacity: deleted && !back ? 1 : 0,
          transition: reduced ? "none" : `opacity 380ms ${EASE_OUT} 120ms`,
        }}
      />
    </div>
  );

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
          <Boo
            ref={boo}
            rise={rise}
            mode={mode}
            holdMs={holdMs}
            reduced={reduced}
            tile={tile}
          />
          <p className="absolute inset-x-0 bottom-2.5 z-10 text-center text-[12.5px] font-medium text-primary-foreground/85">
            <TextMorph>{mood}</TextMorph>
          </p>
        </div>

        {/* the confirm form and the after-delete panel trade places in one surface */}
        <div className="grid">
          <div
            className="col-start-1 row-start-1 grid"
            style={{
              gridTemplateRows: deleted ? "0fr" : "1fr",
              opacity: deleted ? 0 : 1,
              pointerEvents: deleted ? "none" : undefined,
              transition: reduced
                ? "none"
                : `grid-template-rows 460ms ${EASE_OUT}, opacity 220ms`,
            }}
          >
            <div className="min-w-0 overflow-clip" inert={deleted}>
              <div className="px-3 pb-2 pt-3">
                <h2
                  id={`${baseId}-title`}
                  className="text-[15px] font-medium tracking-[-0.01em]"
                >
                  Delete {kind}
                </h2>
                <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                  This deletes{" "}
                  <span className="font-medium text-foreground">{name}</span>{" "}
                  and everything in it.
                </p>
                {consequences && consequences.length > 0 && (
                  <ul className="mt-2 grid gap-1 text-[12.5px] text-muted-foreground">
                    {consequences.map((c) => (
                      <li key={c} className="flex items-center gap-2">
                        <span className="size-1 shrink-0 rounded-full bg-red-500" />
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
                <Input
                  className="mt-3"
                  label={
                    <>
                      Type{" "}
                      <span className="font-medium text-foreground">
                        {name}
                      </span>{" "}
                      to confirm
                    </>
                  }
                  value={typed}
                  onValueChange={change}
                  autoComplete="off"
                  spellCheck={false}
                  autoCapitalize="off"
                  disabled={
                    hold === "holding" ||
                    hold === "pending" ||
                    hold === "success"
                  }
                />
                <HoldToConfirm
                  key={round}
                  className="mt-3 w-full"
                  style={full ? DANGER : UNARMED}
                  icon={<Trash2 />}
                  duration={holdMs}
                  resetAfter={0}
                  disabled={!full}
                  labels={{
                    idle: `Hold to delete`,
                    holding: "Keep holding",
                    pending: "Deleting",
                    success: "Deleted",
                    error: "Hold to try again",
                  }}
                  onStatusChange={(s) => {
                    setHold(s);
                    if (s === "success") later(() => setDeleted(true), 900);
                  }}
                  onConfirm={async () => {
                    await onDelete();
                  }}
                />
              </div>
            </div>
          </div>

          <div
            className="col-start-1 row-start-1 grid"
            style={{
              gridTemplateRows: deleted ? "1fr" : "0fr",
              opacity: deleted ? 1 : 0,
              pointerEvents: deleted ? undefined : "none",
              transition: reduced
                ? "none"
                : `grid-template-rows 460ms ${EASE_OUT}, opacity 260ms 120ms`,
            }}
          >
            <div className="min-w-0 overflow-clip" inert={!deleted}>
              <div className="flex items-center gap-3 px-3 pb-2 pt-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium tracking-[-0.01em]">
                    {name} was deleted
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                    {onRestore
                      ? `You can restore it for ${graceDays} days.`
                      : "It’s gone for good."}
                  </p>
                </div>
                {onRestore && (
                  <StatusButton
                    variant="outline"
                    status={restore}
                    labels={{
                      idle: "Restore",
                      pending: "Restoring",
                      success: "Restored",
                      error: "Try again",
                    }}
                    onClick={doRestore}
                    className="shrink-0"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only" role="status">
        {deleted
          ? `${name} was deleted.`
          : full
            ? `Name matches. Hold Delete to confirm.`
            : ""}
      </span>
    </section>
  );
}

export default DeleteWorkspace;
