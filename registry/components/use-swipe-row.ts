"use client";

import * as React from "react";
import {
  projectInertia,
  rubberBand,
  softenVelocity,
} from "./imported-ui-interaction-motion";

/*
 * The swipe row's engine. The row's face slides over two sets of action cells, one under each
 * edge. Every cell is a full-height layer moved by transform only: as the face slides, the cells
 * share the space it uncovers equally, so each one grows with the finger, and their icons scale in
 * once there is room. Past most of the row the first action arms: it takes the whole space, its
 * icon rides the face's edge, and letting go there runs it.
 *
 * Drags, trackpad swipes and releases write transforms straight to the elements. One frame loop
 * runs the spring and the arming, and sleeps when both are still. Nothing renders through React
 * until a row opens, closes or commits.
 */

export type SwipeSide = "leading" | "trailing";

type Options = {
  leading: number;
  trailing: number;
  cellWidth: number;
  reduced: boolean;
  disabled: boolean;
  /** Released while armed: run that side's first action. */
  onFull: (side: SwipeSide) => void;
};

type Sim = {
  x: number;
  v: number;
  target: number;
  spring: "none" | "settle" | "out";
  arm: number;
  armTarget: number;
  armSide: SwipeSide;
  armIndex: number;
  armed: boolean;
  width: number;
  last: number;
  done: (() => void) | null;
  moving: boolean;
};

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const STEP = 1 / 240;

// One open row at a time, as in a mail list: opening one closes the others.
const openRows = new Set<() => void>();

