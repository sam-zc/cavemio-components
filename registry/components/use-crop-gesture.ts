"use client";

import * as React from "react";

/* ─────────────────────────────────────────────────────────
 * CROP GESTURE: a photo you hold, not a box you drag
 *
 *   pan       the photo follows the finger exactly; past an
 *             edge it resists more the further it goes, the way
 *             iOS Photos does, so the crop never shows a gap
 *   pinch     two fingers zoom about the point between them;
 *             wheel and trackpad pinch zoom about the pointer;
 *             below the fit or past the limit it resists too
 *   release   it keeps the speed you let go with and slows
 *             down; anything out of bounds springs back,
 *             critically damped, carrying that speed
 *   rotate    quarter turns, and the bounds re-solve so the
 *             photo still covers the crop
 *
 * One frame loop with fixed 4ms steps, writing transforms to
 * three nested layers (pan, zoom, rotate) and sleeping the
 * moment everything is still. React hears about it once, when
 * it settles. Layers are promoted only while they move, so the
 * photo re-rasterises sharp at its new size.
 * ───────────────────────────────────────────────────────── */

export type CropState = { x: number; y: number; z: number; r: number };
/** The crop in the photo's own pixels: its centre, the side of the square, and the quarter turns applied (degrees). */
export type CropArea = {
  centerX: number;
  centerY: number;
  size: number;
  rotation: number;
};

type Options = {
  /** Side of the crop region at full size, px. */
  size: number;
  /** Natural size of the photo. */
  image: { w: number; h: number } | null;
  maxZoom: number;
  reduced: boolean;
  /** Called once a gesture, wheel, key or spring has settled. */
  onSettle?: (state: CropState) => void;
  refs: {
    pan: React.RefObject<HTMLDivElement | null>;
    zoom: React.RefObject<HTMLDivElement | null>;
    rot: React.RefObject<HTMLDivElement | null>;
    slider: React.RefObject<HTMLInputElement | null>;
    grid: React.RefObject<SVGGElement | null>;
    stage: React.RefObject<HTMLDivElement | null>;
  };
};

import {
  EASE_SETTLE,
  rubberBand,
  softenVelocity,
} from "./imported-ui-interaction-motion";

type Vec = { x: number; y: number };

const K = 260; // spring stiffness, 1/s²
const C = 2 * 0.76 * Math.sqrt(K); // organic damping (zeta ~0.76 with 3% settling breath)
const FRICTION = 4.2; // momentum decay, 1/s
const STEP = 4; // ms
const THROW = EASE_SETTLE;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
/** Resistance past an edge: the further over, the less it gives (iOS's 0.55 constant). */
const band = (over: number, dim: number) => rubberBand(over, dim, 0.55);
/** The raw overshoot that shows as `shown` once banded, so a gesture can start from a photo that's mid-spring. */
const unband = (shown: number, dim: number) => {
  const u = Math.min(0.95, Math.abs(shown) / dim);
  return Math.sign(shown) * (1 / (1 - u) - 1) * (dim / 0.55);
};

