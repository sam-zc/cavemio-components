"use client";

import * as React from "react";
import {
  projectInertia,
  releaseVelocity,
  samplePointer,
  softenVelocity,
  springFrames,
  type PointerSample,
} from "./imported-ui-interaction-motion";

export type DeckThrow = {
  id: string;
  direction: number;
  from: number;
  velocity: number;
};

export function useCardDeckGesture({
  id,
  count,
  reduced,
  onThrow,
  onProgress,
}: {
  id: string | undefined;
  count: number;
  reduced: boolean;
  onThrow: (direction: number, from: number, velocity: number) => boolean;
  /** How far the front card has travelled toward a throw, 0–1; the stack behind rises with it. */
  onProgress: (progress: number, settle: boolean) => void;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const frontRef = React.useRef<HTMLDivElement>(null);
  const animation = React.useRef<Animation | null>(null);
  const drag = React.useRef<{
    pointer: number;
    startX: number;
    startY: number;
    base: number;
    x: number;
    width: number;
    horizontal: boolean;
    samples: PointerSample[];
  } | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const [prevId, setPrevId] = React.useState(id);
  const [prevReduced, setPrevReduced] = React.useState(reduced);

  if (id !== prevId || reduced !== prevReduced) {
    setPrevId(id);
    setPrevReduced(reduced);
    if (dragging) setDragging(false);
  }

  React.useEffect(
    () => () => {
      animation.current?.cancel();
    },
    [],
  );
  React.useLayoutEffect(() => {
    drag.current = null;
    animation.current?.cancel();
    if (frontRef.current) frontRef.current.style.transform = "";
  }, [id, reduced]);

  const settle = (from: number, velocity: number) => {
    const front = frontRef.current;
    if (!front) return;
    front.style.transform = "";
    if (reduced) return;
    animation.current?.cancel();
    const frames = springFrames(from, 0, velocity, 480, {
      omega: 16,
      damping: 0.74,
    }).map(({ value, offset }) => {
      const lift = -Math.min(10, Math.abs(value) * 0.05);
      const angle =
        Math.sign(value) * Math.min(16, Math.sqrt(Math.abs(value)) * 1.05);
      return {
        transform: `translate3d(${value}px,${lift}px,0) rotate(${angle}deg)`,
        offset,
      };
    });
    animation.current = front.animate(frames, {
      duration: 480,
      easing: "linear",
    });
  };

  const finish = (event: React.PointerEvent, cancelled: boolean) => {
    const state = drag.current;
    if (!state || state.pointer !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
    onProgress(0, true);
    const velocity = releaseVelocity(state.samples, event.timeStamp);
    const projected = projectInertia(state.x, velocity, 0.12);
    const sameDir =
      Math.sign(velocity) === Math.sign(state.x) || Math.abs(velocity) < 0.08;
    const crossed = Math.abs(state.x) > Math.min(95, state.width * 0.28);
    const projectedOut =
      Math.abs(projected) > state.width * 0.32 &&
      sameDir &&
      Math.abs(state.x) > 18;
    const flicked =
      Math.abs(state.x) > 14 &&
      Math.abs(velocity) > 0.42 &&
      Math.sign(velocity) === Math.sign(state.x);

    if (
      !cancelled &&
      state.horizontal &&
      (crossed || projectedOut || flicked)
    ) {
      const dir = state.x < 0 ? 1 : -1;
      if (!onThrow(dir, state.x, velocity)) {
        settle(state.x, velocity);
      }
    } else {
      const launchV = softenVelocity(velocity, state.x, 8);
      settle(state.x, cancelled ? 0 : launchV);
    }
  };

  return {
    rootRef,
    frontRef,
    dragging,
    handlers: {
      onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
        if (
          count < 2 ||
          event.button !== 0 ||
          !event.isPrimary ||
          (event.target as HTMLElement).closest(
            "a,button,input,textarea,select,[data-deck-no-drag]",
          )
        )
          return;
        const transform = getComputedStyle(event.currentTarget).transform;
        const base =
          transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m41;
        animation.current?.cancel();
        if (!reduced) {
          const lift = -Math.min(10, Math.abs(base) * 0.05);
          const angle =
            Math.sign(base) * Math.min(16, Math.sqrt(Math.abs(base)) * 1.05);
          event.currentTarget.style.transform = `translate3d(${base}px,${lift}px,0) rotate(${angle}deg)`;
        }
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = {
          pointer: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          base,
          x: base,
          width: event.currentTarget.clientWidth,
          horizontal: false,
          samples: [{ x: event.clientX, time: event.timeStamp }],
        };
      },
      onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
        const state = drag.current;
        if (!state || state.pointer !== event.pointerId) return;
        const dx = event.clientX - state.startX,
          dy = event.clientY - state.startY;
        if (!state.horizontal) {
          if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) {
            drag.current = null;
            settle(state.base, 0);
            onProgress(0, true);
            return;
          }
          if (Math.abs(dx) < 6) return;
          state.horizontal = true;
          // Compensate slop so drag originates seamlessly with zero jump
          state.startX = event.clientX;
          state.startY = event.clientY;
          setDragging(true);
        }
        state.x = state.base + (event.clientX - state.startX);
        samplePointer(state.samples, event.clientX, event.timeStamp);
        if (!reduced) {
          const lift = -Math.min(10, Math.abs(state.x) * 0.05);
          const angle =
            Math.sign(state.x) *
            Math.min(16, Math.sqrt(Math.abs(state.x)) * 1.05);
          event.currentTarget.style.transform = `translate3d(${state.x}px,${lift}px,0) rotate(${angle}deg)`;
          onProgress(
            Math.min(1, Math.abs(state.x) / (state.width * 0.55)),
            false,
          );
        }
      },
      onPointerUp: (event: React.PointerEvent) => finish(event, false),
      onPointerCancel: (event: React.PointerEvent) => finish(event, true),
      onLostPointerCapture: (event: React.PointerEvent) => finish(event, true),
    },
    resetFront: () => {
      animation.current?.cancel();
      if (frontRef.current) frontRef.current.style.transform = "";
    },
  };
}
