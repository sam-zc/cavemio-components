"use client";

import * as React from "react";

/*
 * The dock's motion engine. One frame loop eases every moving part toward its target and
 * stops when they all settle, so a resting dock costs nothing.
 *
 *   lens     tools near the pointer scale up and the row parts around them. Distances are
 *            measured from fixed rest positions, so growth never feeds back into the pointer
 *            maths. Only transforms move: no layout while you sweep across it.
 *   marker   the selected tool's pad glides to the new tool and rides its magnification.
 *   label    one name that follows the tool under the pointer and lifts above its new height.
 *   surface  the tray widens with the lens, and grows up into the open panel.
 */

export type DockLensOptions = {
  count: number;
  size: number;
  gap: number;
  inset: number;
  magnification: number;
  reduced: boolean;
  onHover: (index: number | null) => void;
};

type Targets = {
  pointer: number | null;
  focus: number | null;
  selected: number;
  open: boolean;
  panelHeight: number;
  panelWidth: number;
};

// Seconds to close ~63% of the gap. While the pointer sweeps the lens is all but attached to it (TRACK); entering and
// leaving the dock, where the targets jump, ease more gently (LENS) so the tools swell and settle instead of snapping.

export function useDockLens({
  count,
  size,
  gap,
  inset,
  magnification,
  reduced,
  onHover,
}: DockLensOptions) {
  const icons = React.useRef<(HTMLElement | null)[]>([]);
  const pad = React.useRef<HTMLDivElement>(null);
  const label = React.useRef<HTMLDivElement>(null);
  const surface = React.useRef<HTMLDivElement>(null);
  const panel = React.useRef<HTMLDivElement>(null);
  const row = React.useRef<HTMLDivElement>(null);

  const target = React.useRef<Targets>({
    pointer: null,
    focus: null,
    selected: 0,
    open: false,
    panelHeight: 0,
    panelWidth: 0,
  });
  const sim = React.useRef({
    s: [] as number[],
    sV: [] as number[],
    o: [] as number[],
    pad: NaN,
    padV: 0,
    labelX: NaN,
    labelLift: 0,
    labelOpacity: 0,
    open: 0,
    openV: 0,
    height: 0,
    heightV: 0,
    width: 0,
    widthV: 0,
    last: 0,
  });
  const frame = React.useRef(0);
  const hovered = React.useRef<number | null>(null);
  const origin = React.useRef<number | null>(null);
  const opts = React.useRef({
    count,
    size,
    gap,
    inset,
    magnification,
    reduced,
    onHover,
  });
  React.useLayoutEffect(() => {
    opts.current = { count, size, gap, inset, magnification, reduced, onHover };
  });

  const tick = React.useCallback(function runTick(now: number) {
    frame.current = 0;
    const {
      count: n,
      size: S,
      gap: G,
      inset: P,
      magnification: M,
      reduced: still,
      onHover: hover,
    } = opts.current;
    const t = target.current;
    const st = sim.current;
    const dt = st.last ? Math.min(0.064, (now - st.last) / 1000) : 1 / 60;
    st.last = now;
    const ease = (tau: number) => (still ? 1 : 1 - Math.exp(-dt / tau));
    let moving = false;
    const approach = (from: number, to: number, k: number) => {
      const next = Number.isNaN(from) ? to : from + (to - from) * k;
      if (Math.abs(next - to) > 0.0005) moving = true;
      return Math.abs(next - to) <= 0.0005 ? to : next;
    };

    const step = S + G;
    const rest = (i: number) => P + i * step + S / 2;
    const anchor = t.focus !== null ? rest(t.focus) : t.pointer;
    const reach = S * 2.4;
    const peak = still ? 1 : t.open ? Math.min(M, 1.22) : M;

    // The lens: scale per tool with organic settling when the pointer leaves
    let extra = 0;
    for (let i = 0; i < n; i++) {
      const d = anchor === null ? Infinity : Math.abs(anchor - rest(i));
      const f = d < reach ? (1 + Math.cos((d / reach) * Math.PI)) / 2 : 0;
      const goal = 1 + (peak - 1) * f;

      if (anchor === null && !still) {
        // Soft harmonic breath as icons return to rest (visualDuration ~0.28s)
        const sCur = st.s[i] ?? 1;
        const kIcon = 260,
          cIcon = 24;
        st.sV[i] =
          (st.sV[i] ?? 0) +
          (-kIcon * (sCur - 1) - cIcon * (st.sV[i] ?? 0)) * dt;
        st.s[i] = sCur + st.sV[i] * dt;
        if (Math.abs(st.s[i] - 1) < 0.002 && Math.abs(st.sV[i]) < 0.02) {
          st.s[i] = 1;
          st.sV[i] = 0;
        } else {
          moving = true;
        }
      } else {
        st.sV[i] = 0;
        st.s[i] = approach(
          st.s[i] ?? 1,
          goal,
          ease(Math.abs(goal - (st.s[i] ?? 1)) > 0.08 ? 0.028 : 0.016),
        );
      }
      extra += S * (st.s[i] - 1);
    }
    let run = 0;
    for (let i = 0; i < n; i++) {
      const e = S * (st.s[i] - 1);
      st.o[i] = run + e / 2 - extra / 2;
      run += e;
      const el = icons.current[i];
      if (el)
        el.style.transform = `translate3d(${st.o[i]}px,0,0) scale(${st.s[i]})`;
    }

    // The pad snaps with a lively harmonic spring (hint of overshoot for magnetic tactile feel)
    const padGoal = rest(t.selected);
    if (still || Number.isNaN(st.pad)) {
      st.pad = padGoal;
      st.padV = 0;
    } else {
      const kPad = 360,
        cPad = 28;
      st.padV =
        (st.padV ?? 0) +
        (-kPad * (st.pad - padGoal) - cPad * (st.padV ?? 0)) * dt;
      st.pad += st.padV * dt;
      if (Math.abs(st.pad - padGoal) < 0.25 && Math.abs(st.padV) < 4) {
        st.pad = padGoal;
        st.padV = 0;
      } else {
        moving = true;
      }
    }
    const u = Math.max(0, Math.min(n - 1, (st.pad - rest(0)) / step));
    const i0 = Math.floor(u),
      i1 = Math.min(n - 1, i0 + 1),
      w = u - i0;
    const padOffset = (st.o[i0] ?? 0) * (1 - w) + (st.o[i1] ?? 0) * w;
    const padScale = (st.s[i0] ?? 1) * (1 - w) + (st.s[i1] ?? 1) * w;
    if (pad.current)
      pad.current.style.transform = `translate3d(${st.pad - S / 2 + padOffset}px,0,0) scale(${padScale})`;

    // The label: glides crisply with the tool and lifts above its height
    const near =
      anchor === null
        ? null
        : Math.max(0, Math.min(n - 1, Math.round((anchor - rest(0)) / step)));
    if (near !== hovered.current && near !== null) hover(near);
    if (near !== null) hovered.current = near;
    const shown = near ?? hovered.current;
    if (shown !== null) {
      st.labelX = approach(
        st.labelX,
        rest(shown) + (st.o[shown] ?? 0),
        ease(0.038),
      );
      st.labelLift = approach(
        st.labelLift,
        S * ((st.s[shown] ?? 1) - 1),
        ease(0.018),
      );
    }
    st.labelOpacity = approach(
      st.labelOpacity,
      near !== null && !t.open ? 1 : 0,
      ease(near !== null ? 0.04 : 0.035),
    );
    if (label.current) {
      label.current.style.transform = `translate3d(${st.labelX}px,${-st.labelLift - (1 - st.labelOpacity) * 4}px,0) translateX(-50%)`;
      label.current.style.opacity = String(st.labelOpacity);
    }

    // The surface: a tray that widens with the lens and grows up into the panel via smooth critically-damped spring
    const restWidth = n * S + (n - 1) * G + 2 * P;
    const hGoal = t.open ? t.panelHeight : 0;
    const wGoal = t.open ? Math.max(restWidth, t.panelWidth) : restWidth;
    const oGoal = t.open ? 1 : 0;

    if (still) {
      st.open = oGoal;
      st.height = hGoal;
      st.width = wGoal;
      st.openV = 0;
      st.heightV = 0;
      st.widthV = 0;
    } else {
      const kSurf = 240,
        cSurf = 31;
      st.heightV =
        (st.heightV ?? 0) +
        (-kSurf * (st.height - hGoal) - cSurf * (st.heightV ?? 0)) * dt;
      st.height += st.heightV * dt;
      if (Math.abs(st.height - hGoal) < 0.3 && Math.abs(st.heightV) < 4) {
        st.height = hGoal;
        st.heightV = 0;
      } else {
        moving = true;
      }

      st.widthV =
        (st.widthV ?? 0) +
        (-kSurf * (st.width - wGoal) - cSurf * (st.widthV ?? 0)) * dt;
      st.width += st.widthV * dt;
      if (Math.abs(st.width - wGoal) < 0.3 && Math.abs(st.widthV) < 4) {
        st.width = wGoal;
        st.widthV = 0;
      } else {
        moving = true;
      }

      st.openV =
        (st.openV ?? 0) +
        (-kSurf * (st.open - oGoal) - cSurf * (st.openV ?? 0)) * dt;
      st.open += st.openV * dt;
      if (Math.abs(st.open - oGoal) < 0.002 && Math.abs(st.openV) < 0.05) {
        st.open = oGoal;
        st.openV = 0;
      } else {
        moving = true;
      }
    }

    const band = S + 2 * P;
    const wide = Math.max(st.width, restWidth + extra);
    if (surface.current) {
      surface.current.style.width = `${wide}px`;
      surface.current.style.height = `${band + st.height}px`;
      surface.current.style.borderRadius = `${band / 2 + (20 - band / 2) * Math.min(1, st.open * 1.6)}px`;
    }
    if (panel.current) {
      panel.current.style.height = `${st.height}px`;
      panel.current.style.width = `${wide - 2}px`;
      panel.current.style.opacity = String(
        Math.max(0, (st.open - 0.35) / 0.65),
      );
      panel.current.style.visibility =
        st.open < 0.01 && !t.open ? "hidden" : "visible";
    }

    if (moving) frame.current = requestAnimationFrame(runTick);
    else st.last = 0;
  }, []);

  const kick = React.useCallback(() => {
    if (!frame.current) frame.current = requestAnimationFrame(tick);
  }, [tick]);

  // A rAF id kept in a ref must be cleared on unmount, or StrictMode's remount thinks the loop is still running.
  React.useEffect(() => {
    // A scroll under a resting pointer moves the row: measure again on the next move.
    const forget = () => {
      origin.current = null;
    };
    window.addEventListener("scroll", forget, { passive: true, capture: true });
    window.addEventListener("resize", forget);
    return () => {
      window.removeEventListener("scroll", forget, { capture: true });
      window.removeEventListener("resize", forget);
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, []);
  React.useLayoutEffect(() => {
    sim.current.last = 0;
    tick(performance.now());
  }, [count, size, gap, inset, magnification, reduced, tick]);

  const attachRow = React.useCallback((el: HTMLDivElement | null) => {
    row.current = el;
  }, []);
  const attachPad = React.useCallback((el: HTMLDivElement | null) => {
    pad.current = el;
  }, []);
  const attachLabel = React.useCallback((el: HTMLDivElement | null) => {
    label.current = el;
  }, []);
  const attachSurface = React.useCallback((el: HTMLDivElement | null) => {
    surface.current = el;
  }, []);
  const attachPanel = React.useCallback((el: HTMLDivElement | null) => {
    panel.current = el;
  }, []);
  const attachIcon = React.useCallback(
    (index: number, el: HTMLElement | null) => {
      icons.current[index] = el;
    },
    [],
  );
  const focusIcon = React.useCallback((index: number) => {
    icons.current[index]?.focus({ preventScroll: true });
  }, []);

  const set = React.useCallback(
    (next: Partial<Targets>) => {
      Object.assign(target.current, next);
      kick();
    },
    [kick],
  );

  const pointer = React.useCallback(
    (event: React.PointerEvent) => {
      if (event.pointerType === "touch" || !row.current) return;
      // The row never moves under the lens (only transforms do), so its edge is read once per hover.
      if (origin.current === null)
        origin.current = row.current.getBoundingClientRect().left;
      target.current.focus = null;
      target.current.pointer = event.clientX - origin.current;
      kick();
    },
    [kick],
  );

  const leave = React.useCallback(() => {
    origin.current = null;
    target.current.pointer = null;
    kick();
  }, [kick]);

  return React.useMemo(
    () => ({
      attachIcon,
      attachPad,
      attachLabel,
      attachSurface,
      attachPanel,
      attachRow,
      focusIcon,
      set,
      pointer,
      leave,
    }),
    [
      attachIcon,
      attachPad,
      attachLabel,
      attachSurface,
      attachPanel,
      attachRow,
      focusIcon,
      set,
      pointer,
      leave,
    ],
  );
}
