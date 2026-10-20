"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

export type AnswerPaperLevel = {
  id: string;
  label: string;
  content: ReactNode;
  /** Estimated reading time in seconds, supplied with each answer version. */
  readTime: number;
};

export type CavemioAnswerPaperProps = {
  /** Answer versions ordered from shortest to longest. */
  levels: readonly AnswerPaperLevel[];
  /** Controlled index into levels. */
  level?: number;
  /** Starts with the longest answer when omitted. */
  defaultLevel?: number;
  onLevelChange?: (index: number) => void;
  paperColor?: CSSProperties["backgroundColor"];
  paperRadius?: CSSProperties["borderRadius"];
  textColor?: CSSProperties["color"];
  handleColor?: CSSProperties["color"];
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const indexWithin = (value: number, count: number) =>
  clamp(Number.isFinite(value) ? Math.round(value) : count - 1, 0, count - 1);

const WORD_EASE = "cubic-bezier(0.16,1,0.3,1)";

// Keep rich-text structure and natural whitespace while giving each word a box.
function wordify(content: ReactNode): ReactNode {
  return Children.map(content, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return String(child)
        .split(/(\s+)/)
        .map((part, index) =>
          !part || /^\s+$/.test(part) ? (
            part
          ) : (
            <span key={index} data-answer-word="" className="inline-block">
              {part}
            </span>
          ),
        );
    }
    if (
      isValidElement<{ children?: ReactNode }>(child) &&
      child.props.children
    ) {
      return cloneElement(child, { children: wordify(child.props.children) });
    }
    return child;
  });
}

