"use client";

import * as React from "react";
import { NumberRoll } from "./number-roll";
import { playStrip, preloadStrips } from "./cast-sprite";
import { PACK_ART as ART, PACK_FRAMES as F } from "./pack-art";
import { StatusButton, type ActionStatus } from "./status-button";
import { TextMorph } from "./text-morph";
import {
  EASE_OUT,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";

/* ─────────────────────────────────────────────────────────
 * STORAGE: Pack and his suitcase
 *
 *   roomy    an animated raccoon, Pack, leans on his case at
 *            his ease
 *   full     crossing 90% the case bulges, a sock and a photo
 *            pop out of the zip, and he climbs on top and keeps
 *            pushing it down
 *   clean up the same clip backwards: the clothes go back in and
 *            he climbs down to lean on it again
 *   upgrade  a roomy trunk, and he cheers beside it
 *
 * Under the stage: what's used of the limit (rolling), a bar of
 * what it's used by, and the two actions.
 * ───────────────────────────────────────────────────────── */

export interface StorageKind {
  id: string;
  label: string;
  bytes: number;
  /** Any CSS colour; defaults to the theme's --chart-1…5. */
  color?: string;
}

export interface StorageProps {
  /** Bytes used. */
  used: number;
  /** Bytes allowed on the plan. */
  limit: number;
  /** What the space is used by, for the bar and its legend. */
  kinds?: StorageKind[];
  /** Free some space (empty the trash, old versions…); update `used` afterwards. */
  onCleanUp?: () => Promise<unknown>;
  cleanUpLabel?: string;
  /** Move to a bigger plan; update `limit` afterwards. */
  onUpgrade?: () => Promise<unknown>;
  upgradeLabel?: string;
  /** Show the roomy trunk (a plan with plenty of space). */
  roomy?: boolean;
  /** What the raccoon is called in his lines. */
  name?: string;
  className?: string;
}

const mix = (color: string, amount: number, into = "transparent") =>
  `color-mix(in oklab, ${color} ${amount}%, ${into})`;
const PF = "var(--primary-foreground)";
const CARD: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 95, "var(--foreground)")})`,
  boxShadow: `0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 85)}`,
};
/* The one lit surface: a baggage carousel's slats under everything. */
const STAGE: React.CSSProperties = {
  backgroundColor: "var(--primary)",
  backgroundImage: [
    `radial-gradient(55% 80% at 55% 100%, ${mix(PF, 22)} 0%, transparent 70%)`,
    `linear-gradient(175deg, transparent 40%, ${mix("black", 20)} 100%)`,
    `repeating-linear-gradient(90deg, ${mix(PF, 14)} 0 1px, transparent 1px 22px)`,
  ].join(", "),
  backgroundSize: "auto, auto, 100% 14px",
  backgroundRepeat: "no-repeat, no-repeat, no-repeat",
  backgroundPosition: "0 0, 0 0, 0 100%",
  boxShadow: `inset 0 1px 0 ${mix(PF, 36)}, inset 0 0 0 1px ${mix(PF, 12)}`,
};
const LIT: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${mix(PF, 16)}, transparent 60%)`,
  boxShadow: `inset 0 1px 0 ${mix(PF, 32)}, inset 0 0 0 1px ${mix("black", 10)}`,
};
const CHART = [
  "var(--chart-1, var(--primary))",
  "var(--chart-2, #10b981)",
  "var(--chart-3, #f59e0b)",
  "var(--chart-4, #8b5cf6)",
  "var(--chart-5, #ef4444)",
];

/* the scene, drawn at 364 × 168 and scaled to the stage */
const W = 364;
const H = 168;
/** One animation frame on the stage: he and his luggage stand in it. */
const FRAME_H = 152;
const FRAME_W = (F.w / F.h) * FRAME_H;

type Mode = "lean" | "full" | "roomy";

