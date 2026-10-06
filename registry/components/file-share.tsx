"use client";

import * as React from "react";
import { Lock, RotateCw, Upload, X } from "lucide-react";
import { CopyButton } from "./copy-button";
import { Faces } from "./faces";
import { Input } from "./input";
import { NumberRoll } from "./number-roll";
import { SegmentedControl } from "./segmented-control";
import { StatusButton, type ActionStatus } from "./status-button";
import { Switch } from "./switch";
import { TextMorph } from "./text-morph";
import {
  INTERACTION_FOCUS,
  INTERACTION_PRESS,
  useInteractionReducedMotion,
} from "./imported-ui-interaction-motion";

/* ─────────────────────────────────────────────────────────
 * FILE SHARE: files that fold into one link
 *
 *   drop      the lit panel is the drop area; dragging files over
 *             it brightens its edge and says how many will land
 *   upload    each file uploads as soon as it's added, its row
 *             filling with a thin line and rolling its percent;
 *             a failed one offers Retry, a removed one is aborted
 *   options   how long the link lives, and an optional password
 *   link      Create link goes Creating → the rows fly up into the
 *             panel, which turns into the link card: the URL with
 *             Copy, what's in it, and the files fanned as a stack
 *
 * Storage is yours: onUpload sends one file (report progress and
 * honour the signal), onCreateLink makes the link from what your
 * uploads returned. Throw an Error and its message shows in place.
 * ───────────────────────────────────────────────────────── */

export interface FileShareUploadContext {
  /** Report progress from 0 to 1. */
  onProgress: (fraction: number) => void;
  /** Aborted when the file is removed. */
  signal: AbortSignal;
}

export interface FileShareFile {
  name: string;
  size: number;
  type: string;
  /** Whatever onUpload resolved with for this file, e.g. its storage key. */
  result: unknown;
}

export interface FileShareRequest {
  files: FileShareFile[];
  /** Days the link lives. */
  expiresIn: number;
  password?: string;
}

export interface FileShareHandle {
  /** Add files from anywhere: a paste handler, a button of your own. */
  add: (files: File[]) => void;
}

export interface FileShareProps {
  /** Upload one file; resolve with what you'll need to make the link (a key, an id). */
  onUpload: (file: File, context: FileShareUploadContext) => Promise<unknown>;
  /** Make the link; resolve with its URL. */
  onCreateLink: (share: FileShareRequest) => Promise<{ url: string }>;
  /** Native input syntax, e.g. "image/*,.pdf". */
  accept?: string;
  /** Bytes per file. */
  maxSize?: number;
  maxFiles?: number;
  /** Choices for how many days the link lives. */
  expiries?: number[];
  ref?: React.Ref<FileShareHandle>;
  className?: string;
}

type Item = {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
  result?: unknown;
  controller?: AbortController;
};

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const EXPIRIES = [1, 7, 30];
const mix = (color: string, amount: number, into = "transparent") =>
  `color-mix(in oklab, ${color} ${amount}%, ${into})`;
const LIT: React.CSSProperties = {
  backgroundColor: "var(--primary)",
  backgroundImage: `radial-gradient(120% 90% at 0% 0%, ${mix("var(--primary-foreground)", 22)} 0%, transparent 55%), linear-gradient(175deg, transparent 40%, ${mix("black", 24)} 100%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 36)}, inset 0 0 0 1px ${mix("var(--primary-foreground)", 12)}`,
};
const CARD: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, var(--card), ${mix("var(--card)", 95, "var(--foreground)")})`,
  boxShadow: `0 0 0 1px var(--border), inset 0 1px 0 ${mix("var(--background)", 85)}`,
};
const ACTION: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${mix("var(--primary-foreground)", 16)}, transparent 60%)`,
  boxShadow: `inset 0 1px 0 ${mix("var(--primary-foreground)", 32)}, inset 0 0 0 1px ${mix("black", 10)}`,
};

const extOf = (name: string) =>
  name.includes(".")
    ? name.split(".").pop()!.slice(0, 4).toUpperCase()
    : "FILE";
