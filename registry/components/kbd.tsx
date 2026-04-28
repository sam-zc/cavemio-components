"use client";

import * as React from "react";

export interface KbdProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Individual keycaps, e.g. ["mod", "k"] or "mod+shift+p". Display only. */
  keys?: string[] | string;
  /** Reflect physical keys while held, without claiming their keyboard events. */
  live?: boolean;
  /** Size of individual keycaps supplied by keys (or live hotkey feedback). */
  size?: "sm" | "md";
  /** Key combined with Cmd or Ctrl, e.g. "k". Empty/omitted disables the shortcut. */
  hotkey?: string;
  /** Optional action label displayed beside the keycap in a full-size surface. */
  label?: React.ReactNode;
  /** Called once by a click, Enter/Space, or the matching global shortcut. */
  onTrigger?: (
    event: KeyboardEvent | React.MouseEvent<HTMLButtonElement>,
  ) => void;
  /** Stop clicks and matching shortcuts before they reach ancestor handlers. */
  stopPropagation?: boolean;
  /** Button ref, available when onTrigger is supplied. */
  ref?: React.Ref<HTMLButtonElement>;
}

const subscribePlatform = () => () => {};
const isMac = () =>
  /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const keycap =
  "inline-flex h-5 min-w-5 shrink-0 items-center justify-center gap-0.5 whitespace-nowrap rounded bg-background px-1.5 [font-family:inherit] text-[11px] font-medium leading-none text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)]";

const labeledSurface =
  "inline-flex h-8 items-center justify-center gap-6 whitespace-nowrap rounded-lg bg-transparent pl-2.5 pr-1.5 [font-family:inherit] text-[14px] font-normal text-foreground/80 shadow-[inset_0_0_0_1px_var(--border)]";

const aliases: Record<string, string> = {
  cmd: "meta",
  command: "meta",
  "⌘": "meta",
  ctrl: "control",
  "⌃": "control",
  option: "alt",
  "⌥": "alt",
  "⇧": "shift",
  esc: "escape",
  return: "enter",
  "↵": "enter",
  spacebar: " ",
  space: " ",
  "␣": " ",
  up: "arrowup",
  "↑": "arrowup",
  down: "arrowdown",
  "↓": "arrowdown",
  left: "arrowleft",
  "←": "arrowleft",
  right: "arrowright",
  "→": "arrowright",
  "⌫": "backspace",
  "⇥": "tab",
};
function normalizeKey(value: string) {
  const lower = value === " " ? value : value.trim().toLowerCase();
  return aliases[lower] ?? lower;
}
function resolvedKey(key: string, mac: boolean) {
  return key === "mod" ? (mac ? "meta" : "control") : key;
}
function keyLabel(key: string, mac: boolean, spoken = false): string {
  const resolved = resolvedKey(key, mac);
  const words: Record<string, string> = {
    meta: mac ? "Command" : "Windows",
    control: "Control",
    alt: mac ? "Option" : "Alt",
    shift: "Shift",
    enter: "Enter",
    escape: "Escape",
    backspace: "Backspace",
    tab: "Tab",
    " ": "Space",
    arrowup: "Up arrow",
    arrowdown: "Down arrow",
    arrowleft: "Left arrow",
    arrowright: "Right arrow",
  };
  if (spoken) return words[resolved] ?? key.toUpperCase();
  const symbols: Record<string, string> = {
    meta: mac ? "⌘" : "Win",
    control: mac ? "⌃" : "Ctrl",
    alt: mac ? "⌥" : "Alt",
    shift: mac ? "⇧" : "Shift",
    enter: mac ? "↵" : "Enter",
    escape: "Esc",
    backspace: mac ? "⌫" : "Backspace",
    tab: mac ? "⇥" : "Tab",
    " ": "Space",
    arrowup: "↑",
    arrowdown: "↓",
    arrowleft: "←",
    arrowright: "→",
  };
  return symbols[resolved] ?? key.toUpperCase();
}

