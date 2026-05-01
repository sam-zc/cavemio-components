"use client";

import * as React from "react";
import { HIDE_BODY, HIDE_BRANCH, HIDE_GEO as G } from "./hide-art";

/* ─────────────────────────────────────────────────────────
 * HIDE: a chameleon who blends in as a password gets stronger
 *
 * An illustrated chameleon, rigged in code. The picture never
 * changes; everything he does is computed over it:
 *
 *   blend    a front of colour change runs from his tail to his
 *            snout and leaves only his shading behind, in the
 *            stage's own colour (`camo`, 0 to 1)
 *   look     his pupil, painted out of the picture and drawn
 *            here, turns toward the caret, the pointer or a rule
 *   flick    his tongue shoots out to an element in the block,
 *            touches it and comes back; "take" carries a check
 *            home with it
 *   exposed  eye squeezed shut, cheek flushed, colour back
 *   alarm    he turns red (a breached password)
 *   startle  a hop and a tiny pupil when his cover is blown
 *
 * One frame loop outside React writes every style and sleeps
 * when nothing moves; his breathing is a compositor animation.
 * The tongue is drawn in an <svg> that covers the whole block,
 * in the block's own px.
 * ───────────────────────────────────────────────────────── */

export type Point = { x: number; y: number };

export interface HideHandle {
  /** Look at a point on screen (client px), or back down at the field with null. */
  look: (at: Point | null) => void;
  /** The tongue goes out to `target`, touches it (onTouch) and comes back; "take" brings a check back with it. */
  flick: (
    target: HTMLElement,
    kind: "give" | "take",
    onTouch: () => void,
  ) => void;
  /** Cover blown: a hop and a small pupil. */
  startle: () => void;
  /** A slow, pleased wink. */
  wink: () => void;
}

const NS = "http://www.w3.org/2000/svg";
const TRAVEL = 15; // how far the pupil moves in the eye, in image px
const REST: Point = { x: -0.3, y: 0.62 }; // looking down at the field
const SOFT = 24; // width of the colour-change front, % of the body
const ORIGIN = `50% ${((G.feet.y / G.h) * 100).toFixed(1)}%`;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);
const easeIn = (k: number) => k * k;

type Spring = { x: number; v: number };
/** One step of a spring toward its target; true once it has settled. */
function step(s: Spring, target: number, dt: number, k = 170, c = 20) {
  s.v += ((target - s.x) * k - s.v * c) * dt;
  s.x += s.v * dt;
  if (Math.abs(target - s.x) < 1e-3 && Math.abs(s.v) < 1e-3) {
    s.x = target;
    s.v = 0;
    return true;
  }
  return false;
}

/** An element's place inside `root` from layout offsets, so transforms (a hop, a breath) don't move it. */
function offsetIn(el: HTMLElement, root: Element): Point {
  let x = 0;
  let y = 0;
  for (
    let n: HTMLElement | null = el;
    n && n !== root;
    n = n.offsetParent as HTMLElement | null
  ) {
    x += n.offsetLeft;
    y += n.offsetTop;
  }
  return { x, y };
}

type Flick = {
  target: HTMLElement;
  kind: "give" | "take";
  onTouch: () => void;
  t0: number;
  touched: boolean;
  g?: SVGGElement;
  from?: Point;
  to?: Point;
  u?: number;
  fast?: boolean;
};

export class HideEngine {
  parts: Record<string, Element | null> = {};
  overlayRef: React.RefObject<SVGSVGElement | null> | null = null;
  reduced = false;
  camoT = 0;
  alarmT = 0;
  exposedT = 0;
  camo: Spring = { x: 0, v: 0 };
  alarm: Spring = { x: 0, v: 0 };
  shut: Spring = { x: 0, v: 0 };
  blush: Spring = { x: 0, v: 0 };
  lookX: Spring = { x: REST.x, v: 0 };
  lookY: Spring = { x: REST.y, v: 0 };
  hop: Spring = { x: 0, v: 0 };
  small: Spring = { x: 1, v: 0 };
  lookT: Point = REST;
  smallUntil = 0;
  winkUntil = 0;
  blinkAt = 0;
  flicks: Flick[] = [];
  breaths: Animation[] = [];
  raf = 0;
  last = 0;
  blinkTimer = 0;
  seq = 0;
  frame = (now: number) => this.tick(now);

  part = (name: string) => (el: Element | null) => {
    this.parts[name] = el;
  };

  get overlay() {
    return this.overlayRef?.current ?? null;
  }

