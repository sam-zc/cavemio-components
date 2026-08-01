"use client";

import * as React from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { Fetch, type FetchHandle } from "./fetch-dog";
import { Input } from "./input";
import { TextMorph } from "./text-morph";
import {
  EASE_OUT,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";

/* ─────────────────────────────────────────────────────────
 * NOT FOUND: Fetch goes and looks for it
 *
 *   lost     a 404 engraved into the lit stage and Fetch, a
 *            puppy, sitting in front of it; your popular pages
 *            are listed under the search
 *   sniff    typing: nose to the ground, a twitch per key
 *   fetch    350ms after the typing stops, search() runs and he
 *            sprints off the edge of the stage; a newer query
 *            aborts the older one
 *   found    he runs back in with a newspaper and the results
 *            drop in under the field
 *   stick    nothing found: he comes back with a stick, and
 *            your links come back too
 *
 * search(query, signal) is yours: your site search, your docs
 * index, a fetch to your own API.
 * ───────────────────────────────────────────────────────── */

export interface NotFoundResult {
  title: string;
  href: string;
  /** A short line under the title: a section, a path, a date. */
  hint?: string;
}

export interface NotFoundProps {
  /** Find pages for a query; aborted when a newer one starts. */
  search: (query: string, signal: AbortSignal) => Promise<NotFoundResult[]>;
  /** Shown before anyone searches, and when nothing is found. */
  links?: NotFoundResult[];
  /** The address that wasn't found, shown under the title. */
  path?: string;
  homeHref?: string;
  /** What the puppy is called in his lines. */
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
const STAGE: React.CSSProperties = {
  backgroundColor: "var(--primary)",
  backgroundImage: [
    `radial-gradient(60% 70% at 26% 100%, ${mix(PF, 22)} 0%, transparent 70%)`,
    `linear-gradient(175deg, transparent 40%, ${mix("black", 22)} 100%)`,
  ].join(", "),
  boxShadow: `inset 0 1px 0 ${mix(PF, 36)}, inset 0 0 0 1px ${mix(PF, 12)}`,
};

type Phase = "idle" | "typing" | "fetching" | "found" | "none" | "error";

export function NotFound({
  search,
  links = [],
  path,
  homeHref = "/",
  name = "Fetch",
  className = "",
}: NotFoundProps) {
  const reduced = useInteractionReducedMotion();
  const baseId = React.useId();
  const dog = React.useRef<FetchHandle>(null);
  const [query, setQuery] = React.useState("");
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [results, setResults] = React.useState<NotFoundResult[]>([]);
  const [shown, setShown] = React.useState(0);
  const run = React.useRef<{ timer: number; ctrl: AbortController | null }>({
    timer: 0,
    ctrl: null,
  });
  const searchRef = React.useRef(search);
  React.useEffect(() => {
    searchRef.current = search;
  });
  React.useEffect(
    () => () => {
      window.clearTimeout(run.current.timer);
      run.current.ctrl?.abort();
    },
    [],
  );

  const change = (next: string) => {
    setQuery(next);
    window.clearTimeout(run.current.timer);
    run.current.ctrl?.abort();
    const q = next.trim();
    if (!q) {
      setPhase("idle");
      dog.current?.back("sit");
      return;
    }
    setPhase("typing");
    dog.current?.sniff();
    run.current.timer = window.setTimeout(async () => {
      const ctrl = new AbortController();
      run.current.ctrl = ctrl;
      setPhase("fetching");
      dog.current?.go();
      try {
        const found = await searchRef.current(q, ctrl.signal);
        if (ctrl.signal.aborted) return;
        setResults(found);
        setShown((n) => n + 1);
        setPhase(found.length ? "found" : "none");
        dog.current?.back(found.length ? "paper" : "stick");
      } catch {
        if (ctrl.signal.aborted) return;
        setPhase("error");
        dog.current?.back("sit");
      }
    }, 350);
  };

  const mood =
    phase === "fetching"
      ? `${name} is fetching…`
      : phase === "typing"
        ? `${name} has a scent`
        : phase === "found"
          ? `${name} found ${results.length === 1 ? "one" : results.length}`
          : phase === "none"
            ? "fetch() came back with a stick"
            : phase === "error"
              ? `${name} couldn’t get out`
              : `${name} lost this page too`;
  const list =
    phase === "found"
      ? results
      : phase === "fetching" && results.length
        ? results
        : links;
  const listTitle =
    phase === "found" || (phase === "fetching" && results.length)
      ? "Found"
      : phase === "none"
        ? "Try one of these"
        : "Popular pages";

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
          <Fetch ref={dog} reduced={reduced}>
            {/* the signature: a 404 engraved into the stage, outlines only */}
            <span
              aria-hidden="true"
              className="absolute select-none font-semibold leading-none tracking-[-0.06em]"
              style={{
                left: 166,
                top: 34,
                fontSize: 104,
                color: "transparent",
                WebkitTextStroke: `1px ${mix(PF, 34)}`,
              }}
            >
              404
            </span>
            {/* the floor he sits on */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 h-px"
              style={{ top: 152, background: mix(PF, 18) }}
            />
          </Fetch>
          <p className="absolute left-3.5 top-3 z-10 text-[12.5px] font-medium text-primary-foreground/85">
            <TextMorph>{mood}</TextMorph>
          </p>
        </div>

        <div className="px-3 pb-2 pt-3">
          <h2
            id={`${baseId}-title`}
            className="text-[15px] font-medium tracking-[-0.01em]"
          >
            Page not found
          </h2>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">
            {path ? (
              <>
                Nothing lives at{" "}
                <span className="font-mono text-[12px] text-foreground">
                  {path}
                </span>
                .{" "}
              </>
            ) : (
              "This page moved or never existed. "
            )}
            Ask {name} to find it.
          </p>
          <Input
            className="mt-3"
            aria-label="Search the site"
            placeholder="Search pages"
            leading={<Search />}
            clearable
            value={query}
            onValueChange={change}
            autoComplete="off"
            spellCheck={false}
          />

          {list.length > 0 && (
            <div className="mt-3">
              <p className="px-1 text-[11.5px] font-medium text-muted-foreground">
                <TextMorph>{listTitle}</TextMorph>
              </p>
              <ul
                key={`${listTitle}-${shown}`}
                className="mt-1"
                aria-live="polite"
              >
                {list.slice(0, 5).map((r, i) => (
                  <li
                    key={r.href}
                    style={
                      reduced
                        ? undefined
                        : {
                            animation: `ui-fade-up 360ms ${EASE_OUT} ${i * 50}ms backwards`,
                          }
                    }
                  >
                    <a
                      href={r.href}
                      className="group flex min-h-10 items-center gap-2 rounded-[10px] px-2 py-1.5 outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium">
                          {r.title}
                        </span>
                        {r.hint && (
                          <span className="block truncate text-[11.5px] text-muted-foreground">
                            {r.hint}
                          </span>
                        )}
                      </span>
                      <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a
            href={homeHref}
            className="mt-2 inline-block px-1 text-[12.5px] text-muted-foreground underline decoration-border underline-offset-2 hover:text-foreground"
          >
            Take me home
          </a>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
