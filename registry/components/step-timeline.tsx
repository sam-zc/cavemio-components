"use client";

import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { lifecycleEase, useLifecycleReducedMotion } from "./lifecycle-motion";

export interface TimelineStep {
  id: string;
  title: string;
  description: ReactNode;
}

export interface StepTimelineProps {
  /** Nonempty steps with unique, stable IDs. */
  steps: readonly TimelineStep[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Opt in to timed progression. */
  autoPlay?: boolean;
  duration?: number;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

/** An independently usable, expanding step selector with optional timed progress. */
export function StepTimeline({
  steps,
  value,
  defaultValue,
  onValueChange,
  autoPlay = false,
  duration = 5500,
  disabled = false,
  ariaLabel = "Timeline",
  className = "",
  style,
}: StepTimelineProps) {
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? steps[0]?.id,
  );
  const selected =
    steps.find((step) => step.id === (value ?? internalValue))?.id ??
    steps[0]?.id;
  const [restart, setRestart] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const reduced = useLifecycleReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const animation = useRef<Animation | null>(null);
  const cycling = autoPlay && !disabled && !reduced && steps.length > 1;
  const running =
    cycling && !paused && !hovered && !focused && visible && pageVisible;
  const select = (id: string) => {
    if (disabled) return;
    setInternalValue(id);
    setRestart((n) => n + 1);
    if (id !== selected) onValueChange?.(id);
  };
  const advance = useEffectEvent(() => {
    const next =
      steps[
        (steps.findIndex((step) => step.id === selected) + 1) % steps.length
      ];
    if (next) select(next.id);
  });

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(node);
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (!cycling || !fill.current) return;
    const playback = fill.current.animate(
      [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }],
      { duration: Math.max(1000, duration), fill: "both", easing: "linear" },
    );
    playback.pause();
    playback.onfinish = () => advance();
    animation.current = playback;
    return () => {
      playback.cancel();
      animation.current = null;
    };
  }, [selected, restart, cycling, duration]);

  useEffect(() => {
    if (running) animation.current?.play();
    else animation.current?.pause();
  }, [running, selected, restart, cycling, duration]);

  if (!steps.length) return null;
  return (
    <div
      ref={root}
      className={`w-full text-foreground ${className}`}
      style={style}
    >
      <ol
        aria-label={ariaLabel}
        className="m-0 list-none p-0"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setFocused(false);
        }}
      >
        {steps.map((step, index) => {
          const active = selected === step.id;
          return (
            <li key={step.id}>
              <button
                type="button"
                aria-pressed={active}
                aria-expanded={active}
                aria-label={step.title}
                disabled={disabled}
                onClick={() => select(step.id)}
                onKeyDown={(event) => {
                  const direction =
                    event.key === "ArrowDown" || event.key === "ArrowRight"
                      ? 1
                      : event.key === "ArrowUp" || event.key === "ArrowLeft"
                        ? -1
                        : 0;
                  const next =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? steps.length - 1
                        : direction
                          ? (index + direction + steps.length) % steps.length
                          : null;
                  if (next === null) return;
                  event.preventDefault();
                  select(steps[next].id);
                  root.current
                    ?.querySelectorAll<HTMLButtonElement>("ol button")
                    [next]?.focus();
                }}
                className="group relative block w-full cursor-pointer rounded-sm py-4 pl-7 text-left outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-1 left-0 w-0.5 overflow-hidden rounded-full bg-border"
                >
                  {active && (
                    <span
                      key={`${step.id}-${restart}`}
                      ref={fill}
                      className="absolute inset-0 origin-top bg-foreground"
                    />
                  )}
                </span>
                <span
                  className={`block transition-colors duration-300 motion-reduce:transition-none ${active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}
                >
                  <span className="block text-[22px] leading-[1.25] font-normal tracking-[-0.02em] [font-family:var(--timeline-display-font,inherit)] md:text-[24px]">
                    {step.title}
                  </span>
                  <span
                    aria-hidden={!active}
                    inert={!active}
                    className="grid motion-reduce:transition-none"
                    style={{
                      gridTemplateRows: active ? "1fr" : "0fr",
                      transition: reduced
                        ? "none"
                        : `grid-template-rows 500ms ${lifecycleEase}`,
                    }}
                  >
                    <span className="min-h-0 overflow-hidden">
                      <span className="block max-w-96 pt-2 text-[16.5px] leading-[1.55] tracking-[-0.012em] text-pretty text-muted-foreground">
                        {step.description}
                      </span>
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {autoPlay && !reduced && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setPaused((current) => !current)}
          className="mt-4 min-h-11 cursor-pointer rounded-full border border-border px-4 text-xs text-muted-foreground outline-offset-4 focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={paused ? "Play timeline" : "Pause timeline"}
        >
          {paused ? "Play" : "Pause"}
        </button>
      )}
    </div>
  );
}
