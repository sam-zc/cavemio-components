"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  EASE_OUT,
  EASE_SETTLE,
  INTERACTION_FOCUS,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";
import { useCardDeckGesture, type DeckThrow } from "./use-card-deck-gesture";
import { NumberRoll } from "./number-roll";

export interface CardDeckProps<T extends { id: string }> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> {
  items: T[];
  renderCard: (
    item: T,
    state: { active: boolean; index: number },
  ) => React.ReactNode;
  getLabel?: (item: T) => string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  label?: string;
  /** Fixed card height keeps the stack stable while content changes. */
  height?: number;
}

function DepartingCard({
  motion,
  reduced,
  children,
}: {
  motion: DeckThrow;
  reduced: boolean;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const end = -motion.direction * el.offsetWidth * 1.35;
    const fromAngle =
      Math.sign(motion.from) *
      Math.min(16, Math.sqrt(Math.abs(motion.from)) * 1.05);
    const endAngle = -motion.direction * 15;
    const dur = Math.min(
      380,
      Math.max(260, 360 - Math.abs(motion.velocity) * 80),
    );
    const animation = el.animate(
      [
        {
          transform: `translate3d(${motion.from}px,${-Math.abs(motion.from) * 0.05}px,0) rotate(${fromAngle}deg)`,
          opacity: 1,
        },
        {
          transform: `translate3d(${end}px,-10px,0) rotate(${endAngle}deg)`,
          opacity: 0,
        },
      ],
      { duration: dur, easing: EASE_OUT, fill: "forwards" },
    );
    return () => animation.cancel();
  }, [motion, reduced]);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      inert
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[22px] border border-border bg-card text-card-foreground"
    >
      {children}
    </div>
  );
}

/** Where a card behind the front one sits: lower and smaller by depth, rising as the front card leaves. */
const stackTransform = (depth: number, progress: number, fanned: boolean) =>
  `translate3d(0,${depth * (fanned ? 16 : 11) - progress * 11}px,0) scale(${1 - depth * 0.05 + progress * 0.05}) rotate(${fanned ? (depth % 2 ? -1 : 1) * depth * 1.3 : 0}deg)`;

/**
 * A tactile stack. Gestures write transforms straight onto the cards, and every card has its own compositor layer,
 * so a drag moves pictures instead of repainting them. React changes only when a card is chosen.
 */
