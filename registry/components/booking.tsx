"use client";

import * as React from "react";
import {
  ArrowUpRight,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
} from "lucide-react";
import { Faces, FACES_MORPH } from "./faces";
import { Input } from "./input";
import { NumberRoll } from "./number-roll";
import { StatusButton, type ActionStatus } from "./status-button";
import { Textarea } from "./textarea";
import { TextMorph } from "./text-morph";
import {
  EASE_THROW,
  INTERACTION_FOCUS,
  INTERACTION_PRESS,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";

/* ─────────────────────────────────────────────────────────
 * BOOKING: a time you pick prints onto your ticket
 *
 *   pick      the host's ticket is the lit surface, a stub punched
 *             off with two notches and a perforation. A week of
 *             days and its free times sit beside it; the time you
 *             pick prints onto the stub, its digits rolling the
 *             way the time moved, the date morphing
 *   details   the times turn into your name, email and a note on
 *             the same surface; Book goes Booking → Booked
 *   booked    a check stamps itself onto the stub, the stub reads
 *             Confirmed, and the surface offers the calendar file,
 *             the meeting link and Cancel
 *
 * The calendar is yours: getSlots gives the free start times of
 * the week on screen (once per week, aborted when you move on),
 * onBook makes the booking and onCancel undoes it. Throw and the
 * block says why where it happened.
 * ───────────────────────────────────────────────────────── */

export interface BookingHost {
  name: string;
  /** A line under the name, e.g. "Founder, Relay". */
  role?: string;
  /** Photo URL; initials when missing. */
  src?: string;
}

export interface BookingRequest {
  start: Date;
  end: Date;
  /** The IANA zone the times were shown in. */
  timeZone: string;
  name: string;
  email: string;
  note: string;
}

export interface BookingConfirmation {
  /** Your booking's id, passed back to onCancel. */
  id?: string;
  /** A video call link, shown once booked. */
  meetingUrl?: string;
}

export type BookedCall = BookingRequest & BookingConfirmation;

export interface BookingProps {
  host: BookingHost;
  /** What's being booked, e.g. "Intro call". */
  title: string;
  description?: string;
  /** Minutes. */
  duration: number;
  /** Where it happens, e.g. "Google Meet". */
  location?: string;
  /** Free start times from `from` up to `to` (one week). Called once per week shown; abort when signal fires. */
  getSlots: (
    range: { from: Date; to: Date; timeZone: string },
    signal: AbortSignal,
  ) => Promise<Array<Date | string | number>>;
  /** Make the booking; resolve with its id and meeting link, throw an Error to show its message. */
  onBook: (request: BookingRequest) => Promise<BookingConfirmation | void>;
  /** Cancel a booking made here; shows Cancel booking once booked. */
  onCancel?: (booking: BookedCall) => Promise<unknown>;
  /** IANA zone to show times in; defaults to the visitor's. */
  timeZone?: string;
  locale?: string;
  /** 12-hour clock; defaults to the locale's. */
  hour12?: boolean;
  /** 0 is Sunday, 1 is Monday. */
  weekStartsOn?: 0 | 1;
  /** A day in the first week shown; defaults to today. */
  defaultDate?: Date | string | number;
  className?: string;
}

type Day = { y: number; m: number; d: number };
type Step = "pick" | "details" | "done";
type Week = { status: "ready" | "error"; slots: number[] };

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const NOTCH = 10;

/* ── Calendar days in a zone, without a date library ── */
const pad = (n: number) => String(n).padStart(2, "0");
const keyOf = (d: Day) => `${d.y}-${pad(d.m)}-${pad(d.d)}`;
const noon = (d: Day) => new Date(Date.UTC(d.y, d.m - 1, d.d, 12));
const addDays = (d: Day, n: number): Day => {
  const t = new Date(Date.UTC(d.y, d.m - 1, d.d + n));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
};
const startOfWeek = (d: Day, first: number) =>
  addDays(d, -((noon(d).getUTCDay() - first + 7) % 7));

const clocks = new Map<string, Intl.DateTimeFormat>();
function wallClock(at: number, timeZone: string) {
  let f = clocks.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
    clocks.set(timeZone, f);
  }
  const p = Object.fromEntries(
    f.formatToParts(at).map((x) => [x.type, Number(x.value)]),
  );
  return { y: p.year, m: p.month, d: p.day, h: p.hour % 24, min: p.minute };
}
const dayIn = (at: number, timeZone: string): Day => {
  const { y, m, d } = wallClock(at, timeZone);
  return { y, m, d };
};
/** The instant the clock in `timeZone` reads midnight on `day` (two passes settle a clock change). */
function midnight(day: Day, timeZone: string) {
  const target = Date.UTC(day.y, day.m - 1, day.d);
  let t = target;
  for (let i = 0; i < 2; i++) {
    const w = wallClock(t, timeZone);
    t = target - (Date.UTC(w.y, w.m - 1, w.d, w.h, w.min) - t);
  }
  return new Date(t);
}

/* ── The calendar file and link, from the booking itself ── */
const stamp = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
const icsText = (s: string) =>
  s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