export function useSwipeRow(options: Options) {
  const opts = React.useRef(options);
  React.useLayoutEffect(() => {
    opts.current = options;
  });
  const surface = React.useRef<HTMLDivElement>(null);
  const front = React.useRef<HTMLDivElement>(null);
  const cells = React.useRef<Record<SwipeSide, (HTMLElement | null)[]>>({
    leading: [],
    trailing: [],
  });
  const faces = React.useRef<Record<SwipeSide, (HTMLElement | null)[]>>({
    leading: [],
    trailing: [],
  });
  const faceWidths = React.useRef(new WeakMap<HTMLElement, number>());
  const sim = React.useRef<Sim>({
    x: 0,
    v: 0,
    target: 0,
    spring: "none",
    arm: 0,
    armTarget: 0,
    armSide: "trailing",
    armIndex: 0,
    armed: false,
    width: 0,
    last: 0,
    done: null,
    moving: false,
  });
  const frame = React.useRef(0);
  const [open, setOpen] = React.useState<SwipeSide | null>(null);
  const openRef = React.useRef<SwipeSide | null>(null);
  const closeOthers = React.useRef<() => void>(() => {});

  const width = () => {
    const s = sim.current;
    if (!s.width) s.width = surface.current?.offsetWidth ?? 0;
    return s.width;
  };
  const count = (side: SwipeSide) =>
    side === "leading" ? opts.current.leading : opts.current.trailing;
  const rail = (side: SwipeSide) => count(side) * opts.current.cellWidth;
  const threshold = (side: SwipeSide) =>
    clamp(
      width() * 0.62,
      rail(side) + 40,
      Math.max(rail(side) + 40, width() - 32),
    );

  const paint = React.useCallback(() => {
    const s = sim.current,
      W = width(),
      A = opts.current.cellWidth;
    if (front.current)
      front.current.style.transform = `translate3d(${s.x}px,0,0)`;
    // Mark the row while it's off its rest, so hover affordances stand down until it's back.
    const moving = Math.abs(s.x) > 0.5;
    if (surface.current && moving !== s.moving) {
      s.moving = moving;
      surface.current.toggleAttribute("data-moving", moving);
    }
    for (const side of ["leading", "trailing"] as const) {
      const k = count(side);
      const reveal = side === "trailing" ? Math.max(0, -s.x) : Math.max(0, s.x);
      const slice = k ? reveal / k : 0;
      for (let i = 0; i < k; i++) {
        const cell = cells.current[side][i],
          face = faces.current[side][i];
        if (!cell) continue;
        const armed = s.armSide === side && s.armIndex === i ? s.arm : 0;
        const visible = lerp(slice, reveal, armed);
        // The cell's inner edge: where the face's edge is when this cell has taken over.
        const inner =
          side === "trailing"
            ? lerp(W - (i + 1) * slice, W - reveal, armed)
            : lerp((i + 1) * slice, reveal, armed);
        cell.style.transform = `translate3d(${side === "trailing" ? inner : inner - W}px,0,0)`;
        cell.style.zIndex = String(armed > 0.01 ? 20 : k - i);
        // Closed, a cell sits exactly on the row's edge; at a fractional scale (125% displays, scaled previews) its colour
        // would bleed through as a 1px sliver, so it's hidden until the row moves.
        cell.style.visibility = reveal > 0.5 || armed > 0.01 ? "" : "hidden";
        if (face) {
          // Measured once per face (labels don't change while it moves), so painting never reads layout.
          let fw = faceWidths.current.get(face);
          if (!fw) {
            fw = face.offsetWidth || A * 0.6;
            faceWidths.current.set(face, fw);
          }
          const centre = lerp(slice / 2, Math.min(visible / 2, A / 2), armed);
          const x = side === "trailing" ? centre - fw / 2 : W - centre - fw / 2;
          const p = clamp((visible - 18) / (A * 0.62), 0, 1);
          face.style.transform = `translate3d(${x}px,0,0) scale(${0.72 + 0.28 * p})`;
          face.style.opacity = String(p);
        }
      }
    }
  }, []);

  const tick = React.useCallback(
    function runTick(now: number) {
      frame.current = 0;
      const s = sim.current;
      const dt = s.last ? Math.min(0.05, (now - s.last) / 1000) : 1 / 60;
      s.last = now;
      let moving = false;
      if (s.spring !== "none") {
        // Opening is a little springy (it overshoots outward, showing more of the same actions). Closing and
        // leaving are critically damped, and closing never crosses zero, so the other side's cells never flash.
        const k = 520,
          c = s.spring === "out" || s.target === 0 ? 46 : 36;
        const side = Math.sign(s.x);
        for (let t = 0; t < dt - 1e-6; t += STEP) {
          const h = Math.min(STEP, dt - t);
          s.v += (-k * (s.x - s.target) - c * s.v) * h;
          s.x += s.v * h;
          if (s.target === 0 && side !== 0 && Math.sign(s.x) !== side) {
            s.x = 0;
            s.v = 0;
          }
        }
        if (Math.abs(s.x - s.target) < 0.4 && Math.abs(s.v) < 8) {
          s.x = s.target;
          s.v = 0;
          s.spring = "none";
          const done = s.done;
          s.done = null;
          done?.();
        } else moving = true;
      }
      const ka = 1 - Math.exp(-dt / 0.06);
      s.arm += (s.armTarget - s.arm) * ka;
      if (Math.abs(s.armTarget - s.arm) < 0.002) s.arm = s.armTarget;
      else moving = true;
      paint();
      if (moving) frame.current = requestAnimationFrame(runTick);
      else s.last = 0;
    },
    [paint],
  );

  const kick = React.useCallback(() => {
    if (!frame.current) frame.current = requestAnimationFrame(tick);
  }, [tick]);

  const setOpenSide = React.useCallback((side: SwipeSide | null) => {
    if (openRef.current === side) return;
    openRef.current = side;
    setOpen(side);
    if (side) {
      openRows.forEach((close) => close !== closeOthers.current && close());
      openRows.add(closeOthers.current);
    } else openRows.delete(closeOthers.current);
  }, []);

  /** Spring to a resting place: 0 (closed) or a side's rail (open). */
  const settle = React.useCallback(
    (target: number, velocity = 0) => {
      const s = sim.current;
      s.target = target;
      s.armTarget = 0;
      s.armed = false;
      setOpenSide(target < 0 ? "trailing" : target > 0 ? "leading" : null);
      if (opts.current.reduced) {
        s.x = target;
        s.v = 0;
        s.arm = 0;
        s.spring = "none";
        paint();
        return;
      }
      s.v = velocity;
      s.spring = "settle";
      kick();
    },
    [kick, paint, setOpenSide],
  );

  const close = React.useCallback(() => settle(0), [settle]);
  React.useLayoutEffect(() => {
    closeOthers.current = close;
  });

  /** One action takes the whole row and the face slides off; resolves once it's gone. */
  const commit = React.useCallback(
    (side: SwipeSide, index: number) =>
      new Promise<void>((resolve) => {
        const s = sim.current;
        s.armSide = side;
        s.armIndex = index;
        s.armTarget = 1;
        s.target = (side === "trailing" ? -1 : 1) * (width() + 2);
        setOpenSide(null);
        if (opts.current.reduced) {
          s.x = s.target;
          s.arm = 1;
          s.spring = "none";
          paint();
          resolve();
          return;
        }
        s.spring = "out";
        s.done = resolve;
        kick();
      }),
    [kick, paint, setOpenSide],
  );

  /** Bring the face back after a commit (the action failed, or it doesn't remove the row). */
  const restore = React.useCallback(() => {
    sim.current.armed = false;
    settle(0);
  }, [settle]);

  // Pointer and trackpad gestures.
  React.useEffect(() => {
    const el = surface.current;
    if (!el) return;
    const s = sim.current;
    let drag: {
      id: number;
      x: number;
      y: number;
      origin: number;
      started: boolean;
      samples: { x: number; t: number }[];
    } | null = null;
    let quiet: ReturnType<typeof setTimeout> | null = null;
    let wheelV = 0,
      wheelT = 0;
    let suppress = false;

    const follow = (raw: number) => {
      const W = width();
      const side: SwipeSide = raw < 0 ? "trailing" : "leading";
      const k = count(side);
      let x: number;
      if (!k) {
        x = Math.sign(raw) * rubberBand(Math.abs(raw), 80, 0.4);
      } else {
        const r = Math.abs(raw),
          limit = rail(side);
        x =
          Math.sign(raw) *
          (r <= limit ? r : limit + rubberBand(r - limit, W || 320));
      }
      s.x = x;
      // Arm past the threshold, disarm a little before it, so the boundary doesn't flicker.
      const reveal = Math.abs(x),
        T = k ? threshold(side) : Infinity;
      if (k && !s.armed && reveal >= T) {
        s.armed = true;
        s.armSide = side;
        s.armIndex = 0;
        s.armTarget = 1;
        try {
          if (drag && "vibrate" in navigator) navigator.vibrate(6);
        } catch {
          /* not allowed yet */
        }
      } else if (s.armed && (reveal < T - 24 || s.armSide !== side)) {
        s.armed = false;
        s.armTarget = 0;
      }
      if (s.arm !== s.armTarget) kick();
      else paint();
    };

    const release = (velocity: number) => {
      const side: SwipeSide = s.x < 0 ? "trailing" : "leading";
      const reveal = Math.abs(s.x),
        R = rail(side);
      const vPx = velocity * 1000;
      const dir = side === "trailing" ? -1 : 1;
      const outwardV = dir * vPx;
      const inwardV = -dir * vPx;

      if (s.armed && count(side)) {
        s.armed = false;
        opts.current.onFull(side);
        return;
      }

      // Projected travel based on flick velocity (120ms of inertia)
      const projected = projectInertia(reveal, outwardV / 1000, 0.12);
      const flung = count(side) && outwardV > 400 && projected > R * 0.4;
      const shouldOpen =
        count(side) &&
        inwardV < 300 &&
        (projected > R * 0.5 || (reveal > R * 0.35 && outwardV > 150));

      if (shouldOpen || flung) {
        settle(dir * R, vPx);
      } else {
        const launchV = softenVelocity(vPx, s.x, 8);
        settle(0, launchV);
      }
    };

    const down = (e: PointerEvent) => {
      suppress = false;
      if (opts.current.disabled || e.button !== 0 || !e.isPrimary) return;
      if (s.spring === "out") return;
      const W = surface.current?.offsetWidth ?? 0;
      s.width = W;
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      s.spring = "none";
      s.v = 0;
      drag = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        origin: s.x,
        started: false,
        samples: [{ x: e.clientX, t: e.timeStamp }],
      };
    };
    const move = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x,
        dy = e.clientY - drag.y;
      if (!drag.started) {
        if (Math.abs(dx) < 7 && Math.abs(dy) < 7) return;
        // Mostly vertical: it's a scroll, not a swipe.
        if (Math.abs(dy) > Math.abs(dx)) {
          drag = null;
          if (s.x !== 0 || s.arm) settle(openRef.current ? s.x : 0);
          return;
        }
        drag.started = true;
        // Compensate slop so drag originates seamlessly with zero initial jump:
        drag.x = e.clientX;
        drag.y = e.clientY;
        el.setPointerCapture(e.pointerId);
      }
      drag.samples.push({ x: e.clientX, t: e.timeStamp });
      while (drag.samples.length > 2 && e.timeStamp - drag.samples[0].t > 90)
        drag.samples.shift();
      follow(drag.origin + (e.clientX - drag.x));
    };
    const up = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag;
      drag = null;
      if (!d.started) {
        // A tap on an open row's face closes it instead of opening whatever is under it.
        if (openRef.current && front.current?.contains(e.target as Node)) {
          suppress = true;
          close();
        } else if (s.x !== 0 && !openRef.current) settle(0);
        return;
      }
      suppress = true;
      const first = d.samples[0],
        last = d.samples[d.samples.length - 1];
      const fresh = e.timeStamp - last.t < 80 && last.t > first.t;
      release(fresh ? (last.x - first.x) / (last.t - first.t) : 0);
    };
    const cancel = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      drag = null;
      settle(
        openRef.current
          ? openRef.current === "trailing"
            ? -rail("trailing")
            : rail("leading")
          : 0,
      );
    };
    const click = (e: MouseEvent) => {
      if (!suppress) return;
      suppress = false;
      e.preventDefault();
      e.stopPropagation();
    };
    // Two-finger swipes on a trackpad move the row too; vertical scrolling is left to the page.
    const wheel = (e: WheelEvent) => {
      if (
        opts.current.disabled ||
        s.spring === "out" ||
        Math.abs(e.deltaX) <= Math.abs(e.deltaY)
      )
        return;
      e.preventDefault();
      if (!quiet) {
        s.width = surface.current?.offsetWidth ?? 0;
        cancelAnimationFrame(frame.current);
        frame.current = 0;
        s.spring = "none";
        s.v = 0;
      } else clearTimeout(quiet);
      const now = e.timeStamp;
      const dt = Math.max(8, now - wheelT);
      wheelV = wheelV * 0.6 + (-e.deltaX / dt) * 0.4;
      wheelT = now;
      follow(s.x - e.deltaX);
      quiet = setTimeout(() => {
        quiet = null;
        release(wheelV);
        wheelV = 0;
      }, 110);
    };
    const away = (e: PointerEvent) => {
      if (openRef.current && !el.contains(e.target as Node)) close();
    };
    const resize = new ResizeObserver(() => {
      s.width = el.offsetWidth;
      faceWidths.current = new WeakMap();
      if (openRef.current)
        s.x =
          openRef.current === "trailing" ? -rail("trailing") : rail("leading");
      paint();
    });
    resize.observe(el);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", cancel);
    el.addEventListener("click", click, true);
    el.addEventListener("wheel", wheel, { passive: false });
    document.addEventListener("pointerdown", away);
    paint();
    const closeMine = closeOthers.current;
    return () => {
      if (quiet) clearTimeout(quiet);
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      resize.disconnect();
      openRows.delete(closeMine);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", cancel);
      el.removeEventListener("click", click, true);
      el.removeEventListener("wheel", wheel);
      document.removeEventListener("pointerdown", away);
    };
  }, []);

  const attachSurface = React.useCallback((el: HTMLDivElement | null) => {
    surface.current = el;
  }, []);
  const attachFront = React.useCallback((el: HTMLDivElement | null) => {
    front.current = el;
  }, []);
  const attachCell = React.useCallback(
    (side: SwipeSide, i: number, el: HTMLElement | null) => {
      cells.current[side][i] = el;
    },
    [],
  );
  const attachFace = React.useCallback(
    (side: SwipeSide, i: number, el: HTMLElement | null) => {
      faces.current[side][i] = el;
    },
    [],
  );

  return {
    surface,
    front,
    cells,
    faces,
    attachSurface,
    attachFront,
    attachCell,
    attachFace,
    open,
    close,
    commit,
    restore,
    openSide: (side: SwipeSide) =>
      settle((side === "trailing" ? -1 : 1) * rail(side)),
    remeasure: () => {
      faceWidths.current = new WeakMap();
      paint();
    },
  };
}
