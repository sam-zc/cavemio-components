"use client";

import * as React from "react";
import { playStrip, preloadStrips } from "./cast-sprite";
import { COO_ART as ART, COO_GEO as G } from "./coo-art";
import { COO_FLY_ART as FLY_ART, COO_FLY_FRAMES as FLY_F } from "./coo-fly-art";
import { NumberRoll } from "./number-roll";

/* ─────────────────────────────────────────────────────────
 * COO: the carrier pigeon who brings the code
 *
 * An illustrated pigeon on a post, a mailbox across the stage
 * and the route between them, rigged in code:
 *
 *   peck     a nod from his feet for every digit typed
 *   ruffle   a shake of the head when the code is wrong
 *   puff     chest out and two proud flaps when it's right
 *   send     he takes off with an envelope, flies the route to
 *            the mailbox, waits there until the send is done,
 *            pops the flag and flies home empty (real wingbeats,
 *            frames from an animation); if the send
 *            fails he turns back with the envelope still in
 *            his beak
 *   doze     while the resend clock runs he naps on his post:
 *            eye shut, z's drifting up, and a thought bubble over
 *            his head counting the seconds down (`wait`); typing
 *            wakes him, and at zero the bubble pops and he hops
 *
 * The scene is drawn at 364 × 176 and scaled to the stage.
 * One frame loop outside React moves him and sleeps when
 * he's still; flaps swap between two drawn wing poses.
 * ───────────────────────────────────────────────────────── */

export interface CooHandle {
  peck: () => void;
  ruffle: () => void;
  puff: () => void;
  /** Take off with a new code; call `delivered` when the send settles. */
  send: () => void;
  /** The send settled: he pops the flag (ok) or brings the envelope back, then lands and calls onHome. */
  delivered: (ok: boolean, onHome: () => void) => void;
}

const W = 364;
const H = 176;
const KB = 0.42; // the pigeon's drawing scale
/* His wingbeats: frames cut from an animation, placed by his cap like the standing art.
 * In the clips (960px square) his cap is at (611, 440) and the frames cover (174, 210)–(786, 906). */
const FS = 0.143;
const FLYBOX = {
  left: (174 - 611) * FS,
  top: (210 - 440) * FS,
  w: (786 - 174) * FS,
  h: (906 - 210) * FS,
};
type FlyClip = keyof typeof FLY_F.clips;
const KP = 0.62; // the props'
const POST = { x: 72, foot: 180 };
const BOX = { x: 300, foot: 180 };
const FEET = { x: POST.x, y: POST.foot - G.post.h * KP + 1.5 };
/** Where his cap is when he stands on the post, and while he waits over the mailbox. */
const HOME = {
  x: FEET.x + (G.stand.cap.x - G.stand.feet.x) * KB,
  y: FEET.y + (G.stand.cap.y - G.stand.feet.y) * KB,
};
const OVER = { x: BOX.x + 4, y: 40 };
const CTRL = { x: 192, y: 40 };
/** The route drawn between them: from his beak to the mailbox door. */
const BEAK = {
  x: FEET.x + (184 - G.stand.feet.x) * KB,
  y: FEET.y + (50 - G.stand.feet.y) * KB,
};
export const COO_ROUTE = `M${BEAK.x.toFixed(1)} ${BEAK.y.toFixed(1)} Q${(W / 2 + 14).toFixed(1)} 2 ${BOX.x - 6} 82`;
const FLY = 1050; // ms each way
const FLAP = 95; // ms a wing pose is held

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const inOut = (k: number) =>
  k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;

type Spring = { x: number; v: number };
function step(s: Spring, target: number, dt: number, k = 260, c = 18) {
  s.v += ((target - s.x) * k - s.v * c) * dt;
  s.x += s.v * dt;
  if (Math.abs(target - s.x) < 1e-3 && Math.abs(s.v) < 1e-3) {
    s.x = target;
    s.v = 0;
    return true;
  }
  return false;
}

type Flight = {
  leg: "out" | "wait" | "back";
  t0: number;
  carrying: boolean;
  ok?: boolean;
  onHome?: () => void;
  popAt?: number;
};

