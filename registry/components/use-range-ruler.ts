"use client";

import * as React from "react";
import { EASE_SETTLE, rubberBand } from "./imported-ui-interaction-motion";

export function snapRulerValue(
  value: number,
  min: number,
  max: number,
  step: number,
) {
  if (!Number.isFinite(value) || value <= min) return min;
  if (value >= max) return max;
  const snapped = min + Math.round((value - min) / step) * step;
  return Number(Math.max(min, Math.min(max, snapped)).toFixed(6));
}

type Range = [number, number];

type RangeRulerOptions = {
  value: Range;
  min: number;
  max: number;
  step: number;
  minDistance?: number;
  disabled: boolean;
  reduced: boolean;
  onChange?: (value: Range) => void;
  onCommit?: (value: Range) => void;
  format: (value: number) => string;
  formatNumber: (value: number) => string;
};

/** High-performance gesture controller for a dual-needle graduated ruler. */
export function useRangeRuler(options: RangeRulerOptions) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const lowerThumbRef = React.useRef<HTMLButtonElement>(null);
  const upperThumbRef = React.useRef<HTMLButtonElement>(null);
  const highlightRef = React.useRef<HTMLDivElement>(null);
  const lowerReadoutRef = React.useRef<HTMLSpanElement>(null);
  const upperReadoutRef = React.useRef<HTMLSpanElement>(null);
  const mergedReadoutRef = React.useRef<HTMLSpanElement>(null);

  const optionsRef = React.useRef(options);
  React.useLayoutEffect(() => {
    optionsRef.current = options;
  });

  const [activeThumb, setActiveThumb] = React.useState<
    "lower" | "upper" | null
  >(null);
  const [isMerged, setIsMerged] = React.useState(false);

  // Active drag state kept strictly in refs to prevent layout thrash and React re-renders.
  const gesture = React.useRef<{
    id: number;
    thumb: "lower" | "upper";
    startVal: Range;
    currentVal: Range;
    trackLeft: number;
    trackWidth: number;
  } | null>(null);

  const getRatio = React.useCallback((val: number) => {
    const { min, max } = optionsRef.current;
    const span = Math.max(0.00001, max - min);
    return Math.max(0, Math.min(1, (val - min) / span));
  }, []);

  const paint = React.useCallback(
    (range: Range, animate: boolean) => {
      const o = optionsRef.current;
      const [lower, upper] = range;
      const lowerRatio = getRatio(lower);
      const upperRatio = getRatio(upper);

      const lowerPct = (lowerRatio * 100).toFixed(4);
      const upperPct = (upperRatio * 100).toFixed(4);
      const spanPct = Math.max(0, (upperRatio - lowerRatio) * 100).toFixed(4);

      const transition =
        animate && !o.reduced ? `left 360ms ${EASE_SETTLE}` : "none";
      const barTransition =
        animate && !o.reduced
          ? `left 360ms ${EASE_SETTLE}, width 360ms ${EASE_SETTLE}`
          : "none";

      if (lowerThumbRef.current) {
        lowerThumbRef.current.style.transition = transition;
        lowerThumbRef.current.style.left = `${lowerPct}%`;
        lowerThumbRef.current.setAttribute("aria-valuenow", String(lower));
        lowerThumbRef.current.setAttribute("aria-valuetext", o.format(lower));
      }

      if (upperThumbRef.current) {
        upperThumbRef.current.style.transition = transition;
        upperThumbRef.current.style.left = `${upperPct}%`;
        upperThumbRef.current.setAttribute("aria-valuenow", String(upper));
        upperThumbRef.current.setAttribute("aria-valuetext", o.format(upper));
      }

      if (highlightRef.current) {
        highlightRef.current.style.transition = barTransition;
        highlightRef.current.style.left = `${lowerPct}%`;
        highlightRef.current.style.width = `${spanPct}%`;
      }

      if (lowerReadoutRef.current)
        lowerReadoutRef.current.textContent = o.formatNumber(lower);
      if (upperReadoutRef.current)
        upperReadoutRef.current.textContent = o.formatNumber(upper);
      if (mergedReadoutRef.current) {
        mergedReadoutRef.current.textContent =
          lower === upper
            ? o.formatNumber(lower)
            : `${o.formatNumber(lower)} – ${o.formatNumber(upper)}`;
      }

      const track = trackRef.current;
      const trackWidth = track ? track.offsetWidth : 400;
      const pixelGap = (upperRatio - lowerRatio) * trackWidth;
      setIsMerged(pixelGap < 48);
    },
    [getRatio],
  );

  const commit = React.useCallback(
    (next: Range, animate = true) => {
      const o = optionsRef.current;
      const dist = o.minDistance ?? 0;
      let lower = snapRulerValue(next[0], o.min, o.max - dist, o.step);
      let upper = snapRulerValue(next[1], o.min + dist, o.max, o.step);

      if (lower > upper - dist) {
        if (next[0] > o.value[0]) upper = Math.min(o.max, lower + dist);
        else lower = Math.max(o.min, upper - dist);
      }

      const clean: Range = [lower, upper];
      paint(clean, animate);
      o.onChange?.(clean);
      o.onCommit?.(clean);
    },
    [paint],
  );

  const finish = React.useCallback(
    (cancelled: boolean) => {
      const g = gesture.current;
      if (!g) return;
      gesture.current = null;
      setActiveThumb(null);

      if (cancelled) {
        paint(g.startVal, true);
        optionsRef.current.onChange?.(g.startVal);
      } else {
        commit(g.currentVal, false);
      }
    },
    [commit, paint],
  );

  React.useLayoutEffect(() => {
    if (!gesture.current) paint(options.value, true);
  }, [options.value, options.min, options.max, options.reduced, paint]);

  React.useEffect(() => {
    const handleResize = () => {
      if (!gesture.current) paint(optionsRef.current.value, false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [paint]);

  React.useEffect(() => {
    const interrupted = () => finish(true);
    const hidden = () => {
      if (document.hidden) interrupted();
    };
    window.addEventListener("blur", interrupted);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      window.removeEventListener("blur", interrupted);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [finish]);

  React.useEffect(() => {
    if (options.disabled) finish(true);
  }, [options.disabled, finish]);

  const startDrag = React.useCallback(
    (thumb: "lower" | "upper", event: React.PointerEvent<HTMLElement>) => {
      if (event.button !== 0 || !event.isPrimary || optionsRef.current.disabled)
        return;
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      event.currentTarget.setPointerCapture(event.pointerId);

      const targetEl =
        thumb === "lower" ? lowerThumbRef.current : upperThumbRef.current;
      targetEl?.focus({ preventScroll: true });

      gesture.current = {
        id: event.pointerId,
        thumb,
        startVal: [...optionsRef.current.value] as Range,
        currentVal: [...optionsRef.current.value] as Range,
        trackLeft: rect.left,
        trackWidth: Math.max(1, rect.width),
      };

      setActiveThumb(thumb);
      paint(optionsRef.current.value, false);
    },
    [paint],
  );

  const onPointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const g = gesture.current;
      const o = optionsRef.current;
      if (!g || g.id !== event.pointerId) return;

      const clientX = event.clientX;
      const rawFraction = (clientX - g.trackLeft) / g.trackWidth;
      let fraction = rawFraction;
      if (rawFraction < 0) {
        fraction =
          -rubberBand(-rawFraction * g.trackWidth, g.trackWidth, 0.4) /
          g.trackWidth;
      } else if (rawFraction > 1) {
        fraction =
          1 +
          rubberBand((rawFraction - 1) * g.trackWidth, g.trackWidth, 0.4) /
            g.trackWidth;
      }
      const targetVal = snapRulerValue(
        o.min + Math.max(0, Math.min(1, fraction)) * (o.max - o.min),
        o.min,
        o.max,
        o.step,
      );
      const dist = o.minDistance ?? 0;

      let [lower, upper] = g.currentVal;

      if (g.thumb === "lower") {
        lower = Math.min(o.max - dist, targetVal);
        // Repulsion: lower pushes upper forward
        if (lower > upper - dist) {
          upper = Math.min(o.max, lower + dist);
        }
      } else {
        upper = Math.max(o.min + dist, targetVal);
        // Repulsion: upper pushes lower backward
        if (upper < lower + dist) {
          lower = Math.max(o.min, upper - dist);
        }
      }

      if (lower === g.currentVal[0] && upper === g.currentVal[1]) return;

      g.currentVal = [lower, upper];
      paint([lower, upper], false);
      o.onChange?.([lower, upper]);
    },
    [paint],
  );

  const onTrackPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || !event.isPrimary || optionsRef.current.disabled)
        return;
      // If clicking directly on a thumb button, let the thumb handler handle it
      if ((event.target as HTMLElement).closest("button")) return;

      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const fraction = Math.max(
        0,
        Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width)),
      );
      const clickVal =
        optionsRef.current.min +
        fraction * (optionsRef.current.max - optionsRef.current.min);

      const [lower, upper] = optionsRef.current.value;
      const closer: "lower" | "upper" =
        Math.abs(clickVal - lower) <= Math.abs(clickVal - upper)
          ? "lower"
          : "upper";

      startDrag(closer, event);
      // Immediately process movement to click position
      const targetVal = snapRulerValue(
        clickVal,
        optionsRef.current.min,
        optionsRef.current.max,
        optionsRef.current.step,
      );
      const dist = optionsRef.current.minDistance ?? 0;
      let nextLower = lower;
      let nextUpper = upper;

      if (closer === "lower") {
        nextLower = Math.min(optionsRef.current.max - dist, targetVal);
        if (nextLower > nextUpper - dist)
          nextUpper = Math.min(optionsRef.current.max, nextLower + dist);
      } else {
        nextUpper = Math.max(optionsRef.current.min + dist, targetVal);
        if (nextUpper < nextLower + dist)
          nextLower = Math.max(optionsRef.current.min, nextUpper - dist);
      }

      if (gesture.current) {
        gesture.current.currentVal = [nextLower, nextUpper];
        paint([nextLower, nextUpper], false);
        optionsRef.current.onChange?.([nextLower, nextUpper]);
      }
    },
    [startDrag, paint],
  );

  const makeKeyHandler = React.useCallback(
    (thumb: "lower" | "upper") =>
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Escape") {
          event.preventDefault();
          finish(true);
          return;
        }

        const o = optionsRef.current;
        if (
          ![
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "PageUp",
            "PageDown",
            "Home",
            "End",
          ].includes(event.key)
        )
          return;

        event.preventDefault();
        const isUp = ["ArrowRight", "ArrowUp", "PageUp"].includes(event.key);
        const mult = event.key.startsWith("Page") || event.shiftKey ? 10 : 1;
        const delta = o.step * mult * (isUp ? 1 : -1);
        const dist = o.minDistance ?? 0;

        let [lower, upper] = o.value;

        if (thumb === "lower") {
          if (event.key === "Home") lower = o.min;
          else if (event.key === "End") lower = upper - dist;
          else lower = Math.max(o.min, Math.min(o.max - dist, lower + delta));

          if (lower > upper - dist) upper = Math.min(o.max, lower + dist);
        } else {
          if (event.key === "Home") upper = lower + dist;
          else if (event.key === "End") upper = o.max;
          else upper = Math.max(o.min + dist, Math.min(o.max, upper + delta));

          if (upper < lower + dist) lower = Math.max(o.min, upper - dist);
        }

        commit([lower, upper]);
      },
    [commit, finish],
  );

  const attachTrack = React.useCallback((el: HTMLDivElement | null) => {
    trackRef.current = el;
  }, []);
  const attachLowerThumb = React.useCallback((el: HTMLButtonElement | null) => {
    lowerThumbRef.current = el;
  }, []);
  const attachUpperThumb = React.useCallback((el: HTMLButtonElement | null) => {
    upperThumbRef.current = el;
  }, []);
  const attachHighlight = React.useCallback((el: HTMLDivElement | null) => {
    highlightRef.current = el;
  }, []);
  const attachLowerReadout = React.useCallback((el: HTMLSpanElement | null) => {
    lowerReadoutRef.current = el;
  }, []);
  const attachUpperReadout = React.useCallback((el: HTMLSpanElement | null) => {
    upperReadoutRef.current = el;
  }, []);
  const attachMergedReadout = React.useCallback(
    (el: HTMLSpanElement | null) => {
      mergedReadoutRef.current = el;
    },
    [],
  );

  const onPointerUpTrack = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerId === gesture.current?.id) finish(false);
    },
    [finish],
  );
  const onPointerCancelTrack = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerId === gesture.current?.id) finish(true);
    },
    [finish],
  );
  const onPointerDownLower = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => startDrag("lower", e),
    [startDrag],
  );
  const onPointerUpLower = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.pointerId === gesture.current?.id) finish(false);
    },
    [finish],
  );
  const onPointerCancelLower = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.pointerId === gesture.current?.id) finish(true);
    },
    [finish],
  );
  const onLostPointerCaptureLower = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.pointerId === gesture.current?.id) finish(true);
    },
    [finish],
  );
  const onBlur = React.useCallback(() => finish(true), [finish]);
  const onKeyDownLower = React.useMemo(
    () => makeKeyHandler("lower"),
    [makeKeyHandler],
  );

  const onPointerDownUpper = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => startDrag("upper", e),
    [startDrag],
  );
  const onPointerUpUpper = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.pointerId === gesture.current?.id) finish(false);
    },
    [finish],
  );
  const onPointerCancelUpper = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.pointerId === gesture.current?.id) finish(true);
    },
    [finish],
  );
  const onLostPointerCaptureUpper = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.pointerId === gesture.current?.id) finish(true);
    },
    [finish],
  );
  const onKeyDownUpper = React.useMemo(
    () => makeKeyHandler("upper"),
    [makeKeyHandler],
  );

  const trackHandlers = React.useMemo(
    () => ({
      onPointerDown: onTrackPointerDown,
      onPointerMove,
      onPointerUp: onPointerUpTrack,
      onPointerCancel: onPointerCancelTrack,
    }),
    [onTrackPointerDown, onPointerMove, onPointerUpTrack, onPointerCancelTrack],
  );

  const lowerHandlers = React.useMemo(
    () => ({
      onPointerDown: onPointerDownLower,
      onPointerMove,
      onPointerUp: onPointerUpLower,
      onPointerCancel: onPointerCancelLower,
      onLostPointerCapture: onLostPointerCaptureLower,
      onBlur,
      onKeyDown: onKeyDownLower,
    }),
    [
      onPointerDownLower,
      onPointerMove,
      onPointerUpLower,
      onPointerCancelLower,
      onLostPointerCaptureLower,
      onBlur,
      onKeyDownLower,
    ],
  );

  const upperHandlers = React.useMemo(
    () => ({
      onPointerDown: onPointerDownUpper,
      onPointerMove,
      onPointerUp: onPointerUpUpper,
      onPointerCancel: onPointerCancelUpper,
      onLostPointerCapture: onLostPointerCaptureUpper,
      onBlur,
      onKeyDown: onKeyDownUpper,
    }),
    [
      onPointerDownUpper,
      onPointerMove,
      onPointerUpUpper,
      onPointerCancelUpper,
      onLostPointerCaptureUpper,
      onBlur,
      onKeyDownUpper,
    ],
  );

  return {
    attachTrack,
    attachLowerThumb,
    attachUpperThumb,
    attachHighlight,
    attachLowerReadout,
    attachUpperReadout,
    attachMergedReadout,
    activeThumb,
    isMerged,
    commit,
    trackHandlers,
    lowerHandlers,
    upperHandlers,
  };
}
