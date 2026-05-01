"use client";

import * as React from "react";
import { CRUMB_ART as ART, CRUMB_FRAMES as F } from "./crumb-art";

/* ─────────────────────────────────────────────────────────
 * CRUMB: a bread bun who eats the cookies you allow
 *
 * Crumb is animated, not posed: three short eating clips cut
 * into frames (hungry → content → full → stuffed), played in
 * code.
 *
 *   hungry   nothing allowed yet: pleading eyes, hands clasped
 *   feed     a cookie arcs from a switch into his hands; the
 *            next clip takes over from the frame where it's
 *            there, and he eats it bite by bite, crumbs falling,
 *            chews and ends a little fuller
 *   give     a switch off: the bitten cookie flies back to its
 *            switch and he eases back to how full he was before
 *   wave     a happy hop once the choices are saved
 *
 * Cookies fly in an <svg> overlay that covers the whole block,
 * in the block's own px. One frame loop outside React flies
 * them, steps the frames and sleeps when he's still.
 * ───────────────────────────────────────────────────────── */

export type Point = { x: number; y: number };

export interface CrumbHandle {
  /** A cookie flies from `from` (block px) into his hands, and he eats it. */
  feed: (from: Point, delay?: number) => void;
  /** A bitten cookie flies from him back to `to` (block px). */
  giveBack: (to: Point, delay?: number) => void;
  /** A happy hop, e.g. once the choices are saved. */
  wave: () => void;
}

const TALL = 130; // px on the stage
const K = TALL / F.h;
const WIDE = F.w * K;
const NS = "http://www.w3.org/2000/svg";
const STEP = 1000 / F.fps;

const ease = (k: number) => 1 - Math.pow(1 - k, 3);
const inOut = (k: number) =>
  k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Which clip eats the cookie that brings him to `fed` of `total`, so any number of categories ends stuffed. */
const clipFor = (fed: number, total: number) =>
  Math.min(2, Math.max(0, Math.floor((fed / Math.max(1, total)) * 3 - 1e-3)));
/** The still he rests on with `fed` of `total` eaten: [strip, frame]. */
const restFor = (fed: number, total: number): [number, number] =>
  fed <= 0 ? [0, 0] : [clipFor(fed, total), F.count - 1];