/** Pack, animated: each mode is a loop of frames, and the changes between them are clips. */
function PackSprite({ mode, reduced }: { mode: Mode; reduced: boolean }) {
  const sprite = React.useRef<HTMLDivElement>(null);
  const was = React.useRef<Mode | null>(null);

  React.useEffect(() => {
    preloadStrips(Object.values(ART));
  }, []);

  React.useEffect(() => {
    const el = sprite.current;
    if (!el) return;
    const prev = was.current;
    was.current = mode;
    const loop = (clip: "lean" | "push" | "cheer") =>
      playStrip(el, {
        src: ART[clip],
        frames: F.clips[clip].frames,
        fps: F.clips[clip].fps,
        size: FRAME_W,
        height: FRAME_H,
        reduced,
      });
    const idle = {
      lean: () => loop("lean"),
      full: () => loop("push"),
      roomy: () => loop("cheer"),
    }[mode];
    if (prev === null || prev === mode || reduced) return void idle();
    if (prev === "lean" && mode === "full") {
      // the case bulges and he climbs on top to hold it shut
      playStrip(el, {
        src: ART.fill,
        frames: F.clips.fill.frames,
        fps: F.clips.fill.fps,
        size: FRAME_W,
        height: FRAME_H,
        loop: false,
        onEnd: idle,
      });
      return;
    }
    if (prev === "full" && mode === "lean") {
      // the same, backwards: the clothes go back in and he climbs down
      playStrip(el, {
        src: ART.fill,
        frames: F.clips.fill.frames,
        fps: F.clips.fill.fps,
        size: FRAME_W,
        height: FRAME_H,
        loop: false,
        reverse: true,
        onEnd: idle,
      });
      return;
    }
    // a different case altogether: a quick pop between them
    idle();
    el.parentElement?.animate(
      [
        {
          opacity: 0,
          transform: "translateY(6px) scale(0.94)",
          filter: "blur(3px)",
        },
        { opacity: 1, transform: "none", filter: "blur(0px)" },
      ],
      { duration: 420, easing: "cubic-bezier(0.34,1.36,0.64,1)" },
    );
  }, [mode, reduced]);

  return (
    <div
      className="absolute"
      style={{
        left: W / 2 - FRAME_W / 2 + 26,
        top: H - FRAME_H - 4,
        width: FRAME_W,
        height: FRAME_H,
        transformOrigin: "50% 100%",
      }}
    >
      <div ref={sprite} className="size-full" />
    </div>
  );
}

function bytes(n: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let v = Math.max(0, n);
  let i = 0;
  while (v >= 1000 && i < units.length - 1) {
    v /= 1000;
    i++;
  }
  return { value: v, unit: units[i], digits: v < 10 && i > 0 ? 1 : 0 };
}

function Size({ n }: { n: number }) {
  const b = bytes(n);
  return (
    <span className="whitespace-nowrap tabular-nums">
      <NumberRoll
        value={b.value}
        format={{
          maximumFractionDigits: b.digits,
          minimumFractionDigits: b.digits,
        }}
      />{" "}
      {b.unit}
    </span>
  );
}

