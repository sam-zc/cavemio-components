"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { lifecycleEase, useLifecycleReducedMotion } from "./lifecycle-motion";

export type RequestLifecycleStage =
  "asked" | "planned" | "shipped" | "answered";
export interface RequestVoter {
  name: string;
  initials: string;
  color: string;
  image?: string;
}
export interface RequestLifecycleData {
  title: string;
  description: string;
  votes: number;
  voters: readonly RequestVoter[];
  activity: readonly { text: string; channel: string; voter: RequestVoter }[];
  roadmap: { label: string; count: number; address: string };
  release: { badge: string; date: string; title: string; description: string };
  email: {
    sender: string;
    initials: string;
    recipient: string;
    time: string;
    greeting: string;
    message: string;
  };
}
export interface RequestLifecyclePreviewProps {
  stage: RequestLifecycleStage;
  data: RequestLifecycleData;
  labels?: {
    pending?: string;
    planned?: string;
    completed?: string;
    votes?: string;
    emailed?: string;
    voters?: string;
    justNow?: string;
  };
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

function Avatar({ voter, size = 22 }: { voter: RequestVoter; size?: number }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [voter.image]);
  return voter.image && !failed ? (
    <img
      src={voter.image}
      alt=""
      onError={() => setFailed(true)}
      width={size}
      height={size}
      className="block shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size / 3,
        background: voter.color,
      }}
    >
      {voter.initials}
    </span>
  );
}

function StatusIcon({
  stage,
  size = 16,
}: {
  stage: RequestLifecycleStage;
  size?: number;
}) {
  const id = useId();
  const reduced = useLifecycleReducedMotion();
  const completed = stage === "shipped" || stage === "answered";
  const colorClass =
    stage === "asked"
      ? "text-[var(--warning,var(--color-amber-600))]"
      : "text-[var(--accent-ink,var(--foreground))]";
  const transition = reduced
    ? "none"
    : `transform 700ms ${lifecycleEase}, opacity 250ms ease-out`;
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`shrink-0 ${colorClass}`}
      style={{ transition: reduced ? "none" : "color 500ms ease" }}
    >
      <defs>
        <clipPath id={id}>
          <rect x="4.5" y="4.5" width="15" height="15" rx="5" />
        </clipPath>
      </defs>
      <rect
        x="1.5"
        y="1.5"
        width="21"
        height="21"
        rx="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="4.5"
        y="4.5"
        width="15"
        height="15"
        rx="5"
        fill="currentColor"
        opacity="0.17"
      />
      <g clipPath={`url(#${id})`}>
        <rect
          x="4.5"
          y="4.5"
          width="15"
          height="18"
          rx="3"
          fill="currentColor"
          style={{
            transform: `translateY(${stage === "asked" ? 15 : stage === "planned" ? 7.5 : 0}px)`,
            transition,
          }}
        />
      </g>
      <rect
        x="1"
        y="1"
        width="22"
        height="22"
        rx="8"
        fill="currentColor"
        style={{ opacity: completed ? 1 : 0, transition }}
      />
      <path
        d="m8 12 2.6 2.7 5.3-5.7"
        fill="none"
        stroke="white"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: completed ? 1 : 0, transition }}
      />
    </svg>
  );
}

const card =
  "rounded-[14px] bg-card p-5 ring-1 ring-border shadow-[0_32px_64px_-32px_rgba(0,0,0,0.3),0_10px_24px_-16px_rgba(0,0,0,0.16)]";
const pill =
  "flex min-h-10 items-center gap-2.5 rounded-full bg-card py-2 pr-4 pl-2 ring-1 ring-border shadow-[0_1px_3px_rgba(0,0,0,0.08)]";