export function CardDeck<T extends { id: string }>({
  items,
  renderCard,
  getLabel = (item) => item.id,
  value,
  defaultValue,
  onValueChange,
  label = "Card collection",
  height = 340,
  className = "",
  ...props
}: CardDeckProps<T>) {
  const reduced = useInteractionReducedMotion();
  const [own, setOwn] = React.useState(defaultValue ?? items[0]?.id);
  const selected = value ?? own;
  const index = Math.max(
    0,
    items.findIndex((item) => item.id === selected),
  );
  const current = items[index];
  const [leaving, setLeaving] = React.useState<DeckThrow | null>(null);
  const busy = React.useRef(false);
  const [fanned, setFanned] = React.useState(false);
  const restoreCardFocus = React.useRef(false);

  const choose = (direction: number, from?: number, velocity = 0) => {
    if (items.length < 2 || !current || busy.current) return false;
    const next = items[(index + direction + items.length) % items.length];
    restoreCardFocus.current = Boolean(
      document.activeElement?.hasAttribute("data-deck-active"),
    );
    busy.current = !reduced;
    const transform = frontRef.current
      ? getComputedStyle(frontRef.current).transform
      : "none";
    const origin =
      from ?? (transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m41);
    if (!reduced)
      setLeaving({ id: current.id, direction, from: origin, velocity });
    if (value === undefined) setOwn(next.id);
    onValueChange?.(next.id);
    return true;
  };
  const backs = React.useRef(new Map<number, HTMLDivElement>());
  const fannedRef = React.useRef(false);
  const onProgress = (progress: number, settle: boolean) => {
    if (reduced) return;
    backs.current.forEach((el, depth) => {
      el.style.transition = settle ? `transform 480ms ${EASE_SETTLE}` : "none";
      el.style.transform = stackTransform(depth, progress, fannedRef.current);
    });
  };
  const { rootRef, frontRef, dragging, handlers, resetFront } =
    useCardDeckGesture({
      id: current?.id,
      count: items.length,
      reduced,
      onThrow: choose,
      onProgress,
    });

  if (leaving && leaving.id === current?.id) {
    setLeaving(null);
  }

  React.useLayoutEffect(() => {
    if (restoreCardFocus.current) {
      frontRef.current?.focus({ preventScroll: true });
      restoreCardFocus.current = false;
    }
  }, [current?.id, frontRef]);

  React.useLayoutEffect(() => {
    if (leaving && leaving.id === current?.id) {
      // A controlled parent may reject a selection. Keep the original card available.
      resetFront();
      busy.current = false;
    }
  }, [leaving, current?.id, resetFront]);

  React.useEffect(() => {
    const timer = window.setTimeout(
      () => {
        setLeaving(null);
        busy.current = false;
      },
      reduced ? 0 : 430,
    );
    return () => window.clearTimeout(timer);
  }, [selected, leaving, reduced]);

  const ordered = current
    ? Array.from({ length: Math.min(4, items.length) }, (_, depth) => ({
        item: items[(index + depth) % items.length],
        depth,
      }))
    : [];
  const departing = leaving && items.find((item) => item.id === leaving.id);
  const expanded = fanned && !reduced;
  React.useLayoutEffect(() => {
    fannedRef.current = expanded;
  });

  return (
    <div
      ref={rootRef}
      aria-label={label}
      role="region"
      className={`w-full text-foreground ${className}`}
      {...props}
    >
      <div className="mx-auto max-w-[320px] px-3">
        <div
          className="relative isolate"
          style={{ height: Math.max(120, height) }}
          onPointerEnter={() => setFanned(true)}
          onPointerLeave={() => setFanned(false)}
        >
          {ordered
            .slice()
            .reverse()
            .map(({ item, depth }) => {
              const active = depth === 0;
              return (
                <div
                  key={item.id}
                  ref={
                    active
                      ? frontRef
                      : (el) => {
                          if (el) backs.current.set(depth, el);
                        }
                  }
                  tabIndex={active ? 0 : -1}
                  role="group"
                  aria-roledescription="card"
                  aria-label={
                    active
                      ? `${getLabel(item)}, ${index + 1} of ${items.length}. Use Left and Right to browse.`
                      : undefined
                  }
                  aria-hidden={!active || undefined}
                  inert={!active}
                  data-deck-active={active || undefined}
                  onKeyDown={
                    active
                      ? (event) => {
                          if (event.target !== event.currentTarget) return;
                          if (
                            event.key === "ArrowRight" ||
                            event.key === "ArrowLeft"
                          ) {
                            event.preventDefault();
                            choose(event.key === "ArrowRight" ? 1 : -1);
                          }
                        }
                      : undefined
                  }
                  onFocus={active ? () => setFanned(true) : undefined}
                  onBlur={
                    active
                      ? (event) => {
                          if (
                            !event.currentTarget.contains(
                              event.relatedTarget as Node,
                            )
                          )
                            setFanned(false);
                        }
                      : undefined
                  }
                  {...(active ? handlers : {})}
                  className={`absolute inset-0 overflow-hidden rounded-[22px] border border-border bg-card text-card-foreground ${active ? `${dragging ? "cursor-grabbing" : "cursor-grab"} ${INTERACTION_FOCUS}` : "pointer-events-none"}`}
                  style={{
                    zIndex: 10 - depth,
                    touchAction: active ? "pan-y" : undefined,
                    willChange: reduced ? undefined : "transform",
                    transform: active
                      ? undefined
                      : stackTransform(depth, 0, expanded),
                    transformOrigin: "50% 100%",
                    transition:
                      reduced || dragging
                        ? "none"
                        : `transform 520ms ${EASE_SETTLE}`,
                  }}
                >
                  {renderCard(item, { active, index: items.indexOf(item) })}
                </div>
              );
            })}
          {leaving && departing && (
            <DepartingCard key={leaving.id} motion={leaving} reduced={reduced}>
              {renderCard(departing, {
                active: false,
                index: items.indexOf(departing),
              })}
            </DepartingCard>
          )}
        </div>
      </div>
      {current && (
        <div className="mt-14 flex items-center justify-center gap-5">
          <button
            type="button"
            aria-label="Previous card"
            disabled={items.length < 2}
            onClick={() => choose(-1)}
            className={`cursor-pointer disabled:cursor-default flex size-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent disabled:opacity-30 ${INTERACTION_FOCUS}`}
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
          </button>
          <p
            aria-live="polite"
            aria-atomic="true"
            className="min-w-12 text-center font-mono text-[11px] tabular-nums text-muted-foreground"
          >
            <NumberRoll
              value={index + 1}
              format={{ minimumIntegerDigits: 2 }}
            />{" "}
            /{" "}
            <NumberRoll
              value={items.length}
              format={{ minimumIntegerDigits: 2 }}
            />
          </p>
          <button
            type="button"
            aria-label="Next card"
            disabled={items.length < 2}
            onClick={() => choose(1)}
            className={`cursor-pointer disabled:cursor-default flex size-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent disabled:opacity-30 ${INTERACTION_FOCUS}`}
          >
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
