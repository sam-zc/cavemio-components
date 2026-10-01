"use client";

import * as React from "react";
import { Crumb, type CrumbHandle, type Point } from "./cookie-crumb";
import { StatusButton, type ActionStatus } from "./status-button";
import { Switch } from "./switch";
import { TextMorph } from "./text-morph";
import { useInteractionReducedMotion } from "./imported-ui-interaction-motion";

/* ─────────────────────────────────────────────────────────
 * COOKIE CONSENT: every cookie you allow goes to Crumb
 *
 *   ask       Crumb, an animated bread bun, sits on the lit
 *             stage pleading, hungry; Necessary is always on
 *   allow     switch a category on and a cookie leaps from the
 *             switch into Crumb's hands and he eats it, bite by
 *             bite, crumbs falling, and settles a little fuller;
 *             with everything allowed he's stuffed
 *   take back switch one off and the bitten cookie flies back
 *             while he eases back to how full he was
 *   decide    Reject all hands every cookie back; Accept all
 *             feeds the rest; the main button says Accept all or
 *             Save choices, and saving gets a happy hop
 *
 * The choice is yours to keep: onSave gets { [category]: on }
 * to write to a cookie, your consent platform or your API.
 * ───────────────────────────────────────────────────────── */

export interface CookieCategory {
  id: string;
  label: string;
  description?: string;
  /** Always on and can't be switched off, e.g. sign-in and security. */
  required?: boolean;
}

export type CookieChoices = Record<string, boolean>;

export interface CookieConsentProps {
  categories?: CookieCategory[];
  value?: CookieChoices;
  defaultValue?: CookieChoices;
  onValueChange?: (choices: CookieChoices) => void;
  /** Keep the choices (a cookie, your consent platform, your API); throw an Error to say why not. */
  onSave: (choices: CookieChoices) => Promise<unknown>;
  title?: string;
  description?: string;
  /** Your cookie policy, linked under the choices. */
  policyHref?: string;
  /** What the mascot is called in its lines. */
  name?: string;
  className?: string;
}

const CATEGORIES: CookieCategory[] = [
  {
    id: "necessary",
    label: "Necessary",
    description: "Sign-in, security and your choices here.",
    required: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Counts visits so we know what to fix.",
  },
  {
    id: "marketing",
    label: "Marketing",
    description: "Measures ads and where you came from.",
  },
  {
    id: "personalization",
    label: "Personalization",
    description: "Remembers what you like.",
  },
];
const EMPTY: CookieChoices = {};

const mix = (color: string, amount: number, into = "transparent") =>
  `color-mix(in oklab, ${color} ${amount}%, ${into})`;
const CARD: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 95, "var(--foreground)")})`,
  boxShadow: `0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 85)}`,
};
const STAGE: React.CSSProperties = {
  backgroundColor: "var(--primary)",
  backgroundImage: `radial-gradient(90% 80% at 50% 100%, ${mix("var(--primary-foreground)", 20)} 0%, transparent 60%), radial-gradient(120% 90% at 0% 0%, ${mix("var(--primary-foreground)", 16)} 0%, transparent 55%), linear-gradient(175deg, transparent 40%, ${mix("black", 22)} 100%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 36)}, inset 0 0 0 1px ${mix("var(--primary-foreground)", 12)}`,
};
const LIT: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${mix("var(--primary-foreground)", 16)}, transparent 60%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 32)}, inset 0 0 0 1px ${mix("black", 10)}`,
};
/* Crumb's cookie crumbs and the pool of light he sits in; each can be overridden. */
const CRUMB = {
  "--crumb-floor": mix("var(--primary-foreground)", 45),
  "--crumb-cookie": "oklch(0.7 0.11 65)",
} as React.CSSProperties;