export function Storage({
  used,
  limit,
  kinds = [],
  onCleanUp,
  cleanUpLabel = "Clean up",
  onUpgrade,
  upgradeLabel = "Upgrade",
  roomy = false,
  name = "Pack",
  className = "",
}: StorageProps) {
  const reduced = useInteractionReducedMotion();
  const baseId = React.useId();
  const [clean, setClean] = React.useState<ActionStatus>("idle");
  const [upgrade, setUpgrade] = React.useState<ActionStatus>("idle");
  const ratio = limit > 0 ? used / limit : 1;
  const full = !roomy && ratio >= 0.9;

  const mode: Mode = roomy ? "roomy" : full ? "full" : "lean";

  const run = async (
    fn: (() => Promise<unknown>) | undefined,
    set: (s: ActionStatus) => void,
  ) => {
    if (!fn) return;
    set("pending");
    try {
      await fn();
      set("success");
      window.setTimeout(() => set("idle"), 1600);
    } catch {
      set("error");
    }
  };

  const mood = roomy
    ? "Room to spare"
    : full
      ? `${name} can’t get it shut`
      : ratio >= 0.75
        ? "Getting snug in there"
        : clean === "success"
          ? "Phew. Room again"
          : "Plenty of room";
  const total = kinds.reduce((s, k) => s + k.bytes, 0);
  const left = Math.max(0, limit - used);

  return (
    <section
      aria-labelledby={`${baseId}-title`}
      className={`relative w-full max-w-[380px] rounded-[28px] p-2 text-card-foreground ${className}`}
      style={CARD}
    >
      {/* Its natural width where the parent sizes to its content, without forcing it on narrow screens. */}
      <div
        aria-hidden="true"
        data-natural-width
        className="grid h-0"
        style={{ gridTemplateColumns: "minmax(0, 380px)" }}
      />
      <div className="@container w-full">
        <div
          className="relative overflow-clip rounded-[22px] text-primary-foreground"
          style={STAGE}
        >
          <Scene>
            <PackSprite mode={mode} reduced={reduced} />
          </Scene>
          <p className="absolute left-3.5 top-3 z-10 text-[12.5px] font-medium text-primary-foreground/85">
            <TextMorph>{mood}</TextMorph>
          </p>
        </div>

        <div className="px-3 pb-1 pt-3">
          <div className="flex items-baseline justify-between gap-3">
            <h2
              id={`${baseId}-title`}
              className="text-[15px] font-medium tracking-[-0.01em]"
            >
              Storage
            </h2>
            <p
              className={`text-[12.5px] ${full ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}
            >
              <span className="font-medium text-foreground">
                <Size n={used} />
              </span>{" "}
              of <Size n={limit} />
            </p>
          </div>

          {/* what it's used by: one bar, one segment per kind, and the space left */}
          <div
            className="mt-2.5 flex h-2.5 w-full gap-[2px] overflow-clip rounded-full"
            role="meter"
            aria-label="Storage used"
            aria-valuemin={0}
            aria-valuemax={limit}
            aria-valuenow={used}
            aria-valuetext={`${bytes(used).value.toFixed(bytes(used).digits)} ${bytes(used).unit} of ${bytes(limit).value.toFixed(bytes(limit).digits)} ${bytes(limit).unit} used`}
            style={{ background: mix("var(--foreground)", 7) }}
          >
            {(kinds.length
              ? kinds
              : [{ id: "used", label: "Used", bytes: used }]
            ).map((k, i) => (
              <span
                key={k.id}
                className="h-full shrink-0 first:rounded-l-full"
                style={{
                  width: `${(Math.min(k.bytes, limit) / Math.max(1, limit)) * 100 * (kinds.length && total > used ? used / total : 1)}%`,
                  background: k.color ?? CHART[i % CHART.length],
                  transition: reduced ? "none" : `width 700ms ${EASE_OUT}`,
                }}
              />
            ))}
          </div>
          {kinds.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
              {kinds.map((k, i) => (
                <li key={k.id} className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: k.color ?? CHART[i % CHART.length] }}
                  />
                  {k.label}
                  <span className="text-foreground">
                    <Size n={k.bytes} />
                  </span>
                </li>
              ))}
              <li className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full"
                  style={{ background: mix("var(--foreground)", 12) }}
                />
                Free
                <span className="text-foreground">
                  <Size n={left} />
                </span>
              </li>
            </ul>
          )}
        </div>

        {(onCleanUp || onUpgrade) && (
          <div className="flex gap-2 px-2 pb-1 pt-3">
            {onCleanUp && (
              <StatusButton
                variant="outline"
                status={clean}
                labels={{
                  idle: cleanUpLabel,
                  pending: "Cleaning up",
                  success: "Cleaned up",
                  error: "Try again",
                }}
                onClick={() => run(onCleanUp, setClean)}
                className="h-10 flex-1 text-[13.5px]"
              />
            )}
            {onUpgrade && !roomy && (
              <StatusButton
                status={upgrade}
                labels={{
                  idle: upgradeLabel,
                  pending: "Upgrading",
                  success: "Upgraded",
                  error: "Try again",
                }}
                onClick={() => run(onUpgrade, setUpgrade)}
                className="h-10 flex-1 text-[13.5px]"
                style={upgrade === "error" ? undefined : LIT}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/** The stage's scene, drawn at 364 × 168 and scaled to fit. */
function Scene({ children }: { children: React.ReactNode }) {
  const host = React.useRef<HTMLDivElement>(null);
  const scene = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const h = host.current;
    const s = scene.current;
    if (!h || !s) return;
    const fit = () =>
      s.style.setProperty("transform", `scale(${h.clientWidth / W})`);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(h);
    return () => ro.disconnect();
  }, []);
  return (
    <div
      ref={host}
      aria-hidden="true"
      className="relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <div
        ref={scene}
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: W, height: H }}
      >
        {children}
      </div>
    </div>
  );
}

export default Storage;