export function useCropGesture(o: Options) {
  const opts = React.useRef(o);
  React.useLayoutEffect(() => {
    opts.current = o;
  });

  const state = React.useRef<CropState>({ x: 0, y: 0, z: 1, r: 0 });
  const vel = React.useRef({ x: 0, y: 0, z: 0 });
  const goal = React.useRef<Partial<CropState> | null>(null);
  const loop = React.useRef(0);
  const lastFrame = React.useRef(0);
  const pointers = React.useRef(new Map<number, Vec>());
  const hold = React.useRef<{
    x: number;
    y: number;
    z: number;
    mid: Vec;
    dist: number;
  } | null>(null);
  const samples = React.useRef<{ x: number; y: number; t: number }[]>([]);
  const wheelTimer = React.useRef(0);

  /** How far the photo may move each way at zoom z and rotation r before it would uncover the crop. */
  const limits = (z: number, r: number): Vec => {
    const { image: img, size: d } = opts.current;
    if (!img) return { x: 0, y: 0 };
    const cover = d / Math.min(img.w, img.h);
    const w = (r % 2 ? img.h : img.w) * cover * z;
    const h = (r % 2 ? img.w : img.h) * cover * z;
    return { x: Math.max(0, (w - d) / 2), y: Math.max(0, (h - d) / 2) };
  };

  const promote = (on: boolean) => {
    for (const el of [
      opts.current.refs.pan.current,
      opts.current.refs.zoom.current,
    ])
      if (el) el.style.willChange = on ? "transform" : "";
    if (opts.current.refs.grid.current)
      opts.current.refs.grid.current.style.opacity =
        on && hold.current ? "1" : "0";
  };

  const write = () => {
    const s = state.current;
    if (opts.current.refs.pan.current)
      opts.current.refs.pan.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
    if (opts.current.refs.zoom.current)
      opts.current.refs.zoom.current.style.transform = `scale(${s.z})`;
    const input = opts.current.refs.slider.current;
    if (input && document.activeElement !== input)
      input.value = String(clamp(s.z, 1, opts.current.maxZoom));
  };

  const settle = React.useCallback(() => {
    cancelAnimationFrame(loop.current);
    loop.current = 0;
    vel.current = { x: 0, y: 0, z: 0 };
    goal.current = null;
    promote(false);
    opts.current.onSettle?.({ ...state.current });
  }, []);

  const tick = (now: number) => {
    const dt = Math.min(48, now - (lastFrame.current || now - 16));
    lastFrame.current = now;
    const s = state.current;
    const v = vel.current;
    const { maxZoom: max } = opts.current;
    const steps = Math.max(1, Math.round(dt / STEP));
    const h = dt / steps / 1000;
    for (let i = 0; i < steps; i++) {
      const zTo = clamp(goal.current?.z ?? s.z, 1, max);
      v.z += (-K * (s.z - zTo) - C * v.z) * h;
      s.z += v.z * h;
      const lim = limits(s.z, s.r);
      for (const axis of ["x", "y"] as const) {
        const target = goal.current?.[axis];
        const bound = lim[axis];
        if (target !== undefined || Math.abs(s[axis]) > bound) {
          // A goal (keys, rotation) or out of bounds: spring there, keeping whatever speed it has.
          const to = clamp(target ?? s[axis], -bound, bound);
          v[axis] += (-K * (s[axis] - to) - C * v[axis]) * h;
        } else v[axis] *= Math.exp(-FRICTION * h);
        s[axis] += v[axis] * h;
      }
    }
    write();
    const lim = limits(s.z, s.r);
    const zTo = clamp(goal.current?.z ?? s.z, 1, max);
    const still =
      Math.abs(v.x) < 4 &&
      Math.abs(v.y) < 4 &&
      Math.abs(v.z) < 0.01 &&
      Math.abs(s.z - zTo) < 0.0008 &&
      Math.abs(s.x) <= lim.x + 0.3 &&
      Math.abs(s.y) <= lim.y + 0.3 &&
      (goal.current?.x === undefined ||
        Math.abs(s.x - clamp(goal.current.x, -lim.x, lim.x)) < 0.3) &&
      (goal.current?.y === undefined ||
        Math.abs(s.y - clamp(goal.current.y, -lim.y, lim.y)) < 0.3);
    if (still) {
      s.z = zTo;
      const end = limits(s.z, s.r);
      s.x = clamp(goal.current?.x ?? s.x, -end.x, end.x);
      s.y = clamp(goal.current?.y ?? s.y, -end.y, end.y);
      write();
      settle();
      return;
    }
    loop.current = requestAnimationFrame(tick);
  };

  const run = () => {
    if (opts.current.reduced) {
      // No springs: land where it would have, at once.
      const s = state.current;
      s.z = clamp(goal.current?.z ?? s.z, 1, opts.current.maxZoom);
      const lim = limits(s.z, s.r);
      s.x = clamp(goal.current?.x ?? s.x, -lim.x, lim.x);
      s.y = clamp(goal.current?.y ?? s.y, -lim.y, lim.y);
      write();
      settle();
      return;
    }
    promote(true);
    if (!loop.current) {
      lastFrame.current = 0;
      loop.current = requestAnimationFrame(tick);
    }
  };

  const stop = () => {
    cancelAnimationFrame(loop.current);
    loop.current = 0;
  };

  React.useEffect(() => () => cancelAnimationFrame(loop.current), []);

  // ── Pointers ───────────────────────────────────────────
  const centre = (p: Vec): Vec => {
    const r = opts.current.refs.stage.current!.getBoundingClientRect();
    return { x: p.x - (r.left + r.width / 2), y: p.y - (r.top + r.height / 2) };
  };
  const midpoint = (): { mid: Vec; dist: number } => {
    const ps = [...pointers.current.values()];
    if (ps.length < 2) return { mid: centre(ps[0]), dist: 0 };
    return {
      mid: centre({ x: (ps[0].x + ps[1].x) / 2, y: (ps[0].y + ps[1].y) / 2 }),
      dist: Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y),
    };
  };
  /** Start (or restart, when a finger joins or leaves) from what's shown, unbanded so nothing jumps. */
  const begin = () => {
    const s = state.current;
    const { maxZoom: max } = opts.current;
    const z =
      s.z < 1
        ? 1 - (1 - s.z) / 0.35
        : s.z > max
          ? max + (s.z - max) / 0.3
          : s.z;
    const lim = limits(s.z, s.r);
    const d = opts.current.size;
    const raw = (p: number, bound: number) =>
      Math.abs(p) > bound
        ? Math.sign(p) * bound + unband(p - Math.sign(p) * bound, d)
        : p;
    const { mid, dist } = midpoint();
    hold.current = { x: raw(s.x, lim.x), y: raw(s.y, lim.y), z, mid, dist };
    samples.current = [];
  };

  const follow = () => {
    const g = hold.current;
    if (!g) return;
    const s = state.current;
    const { maxZoom: max, size: d } = opts.current;
    const { mid, dist } = midpoint();
    let z = g.z;
    let x = g.x + (mid.x - g.mid.x);
    let y = g.y + (mid.y - g.mid.y);
    if (pointers.current.size > 1 && g.dist > 0) {
      z = g.z * (dist / g.dist);
      // The point of the photo that was under the fingers stays under them.
      x = mid.x - (g.mid.x - g.x) * (z / g.z);
      y = mid.y - (g.mid.y - g.y) * (z / g.z);
    }
    s.z =
      z < 1
        ? Math.max(0.6, 1 - (1 - z) * 0.35)
        : z > max
          ? max + (z - max) * 0.3
          : z;
    const lim = limits(s.z, s.r);
    s.x =
      Math.abs(x) > lim.x
        ? Math.sign(x) * lim.x + band(x - Math.sign(x) * lim.x, d)
        : x;
    s.y =
      Math.abs(y) > lim.y
        ? Math.sign(y) * lim.y + band(y - Math.sign(y) * lim.y, d)
        : y;
    write();
    const t = performance.now();
    samples.current.push({ x: s.x, y: s.y, t });
    while (samples.current.length > 2 && t - samples.current[0].t > 90)
      samples.current.shift();
  };

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (!opts.current.image || (e.pointerType === "mouse" && e.button !== 0))
      return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    // Catch it mid-flight: whatever was moving stops under the finger.
    stop();
    vel.current = { x: 0, y: 0, z: 0 };
    goal.current = null;
    begin();
    promote(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    follow();
  };
  const onPointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (!pointers.current.delete(e.pointerId)) return;
    if (pointers.current.size) return begin();
    const ss = samples.current;
    const first = ss[0];
    const last = ss[ss.length - 1];
    const fresh = last && performance.now() - last.t < 80 && last.t > first.t;
    if (fresh) {
      let vx = ((last.x - first.x) / (last.t - first.t)) * 1000;
      let vy = ((last.y - first.y) / (last.t - first.t)) * 1000;
      const lim = limits(state.current.z, state.current.r);
      if (state.current.x > lim.x && vx > 0) vx = softenVelocity(vx, 0, 8);
      else if (state.current.x < -lim.x && vx < 0)
        vx = softenVelocity(vx, 0, 8);
      if (state.current.y > lim.y && vy > 0) vy = softenVelocity(vy, 0, 8);
      else if (state.current.y < -lim.y && vy < 0)
        vy = softenVelocity(vy, 0, 8);
      vel.current = { x: vx, y: vy, z: 0 };
    } else {
      vel.current = { x: 0, y: 0, z: 0 };
    }
    hold.current = null;
    run();
  };

  // Wheel and trackpad pinch zoom about the pointer. Not passive: the page shouldn't scroll under the photo.
  React.useEffect(() => {
    const el = opts.current.refs.stage.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!opts.current.image) return;
      e.preventDefault();
      stop();
      const s = state.current;
      const { maxZoom: max } = opts.current;
      const z0 = s.z;
      const z1 = clamp(
        z0 * Math.exp(-e.deltaY * (e.ctrlKey ? 0.012 : 0.0016)),
        1,
        max,
      );
      const p = centre({ x: e.clientX, y: e.clientY });
      const lim = limits(z1, s.r);
      s.x = clamp(p.x - (p.x - s.x) * (z1 / z0), -lim.x, lim.x);
      s.y = clamp(p.y - (p.y - s.y) * (z1 / z0), -lim.y, lim.y);
      s.z = z1;
      promote(true);
      write();
      window.clearTimeout(wheelTimer.current);
      wheelTimer.current = window.setTimeout(settle, 160);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(wheelTimer.current);
    };
  }, [o.image, settle]);

  // ── Commands ───────────────────────────────────────────
  /** Zoom to z about the centre at once (the slider). Call settle() yourself when the slider lets go. */
  const zoomTo = (z: number) => {
    stop();
    const s = state.current;
    const z1 = clamp(z, 1, opts.current.maxZoom);
    const lim = limits(z1, s.r);
    s.x = clamp(s.x * (z1 / s.z), -lim.x, lim.x);
    s.y = clamp(s.y * (z1 / s.z), -lim.y, lim.y);
    s.z = z1;
    promote(true);
    write();
  };

  /** Glide by a step (keys, buttons): the spring takes it there and it settles. */
  const nudge = (dx: number, dy: number) => {
    const s = state.current;
    goal.current = {
      x: (goal.current?.x ?? s.x) + dx,
      y: (goal.current?.y ?? s.y) + dy,
      z: goal.current?.z ?? s.z,
    };
    run();
  };
  const zoomBy = (factor: number) => {
    const s = state.current;
    const z0 = goal.current?.z ?? s.z;
    const z1 = clamp(z0 * factor, 1, opts.current.maxZoom);
    goal.current = {
      x: (goal.current?.x ?? s.x) * (z1 / z0),
      y: (goal.current?.y ?? s.y) * (z1 / z0),
      z: z1,
    };
    run();
  };

  /** A quarter turn clockwise, thrown with a slight overshoot; the photo then springs inside the new bounds. */
  const rotate = () => {
    const s = state.current;
    const from = s.r * 90;
    s.r += 1;
    const el = opts.current.refs.rot.current;
    if (el) {
      el.style.transform = `rotate(${s.r * 90}deg)`;
      if (!opts.current.reduced)
        el.animate(
          [
            { transform: `rotate(${from}deg)` },
            { transform: `rotate(${s.r * 90}deg)` },
          ],
          { duration: 480, easing: THROW },
        );
    }
    goal.current = { x: s.x, y: s.y, z: s.z };
    run();
  };

  /** Back to the fit for a new photo. */
  const reset = () => {
    stop();
    state.current = { x: 0, y: 0, z: 1, r: 0 };
    vel.current = { x: 0, y: 0, z: 0 };
    goal.current = null;
    if (opts.current.refs.rot.current)
      opts.current.refs.rot.current.style.transform = "rotate(0deg)";
    write();
  };

  /** Where the crop sits in the photo's own pixels. */
  const area = (): CropArea | null => {
    const { image: img, size: d } = opts.current;
    if (!img) return null;
    const s = state.current;
    const k = (d / Math.min(img.w, img.h)) * s.z;
    const turn = ((s.r % 4) + 4) % 4;
    const a = (-turn * Math.PI) / 2;
    // The crop's centre relative to the photo's centre, on screen, turned back into the photo's own frame.
    const dx = -s.x;
    const dy = -s.y;
    const ux = (dx * Math.cos(a) - dy * Math.sin(a)) / k;
    const uy = (dx * Math.sin(a) + dy * Math.cos(a)) / k;
    return {
      centerX: img.w / 2 + ux,
      centerY: img.h / 2 + uy,
      size: d / k,
      rotation: turn * 90,
    };
  };

  /** Draws the crop into a square canvas of `output` px and encodes it. */
  const toBlob = async (
    img: HTMLImageElement,
    output: number,
    type: string,
    quality: number,
  ): Promise<Blob> => {
    const { image: dims, size: d } = opts.current;
    if (!dims) throw new Error("No photo");
    const s = state.current;
    const canvas = document.createElement("canvas");
    canvas.width = output;
    canvas.height = output;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No canvas");
    const k = (d / Math.min(dims.w, dims.h)) * s.z;
    ctx.imageSmoothingQuality = "high";
    ctx.translate(output / 2, output / 2);
    ctx.scale(output / d, output / d);
    ctx.translate(s.x, s.y);
    ctx.rotate((s.r * Math.PI) / 2);
    ctx.scale(k, k);
    ctx.drawImage(img, -dims.w / 2, -dims.h / 2, dims.w, dims.h);
    return new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) =>
          b ? resolve(b) : reject(new Error("Couldn't encode the photo")),
        type,
        quality,
      ),
    );
  };

  return {
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
    state: () => ({ ...state.current }),
    zoomTo,
    settle,
    nudge,
    zoomBy,
    rotate,
    reset,
    area,
    toBlob,
  };
}