export function CookieConsent({
  categories = CATEGORIES,
  value,
  defaultValue = EMPTY,
  onValueChange,
  onSave,
  title = "Cookie settings",
  description,
  policyHref,
  name = "Crumb",
  className = "",
}: CookieConsentProps) {
  const reduced = useInteractionReducedMotion();
  const baseId = React.useId();
  const [own, setOwn] = React.useState<CookieChoices>(defaultValue);
  const choices = value ?? own;
  const [act, setAct] = React.useState<{
    which: "accept" | "reject" | null;
    status: ActionStatus;
    error?: string;
  }>({ which: null, status: "idle" });
  const [said, setSaid] = React.useState("");
  const sectionRef = React.useRef<HTMLElement>(null);
  const overlayRef = React.useRef<SVGSVGElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const crumb = React.useRef<CrumbHandle>(null);
  const switches = React.useRef(new Map<string, HTMLElement>());

  const optional = categories.filter((c) => !c.required);
  const isOn = (c: CookieCategory) => Boolean(c.required || choices[c.id]);
  const fed = optional.filter(isOn).length;
  const allOn = fed === optional.length;
  const busy = act.status === "pending";

  const commit = (next: CookieChoices) => {
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
  };

  /** Where a category's switch is, in the block's own px. */
  const switchAt = (id: string): Point => {
    const section = sectionRef.current;
    const el = switches.current.get(id);
    if (!section || !el) return { x: 0, y: 0 };
    const box = section.getBoundingClientRect();
    const k = box.width / (section.offsetWidth || box.width) || 1;
    const r = el.getBoundingClientRect();
    return {
      x: (r.left + r.width / 2 - box.left) / k,
      y: (r.top + r.height / 2 - box.top) / k,
    };
  };

  const toggle = (c: CookieCategory, on: boolean) => {
    if (busy || c.required) return;
    commit({ ...choices, [c.id]: on });
    if (on) crumb.current?.feed(switchAt(c.id));
    else crumb.current?.giveBack(switchAt(c.id));
    setSaid(`${c.label} ${on ? "allowed" : "off"}.`);
    if (act.status !== "idle") setAct({ which: null, status: "idle" });
  };

  const save = async (
    which: "accept" | "reject",
    next: CookieChoices,
    wait: number,
  ) => {
    setAct({ which, status: "pending" });
    try {
      // let the cookies land before the choice is kept
      await new Promise((r) => window.setTimeout(r, wait));
      await onSave(next);
      setAct({ which, status: "success" });
      setSaid(
        which === "reject"
          ? "Saved: only necessary cookies."
          : `Saved your cookie choices.`,
      );
      crumb.current?.wave();
    } catch (e) {
      setAct({
        which,
        status: "error",
        error:
          e instanceof Error && e.message
            ? e.message
            : "Couldn’t save that. Try again.",
      });
    }
  };

  const acceptAll = () => {
    if (busy) return;
    const off = optional.filter((c) => !choices[c.id]);
    const keep = fed > 0 && !allOn;
    if (keep)
      return void save(
        "accept",
        {
          ...choices,
          ...Object.fromEntries(
            categories.filter((c) => c.required).map((c) => [c.id, true]),
          ),
        },
        0,
      );
    const next = Object.fromEntries(categories.map((c) => [c.id, true]));
    commit(next);
    off.forEach((c, i) => crumb.current?.feed(switchAt(c.id), i * 170));
    void save(
      "accept",
      next,
      reduced || !off.length ? 0 : off.length * 170 + 620,
    );
  };

  const rejectAll = () => {
    if (busy) return;
    const on = optional.filter((c) => choices[c.id]);
    const next = Object.fromEntries(
      categories.map((c) => [c.id, Boolean(c.required)]),
    );
    commit(next);
    on.forEach((c, i) => crumb.current?.giveBack(switchAt(c.id), i * 140));
    void save(
      "reject",
      next,
      reduced || !on.length ? 0 : on.length * 140 + 640,
    );
  };

  const mood =
    fed === 0
      ? `${name} is hungry`
      : allOn
        ? `${name} is stuffed`
        : `${name} could eat more`;
  const mainLabel = fed > 0 && !allOn ? "Save choices" : "Accept all";

  return (
    <section
      ref={sectionRef}
      aria-labelledby={`${baseId}-title`}
      className={`relative w-full max-w-[380px] rounded-[28px] p-2 text-card-foreground ${className}`}
      style={{ ...CARD, ...CRUMB }}
    >
      {/* Its natural width where the parent sizes to its content, without forcing it on narrow screens. */}
      <div
        aria-hidden="true"
        data-natural-width
        className="grid h-0"
        style={{ gridTemplateColumns: "minmax(0, 380px)" }}
      />
      <div className="@container w-full">
        {/* The one lit surface: Crumb's stage. */}
        <div
          ref={stageRef}
          className="relative h-[172px] overflow-clip rounded-[22px] text-primary-foreground"
          style={STAGE}
        >
          <p className="absolute left-3.5 top-3 z-10 text-[12.5px] font-medium text-primary-foreground/80">
            <TextMorph>{mood}</TextMorph>
          </p>
          <Crumb
            ref={crumb}
            fed={fed}
            total={optional.length}
            reduced={reduced}
            overlay={overlayRef}
            stage={stageRef}
          />
        </div>

        <div className="px-2 pt-3">
          <h2
            id={`${baseId}-title`}
            className="px-1 text-[15px] font-medium tracking-[-0.01em]"
          >
            {title}
          </h2>
          <p className="mt-0.5 px-1 text-[12.5px] text-muted-foreground">
            {description ?? `Every cookie you allow goes to ${name}.`}
          </p>

          <ul className="mt-2">
            {categories.map((c) => (
              <li
                key={c.id}
                className="flex min-h-12 items-center gap-3 border-t border-border/70 px-1 py-2 first:border-t-0"
              >
                <span className="min-w-0 flex-1">
                  <span
                    id={`${baseId}-${c.id}`}
                    className="block text-[13.5px] font-medium"
                  >
                    {c.label}
                  </span>
                  {c.description && (
                    <span className="block truncate text-[12px] text-muted-foreground">
                      {c.description}
                    </span>
                  )}
                </span>
                {c.required ? (
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11.5px] text-muted-foreground">
                    Always on
                  </span>
                ) : (
                  <span
                    ref={(el) => {
                      if (el) switches.current.set(c.id, el);
                      else switches.current.delete(c.id);
                    }}
                    className="flex shrink-0"
                  >
                    <Switch
                      size="sm"
                      checked={isOn(c)}
                      aria-labelledby={`${baseId}-${c.id}`}
                      disabled={busy}
                      onCheckedChange={(on) => toggle(c, on)}
                    />
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <StatusButton
              variant="outline"
              status={act.which === "reject" ? act.status : "idle"}
              labels={{
                idle: "Reject all",
                pending: "Saving",
                success: "Saved",
                error: "Try again",
              }}
              disabled={busy && act.which !== "reject"}
              onClick={rejectAll}
              className="h-10 w-full text-[13.5px]"
            />
            <StatusButton
              status={act.which === "accept" ? act.status : "idle"}
              labels={{
                idle: mainLabel,
                pending: "Saving",
                success: "Saved",
                error: "Try again",
              }}
              disabled={busy && act.which !== "accept"}
              onClick={acceptAll}
              className="h-10 w-full text-[13.5px]"
              style={
                act.which === "accept" && act.status === "error"
                  ? undefined
                  : LIT
              }
            />
          </div>
          <p
            role={act.error ? "alert" : undefined}
            className={`mt-2 pb-1 text-center text-[12px] ${act.error ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
          >
            {act.error ?? (
              <>
                Change this any time{policyHref ? " · " : "."}
                {policyHref && (
                  <a
                    href={policyHref}
                    className="underline decoration-border underline-offset-2 hover:text-foreground"
                  >
                    Cookie policy
                  </a>
                )}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Cookies fly over the whole block, from a switch to the mouth and back. */}
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

export default CookieConsent;