export class CooEngine {
  parts: Record<string, Element | null> = {};
  reduced = false;
  rot: Spring = { x: 0, v: 0 };
  puffS: Spring = { x: 0, v: 0 };
  hop: Spring = { x: 0, v: 0 };
  wobble: Spring = { x: 0, v: 0 };
  lid: Spring = { x: 0, v: 0 };
  dozing = false;
  zTimer = 0;
  flagUp = true;
  puffT = 0;
  flapUntil = 0;
  flying: FlyClip | null = null;
  blinkAt = 0;
  flight: Flight | null = null;
  raf = 0;
  last = 0;
  seq = 0;
  blinkTimer = 0;
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
    if (!reduced) {
      (this.parts.stand as HTMLElement | null)?.animate(
        [{ transform: "none" }, { transform: "scale(1.012, 1.022)" }],
        {
          duration: 1600,
          iterations: Infinity,
          direction: "alternate",
          easing: "ease-in-out",
        },
      );
    }
    preloadStrips(Object.values(FLY_ART));
    this.draw(performance.now());
    this.scheduleBlink();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.clearTimeout(this.blinkTimer);
    window.clearTimeout(this.zTimer);
    this.raf = 0;
    this.observer?.disconnect();
    this.observer = null;
    (this.parts.stand as HTMLElement | null)
      ?.getAnimations()
      .forEach((a) => a.cancel());
    (this.parts.fly as HTMLElement | null)
      ?.getAnimations()
      .forEach((a) => a.cancel());
    this.flying = null;
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
      2400 + ((this.seq * 1531 + 377) % 3600),
    );
  }

  wake() {
    if (this.raf || !this.parts.bird) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  /** Nap (eye shut, z's) or wake; waking because the wait is over gives a little hop. */
  doze(on: boolean, hop = false) {
    if (on === this.dozing) return;
    this.dozing = on;
    window.clearTimeout(this.zTimer);
    if (on) this.zTimer = window.setTimeout(() => this.snore(), 500);
    else if (hop && !this.reduced) {
      this.hop.v -= 120;
      this.rot.v -= 140;
    }
    if (this.reduced) {
      this.lid.x = on ? 1 : 0;
      this.draw(performance.now());
      return;
    }
    this.wake();
  }

  /** A "z" drifts up from his head and fades; another follows while he sleeps. */
  snore() {
    const layer = this.parts.zs as HTMLElement | null;
    if (!this.dozing || this.reduced || !layer) return;
    if (!this.flight) {
      const z = document.createElement("span");
      const big = this.seq++ % 2 === 0;
      z.textContent = "z";
      z.style.cssText = `position:absolute;left:${HOME.x + 8}px;top:${HOME.y - 6}px;font-size:${big ? 15 : 11}px;font-weight:600;line-height:1;color:var(--coo-z);opacity:0`;
      layer.appendChild(z);
      z.animate(
        [
          {
            opacity: 0,
            transform: "translate(0, 0) scale(0.6) rotate(-10deg)",
          },
          { opacity: 1, offset: 0.25 },
          {
            opacity: 0,
            transform: `translate(${big ? -20 : -12}px, -24px) scale(1.1) rotate(-14deg)`,
          },
        ],
        { duration: 2200, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      ).onfinish = () => z.remove();
    }
    this.zTimer = window.setTimeout(() => this.snore(), 1100);
  }

  peck() {
    if (this.reduced || this.flight) return;
    this.rot.v += 240;
    this.wake();
  }

  ruffle() {
    if (this.reduced || this.flight) return;
    this.rot.v -= 420;
    this.wobble.v += 9;
    this.wake();
  }

  puff() {
    this.puffT = 1;
    if (this.reduced) {
      this.puffS.x = 1;
      this.draw(performance.now());
      return;
    }
    this.flapUntil = performance.now() + 4 * FLAP;
    this.hop.v -= 150;
    this.wake();
  }

  send() {
    this.puffT = 0;
    if (this.reduced) {
      this.flight = { leg: "wait", t0: performance.now(), carrying: true };
      this.draw(performance.now());
      return;
    }
    this.flight = { leg: "out", t0: performance.now(), carrying: true };
    this.wake();
  }

  delivered(ok: boolean, onHome: () => void) {
    const f = this.flight;
    if (!f) {
      onHome();
      return;
    }
    f.ok = ok;
    f.onHome = onHome;
    if (this.reduced) {
      this.flight = null;
      if (ok) this.flagUp = true;
      this.draw(performance.now());
      onHome();
      return;
    }
    this.wake();
  }

  tick(now: number) {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    let busy = false;
    const f = this.flight;
    if (f) {
      busy = true;
      const t = now - f.t0;
      if (f.leg === "out" && t >= FLY) {
        f.leg = "wait";
        f.t0 = now;
      } else if (f.leg === "wait" && f.ok !== undefined) {
        if (f.ok && f.popAt === undefined) {
          // a new letter: the flag drops, then springs back up
          f.popAt = now;
          this.flagUp = false;
          this.wobble.v -= 6;
        }
        if (
          f.popAt !== undefined &&
          this.flagUp === false &&
          now - f.popAt > 260
        ) {
          this.flagUp = true;
          this.wobble.v += 10;
        }
        if (!f.ok || now - (f.popAt ?? now) > 620) {
          f.leg = "back";
          f.t0 = now;
          f.carrying = !f.ok;
        }
      } else if (f.leg === "back" && t >= FLY) {
        this.flight = null;
        this.hop.v += 90;
        this.rot.v -= 60;
        f.onHome?.();
      }
    }
    const settled = [
      step(this.rot, 0, dt, 300, 16),
      step(this.puffS, this.puffT, dt, 200, 16),
      step(this.hop, 0, dt, 320, 15),
      step(this.wobble, 0, dt, 260, 9),
      step(this.lid, this.dozing && !this.flight ? 1 : 0, dt, 120, 18),
    ].every(Boolean);
    if (!settled || now < this.flapUntil) busy = true;
    if (this.blinkAt && now - this.blinkAt < 170) busy = true;
    else this.blinkAt = 0;
    this.draw(now);
    this.raf = busy ? requestAnimationFrame(this.frame) : 0;
  }

  show(name: "stand" | FlyClip) {
    (this.parts.stand as HTMLElement | null)?.style.setProperty(
      "opacity",
      name === "stand" ? "1" : "0",
    );
    const sprite = this.parts.fly as HTMLElement | null;
    sprite?.style.setProperty("opacity", name === "stand" ? "0" : "1");
    const clip = name === "stand" ? null : name;
    if (clip && clip !== this.flying) {
      playStrip(sprite, {
        src: FLY_ART[clip],
        frames: FLY_F.clips[clip].frames,
        fps: FLY_F.clips[clip].fps,
        size: FLYBOX.w,
        height: FLYBOX.h,
        reduced: this.reduced,
      });
    }
    if (!clip) sprite?.getAnimations().forEach((a) => a.cancel());
    this.flying = clip;
  }

  draw(now: number) {
    const bird = this.parts.bird as HTMLElement | null;
    if (!bird) return;
    const f = this.flight;
    let x = HOME.x;
    let y = HOME.y;
    let angle = 0;
    let flip = 1;
    let frame: "stand" | FlyClip = "stand";
    if (f) {
      const t = now - f.t0;
      const k =
        f.leg === "out"
          ? inOut(clamp(t / FLY))
          : f.leg === "back"
            ? 1 - inOut(clamp(t / FLY))
            : 1;
      // along the arc from home to over the mailbox (and back the same way)
      x =
        (1 - k) * (1 - k) * HOME.x + 2 * (1 - k) * k * CTRL.x + k * k * OVER.x;
      y =
        (1 - k) * (1 - k) * HOME.y + 2 * (1 - k) * k * CTRL.y + k * k * OVER.y;
      y += Math.sin((t / FLAP) * Math.PI) * 1.6;
      flip = f.leg === "back" ? -1 : 1;
      angle =
        f.leg === "wait"
          ? 0
          : (f.leg === "out" ? 1 : -1) * 6 * Math.sin(Math.PI * clamp(t / FLY));
      const empty = !f.carrying;
      frame = empty ? "flyEmpty" : "fly";
    } else if (now < this.flapUntil) {
      frame = "flyEmpty";
    }
    this.show(frame);
    const puff = 1 + 0.07 * clamp(this.puffS.x, 0, 1.4);
    const fx = (G.stand.feet.x - G.stand.cap.x) * KB;
    const fy = (G.stand.feet.y - G.stand.cap.y) * KB;
    // standing, he turns and swells about his feet; flying, about his middle
    bird.style.transform =
      `translate(${x.toFixed(2)}px, ${(y + this.hop.x * 0.06).toFixed(2)}px) scale(${flip}, 1) ` +
      (f
        ? `rotate(${angle.toFixed(2)}deg)`
        : `translate(${fx.toFixed(2)}px, ${fy.toFixed(2)}px) rotate(${(this.rot.x * 0.05).toFixed(2)}deg) scale(${puff.toFixed(4)}) translate(${(-fx).toFixed(2)}px, ${(-fy).toFixed(2)}px)`);

    // the mailbox: which flag, and a little rock when it changes
    (this.parts.box as HTMLElement | null)?.style.setProperty(
      "opacity",
      this.flagUp ? "0" : "1",
    );
    (this.parts.boxFlag as HTMLElement | null)?.style.setProperty(
      "opacity",
      this.flagUp ? "1" : "0",
    );
    (this.parts.mailbox as HTMLElement | null)?.style.setProperty(
      "transform",
      `rotate(${(this.wobble.x * 0.25).toFixed(2)}deg)`,
    );

    const blink =
      this.blinkAt && frame === "stand"
        ? Math.sin(clamp((now - this.blinkAt) / 160) * Math.PI)
        : 0;
    const shut = frame === "stand" ? Math.max(blink, clamp(this.lid.x)) : 0;
    (this.parts.lid as SVGElement | null)?.setAttribute(
      "transform",
      `translate(${G.stand.eye.x} ${G.stand.eye.y - G.stand.eye.r}) scale(1 ${shut.toFixed(3)})`,
    );
  }
}

export function Coo({
  wait,
  dozing = false,
  reduced,
  ref,
  className = "",
}: {
  /** Seconds left before he can fly again; 0 when he can. */
  wait: number;
  /** Napping through the wait (the block wakes him while you type). */
  dozing?: boolean;
  reduced: boolean;
  ref?: React.Ref<CooHandle>;
  className?: string;
}) {
  const [engine] = React.useState(() => new CooEngine());
  const [waited, setWaited] = React.useState(wait);
  // the clock reaching zero (not a first render at zero) wakes him with a hop
  const [woke, setWoke] = React.useState(false);
  if (waited !== wait) {
    setWaited(wait);
    setWoke(waited > 0 && wait <= 0);
  }

  React.useLayoutEffect(() => {
    engine.mount(reduced);
    return () => engine.destroy();
  }, [engine, reduced]);

  React.useEffect(() => {
    engine.doze(dozing && wait > 0, woke);
  }, [engine, dozing, wait, woke]);

  React.useImperativeHandle(
    ref,
    () => ({
      peck: () => engine.peck(),
      ruffle: () => engine.ruffle(),
      puff: () => engine.puff(),
      send: () => engine.send(),
      delivered: (ok, onHome) => engine.delivered(ok, onHome),
    }),
    [engine],
  );

  const img = "pointer-events-none absolute max-w-none select-none";
  const frame = (
    name: "stand",
    src: string,
    k: number,
    part: string,
    shown: boolean,
  ) => {
    const g = G[name];
    return (
      <img
        ref={engine.part(part)}
        src={src}
        alt=""
        draggable={false}
        className={img}
        style={{
          left: -g.cap.x * k,
          top: -g.cap.y * k,
          width: g.w * k,
          height: g.h * k,
          opacity: shown ? 1 : 0,
          transformOrigin:
            name === "stand"
              ? `${G.stand.feet.x * k}px ${G.stand.feet.y * k}px`
              : undefined,
        }}
      />
    );
  };
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
        {/* the route he flies */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 size-full overflow-visible"
          fill="none"
        >
          <path
            d={COO_ROUTE}
            stroke="var(--coo-route)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
            opacity="0.4"
          />
        </svg>

        <img
          src={ART.post}
          alt=""
          draggable={false}
          className={img}
          style={{
            left: POST.x - (G.post.w * KP) / 2,
            top: POST.foot - G.post.h * KP,
            width: G.post.w * KP,
            height: G.post.h * KP,
          }}
        />
        <div
          ref={engine.part("mailbox")}
          className="absolute left-0 top-0 size-full"
          style={{ transformOrigin: `${BOX.x}px ${BOX.foot - 6}px` }}
        >
          <img
            ref={engine.part("box")}
            src={ART.box}
            alt=""
            draggable={false}
            className={img}
            style={{
              left: BOX.x - G.box.foot.x * KP,
              top: BOX.foot - G.box.foot.y * KP,
              width: G.box.w * KP,
              height: G.box.h * KP,
              opacity: 0,
            }}
          />

          <img
            ref={engine.part("boxFlag")}
            src={ART.boxFlag}
            alt=""
            draggable={false}
            className={img}
            style={{
              left: BOX.x - G.boxFlag.foot.x * KP,
              top: BOX.foot - G.boxFlag.foot.y * KP,
              width: G.boxFlag.w * KP,
              height: G.boxFlag.h * KP,
            }}
          />
        </div>

        <div
          ref={engine.part("bird")}
          className="absolute left-0 top-0 will-change-transform"
        >
          {frame("stand", ART.stand, KB, "stand", true)}
          <div
            ref={engine.part("fly")}
            className="absolute"
            style={{
              left: FLYBOX.left,
              top: FLYBOX.top,
              width: FLYBOX.w,
              height: FLYBOX.h,
              opacity: 0,
            }}
          />
          {/* his eyelid, closing over the drawn eye when he blinks */}
          <svg
            viewBox={`0 0 ${G.stand.w} ${G.stand.h}`}
            className="pointer-events-none absolute overflow-visible"
            style={{
              left: -G.stand.cap.x * KB,
              top: -G.stand.cap.y * KB,
              width: G.stand.w * KB,
              height: G.stand.h * KB,
            }}
          >
            <g ref={engine.part("lid")} transform="scale(1 0)">
              <ellipse
                cx="0"
                cy={G.stand.eye.r}
                rx={G.stand.eye.r + 1.2}
                ry={G.stand.eye.r + 1}
                fill={G.lid}
              />
              {/* the closed eye: a dark crease along the lid's foot */}
              <path
                d={`M${-G.stand.eye.r} ${G.stand.eye.r * 1.1} Q0 ${G.stand.eye.r * 1.9} ${G.stand.eye.r} ${G.stand.eye.r * 1.1}`}
                fill="none"
                stroke="rgb(40 40 52)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>

        <div
          ref={engine.part("zs")}
          className="pointer-events-none absolute inset-0"
        />

        {/* his thought while he waits: how long until he can fly again */}
        <div
          className="pointer-events-none absolute"
          style={{
            left: HOME.x + 28,
            top: HOME.y - 23,
            transformOrigin: "0% 100%",
            opacity: wait > 0 ? 1 : 0,
            transform: wait > 0 ? "none" : "scale(0.4) translate(-6px, 10px)",
            filter: wait > 0 ? "none" : "blur(3px)",
            transition: reduced
              ? "none"
              : "opacity 260ms ease-out, transform 420ms cubic-bezier(0.34,1.36,0.64,1), filter 260ms ease-out",
          }}
        >
          <span
            className="absolute -bottom-[8px] left-[2px] size-[7px] rounded-full"
            style={{ background: "var(--coo-bubble)" }}
          />
          <span
            className="absolute -bottom-[15px] -left-[4px] size-[4px] rounded-full"
            style={{ background: "var(--coo-bubble)" }}
          />
          <span
            className="flex h-[26px] items-center whitespace-nowrap rounded-full px-2.5 text-[14px] font-semibold tabular-nums tracking-[-0.01em]"
            style={{
              background: "var(--coo-bubble)",
              color: "var(--coo-bubble-ink)",
            }}
          >
            {Math.floor(Math.max(0, wait) / 60)}:
            <NumberRoll
              value={Math.max(0, wait) % 60}
              format={{ minimumIntegerDigits: 2 }}
              direction="down"
              duration={700}
            />
          </span>
        </div>
      </div>
    </div>
  );
}

export default Coo;