  mount(
    overlay: React.RefObject<SVGSVGElement | null>,
    reduced: boolean,
    camo: number,
    alarm: boolean,
    exposed: boolean,
  ) {
    this.overlayRef = overlay;
    this.reduced = reduced;
    this.set(camo, alarm, exposed, true);
    this.draw(performance.now());
    this.scheduleBlink();
    if (!reduced) {
      // breathing: a slow swell from the feet, added on top of whatever the frame loop writes
      for (const name of ["color", "shimmer", "alarm", "relief", "eye"]) {
        const el = this.parts[name] as HTMLElement | null;
        const a = el?.animate(
          [{ transform: "none" }, { transform: "scale(1.005, 1.016)" }],
          {
            duration: 1800,
            iterations: Infinity,
            direction: "alternate",
            easing: "ease-in-out",
            composite: "add",
          },
        );
        if (a) this.breaths.push(a);
      }
    }
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.clearTimeout(this.blinkTimer);
    this.raf = 0;
    this.breaths.forEach((a) => a.cancel());
    this.breaths = [];
    this.flicks.forEach((f) => f.g?.remove());
    this.flicks = [];
  }

  set(camo: number, alarm: boolean, exposed: boolean, now = false) {
    this.exposedT = exposed ? 1 : 0;
    this.alarmT = alarm ? 1 : 0;
    this.camoT = exposed || alarm ? 0 : clamp(camo);
    if (now || this.reduced) {
      this.camo.x = this.camoT;
      this.alarm.x = this.alarmT;
      this.shut.x = this.blush.x = this.exposedT;
      this.camo.v = this.alarm.v = this.shut.v = this.blush.v = 0;
      this.draw(performance.now());
      return;
    }
    this.wake();
  }

  scheduleBlink() {
    window.clearTimeout(this.blinkTimer);
    this.blinkTimer = window.setTimeout(
      () => {
        this.blinkAt = performance.now();
        this.seq++;
        this.wake();
        this.scheduleBlink();
      },
      2600 + ((this.seq * 1237 + 401) % 3400),
    );
  }

