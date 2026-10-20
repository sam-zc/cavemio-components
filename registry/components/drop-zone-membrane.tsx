"use client";

/* ─────────────────────────────────────────────────────────
 * DROP ZONE: the border reaches for the file
 *
 *   armed     drag files anywhere over the page and the line
 *             breathes out a pixel and takes the accent
 *   reach     bring them near and the nearest stretch of line
 *             bends out to meet them; the arrow turns to watch.
 *             Close to the edge the bulge reaches past the
 *             file, so it is held before it crosses
 *   over      inside, the line lets go with a wobble, the zone
 *             swells, and the label says what you're holding
 *   drop      the border gulps and rings out from the drop
 *             point; files appear directly as attachment cards
 *   upload    Attachment shows ready, uploading,
 *             processing, failed and complete states
 *   refuse    a type the zone can't take makes the line recoil
 *             and turns it red; a refused drop is pushed back
 *             out where it landed, and the label says why
 *
 * The zone is a real button: Enter or Space browses, paste
 * works while it has focus, and every result is announced.
 * Your own drags (a file from a sidebar, say) drive it too,
 * through the handle: drag, cancel, drop.
 * ───────────────────────────────────────────────────────── */

import * as React from "react";
import { ArrowUp, X } from "lucide-react";
import {
  MembraneAttachment,
  formatBytes,
  type MembraneAttachmentStatus,
} from "./membrane-attachment";
export { MembraneAttachment, formatBytes } from "./membrane-attachment";
import { TextMorph } from "./text-morph";
import {
  EASE_OUT,
  INTERACTION_FOCUS,
  interactionIcon,
  useInteractionReducedMotion,
} from "./ui-interaction-motion";
import { useMembrane } from "./use-membrane";

export type DropZoneMembraneStatus = MembraneAttachmentStatus;

export interface DropZoneMembraneFile {
  id: string;
  file: File;
  status: DropZoneMembraneStatus;
  /** 0 to 1. */
  progress: number;
  error?: string;
}

export type DropZoneMembraneUpload = (
  file: File,
  context: {
    progress: (fraction: number) => void;
    processing: () => void;
    signal: AbortSignal;
  },
) => void | Promise<void>;

export interface DropZoneMembraneHandle {
  /** Something your app is dragging (not a file from the system) is at these client coordinates. Returns whether a drop there would land. */
  drag: (clientX: number, clientY: number, types?: string[]) => boolean;
  /** Your drag ended without a drop. */
  cancel: () => void;
  /** Drop files as if from the system, at client coordinates or the zone's centre. */
  drop: (files: File[], at?: { x: number; y: number }) => void;
  /** Open the file picker. */
  browse: () => void;
}

export interface DropZoneMembraneProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onDrop" | "title"
> {
  /** Uploads one file: report progress, honour the signal, resolve when done or throw to show an error with Retry. */
  onUpload?: DropZoneMembraneUpload;
  /** Start uploads on selection. False exposes an Upload action on each ready file. */
  autoUpload?: boolean;
  /** The files currently in the list, after every add and remove. */
  onFilesChange?: (files: File[]) => void;
  /** Like an input's accept: MIME types, wildcards and extensions, e.g. "image/*,.pdf". */
  accept?: string;
  /** Largest file in bytes. */
  maxSize?: number;
  maxFiles?: number;
  /** One file at a time: a new drop replaces it. */
  multiple?: boolean;
  /** The resting label. */
  title?: string;
  /** File requirements in the tray footer, e.g. "PNG, JPG or PDF, up to 10 MB". */
  hint?: string;
  disabled?: boolean;
  ref?: React.Ref<DropZoneMembraneHandle>;
}

type Row = DropZoneMembraneFile & { closing: boolean };
type Drag = { count: number; ok: boolean; held: boolean };

const RADIUS = 14;
const HOLD = 16; // a file this close outside the zone is already held by the bulge, and drops into it

const matchRule = (rule: string, type: string, name: string) =>
  rule.startsWith(".")
    ? name.endsWith(rule)
    : rule.endsWith("/*")
      ? type.startsWith(rule.slice(0, -1))
      : type === rule;