/** The request stays mounted while the supporting scenes move around it. */
export function RequestLifecyclePreview({
  stage,
  data,
  labels,
  className = "",
  style,
  ariaLabel = "Request lifecycle preview",
}: RequestLifecyclePreviewProps) {
  const grainId = useId();
  const reduced = useLifecycleReducedMotion();
  const [entered, setEntered] = useState(false);
  const root = useRef<HTMLElement>(null);
  const [animatedVotes, setAnimatedVotes] = useState(data.votes);
  const [geometry, setGeometry] = useState({ offset: 0, height: 0 });
  const stack = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const request = useRef<HTMLElement>(null);
  const targetVotes = Math.max(0, Math.round(data.votes));
  const votes = stage === "asked" && !reduced ? animatedVotes : targetVotes;
  const voteLabel = labels?.votes ?? "votes";
  const status =
    stage === "asked"
      ? (labels?.pending ?? "Pending")
      : stage === "planned"
        ? (labels?.planned ?? "Planned")
        : (labels?.completed ?? "Completed");

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (stage !== "asked" || reduced || !entered) return;
    const start = performance.now();
    let frame = 0;
    const update = (now: number) => {
      const t = Math.min(1, (now - start) / 1200);
      setAnimatedVotes(
        Math.round(
          Math.min(1, targetVotes) +
            (targetVotes - Math.min(1, targetVotes)) * (1 - Math.pow(1 - t, 3)),
        ),
      );
      if (t < 1) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [stage, targetVotes, reduced, entered]);

  useEffect(() => {
    const measure = () => {
      const above = top.current?.offsetHeight ?? 0;
      const below = bottom.current?.offsetHeight ?? 0;
      const height = request.current?.offsetHeight ?? 0;
      // Preserve the stage anchors, centering only when copy needs more room.
      const anchors = { asked: 84, planned: 0, shipped: -100, answered: 92 };
      const offset =
        above + height + below + 88 <= 540
          ? anchors[stage]
          : (above - below) / 2;
      setGeometry({
        offset,
        height:
          2 *
            Math.max(height / 2 + above - offset, height / 2 + below + offset) +
          88,
      });
    };
    const observer = new ResizeObserver(measure);
    for (const node of [
      stack.current,
      top.current,
      bottom.current,
      request.current,
    ])
      if (node) observer.observe(node);
    measure();
    return () => observer.disconnect();
  }, [stage]);

  const layerStyle = (
    active: boolean,
    above = true,
    delay = 0,
  ): CSSProperties => ({
    opacity: active && (entered || reduced) ? 1 : 0,
    transform: `translateY(${(active && entered) || reduced ? 0 : above ? 8 : -8}px)`,
    transition: reduced
      ? "none"
      : `opacity 500ms ${lifecycleEase}, transform 500ms ${lifecycleEase}`,
    transitionDelay: active && !reduced ? `${delay}ms` : "0ms",
    pointerEvents: active ? "auto" : "none",
  });
  function layer(
    active: boolean,
    children: ReactNode,
    above: boolean,
    key: string,
  ) {
    return (
      <div
        key={key}
        ref={active ? (above ? top : bottom) : undefined}
        aria-hidden={!active}
        inert={!active}
        className={`absolute inset-x-0 ${above ? "bottom-full pb-3" : "top-full pt-3"}`}
        style={layerStyle(active, above)}
      >
        {children}
      </div>
    );
  }

  return (
    <section
      ref={root}
      aria-label={ariaLabel}
      data-stage={stage}
      className={`relative isolate grid w-full place-items-center overflow-hidden rounded-[14px] bg-muted px-5 text-foreground md:[--lifecycle-min-height:600px] ${className}`}
      style={{
        minHeight: `max(var(--lifecycle-min-height, 540px), ${geometry.height}px)`,
        ...style,
      }}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-[0.035] mix-blend-multiply"
      >
        <filter id={grainId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>
      <div
        ref={stack}
        className="relative w-full max-w-[380px]"
        style={{
          transform: `translateY(${geometry.offset}px)`,
          transition: reduced ? "none" : `transform 700ms ${lifecycleEase}`,
        }}
      >
        {layer(
          stage === "asked",
          <ul className="m-0 grid list-none gap-2 p-0">
            {data.activity.map((activity, index) => (
              <li
                key={`${activity.channel}-${index}`}
                className={pill}
                style={layerStyle(stage === "asked", true, index * 140)}
              >
                <Avatar voter={activity.voter} />
                <span className="min-w-0 flex-1 text-[13.5px] leading-5 tracking-[-0.01em]">
                  {activity.text}
                </span>
                <span className="shrink-0 text-[12px] text-muted-foreground">
                  {activity.channel}
                </span>
              </li>
            ))}
          </ul>,
          true,
          "activity",
        )}
        {layer(
          stage === "planned",
          <div className="flex flex-wrap items-center gap-2 px-1 text-[13px]">
            <StatusIcon stage="planned" size={14} />
            <span className="font-medium">{data.roadmap.label}</span>
            <span className="text-muted-foreground">{data.roadmap.count}</span>
            <span className="ml-auto break-all text-[12.5px] text-muted-foreground">
              {data.roadmap.address}
            </span>
          </div>,
          true,
          "roadmap",
        )}
        {layer(
          stage === "planned",
          <div className={pill}>
            <span className="grid size-[22px] shrink-0 place-items-center rounded-full bg-primary/20 text-[var(--accent-ink,var(--foreground))]">
              <svg
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="2" y="3.5" width="14" height="11" rx="2" />
                <path d="m2 5 7 4.5L16 5" />
              </svg>
            </span>
            <span className="text-[13.5px] tabular-nums">
              {labels?.emailed ?? "Emailed"} {targetVotes}{" "}
              {labels?.voters ?? "voters"}
            </span>
            <span className="ml-auto text-[12px] text-muted-foreground">
              {labels?.justNow ?? "just now"}
            </span>
          </div>,
          false,
          "notice",
        )}
        {layer(
          stage === "shipped",
          <article className={card}>
            <div className="flex items-center gap-2 text-[12px]">
              <span className="rounded-full bg-[color-mix(in_srgb,var(--success,var(--color-emerald-600))_10%,transparent)] px-2 py-0.5 font-medium text-[var(--success,var(--color-emerald-700))]">
                {data.release.badge}
              </span>
              <span className="text-muted-foreground">{data.release.date}</span>
            </div>
            <h3 className="mt-3 text-base leading-[1.3] font-semibold tracking-[-0.02em]">
              {data.release.title}
            </h3>
            <p className="mt-1.5 text-[13.5px] leading-[1.5] tracking-[-0.01em] text-pretty text-muted-foreground">
              {data.release.description}
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-[10px] bg-muted px-3 py-2">
              <StatusIcon stage="shipped" size={14} />
              <span className="text-[13px] font-medium">{data.title}</span>
              <span className="ml-auto shrink-0 text-[12.5px] text-muted-foreground">
                {targetVotes} {voteLabel}
              </span>
            </div>
          </article>,
          false,
          "release",
        )}
        {layer(
          stage === "answered",
          <article className={card}>
            <div className="flex items-center gap-2.5 border-b border-border pb-3.5">
              <Avatar
                voter={{
                  name: data.email.sender,
                  initials: data.email.initials,
                  color: "var(--foreground)",
                }}
                size={28}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold">
                  {data.email.sender}
                </p>
                <p className="text-[12.5px] text-muted-foreground">
                  {data.email.recipient}
                </p>
              </div>
              <span className="text-[12px] text-muted-foreground">
                {data.email.time}
              </span>
            </div>
            <div className="mt-3.5 grid gap-2 text-[13.5px] leading-[1.5] tracking-[-0.01em] text-foreground">
              <p>{data.email.greeting}</p>
              <p>{data.email.message}</p>
              <p className="border-l-2 border-border pl-3 font-medium text-foreground">
                {data.title}
              </p>
            </div>
          </article>,
          true,
          "email",
        )}
        <article ref={request} data-request-card className={`relative ${card}`}>
          <div className="flex items-center gap-2">
            <StatusIcon stage={stage} />
            <span className="text-[13px] font-medium tracking-[-0.005em] text-foreground">
              {status}
            </span>
          </div>
          <h3 className="mt-3 text-[18px] leading-[1.3] font-semibold tracking-[-0.02em]">
            {data.title}
          </h3>
          <p className="mt-1.5 text-sm leading-[1.5] tracking-[-0.01em] text-pretty text-muted-foreground">
            {data.description}
          </p>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
            <div
              className="flex -space-x-1.5"
              aria-label={data.voters.map((voter) => voter.name).join(", ")}
            >
              {data.voters.map((voter, index) => (
                <span
                  key={`${voter.name}-${index}`}
                  className="rounded-full ring-2 ring-white"
                >
                  <Avatar voter={voter} />
                </span>
              ))}
            </div>
            <span
              className="shrink-0 text-[13px] font-medium tracking-[-0.005em] tabular-nums"
              aria-label={`${targetVotes} ${voteLabel}`}
            >
              <span aria-hidden="true">
                {votes} {voteLabel}
              </span>
            </span>
          </div>
        </article>
      </div>
    </section>
  );
}
