"use client";

import * as React from "react";
import { AnimatePresence, motion, useIsPresent } from "motion/react";
import {
  ArrowUp,
  Clock,
  FileWarning,
  FileText,
  LoaderCircle,
  RotateCcw,
  X,
} from "lucide-react";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "./attachment";
import { NumberRoll } from "./number-roll";
import { useInteractionReducedMotion } from "./ui-interaction-motion";

export type MembraneAttachmentStatus =
  "idle" | "uploading" | "processing" | "error" | "done";

export interface MembraneAttachmentProps {
  file: Pick<File, "name" | "size">;
  status: MembraneAttachmentStatus;
  /** Upload progress from 0 to 1. */
  progress?: number;
  error?: string;
  disabled?: boolean;
  onRemove?: () => void;
  onRetry?: () => void;
  onUpload?: () => void;
}

export function formatBytes(n: number) {
  return n < 1000
    ? n + " B"
    : n < 1e6
      ? Math.round(n / 100) / 10 + " KB"
      : (n / 1e6).toFixed(n < 1e7 ? 1 : 0) + " MB";
}

const SWAP = { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const };
const INSTANT = { duration: 0 };
const PROGRESS = {
  type: "spring" as const,
  stiffness: 300,
  damping: 35,
  mass: 0.8,
  restDelta: 0.001,
};
const ICONS = {
  idle: Clock,
  uploading: LoaderCircle,
  processing: FileText,
  error: FileWarning,
};

/** Progress updates do not restart or re-render the status icon animation. */
const StatusIcon = React.memo(function StatusIcon({
  status,
  reduced,
}: {
  status: MembraneAttachmentStatus;
  reduced: boolean;
}) {
  const Icon = status === "done" ? null : ICONS[status];
  const content = Icon ? (
    <Icon
      className={
        "size-4 " + (status === "uploading" ? "motion-safe:animate-spin" : "")
      }
      strokeWidth={1.75}
    />
  ) : (
    <motion.svg
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M3.5 8.5l3 3 6-7"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={reduced ? INSTANT : { ...SWAP, duration: 0.25 }}
      />
    </motion.svg>
  );
  if (reduced)
    return (
      <span
        aria-hidden="true"
        data-attachment-icon={status}
        className="absolute inset-0 flex items-center justify-center"
      >
        {content}
      </span>
    );
  return (
    <AnimatePresence initial={false}>
      <motion.span
        key={status}
        aria-hidden="true"
        data-attachment-icon={status}
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={SWAP}
      >
        {content}
      </motion.span>
    </AnimatePresence>
  );
});

