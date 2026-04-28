import * as React from "react";
import {
  MembraneAttachment,
  type MembraneAttachmentStatus,
} from "../registry/components/membrane-attachment";
import { Button } from "../registry/components/attachment-button";
import { demoUpload } from "./drop-zone-membrane-demo";

const states = [
  ["idle", "Ready"],
  ["uploading", "Uploading"],
  ["processing", "Processing"],
  ["error", "Failed"],
  ["done", "Uploaded"],
] as const;
const filename = "design-system.pdf";

function pause(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);
    const abort = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", abort);
      resolve();
    }, ms);
    signal.addEventListener("abort", abort, { once: true });
  });
}

export function AttachmentTransitionsDemo() {
  const [status, setStatus] = React.useState<MembraneAttachmentStatus>("idle");
  const [progress, setProgress] = React.useState(0);
  const [name, setName] = React.useState(filename);
  const [removed, setRemoved] = React.useState(false);
  const [running, setRunning] = React.useState(false);
  const [longError, setLongError] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const job = React.useRef<AbortController | null>(null);
  const reset = React.useRef<HTMLButtonElement>(null);
  const progressId = React.useId();
  const nameId = React.useId();
  React.useEffect(() => () => job.current?.abort(), []);

  const stop = () => {
    job.current?.abort();
    job.current = null;
    setRunning(false);
  };
  const choose = (next: MembraneAttachmentStatus) => {
    stop();
    setRemoved(false);
    setStatus(next);
    setProgress(
      next === "idle" ? 0 : next === "uploading" || next === "error" ? 0.64 : 1,
    );
  };
  const play = async (failFirst = false, showReady = true) => {
    stop();
    const controller = new AbortController();
    const { signal } = controller;
    job.current = controller;
    setRemoved(false);
    setRunning(true);
    setProgress(0);
    setStatus(showReady ? "idle" : "uploading");
    try {
      if (showReady) await pause(500, signal);
      setStatus("uploading");
      if (failFirst) {
        for (let step = 1; step <= 6; step++) {
          await pause(180, signal);
          setProgress(step / 10);
        }
        setStatus("error");
        await pause(1200, signal);
        setProgress(0);
        setStatus("uploading");
      }
      await demoUpload(new File([], name), {
        signal,
        progress: setProgress,
        processing: () => setStatus("processing"),
      });
      if (!signal.aborted) setStatus("done");
    } catch {
      // Manual controls, reset, removal and unmount cancel the current playback.
    } finally {
      if (job.current === controller) {
        job.current = null;
        setRunning(false);
      }
    }
  };
  const label = states.find(([value]) => value === status)?.[1];

  return (
    <section
      aria-label="Attachment transition playground"
      className="w-full max-w-[520px] space-y-7"
    >
      <header>
        <h1 className="text-xl font-medium tracking-tight">
          Attachment transitions
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Replay an upload, jump between states, or scrub the progress.
        </p>
      </header>

      <div className="min-h-[112px]">
        {removed ? (
          <p className="rounded-[14px] border border-dashed border-border p-5 text-sm text-muted-foreground">
            Attachment removed. Reset to restore it.
          </p>
        ) : (
          <MembraneAttachment
            file={{ name, size: 1_800_000 }}
            status={status}
            progress={progress}
            error={
              longError
                ? "The connection was interrupted before the document finished uploading. Check your connection and try again."
                : undefined
            }
            disabled={disabled}
            onUpload={() => void play(false, false)}
            onRetry={() => void play(false, false)}
            onRemove={() => {
              stop();
              setRemoved(true);
              reset.current?.focus();
            }}
          />
        )}
      </div>

      <div className="space-y-5 rounded-[14px] border border-border bg-muted/30 p-4">
        <fieldset>
          <legend className="mb-2 text-xs font-medium text-muted-foreground">
            Jump to a state
          </legend>
          <div className="flex flex-wrap gap-2">
            {states.map(([value, label]) => (
              <Button
                key={value}
                variant={status === value && !removed ? "secondary" : "outline"}
                size="sm"
                aria-pressed={status === value && !removed}
                onClick={() => choose(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </fieldset>

        <div>
          <div className="mb-2 flex justify-between text-xs">
            <label htmlFor={progressId}>Upload progress</label>
            <output htmlFor={progressId} className="tabular-nums">
              {Math.round(progress * 100)}%
            </output>
          </div>
          <input
            id={progressId}
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(progress * 100)}
            className="block w-full cursor-pointer accent-[var(--foreground)]"
            onChange={(event) => {
              stop();
              setRemoved(false);
              setStatus("uploading");
              setProgress(Number(event.currentTarget.value) / 100);
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void play()}>
            Play success
          </Button>
          <Button variant="outline" onClick={() => void play(true)}>
            Play failure + retry
          </Button>
          <Button variant="ghost" disabled={!running} onClick={stop}>
            Stop
          </Button>
          <Button ref={reset} variant="ghost" onClick={() => choose("idle")}>
            Reset
          </Button>
        </div>

        <div className="space-y-3 border-t border-border pt-4 text-xs">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={longError}
              onChange={(event) => setLongError(event.currentTarget.checked)}
            />
            Long error message
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={disabled}
              onChange={(event) => setDisabled(event.currentTarget.checked)}
            />
            Disable file actions
          </label>
          <div>
            <label htmlFor={nameId} className="mb-1.5 block">
              Filename
            </label>
            <input
              id={nameId}
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
        </div>
      </div>
      <p role="status" className="text-xs text-muted-foreground">
        {removed ? "Removed" : label} · {running ? "Playing" : "Manual control"}{" "}
        · Simulated upload
      </p>
    </section>
  );
}
