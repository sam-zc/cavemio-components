"use client";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
} from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import {
  Captions,
  Check,
  ChevronLeft,
  ChevronRight,
  Expand,
  LoaderCircle,
  Pause,
  PictureInPicture2,
  Play,
  Settings2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useVideoPlayer, useVideoState } from "./video-player-context";
import { formatVideoTime } from "./video-player-utils";
import { useVideoTimeline, videoFullscreenMotion } from "./video-player-motion";

gsap.registerPlugin(CustomEase);
// A soft start leaves time to see the neck before the surface separates.
const tooltipPourEase = CustomEase.create(
  "cavemio-tooltip-pour",
  "M0,0 C0.12,0 0.18,0.15 0.28,0.55 C0.42,1.1 0.55,1.08 0.68,1.02 C0.8,0.98 0.9,1 1,1",
);

const buttonStyle =
  "relative z-10 h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-white/85 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-35 [&>svg]:size-[14px]";
export function VideoButton({
  label,
  children,
  className = "inline-flex",
  ...props
}: ComponentPropsWithRef<"button"> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`${buttonStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
export function VideoPlayButton() {
  const { togglePlayback, animated } = useVideoPlayer();
  const paused = useVideoState((s) => s.paused);
  const icon = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (!icon.current || !animated) return;
    const tween = gsap.fromTo(
      icon.current,
      { scale: 0.76, opacity: 0.4 },
      { scale: 1, opacity: 1, duration: 0.24, ease: "back.out(1.5)" },
    );
    return () => {
      tween.kill();
      gsap.set(icon.current, { clearProps: "transform,opacity" });
    };
  }, [paused, animated]);
  return (
    <VideoButton label={paused ? "Play" : "Pause"} onClick={togglePlayback}>
      <span ref={icon} className="inline-flex [&>svg]:size-[14px]">
        {paused ? <Play fill="currentColor" /> : <Pause fill="currentColor" />}
      </span>
    </VideoButton>
  );
}
/** Both corner states stay mounted, so quick reversals blend from the visible frame. */
function VideoFullscreenIcon({
  active,
  animated,
}: {
  active: boolean;
  animated: boolean;
}) {
  const outward = useRef<SVGSVGElement>(null);
  const inward = useRef<SVGSVGElement>(null);
  const initialized = useRef(false);
  useLayoutEffect(() => {
    const entering = active ? inward.current : outward.current;
    const leaving = active ? outward.current : inward.current;
    const duration =
      initialized.current && animated ? videoFullscreenMotion.iconDuration : 0;
    initialized.current = true;
    const show = gsap.to(entering, {
      opacity: 1,
      scale: 1,
      duration,
      ease: videoFullscreenMotion.ease,
      overwrite: true,
    });
    const hide = gsap.to(leaving, {
      opacity: 0,
      scale: 0.6,
      duration,
      ease: videoFullscreenMotion.ease,
      overwrite: true,
    });
    return () => {
      show.kill();
      hide.kill();
    };
  }, [active, animated]);
  return (
    <span
      aria-hidden
      className="relative inline-flex size-4"
      data-fullscreen-icon
    >
      <svg
        ref={outward}
        data-fullscreen-state="enter"
        viewBox="0 0 16 16"
        className="absolute inset-0 size-4 origin-center"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2.5 6V2.5H6 M10 2.5H13.5V6 M13.5 10V13.5H10 M6 13.5H2.5V10" />
      </svg>
      <svg
        ref={inward}
        data-fullscreen-state="exit"
        viewBox="0 0 16 16"
        className="absolute inset-0 size-4 origin-center opacity-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2.5V6H2.5 M13.5 6H10V2.5 M10 13.5V10H13.5 M2.5 10H6V13.5" />
      </svg>
    </span>
  );
}

function VideoFullscreenButton() {
  const context = useVideoPlayer();
  const active = context.expanded || context.fullscreen;
  return (
    <VideoButton
      label={active ? "Exit fullscreen" : "Fullscreen"}
      aria-pressed={active}
      aria-keyshortcuts="f"
      data-fullscreen-control
      disabled={!active && !context.canExpand}
      onClick={
        context.fullscreen ? context.toggleFullscreen : context.toggleExpanded
      }
    >
      <VideoFullscreenIcon active={active} animated={context.animated} />
    </VideoButton>
  );
}

export function VideoVolume() {
  const { store, animated, gooey } = useVideoPlayer();
  const muted = useVideoState((s) => s.muted || s.volume === 0);
  const volume = useVideoState((s) => s.volume);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const decoration = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dragging = useRef(false);
  const geometry = useRef({
    x: 6,
    y: 6,
    width: 32,
    height: 32,
    radius: 16,
    opacity: 0,
  });
  const id = `volume-goo-${useId().replace(/:/g, "")}`;
  const reveal = () => {
    clearTimeout(timer.current);
    setOpen(true);
  };
  const dismiss = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => {
        if (
          !dragging.current &&
          !root.current?.matches(":hover") &&
          !root.current?.querySelector(":focus-visible")
        )
          setOpen(false);
      },
      animated ? 120 : 0,
    );
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  useLayoutEffect(() => {
    const state = geometry.current;
    const render = () => {
      gsap.set([panel.current, copy.current], {
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height,
        borderRadius: state.radius,
      });
      gsap.set(decoration.current, { opacity: state.opacity });
    };
    gsap.killTweensOf(state);
    if (open) state.opacity = 1;
    const tween = gsap.to(state, {
      x: open ? 2 : 6,
      y: open ? -114 : 6,
      width: open ? 40 : 32,
      height: open ? 112 : 32,
      radius: open ? 13 : 16,
      duration: animated ? (open ? 0.45 : 0.29) : 0,
      ease: open ? tooltipPourEase : "power3.inOut",
      onUpdate: render,
      onComplete: () => {
        if (!open) {
          state.opacity = 0;
          render();
        }
      },
    });
    const fade = gsap.to(rail.current, {
      opacity: open ? 1 : 0,
      duration: animated ? 0.16 : 0,
      delay: animated && open ? 0.1 : 0,
    });
    render();
    return () => {
      tween.kill();
      fade.kill();
    };
  }, [open, animated]);
  const level = muted ? 0 : volume;
  return (
    <div
      ref={root}
      className="relative z-20 flex items-center"
      data-volume-control
      data-volume-open={open}
      onPointerEnter={reveal}
      onPointerLeave={dismiss}
      onFocus={reveal}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          clearTimeout(timer.current);
          setOpen(false);
        }
      }}
    >
      <VideoButton
        label={muted ? "Unmute" : "Mute"}
        aria-pressed={muted}
        aria-keyshortcuts="m"
        onClick={() => {
          reveal();
          store.toggleMute();
        }}
      >
        {muted ? <VolumeX /> : <Volume2 />}
      </VideoButton>
      <svg
        aria-hidden
        width="0"
        height="0"
        className="pointer-events-none absolute"
      >
        <defs>
          <filter
            id={id}
            x="-100%"
            y="-500%"
            width="300%"
            height="1000%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 22 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div
        ref={decoration}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0"
      >
        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute inset-0"
            data-volume-gooey
            style={{ filter: gooey && animated ? `url(#${id})` : undefined }}
          >
            <div className="absolute left-[6px] top-[6px] size-8 rounded-full bg-white" />
            <div ref={copy} className="absolute left-0 top-0 bg-white" />
          </div>
        </div>
        <div className="absolute left-[6px] top-[6px] size-8 rounded-full bg-white/15 backdrop-blur-xl" />
        <div
          ref={panel}
          data-volume-surface
          className="absolute left-0 top-0 overflow-hidden bg-white/15 backdrop-blur-xl"
        >
          <div
            ref={rail}
            className="absolute bottom-0 left-1/2 h-28 w-10 -translate-x-1/2 opacity-0"
          >
            <div className="absolute bottom-4 left-1/2 top-4 w-1 -translate-x-1/2 rounded-full bg-white/30">
              <div
                className="absolute inset-x-0 bottom-0 rounded-full bg-white"
                style={{ height: `${level * 100}%` }}
              />
              <div
                className="absolute left-1/2 size-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-white"
                style={{ bottom: `${level * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden={!open}
        inert={!open}
        className="absolute -top-[114px] left-0 h-[114px] w-11 rounded-xl has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={level}
          aria-label="Volume"
          aria-orientation="vertical"
          aria-valuetext={`${Math.round(level * 100)} percent`}
          onChange={(e) => store.setVolume(Number(e.target.value))}
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerUp={() => {
            dragging.current = false;
            dismiss();
          }}
          onPointerCancel={() => {
            dragging.current = false;
            dismiss();
          }}
          onLostPointerCapture={() => {
            dragging.current = false;
            dismiss();
          }}
          className="absolute inset-x-0 bottom-4 top-4 m-0 w-11 cursor-pointer opacity-0"
          style={{
            writingMode: "vertical-lr",
            direction: "rtl",
            touchAction: "none",
          }}
        />
      </div>
    </div>
  );
}
function VideoTime({ remaining = false }: { remaining?: boolean }) {
  const time = useVideoState((s) => s.time);
  const duration = useVideoState((s) => s.duration);
  const live = useVideoState((s) => s.range.live);
  return (
    <span className="relative z-10 shrink-0 whitespace-nowrap px-1 text-[11px] tabular-nums text-white/85">
      {remaining && live
        ? "LIVE"
        : `${remaining ? "−" : ""}${formatVideoTime(remaining ? duration - time : time).padStart(5, "0")}`}
    </span>
  );
}
export function VideoSeekbar({
  onScrubbingChange,
  onEngagementChange,
}: {
  onScrubbingChange?: (scrubbing: boolean) => void;
  onEngagementChange?: (engaged: boolean) => void;
}) {
  const { store, video } = useVideoPlayer();
  const time = useVideoState((s) => s.time);
  const range = useVideoState((s) => s.range);
  const buffered = useVideoState((s) => s.buffered);
  const [scrub, setScrub] = useState<number | null>(null);
  const [preview, setPreview] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const dragging = useRef(false);
  const pointer = useRef<number | null>(null);
  const span = range.end - range.start;
  const percent = (value: number) =>
    span > 0
      ? Math.max(0, Math.min(100, ((value - range.start) / span) * 100))
      : 0;
  const finish = () => {
    dragging.current = false;
    setScrub(null);
    onScrubbingChange?.(false);
  };
  useEffect(() => {
    onEngagementChange?.(hovered || focused || scrub !== null);
  }, [hovered, focused, scrub, onEngagementChange]);
  const point = (clientX: number) => {
    const rect = input.current!.getBoundingClientRect();
    return (
      range.start +
      Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * span
    );
  };
  // Re-map the held pointer as the timeline widens underneath it.
  useEffect(() => {
    const el = input.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      if (pointer.current === null) return;
      const value = point(pointer.current);
      if (dragging.current) {
        setScrub(value);
        store.seek(value);
      } else if (hovered) setPreview(value);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [span, range.start, hovered, store]);
  const previewTime = scrub ?? preview ?? time;
  const playedTime = scrub ?? time;
  const showPreview =
    span > 0 && (preview !== null || scrub !== null || focused);
  return (
    <div
      data-seek-control
      className="group/seek relative flex h-full min-h-8 w-full items-center"
      data-scrubbing={scrub !== null}
      onPointerEnter={(e) => {
        if (e.pointerType !== "touch") setHovered(true);
      }}
      onPointerLeave={() => {
        setHovered(false);
        setPreview(null);
        if (!dragging.current) pointer.current = null;
      }}
    >
      <div
        data-seek-track
        className="pointer-events-none absolute inset-x-0 overflow-hidden bg-white/15 backdrop-blur-xl group-has-[:focus-visible]/seek:outline-2 group-has-[:focus-visible]/seek:outline-offset-[3px] group-has-[:focus-visible]/seek:outline-ring"
        style={{
          height: "var(--timeline-track-height, 4px)",
          borderRadius: "var(--timeline-radius, 2px)",
        }}
      >
        {buffered.map(([start, end], i) => (
          <span
            key={i}
            data-seek-buffered
            className="absolute h-full bg-white/[0.16]"
            style={{
              left: `${percent(Math.max(start, playedTime))}%`,
              width: `${Math.max(0, percent(end) - percent(Math.max(start, playedTime)))}%`,
            }}
          />
        ))}
        <span
          data-seek-played
          className="absolute inset-y-0 left-0"
          style={{
            width: `${percent(scrub ?? time)}%`,
            background:
              "rgb(255 255 255 / calc(1 - var(--timeline-progress, 0) * 0.6))",
          }}
        />
      </div>
      {showPreview && (
        <span
          aria-hidden
          data-seek-marker
          className="pointer-events-none absolute w-px -translate-x-1/2 rounded-full"
          style={{
            left: `${percent(previewTime)}%`,
            height: "var(--timeline-marker-height, 36px)",
            background:
              "color-mix(in srgb, var(--primary) calc(var(--timeline-progress, 0) * 100%), rgb(255 255 255 / 0.48))",
          }}
        />
      )}
      {showPreview && (
        <span
          aria-hidden
          data-seek-preview
          className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap text-xs leading-4 tabular-nums"
          style={{
            left: `clamp(44px, ${percent(previewTime)}%, calc(100% - 44px))`,
            bottom: "calc(50% + var(--timeline-label-offset, 32px))",
            color:
              "color-mix(in srgb, var(--primary) calc(var(--timeline-progress, 0) * 100%), white)",
          }}
        >
          {formatVideoTime(previewTime).padStart(5, "0")}
          <span className="text-white/50">
            {" "}
            /{" "}
            {range.live ? "LIVE" : formatVideoTime(range.end).padStart(5, "0")}
          </span>
        </span>
      )}
      <input
        ref={input}
        type="range"
        aria-label={range.live ? "Seek live window" : "Seek"}
        aria-valuetext={`${formatVideoTime(scrub ?? time)}${range.live ? ", live window" : ` of ${formatVideoTime(range.end)}`}`}
        min={range.start}
        max={Math.max(range.start, range.end)}
        step={0.1}
        value={Math.min(range.end, Math.max(range.start, scrub ?? time))}
        disabled={span <= 0}
        className="absolute inset-0 m-0 h-full min-h-8 w-full cursor-grab touch-none appearance-none opacity-0 disabled:cursor-default [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-px [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:w-px [&::-moz-range-thumb]:border-0"
        style={{ cursor: scrub !== null ? "grabbing" : undefined }}
        onFocus={(e) => setFocused(e.currentTarget.matches(":focus-visible"))}
        onBlur={() => {
          setFocused(false);
          setPreview(null);
        }}
        onPointerDown={(e) => {
          if (e.button !== 0 || span <= 0) return;
          e.preventDefault();
          e.currentTarget.focus({ preventScroll: true });
          setFocused(false);
          e.currentTarget.setPointerCapture(e.pointerId);
          dragging.current = true;
          pointer.current = e.clientX;
          const value = point(e.clientX);
          setScrub(value);
          store.seek(value);
          onScrubbingChange?.(true);
        }}
        onPointerUp={(e) => {
          if (e.pointerType === "touch") {
            pointer.current = null;
            setHovered(false);
            setFocused(false);
            setPreview(null);
          }
          finish();
          if (e.currentTarget.hasPointerCapture(e.pointerId))
            e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onPointerCancel={() => {
          pointer.current = null;
          setHovered(false);
          setPreview(null);
          finish();
        }}
        onLostPointerCapture={() => {
          if (dragging.current) {
            pointer.current = null;
            setHovered(false);
            setPreview(null);
            finish();
          }
        }}
        onPointerMove={(e) => {
          pointer.current = e.clientX;
          const value = point(e.clientX);
          setPreview(value);
          if (dragging.current) {
            setScrub(value);
            store.seek(value);
          }
        }}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (scrub !== null) setScrub(value);
          store.seek(value);
        }}
        onKeyDown={(e) => {
          if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
            e.preventDefault();
            finish();
            pointer.current = null;
            setFocused(true);
            setPreview(null);
            store.seek(
              e.key === "Home"
                ? range.start
                : e.key === "End"
                  ? range.end
                  : (video.current?.currentTime ?? time) +
                    (e.key === "ArrowRight" ? 5 : -5),
            );
          }
        }}
      />
    </div>
  );
}

function GooeySurface({
  host,
  menu,
  animated,
  enabled,
}: {
  host: React.RefObject<HTMLDivElement | null>;
  menu: boolean;
  animated: boolean;
  enabled: boolean;
}) {
  const id = `video-goo-${useId().replace(/:/g, "")}`;
  const surface = useRef<HTMLDivElement>(null);
  const decoration = useRef<HTMLDivElement>(null);
  const base = useRef<HTMLDivElement>(null),
    baseCopy = useRef<HTMLDivElement>(null);
  const tip = useRef<HTMLDivElement>(null),
    tipCopy = useRef<HTMLDivElement>(null);
  const caption = useRef<HTMLDivElement>(null);
  const firstLabel = useRef<HTMLSpanElement>(null),
    secondLabel = useRef<HTMLSpanElement>(null);
  const measure = useRef<HTMLSpanElement>(null);
  const active = useRef<HTMLButtonElement | null>(null);
  const phase = useRef<"hidden" | "entering" | "shown" | "closing">("hidden");
  const label = useRef("");
  const labelIndex = useRef(0);
  const geometry = useRef({
    x: 0,
    y: 0,
    width: 32,
    height: 32,
    radius: 16,
    baseX: 0,
    baseY: 0,
    opacity: 0,
  });

  useLayoutEffect(() => {
    const el = host.current;
    if (!el || !decoration.current || !caption.current || !measure.current)
      return;
    const state = geometry.current;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
    const labels = [firstLabel.current!, secondLabel.current!];
    gsap.set(labels, { x: 0, xPercent: -50 });
    const writeLabel = (
      node: HTMLElement,
      value: string,
      shortcut?: string,
    ) => {
      node.replaceChildren(document.createTextNode(value));
      if (shortcut) {
        const key = document.createElement("kbd");
        key.className =
          "ml-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded bg-white/20 px-1 font-sans text-[10px]";
        key.textContent = shortcut;
        node.append(key);
      }
    };
    // One persistent surface travels between targets. Filtered copies make the
    // short liquid join; unfiltered foregrounds keep the settled edges crisp.
    const render = () => {
      const frame = {
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height,
        borderRadius: state.radius,
      };
      gsap.set([tip.current, tipCopy.current], frame);
      gsap.set([base.current, baseCopy.current], {
        x: state.baseX,
        y: state.baseY,
      });
      gsap.set(decoration.current, { opacity: state.opacity });
      gsap.set(caption.current, {
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height,
      });
    };
    const setPhase = (value: typeof phase.current) => {
      phase.current = value;
      decoration.current!.dataset.tooltipPhase = value;
    };
    const eligible = (target: EventTarget | null): HTMLButtonElement | null => {
      const button =
        target instanceof Element
          ? (target.closest("button") ??
            target.closest("[data-volume-control]")?.querySelector("button"))
          : null;
      return button &&
        el.contains(button) &&
        !button.disabled &&
        !button.closest("[data-volume-control]") &&
        !button.closest('[role="menu"]') &&
        button.getClientRects().length &&
        button.getAttribute("aria-label")
        ? button
        : null;
    };
    const hide = (immediate = false) => {
      clearTimeout(timer);
      active.current = null;
      gsap.killTweensOf(state);
      gsap.killTweensOf([caption.current, ...labels]);
      if (phase.current === "hidden" || immediate || !animated) {
        state.opacity = 0;
        gsap.set(caption.current, { opacity: 0 });
        setPhase("hidden");
        render();
        return;
      }
      setPhase("closing");
      gsap.to(caption.current, { opacity: 0, duration: 0.1 });
      gsap.to(state, {
        x: state.baseX,
        y: state.baseY,
        width: 32,
        height: 32,
        radius: 16,
        duration: 0.29,
        ease: "power3.inOut",
        onUpdate: render,
        onComplete: () => {
          state.opacity = 0;
          setPhase("hidden");
          render();
        },
      });
    };
    const show = (button: HTMLButtonElement, instant = false) => {
      if (menu || !eligible(button)) {
        hide(true);
        return;
      }
      clearTimeout(timer);
      const rect = button.getBoundingClientRect(),
        root = el.getBoundingClientRect();
      const center = rect.left - root.left + rect.width / 2;
      const baseX = center - 16,
        baseY = rect.top - root.top + (rect.height - 32) / 2;
      const value = button.getAttribute("aria-label")!;
      writeLabel(measure.current!, value, button.dataset.tooltipShortcut);
      const textWidth = measure.current!.getBoundingClientRect().width;
      const width = Math.min(root.width, textWidth + 24);
      const x = Math.max(0, Math.min(root.width - width, center - width / 2));
      // Leave a real gap at rest: the filtered neck stretches, then breaks.
      const y = baseY - 34 - 12;
      const entering = phase.current === "hidden";
      const changed = label.current !== value;
      if (
        !instant &&
        !entering &&
        phase.current !== "closing" &&
        active.current === button &&
        !changed
      )
        return;
      active.current = button;
      gsap.killTweensOf(state);
      gsap.killTweensOf([caption.current, ...labels]);
      if (entering) {
        Object.assign(state, {
          x: baseX,
          y: baseY,
          width: 32,
          height: 32,
          radius: 16,
          baseX,
          baseY,
          opacity: 1,
        });
        render();
      } else state.opacity = 1;
      const current = labels[labelIndex.current];
      const next =
        entering || !changed ? current : labels[1 - labelIndex.current];
      next.style.width = `${textWidth}px`;
      if (changed || entering) {
        writeLabel(next, value, button.dataset.tooltipShortcut);
        gsap.set(next, {
          x: 0,
          xPercent: -50,
          opacity: 0,
          y: animated && !instant ? 4 : 0,
        });
      }
      if (next !== current) {
        gsap.to(current, {
          opacity: 0,
          y: animated && !instant ? -4 : 0,
          duration: animated && !instant ? 0.12 : 0,
        });
        labelIndex.current = 1 - labelIndex.current;
      } else gsap.set(labels[1 - labelIndex.current], { opacity: 0 });
      label.current = value;
      gsap.to(next, {
        opacity: 1,
        y: 0,
        duration: animated && !instant ? 0.18 : 0,
        delay: animated && entering && !instant ? 0.1 : 0,
      });
      gsap.to(caption.current, {
        opacity: 1,
        duration: animated && !instant ? 0.18 : 0,
        delay: animated && entering && !instant ? 0.1 : 0,
      });
      setPhase(entering ? "entering" : "shown");
      gsap.to(state, {
        baseX,
        baseY,
        duration: animated && !instant ? 0.2 : 0,
        ease: "power3.out",
        onUpdate: render,
      });
      gsap.to(state, {
        x,
        y,
        width,
        height: 34,
        radius: 10,
        duration: animated && !instant ? (entering ? 0.45 : 0.32) : 0,
        ease: entering ? tooltipPourEase : "power3.out",
        onUpdate: render,
        onComplete: () => setPhase("shown"),
      });
    };
    const leave = () => {
      clearTimeout(timer);
      timer = setTimeout(
        () => {
          const focused = eligible(el.querySelector(":focus-visible"));
          if (focused) show(focused);
          else hide();
        },
        animated ? 120 : 0,
      );
    };
    const over = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const button = eligible(event.target);
      if (button) show(button);
      else leave();
    };
    const focus = (event: FocusEvent) => {
      const button = eligible(event.target);
      if (button) show(button);
      else leave();
    };
    const refresh = () => {
      if (active.current) show(active.current, true);
    };
    const observer = new ResizeObserver(refresh);
    observer.observe(el);
    const mutations = new MutationObserver(() => {
      if (active.current) show(active.current);
    });
    mutations.observe(el, {
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-label", "disabled"],
    });
    void document.fonts.ready.then(() => {
      if (!disposed) refresh();
    });
    el.addEventListener("pointerover", over);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("focusin", focus);
    el.addEventListener("focusout", leave);
    if (menu) hide(true);
    else {
      const target =
        active.current ?? eligible(el.querySelector(":focus-visible"));
      if (target) show(target, true);
      else hide(true);
    }
    return () => {
      disposed = true;
      clearTimeout(timer);
      observer.disconnect();
      mutations.disconnect();
      el.removeEventListener("pointerover", over);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("focusin", focus);
      el.removeEventListener("focusout", leave);
      gsap.killTweensOf(state);
      gsap.killTweensOf([caption.current, ...labels]);
    };
  }, [host, animated, menu]);
  useLayoutEffect(() => {
    if (!surface.current) return;
    const tween = gsap.to(
      surface.current.querySelectorAll("[data-menu-surface]"),
      {
        opacity: menu ? 1 : 0,
        scale: menu ? 1 : 0.2,
        y: menu ? 0 : 32,
        duration: animated ? (menu ? 0.42 : 0.22) : 0,
        ease: "back.out(1.4)",
        stagger: animated ? 0.035 : 0,
      },
    );
    return () => {
      tween.kill();
    };
  }, [menu, animated]);
  return (
    <>
      <svg
        aria-hidden
        width="0"
        height="0"
        className="pointer-events-none absolute"
      >
        <defs>
          <filter
            id={id}
            x="-50%"
            y="-300%"
            width="200%"
            height="500%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 22 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div
        ref={decoration}
        aria-hidden
        data-tooltip-phase="hidden"
        className="pointer-events-none absolute inset-0 opacity-0"
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{ filter: enabled && animated ? `url(#${id})` : undefined }}
          data-gooey-layer={enabled && animated}
        >
          <div
            ref={baseCopy}
            className="absolute left-0 top-0 size-8 rounded-full bg-white"
          />
          <div ref={tipCopy} className="absolute left-0 top-0 bg-white" />
        </div>
        <div
          ref={base}
          className="absolute left-0 top-0 size-8 rounded-full bg-white/15 backdrop-blur-xl"
        />
        <div
          ref={tip}
          data-hover-tooltip-surface
          className="absolute left-0 top-0 bg-white/15 backdrop-blur-xl"
        />
      </div>
      <div
        ref={caption}
        aria-hidden
        data-hover-tooltip-caption
        className="pointer-events-none absolute left-0 top-0 z-20 overflow-visible text-[11px] text-white opacity-0"
      >
        <span
          ref={firstLabel}
          className="absolute left-1/2 top-0 flex h-full items-center justify-center whitespace-nowrap opacity-0"
        />
        <span
          ref={secondLabel}
          className="absolute left-1/2 top-0 flex h-full items-center justify-center whitespace-nowrap opacity-0"
        />
      </div>
      <span
        ref={measure}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 flex items-center whitespace-nowrap text-[11px]"
      />
      <div
        ref={surface}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{ filter: enabled && animated ? `url(#${id})` : undefined }}
      >
        <div
          data-menu-surface
          className="absolute right-[54px] bottom-6 h-14 w-6 origin-bottom rounded-full bg-white"
          style={{ opacity: 0 }}
        />
        <div
          data-menu-surface
          className="absolute right-0 bottom-[60px] h-[min(280px,50cqh)] w-[min(268px,85cqw)] origin-bottom-right rounded-2xl bg-white"
          style={{ opacity: 0 }}
        />
      </div>
    </>
  );
}

type SettingsPage = "main" | "quality" | "speed" | "audio" | "captions";
export function VideoSettings({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void;
}) {
  const context = useVideoPlayer();
  const { store, animated } = context;
  const qualities = useVideoState((s) => s.qualities);
  const selected = useVideoState((s) => s.selectedQuality);
  const audio = useVideoState((s) => s.audio);
  const captions = useVideoState((s) => s.captions);
  const rate = useVideoState((s) => s.rate);
  const range = useVideoState((s) => s.range);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<SettingsPage>("main");
  const trigger = useRef<HTMLButtonElement>(null),
    panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const close = () => {
    setOpen(false);
    onOpenChange?.(false);
    trigger.current?.focus({ preventScroll: true });
  };
  useLayoutEffect(() => {
    if (!panel.current) return;
    const el = panel.current;
    const tween = gsap.to(el, {
      opacity: open ? 1 : 0,
      y: open || !animated ? 0 : 8,
      duration: animated ? (open ? 0.24 : 0.14) : 0,
      delay: animated && open ? 0.06 : 0,
    });
    if (open)
      el.querySelector<HTMLElement>('[role^="menuitem"]')?.focus({
        preventScroll: true,
      });
    return () => {
      tween.kill();
    };
  }, [open, page, animated]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !panel.current?.contains(event.target) &&
        !trigger.current?.contains(event.target)
      ) {
        setOpen(false);
        onOpenChange?.(false);
      }
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, onOpenChange]);
  const choose = (fn: () => void) => {
    fn();
    close();
  };
  const option = (
    label: string,
    checked: boolean,
    action: () => void,
    key: string,
  ) => (
    <button
      key={key}
      type="button"
      role="menuitemradio"
      aria-checked={checked}
      onClick={() => choose(action)}
      className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 text-left text-xs hover:bg-white/10 focus-visible:bg-white/15 focus-visible:outline-none"
    >
      <span>{label}</span>
      {checked && <Check className="size-3.5 shrink-0" />}
    </button>
  );
  return (
    <>
      <VideoButton
        ref={trigger}
        label="Playback settings"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => {
          const next = !open;
          setOpen(next);
          setPage("main");
          onOpenChange?.(next);
        }}
      >
        <Settings2 />
      </VideoButton>
      {
        <div
          ref={panel}
          id={id}
          role="menu"
          aria-label="Playback settings"
          aria-hidden={!open}
          inert={!open}
          style={{ opacity: 0, pointerEvents: open ? "auto" : "none" }}
          className="absolute right-0 bottom-[60px] z-30 flex h-[min(280px,50cqh)] w-[min(268px,85cqw)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/15 backdrop-blur-xl p-2 text-white"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              e.stopPropagation();
              if (page === "main") close();
              else setPage("main");
            }
            if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
              e.preventDefault();
              e.stopPropagation();
              const items = Array.from(
                e.currentTarget.querySelectorAll<HTMLElement>(
                  '[role^="menuitem"]:not(:disabled)',
                ),
              );
              const index = items.indexOf(
                document.activeElement as HTMLElement,
              );
              items[
                e.key === "Home"
                  ? 0
                  : e.key === "End"
                    ? items.length - 1
                    : (index +
                        (e.key === "ArrowDown" ? 1 : -1) +
                        items.length) %
                      items.length
              ]?.focus();
            }
            if (e.key === "Tab") {
              close();
            }
          }}
        >
          <div className="mb-1 flex shrink-0 items-center justify-between border-b border-white/10 pb-1 text-[11px] text-white/60">
            <button
              type="button"
              role="menuitem"
              aria-label={
                page === "main" ? "Close settings" : "Back to settings"
              }
              onClick={() => (page === "main" ? close() : setPage("main"))}
              className="flex h-10 items-center gap-2 rounded-lg px-2 focus-visible:outline-2 focus-visible:outline-ring"
            >
              {page === "main" ? (
                <Settings2 className="size-3.5" />
              ) : (
                <ChevronLeft className="size-3.5" />
              )}
              <span className="capitalize">
                {page === "main" ? "Playback" : page}
              </span>
            </button>
            <span className="pr-2">
              {page === "quality"
                ? "Buffered video may switch later"
                : "Make it yours"}
            </span>
          </div>
          <div className="min-h-0 overflow-y-auto overscroll-contain">
            {page === "main" && (
              <>
                <button
                  type="button"
                  role="menuitem"
                  disabled={
                    context.fullscreen ||
                    (!context.expanded && !context.canExpand)
                  }
                  onClick={() => choose(context.toggleExpanded)}
                  className="flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-xs hover:bg-white/10 focus-visible:bg-white/15 focus-visible:outline-none disabled:opacity-40"
                >
                  <span>
                    {context.expanded
                      ? "Exit cinematic mode"
                      : "Cinematic mode"}
                  </span>
                  <Expand className="size-3.5" />
                </button>
                <button
                  type="button"
                  role="menuitem"
                  disabled={!context.canFullscreen || context.expanded}
                  onClick={() => choose(context.toggleFullscreen)}
                  className="flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-xs hover:bg-white/10 focus-visible:bg-white/15 focus-visible:outline-none disabled:opacity-40"
                >
                  <span>
                    {context.fullscreen
                      ? "Exit browser fullscreen"
                      : "Browser fullscreen"}
                  </span>
                  <VideoFullscreenIcon
                    active={context.fullscreen}
                    animated={animated}
                  />
                </button>
                {(
                  [
                    [
                      "quality",
                      "Quality",
                      qualities.length
                        ? selected === "auto"
                          ? "Auto"
                          : qualities.find((q) => q.id === selected)?.label
                        : "Managed by browser",
                    ],
                    ["speed", "Playback speed", `${rate}×`],
                    [
                      "audio",
                      "Audio",
                      audio.find((t) => t.active)?.label ?? "Default",
                    ],
                    [
                      "captions",
                      "Captions",
                      captions.length
                        ? (captions.find((t) => t.active)?.label ?? "Off")
                        : "Unavailable",
                    ],
                  ] as const
                ).map(([key, label, value]) => (
                  <button
                    key={key}
                    type="button"
                    role="menuitem"
                    disabled={
                      (key === "quality" && !qualities.length) ||
                      (key === "audio" && !audio.length) ||
                      (key === "captions" && !captions.length)
                    }
                    onClick={() => setPage(key)}
                    className="flex min-h-11 w-full items-center justify-between gap-2 rounded-lg px-3 text-xs hover:bg-white/10 focus-visible:bg-white/15 focus-visible:outline-none disabled:opacity-40"
                  >
                    <span>{label}</span>
                    <span className="ml-auto max-w-28 truncate text-white/50">
                      {value}
                    </span>
                    <ChevronRight className="size-3" />
                  </button>
                ))}
                <div className="@min-[560px]/player-layout:hidden">
                  <button
                    type="button"
                    role="menuitem"
                    disabled={!context.canPip}
                    onClick={() => choose(context.togglePip)}
                    className="min-h-11 w-full rounded-lg px-3 text-left text-xs focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-40"
                  >
                    Picture-in-picture{!context.canPip && " unavailable"}
                  </button>
                  <label className="flex min-h-11 items-center gap-3 px-3 text-xs">
                    Volume
                    <input
                      aria-label="Volume in settings"
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      defaultValue={store.getSnapshot().volume}
                      onChange={(e) => store.setVolume(Number(e.target.value))}
                      className="w-28 accent-white"
                    />
                  </label>
                </div>
                {range.live && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => choose(() => store.seek(range.end))}
                    className="min-h-11 w-full rounded-lg px-3 text-left text-xs focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    Jump to live edge
                  </button>
                )}
              </>
            )}
            {page === "quality" && (
              <>
                {option(
                  "Auto · adaptive",
                  selected === "auto",
                  () => store.setQuality("auto"),
                  "auto",
                )}
                {qualities.map((q) =>
                  option(
                    `${q.label}${q.active ? " · active" : ""}`,
                    selected === q.id,
                    () => store.setQuality(q.id),
                    q.id,
                  ),
                )}
              </>
            )}
            {page === "speed" &&
              [0.5, 0.75, 1, 1.25, 1.5, 2].map((r) =>
                option(
                  `${r}×${r === 1 ? " · Normal" : ""}`,
                  rate === r,
                  () => store.setPlaybackRate(r),
                  String(r),
                ),
              )}
            {page === "audio" &&
              audio.map((t) =>
                option(
                  t.label,
                  t.active,
                  () => store.setAudioTrack(t.id),
                  t.id,
                ),
              )}
            {page === "captions" && (
              <>
                {option(
                  "Off",
                  !captions.some((t) => t.active),
                  () => store.setTextTrack("off"),
                  "off",
                )}
                {captions.map((t) =>
                  option(
                    t.label,
                    t.active,
                    () => store.setTextTrack(t.id),
                    t.id,
                  ),
                )}
              </>
            )}
          </div>
        </div>
      }
    </>
  );
}