function calendarFile(
  b: BookedCall,
  title: string,
  host: string,
  location: string | undefined,
  made: Date,
) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${b.id ?? stamp(b.start)}-${b.email}`,
    `DTSTAMP:${stamp(made)}`,
    `DTSTART:${stamp(b.start)}`,
    `DTEND:${stamp(b.end)}`,
    `SUMMARY:${icsText(`${title} with ${host}`)}`,
    ...(b.meetingUrl || location
      ? [`LOCATION:${icsText(b.meetingUrl ?? location ?? "")}`]
      : []),
    ...(b.note ? [`DESCRIPTION:${icsText(b.note)}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}
function googleLink(
  b: BookedCall,
  title: string,
  host: string,
  location: string | undefined,
) {
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: `${title} with ${host}`,
    dates: `${stamp(b.start)}/${stamp(b.end)}`,
  });
  if (b.meetingUrl || location)
    q.set("location", b.meetingUrl ?? location ?? "");
  if (b.note) q.set("details", b.note);
  return `https://calendar.google.com/calendar/render?${q}`;
}

/* ── The lit ticket: --primary lit from its top corner by --primary-foreground, a deeper lower edge, 1px light edges ── */
const mix = (color: string, amount: number, into = "transparent") =>
  `color-mix(in oklab, ${color} ${amount}%, ${into})`;
const NOTCHES = `radial-gradient(circle at 0 var(--cut, 60%), transparent ${NOTCH - 1}px, #000 ${NOTCH - 0.5}px), radial-gradient(circle at 100% var(--cut, 60%), transparent ${NOTCH - 1}px, #000 ${NOTCH - 0.5}px)`;
const TICKET: React.CSSProperties = {
  backgroundColor: "var(--primary)",
  backgroundImage: `radial-gradient(130% 80% at 0% 0%, ${mix("var(--primary-foreground)", 24)} 0%, transparent 55%), linear-gradient(170deg, transparent 40%, ${mix("black", 24)} 100%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 38)}, inset 0 0 0 1px ${mix("var(--primary-foreground)", 12)}`,
  // Two notches punched from the edges at the perforation (--cut is measured), one half of the mask each.
  maskImage: NOTCHES,
  WebkitMaskImage: NOTCHES,
  maskSize: "51% 100%",
  WebkitMaskSize: "51% 100%",
  maskPosition: "left, right",
  WebkitMaskPosition: "left, right",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
};
const PERFORATION: React.CSSProperties = {
  backgroundImage: `repeating-linear-gradient(90deg, ${mix("var(--primary-foreground)", 30)} 0 5px, transparent 5px 10px)`,
};
const NOTCH_EDGE: React.CSSProperties = {
  width: NOTCH * 2,
  height: NOTCH * 2,
  top: 0,
  boxShadow: `inset 0 0 0 1px ${mix("var(--primary-foreground)", 22)}`,
};
const CARD: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 95, "var(--foreground)")})`,
  boxShadow: `0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 85)}`,
};
const LIT: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${mix("var(--primary-foreground)", 16)}, transparent 60%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 32)}, inset 0 0 0 1px ${mix("black", 10)}`,
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

/** The time on the stub: hours and minutes are odometers that roll the way the time moved. */
function PrintedTime({
  at,
  format,
  locale,
}: {
  at: number;
  format: Intl.DateTimeFormat;
  locale?: string;
}) {
  return (
    <>
      {format.formatToParts(at).map((p, i) => {
        const n = Number(p.value);
        if ((p.type === "hour" || p.type === "minute") && !Number.isNaN(n)) {
          return (
            <NumberRoll
              key={p.type}
              value={n}
              locales={locale}
              format={{
                minimumIntegerDigits: p.value.length,
                useGrouping: false,
              }}
              duration={900}
            />
          );
        }
        if (p.type === "dayPeriod") {
          return (
            <span
              key="period"
              className="ml-[0.12em] text-[0.42em] font-medium tracking-[-0.01em]"
            >
              <TextMorph>{p.value}</TextMorph>
            </span>
          );
        }
        return <span key={i}>{p.value}</span>;
      })}
    </>
  );
}

/** A check drawn onto the stub once the time is booked. */
function Stamp({ on, reduced }: { on: boolean; reduced: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-10 shrink-0 items-center justify-center rounded-full"
      style={{
        boxShadow: `inset 0 0 0 1px ${mix("var(--primary-foreground)", 40)}`,
        background: mix("var(--primary-foreground)", 10),
        opacity: on ? 1 : 0,
        transform: on || reduced ? "none" : "scale(0.6) rotate(-12deg)",
        filter: on || reduced ? "none" : "blur(3px)",
        transition: reduced
          ? "opacity 160ms"
          : on
            ? `opacity 280ms ${EASE} 160ms, transform 520ms ${EASE_THROW} 160ms, filter 280ms ${EASE} 160ms`
            : "opacity 160ms ease-out, transform 200ms ease-out, filter 160ms ease-out",
      }}
    >
      <svg viewBox="0 0 16 16" fill="none" className="size-[18px]">
        <path
          d="M3.5 8.5 6.5 11.5 12.5 4.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          style={{
            strokeDashoffset: on ? 0 : 1,
            transition:
              on && !reduced ? `stroke-dashoffset 460ms ${EASE} 420ms` : "none",
          }}
        />
      </svg>
    </span>
  );
}

const ENTER = (dir: number): Keyframe[] => [
  { opacity: 0, transform: `translateX(${dir * 22}px)`, filter: "blur(4px)" },
  { opacity: 1, transform: "none", filter: "blur(0px)" },
];

