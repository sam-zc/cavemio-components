"use client";

import * as React from "react";
import { playStrip, preloadStrips } from "./cast-sprite";
import { FETCH_ART as ART, FETCH_FRAMES as F } from "./fetch-art";

/* ─────────────────────────────────────────────────────────
 * FETCH: the puppy who fetches your search
 *
 * Fetch is animated: each state is a loop of frames cut from
 * a generated animation, played in code.
 *
 *   sit      waiting: panting, tail wagging, a head tilt
 *   sniff    nose to the ground while you type
 *   go       a search starts: he gallops off the right edge
 *   back     the answer is in: he gallops back in and sits,
 *            wagging proudly with a newspaper (results) or
 *            looking sheepish with a stick (none)
 *
 * The scene is drawn at 364 × 168 and scaled to the stage.
 * Loops are Web Animations (no frame loop); one rAF loop moves
 * him across the stage only while he runs.
 * ───────────────────────────────────────────────────────── */

export type FetchCarry = "paper" | "stick" | "sit";

export interface FetchHandle {
  sniff: () => void;
  /** Off to fetch. */
  go: () => void;
  /** Back with what he found. */
  back: (carry: FetchCarry) => void;
}

type Clip = keyof typeof F.clips;

const W = 364;
const H = 168;
const FRAME = 124; // one frame on the stage
const HOME = 96; // the middle of the frame when he sits
const AWAY = W + 110;
const OUT_MS = 520;
const IN_MS = 700;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeIn = (k: number) => k * k;
const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);

export class FetchEngine {
  parts: Record<string, Element | null> = {};
  reduced = false;
  leg: "home" | "out" | "away" | "in" = "home";
  t0 = 0;
  carry: FetchCarry = "sit";
  pending: FetchCarry | null = null;
  clip: Clip | null = null;
  sniffTimer = 0;
  raf = 0;
  observer: ResizeObserver | null = null;
  frame = (now: number) => this.tick(now);

  part = (name: string) => (el: Element | null) => {
    this.parts[name] = el;
  };

  mount(reduced: boolean) {
    this.reduced = reduced;
    const host = this.parts.host as HTMLElement | null;
    const scene = this.parts.scene as HTMLElement | null;
    if (host && scene) {
      const fit = () =>
        scene.style.setProperty("transform", `scale(${host.clientWidth / W})`);
      fit();
      this.observer = new ResizeObserver(fit);
      this.observer.observe(host);
    }
    preloadStrips(Object.values(ART));
    this.play("sit");
    this.place(HOME, 1);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.clearTimeout(this.sniffTimer);
    this.raf = 0;
    this.observer?.disconnect();
    this.observer = null;
    (this.parts.sprite as HTMLElement | null)
      ?.getAnimations()
      .forEach((a) => a.cancel());
  }

  play(clip: Clip) {
    if (this.clip === clip) return;
    this.clip = clip;
    playStrip(this.parts.sprite as HTMLElement | null, {
      src: ART[clip],
      frames: F.clips[clip].frames,
      fps: F.clips[clip].fps,
      size: FRAME,
      reduced: this.reduced,
    });
  }

  place(x: number, flip: number) {
    (this.parts.dog as HTMLElement | null)?.style.setProperty(
      "transform",
      `translateX(${(x - FRAME / 2).toFixed(1)}px) scaleX(${flip})`,
    );
  }

  sniff() {
    if (this.leg !== "home") return;
    this.play("sniff");
    window.clearTimeout(this.sniffTimer);
    this.sniffTimer = window.setTimeout(
      () => this.leg === "home" && this.play(this.carry),
      800,
    );
  }

  go() {
    window.clearTimeout(this.sniffTimer);
    this.pending = null;
    if (this.leg === "out" || this.leg === "away") return;
    if (this.reduced) {
      this.leg = "away";
      return;
    }
    this.leg = "out";
    this.t0 = performance.now();
    this.play("run");
    this.wake();
  }

  back(carry: FetchCarry) {
    if (this.leg === "home" || this.reduced) {
      this.leg = "home";
      this.carry = carry;
      this.play(carry);
      this.place(HOME, 1);
      return;
    }
    // still on his way out: he turns round once he's off the stage
    this.pending = carry;
    if (this.leg === "away") this.turn(performance.now());
    this.wake();
  }

  turn(now: number) {
    if (this.pending === null) return;
    this.carry = this.pending;
    this.pending = null;
    this.leg = "in";
    this.t0 = now;
    this.play("run");
  }

  wake() {
    if (this.raf || !this.parts.dog) return;
    this.raf = requestAnimationFrame(this.frame);
  }

  tick(now: number) {
    const t = now - this.t0;
    let busy = true;
    if (this.leg === "out") {
      this.place(HOME + (AWAY - HOME) * easeIn(clamp(t / OUT_MS)), 1);
      if (t >= OUT_MS) {
        this.leg = "away";
        this.turn(now);
      }
    } else if (this.leg === "in") {
      this.place(HOME + (AWAY - HOME) * (1 - easeOut(clamp(t / IN_MS))), -1);
      if (t >= IN_MS) {
        this.leg = "home";
        this.place(HOME, 1);
        this.play(this.carry);
        busy = false;
      }
    } else busy = false;
    this.raf = busy ? requestAnimationFrame(this.frame) : 0;
  }
}

export function Fetch({
  reduced,
  ref,
  children,
  className = "",
}: {
  reduced: boolean;
  ref?: React.Ref<FetchHandle>;
  children?: React.ReactNode;
  className?: string;
}) {
  const [engine] = React.useState(() => new FetchEngine());

  React.useLayoutEffect(() => {
    engine.mount(reduced);
    return () => engine.destroy();
  }, [engine, reduced]);

  React.useImperativeHandle(
    ref,
    () => ({
      sniff: () => engine.sniff(),
      go: () => engine.go(),
      back: (c) => engine.back(c),
    }),
    [engine],
  );

  return (
    <div
      ref={engine.part("host")}
      aria-hidden="true"
      className={`relative w-full ${className}`}
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <div
        ref={engine.part("scene")}
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: W, height: H }}
      >
        {children}
        <div
          ref={engine.part("dog")}
          className="absolute left-0 will-change-transform"
          style={{ top: 154 - FRAME, width: FRAME, height: FRAME }}
        >
          <div ref={engine.part("sprite")} className="size-full" />
        </div>
      </div>
    </div>
  );
}

export default Fetch;
