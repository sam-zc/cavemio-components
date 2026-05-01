"use client";

import * as React from "react";

/* ─────────────────────────────────────────────────────────
 * FACES: the states of one surface, in the same place
 *
 * The active face is in flow; the others are laid over it, faded
 * and nudged aside (faces before it to the left, faces after it to
 * the right), so switching reads as the surface turning to its
 * next side. The height eases between the faces' measured heights,
 * so nothing around it jumps. Used by the blocks (the wallet's
 * activity and keypad, a pricing card and its checkout, a booking's
 * times, details and confirmation).
 * ───────────────────────────────────────────────────────── */

const EASE = "cubic-bezier(0.16,1,0.3,1)";
export const FACES_MORPH = 460;

export function Faces({
  active,
  reduced,
  ready,
  className = "",
  children,
}: {
  active: number;
  reduced: boolean;
  /** False until the first paint, so the faces don't animate into place on mount. */
  ready: boolean;
  className?: string;
  children: React.ReactNode[];
}) {
  const refs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [heights, setHeights] = React.useState<number[] | null>(null);
  const count = children.length;

  React.useLayoutEffect(() => {
    const els = refs.current.slice(0, count);
    const observer = new ResizeObserver(() => {
      const next = els.map((el) => el?.offsetHeight ?? 0);
      setHeights((p) =>
        p && p.length === next.length && p.every((h, i) => h === next[i])
          ? p
          : next,
      );
    });
    els.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [count]);

  const face = (i: number): React.CSSProperties => {
    const on = i === active;
    return {
      opacity: on ? 1 : 0,
      transform:
        on || reduced ? "none" : `translateX(${i < active ? -18 : 18}px)`,
      filter: on || reduced ? "none" : "blur(4px)",
      transition: !ready
        ? "none"
        : reduced
          ? "opacity 160ms ease-out"
          : on
            ? `opacity 320ms ${EASE} 90ms, transform ${FACES_MORPH}ms ${EASE}, filter 320ms ${EASE} 90ms`
            : `opacity 140ms ease-out, transform ${FACES_MORPH}ms ${EASE}, filter 200ms ease-out`,
    };
  };

  return (
    <div
      className={`relative overflow-clip ${className}`}
      style={{
        height: heights ? heights[active] : undefined,
        transition:
          ready && !reduced ? `height ${FACES_MORPH}ms ${EASE}` : "none",
      }}
    >
      {children.map((child, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inert={active !== i || undefined}
          aria-hidden={active !== i || undefined}
          className={
            active === i
              ? "relative"
              : "pointer-events-none absolute inset-x-0 top-0"
          }
          style={face(i)}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