/** Measure only text reflow (state, wrapping or font changes), never animation frames. */
function StatusDescription({
  status,
  description,
  pct,
  reduced,
}: {
  status: MembraneAttachmentStatus;
  description: string;
  pct: number;
  reduced: boolean;
}) {
  const measure = React.useRef<HTMLSpanElement>(null);
  const [height, setHeight] = React.useState<number>();
  React.useLayoutEffect(() => {
    const node = measure.current;
    if (!node) return;
    const resize = () => {
      const next = node.getBoundingClientRect().height;
      setHeight((old) => (old === next ? old : next));
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.span
      className="relative block"
      initial={false}
      animate={{ height: height ?? "auto" }}
      transition={reduced ? INSTANT : SWAP}
    >
      {/* Sizing and accessibility use plain current text; exiting text is decorative. */}
      <span
        ref={measure}
        aria-hidden="true"
        className={
          "invisible block " +
          (status === "uploading" ? "whitespace-nowrap" : "")
        }
      >
        {status === "uploading" ? "Uploading · 100%" : description}
      </span>
      <span className="sr-only">{description}</span>
      {reduced ? (
        <span
          aria-hidden="true"
          data-attachment-description={status}
          className="absolute inset-x-0 top-0 block"
        >
          {description}
        </span>
      ) : (
        <AnimatePresence initial={false}>
          <motion.span
            key={status}
            aria-hidden="true"
            data-attachment-description={status}
            className="absolute inset-x-0 top-0 block"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={SWAP}
          >
            {status === "uploading" ? (
              <span className="inline-flex items-baseline whitespace-nowrap">
                Uploading ·&nbsp;
                <NumberRoll value={pct} suffix="%" duration={220} />
              </span>
            ) : (
              description
            )}
          </motion.span>
        </AnimatePresence>
      )}
    </motion.span>
  );
}

function StateAction({
  kind,
  name,
  disabled,
  reduced,
  onClick,
}: {
  kind: "idle" | "error";
  name: string;
  disabled?: boolean;
  reduced: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const present = useIsPresent();
  const Icon = kind === "idle" ? ArrowUp : RotateCcw;
  return (
    <motion.span
      className="absolute inset-0 flex items-center justify-center"
      inert={!present}
      aria-hidden={!present || undefined}
      initial={reduced ? false : { opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={reduced ? INSTANT : SWAP}
    >
      <AttachmentAction
        size="icon"
        disabled={disabled || !present}
        onClick={onClick}
        aria-label={(kind === "idle" ? "Upload " : "Retry ") + name}
      >
        <Icon />
      </AttachmentAction>
    </motion.span>
  );
}

/** Attachment with persistent identity and interruptible state transitions. */
export function MembraneAttachment({
  file,
  status,
  progress = 0,
  error,
  disabled,
  onRemove,
  onRetry,
  onUpload,
}: MembraneAttachmentProps) {
  const reduced = useInteractionReducedMotion();
  const root = React.useRef<HTMLDivElement>(null);
  const removeButton = React.useRef<HTMLButtonElement>(null);
  const pct = Math.round(
    Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0)) * 100,
  );
  const description = {
    idle: "Ready to upload",
    uploading: "Uploading · " + pct + "%",
    processing: "Processing document",
    error: error || "Upload failed. Try again.",
    done: "Uploaded · " + formatBytes(file.size),
  }[status];
  const action =
    status === "idle" && onUpload
      ? "idle"
      : status === "error" && onRetry
        ? "error"
        : null;
  const runAction: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    // A disappearing action must not leave keyboard focus on the document body.
    if (event.currentTarget.contains(document.activeElement)) {
      (removeButton.current ?? root.current)?.focus({ preventScroll: true });
    }
    (action === "idle" ? onUpload : onRetry)?.();
  };
  const uploading = status === "uploading";
  const fraction = uploading
    ? pct / 100
    : status === "processing" || status === "done"
      ? 1
      : 0;

  return (
    <Attachment
      ref={root}
      tabIndex={-1}
      state={status}
      className="block w-full rounded-[14px] border-border duration-200 outline-none motion-reduce:transition-none"
    >
      <div className="flex min-w-0 items-start gap-2.5">
        <AttachmentMedia className="size-10 rounded-[10px] transition-colors duration-200 motion-reduce:transition-none">
          <StatusIcon status={status} reduced={reduced} />
        </AttachmentMedia>
        <AttachmentContent className="pt-0.5">
          <AttachmentTitle title={file.name} className="text-sm">
            {file.name}
          </AttachmentTitle>
          <AttachmentDescription className="overflow-visible whitespace-normal [overflow-wrap:anywhere] transition-colors duration-200 motion-reduce:transition-none">
            <StatusDescription
              status={status}
              description={description}
              pct={pct}
              reduced={reduced}
            />
          </AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions className="pt-1">
          <motion.span
            className="relative block h-8 shrink-0"
            initial={false}
            animate={{ width: action ? 32 : 0 }}
            transition={reduced ? INSTANT : SWAP}
          >
            {reduced ? (
              action && (
                <StateAction
                  key={action}
                  kind={action}
                  name={file.name}
                  reduced
                  disabled={disabled}
                  onClick={runAction}
                />
              )
            ) : (
              <AnimatePresence initial={false}>
                {action && (
                  <StateAction
                    key={action}
                    kind={action}
                    name={file.name}
                    reduced={false}
                    disabled={disabled}
                    onClick={runAction}
                  />
                )}
              </AnimatePresence>
            )}
          </motion.span>
          {onRemove && (
            <AttachmentAction
              ref={removeButton}
              size="icon"
              disabled={disabled}
              onClick={onRemove}
              aria-label={
                (status === "uploading" || status === "processing"
                  ? "Cancel "
                  : "Remove ") + file.name
              }
            >
              <X />
            </AttachmentAction>
          )}
        </AttachmentActions>
      </div>
      {/* A persistent tray can reverse mid-collapse; height animates without scaling any text. */}
      <motion.div
        data-attachment-progress-tray
        aria-hidden={!uploading}
        className="overflow-hidden px-1"
        initial={false}
        animate={{ height: uploading ? 16 : 0, opacity: uploading ? 1 : 0 }}
        transition={
          reduced
            ? INSTANT
            : {
                height: {
                  ...SWAP,
                  duration: 0.24,
                  delay: status === "processing" ? 0.12 : 0,
                },
                opacity: { ...SWAP, delay: status === "processing" ? 0.12 : 0 },
              }
        }
      >
        <div className="pt-2">
          <div
            className="h-1 overflow-hidden rounded-full bg-muted"
            role={uploading ? "progressbar" : undefined}
            aria-label={uploading ? "Uploading " + file.name : undefined}
            aria-valuemin={uploading ? 0 : undefined}
            aria-valuemax={uploading ? 100 : undefined}
            aria-valuenow={uploading ? pct : undefined}
          >
            <motion.div
              data-attachment-progress
              className="h-full origin-left rounded-full bg-foreground"
              initial={false}
              animate={{ scaleX: fraction }}
              transition={reduced ? INSTANT : PROGRESS}
            />
          </div>
        </div>
      </motion.div>
    </Attachment>
  );
}