function KeySequence({
  keys,
  mac,
  live,
  size,
}: {
  keys: string[];
  mac: boolean | null;
  live: boolean;
  size: "sm" | "md";
}) {
  const [held, setHeld] = React.useState<string[]>([]);
  React.useEffect(() => {
    if (!live) return;
    const physicalKeys = new Map<string, string>();
    const clear = () => {
      physicalKeys.clear();
      setHeld([]);
    };
    const update = (event: KeyboardEvent) => {
      if (event.isComposing || event.key === "Unidentified") return;
      const key = normalizeKey(event.key);
      const code = event.code || key;
      if (event.type === "keydown") physicalKeys.set(code, key);
      else physicalKeys.delete(code);
      // macOS can omit letter keyup events during Command chords.
      if (event.type === "keyup" && key === "meta") physicalKeys.clear();
      const modifiers: Record<string, boolean> = {
        meta: event.metaKey,
        control: event.ctrlKey,
        alt: event.altKey,
        shift: event.shiftKey,
      };
      for (const [code, value] of physicalKeys) {
        if (value in modifiers && !modifiers[value]) physicalKeys.delete(code);
      }
      const next = [
        ...new Set([
          ...physicalKeys.values(),
          ...Object.keys(modifiers).filter((key) => modifiers[key]),
        ]),
      ];
      setHeld((previous) =>
        previous.length === next.length &&
        previous.every((key) => next.includes(key))
          ? previous
          : next,
      );
    };
    const visibility = () => {
      if (document.hidden) clear();
    };
    window.addEventListener("keydown", update, true);
    window.addEventListener("keyup", update, true);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("keydown", update, true);
      window.removeEventListener("keyup", update, true);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [live]);

  return (
    <span className="inline-flex items-center gap-1">
      <span className="sr-only">
        {keys
          .map((key) =>
            mac === null && key === "mod"
              ? "Command or Control"
              : keyLabel(key, mac === true, true),
          )
          .join(" + ")}
      </span>
      {keys.map((key, index) => {
        const pressed = live && held.includes(resolvedKey(key, mac === true));
        return (
          <span
            key={`${index}:${key}`}
            aria-hidden="true"
            data-kbd-key={key}
            data-pressed={pressed}
            className={`inline-grid shrink-0 items-center justify-items-center rounded-md bg-background [font-family:inherit] font-medium leading-none transition-[translate,box-shadow,color] duration-100 motion-reduce:translate-y-0 motion-reduce:transition-none ${
              size === "sm"
                ? "h-5 min-w-5 px-1 text-[11px]"
                : "h-6 min-w-6 px-1 text-[12px]"
            } ${
              pressed
                ? "translate-y-px text-foreground shadow-[inset_0_0_0_1px_var(--border)]"
                : "translate-y-0 text-muted-foreground shadow-[inset_0_0_0_1px_var(--border),inset_0_-1px_0_var(--border)]"
            }`}
          >
            <span className={mac === null ? "invisible" : undefined}>
              {keyLabel(key, mac !== false)}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/** A passive keycap, or a native shortcut button when onTrigger is provided. */
export function Kbd({
  keys,
  live = false,
  size = "md",
  hotkey = "",
  label,
  onTrigger,
  stopPropagation = false,
  disabled = false,
  children,
  className = "",
  onClick,
  ref,
  ...props
}: KbdProps) {
  const mac = React.useSyncExternalStore<boolean | null>(
    subscribePlatform,
    isMac,
    () => null,
  );
  const key = hotkey.trim();
  const sequence =
    keys !== undefined
      ? (Array.isArray(keys) ? keys : keys.split("+"))
          .map(normalizeKey)
          .filter(Boolean)
      : live && key
        ? ["mod", normalizeKey(key)]
        : null;
  React.useEffect(() => {
    if (!key || !onTrigger || disabled) return;
    const handleKey = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.key.toLowerCase() !== key.toLowerCase() ||
        !(event.metaKey || event.ctrlKey) ||
        event.altKey ||
        event.shiftKey
      )
        return;
      event.preventDefault();
      if (stopPropagation) event.stopPropagation();
      if (!event.repeat) onTrigger(event);
    };
    // Capture only when propagation is explicitly suppressed, before React ancestors.
    document.addEventListener("keydown", handleKey, stopPropagation);
    return () =>
      document.removeEventListener("keydown", handleKey, stopPropagation);
  }, [key, onTrigger, disabled, stopPropagation]);

  const content = (
    <>
      {children}
      {sequence ? (
        <KeySequence
          key={JSON.stringify([sequence, live, disabled])}
          keys={sequence}
          mac={mac}
          live={live && !disabled}
          size={size}
        />
      ) : (
        key && (
          <>
            {/* Keep unknown platform labels hidden; size only the displayed chord. */}
            <span
              className={`inline-flex items-center justify-center gap-0.5 ${mac === null ? "invisible" : ""}`}
              aria-hidden="true"
            >
              <span>{mac === false ? "Ctrl" : "⌘"}</span>
              {mac === false && <span>+</span>}
              <span>{key.toUpperCase()}</span>
            </span>
            <span className="sr-only">
              {mac === null
                ? "Command or Control"
                : mac
                  ? "Command"
                  : "Control"}{" "}
              + {key.toUpperCase()}
            </span>
          </>
        )
      )}
    </>
  );
  const hasLabel = label != null;
  const face = (
    <>
      {hasLabel && (
        <span className="inline-flex items-center gap-2">{label}</span>
      )}
      {(sequence || key || children || !hasLabel) && (
        <kbd
          className={
            hasLabel && !sequence
              ? keycap
              : "inline-flex items-center gap-0.5 [font-family:inherit]"
          }
        >
          {content}
        </kbd>
      )}
    </>
  );
  if (!onTrigger && hasLabel) {
    return (
      <span className={`${labeledSurface} ${className}`} {...props}>
        {face}
      </span>
    );
  }
  if (!onTrigger) {
    return (
      <kbd
        className={`${sequence ? "inline-flex items-center gap-1" : keycap} ${className}`}
        {...props}
      >
        {content}
      </kbd>
    );
  }
  return (
    <button
      {...props}
      ref={ref}
      type={props.type ?? "button"}
      disabled={disabled}
      aria-keyshortcuts={key ? `Meta+${key} Control+${key}` : undefined}
      className={`${hasLabel ? labeledSurface : sequence ? "inline-flex items-center gap-1 rounded-md" : keycap} relative cursor-pointer hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 after:absolute ${hasLabel ? "after:-inset-y-1.5 after:inset-x-0" : "after:-inset-y-3 after:-inset-x-2"} ${className}`}
      onClick={(event) => {
        if (stopPropagation) event.stopPropagation();
        onClick?.(event);
        if (!event.defaultPrevented) onTrigger(event);
      }}
    >
      {face}
    </button>
  );
}
