"use client";

import * as React from "react";
import { Camera, Minus, Plus, RotateCw } from "lucide-react";
import { NumberRoll } from "./number-roll";
import { StatusButton, type ActionStatus } from "./status-button";
import {
  useCropGesture,
  type CropArea,
  type CropState,
} from "./use-crop-gesture";

/* ─────────────────────────────────────────────────────────
 * AVATAR CROPPER: the profile photo field, without a modal
 *
 *   open      choose, drop or paste a photo and the avatar
 *             itself grows into the crop stage: its circle is
 *             the crop, the rest of the photo fades in, dimmed,
 *             around it
 *   hold      drag, pinch, scroll; past an edge the photo
 *             resists and springs back, so the crop never shows
 *             a gap; it keeps the speed you let go with
 *   rotate    a quarter turn, thrown with a slight overshoot
 *   save      Save → Saving → Saved, then the stage shrinks
 *             back into the circle with the face you framed:
 *             the same layer, never a swap
 *   cancel    shrinks back and hands over to the old photo
 *   remove    the photo dissolves into initials
 * ───────────────────────────────────────────────────────── */

export type { CropArea } from "./use-crop-gesture";

export interface AvatarCropperHandle {
  /** Opens a photo in the stage: a file, a blob or a URL. */
  open: (photo: File | Blob | string) => void;
  /** Opens the file picker. */
  browse: () => void;
}

export interface AvatarCropperProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title" | "defaultValue" | "onChange"
> {
  /** The photo shown now (a URL), or null for initials. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (url: string | null) => void;
  /** Whose photo: used for the initials and the accessible names. */
  name: string;
  /** Receives the cropped square. Resolve with the stored photo's URL (or nothing to show the crop itself); throw to show the error. */
  onSave: (
    photo: Blob,
    area: CropArea,
  ) => Promise<string | void> | string | void;
  /** Shows Remove while there's a photo. */
  onRemove?: () => Promise<void> | void;
  /** "square" for a workspace or team logo (rounded square). */
  shape?: "circle" | "square";
  /** The avatar's size, px. */
  size?: number;
  /** Side of the saved square, px. */
  outputSize?: number;
  outputType?: string;
  outputQuality?: number;
  accept?: string;
  /** Largest file taken, bytes. */
  maxSize?: number;
  maxZoom?: number;
  title?: string;
  hint?: string;
  ref?: React.Ref<AvatarCropperHandle>;
}

type Phase = "idle" | "opening" | "open" | "closing";
type Photo = { src: string; w: number; h: number; owned: boolean };
type Note = { text: string; tone: "muted" | "error"; key: number };

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const THROW = "cubic-bezier(0.34,1.36,0.64,1)";
const MORPH = 560;
const MARGIN = 22;
const RADIUS = 22;
const STAGE_MAX = 320;
const SQUARE = 0.22;
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const useReducedMotion = () =>
  React.useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(reducedQuery).matches,
    () => false,
  );

const swap = (
  on: boolean,
  reduced: boolean,
  delay = 0,
): React.CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: on ? "none" : "scale(0.9)",
  filter: on ? "none" : "blur(4px)",
  transition: reduced
    ? "none"
    : `opacity 300ms ${EASE} ${delay}ms, transform 420ms ${EASE} ${delay}ms, filter 300ms ${EASE} ${delay}ms`,
});

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

/** The crop's outline inside a stage of side s: a circle, or a rounded square. */
function holePath(shape: "circle" | "square", s: number, d: number) {
  const c = s / 2;
  if (shape === "circle")
    return `M${c - d / 2} ${c}a${d / 2} ${d / 2} 0 1 0 ${d} 0a${d / 2} ${d / 2} 0 1 0 ${-d} 0Z`;
  const r = d * SQUARE;
  const x = c - d / 2;
  return `M${x + r} ${x}H${x + d - r}A${r} ${r} 0 0 1 ${x + d} ${x + r}V${x + d - r}A${r} ${r} 0 0 1 ${x + d - r} ${x + d}H${x + r}A${r} ${r} 0 0 1 ${x} ${x + d - r}V${x + r}A${r} ${r} 0 0 1 ${x + r} ${x}Z`;
}