const rulesOf = (accept?: string) =>
  (accept ?? "")
    .split(",")
    .map((r) => r.trim().toLowerCase())
    .filter(Boolean);
const EXTENSIONS: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".csv": "text/csv",
  ".md": "text/markdown",
  ".json": "application/json",
  ".zip": "application/zip",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};
/** During a drag only the type is known, and sometimes not even that: refuse only what surely can't match. */
const mightAccept = (rules: string[], type: string) => {
  if (!rules.length || !type) return true;
  const t = type.toLowerCase();
  return rules.some((r) =>
    r.startsWith(".")
      ? !EXTENSIONS[r] || EXTENSIONS[r] === t
      : matchRule(r, t, ""),
  );
};
const accepts = (rules: string[], file: File) =>
  !rules.length ||
  rules.some((r) =>
    matchRule(
      r,
      file.type.toLowerCase() ||
        EXTENSIONS[file.name.toLowerCase().slice(file.name.lastIndexOf("."))] ||
        "",
      file.name.toLowerCase(),
    ),
  );

const onlyLabel = (hint?: string) =>
  hint
    ? `Only ${/^.[a-z]/.test(hint) ? hint[0].toLowerCase() + hint.slice(1) : hint}`
    : undefined;
let counter = 0;

export function DropZoneMembrane({
  onUpload,
  autoUpload = true,
  onFilesChange,
  accept = "image/*,.pdf",
  maxSize = 10_000_000,
  maxFiles = 2,
  multiple = true,
  title = "Drop files here",
  hint = "images or PDFs, up to 10 MB",
  disabled = false,
  ref,
  className = "",
  ...props
}: DropZoneMembraneProps) {
  const reduced = useInteractionReducedMotion();
  const hintId = React.useId();
  const membrane = useMembrane({ radius: RADIUS, reduced });
  const rules = React.useMemo(() => rulesOf(accept), [accept]);
  const root = React.useRef<HTMLDivElement>(null);
  const zone = React.useRef<HTMLButtonElement | null>(null);
  const input = React.useRef<HTMLInputElement>(null);
  const [drag, setDrag] = React.useState<Drag | null>(null);
  const [notice, setNotice] = React.useState<{
    text: string;
    error: boolean;
  } | null>(null);
  const [rows, setRows] = React.useState<Row[]>([]);
  const [said, setSaid] = React.useState("");
  const rowsRef = React.useRef(rows);
  const updateRows = React.useCallback((update: (rows: Row[]) => Row[]) => {
    const next = update(rowsRef.current);
    rowsRef.current = next;
    setRows(next);
  }, []);
  const controllers = React.useRef(new Map<string, AbortController>());
  const timers = React.useRef(new Set<ReturnType<typeof setTimeout>>());
  const noticeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const upload = React.useRef(onUpload);
  upload.current = onUpload;

  const later = React.useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(() => {
      timers.current.delete(t);
      fn();
    }, ms);
    timers.current.add(t);
  }, []);
  React.useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
      controllers.current.forEach((c) => c.abort());
    },
    [],
  );

  const tell = React.useCallback((text: string, error: boolean) => {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    setNotice({ text, error });
    noticeTimer.current = setTimeout(
      () => setNotice(null),
      error ? 2800 : 1800,
    );
  }, []);

  const local = (clientX: number, clientY: number) => {
    const r = zone.current?.getBoundingClientRect();
    return r
      ? { x: clientX - r.left, y: clientY - r.top, w: r.width, h: r.height }
      : { x: 0, y: 0, w: 0, h: 0 };
  };

  // Follow a drag: bend the line, decide whether the file is held, and update the label only when that changes.
  const track = React.useCallback(
    (clientX: number, clientY: number, types: string[]) => {
      if (disabled) return false;
      const p = local(clientX, clientY);
      const outside = Math.hypot(
        Math.max(-p.x, 0, p.x - p.w),
        Math.max(-p.y, 0, p.y - p.h),
      );
      const ok = !types.length || types.some((t) => mightAccept(rules, t));
      const isHeld = outside < HOLD;
      membrane.set("pointer", {
        x: p.x,
        y: p.y,
        kind: ok ? "reach" : "recoil",
      });
      membrane.swell(isHeld ? (ok ? 3 : -2) : 1.5);
      setDrag((d) =>
        d && d.count === types.length && d.ok === ok && d.held === isHeld
          ? d
          : { count: types.length, ok, held: isHeld },
      );
      return isHeld;
    },
    [disabled, rules, membrane],
  );

  const release = React.useCallback(() => {
    membrane.set("pointer", null);
    membrane.swell(0);
    setDrag(null);
  }, [membrane]);

  const start = React.useCallback(
    (id: string, file: File) => {
      if (!rowsRef.current.some((r) => r.id === id && !r.closing)) return;
      controllers.current.get(id)?.abort();
      const run = upload.current;
      const patch = (next: Partial<Row>) =>
        updateRows((list) =>
          list.map((r) => (r.id === id ? { ...r, ...next } : r)),
        );
      if (!run) return patch({ status: "idle", progress: 0 });
      const controller = new AbortController();
      controllers.current.set(id, controller);
      const active = () =>
        !controller.signal.aborted &&
        controllers.current.get(id) === controller;
      patch({ status: "uploading", progress: 0, error: undefined });
      let last = 0;
      const progress = (f: number) => {
        const v = Math.max(last, Math.min(1, Number.isFinite(f) ? f : 0));
        if (!active() || Math.abs(v - last) < 0.005) return;
        last = v;
        patch({ progress: v });
      };
      Promise.resolve()
        .then(() => {
          if (controller.signal.aborted) return;
          return run(file, {
            progress,
            processing: () => {
              if (active()) patch({ status: "processing", progress: 1 });
            },
            signal: controller.signal,
          });
        })
        .then(
          () => {
            if (controller.signal.aborted) return;
            patch({ status: "done", progress: 1 });
            setSaid(`${file.name} uploaded`);
          },
          (error: unknown) => {
            if (controller.signal.aborted) return;
            const message =
              error instanceof Error && error.message
                ? error.message
                : "Upload failed";
            patch({ status: "error", error: message });
            setSaid(`${file.name} failed to upload. ${message}`);
          },
        )
        .finally(() => {
          if (controllers.current.get(id) === controller)
            controllers.current.delete(id);
        });
    },
    [updateRows],
  );

  const remove = React.useCallback(
    (id: string) => {
      const item = rowsRef.current.find((r) => r.id === id);
      const focused = root.current
        ?.querySelector('[data-file="' + id + '"]')
        ?.contains(document.activeElement);
      if (focused) zone.current?.focus({ preventScroll: true });
      controllers.current.get(id)?.abort();
      controllers.current.delete(id);
      if (item) setSaid(item.file.name + " removed");
      updateRows((list) =>
        list.map((r) => (r.id === id ? { ...r, closing: true } : r)),
      );
      later(
        () => updateRows((list) => list.filter((r) => r.id !== id)),
        reduced ? 0 : 420,
      );
    },
    [later, reduced, updateRows],
  );

  // React to the drop point, then insert the actual attachment cards.
  const take = React.useCallback(
    (files: File[], at: { x: number; y: number }) => {
      if (disabled || !files.length) return;
      const current = rowsRef.current.filter((r) => !r.closing);
      const room = multiple ? (maxFiles ?? Infinity) - current.length : 1;
      const accepted: File[] = [];
      const refused: string[] = [];
      for (const file of multiple ? files : files.slice(0, 1)) {
        if (!accepts(rules, file)) refused.push(`${file.name} isn't accepted`);
        else if (maxSize !== undefined && file.size > maxSize)
          refused.push(`${file.name} is over ${formatBytes(maxSize)}`);
        else if (accepted.length >= room)
          refused.push(`Up to ${maxFiles} files`);
        else if (
          [...current.map((r) => r.file), ...accepted].some(
            (f) =>
              f.name === file.name &&
              f.size === file.size &&
              f.lastModified === file.lastModified &&
              f.type === file.type,
          )
        )
          refused.push(file.name + " is already added");
        else accepted.push(file);
      }
      if (!multiple && files.length > 1) refused.push("One file at a time");
      if (!accepted.length) {
        membrane.spit(at.x, at.y);
        tell(refused[0] ?? "Nothing to add", true);
        setSaid(refused.join(". "));
        return;
      }
      membrane.gulp(at.x, at.y);
      if (!multiple) current.forEach((r) => remove(r.id));
      const added: Row[] = accepted.map((file) => ({
        id: `f${++counter}`,
        file,
        status: "idle",
        progress: 0,
        closing: false,
      }));
      updateRows((list) => [...list, ...added]);
      if (autoUpload && upload.current)
        added.forEach((r) => start(r.id, r.file));
      const summary =
        accepted.length === 1
          ? `Added ${accepted[0].name}`
          : `Added ${accepted.length} files`;
      tell(
        refused.length
          ? refused.length === 1
            ? refused[0]
            : `${refused.length} files skipped`
          : accepted.length === 1
            ? "File added"
            : summary,
        refused.length > 0,
      );
      setSaid([summary, ...refused].join(". "));
    },
    [
      disabled,
      multiple,
      maxFiles,
      maxSize,
      rules,
      membrane,
      tell,
      remove,
      start,
      autoUpload,
      updateRows,
    ],
  );

  const centre = () => {
    const el = zone.current;
    return { x: (el?.offsetWidth ?? 0) / 2, y: (el?.offsetHeight ?? 0) / 2 };
  };

  // Files dragged in from the system: watch the whole window so the line can reach out before the file arrives.
  React.useEffect(() => {
    if (disabled) {
      release();
      return;
    }
    let quiet: ReturnType<typeof setTimeout> | null = null;
    const end = () => {
      if (quiet) clearTimeout(quiet);
      release();
    };
    const over = (e: DragEvent) => {
      const data = e.dataTransfer;
      if (!data || !Array.from(data.types).includes("Files")) return;
      // dragover repeats while a drag is over the page; silence means it left.
      if (quiet) clearTimeout(quiet);
      quiet = setTimeout(end, 400);
      const types = Array.from(data.items)
        .filter((i) => i.kind === "file")
        .map((i) => i.type);
      if (track(e.clientX, e.clientY, types)) {
        e.preventDefault();
        data.dropEffect = "copy";
      }
    };
    const leave = (e: DragEvent) => {
      if (
        !e.relatedTarget &&
        (e.clientX <= 0 ||
          e.clientY <= 0 ||
          e.clientX >= window.innerWidth ||
          e.clientY >= window.innerHeight)
      )
        end();
    };
    const drop = (e: DragEvent) => {
      const files = Array.from(e.dataTransfer?.files ?? []);
      const p = local(e.clientX, e.clientY);
      const isHeld =
        p.w > 0 &&
        Math.hypot(Math.max(-p.x, 0, p.x - p.w), Math.max(-p.y, 0, p.y - p.h)) <
          HOLD;
      if (isHeld && files.length) {
        e.preventDefault();
        take(files, {
          x: Math.max(0, Math.min(p.w, p.x)),
          y: Math.max(0, Math.min(p.h, p.y)),
        });
      }
      end();
    };
    window.addEventListener("dragenter", over);
    window.addEventListener("dragover", over);
    window.addEventListener("dragleave", leave);
    window.addEventListener("drop", drop);
    window.addEventListener("dragend", end);
    window.addEventListener("blur", end);
    return () => {
      if (quiet) clearTimeout(quiet);
      window.removeEventListener("dragenter", over);
      window.removeEventListener("dragover", over);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("drop", drop);
      window.removeEventListener("dragend", end);
      window.removeEventListener("blur", end);
    };
  }, [disabled, track, release, take]);

  React.useImperativeHandle(
    ref,
    () => ({
      drag: (x, y, types = []) => track(x, y, types),
      cancel: release,
      drop: (files, at) => {
        const p = at ? local(at.x, at.y) : { ...centre(), w: 0, h: 0 };
        release();
        take(files, { x: p.x, y: p.y });
      },
      browse: () => {
        if (!disabled) input.current?.click();
      },
    }),
    [track, release, take, disabled],
  );

  const live = rows.filter((r) => !r.closing);
  const liveKey = live.map((r) => r.id).join();
  const report = React.useRef(onFilesChange);
  report.current = onFilesChange;
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    report.current?.(
      rowsRef.current.filter((r) => !r.closing).map((r) => r.file),
    );
  }, [liveKey]);

  const refusing = drag ? !drag.ok : (notice?.error ?? false);
  const label = drag
    ? !drag.ok
      ? (onlyLabel(hint) ?? "This type can't be added")
      : drag.held
        ? drag.count > 1
          ? `Release to add ${drag.count}`
          : "Release to add"
        : drag.count > 1
          ? `Drop ${drag.count} files here`
          : "Drop it here"
    : (notice?.text ?? title);
  const icon: "arrow" | "refuse" | "added" = refusing
    ? "refuse"
    : notice && !notice.error
      ? "added"
      : "arrow";
  const tone = refusing
    ? "refuse"
    : drag?.held
      ? "over"
      : drag
        ? "armed"
        : "rest";
  const colors = {
    rest: {
      stroke: "var(--border)",
      fill: "color-mix(in oklab, var(--muted) 45%, transparent)",
    },
    armed: {
      stroke: "color-mix(in oklab, var(--primary) 55%, var(--border))",
      fill: "color-mix(in oklab, var(--primary) 3%, var(--background))",
    },
    over: {
      stroke: "var(--primary)",
      fill: "color-mix(in oklab, var(--primary) 7%, var(--background))",
    },
    refuse: {
      stroke: "var(--destructive, #dc2626)",
      fill: "color-mix(in oklab, var(--destructive, #dc2626) 5%, var(--background))",
    },
  }[tone];

  return (
    <div
      ref={root}
      className={`@container relative w-full text-foreground ${className}`}
      {...props}
    >
      <button
        ref={(el) => {
          zone.current = el;
          membrane.attach(el);
        }}
        type="button"
        disabled={disabled}
        aria-label="Browse files"
        data-slot="membrane-zone"
        aria-describedby={hint ? hintId : undefined}
        onClick={() => input.current?.click()}
        onPaste={(e) => {
          const files = Array.from(e.clipboardData.files);
          if (!files.length) return;
          e.preventDefault();
          take(files, centre());
        }}
        className={`group/zone relative grid w-full cursor-pointer grid-cols-[40px_minmax(0,1fr)] items-center gap-x-3 gap-y-3 rounded-[14px] p-4 text-left disabled:cursor-default disabled:opacity-55 @sm:grid-cols-[40px_minmax(0,1fr)_auto] ${INTERACTION_FOCUS}`}
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
        >
          <path
            ref={membrane.path}
            strokeWidth={1}
            style={{
              ...colors,
              transition: reduced
                ? "none"
                : `stroke 280ms ${EASE_OUT}, fill 360ms ${EASE_OUT}`,
            }}
          />
        </svg>
        <span
          aria-hidden="true"
          className="relative flex size-10 items-center justify-center rounded-xl border bg-background transition-colors duration-300"
          style={{
            borderColor: tone === "rest" ? "var(--border)" : colors.stroke,
            color:
              tone === "refuse"
                ? colors.stroke
                : tone === "rest"
                  ? "var(--muted-foreground)"
                  : "var(--accent-ink, var(--foreground))",
          }}
        >
          <span
            ref={membrane.arrow}
            className="absolute inset-0 flex items-center justify-center will-change-transform"
            style={interactionIcon(icon === "arrow", reduced)}
          >
            <ArrowUp className="size-4" strokeWidth={1.75} />
          </span>
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={interactionIcon(icon === "refuse", reduced)}
          >
            <X className="size-4" strokeWidth={1.75} />
          </span>
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={interactionIcon(icon === "added", reduced)}
          >
            <DrawnCheck on={icon === "added"} reduced={reduced} />
          </span>
        </span>
        <span className="relative flex min-w-0 flex-col items-start gap-1">
          <span
            title={label}
            className={`max-w-full overflow-hidden text-[13.5px] font-medium tracking-[-0.01em] transition-colors duration-300 ${refusing ? "text-destructive" : ""}`}
          >
            <TextMorph className="max-w-full overflow-hidden align-bottom">
              {label}
            </TextMorph>
          </span>
          <span className="text-[12px] leading-relaxed text-muted-foreground">
            Drag & drop, or paste a file
          </span>
        </span>
        {/* One native button owns the whole tray, including this visual action. */}
        <span
          aria-hidden="true"
          data-slot="membrane-browse"
          className="relative col-start-2 inline-flex min-h-11 w-fit items-center justify-center rounded-xl border border-border bg-background px-3.5 text-[12px] font-medium text-foreground transition-colors duration-200 group-hover/zone:bg-accent group-focus-visible/zone:bg-accent @sm:col-start-auto"
        >
          Add files
        </span>
        <span
          id={hintId}
          data-slot="membrane-requirements"
          className="relative col-span-full flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 border-t border-border/70 pt-3 text-[11px] leading-relaxed text-muted-foreground"
        >
          {hint && (
            <span className="min-w-0 [overflow-wrap:anywhere]">{hint}</span>
          )}
          {hint && <span aria-hidden="true">·</span>}
          <span>
            {multiple ? `Up to ${maxFiles} files` : "One file at a time"}
          </span>
        </span>
      </button>
      <input
        ref={input}
        type="file"
        disabled={disabled}
        hidden
        multiple={multiple}
        accept={accept}
        onChange={(e) => {
          const files = Array.from(e.currentTarget.files ?? []);
          e.currentTarget.value = "";
          take(files, centre());
        }}
      />

      {rows.length > 0 && (
        <ul aria-label="Files" className="mt-3 list-none p-0">
          {rows.map((r) => (
            <FileRow
              key={r.id}
              row={r}
              reduced={reduced}
              disabled={disabled}
              canUpload={!!onUpload}
              onRemove={() => remove(r.id)}
              onRetry={() => start(r.id, r.file)}
            />
          ))}
        </ul>
      )}

      <p role="status" className="sr-only">
        {said}
      </p>
    </div>
  );
}