export function VideoControls() {
  const context = useVideoPlayer();
  const { frame, animated, gooey } = context;
  const paused = useVideoState((s) => s.paused);
  const error = useVideoState((s) => s.error);
  const captions = useVideoState((s) => s.captions);
  const [active, setActive] = useState(true),
    [menu, setMenu] = useState(false),
    [scrubbing, setScrubbing] = useState(false);
  const [focused, setFocused] = useState(false);
  const dock = useRef<HTMLDivElement>(null),
    overlay = useRef<HTMLDivElement>(null);
  const seekSlot = useRef<HTMLDivElement>(null),
    timeline = useRef<HTMLDivElement>(null);
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const timelineEngaged = useRef(false);
  const pointerInControls = useRef(false);
  const touchInteraction = useRef(false);
  const timelineOpen = useRef(false);
  timelineOpen.current = timelineExpanded && !menu;
  const timelineDismiss = useRef(0);
  const cancelTimelineDismiss = useCallback(() => {
    timelineDismiss.current++;
  }, []);
  const dismissTimeline = useCallback(() => {
    const request = ++timelineDismiss.current;
    // Let the same pointer event update the shared hover region first. This
    // avoids gap flicker without holding the expanded state behind a timer.
    queueMicrotask(() => {
      if (
        request === timelineDismiss.current &&
        !timelineEngaged.current &&
        !pointerInControls.current &&
        (touchInteraction.current || !dock.current?.matches(":hover")) &&
        (touchInteraction.current ||
          !dock.current?.querySelector(":focus-visible"))
      )
        setTimelineExpanded(false);
    });
  }, []);
  const engageTimeline = useCallback(
    (engaged: boolean) => {
      timelineEngaged.current = engaged;
      cancelTimelineDismiss();
      if (engaged) setTimelineExpanded(true);
      else dismissTimeline();
    },
    [dismissTimeline, cancelTimelineDismiss],
  );
  useEffect(() => cancelTimelineDismiss, [cancelTimelineDismiss]);
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        touchInteraction.current = true;
        pointerInControls.current = false;
        return;
      }
      touchInteraction.current = false;
      const rail = timeline.current?.getBoundingClientRect(),
        row = dock.current?.getBoundingClientRect();
      pointerInControls.current = !!(
        timelineOpen.current &&
        rail &&
        row &&
        event.clientX >= Math.min(rail.left, row.left) - 2 &&
        event.clientX <= Math.max(rail.right, row.right) + 2 &&
        event.clientY >= Math.min(rail.top, row.top) - 2 &&
        event.clientY <= Math.max(rail.bottom, row.bottom) + 2
      );
      if (pointerInControls.current) cancelTimelineDismiss();
      else if (timelineOpen.current) dismissTimeline();
    };
    const leave = () => {
      pointerInControls.current = false;
      dismissTimeline();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [frame, dismissTimeline, cancelTimelineDismiss]);
  useVideoTimeline(
    overlay,
    dock,
    seekSlot,
    timeline,
    timelineExpanded && !menu,
    animated,
  );
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pointerFocus = useRef(false);
  const visible =
    active ||
    paused ||
    !!error ||
    menu ||
    scrubbing ||
    focused ||
    timelineExpanded;
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const reveal = (event?: PointerEvent) => {
      setActive(true);
      clearTimeout(timer.current);
      if (event?.pointerType === "touch")
        timer.current = setTimeout(() => setActive(false), 2400);
    };
    const leave = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setActive(false), 120);
    };
    const focus = () => {
      setFocused(
        !pointerFocus.current &&
          (el.matches(":focus-visible") ||
            !!el.querySelector(":focus-visible")),
      );
      setActive(true);
    };
    const pointerDown = (event: PointerEvent) => {
      touchInteraction.current = event.pointerType === "touch";
      pointerFocus.current = true;
      setFocused(false);
      reveal(event);
    };
    const keyboard = () => {
      touchInteraction.current = false;
      pointerFocus.current = false;
      if (el.contains(el.ownerDocument.activeElement)) setFocused(true);
    };
    const blur = (e: FocusEvent) => {
      if (!(e.relatedTarget instanceof Node) || !el.contains(e.relatedTarget))
        setFocused(false);
    };
    el.addEventListener("pointerenter", reveal);
    el.addEventListener("pointermove", reveal);
    el.addEventListener("pointerdown", pointerDown, true);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("focusin", focus);
    el.addEventListener("focusout", blur);
    el.ownerDocument.addEventListener("keydown", keyboard, true);
    if (!el.matches(":hover"))
      timer.current = setTimeout(() => setActive(false), 2400);
    return () => {
      clearTimeout(timer.current);
      el.removeEventListener("pointerenter", reveal);
      el.removeEventListener("pointermove", reveal);
      el.removeEventListener("pointerdown", pointerDown, true);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("focusin", focus);
      el.removeEventListener("focusout", blur);
      el.ownerDocument.removeEventListener("keydown", keyboard, true);
    };
  }, [frame]);
  useLayoutEffect(() => {
    if (!overlay.current) return;
    const tween = gsap.to(overlay.current, {
      opacity: visible ? 1 : 0,
      y: visible ? 0 : 8,
      duration: animated ? 0.32 : 0,
      ease: "power3.out",
      overwrite: true,
    });
    return () => {
      tween.kill();
    };
  }, [visible, animated]);
  return (
    <div
      ref={overlay}
      data-timeline-expanded={timelineExpanded && !menu}
      aria-hidden={!visible}
      inert={!visible}
      className="absolute inset-x-0 bottom-0 z-20 rounded-b-[inherit] bg-gradient-to-t from-black/65 to-transparent px-3 pb-3 pt-12 @min-[640px]/player-layout:px-8 @min-[640px]/player-layout:pb-5"
      style={{ pointerEvents: "none" }}
    >
      <div
        ref={dock}
        data-video-dock
        onPointerEnter={cancelTimelineDismiss}
        onPointerLeave={dismissTimeline}
        onBlur={dismissTimeline}
        style={{ pointerEvents: "none" }}
        className="relative z-20 flex flex-nowrap items-center gap-x-1"
      >
        <GooeySurface
          host={dock}
          menu={menu}
          animated={animated}
          enabled={gooey}
        />
        <div
          data-controls-group
          className="relative flex shrink-0 items-center"
          style={{ pointerEvents: visible ? "auto" : "none" }}
        >
          <VideoPlayButton />
          <VideoVolume />
          <VideoTime />
        </div>
        <div ref={seekSlot} aria-hidden className="mx-1 h-8 min-w-0 flex-1" />
        <div
          data-controls-group
          className="ml-auto flex shrink-0 items-center @min-[640px]/player-layout:ml-0"
          style={{ pointerEvents: visible ? "auto" : "none" }}
        >
          <span className="hidden @min-[640px]/player-layout:contents">
            <VideoTime remaining />
          </span>
          {captions.length > 0 && (
            <VideoButton
              label={
                captions.some((t) => t.active)
                  ? "Turn captions off"
                  : "Turn captions on"
              }
              className="hidden @min-[640px]/player-layout:inline-flex"
              aria-pressed={captions.some((t) => t.active)}
              onClick={() =>
                context.store.setTextTrack(
                  captions.some((t) => t.active) ? "off" : captions[0].id,
                )
              }
            >
              <Captions />
            </VideoButton>
          )}
          <VideoButton
            label={
              context.pip
                ? "Exit picture-in-picture"
                : context.canPip
                  ? "Picture-in-picture"
                  : "Picture-in-picture unavailable"
            }
            disabled={!context.canPip}
            className="hidden @min-[560px]/player-layout:inline-flex"
            onClick={context.togglePip}
          >
            <PictureInPicture2 />
          </VideoButton>
          <VideoSettings onOpenChange={setMenu} />
          <VideoFullscreenButton />
        </div>
      </div>
      <div
        ref={timeline}
        data-video-timeline
        className="absolute z-10"
        style={{ pointerEvents: visible ? "auto" : "none" }}
      >
        <VideoSeekbar
          onScrubbingChange={setScrubbing}
          onEngagementChange={engageTimeline}
        />
      </div>
    </div>
  );
}