/** A sentence that changes crossfades whole: the old one lifts away through a blur while the new one rises in. */
function Line({ text, reduced }: { text: string; reduced: boolean }) {
  const [shown, setShown] = React.useState({ text, key: 0 });
  const [leaving, setLeaving] = React.useState<{ text: string; key: number }[]>(
    [],
  );
  if (text !== shown.text) {
    if (!reduced) setLeaving((l) => [...l, shown]);
    setShown({ text, key: shown.key + 1 });
  }
  return (
    <span className="relative block">
      <span
        key={shown.key}
        className="block"
        ref={(el) => {
          if (!el || reduced || shown.key === 0 || el.dataset.in) return;
          el.dataset.in = "1";
          el.animate(
            [
              {
                opacity: 0,
                transform: "translateY(0.35em)",
                filter: "blur(4px)",
              },
              { opacity: 1, transform: "none", filter: "blur(0px)" },
            ],
            { duration: 420, delay: 60, easing: EASE, fill: "backwards" },
          );
        }}
      >
        {shown.text}
      </span>
      {leaving.map((l) => (
        <span
          key={l.key}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 block"
          ref={(el) => {
            if (!el || el.dataset.out) return;
            el.dataset.out = "1";
            el.animate(
              [
                { opacity: 1, transform: "none", filter: "blur(0px)" },
                {
                  opacity: 0,
                  transform: "translateY(-0.35em)",
                  filter: "blur(4px)",
                },
              ],
              { duration: 200, easing: EASE, fill: "forwards" },
            ).onfinish = () =>
              setLeaving((all) => all.filter((x) => x.key !== l.key));
          }}
        >
          {l.text}
        </span>
      ))}
    </span>
  );
}