  wake() {
    if (this.raf || !this.parts.rig) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  /** Where the eye is on screen. */
  eyeOnScreen(): Point | null {
    const rig = this.parts.rig as HTMLElement | null;
    if (!rig) return null;
    const r = rig.getBoundingClientRect();
    return {
      x: r.left + (G.eye.x / G.w) * r.width,
      y: r.top + (G.eye.y / G.h) * r.height,
    };
  }

  look(at: Point | null) {
    const eye = at && this.eyeOnScreen();
    if (!at || !eye) this.lookT = REST;
    else {
      const dx = at.x - eye.x;
      const dy = at.y - eye.y;
      const d = Math.hypot(dx, dy) || 1;
      const m = Math.min(1, d / 70);
      this.lookT = { x: (dx / d) * m, y: (dy / d) * m };
    }
    if (this.reduced) {
      this.lookX.x = this.lookT.x;
      this.lookY.x = this.lookT.y;
      this.draw(performance.now());
      return;
    }
    this.wake();
  }

  flick(target: HTMLElement, kind: "give" | "take", onTouch: () => void) {
    if (this.reduced || !this.overlay) {
      onTouch();
      return;
    }
    this.flicks.push({ target, kind, onTouch, t0: 0, touched: false });
    this.wake();
  }

  startle() {
    if (this.reduced) return;
    this.hop.v -= 400;
    this.smallUntil = performance.now() + 950;
    this.wake();
  }

  wink() {
    if (this.reduced) return;
    this.winkUntil = performance.now() + 620;
    this.wake();
  }

  /** The mouth and a flick's target in the overlay's px (the block's own). */
  startFlick(f: Flick, now: number) {
    const overlay = this.overlay;
    const rig = this.parts.rig as HTMLElement | null;
    const root = overlay?.parentElement;
    if (!overlay || !rig || !root) return false;
    const k = rig.offsetWidth / G.w;
    const at = offsetIn(rig, root);
    const to = offsetIn(f.target, root);
    f.from = { x: at.x + G.mouth.x * k, y: at.y + G.mouth.y * k };
    f.to = {
      x: to.x + f.target.offsetWidth / 2,
      y: to.y + f.target.offsetHeight / 2,
    };
    f.u = rig.offsetWidth / 244;
    f.fast = this.flicks.length > 1;
    f.t0 = now;
    const g = document.createElementNS(NS, "g") as SVGGElement;
    const u = f.u;
    g.innerHTML =
      `<path data-part="line" fill="none" stroke="var(--hide-tongue-line)" stroke-width="${8.6 * u}" stroke-linecap="round"/>` +
      `<path data-part="flesh" fill="none" stroke="var(--hide-tongue)" stroke-width="${5.8 * u}" stroke-linecap="round"/>` +
      `<g data-part="tip"><circle r="${7.6 * u}" fill="var(--hide-tongue-line)"/><circle r="${6 * u}" fill="var(--hide-tongue)"/><circle cx="${-2 * u}" cy="${-2.2 * u}" r="${1.8 * u}" fill="white" opacity="0.55"/>` +
      `<g data-part="check" style="opacity:0"><circle r="8" fill="var(--hide-check)"/><path d="M-3.6 0.2 -1 2.8 3.8 -2.6" fill="none" stroke="white" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></g></g>`;
    overlay.appendChild(g);
    f.g = g;
    // he looks where he aims
    const r = f.target.getBoundingClientRect();
    this.look({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    return true;
  }

  tick(now: number) {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    let busy = false;

    const f = this.flicks[0];
    if (f) {
      busy = true;
      if (!f.g && !this.startFlick(f, now)) {
        f.onTouch();
        this.flicks.shift();
      } else if (f.g && f.from && f.to) {
        const s = f.fast ? 0.72 : 1;
        const out = 150 * s;
        const hold = 70 * s;
        const back = 210 * s;
        const t = now - f.t0;
        const ext =
          t < out
            ? easeOut(t / out)
            : t < out + hold
              ? 1
              : 1 - easeIn(clamp((t - out - hold) / back));
        if (!f.touched && t >= out) {
          f.touched = true;
          f.onTouch();
          if (f.kind === "take")
            (
              f.g.querySelector('[data-part="check"]') as SVGGElement | null
            )?.style.setProperty("opacity", "1");
        }
        const tip = {
          x: f.from.x + (f.to.x - f.from.x) * ext,
          y: f.from.y + (f.to.y - f.from.y) * ext,
        };
        // a little sag while it's moving, straight at full stretch
        const len = Math.hypot(tip.x - f.from.x, tip.y - f.from.y) || 1;
        const sag =
          7 * (f.u ?? 1) * Math.sin(ext * Math.PI) * (t < out ? 1 : 0.6);
        const nx = -(tip.y - f.from.y) / len;
        const ny = (tip.x - f.from.x) / len;
        const flip = ny < 0 ? -1 : 1;
        const cx = (f.from.x + tip.x) / 2 + nx * sag * flip;
        const cy = (f.from.y + tip.y) / 2 + ny * sag * flip;
        const d = `M${f.from.x} ${f.from.y}Q${cx} ${cy} ${tip.x} ${tip.y}`;
        f.g.querySelector('[data-part="line"]')?.setAttribute("d", d);
        f.g.querySelector('[data-part="flesh"]')?.setAttribute("d", d);
        f.g
          .querySelector('[data-part="tip"]')
          ?.setAttribute("transform", `translate(${tip.x} ${tip.y})`);
        f.g.style.opacity = String(clamp(ext * 6));
        if (t >= out + hold + back) {
          f.g.remove();
          this.flicks.shift();
          // a gulp when he swallows a check he took back
          if (f.kind === "take") this.hop.v += 70;
          if (!this.flicks.length) this.lookT = REST;
        }
      }
    }

    const shutT = now < this.winkUntil ? 1 : this.exposedT;
    const fast = this.camoT < this.camo.x - 0.25;
    const settled = [
      // the colour change is slow when he blends in, quick when he's caught out
      step(this.camo, this.camoT, dt, fast ? 260 : 46, fast ? 30 : 13),
      step(this.alarm, this.alarmT, dt, 120, 18),
      step(this.shut, shutT, dt, 320, 26),
      step(this.blush, now < this.winkUntil ? 0.6 : this.exposedT, dt, 90, 16),
      step(this.lookX, this.lookT.x, dt, 260, 24),
      step(this.lookY, this.lookT.y, dt, 260, 24),
      step(this.hop, 0, dt, 300, 13),
      step(this.small, now < this.smallUntil ? 0.6 : 1, dt, 240, 20),
    ].every(Boolean);
    if (!settled || now < this.winkUntil || now < this.smallUntil) busy = true;
    if (this.blinkAt && now - this.blinkAt < 180) busy = true;
    else this.blinkAt = 0;

    this.draw(now);
    this.raf = busy ? requestAnimationFrame(this.frame) : 0;
  }

  draw(now: number) {
    const P = this.parts;
    const camo = clamp(this.camo.x);
    // the front of the colour change, as a % of the body's width, from tail (right) to snout (left)
    const e = (1 - camo) * (100 + 2 * SOFT) - SOFT;
    const show = `linear-gradient(100deg, #000 ${(e - SOFT).toFixed(2)}%, transparent ${e.toFixed(2)}%)`;
    const hide = `linear-gradient(100deg, transparent ${(e - SOFT).toFixed(2)}%, #000 ${e.toFixed(2)}%)`;
    const band = `linear-gradient(100deg, transparent ${(e - SOFT - 6).toFixed(2)}%, #000 ${(e - SOFT / 2).toFixed(2)}%, transparent ${(e + 4).toFixed(2)}%)`;
    for (const [name, mask] of [
      ["color", show],
      ["relief", hide],
      ["shimmer", band],
    ] as const) {
      const el = P[name] as HTMLElement | null;
      if (!el) continue;
      el.style.setProperty("mask-image", mask);
      el.style.setProperty("-webkit-mask-image", mask);
    }
    const alarm = clamp(this.alarm.x);
    (P.shimmer as HTMLElement | null)?.style.setProperty(
      "opacity",
      String(clamp(Math.abs(this.camo.v) * 1.6) * (1 - alarm)),
    );
    (P.alarm as HTMLElement | null)?.style.setProperty(
      "opacity",
      String(alarm),
    );

    // the hop, squashing toward his feet as he lands
    const sq = clamp(this.hop.v * 0.00028, -0.05, 0.05);
    const t = `translate(0px, ${this.hop.x.toFixed(2)}px) scale(${(1 + sq * 0.6).toFixed(4)}, ${(1 - sq).toFixed(4)})`;
    for (const name of ["color", "shimmer", "alarm", "relief", "eye"])
      (P[name] as HTMLElement | null)?.style.setProperty("transform", t);

    // the eye: a pupil that looks around, blinks, squeezes shut
    const lx = this.lookX.x;
    const ly = this.lookY.x;
    const m = Math.min(1, Math.hypot(lx, ly));
    const a = (Math.atan2(ly, lx) * 180) / Math.PI;
    const px = G.eye.x + lx * TRAVEL;
    const py = G.eye.y + ly * TRAVEL;
    const blink = this.blinkAt
      ? Math.sin(clamp((now - this.blinkAt) / 170) * Math.PI)
      : 0;
    const shut = clamp(this.shut.x);
    const open = Math.max(0.05, 1 - blink) * (1 - shut);
    const s = this.small.x;
    P.pupil?.setAttribute(
      "transform",
      `translate(${px.toFixed(2)} ${py.toFixed(2)}) rotate(${a.toFixed(1)}) scale(${(s * (1 - 0.2 * m)).toFixed(3)} ${s.toFixed(3)}) rotate(${(-a).toFixed(1)}) scale(1 ${open.toFixed(3)})`,
    );
    P.glint?.setAttribute(
      "transform",
      `translate(${(px - 4.6 * s).toFixed(2)} ${(py - 5.4 * s).toFixed(2)}) scale(${(s * open).toFixed(3)})`,
    );
    P.slit?.setAttribute(
      "transform",
      `translate(${px.toFixed(2)} ${py.toFixed(2)})`,
    );
    (P.slit as SVGElement | null)?.style.setProperty(
      "opacity",
      String(clamp(blink * 1.4) * (1 - shut)),
    );
    (P.shut as SVGElement | null)?.style.setProperty("opacity", String(shut));
    (P.blush as SVGElement | null)?.style.setProperty(
      "opacity",
      String(clamp(this.blush.x) * 0.85),
    );
  }
}

export function Hide({
  camo,
  alarm = false,
  exposed = false,
  reduced,
  overlay,
  ref,
  className = "",
}: {
  /** How well he blends in: 0 in full colour, 1 gone but for his eye. */
  camo: number;
  /** Red all over (a breached password). */
  alarm?: boolean;
  /** Eye shut, cheek flushed, colour back (the password is showing). */
  exposed?: boolean;
  reduced: boolean;
  /** The block-wide <svg> his tongue is drawn in. */
  overlay: React.RefObject<SVGSVGElement | null>;
  ref?: React.Ref<HideHandle>;
  className?: string;
}) {
  const [engine] = React.useState(() => new HideEngine());
  const uid = React.useId().replace(/[^a-z0-9]/gi, "");

  React.useLayoutEffect(() => {
    engine.mount(overlay, reduced, camo, alarm, exposed);
    return () => engine.destroy();
    // mounted once per reduced-motion setting; the rest arrives through set() below
  }, [engine, overlay, reduced]);

  React.useEffect(() => {
    engine.set(camo, alarm, exposed);
  }, [engine, camo, alarm, exposed]);

  React.useImperativeHandle(
    ref,
    () => ({
      look: (at) => engine.look(at),
      flick: (target, kind, onTouch) => engine.flick(target, kind, onTouch),
      startle: () => engine.startle(),
      wink: () => engine.wink(),
    }),
    [engine],
  );

  const layer =
    "pointer-events-none absolute inset-0 size-full max-w-none select-none";
  const origin = { transformOrigin: ORIGIN };
  return (
    <div
      aria-hidden="true"
      className={`relative w-full ${className}`}
      // his width: 244px, or less on a narrow block; everything else is measured from it
      style={
        {
          "--hw": "min(244px, 78cqw)",
          height: "calc(var(--hw) * 0.54 + 44px)",
        } as React.CSSProperties
      }
    >
      {/* the branch runs the width of the stage and out of it */}

      <img
        src={HIDE_BRANCH}
        alt=""
        draggable={false}
        className="pointer-events-none absolute inset-x-0 w-full max-w-none select-none"
        style={{
          top: `calc(30px + var(--hw) * ${(G.branch.y / G.w).toFixed(4)})`,
          height: `calc(var(--hw) * ${(G.branch.h / G.w).toFixed(4)})`,
        }}
      />
      <div
        ref={engine.part("rig")}
        className="absolute"
        style={{
          left: "calc(50% - var(--hw) / 2 + 10px)",
          top: 30,
          width: "var(--hw)",
          aspectRatio: `${G.w} / ${G.h}`,
        }}
      >
        {/* in colour, wiped away from the tail as he blends in */}

        <img
          ref={engine.part("color")}
          src={HIDE_BODY}
          alt=""
          draggable={false}
          className={layer}
          style={origin}
        />
        {/* the front of the change, a little brighter as it passes */}

        <img
          ref={engine.part("shimmer")}
          src={HIDE_BODY}
          alt=""
          draggable={false}
          className={layer}
          style={{
            ...origin,
            opacity: 0,
            filter: "brightness(1.28) saturate(1.35)",
          }}
        />
        {/* what's left once he's blended in: his shading, in the stage's colour */}

        <img
          ref={engine.part("relief")}
          src={HIDE_BODY}
          alt=""
          draggable={false}
          className={layer}
          style={{
            ...origin,
            opacity: 0.5,
            filter: "grayscale(1)",
            mixBlendMode: "soft-light",
          }}
        />
        {/* red all over when his cover is blown for good */}

        <img
          ref={engine.part("alarm")}
          src={HIDE_BODY}
          alt=""
          draggable={false}
          className={layer}
          style={{
            ...origin,
            opacity: 0,
            filter: "hue-rotate(-96deg) saturate(1.45) brightness(0.98)",
          }}
        />
        <svg
          ref={engine.part("eye")}
          viewBox={`0 0 ${G.w} ${G.h}`}
          className={`${layer} overflow-visible`}
          style={origin}
        >
          <defs>
            <radialGradient id={`${uid}-blush`}>
              <stop
                offset="0"
                stopColor="var(--hide-blush)"
                stopOpacity="0.9"
              />
              <stop offset="1" stopColor="var(--hide-blush)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse
            ref={engine.part("blush")}
            cx={G.cheek.x}
            cy={G.cheek.y}
            rx="17"
            ry="9"
            fill={`url(#${uid}-blush)`}
            style={{ opacity: 0 }}
          />
          <g ref={engine.part("pupil")}>
            <ellipse rx={G.pupil.rx} ry={G.pupil.ry} fill="var(--hide-pupil)" />
          </g>
          <circle
            ref={engine.part("glint")}
            r="3.6"
            fill="white"
            opacity="0.95"
          />
          <path
            ref={engine.part("slit")}
            d="M-13 0 Q0 4 13 0"
            fill="none"
            stroke="var(--hide-pupil)"
            strokeWidth="3.2"
            strokeLinecap="round"
            style={{ opacity: 0 }}
          />
          {/* squeezed shut: a tight arc with two creases */}
          <g
            ref={engine.part("shut")}
            transform={`translate(${G.eye.x - 4} ${G.eye.y + 2})`}
            fill="none"
            stroke="var(--hide-pupil)"
            strokeWidth="3.4"
            strokeLinecap="round"
            style={{ opacity: 0 }}
          >
            <path d="M-15 4 Q-2 -9 13 3" />
            <path d="M16 -3 L22 -7 M17 4 L24 4" strokeWidth="2.6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default Hide;