export function VideoStatus({
  title,
  controls,
}: {
  title: string;
  controls: boolean;
}) {
  const { store, togglePlayback, animated } = useVideoPlayer();
  const paused = useVideoState((s) => s.paused),
    buffering = useVideoState((s) => s.buffering),
    error = useVideoState((s) => s.error),
    notice = useVideoState((s) => s.notice),
    ready = useVideoState((s) => s.ready);
  if (error)
    return (
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 rounded-[inherit] bg-black/60 backdrop-blur-xl px-6 text-center">
        <p role="alert" className="max-w-sm text-sm">
          {error.message}
        </p>
        {error.retryable && (
          <button
            type="button"
            onClick={() => store.retry()}
            className="min-h-11 rounded-full border border-white/25 px-5 text-xs focus-visible:outline-2 focus-visible:outline-ring"
          >
            Retry video
          </button>
        )}
      </div>
    );
  return (
    <>
      {controls && (
        <button
          type="button"
          aria-label={`${paused ? "Play" : "Pause"} ${title}`}
          disabled={!ready}
          onClick={togglePlayback}
          className="absolute inset-0 z-10 rounded-[inherit] bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        />
      )}
      {buffering && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            role="status"
            className="flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-xl px-4 py-2 text-xs"
          >
            <LoaderCircle
              className={`size-4 ${animated ? "animate-spin" : ""}`}
            />
            Loading video
          </span>
        </div>
      )}
      <p
        role="status"
        className={
          notice
            ? "absolute left-4 top-4 z-30 rounded-lg bg-white/15 backdrop-blur-xl px-3 py-2 text-xs"
            : "sr-only"
        }
      >
        {notice}
      </p>
    </>
  );
}
