"use client";

import * as React from "react";
import { BOO_ART as ART, BOO_FRAMES as F } from "./boo-art";
import { playStrip, preloadStrips } from "./cast-sprite";

/* ─────────────────────────────────────────────────────────
 * BOO: the ghost of the thing you're deleting
 *
 * An illustrated ghost who lives in the workspace's tile,
 * rigged in code:
 *
 *   rise     as the name is typed, he rises out of the top of
 *            the tile, worried (`rise`, 0 to 1); a wrong letter
 *            and he sinks back a step
 *   hold     holding Delete, he waves and drifts up out of the
 *            stage over the hold; let go and he drops back
 *   gone     deleted: he's away, and a moment later peeks up
 *            over the bottom edge of the stage
 *   back     restored: he dives back down into his tile, shy
 *
 * The scene is drawn at 364 × 184 and scaled to the stage.
 * One frame loop outside React moves him and sleeps when he's
 * still; his float is a compositor animation.
 * ───────────────────────────────────────────────────────── */

export type BooMode = "type" | "hold" | "gone" | "back";

const W = 364;
const H = 184;
/* His frames, placed so the top of his head is at the ghost's point and his middle on its line.
 * In the clips his head's top is at y 200 and his middle at x 480 (peeking: his edge at y 700). */
const S = 0.16; // clip px → stage px for his body
const BODY = {
  left: (F.box.x0 - 480) * S,
  top: (F.box.y0 - 200) * S,
  w: (F.box.x1 - F.box.x0) * S,
  h: (F.box.y1 - F.box.y0) * S,
};
const SP = 0.155; // and for the peek
const PEEKF = {
  left: (F.peek.box.x0 - 480) * SP,
  top: (F.peek.box.y0 - 700) * SP,
  w: (F.peek.box.x1 - F.peek.box.x0) * SP,
  h: (F.peek.box.y1 - F.peek.box.y0) * SP,
};
type Pose = "worried" | "wave" | "shy";
export const BOO_TILE = { x: W / 2, top: 92, size: 60 };
const RISE = 80; // how far out of the tile he comes
const AWAY = -140; // above the stage
const PEEK = { x: 320, bottom: H + 2 };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeIn = (k: number) => k * k * k;

type Spring = { x: number; v: number };
function step(s: Spring, target: number, dt: number, k = 170, c = 20) {
  s.v += ((target - s.x) * k - s.v * c) * dt;
  s.x += s.v * dt;
  if (Math.abs(target - s.x) < 1e-2 && Math.abs(s.v) < 1e-2) {
    s.x = target;
    s.v = 0;
    return true;
  }
  return false;
}

export class BooEngine {
  parts: Record<string, Element | null> = {};
  reduced = false;
  mode: BooMode = "type";
  rise = 0;
  holdMs = 1100;
  holdAt = 0;
  holdFrom = 0;
  goneAt = 0;
  y: Spring = { x: BOO_TILE.top + 4, v: 0 };
  peek: Spring = { x: 0, v: 0 };
  tilt: Spring = { x: 0, v: 0 };
  raf = 0;
  last = 0;
  observer: ResizeObserver | null = null;
  shown: Pose | null = null;
  frame = (now: number) => this.tick(now);

  part = (name: string) => (el: Element | null) => {
    this.parts[name] = el;
  };

  mount(reduced: boolean, rise: number, mode: BooMode, holdMs: number) {
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
    playStrip(this.parts.peekSprite as HTMLElement | null, {
      src: ART.peek,
      frames: F.peek.frames,
      fps: F.peek.fps,
      size: PEEKF.w,
      height: PEEKF.h,
      reduced,
    });
    this.set(rise, mode, holdMs, true);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.observer?.disconnect();
    this.observer = null;
    for (const n of ["sprite", "peekSprite"])
      (this.parts[n] as HTMLElement | null)
        ?.getAnimations()
        .forEach((a) => a.cancel());
    this.shown = null;
  }

  target() {
    if (this.mode === "gone") return AWAY;
    if (this.mode === "back") return BOO_TILE.top + 6;
    // at rest he's tucked a little below the tile's top edge, out of sight
    return BOO_TILE.top + 4 - (RISE + 4) * clamp(this.rise);
  }

  set(rise: number, mode: BooMode, holdMs: number, now = false) {
    const was = this.mode;
    this.rise = rise;
    this.holdMs = holdMs;
    this.mode = mode;
    const t = performance.now();
    if (mode === "hold" && was !== "hold") {
      this.holdAt = t;
      this.holdFrom = this.y.x;
    }
    if (mode === "gone" && was !== "gone") this.goneAt = t;
    if (mode === "back" && was !== "back") this.y.x = Math.min(this.y.x, AWAY);
    if (mode === "type" && was === "back") this.y.x = BOO_TILE.top + 4;
    if (now || this.reduced) {
      this.y.x = mode === "hold" ? AWAY : this.target();
      this.y.v = 0;
      this.peek.x = mode === "gone" ? 1 : 0;
      this.draw();
      return;
    }
    this.wake();
  }