type Spring = { x: number; v: number };
function step(s: Spring, target: number, dt: number, k = 170, c = 18) {
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

type Flight = {
  dir: 1 | -1;
  a: Point;
  b: Point;
  t0: number;
  dur: number;
  el: SVGGElement;
  done: boolean;
  clip: number;
};

export class CrumbEngine {
  parts: Record<string, Element | null> = {};
  overlayRef: React.RefObject<SVGSVGElement | null> | null = null;
  reduced = false;
  fed = 0;
  total = 3;
  /** His own count: feeds and give-backs move it at once, before the block's count re-renders. */
  count = 0;
  /** What's on screen: a strip and a frame, and the one fading out under it. */
  shown: [number, number] = [0, 0];
  under: [number, number] | null = null;
  fadeAt = 0;
  /** Clips waiting to play (a cookie in his hands each), and the one playing. */
  queue: number[] = [];
  playing: { clip: number; t0: number } | null = null;
  flights: Flight[] = [];
  hop: Spring = { x: 0, v: 0 };
  lean: Spring = { x: 0, v: 0 };
  breath: Animation | null = null;
  raf = 0;
  last = 0;
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
    fed: number,
    total: number,
  ) {
    this.overlayRef = overlay;
    this.reduced = reduced;
    this.fed = fed;
    this.total = total;
    this.count = fed;
    this.shown = restFor(fed, total);
    // decode the clips up front, so the first frame of each is there the moment a cookie lands
    for (const src of ART.strips) {
      const img = new Image();
      img.src = src;
      void img.decode?.().catch(() => {});
    }
    if (!reduced) {
      this.breath =
        (this.parts.breathe as HTMLElement | null)?.animate(
          [{ transform: "none" }, { transform: "scale(1.012, 1.022)" }],
          {
            duration: 1500,
            iterations: Infinity,
            direction: "alternate",
            easing: "ease-in-out",
          },
        ) ?? null;
    }
    this.draw(performance.now());
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.breath?.cancel();
    this.flights.forEach((f) => f.el.remove());
    this.flights = [];
  }

  /** The count changed; feeds and give-backs bring their own motion, so this only settles where he rests. */
  setTarget(fed: number, total: number) {
    this.fed = fed;
    this.total = total;
    const busy = this.playing || this.queue.length || this.flights.length;
    if (!busy) this.count = fed;
    if (this.reduced) {
      this.show(restFor(fed, total), false);
      return;
    }
    if (!busy) this.show(restFor(fed, total), true);
  }

  wake() {
    if (this.raf || !this.parts.bun) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  /** Where the cookie sits in his hands, in block px. */
  hands(): Point {
    const bun = this.parts.bun as HTMLElement | null;
    const root = this.overlay?.parentElement;
    if (!bun || !root) return { x: 0, y: 0 };
    const at = offsetIn(bun, root);
    return { x: at.x + WIDE * F.hands.x, y: at.y + TALL * F.hands.y };
  }

  fly(dir: 1 | -1, p: Point, delay: number) {
    const overlay = this.overlay;
    this.count = clamp(this.count + dir, 0, this.total);
    // the clip that eats this cookie
    const clip = clipFor(this.count, this.total);
    if (this.reduced || !overlay) {
      this.show(restFor(this.count, this.total), false);
      return;
    }
    const now = performance.now();
    const size = WIDE * F.hands.size;
    const el = document.createElementNS(NS, "g") as SVGGElement;
    const img = document.createElementNS(NS, "image");
    img.setAttribute("href", dir === 1 ? ART.cookie : ART.bitten);
    img.setAttribute("width", String(size));
    img.setAttribute("height", String(size));
    img.setAttribute("x", String(-size / 2));
    img.setAttribute("y", String(-size / 2));
    el.appendChild(img);
    el.style.opacity = "0";
    overlay.appendChild(el);
    const at = this.hands();
    this.flights.push(
      dir === 1
        ? { dir, a: p, b: at, t0: now + delay, dur: 620, el, done: false, clip }
        : {
            dir,
            a: at,
            b: p,
            t0: now + delay,
            dur: 640,
            el,
            done: false,
            clip,
          },
    );
    if (dir === -1) {
      // he lets it go and eases back to how full he was
      this.hop.v -= 40;
      const count = this.count;
      window.setTimeout(
        () => !this.playing && this.show(restFor(count, this.total), true),
        delay + 120,
      );
    }
    this.wake();
  }

  wave() {
    if (this.reduced) return;
    this.hop.v -= 260;
    this.wake();
  }

  /** Put a still on screen, cross-fading from the last one when it changes. */
  show(next: [number, number], fade: boolean) {
    if (next[0] === this.shown[0] && next[1] === this.shown[1]) return;
    this.under = fade && !this.reduced ? this.shown : null;
    this.fadeAt = performance.now();
    this.shown = next;
    this.draw(this.fadeAt);
    if (this.under) this.wake();
  }

  tick(now: number) {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    let busy = false;
    let lean = 0;

    for (const f of this.flights) {
      busy = true;
      if (now < f.t0) continue;
      const k = clamp((now - f.t0) / f.dur);
      const e = f.dir === 1 ? ease(k) : inOut(k);
      const mx = (f.a.x + f.b.x) / 2;
      const my = Math.min(f.a.y, f.b.y) - (f.dir === 1 ? 64 : 50);
      const x =
        (1 - e) * (1 - e) * f.a.x + 2 * (1 - e) * e * mx + e * e * f.b.x;
      const y =
        (1 - e) * (1 - e) * f.a.y + 2 * (1 - e) * e * my + e * e * f.b.y;
      const spin = f.dir === 1 ? 300 * (1 - e) : -240 * e;
      const scale = f.dir === 1 ? 0.6 + 0.4 * clamp(k / 0.25) : 1 - 0.1 * k;
      f.el.setAttribute(
        "transform",
        `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${spin.toFixed(1)}) scale(${scale.toFixed(3)})`,
      );
      f.el.style.opacity = String(
        f.dir === 1 ? 1 : 1 - clamp((k - 0.85) / 0.15),
      );
      if (f.dir === 1) lean = clamp((x - f.b.x) / 140, -1, 1) * (1 - k);
      if (k >= 1) {
        f.done = true;
        f.el.remove();
        // caught: the clip takes over from the frame with the cookie in his hands
        if (f.dir === 1) {
          this.queue.push(f.clip);
          this.hop.v += 60;
        }
      }
    }
    this.flights = this.flights.filter((f) => !f.done);

    if (!this.playing && this.queue.length) {
      this.playing = { clip: this.queue.shift()!, t0: now };
      this.under = null;
    }
    if (this.playing) {
      busy = true;
      const i = 1 + Math.floor((now - this.playing.t0) / STEP);
      if (i >= F.count) {
        this.shown = [this.playing.clip, F.count - 1];
        this.playing = null;
        // nothing else to eat: settle where the count says (a switch may have gone off meanwhile)
        if (!this.queue.length && !this.flights.some((f) => f.dir === 1))
          this.show(restFor(this.count, this.total), true);
      } else this.shown = [this.playing.clip, i];
    }

    const fading = this.under !== null && now - this.fadeAt < 280;
    if (!fading) this.under = null;
    const settled = [
      step(this.hop, 0, dt, 300, 14),
      step(this.lean, lean, dt, 220, 20),
    ].every(Boolean);
    if (!settled || fading) busy = true;

    this.draw(now);
    this.raf = busy ? requestAnimationFrame(this.frame) : 0;
  }

  paint(el: HTMLElement | null, at: [number, number] | null, opacity: number) {
    if (!el) return;
    if (!at) {
      el.style.opacity = "0";
      return;
    }
    const image = `url("${ART.strips[at[0]]}")`;
    if (el.dataset.strip !== String(at[0])) {
      el.dataset.strip = String(at[0]);
      el.style.backgroundImage = image;
    }
    el.style.backgroundPosition = `${(-at[1] * WIDE).toFixed(2)}px 0px`;
    el.style.opacity = String(opacity);
  }

  draw(now: number) {
    const bun = this.parts.bun as HTMLElement | null;
    if (!bun) return;
    const fade = this.under ? clamp((now - this.fadeAt) / 260) : 1;
    this.paint(this.parts.front as HTMLElement | null, this.shown, fade);
    this.paint(this.parts.back as HTMLElement | null, this.under, 1);
    const squash = clamp(this.hop.v * 0.0005, -0.05, 0.05);
    bun.style.transform = `translateY(${(this.hop.x * 0.05).toFixed(2)}px) rotate(${(this.lean.x * 4).toFixed(2)}deg) scale(${(1 + squash * 0.6).toFixed(4)}, ${(1 - squash).toFixed(4)})`;
  }
}

export function Crumb({
  fed,
  total,
  reduced,
  overlay,
  ref,
}: {
  /** Cookies eaten so far. */
  fed: number;
  /** Cookies there are to eat. */
  total: number;
  reduced: boolean;
  /** The block-wide <svg> the cookies fly in. */
  overlay: React.RefObject<SVGSVGElement | null>;
  /** Kept for compatibility; Crumb measures himself. */
  stage?: React.RefObject<HTMLElement | null>;
  ref?: React.Ref<CrumbHandle>;
}) {
  const [engine] = React.useState(() => new CrumbEngine());

  React.useLayoutEffect(() => {
    engine.mount(overlay, reduced, fed, total);
    return () => engine.destroy();
    // mounted once per reduced-motion setting; fed/total arrive through setTarget below
  }, [engine, overlay, reduced]);

  React.useEffect(() => {
    engine.setTarget(fed, total);
  }, [engine, fed, total]);

  React.useImperativeHandle(
    ref,
    () => ({
      feed: (p, d = 0) => engine.fly(1, p, d),
      giveBack: (p, d = 0) => engine.fly(-1, p, d),
      wave: () => engine.wave(),
    }),
    [engine],
  );

  const layer: React.CSSProperties = {
    backgroundSize: `${(F.count * WIDE).toFixed(2)}px ${TALL}px`,
    backgroundRepeat: "no-repeat",
  };
  return (
    <div aria-hidden="true" className="absolute inset-0">
      {/* a soft pool of light where he sits */}
      <span
        className="absolute bottom-1.5 left-1/2 h-4 w-32 -translate-x-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(closest-side, var(--crumb-floor), transparent)",
        }}
      />
      <div
        ref={engine.part("bun")}
        className="absolute bottom-1"
        style={{
          left: `calc(50% - ${(WIDE / 2).toFixed(2)}px)`,
          width: WIDE,
          height: TALL,
          transformOrigin: "50% 100%",
        }}
      >
        <div
          ref={engine.part("breathe")}
          className="absolute inset-0"
          style={{ transformOrigin: "50% 100%" }}
        >
          <div
            ref={engine.part("back")}
            className="absolute inset-0"
            style={{ ...layer, opacity: 0 }}
          />
          <div
            ref={engine.part("front")}
            className="absolute inset-0"
            style={{ ...layer, backgroundImage: `url("${ART.strips[0]}")` }}
          />
        </div>
      </div>
    </div>
  );
}

export default Crumb;