function FileRow({
  row,
  reduced,
  disabled,
  canUpload,
  onRemove,
  onRetry,
}: {
  row: Row;
  reduced: boolean;
  disabled: boolean;
  canUpload: boolean;
  onRemove: () => void;
  onRetry: () => void;
}) {
  const [open, setOpen] = React.useState(reduced);
  React.useEffect(() => {
    if (open) return;
    let b = 0;
    const a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => setOpen(true));
    });
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, [open]);
  const shown = open && !row.closing;
  return (
    <li
      data-file={row.id}
      className="grid"
      inert={row.closing}
      aria-hidden={row.closing || undefined}
      style={{
        gridTemplateRows: shown ? "1fr" : "0fr",
        opacity: shown ? 1 : 0,
        transition: reduced
          ? "none"
          : "grid-template-rows 420ms " +
            EASE_OUT +
            ", opacity 200ms " +
            EASE_OUT,
      }}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="pb-2">
          <MembraneAttachment
            file={row.file}
            status={row.status}
            progress={row.progress}
            error={row.error}
            disabled={disabled}
            onRemove={onRemove}
            onRetry={canUpload ? onRetry : undefined}
            onUpload={canUpload ? onRetry : undefined}
          />
        </div>
      </div>
    </li>
  );
}

function DrawnCheck({ on, reduced }: { on: boolean; reduced: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M3.5 8.5l3 3 6-7"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={on ? 0 : 1}
        style={{
          transition: reduced
            ? "none"
            : `stroke-dashoffset ${on ? 420 : 0}ms ${EASE_OUT} ${on ? 120 : 0}ms`,
        }}
      />
    </svg>
  );
}