  /** A shiver when a wrong letter sends him back. */
  shiver() {
    if (this.reduced) return;
    this.tilt.v += 260;
    this.wake();
  }

  wake() {
    if (this.raf || !this.parts.ghost) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  tick(now: number) {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    let busy = false;
    if (this.mode === "hold") {
      // up and out over the hold, slow at first like he's reluctant
      const k = clamp((now - this.holdAt) / this.holdMs);
      this.y.x = this.holdFrom + (AWAY - this.holdFrom) * easeIn(k);
      this.y.v = 0;
      busy = k < 1;
    }
    const settled = [
      this.mode === "hold" ||
        step(
          this.y,
          this.target(),
          dt,
          this.mode === "back" ? 120 : 150,
          this.mode === "back" ? 15 : 17,
        ),
      step(
        this.peek,
        this.mode === "gone" && now - this.goneAt > 900 ? 1 : 0,
        dt,
        140,
        14,
      ),
      step(this.tilt, 0, dt, 300, 10),
    ].every(Boolean);
    if (!settled) busy = true;
    if (this.mode === "gone" && now - this.goneAt <= 900) busy = true;
    this.draw();
    this.raf = busy ? requestAnimationFrame(this.frame) : 0;
  }

  draw() {
    const pose: Pose =
      this.mode === "back" ? "shy" : this.mode === "type" ? "worried" : "wave";
    if (pose !== this.shown) {
      // each pose is a loop of frames from the animation
      this.shown = pose;
      playStrip(this.parts.sprite as HTMLElement | null, {
        src: ART[pose],
        frames: F.clips[pose].frames,
        fps: F.clips[pose].fps,
        size: BODY.w,
        height: BODY.h,
        reduced: this.reduced,
      });
    }
    const ghost = this.parts.ghost as HTMLElement | null;
    ghost?.style.setProperty(
      "transform",
      `translate(${BOO_TILE.x}px, ${this.y.x.toFixed(2)}px) rotate(${(this.tilt.x * 0.02).toFixed(2)}deg)`,
    );
    const p = clamp(this.peek.x, 0, 1.2);
    (this.parts.peek as HTMLElement | null)?.style.setProperty(
      "transform",
      `translate(${PEEK.x}px, ${(PEEK.bottom + (1 - p) * -PEEKF.top * 1.1).toFixed(2)}px)`,
    );
  }
}

export function Boo({
  rise,
  mode,
  holdMs = 1100,
  reduced,
  tile,
  ref,
  className = "",
}: {
  /** How far out of his tile he is: 0 inside, 1 all the way out. */
  rise: number;
  mode: BooMode;
  /** How long the Delete hold lasts, so he's out of the stage just as it confirms. */
  holdMs?: number;
  reduced: boolean;
  /** The workspace's tile, drawn by the block; he lives behind it. */
  tile: React.ReactNode;
  ref?: React.Ref<{ shiver: () => void }>;
  className?: string;
}) {
  const [engine] = React.useState(() => new BooEngine());

  React.useLayoutEffect(() => {
    engine.mount(reduced, rise, mode, holdMs);
    return () => engine.destroy();
    // mounted once per reduced-motion setting; the rest arrives through set() below
  }, [engine, reduced]);

  React.useEffect(() => {
    engine.set(rise, mode, holdMs);
  }, [engine, rise, mode, holdMs]);

  React.useImperativeHandle(ref, () => ({ shiver: () => engine.shiver() }), [
    engine,
  ]);

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
        {/* he's only seen above the top of his tile, as if he climbs out of it */}
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: BOO_TILE.top + 1,
            overflow: "clip",
            overflowClipMargin: 0,
          }}
        >
          <div
            ref={engine.part("ghost")}
            className="absolute left-0 top-0 will-change-transform"
          >
            <div
              ref={engine.part("sprite")}
              className="absolute"
              style={{
                left: BODY.left,
                top: BODY.top,
                width: BODY.w,
                height: BODY.h,
              }}
            />
          </div>
        </div>
        <div
          className="absolute"
          style={{
            left: BOO_TILE.x - BOO_TILE.size / 2,
            top: BOO_TILE.top,
            width: BOO_TILE.size,
            height: BOO_TILE.size,
          }}
        >
          {tile}
        </div>
        {/* after the delete he lingers, peeking up over the bottom edge */}
        <div ref={engine.part("peek")} className="absolute left-0 top-0">
          <div
            ref={engine.part("peekSprite")}
            className="absolute"
            style={{
              left: PEEKF.left,
              top: PEEKF.top,
              width: PEEKF.w,
              height: PEEKF.h,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Boo;