function tint(seed: string): React.CSSProperties {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const chart = `var(--chart-${(h % 5) + 1}, var(--primary))`;
  return {
    background: mix(chart, 20, "var(--card)"),
    color: mix(chart, 75, "var(--foreground)"),
    boxShadow: `inset 0 0 0 1px ${mix(chart, 26)}`,
  };
}
function size(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let u = 0;
  while (n >= 1000 && u < units.length - 1) {
    n /= 1000;
    u++;
  }
  return `${n >= 10 || u === 0 ? Math.round(n) : n.toFixed(1)} ${units[u]}`;
}
let seq = 0;

export function FileShare({
  onUpload,
  onCreateLink,
  accept,
  maxSize,
  maxFiles = 20,
  expiries = EXPIRIES,
  ref,
  className = "",
}: FileShareProps) {
  const reduced = useInteractionReducedMotion();
  const baseId = React.useId();
  const [items, setItems] = React.useState<Item[]>([]);
  const [over, setOver] = React.useState(0);
  const [expires, setExpires] = React.useState(
    expiries[Math.min(1, expiries.length - 1)] ?? 7,
  );
  const [lock, setLock] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [create, setCreate] = React.useState<{
    status: ActionStatus;
    error?: string;
  }>({ status: "idle" });
  const [link, setLink] = React.useState<{
    url: string;
    files: Item[];
    flown?: boolean;
  } | null>(null);
  // While the rows fly up, the list stops clipping so they can leave it.
  const [flying, setFlying] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [said, setSaid] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const sectionRef = React.useRef<HTMLElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const depth = React.useRef(0);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const patch = (id: string, next: Partial<Item>) =>
    setItems((list) => list.map((i) => (i.id === id ? { ...i, ...next } : i)));

  const upload = (item: Item) => {
    const controller = new AbortController();
    patch(item.id, {
      status: "uploading",
      progress: 0,
      error: undefined,
      controller,
    });
    onUpload(item.file, {
      onProgress: (f) =>
        patch(item.id, { progress: Math.max(0, Math.min(1, f)) }),
      signal: controller.signal,
    })
      .then((result) => {
        if (!controller.signal.aborted)
          patch(item.id, { status: "done", progress: 1, result });
      })
      .catch((e) => {
        if (!controller.signal.aborted)
          patch(item.id, {
            status: "error",
            error:
              e instanceof Error && e.message ? e.message : "Upload failed",
          });
      });
  };

  const add = (files: FileList | File[]) => {
    if (link) return;
    const room = Math.max(0, maxFiles - items.length);
    const next: Item[] = [...files].slice(0, room).map((file) => ({
      id: `f${++seq}`,
      file,
      progress: 0,
      status: "uploading" as const,
    }));
    for (const item of next) {
      if (maxSize && item.file.size > maxSize) {
        item.status = "error";
        item.error = `Over ${size(maxSize)}`;
      }
    }
    setItems((list) => [...list, ...next]);
    setCreate({ status: "idle" });
    setSaid(`${next.length} ${next.length === 1 ? "file" : "files"} added.`);
    next.filter((i) => i.status !== "error").forEach(upload);
  };

  React.useImperativeHandle(ref, () => ({
    add: (files: File[]) => add(files),
  }));

  const remove = (item: Item) => {
    item.controller?.abort();
    setItems((list) => list.filter((i) => i.id !== item.id));
  };

  const doneItems = items.filter((i) => i.status === "done");
  const uploading = items.some((i) => i.status === "uploading");
  const total = items.reduce((n, i) => n + i.file.size, 0);
  const sent = items.reduce(
    (n, i) => n + i.file.size * (i.status === "done" ? 1 : i.progress),
    0,
  );
  const canCreate =
    doneItems.length > 0 && !uploading && (!lock || password.trim().length > 0);
  const busy = create.status === "pending" || create.status === "success";

  const createLink = async () => {
    if (!canCreate || busy) return;
    setCreate({ status: "pending" });
    try {
      const { url } = await onCreateLink({
        files: doneItems.map((i) => ({
          name: i.file.name,
          size: i.file.size,
          type: i.file.type,
          result: i.result,
        })),
        expiresIn: expires,
        password: lock && password.trim() ? password.trim() : undefined,
      });
      setCreate({ status: "success" });
      setSaid(`Link ready: ${url}`);
      // Each file's tile leaps into the corner where the link's stack appears and lands as one of its cards,
      // while the rows fold away; then the panel turns into the link under tiles already in place.
      const section = sectionRef.current;
      const panel = panelRef.current?.getBoundingClientRect();
      const rows = [
        ...(listRef.current?.querySelectorAll<HTMLElement>("[data-file]") ??
          []),
      ];
      const flights: HTMLElement[] = [];
      if (section && panel && rows.length && !reduced) {
        setFlying(true);
        const box = section.getBoundingClientRect();
        // Screen px to the block's own px, so the tiles land true inside a scaled or zoomed container too.
        const k = box.width / (section.offsetWidth || box.width) || 1;
        // The stack's centre on the link face: the panel's top-right corner, inside its padding.
        const fan = { x: panel.right - 54 * k, y: panel.top + 46 * k };
        const shown = rows.slice(0, 3);
        shown.forEach((row, i) => {
          row.animate(
            [
              { opacity: 1, transform: "none" },
              { opacity: 0, transform: "translateY(-6px)" },
            ],
            {
              duration: 260,
              delay: 120 + i * 90,
              easing: EASE,
              fill: "forwards",
            },
          );
          const tile = row.querySelector<HTMLElement>("[data-tile]");
          if (!tile) return;
          const r = tile.getBoundingClientRect();
          const copy = tile.cloneNode(true) as HTMLElement;
          Object.assign(copy.style, {
            position: "absolute",
            left: `${(r.left - box.left) / k}px`,
            top: `${(r.top - box.top) / k}px`,
            width: `${r.width / k}px`,
            height: `${r.height / k}px`,
            margin: "0",
            zIndex: "30",
            pointerEvents: "none",
            willChange: "transform",
          });
          section.appendChild(copy);
          flights.push(copy);
          const turn = (i - (shown.length - 1) / 2) * 10;
          const dx = (fan.x - (r.left + r.width / 2)) / k + turn * 0.6;
          const dy = (fan.y - (r.top + r.height / 2)) / k;
          const grow = 40 / (r.width / k);
          copy.animate(
            [
              { transform: "translate(0px, 0px) rotate(0deg) scale(1)" },
              {
                transform: `translate(${dx * 0.42}px, ${dy * 0.58 - 28}px) rotate(${turn * 0.5 - 6}deg) scale(${(1 + grow) / 2})`,
                offset: 0.55,
              },
              {
                transform: `translate(${dx}px, ${dy}px) rotate(${turn}deg) scale(${grow})`,
              },
            ],
            {
              duration: 640,
              delay: i * 90,
              easing: "cubic-bezier(0.45,0,0.2,1)",
              fill: "forwards",
            },
          );
        });
      }
      const landed =
        reduced || !flights.length ? 300 : 560 + (flights.length - 1) * 90;
      window.setTimeout(() => {
        setLink({ url, files: doneItems, flown: flights.length > 0 });
        setFlying(false);
        // The real stack is under the flown tiles now; they hand over and go.
        flights.forEach(
          (f) =>
            (f.animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: 220,
              delay: 260,
              fill: "forwards",
            }).onfinish = () => f.remove()),
        );
      }, landed);
    } catch (e) {
      setCreate({
        status: "error",
        error:
          e instanceof Error && e.message
            ? e.message
            : "Couldn’t make the link. Try again.",
      });
    }
  };

  const reset = () => {
    setItems([]);
    setLink(null);
    setCreate({ status: "idle" });
    setPassword("");
    setLock(false);
  };

  const shared = link?.files ?? [];
  const sharedSize = shared.reduce((n, i) => n + i.file.size, 0);

  return (
    <section
      ref={sectionRef}
      aria-labelledby={`${baseId}-title`}
      className={`relative w-full max-w-[420px] rounded-[28px] p-2 text-card-foreground ${className}`}
      style={CARD}
      onDragEnter={(e) => {
        if (link || !e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
        depth.current++;
        setOver(e.dataTransfer.items.length || 1);
      }}
      onDragOver={(e) => {
        if (link || !e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }}
      onDragLeave={() => {
        depth.current = Math.max(0, depth.current - 1);
        if (!depth.current) setOver(0);
      }}
      onDrop={(e) => {
        if (link) return;
        e.preventDefault();
        depth.current = 0;
        setOver(0);
        add(e.dataTransfer.files);
      }}
    >
      {/* Its natural width where the parent sizes to its content, without forcing it on narrow screens. */}
      <div
        aria-hidden="true"
        data-natural-width
        className="grid h-0"
        style={{ gridTemplateColumns: "minmax(0, 420px)" }}
      />
      <div className="@container w-full">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            if (e.target.files?.length) add(e.target.files);
            e.target.value = "";
          }}
        />

        {/* The one lit surface: the drop area, which becomes the link. */}
        <div
          ref={panelRef}
          className="rounded-[22px] p-2 text-primary-foreground"
          style={LIT}
        >
          <Faces active={link ? 1 : 0} reduced={reduced} ready={ready}>
            <div
              className="flex min-h-[132px] flex-col items-center justify-center rounded-[16px] px-4 py-5 text-center"
              style={{
                boxShadow: `inset 0 0 0 1px ${over ? "var(--primary-foreground)" : mix("var(--primary-foreground)", 30)}`,
                background: over
                  ? mix("var(--primary-foreground)", 10)
                  : "transparent",
                transform: over && !reduced ? "scale(0.985)" : "none",
                transition: reduced
                  ? "none"
                  : `box-shadow 200ms, background-color 200ms, transform 320ms ${EASE}`,
              }}
            >
              <span
                className="flex size-10 items-center justify-center rounded-full"
                style={{ background: mix("var(--primary-foreground)", 14) }}
              >
                <Upload
                  aria-hidden="true"
                  className="size-[18px]"
                  style={{
                    transform: over && !reduced ? "translateY(-2px)" : "none",
                    transition: `transform 300ms ${EASE}`,
                  }}
                />
              </span>
              <h2
                id={`${baseId}-title`}
                className="mt-2.5 text-[15px] font-medium tracking-[-0.01em]"
              >
                <TextMorph>
                  {over
                    ? `Release to add ${over === 1 ? "it" : over}`
                    : items.length
                      ? "Add more files"
                      : "Drop files to share"}
                </TextMorph>
              </h2>
              <p className="mt-1 text-[12.5px] text-primary-foreground/70">
                or{" "}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className={`cursor-pointer rounded-full font-medium text-primary-foreground underline decoration-primary-foreground/40 underline-offset-[3px] hover:decoration-primary-foreground ${INTERACTION_FOCUS}`}
                >
                  choose files
                </button>
                {maxSize ? ` · up to ${size(maxSize)} each` : ""}
              </p>
            </div>

            <div className="p-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12.5px] text-primary-foreground/70">
                    Ready to share
                  </p>
                  <p className="mt-0.5 text-[17px] font-medium leading-tight tracking-[-0.02em]">
                    {shared.length} {shared.length === 1 ? "file" : "files"} ·{" "}
                    {size(sharedSize)}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[12.5px] text-primary-foreground/75">
                    {lock && <Lock aria-hidden="true" className="size-3" />}
                    Expires in {expires} {expires === 1 ? "day" : "days"}
                    {lock ? " · password" : ""}
                  </p>
                </div>
                {/* The files, fanned as the stack they folded into. */}
                <span
                  aria-hidden="true"
                  className="relative mr-2 mt-1 h-12 w-14 shrink-0"
                >
                  {shared.slice(0, 3).map((it, i, all) => {
                    const turn = (i - (all.length - 1) / 2) * 10;
                    return (
                      // The fan is on the outer layer, the pop on the inner one, so the keyframe never undoes the turn.
                      <span
                        key={it.id}
                        className="absolute left-2 top-0"
                        style={{
                          transform: `rotate(${turn}deg) translateX(${turn * 0.6}px)`,
                        }}
                      >
                        <span
                          className={`flex h-12 w-10 items-end justify-center rounded-[8px] pb-1 font-mono text-[8.5px] font-medium ${link?.flown ? "" : "motion-safe:animate-[ui-pop-in_420ms_cubic-bezier(0.34,1.36,0.64,1)_both]"}`}
                          style={{
                            ...tint(extOf(it.file.name)),
                            animationDelay: `${i * 70}ms`,
                            boxShadow: `0 0 0 1px ${mix("var(--primary)", 60)}`,
                          }}
                        >
                          {extOf(it.file.name)}
                        </span>
                      </span>
                    );
                  })}
                </span>
              </div>
              <div
                className="mt-3 flex h-10 items-center gap-2 rounded-full pl-4 pr-1"
                style={{
                  background: mix("black", 14),
                  boxShadow: `inset 0 1px 0 ${mix("black", 12)}, inset 0 0 0 1px ${mix("var(--primary-foreground)", 10)}`,
                }}
              >
                <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-primary-foreground/90">
                  {link?.url.replace(/^https?:\/\//, "")}
                </span>
                {link && (
                  <CopyButton
                    text={link.url}
                    label="Copy link"
                    copiedLabel="Copied"
                    showLabel
                    size="sm"
                    variant="secondary"
                    style={{
                      background: "var(--primary-foreground)",
                      color: "var(--primary)",
                    }}
                    className="shrink-0 hover:opacity-90"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={reset}
                className={`mt-2 h-8 cursor-pointer rounded-full px-1 text-[12.5px] text-primary-foreground/80 hover:text-primary-foreground ${INTERACTION_FOCUS}`}
              >
                Share more files
              </button>
            </div>
          </Faces>
        </div>

        {/* Flat: the files on their way up, and how the link should work. */}
        <div
          className="grid grid-cols-1"
          style={{
            gridTemplateRows: link || !items.length ? "0fr" : "1fr",
            opacity: link || !items.length ? 0 : 1,
            transition: reduced
              ? "opacity 160ms"
              : `grid-template-rows 460ms ${EASE}, opacity 300ms ${EASE}`,
          }}
        >
          <div
            className={`min-h-0 ${flying ? "overflow-visible" : "overflow-clip"}`}
            inert={Boolean(link) || !items.length || undefined}
          >
            <div className="px-2 pt-2.5">
              <div className="flex items-baseline justify-between px-1 text-[12px] text-muted-foreground">
                <span>
                  <NumberRoll value={items.length} duration={500} />{" "}
                  {items.length === 1 ? "file" : "files"} · {size(total)}
                </span>
                <span className="tabular-nums">
                  {uploading ? (
                    <>
                      <NumberRoll
                        value={total ? Math.floor((sent / total) * 100) : 0}
                        duration={400}
                      />
                      % sent
                    </>
                  ) : doneItems.length ? (
                    "All sent"
                  ) : (
                    ""
                  )}
                </span>
              </div>
              <ul ref={listRef} className="mt-1.5">
                {items.map((it) => (
                  <li
                    key={it.id}
                    data-file
                    className="relative flex h-12 items-center gap-2.5 border-t border-border/70 px-1 first:border-t-0"
                  >
                    <span
                      aria-hidden="true"
                      data-tile
                      className="flex h-8 w-7 shrink-0 items-end justify-center rounded-[6px] pb-0.5 font-mono text-[8px] font-medium"
                      style={tint(extOf(it.file.name))}
                    >
                      {extOf(it.file.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] text-foreground">
                        {it.file.name}
                      </span>
                      <span
                        className={`block text-[11.5px] tabular-nums ${it.status === "error" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
                      >
                        {size(it.file.size)} ·{" "}
                        {it.status === "error" ? (
                          it.error
                        ) : it.status === "done" ? (
                          <TextMorph>Uploaded</TextMorph>
                        ) : (
                          <>
                            <NumberRoll
                              value={Math.floor(it.progress * 100)}
                              duration={300}
                            />
                            %
                          </>
                        )}
                      </span>
                    </span>
                    {it.status === "error" &&
                      !(maxSize && it.file.size > maxSize) && (
                        <button
                          type="button"
                          aria-label={`Retry ${it.file.name}`}
                          onClick={() => upload(it)}
                          className={`flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground ${INTERACTION_PRESS} ${INTERACTION_FOCUS}`}
                        >
                          <RotateCw aria-hidden="true" className="size-3.5" />
                        </button>
                      )}
                    <button
                      type="button"
                      aria-label={`Remove ${it.file.name}`}
                      disabled={busy}
                      onClick={() => remove(it)}
                      className={`-mr-1 flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40 ${INTERACTION_PRESS} ${INTERACTION_FOCUS}`}
                    >
                      <X aria-hidden="true" className="size-3.5" />
                    </button>
                    {/* The thin line that fills as the file goes up. */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-1 bottom-0 h-px origin-left ${it.status === "error" ? "bg-red-500" : "bg-primary"}`}
                      style={{
                        opacity: it.status === "done" ? 0 : 0.8,
                        transform: `scaleX(${it.status === "error" ? 1 : it.progress})`,
                        transition: reduced
                          ? "opacity 200ms"
                          : `transform 300ms ${EASE}, opacity 400ms ${EASE} 200ms`,
                      }}
                    />
                  </li>
                ))}
              </ul>

              <div className="mt-2.5 flex flex-col gap-2.5 border-t border-border pt-3 @[360px]:flex-row @[360px]:items-center @[360px]:justify-between">
                <SegmentedControl
                  label="Link expires after"
                  size="sm"
                  value={String(expires)}
                  onValueChange={(v) => setExpires(Number(v))}
                  options={expiries.map((d) => ({
                    value: String(d),
                    label: d === 1 ? "1 day" : `${d} days`,
                  }))}
                />
                <Switch
                  size="sm"
                  label="Password"
                  checked={lock}
                  onCheckedChange={(v) => setLock(v)}
                />
              </div>
              <div
                className="grid grid-cols-1"
                style={{
                  gridTemplateRows: lock ? "1fr" : "0fr",
                  transition: reduced
                    ? "none"
                    : `grid-template-rows 360ms ${EASE}`,
                }}
              >
                <div
                  className="min-h-0 overflow-clip"
                  inert={!lock || undefined}
                >
                  <Input
                    type="password"
                    aria-label="Password for the link"
                    placeholder="Password for the link"
                    autoComplete="new-password"
                    value={password}
                    onValueChange={setPassword}
                    className="pt-2.5"
                  />
                </div>
              </div>
              <StatusButton
                status={create.status}
                labels={{
                  idle: uploading ? "Uploading…" : "Create link",
                  pending: "Creating link",
                  success: "Link ready",
                  error: "Try again",
                }}
                disabled={!canCreate && create.status === "idle"}
                onClick={() => void createLink()}
                className="mt-3 h-11 w-full text-[14.5px] disabled:opacity-50"
                style={create.status === "error" ? undefined : ACTION}
              />
              <p
                role={create.error ? "alert" : undefined}
                className={`mt-1.5 pb-1 text-center text-[12px] ${create.error ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
              >
                {create.error ??
                  (lock && !password.trim()
                    ? "Add a password, or switch it off."
                    : "Anyone with the link can download.")}
              </p>
            </div>
          </div>
        </div>

        <span className="sr-only" role="status">
          {said}
        </span>
      </div>
    </section>
  );
}

export default FileShare;
