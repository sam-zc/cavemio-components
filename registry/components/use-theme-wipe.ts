"use client";

import { useEffect, useRef } from "react";
import { flushSync } from "react-dom";

type Mode = "light" | "dark";
type ActiveWipe = { mode: Mode; cancel: () => void };

// A document can have only one view transition, even with several toggles.
const activeWipes = new WeakMap<Document, ActiveWipe>();
const styles = `
html[data-theme-wipe]::view-transition { pointer-events: none; }
html[data-theme-wipe]::view-transition-group(*) { animation: none; }
html[data-theme-wipe]::view-transition-old(root),
html[data-theme-wipe]::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}`;

export function useThemeWipe() {
  const owned = useRef<ActiveWipe | null>(null);
  useEffect(() => () => owned.current?.cancel(), []);

  return (
    origin: HTMLElement,
    current: Mode,
    effect: "none" | "circular",
    change: (mode: Mode) => void,
    nonce?: string,
  ) => {
    const doc = origin.ownerDocument;
    const win = doc.defaultView;
    const previous = activeWipes.get(doc);
    const mode = (previous?.mode ?? current) === "dark" ? "light" : "dark";
    previous?.cancel();
    let applied = false;
    const apply = () => {
      if (applied) return;
      applied = true;
      flushSync(() => change(mode));
    };
    const reduced = win?.matchMedia("(prefers-reduced-motion: reduce)");
    if (
      effect === "none" ||
      previous ||
      !win ||
      reduced?.matches ||
      doc.visibilityState === "hidden" ||
      !doc.startViewTransition ||
      // Do not interrupt a router-owned transition on browsers exposing it.
      (doc as Document & { activeViewTransition?: ViewTransition | null })
        .activeViewTransition
    ) {
      apply();
      return;
    }

    const root = doc.documentElement;
    const bounds = origin.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const radius = Math.hypot(
      Math.max(x, win.innerWidth - x),
      Math.max(y, win.innerHeight - y),
    );
    // Ship scoped transition CSS with the helper, not the app's stylesheet.
    const sheet = doc.createElement("style");
    if (nonce) sheet.nonce = nonce;
    sheet.textContent = styles;
    doc.head.append(sheet);
    if (!sheet.sheet) {
      sheet.remove();
      apply();
      return;
    }
    const oldAttribute = root.getAttribute("data-theme-wipe");
    let cancelled = false;
    let transition: ViewTransition | undefined;
    let animation: Animation | undefined;
    const cleanup = () => {
      animation?.cancel();
      sheet.remove();
      reduced?.removeEventListener("change", settle);
      win.removeEventListener("resize", settle);
      doc.removeEventListener("visibilitychange", visibility);
      if (activeWipes.get(doc) === run) {
        activeWipes.delete(doc);
        if (oldAttribute === null) root.removeAttribute("data-theme-wipe");
        else root.setAttribute("data-theme-wipe", oldAttribute);
      }
      if (owned.current === run) owned.current = null;
    };
    const run: ActiveWipe = {
      mode,
      cancel() {
        cancelled = true;
        transition?.skipTransition();
        cleanup();
      },
    };
    function settle() {
      run.cancel();
      apply();
    }
    function visibility() {
      if (doc.visibilityState === "hidden") settle();
    }
    owned.current = run;
    activeWipes.set(doc, run);
    root.setAttribute("data-theme-wipe", "");
    reduced?.addEventListener("change", settle);
    win.addEventListener("resize", settle);
    doc.addEventListener("visibilitychange", visibility);

    try {
      transition = doc.startViewTransition(() => {
        if (!cancelled) apply();
      });
      if (cancelled) transition.skipTransition();
      void transition.ready
        .then(() => {
          if (cancelled) return;
          animation = root.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${radius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 620,
              easing: "cubic-bezier(0.65, 0, 0.35, 1)",
              pseudoElement: "::view-transition-new(root)",
            },
          );
        })
        .catch(() => {
          if (!cancelled) settle();
        });
      void transition.finished.then(cleanup, cleanup);
    } catch {
      settle();
    }
  };
}