export function Booking({
  host,
  title,
  description,
  duration,
  location,
  getSlots,
  onBook,
  onCancel,
  timeZone: zoneProp,
  locale,
  hour12,
  weekStartsOn = 1,
  defaultDate,
  className = "",
}: BookingProps) {
  const reduced = useInteractionReducedMotion();
  const baseId = React.useId();

  // Today and the visitor's zone exist only in the browser, so the calendar starts once mounted.
  const [ready, setReady] = React.useState(false);
  const [localZone, setLocalZone] = React.useState<string | null>(null);
  const [today, setToday] = React.useState<Day | null>(null);
  const [week, setWeek] = React.useState<Day | null>(null);
  const zone = zoneProp ?? localZone;

  const [weeks, setWeeks] = React.useState<Record<string, Week>>({});
  const [dayPick, setDayPick] = React.useState<string | null>(null);
  const [slot, setSlot] = React.useState<number | null>(null);
  const [step, setStep] = React.useState<Step>("pick");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [note, setNote] = React.useState("");
  const [invalid, setInvalid] = React.useState<{
    name?: string;
    email?: string;
  }>({});
  const [status, setStatus] = React.useState<ActionStatus>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [booked, setBooked] = React.useState<{
    call: BookedCall;
    made: Date;
  } | null>(null);
  const [cancel, setCancel] = React.useState<{
    status: ActionStatus;
    confirm: boolean;
    error?: string;
  }>({ status: "idle", confirm: false });
  const [said, setSaid] = React.useState("");

  const getSlotsRef = React.useRef(getSlots);
  React.useLayoutEffect(() => {
    getSlotsRef.current = getSlots;
  });

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const z = zoneProp ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
      const now = dayIn(Date.now(), z);
      setLocalZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
      setToday(now);
      setWeek(
        startOfWeek(
          defaultDate !== undefined
            ? dayIn(new Date(defaultDate).getTime(), z)
            : now,
          weekStartsOn,
        ),
      );
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
    // The first week is chosen once; after that the visitor moves it.
  }, []);

  const weekKey = week && zone ? `${zone}|${keyOf(week)}` : null;
  const entry = weekKey ? weeks[weekKey] : undefined;
  const loading = Boolean(weekKey) && !entry;

  // One request per week shown, aborted when you move on before it answers.
  React.useEffect(() => {
    if (!weekKey || !week || !zone || !loading) return;
    const controller = new AbortController();
    const from = midnight(week, zone);
    const to = midnight(addDays(week, 7), zone);
    getSlotsRef
      .current({ from, to, timeZone: zone }, controller.signal)
      .then((list) => {
        if (controller.signal.aborted) return;
        const slots = [...new Set(list.map((s) => new Date(s).getTime()))]
          .filter((t) => t >= from.getTime() && t < to.getTime())
          .sort((a, b) => a - b);
        setWeeks((p) => ({ ...p, [weekKey]: { status: "ready", slots } }));
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setWeeks((p) => ({ ...p, [weekKey]: { status: "error", slots: [] } }));
      });
    return () => controller.abort();
  }, [weekKey, week, zone, loading]);

  const fmt = React.useMemo(() => {
    const tz = zone ?? undefined;
    const time = new Intl.DateTimeFormat(locale, {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
      hour12,
    });
    const date = new Intl.DateTimeFormat(locale, {
      timeZone: "UTC",
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    const short = new Intl.DateTimeFormat(locale, {
      timeZone: "UTC",
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    const weekday = new Intl.DateTimeFormat(locale, {
      timeZone: "UTC",
      weekday: "short",
    });
    const month = new Intl.DateTimeFormat(locale, {
      timeZone: "UTC",
      month: "long",
      year: "numeric",
    });
    const offset = tz
      ? new Intl.DateTimeFormat(locale, {
          timeZone: tz,
          timeZoneName: "shortOffset",
        })
      : null;
    return { time, date, short, weekday, month, offset };
  }, [locale, zone, hour12]);

  const days = React.useMemo(
    () => (week ? Array.from({ length: 7 }, (_, i) => addDays(week, i)) : []),
    [week],
  );
  const byDay = React.useMemo(() => {
    const map = new Map<string, number[]>();
    if (!zone || !entry) return map;
    for (const t of entry.slots) {
      const k = keyOf(dayIn(t, zone));
      map.set(k, [...(map.get(k) ?? []), t]);
    }
    return map;
  }, [entry, zone]);

  const todayKey = today ? keyOf(today) : "";
  const dayKey =
    (dayPick && byDay.has(dayPick) && days.some((d) => keyOf(d) === dayPick)
      ? dayPick
      : days.map(keyOf).find((k) => byDay.has(k))) ?? null;
  const day = days.find((d) => keyOf(d) === dayKey) ?? null;
  const daySlots = dayKey ? (byDay.get(dayKey) ?? []) : [];
  const picked = slot !== null && daySlots.includes(slot) ? slot : null;
  const shownAt =
    step === "done" && booked ? booked.call.start.getTime() : picked;
  const canPrev = Boolean(
    week && today && keyOf(week) > keyOf(startOfWeek(today, weekStartsOn)),
  );
  const busy = status === "pending" || status === "success";

  // The stub keeps the last time it printed while it fades, so the next pick rolls from it.
  const [printed, setPrinted] = React.useState<number | null>(null);
  if (shownAt !== null && shownAt !== printed) setPrinted(shownAt);

  const offsetAt =
    shownAt ?? (week && zone ? midnight(week, zone).getTime() : 0);
  const zoneName = zone
    ? `${zone.split("/").pop()?.replace(/_/g, " ")} time`
    : "";
  const zoneOffset = fmt.offset
    ?.formatToParts(offsetAt)
    .find((p) => p.type === "timeZoneName")?.value;
  const zoneLabel = zoneOffset ? `${zoneName} · ${zoneOffset}` : zoneName;
  const shownDay = shownAt !== null && zone ? dayIn(shownAt, zone) : day;
  const dateLabel = shownDay ? fmt.date.format(noon(shownDay)) : "Choose a day";

  /* ── Motion that marks a change: the week and the day's times come in from the side you moved to ── */
  const stripRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const ringRef = React.useRef<HTMLSpanElement>(null);
  const ringShown = React.useRef(false);
  const lastWeek = React.useRef<string | null>(null);
  const lastDay = React.useRef<string | null>(null);
  const ticketRef = React.useRef<HTMLDivElement>(null);
  const perfRef = React.useRef<HTMLDivElement>(null);
  const faceRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useLayoutEffect(() => {
    const prev = lastWeek.current;
    lastWeek.current = weekKey;
    if (!prev || !weekKey || prev === weekKey || reduced) return;
    stripRef.current?.animate(ENTER(weekKey > prev ? 1 : -1), {
      duration: 420,
      easing: EASE,
    });
  }, [weekKey, reduced]);

  React.useLayoutEffect(() => {
    const prev = lastDay.current;
    lastDay.current = dayKey;
    if (!prev || !dayKey || prev === dayKey || reduced) return;
    gridRef.current?.animate(ENTER(dayKey > prev ? 1 : -1), {
      duration: 380,
      easing: EASE,
    });
  }, [dayKey, reduced]);

  // The ring on the picked time is thrown between times; it's written to the element, not to state.
  React.useLayoutEffect(() => {
    const ring = ringRef.current;
    const grid = gridRef.current;
    if (!ring) return;
    const place = () => {
      const btn =
        picked !== null
          ? grid?.querySelector<HTMLElement>(`[data-slot="${picked}"]`)
          : null;
      if (!btn) {
        ring.style.opacity = "0";
        ringShown.current = false;
        return;
      }
      const glide = ringShown.current && !reduced;
      ring.style.transition = glide
        ? `transform 440ms ${EASE_THROW}, width 380ms ${EASE}, opacity 200ms`
        : "opacity 200ms";
      ring.style.width = `${btn.offsetWidth}px`;
      ring.style.height = `${btn.offsetHeight}px`;
      ring.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
      ring.style.opacity = "1";
      ringShown.current = true;
    };
    place();
    if (!grid) return;
    const observer = new ResizeObserver(place);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [picked, dayKey, reduced, loading]);

  // The notches sit wherever the perforation is, in either layout.
  React.useLayoutEffect(() => {
    const ticket = ticketRef.current;
    const perf = perfRef.current;
    if (!ticket || !perf) return;
    const place = () =>
      ticket.style.setProperty(
        "--cut",
        `${perf.offsetTop + perf.offsetHeight / 2}px`,
      );
    place();
    const observer = new ResizeObserver(place);
    observer.observe(ticket);
    return () => observer.disconnect();
  }, []);

  // Focus follows the surface to its next face.
  const faceIndex = step === "pick" ? 0 : step === "details" ? 1 : 2;
  const moved = React.useRef(false);
  React.useEffect(() => {
    if (!ready) return;
    if (!moved.current) {
      moved.current = true;
      return;
    }
    faceRefs.current[faceIndex]?.focus({ preventScroll: true });
  }, [faceIndex, ready]);

  const goWeek = (dir: number) => {
    if (!week || (dir < 0 && !canPrev)) return;
    setWeek(addDays(week, dir * 7));
    setSlot(null);
  };

  const pickDay = (k: string) => {
    if (k === dayKey) return;
    setDayPick(k);
    setSlot(null);
  };

  const timeShort = (t: number) => fmt.time.format(t);
  const refetch = (key: string | null) => {
    if (!key) return;
    setWeeks((p) => {
      const next = { ...p };
      delete next[key];
      return next;
    });
  };

  const book = async () => {
    if (picked === null || !zone || busy) return;
    const problems = {
      name: name.trim() ? undefined : "Add your name",
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ? undefined
        : email.trim()
          ? "That email doesn’t look right"
          : "Add your email",
    };
    setInvalid(problems);
    if (problems.name || problems.email) return;
    const request: BookingRequest = {
      start: new Date(picked),
      end: new Date(picked + duration * 60_000),
      timeZone: zone,
      name: name.trim(),
      email: email.trim(),
      note: note.trim(),
    };
    setStatus("pending");
    setError(null);
    try {
      const confirmation = (await onBook(request)) ?? {};
      setStatus("success");
      setBooked({ call: { ...request, ...confirmation }, made: new Date() });
      setSaid(
        `Booked ${fmt.date.format(noon(dayIn(picked, zone)))} at ${timeShort(picked)}`,
      );
      window.setTimeout(() => setStep("done"), reduced ? 500 : 700);
    } catch (e) {
      setStatus("error");
      setError(
        e instanceof Error && e.message
          ? e.message
          : "Couldn’t book that time. Try again.",
      );
      // The week may have changed under you (someone took the time): ask for it again.
      refetch(weekKey);
    }
  };

  const back = () => {
    if (busy) return;
    setStep("pick");
    setStatus("idle");
    setError(null);
    setInvalid({});
  };

  const cancelBooking = async () => {
    if (
      !booked ||
      !onCancel ||
      cancel.status === "pending" ||
      cancel.status === "success"
    )
      return;
    if (!cancel.confirm) {
      setCancel({ status: "idle", confirm: true });
      return;
    }
    setCancel({ status: "pending", confirm: true });
    try {
      await onCancel(booked.call);
      setCancel({ status: "success", confirm: true });
      setSaid("Booking cancelled");
      window.setTimeout(
        () => {
          setStep("pick");
          setStatus("idle");
          setSlot(null);
          setCancel({ status: "idle", confirm: false });
          refetch(weekKey);
          window.setTimeout(() => setBooked(null), FACES_MORPH);
        },
        reduced ? 500 : 800,
      );
    } catch (e) {
      setCancel({
        status: "error",
        confirm: true,
        error:
          e instanceof Error && e.message
            ? e.message
            : "Couldn’t cancel. Try again.",
      });
    }
  };

  // Asked to confirm a cancel, then left alone: the button goes back to how it was.
  React.useEffect(() => {
    if (!cancel.confirm || cancel.status !== "idle") return;
    const timer = window.setTimeout(
      () => setCancel({ status: "idle", confirm: false }),
      4000,
    );
    return () => window.clearTimeout(timer);
  }, [cancel]);

  const roving = (
    e: React.KeyboardEvent<HTMLElement>,
    keys: string[],
    current: string | null,
    select: (k: string) => void,
    cols = 1,
  ) => {
    const i = Math.max(0, current ? keys.indexOf(current) : 0);
    const moves: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: cols,
      ArrowUp: -cols,
    };
    let next = -1;
    if (e.key in moves)
      next = Math.min(keys.length - 1, Math.max(0, i + moves[e.key]));
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = keys.length - 1;
    if (next < 0) return;
    e.preventDefault();
    select(keys[next]);
    e.currentTarget
      .querySelector<HTMLElement>(`[data-key="${keys[next]}"]`)
      ?.focus();
  };

  const icon = `flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent ${INTERACTION_PRESS} ${INTERACTION_FOCUS}`;
  const big = `inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full text-[15px] font-medium ${INTERACTION_PRESS} ${INTERACTION_FOCUS}`;
  const quiet = `cursor-pointer rounded-full text-[13.5px] font-medium text-foreground shadow-[inset_0_0_0_1px_var(--border)] hover:bg-accent ${INTERACTION_PRESS} ${INTERACTION_FOCUS}`;
  const done = step === "done";
  const call = booked?.call;
  const availableKeys = days.map(keyOf).filter((k) => byDay.has(k));
  const dayIndex = days.findIndex((d) => keyOf(d) === dayKey);

  return (
    <section
      aria-label={`Book ${title}`}
      onKeyDown={(e) => {
        if (e.key === "Escape" && step === "details") {
          e.preventDefault();
          back();
        }
      }}
      className={`w-full max-w-[820px] rounded-[32px] p-2.5 text-card-foreground ${className}`}
      style={CARD}
    >
      {/* Its natural width where the parent sizes to its content, without forcing it on narrow screens. */}
      <div
        aria-hidden="true"
        data-natural-width
        className="grid h-0"
        style={{ gridTemplateColumns: "minmax(0, 820px)" }}
      />
      <div className="@container w-full">
        <div className="grid grid-cols-1 gap-2.5 @[660px]:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
          {/* The one lit surface: the host's ticket, with a stub the time prints onto. */}
          <div
            ref={ticketRef}
            className="relative flex flex-col overflow-clip rounded-[24px] text-primary-foreground"
            style={TICKET}
          >
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="relative flex size-10 shrink-0 select-none items-center justify-center overflow-hidden rounded-full text-[14px] font-medium"
                  style={{
                    background: mix("var(--primary-foreground)", 16),
                    boxShadow: `inset 0 0 0 1px ${mix("var(--primary-foreground)", 22)}`,
                  }}
                >
                  {initials(host.name)}
                  {host.src && (
                    <img
                      src={host.src}
                      alt=""
                      decoding="async"
                      className="absolute inset-0 size-full object-cover"
                    />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[14.5px] font-medium tracking-[-0.01em]">
                    {host.name}
                  </span>
                  {host.role && (
                    <span className="block truncate text-[12.5px] text-primary-foreground/70">
                      {host.role}
                    </span>
                  )}
                </span>
              </div>
              <h2 className="mt-4 text-[22px] font-medium leading-tight tracking-[-0.03em] @[480px]:mt-5 @[480px]:text-[24px] @[660px]:mt-7 @[660px]:text-[28px]">
                {title}
              </h2>
              {description && (
                <p className="mt-2 hidden text-[13.5px] leading-relaxed text-primary-foreground/75 @[480px]:block">
                  {description}
                </p>
              )}
              <p className="mt-3 flex flex-wrap items-center gap-x-4 @[480px]:mt-4 gap-y-1.5 text-[13px] text-primary-foreground/85">
                <span className="inline-flex items-center gap-1.5">
                  <Clock
                    aria-hidden="true"
                    className="size-[15px] opacity-80"
                  />
                  {duration} min
                </span>
                {location && (
                  <span className="inline-flex items-center gap-1.5">
                    <Video
                      aria-hidden="true"
                      className="size-[15px] opacity-80"
                    />
                    {location}
                  </span>
                )}
              </p>
            </div>

            {/* The perforation, with the edges of the notches the mask punches at either end. */}
            <div ref={perfRef} aria-hidden="true" className="relative h-5">
              <span
                className="absolute rounded-full"
                style={{ ...NOTCH_EDGE, left: -NOTCH }}
              />
              <span
                className="absolute rounded-full"
                style={{ ...NOTCH_EDGE, right: -NOTCH }}
              />
              <span
                className="absolute inset-x-[18px] top-1/2 h-px"
                style={PERFORATION}
              />
            </div>

            <div className="relative px-5 pb-5 pt-3">
              <div className="min-w-0">
                <p className="text-[12.5px] text-primary-foreground/65">
                  <TextMorph>
                    {done
                      ? "Confirmed"
                      : picked !== null
                        ? "Your time"
                        : "Pick a time"}
                  </TextMorph>
                </p>
                <p className="mt-1 truncate pr-12 text-[15px] font-medium tracking-[-0.01em]">
                  <TextMorph>{dateLabel}</TextMorph>
                </p>
                <p className="mt-3 grid text-[clamp(40px,13cqw,52px)] font-medium leading-none tracking-[-0.045em] tabular-nums @[660px]:text-[52px]">
                  <span className="sr-only">
                    {shownAt !== null
                      ? `${dateLabel}, ${timeShort(shownAt)}`
                      : "No time picked yet"}
                  </span>
                  <span
                    aria-hidden="true"
                    className="whitespace-nowrap [grid-area:1/1]"
                    style={{
                      opacity: shownAt !== null ? 1 : 0,
                      filter:
                        shownAt !== null || reduced ? "none" : "blur(6px)",
                      transition: reduced
                        ? "opacity 160ms"
                        : `opacity 280ms ${EASE}, filter 280ms ${EASE}`,
                    }}
                  >
                    {printed !== null ? (
                      <PrintedTime
                        at={printed}
                        format={fmt.time}
                        locale={locale}
                      />
                    ) : null}
                  </span>
                  <span
                    aria-hidden="true"
                    className="whitespace-nowrap font-extralight text-primary-foreground/40 [grid-area:1/1]"
                    style={{
                      opacity: shownAt !== null ? 0 : 1,
                      transition: reduced
                        ? "opacity 160ms"
                        : `opacity 220ms ${EASE}`,
                    }}
                  >
                    ––:––
                  </span>
                </p>
                <p className="mt-2.5 truncate text-[12.5px] text-primary-foreground/70">
                  {shownAt !== null
                    ? `Until ${timeShort(shownAt + duration * 60_000)} · `
                    : ""}
                  {zoneLabel}
                </p>
              </div>
              <span className="absolute right-5 top-3">
                <Stamp on={done} reduced={reduced} />
              </span>
            </div>
          </div>

          {/* The flat surface that turns from times to details to the confirmation. */}
          <Faces active={faceIndex} reduced={reduced} ready={ready}>
            <div
              ref={(el) => {
                faceRefs.current[0] = el;
              }}
              tabIndex={-1}
              role="group"
              aria-label="Pick a time"
              className="flex flex-col px-2 pb-1.5 pt-2 outline-none @[660px]:px-3 @[660px]:pt-3"
            >
              <div className="flex items-center justify-between gap-3 pl-1">
                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-foreground">
                  <TextMorph>
                    {day
                      ? fmt.month.format(noon(day))
                      : week
                        ? fmt.month.format(noon(week))
                        : "Times"}
                  </TextMorph>
                </h3>
                <div className="-mr-1 flex items-center">
                  <button
                    type="button"
                    aria-label="Previous week"
                    disabled={!canPrev}
                    onClick={() => goWeek(-1)}
                    className={icon}
                  >
                    <ChevronLeft aria-hidden="true" className="size-[18px]" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next week"
                    disabled={!week}
                    onClick={() => goWeek(1)}
                    className={icon}
                  >
                    <ChevronRight aria-hidden="true" className="size-[18px]" />
                  </button>
                </div>
              </div>

              <div className="relative mt-3">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 h-full rounded-[16px] bg-primary/[0.08] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_32%,transparent)]"
                  style={{
                    width: `${100 / 7}%`,
                    opacity: day ? 1 : 0,
                    transform: `translateX(${Math.max(0, dayIndex) * 100}%)`,
                    transition:
                      reduced || !ready
                        ? "opacity 160ms"
                        : `transform 460ms ${EASE_THROW}, opacity 200ms`,
                  }}
                />
                <div
                  ref={stripRef}
                  role="radiogroup"
                  aria-label="Day"
                  className="relative grid grid-cols-7"
                  onKeyDown={(e) => roving(e, availableKeys, dayKey, pickDay)}
                >
                  {(days.length
                    ? days
                    : Array.from({ length: 7 }, () => null)
                  ).map((d, i) => {
                    if (!d) return <span key={i} className="h-[62px]" />;
                    const k = keyOf(d);
                    const count = byDay.get(k)?.length ?? 0;
                    const on = k === dayKey;
                    const off = !loading && count === 0;
                    return (
                      <button
                        key={k}
                        type="button"
                        role="radio"
                        data-key={k}
                        aria-checked={on}
                        aria-label={`${fmt.date.format(noon(d))}, ${loading ? "loading" : count ? `${count} times` : "no times"}`}
                        disabled={off || loading}
                        tabIndex={on || (!dayKey && i === 0) ? 0 : -1}
                        onClick={() => pickDay(k)}
                        className={`relative flex h-[62px] cursor-pointer flex-col items-center justify-center gap-1 rounded-[16px] disabled:cursor-default ${INTERACTION_PRESS} ${INTERACTION_FOCUS} ${on ? "text-primary" : off ? "text-muted-foreground/45" : "text-foreground hover:bg-accent"}`}
                      >
                        <span
                          className={`text-[11.5px] ${on ? "text-primary/80" : "text-muted-foreground"} ${off ? "opacity-60" : ""}`}
                        >
                          {fmt.weekday.format(noon(d))}
                        </span>
                        <span
                          className={`text-[17px] font-medium leading-none tabular-nums ${off ? "line-through decoration-1" : ""}`}
                        >
                          {d.d}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`absolute bottom-[7px] size-1 rounded-full ${k === todayKey ? (on ? "bg-primary" : "bg-foreground/40") : "bg-transparent"}`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 flex items-baseline justify-between gap-3 pl-1">
                <p className="text-[12.5px] text-muted-foreground">
                  <TextMorph>
                    {day
                      ? fmt.short.format(noon(day))
                      : loading
                        ? "Finding times"
                        : "Times"}
                  </TextMorph>
                </p>
                {day && (
                  <p className="text-[12.5px] text-muted-foreground">
                    <NumberRoll value={daySlots.length} duration={600} /> free
                  </p>
                )}
              </div>

              <div className="relative mt-2.5 min-h-[136px]">
                <span
                  ref={ringRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 z-10 rounded-full opacity-0 shadow-[inset_0_0_0_1.5px_var(--primary)]"
                />
                {loading ? (
                  <div
                    aria-hidden="true"
                    className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-1.5"
                  >
                    {Array.from({ length: 9 }, (_, i) => (
                      <span
                        key={i}
                        className="h-10 animate-pulse rounded-full bg-muted motion-reduce:animate-none"
                      />
                    ))}
                  </div>
                ) : entry?.status === "error" ? (
                  <div className="flex min-h-[136px] flex-col items-center justify-center gap-2 text-center">
                    <p
                      role="alert"
                      className="text-[13.5px] text-muted-foreground"
                    >
                      Couldn’t load the times.
                    </p>
                    <button
                      type="button"
                      onClick={() => refetch(weekKey)}
                      className={`h-9 px-4 ${quiet}`}
                    >
                      Try again
                    </button>
                  </div>
                ) : !day ? (
                  <div className="flex min-h-[136px] flex-col items-center justify-center gap-2 text-center">
                    <p className="text-[13.5px] text-muted-foreground">
                      No free times this week.
                    </p>
                    <button
                      type="button"
                      onClick={() => goWeek(1)}
                      className={`inline-flex h-9 items-center gap-1 pl-4 pr-3 ${quiet}`}
                    >
                      Next week
                      <ChevronRight aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    ref={gridRef}
                    role="radiogroup"
                    aria-label={`Times on ${fmt.date.format(noon(day))}`}
                    className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-1.5"
                    onKeyDown={(e) => {
                      const cols = getComputedStyle(
                        e.currentTarget,
                      ).gridTemplateColumns.split(" ").length;
                      roving(
                        e,
                        daySlots.map(String),
                        picked !== null ? String(picked) : null,
                        (k) => setSlot(Number(k)),
                        cols,
                      );
                    }}
                  >
                    {daySlots.map((t, i) => {
                      const on = t === picked;
                      return (
                        <button
                          key={t}
                          type="button"
                          role="radio"
                          data-slot={t}
                          data-key={String(t)}
                          aria-checked={on}
                          tabIndex={on || (picked === null && i === 0) ? 0 : -1}
                          onClick={() => setSlot(t)}
                          className={`h-10 cursor-pointer rounded-full text-[14px] tabular-nums shadow-[inset_0_0_0_1px_var(--border)] ${INTERACTION_PRESS} ${INTERACTION_FOCUS} ${on ? "bg-primary/[0.07] font-medium text-primary" : "text-foreground hover:bg-accent"}`}
                        >
                          {timeShort(t)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={picked === null}
                onClick={() => setStep("details")}
                className={`${big} mt-5 bg-primary text-primary-foreground disabled:cursor-default disabled:opacity-45`}
                style={LIT}
              >
                <TextMorph>
                  {picked !== null
                    ? `Continue with ${timeShort(picked)}`
                    : "Pick a time"}
                </TextMorph>
              </button>
            </div>

            <div
              ref={(el) => {
                faceRefs.current[1] = el;
              }}
              tabIndex={-1}
              role="group"
              aria-labelledby={`${baseId}-details`}
              className="flex flex-col px-2 pb-1.5 pt-2 outline-none @[660px]:px-3 @[660px]:pt-3"
            >
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Back to times"
                  disabled={busy}
                  onClick={back}
                  className={`-ml-1.5 ${icon}`}
                >
                  <ChevronLeft aria-hidden="true" className="size-[18px]" />
                </button>
                <h3
                  id={`${baseId}-details`}
                  className="text-[15px] font-medium tracking-[-0.01em] text-foreground"
                >
                  Your details
                </h3>
              </div>
              <form
                noValidate
                className="mt-4 flex flex-col gap-3.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  void book();
                }}
              >
                <Input
                  label="Name"
                  autoComplete="name"
                  value={name}
                  disabled={busy}
                  error={invalid.name}
                  onValueChange={(v) => {
                    setName(v);
                    if (invalid.name)
                      setInvalid((p) => ({ ...p, name: undefined }));
                  }}
                />
                <Input
                  label="Email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  disabled={busy}
                  error={invalid.email}
                  onValueChange={(v) => {
                    setEmail(v);
                    if (invalid.email)
                      setInvalid((p) => ({ ...p, email: undefined }));
                  }}
                />
                <Textarea
                  label="Anything to share?"
                  value={note}
                  disabled={busy}
                  maxLength={500}
                  showCount={false}
                  minRows={3}
                  maxRows={6}
                  onValueChange={setNote}
                  placeholder="What you’d like to cover"
                />
                <StatusButton
                  type="submit"
                  status={status}
                  labels={{
                    idle:
                      picked !== null ? `Book ${timeShort(picked)}` : "Book",
                    pending: "Booking",
                    success: "Booked",
                    error: "Try again",
                  }}
                  className="mt-1.5 h-12 w-full text-[15px]"
                  style={status === "error" ? undefined : LIT}
                />
              </form>
              <p
                role={error ? "alert" : undefined}
                className={`mt-2 min-h-[18px] text-center text-[12.5px] ${error ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
              >
                {error ?? "You’ll get an invite by email."}
              </p>
            </div>

            <div
              ref={(el) => {
                faceRefs.current[2] = el;
              }}
              tabIndex={-1}
              role="group"
              aria-labelledby={`${baseId}-done`}
              className="flex flex-col px-2 pb-1.5 pt-2 outline-none @[660px]:px-3 @[660px]:pt-3"
            >
              <h3
                id={`${baseId}-done`}
                className="pl-1 text-[20px] font-medium tracking-[-0.02em] text-foreground"
              >
                You’re booked
              </h3>
              <p className="mt-1.5 pl-1 text-[13.5px] leading-relaxed text-muted-foreground">
                {call ? (
                  <>
                    An invite is on its way to{" "}
                    <span className="text-foreground">{call.email}</span>.
                  </>
                ) : null}
              </p>

              {call && (
                <dl className="mt-5 divide-y divide-border rounded-[20px] border border-border text-[13.5px]">
                  <div className="flex justify-between gap-3 px-4 py-3">
                    <dt className="text-muted-foreground">When</dt>
                    <dd className="text-right text-foreground">
                      {fmt.short.format(
                        noon(dayIn(call.start.getTime(), call.timeZone)),
                      )}
                      , {timeShort(call.start.getTime())} –{" "}
                      {timeShort(call.end.getTime())}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3 px-4 py-3">
                    <dt className="text-muted-foreground">With</dt>
                    <dd className="text-right text-foreground">{host.name}</dd>
                  </div>
                  {(call.meetingUrl || location) && (
                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <dt className="text-muted-foreground">Where</dt>
                      <dd className="min-w-0 text-right">
                        {call.meetingUrl ? (
                          <a
                            href={call.meetingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`inline-flex max-w-full items-center gap-1 rounded-full text-primary underline-offset-4 hover:underline ${INTERACTION_FOCUS}`}
                          >
                            <span className="truncate">
                              {location ? `Join ${location}` : "Join the call"}
                            </span>
                            <ArrowUpRight
                              aria-hidden="true"
                              className="size-3.5 shrink-0"
                            />
                          </a>
                        ) : (
                          <span className="text-foreground">{location}</span>
                        )}
                      </dd>
                    </div>
                  )}
                </dl>
              )}

              {call && booked && (
                <div className="mt-4 grid gap-2 @[420px]:grid-cols-2">
                  <a
                    href={calendarFile(
                      call,
                      title,
                      host.name,
                      location,
                      booked.made,
                    )}
                    download={`${
                      title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "") || "booking"
                    }.ics`}
                    className={`${big} text-foreground shadow-[inset_0_0_0_1px_var(--border)] hover:bg-accent`}
                  >
                    <CalendarPlus aria-hidden="true" className="size-[18px]" />
                    Add to calendar
                  </a>
                  <a
                    href={googleLink(call, title, host.name, location)}
                    target="_blank"
                    rel="noreferrer"
                    className={`${big} text-foreground shadow-[inset_0_0_0_1px_var(--border)] hover:bg-accent`}
                  >
                    Google Calendar
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 text-muted-foreground"
                    />
                  </a>
                </div>
              )}

              {onCancel && (
                <div className="mt-3 flex flex-col items-center">
                  <StatusButton
                    variant="ghost"
                    status={cancel.status}
                    labels={{
                      idle: cancel.confirm
                        ? "Yes, cancel it"
                        : "Cancel booking",
                      pending: "Cancelling",
                      success: "Cancelled",
                      error: "Try again",
                    }}
                    onClick={() => void cancelBooking()}
                    className={`h-10 px-4 text-[13.5px] ${cancel.confirm && cancel.status === "idle" ? "text-red-600 hover:text-red-600 dark:text-red-400 dark:hover:text-red-400" : ""}`}
                  />
                  {cancel.error && (
                    <p
                      role="alert"
                      className="mt-1 text-center text-[12.5px] text-red-600 dark:text-red-400"
                    >
                      {cancel.error}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Faces>
        </div>

        <span className="sr-only" role="status">
          {said}
        </span>
      </div>
    </section>
  );
}

export default Booking;