// Match shared words in reading order.
// Matching across blocks lets a sentence glide from a section into a summary.
function matchWords(before: HTMLElement[], after: HTMLElement[]) {
  const beforeText = before.map((word) => word.textContent);
  const afterText = after.map((word) => word.textContent);
  const table = Array.from(
    { length: before.length + 1 },
    () => new Uint32Array(after.length + 1),
  );
  for (let i = before.length - 1; i >= 0; i--) {
    for (let j = after.length - 1; j >= 0; j--) {
      table[i][j] =
        beforeText[i] === afterText[j]
          ? table[i + 1][j + 1] + 1
          : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const matches = new Map<number, number>();
  let i = 0;
  let j = 0;
  while (i < before.length && j < after.length) {
    if (beforeText[i] === afterText[j]) {
      matches.set(j++, i++);
    } else if (table[i + 1][j] >= table[i][j + 1]) i++;
    else j++;
  }
  return matches;
}

function useWordTransition(
  active: number,
  layers: { current: (HTMLDivElement | null)[] },
  overlay: { current: HTMLDivElement | null },
  reduced: boolean,
) {
  const previous = useRef(active);
  useLayoutEffect(() => {
    const from = layers.current[previous.current];
    const to = layers.current[active];
    const ghosts = overlay.current;
    previous.current = active;
    if (!to || !ghosts) return;
    if (reduced) {
      layers.current.forEach((layer) =>
        layer
          ?.getAnimations({ subtree: true })
          .forEach((animation) => animation.cancel()),
      );
      ghosts.replaceChildren();
      return;
    }
    if (!from || from === to) return;

    const before = Array.from(
      from.querySelectorAll<HTMLElement>("[data-answer-word]"),
    );
    const after = Array.from(
      to.querySelectorAll<HTMLElement>("[data-answer-word]"),
    );
    const origin = ghosts.getBoundingClientRect();
    // Read presentation positions and opacity BEFORE cancelling an interrupted morph.
    const first = before.map((word) => {
      const rect = word.getBoundingClientRect();
      const style = getComputedStyle(word);
      return {
        rect,
        opacity: style.opacity,
        filter: style.filter,
        font: style.font,
        letterSpacing: style.letterSpacing,
        color: style.color,
      };
    });
    const matches = matchWords(before, after);
    const kept = new Set(matches.values());
    layers.current.forEach((layer) =>
      layer
        ?.getAnimations({ subtree: true })
        .forEach((animation) => animation.cancel()),
    );
    ghosts.replaceChildren();
    const last = after.map((word) => word.getBoundingClientRect());
    let fresh = 0;
    after.forEach((word, index) => {
      const match = matches.get(index);
      const was = match === undefined ? undefined : first[match];
      if (was) {
        word.animate(
          [
            {
              transform: `translate(${was.rect.left - last[index].left}px, ${was.rect.top - last[index].top}px)`,
              opacity: was.opacity,
              filter: was.filter,
            },
            { transform: "none", opacity: 1, filter: "blur(0px)" },
          ],
          { duration: 480, easing: WORD_EASE },
        );
      } else {
        word.animate(
          [
            {
              opacity: 0,
              transform: "translateY(0.35em)",
              filter: "blur(4px)",
            },
            { opacity: 1, transform: "none", filter: "blur(0px)" },
          ],
          {
            duration: 380,
            delay: Math.min(fresh++ * 14, 120),
            easing: WORD_EASE,
            fill: "backwards",
          },
        );
      }
    });
    before.forEach((word, index) => {
      if (kept.has(index)) return;
      const was = first[index];
      if (Number(was.opacity) === 0) return;
      const ghost = document.createElement("span");
      ghost.textContent = word.textContent;
      Object.assign(ghost.style, {
        position: "absolute",
        whiteSpace: "pre",
        font: was.font,
        letterSpacing: was.letterSpacing,
        color: was.color,
        left: `${was.rect.left - origin.left}px`,
        top: `${was.rect.top - origin.top}px`,
      });
      ghosts.appendChild(ghost);
      const animation = ghost.animate(
        [
          { opacity: was.opacity, transform: "none", filter: was.filter },
          {
            opacity: 0,
            transform: "translateY(-0.2em) scale(0.96)",
            filter: "blur(4px)",
          },
        ],
        { duration: 240, easing: WORD_EASE, fill: "forwards" },
      );
      animation.onfinish = () => ghost.remove();
    });
  }, [active, layers, overlay, reduced]);

  useEffect(() => {
    const nodes = layers.current;
    const ghosts = overlay.current;
    return () => {
      nodes.forEach((node) =>
        node
          ?.getAnimations({ subtree: true })
          .forEach((animation) => animation.cancel()),
      );
      ghosts?.replaceChildren();
    };
  }, [layers, overlay]);
}

function AnswerLayer({
  answer,
  index,
  active,
  contentRef,
  answerId,
}: {
  answer: AnswerPaperLevel;
  index: number;
  active: number;
  contentRef: Ref<HTMLDivElement>;
  answerId: string;
}) {
  const content = useMemo(() => wordify(answer.content), [answer.content]);
  return (
    <div
      ref={contentRef}
      data-answer-layer=""
      id={index === active ? answerId : undefined}
      aria-hidden={index !== active}
      inert={index !== active}
      className="absolute inset-x-0 top-0 p-6 text-[15px] font-normal leading-[1.65] tracking-[-0.012em] [&_h3]:mb-2 [&_h3]:text-[16px] [&_h3]:font-semibold [&_h3]:leading-[1.35] [&_p]:m-0 [&_section+section]:mt-6 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li+li]:mt-1"
      style={{
        // Chrome can retain an animated child's inherited visibility:hidden
        // after its layer becomes visible. Opacity does not inherit, so words
        // always settle back to their normal painted state.
        opacity: index === active ? 1 : 0,
        pointerEvents: index === active ? "auto" : "none",
      }}
    >
      {content}
    </div>
  );
}

/** A resizable answer whose content changes in detail as its paper is dragged. */
export function CavemioAnswerPaper({
  levels,
  level,
  defaultLevel = levels.length - 1,
  onLevelChange,
  paperColor = "var(--card, var(--background))",
  paperRadius = 14,
  textColor = "var(--foreground)",
  handleColor = "var(--accent-ink, var(--foreground))",
  disabled = false,
  ariaLabel = "Answer length",
  className,
  style,
}: CavemioAnswerPaperProps) {
  const [internalLevel, setInternalLevel] = useState(defaultLevel);
  const [heights, setHeights] = useState<number[]>([]);
  const [dragging, setDragging] = useState(false);
  const active = indexWithin(level ?? internalLevel, levels.length);
  const selected = levels[active];
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const height = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const releaseVelocity = useRef(0);
  const activeRef = useRef(active);
  const drag = useRef<{
    pointer: number;
    target: HTMLDivElement;
    y: number;
    height: number;
    startLevel: number;
    samples: { y: number; time: number }[];
  } | null>(null);
  const instructionsId = useId();
  const answerId = useId();
  activeRef.current = active;
  useWordTransition(active, contentRefs, overlayRef, Boolean(reducedMotion));

  useLayoutEffect(() => {
    const nodes = contentRefs.current.slice(0, levels.length);
    const measure = () => {
      const next = nodes.map((node) => node?.offsetHeight ?? 0);
      if (next.some((size) => size === 0)) return;
      setHeights((previous) =>
        next.length === previous.length &&
        next.every((size, i) => size === previous[i])
          ? previous
          : next,
      );
      if (height.get() === 0) height.jump(next[activeRef.current]);
    };
    measure();
    const observer = new ResizeObserver(measure);
    nodes.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [levels, height]);

  useLayoutEffect(() => {
    if (drag.current && !disabled) return;
    const gesture = drag.current;
    drag.current = null;
    if (gesture?.target.hasPointerCapture(gesture.pointer)) {
      gesture.target.releasePointerCapture(gesture.pointer);
    }
    if (disabled && dragging) setDragging(false);
    if (!heights[active]) return;
    if (reducedMotion) {
      height.jump(heights[active]);
      return;
    }
    const animation = animate(height, heights[active], {
      type: "spring",
      stiffness: 440,
      damping: 42,
      mass: 0.8,
      velocity: releaseVelocity.current,
    });
    releaseVelocity.current = 0;
    return () => animation.stop();
  }, [active, heights, dragging, disabled, height, reducedMotion]);

  if (!selected) {
    throw new Error("CavemioAnswerPaper needs at least one answer level.");
  }

  function select(index: number) {
    const next = indexWithin(index, levels.length);
    if (next === activeRef.current) return;
    activeRef.current = next;
    if (level === undefined) setInternalLevel(next);
    onLevelChange?.(next);
  }

  function levelAtHeight(size: number, current = activeRef.current) {
    let next = current;
    // Separate thresholds prevent tiny pointer reversals from restarting a rewrite.
    // Shorten early, before the longer answer would be clipped by its paper.
    while (next > 0) {
      const gap = heights[next] - heights[next - 1];
      if (size >= heights[next] - Math.min(52, gap * 0.32)) break;
      next--;
    }
    while (next < heights.length - 1) {
      const gap = heights[next + 1] - heights[next];
      if (size <= heights[next + 1] - Math.min(28, gap * 0.16)) break;
      next++;
    }
    return next;
  }

  function start(event: PointerEvent<HTMLDivElement>) {
    if (
      disabled ||
      levels.length < 2 ||
      heights.length !== levels.length ||
      event.button !== 0 ||
      drag.current
    )
      return;
    event.preventDefault();
    event.currentTarget.dataset.pointerFocus = "true";
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    height.stop();
    drag.current = {
      pointer: event.pointerId,
      target: event.currentTarget,
      y: event.clientY,
      height: height.get(),
      startLevel: active,
      samples: [{ y: event.clientY, time: event.timeStamp }],
    };
    setDragging(true);
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.pointer !== event.pointerId) return;
    const min = Math.min(...heights);
    const max = Math.max(...heights);
    const raw = gesture.height + event.clientY - gesture.y;
    const bounded = clamp(raw, min, max);
    const overflow = raw - bounded;
    // A soft edge stays responsive without letting the paper escape its bounds.
    const resistance = reducedMotion
      ? 0
      : (overflow * 0.18) / (1 + Math.abs(overflow) / 100);
    height.set(bounded + resistance);
    gesture.samples.push({ y: event.clientY, time: event.timeStamp });
    gesture.samples = gesture.samples.filter(
      (sample) => event.timeStamp - sample.time <= 80,
    );
    select(levelAtHeight(bounded));
  }

  function finish(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const gesture = drag.current;
    if (!gesture || gesture.pointer !== event.pointerId) return;
    const first = gesture.samples[0];
    const last = gesture.samples.at(-1)!;
    const velocity =
      event.timeStamp - last.time < 100 && last.time > first.time
        ? clamp(
            ((last.y - first.y) / (last.time - first.time)) * 1000,
            -1600,
            1600,
          )
        : 0;
    drag.current = null;
    releaseVelocity.current = cancelled ? 0 : velocity;
    select(
      cancelled
        ? gesture.startLevel
        : levelAtHeight(height.get() + clamp(velocity * 0.08, -44, 44)),
    );
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function keyDown(event: KeyboardEvent<HTMLDivElement>) {
    delete event.currentTarget.dataset.pointerFocus;
    if (disabled) return;
    const next = {
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      Home: 0,
      End: levels.length - 1,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    // Keyboard input takes over immediately, even while a pointer is held down.
    const gesture = drag.current;
    if (gesture) {
      drag.current = null;
      releaseVelocity.current = 0;
      setDragging(false);
      if (gesture.target.hasPointerCapture(gesture.pointer)) {
        gesture.target.releasePointerCapture(gesture.pointer);
      }
    }
    select(next);
  }

  return (
    <div className={className} style={{ width: "100%", ...style }}>
      <div className="relative">
        <motion.div
          style={{
            height,
            backgroundColor: paperColor,
            borderRadius: paperRadius,
            color: textColor,
            boxShadow:
              "0 26px 38px -30px rgba(48, 61, 28, 0.28), inset 0 1px 0 rgba(255,255,255,0.75)",
          }}
          className="relative overflow-hidden"
        >
          {levels.map((answer, index) => (
            <AnswerLayer
              key={answer.id}
              answer={answer}
              index={index}
              active={active}
              answerId={answerId}
              contentRef={(node) => {
                contentRefs.current[index] = node;
              }}
            />
          ))}
          <div
            ref={overlayRef}
            aria-hidden="true"
            inert
            className="pointer-events-none absolute inset-0"
          />
        </motion.div>
        <div
          role="slider"
          tabIndex={disabled || levels.length < 2 ? -1 : 0}
          aria-label={ariaLabel}
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={levels.length - 1}
          aria-valuenow={active}
          aria-valuetext={`${selected.label}, ${selected.readTime} second read`}
          aria-controls={answerId}
          aria-describedby={instructionsId}
          aria-disabled={disabled || levels.length < 2}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={(event) => finish(event)}
          onPointerCancel={(event) => finish(event, true)}
          onLostPointerCapture={(event) => finish(event, true)}
          onKeyDown={keyDown}
          onBlur={(event) => {
            delete event.currentTarget.dataset.pointerFocus;
          }}
          title="Drag up to shorten · drag down for more detail"
          className="absolute bottom-0 left-1/2 z-10 flex h-11 w-20 -translate-x-1/2 translate-y-1/2 touch-none select-none items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 data-[pointer-focus=true]:ring-0 data-[pointer-focus=true]:ring-offset-0"
          style={{
            cursor:
              disabled || levels.length < 2
                ? "default"
                : dragging
                  ? "grabbing"
                  : "ns-resize",
          }}
        >
          <motion.span
            aria-hidden="true"
            animate={{
              scale: dragging && !disabled && !reducedMotion ? 1.06 : 1,
            }}
            transition={{ duration: reducedMotion ? 0 : 0.12 }}
            className="flex h-[22px] w-[56px] items-center justify-center rounded-full border border-border bg-background"
            style={{
              boxShadow:
                "0 3px 5px rgba(48,61,28,0.10), 0 10px 18px rgba(48,61,28,0.05)",
              opacity: disabled ? 0.5 : 1,
            }}
          >
            <span
              className="h-[3px] w-5 rounded-full"
              style={{ backgroundColor: handleColor }}
            />
          </motion.span>
        </div>
      </div>
      <div
        className="mt-5 pr-1 text-right text-[12px] leading-5 tabular-nums text-muted-foreground"
        aria-hidden="true"
      >
        {selected.readTime} s read
      </div>
      <span id={instructionsId} className="sr-only">
        Drag up for a shorter answer or down for more detail. Use Up and Down
        arrow keys, Home for the shortest answer, or End for the full answer.
      </span>
    </div>
  );
}