function IconButton({
  label,
  onClick,
  children,
  disabled,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-default disabled:opacity-40 [&_svg]:size-3.5 ${FOCUS}`}
    >
      {children}
    </button>
  );
}

export function AvatarCropper({
  value,
  defaultValue = null,
  onValueChange,
  name,
  onSave,
  onRemove,
  shape = "circle",
  size = 64,
  outputSize = 512,
  outputType = "image/webp",
  outputQuality = 0.9,
  accept = "image/*",
  maxSize = 10_000_000,
  maxZoom = 4,
  title = "Profile photo",
  hint = "JPG, PNG or WebP. Drop one on the circle.",
  ref,
  className = "",
  ...props
}: AvatarCropperProps) {
  const reduced = useReducedMotion();
  const uid = React.useId().replace(/[^\w-]/g, "");
  const [own, setOwn] = React.useState<string | null>(defaultValue);
  const current = value === undefined ? own : value;
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [photo, setPhoto] = React.useState<Photo | null>(null);
  const [stageSize, setStageSize] = React.useState(STAGE_MAX);
  const [status, setStatus] = React.useState<ActionStatus>("idle");
  const [removing, setRemoving] = React.useState<ActionStatus>("idle");
  const [note, setNote] = React.useState<Note | null>(null);
  const [over, setOver] = React.useState(false);
  const [committed, setCommitted] = React.useState<CropState>({
    x: 0,
    y: 0,
    z: 1,
    r: 0,
  });
  const [announce, setAnnounce] = React.useState("");
  // How the stage goes back: into the new photo (save) or handing over to the old one (cancel).
  const [landing, setLanding] = React.useState<{
    src: string;
    save: boolean;
  } | null>(null);
  /** The photo a save just landed on: shown at once, no fade, for the frame the stage disappears. */
  const [justLanded, setJustLanded] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!justLanded) return;
    const frame = requestAnimationFrame(() => setJustLanded(null));
    return () => cancelAnimationFrame(frame);
  }, [justLanded]);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const slotRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const surfaceRef = React.useRef<HTMLDivElement>(null);
  const controlsRef = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const panRef = React.useRef<HTMLDivElement>(null);
  const zoomRef = React.useRef<HTMLDivElement>(null);
  const rotRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<SVGGElement>(null);
  const sliderRef = React.useRef<HTMLInputElement>(null);
  const ownedUrls = React.useRef(new Set<string>());
  const phaseRef = React.useRef(phase);
  React.useLayoutEffect(() => {
    phaseRef.current = phase;
  });
  /** Focus moves into the stage only when someone opened it (not a photo opened on load), and back to the avatar after. */
  const takeFocus = React.useRef(false);
  const returnFocus = React.useRef(false);

  const d = stageSize - MARGIN * 2;
  const dims = React.useMemo(
    () => photo && { w: photo.w, h: photo.h },
    [photo],
  );
  const lastZoom = React.useRef(1);
  const crop = useCropGesture({
    size: d,
    image: dims,
    maxZoom,
    reduced,
    refs: {
      stage: stageRef,
      pan: panRef,
      zoom: zoomRef,
      rot: rotRef,
      grid: gridRef,
      slider: sliderRef,
    },
    onSettle: (s) => {
      setCommitted(s);
      // Announced once it settles, never while it moves.
      if (Math.round(s.z * 100) !== Math.round(lastZoom.current * 100))
        setAnnounce(`Zoom ${Math.round(s.z * 100)}%`);
      lastZoom.current = s.z;
    },
  });

  React.useEffect(() => {
    if (phase === "open" && takeFocus.current) {
      takeFocus.current = false;
      stageRef.current?.focus({ preventScroll: true });
    }
    if (phase === "idle" && returnFocus.current) {
      returnFocus.current = false;
      slotRef.current?.focus({ preventScroll: true });
    }
  }, [phase]);

  React.useEffect(
    () => () => {
      ownedUrls.current.forEach((u) => URL.revokeObjectURL(u));
    },
    [],
  );

  const flash = (text: string, tone: Note["tone"] = "muted") => {
    const key = Date.now();
    setNote({ text, tone, key });
    window.setTimeout(() => setNote((n) => (n?.key === key ? null : n)), 2800);
  };

  const shake = (el: HTMLElement | null) => {
    if (!el || reduced) return;
    el.animate(
      [
        { transform: "none" },
        { transform: "translateX(-4px)" },
        { transform: "translateX(4px)" },
        { transform: "translateX(-2px)" },
        { transform: "none" },
      ],
      {
        duration: 380,
        easing: "ease-out",
      },
    );
  };

  const setCurrent = (url: string | null) => {
    if (value === undefined) setOwn(url);
    onValueChange?.(url);
  };

  // ── Opening a photo ────────────────────────────────────
  const open = async (input: File | Blob | string) => {
    if (phaseRef.current === "opening" || phaseRef.current === "closing")
      return;
    const byHand =
      typeof navigator === "undefined" ||
      !("userActivation" in navigator) ||
      navigator.userActivation.isActive;
    if (typeof input !== "string") {
      if (!input.type.startsWith("image/")) {
        flash("That file isn't a photo.", "error");
        return shake(slotRef.current);
      }
      if (input.size > maxSize) {
        flash(
          `That photo is over ${Math.round(maxSize / 1_000_000)} MB.`,
          "error",
        );
        return shake(slotRef.current);
      }
    }
    const src = typeof input === "string" ? input : URL.createObjectURL(input);
    if (typeof input !== "string") ownedUrls.current.add(src);
    const img = new Image();
    img.src = src;
    try {
      await img.decode();
    } catch {
      flash("Couldn't read that photo.", "error");
      return shake(slotRef.current);
    }
    const width = rootRef.current?.offsetWidth ?? STAGE_MAX;
    setStageSize(Math.round(Math.min(STAGE_MAX, Math.max(220, width))));
    setPhoto({
      src,
      w: img.naturalWidth,
      h: img.naturalHeight,
      owned: typeof input !== "string",
    });
    setStatus("idle");
    setCommitted({ x: 0, y: 0, z: 1, r: 0 });
    lastZoom.current = 1;
    crop.reset();
    if (phaseRef.current === "idle") {
      takeFocus.current =
        byHand || !!rootRef.current?.contains(document.activeElement);
      setPhase(reduced ? "open" : "opening");
    } else {
      // Already open: the new photo fades in where the old one was.
      imgRef.current?.animate(
        [
          { opacity: 0, filter: "blur(6px)" },
          { opacity: 1, filter: "blur(0px)" },
        ],
        { duration: 360, easing: EASE },
      );
    }
    setAnnounce(
      "Photo opened. Drag to move it, pinch, scroll or use the slider to zoom, then Save.",
    );
  };

  const browse = () => fileRef.current?.click();
  React.useImperativeHandle(ref, () => ({ open, browse }));

  if (phase === "opening" && reduced) {
    setPhase("open");
  }

  // ── The morph: the avatar's circle grows into the stage, and back ──
  /** The stage's resting transform when it is the avatar: its crop on the slot's circle. */
  const collapsedFrame = () => {
    const slot = slotRef.current!.getBoundingClientRect();
    const stage = surfaceRef.current!;
    // Measured between morphs, when the stage carries no transform.
    const box = stage.getBoundingClientRect();
    const dx = slot.left + slot.width / 2 - (box.left + stageSize / 2);
    const dy = slot.top + slot.height / 2 - (box.top + stageSize / 2);
    const hole = shape === "circle" ? d / 2 : d * SQUARE;
    return {
      transform: `translate(${dx}px, ${dy}px) scale(${slot.width / d})`,
      clipPath: `inset(${MARGIN}px round ${hole}px)`,
    };
  };
  const openFrame = {
    transform: "translate(0px, 0px) scale(1)",
    clipPath: `inset(0px round ${RADIUS}px)`,
  };

  React.useLayoutEffect(() => {
    const surface = surfaceRef.current;
    const panel = panelRef.current;
    if (!surface || !panel) return;
    if (phase === "opening" && !reduced) {
      const height = panel.scrollHeight;
      panel.animate([{ height: "0px" }, { height: `${height}px` }], {
        duration: MORPH,
        easing: EASE,
      });
      // The dim is there from the first frame: the clip starts as the crop's own outline, so it opens onto the rest of
      // the photo already dimmed while the circle stays the photo.
      const a = surface.animate([collapsedFrame(), openFrame], {
        duration: MORPH,
        easing: EASE,
      });
      controlsRef.current?.animate(
        [
          { opacity: 0, transform: "translateY(-6px)", filter: "blur(4px)" },
          { opacity: 1, transform: "none", filter: "blur(0px)" },
        ],
        { duration: 420, delay: 220, easing: EASE, fill: "backwards" },
      );
      a.onfinish = () => setPhase("open");
      return () => a.cancel();
    }
    if (phase === "closing") {
      const done = () => {
        panel.getAnimations().forEach((a) => a.cancel());
        setPhase("idle");
        if (landing?.save) {
          setCurrent(landing.src);
          setJustLanded(landing.src);
        }
        setLanding(null);
        setPhoto(null);
        returnFocus.current = !!rootRef.current?.contains(
          document.activeElement,
        );
      };
      if (reduced) return done();
      const height = panel.offsetHeight;
      panel.animate([{ height: `${height}px` }, { height: "0px" }], {
        duration: MORPH - 40,
        easing: EASE,
        fill: "forwards",
      });
      controlsRef.current?.animate(
        [{ opacity: 1 }, { opacity: 0, filter: "blur(4px)" }],
        { duration: 160, easing: EASE, fill: "forwards" },
      );
      const a = surface.animate([openFrame, collapsedFrame()], {
        duration: MORPH,
        easing: EASE,
        fill: "forwards",
      });
      // Cancelling hands over to the old photo: once the stage is nearly home it fades while the old one comes back.
      if (!landing?.save)
        surface.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 240,
          delay: 220,
          easing: "linear",
          fill: "forwards",
        });
      a.onfinish = done;
      return () => a.cancel();
    }
  }, [phase]);

  const close = (save: { src: string } | null) => {
    if (phaseRef.current !== "open") return;
    setLanding(
      save
        ? { src: save.src, save: true }
        : { src: current ?? "", save: false },
    );
    setPhase("closing");
  };

  const cancel = () => {
    close(null);
    setAnnounce("Cancelled.");
  };

  const save = async () => {
    if (status === "pending" || phase !== "open" || !imgRef.current) return;
    setStatus("pending");
    setAnnounce("Saving.");
    try {
      const blob = await crop.toBlob(
        imgRef.current,
        outputSize,
        outputType,
        outputQuality,
      );
      const area = crop.area()!;
      const local = URL.createObjectURL(blob);
      ownedUrls.current.add(local);
      const stored = await onSave(blob, area);
      const src = typeof stored === "string" && stored ? stored : local;
      // Ready before the stage lands, so the hand-over is invisible.
      const ready = new Image();
      ready.src = src;
      await ready.decode().catch(() => undefined);
      setStatus("success");
      setAnnounce("Photo saved.");
      window.setTimeout(
        () => {
          close({ src });
          flash("Photo updated");
        },
        reduced ? 0 : 520,
      );
    } catch {
      setStatus("error");
      setAnnounce("Couldn't save the photo. Try again.");
    }
  };

  const remove = async () => {
    if (!onRemove || removing === "pending") return;
    setRemoving("pending");
    try {
      await onRemove();
      setRemoving("idle");
      setCurrent(null);
      flash("Photo removed");
      setAnnounce("Photo removed.");
    } catch {
      setRemoving("error");
    }
  };

  // ── Files from outside: drop and paste ─────────────────
  const fromTransfer = (data: DataTransfer | null) => {
    const file =
      data?.files?.[0] ??
      [...(data?.items ?? [])].find((i) => i.kind === "file")?.getAsFile() ??
      null;
    if (file) open(file);
    return !!file;
  };
  const dragProps = {
    onDragOver: (e: React.DragEvent) => {
      if (
        ![...e.dataTransfer.types].includes("Files") ||
        phase === "opening" ||
        phase === "closing"
      )
        return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      if (!over) setOver(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null))
        setOver(false);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setOver(false);
      fromTransfer(e.dataTransfer);
    },
  };

  const onStageKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 32 : 8;
    const keys: Record<string, () => void> = {
      ArrowLeft: () => crop.nudge(-step, 0),
      ArrowRight: () => crop.nudge(step, 0),
      ArrowUp: () => crop.nudge(0, -step),
      ArrowDown: () => crop.nudge(0, step),
      "+": () => crop.zoomBy(1.15),
      "=": () => crop.zoomBy(1.15),
      "-": () => crop.zoomBy(1 / 1.15),
      r: () => rotate(),
      R: () => rotate(),
      Enter: () => save(),
    };
    const run = keys[e.key];
    if (!run) return;
    e.preventDefault();
    run();
  };
  const rotate = () => {
    crop.rotate();
    setCommitted((c) => ({ ...c, r: c.r + 1 }));
    setAnnounce(`Rotated to ${(((crop.state().r % 4) + 4) % 4) * 90}°.`);
  };

  // ── Render ─────────────────────────────────────────────
  const editing = phase !== "idle";
  const round =
    shape === "circle" ? "9999px" : `${Math.round(size * SQUARE)}px`;
  const cover = photo ? d / Math.min(photo.w, photo.h) : 1;
  const hole = holePath(shape, stageSize, d);
  // What the slot shows: the current photo, or (once a save lands) the new one; nothing while the stage has it.
  const landed = phase === "closing" && landing?.save ? landing.src : null;
  const shownSrc = landed ?? current;
  const slotVisible =
    phase === "idle" || (phase === "closing" && !landing?.save);
  const layers = [
    ...new Set([current, landed].filter((s): s is string => !!s)),
  ];
  const line =
    note ??
    (editing
      ? {
          text: "Drag to move, pinch or scroll to zoom",
          tone: "muted" as const,
          key: 0,
        }
      : over
        ? { text: "Drop to use it", tone: "muted" as const, key: 0 }
        : { text: hint, tone: "muted" as const, key: 0 });

  return (
    <div
      ref={rootRef}
      className={`w-full text-foreground ${className}`}
      onPaste={(e) => {
        if (fromTransfer(e.clipboardData)) e.preventDefault();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && phase === "open") {
          e.preventDefault();
          cancel();
        }
      }}
      {...props}
    >
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) open(file);
        }}
      />

      <div className="flex items-center gap-4">
        <button
          ref={slotRef}
          type="button"
          onClick={browse}
          disabled={editing}
          aria-label={
            current ? `Change ${name}'s photo` : `Add a photo for ${name}`
          }
          aria-describedby={`${uid}-line`}
          {...dragProps}
          className={`group/slot relative shrink-0 cursor-pointer disabled:cursor-default ${FOCUS}`}
          style={{
            width: size,
            height: size,
            borderRadius: round,
            transform: over ? "scale(1.06)" : "none",
            transition: reduced ? "none" : `transform 420ms ${THROW}`,
          }}
        >
          <span
            className="absolute inset-0 overflow-hidden bg-muted"
            style={{ borderRadius: round }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center font-medium text-muted-foreground"
              style={{
                ...swap(
                  !shownSrc && slotVisible,
                  reduced,
                  phase === "closing" ? 200 : 0,
                ),
                fontSize: Math.round(size * 0.32),
              }}
            >
              {initials(name)}
            </span>
            {layers.map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                draggable={false}
                className="absolute inset-0 size-full object-cover"
                style={
                  // The new photo takes over the moment the stage lands on it: no fade, it's already there.
                  src === landed
                    ? { opacity: 0, transition: "none" }
                    : src === justLanded
                      ? { opacity: 1, transition: "none" }
                      : swap(
                          src === shownSrc && slotVisible,
                          reduced,
                          phase === "closing" ? 200 : 0,
                        )
                }
              />
            ))}
            {/* Hover: a quiet dim and a camera, so the circle reads as the place to click or drop. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center text-background opacity-0 transition-opacity duration-200 group-hover/slot:opacity-100 group-disabled/slot:!opacity-0"
              style={{
                background:
                  "color-mix(in oklab, var(--foreground) 38%, transparent)",
              }}
            >
              <Camera
                className="size-[38%] max-h-5 max-w-5"
                strokeWidth={1.75}
              />
            </span>
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-shadow duration-200"
            style={{
              borderRadius: round,
              boxShadow: over
                ? "inset 0 0 0 1.5px var(--ring)"
                : "inset 0 0 0 1px var(--border)",
            }}
          />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-medium tracking-[-0.01em]">{title}</p>
          <p
            id={`${uid}-line`}
            className={`mt-0.5 text-[12.5px] transition-colors duration-300 ${line.tone === "error" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
          >
            <Line text={line.text} reduced={reduced} />
          </p>
          <div
            className="-ml-2.5 mt-1.5 flex items-center gap-0.5 transition-[opacity,filter] duration-300"
            style={{
              opacity: editing ? 0 : 1,
              filter: editing ? "blur(3px)" : "none",
            }}
            inert={editing}
          >
            <StatusButton
              variant="ghost"
              size="sm"
              status="idle"
              labels={{ idle: current ? "Replace" : "Upload" }}
              onClick={browse}
            />
            {onRemove && (
              <span
                className="grid transition-[grid-template-columns,opacity] duration-300"
                style={{
                  gridTemplateColumns: current ? "1fr" : "0fr",
                  opacity: current ? 1 : 0,
                  transitionTimingFunction: EASE,
                }}
                inert={!current}
              >
                <span className="min-w-0 overflow-hidden">
                  <StatusButton
                    variant="ghost"
                    size="sm"
                    status={removing}
                    labels={{
                      idle: "Remove",
                      pending: "Removing",
                      success: "Removed",
                      error: "Try again",
                    }}
                    onClick={remove}
                  />
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* The stage: the same circle, grown. Its height is the panel's, which eases open and shut. */}
      <div ref={panelRef} style={{ height: editing ? undefined : 0 }}>
        {editing && photo && (
          <div className="pt-4">
            <div
              ref={surfaceRef}
              className="relative overflow-hidden bg-muted will-change-transform"
              style={{
                width: stageSize,
                height: stageSize,
                borderRadius: RADIUS,
                transformOrigin: "50% 50%",
              }}
              {...dragProps}
            >
              <div
                ref={stageRef}
                tabIndex={0}
                role="group"
                aria-roledescription="crop area"
                aria-label={`Crop ${name}'s photo`}
                aria-describedby={`${uid}-how`}
                onKeyDown={onStageKey}
                {...crop.handlers}
                className={`absolute inset-0 touch-none select-none outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring ${
                  phase === "open"
                    ? "cursor-grab active:cursor-grabbing"
                    : "pointer-events-none"
                }`}
                style={{ borderRadius: RADIUS }}
              >
                <div ref={panRef} className="absolute left-1/2 top-1/2 size-0">
                  <div ref={zoomRef} className="absolute left-0 top-0 size-0">
                    <div ref={rotRef} className="absolute left-0 top-0 size-0">
                      <img
                        ref={imgRef}
                        src={photo.src}
                        alt=""
                        draggable={false}
                        className="pointer-events-none absolute max-w-none select-none"
                        style={{
                          width: photo.w * cover,
                          height: photo.h * cover,
                          left: (-photo.w * cover) / 2,
                          top: (-photo.h * cover) / 2,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 size-full"
                  viewBox={`0 0 ${stageSize} ${stageSize}`}
                >
                  <path
                    fillRule="evenodd"
                    d={`M0 0H${stageSize}V${stageSize}H0Z${hole}`}
                    style={{
                      fill: "color-mix(in oklab, var(--background) 64%, transparent)",
                    }}
                  />
                  <clipPath id={`${uid}-hole`}>
                    <path d={hole} />
                  </clipPath>
                  {/* Thirds, only while a finger is on the photo. */}
                  <g
                    ref={gridRef}
                    clipPath={`url(#${uid}-hole)`}
                    style={{
                      opacity: 0,
                      transition: reduced ? "none" : `opacity 240ms ${EASE}`,
                    }}
                  >
                    {[1, 2].map((i) => (
                      <React.Fragment key={i}>
                        <path
                          d={`M${MARGIN + (d * i) / 3} ${MARGIN}V${MARGIN + d}`}
                          style={{
                            stroke:
                              "color-mix(in oklab, var(--background) 55%, transparent)",
                          }}
                          strokeWidth={1}
                        />
                        <path
                          d={`M${MARGIN} ${MARGIN + (d * i) / 3}H${MARGIN + d}`}
                          style={{
                            stroke:
                              "color-mix(in oklab, var(--background) 55%, transparent)",
                          }}
                          strokeWidth={1}
                        />
                      </React.Fragment>
                    ))}
                  </g>
                  <path
                    d={hole}
                    fill="none"
                    style={{ stroke: "var(--background)" }}
                    strokeOpacity={0.9}
                    strokeWidth={1.25}
                  />
                </svg>
              </div>
            </div>

            <div ref={controlsRef} style={{ width: stageSize }}>
              <div className="mt-3 flex items-center gap-1">
                <IconButton
                  label="Zoom out"
                  onClick={() => crop.zoomBy(1 / 1.25)}
                  disabled={committed.z <= 1.001}
                >
                  <Minus strokeWidth={1.75} />
                </IconButton>
                <input
                  ref={sliderRef}
                  type="range"
                  min={1}
                  max={maxZoom}
                  step={0.01}
                  defaultValue={1}
                  aria-label="Zoom"
                  aria-valuetext={`${Math.round(committed.z * 100)}%`}
                  onInput={(e) => crop.zoomTo(Number(e.currentTarget.value))}
                  onPointerUp={() => crop.settle()}
                  onKeyUp={() => crop.settle()}
                  onBlur={() => crop.settle()}
                  className={`h-7 min-w-0 flex-1 cursor-pointer appearance-none bg-transparent focus-visible:outline-none [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow-[0_0_0_1px_var(--foreground)] [&::-moz-range-track]:h-px [&::-moz-range-track]:bg-border [&::-webkit-slider-runnable-track]:h-px [&::-webkit-slider-runnable-track]:bg-border [&::-webkit-slider-thumb]:-mt-[6.5px] [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_var(--foreground)] focus-visible:[&::-webkit-slider-thumb]:shadow-[0_0_0_2px_var(--ring)] focus-visible:[&::-moz-range-thumb]:shadow-[0_0_0_2px_var(--ring)]`}
                />
                <IconButton
                  label="Zoom in"
                  onClick={() => crop.zoomBy(1.25)}
                  disabled={committed.z >= maxZoom - 0.001}
                >
                  <Plus strokeWidth={1.75} />
                </IconButton>
                <span
                  className="w-11 shrink-0 text-right text-[12px] tabular-nums text-muted-foreground"
                  aria-hidden="true"
                >
                  <NumberRoll
                    value={Math.round(committed.z * 100)}
                    suffix="%"
                    duration={700}
                  />
                </span>
                <IconButton label="Rotate a quarter turn" onClick={rotate}>
                  <RotateCw strokeWidth={1.75} />
                </IconButton>
              </div>
              <div className="mt-2.5 flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={cancel}
                  disabled={status === "pending" || status === "success"}
                  className={`inline-flex h-9 cursor-pointer items-center rounded-full px-4 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-default disabled:opacity-50 ${FOCUS}`}
                >
                  Cancel
                </button>
                <StatusButton
                  status={status}
                  labels={{
                    idle: "Save",
                    pending: "Saving",
                    success: "Saved",
                    error: "Try again",
                  }}
                  onClick={save}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <p id={`${uid}-how`} className="sr-only">
        Arrow keys move the photo, plus and minus zoom, R rotates, Enter saves
        and Escape cancels.
      </p>
      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}
