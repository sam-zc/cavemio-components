"use client";
import { useState, useSyncExternalStore } from "react";
import { useVideoPlayer, useVideoState } from "./video-player-context";
import { detectVideoFormat } from "./video-player-utils";
import type { VideoFormat } from "./video-player-types";

const number = (value: number | null | undefined, unit = "", decimals = 1) =>
  value == null || !Number.isFinite(value)
    ? "N/A"
    : `${value.toFixed(decimals)}${unit}`;
export default function PlaybackDiagnostics({
  src,
  format,
}: {
  src: string;
  format?: VideoFormat;
}) {
  const [open, setOpen] = useState(true);
  return (
    <section className="mt-4 rounded-xl border border-border bg-background text-foreground">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex min-h-11 w-full items-center justify-between px-4 text-left text-xs font-medium focus-visible:outline-2 focus-visible:outline-ring"
      >
        Streaming diagnostics
        <span className="text-muted-foreground">{open ? "Hide" : "Show"}</span>
      </button>
      {open && <Metrics format={detectVideoFormat(src, format)} />}
    </section>
  );
}
function Metrics({ format }: { format: VideoFormat }) {
  const { store } = useVideoPlayer();
  const metrics = useSyncExternalStore(
    store.subscribeDiagnostics,
    store.getDiagnostics,
    store.getDiagnostics,
  );
  const engine = useVideoState((s) => s.engine),
    quality = useVideoState((s) => s.selectedQuality),
    rate = useVideoState((s) => s.rate),
    capabilities = useVideoState((s) => s.capabilities);
  const [copied, setCopied] = useState("");
  const s = metrics.stats;
  const fields = [
    ["Engine / format", `${engine ?? "Loading"} / ${format.toUpperCase()}`],
    ["Resolution", s?.width && s.height ? `${s.width} × ${s.height}` : "N/A"],
    [
      "Bandwidth estimate",
      number(
        s?.estimatedBandwidth == null ? null : s.estimatedBandwidth / 1e6,
        " Mbps",
      ),
    ],
    [
      "Rendition bitrate",
      number(
        s?.variantBitrate == null ? null : s.variantBitrate / 1e6,
        " Mbps",
      ),
    ],
    [
      "Buffer ahead / behind",
      `${number(metrics.bufferAhead, "s")} / ${number(metrics.bufferBehind, "s")}`,
    ],
    ["Rebuffers", String(metrics.stalls)],
    ["Buffering time", number(store.bufferingSeconds(), "s")],
    ["Load latency", number(s?.loadLatency, "s")],
    ["First play latency", number(metrics.startupSeconds, "s")],
    ["Dropped frames", number(s?.droppedFrames, "", 0)],
    ["Playback rate", `${rate}×`],
    [
      "ABR",
      capabilities.quality
        ? quality === "auto"
          ? "Enabled"
          : "Manual"
        : "N/A",
    ],
  ];
  return (
    <div className="border-t border-border px-4 pb-4">
      <dl className="grid grid-cols-2 gap-x-5 gap-y-4 py-4 @min-[640px]:grid-cols-3">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[10px] text-muted-foreground">{label}</dt>
            <dd className="mt-1 font-mono text-xs tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mb-3 text-[11px] text-muted-foreground">
        Requested quality and active rendition may differ while buffered
        segments finish. N/A means unavailable. First play latency includes time
        waiting for user input.
      </p>
      {metrics.latestError && (
        <p className="mb-3 text-xs">
          Latest error: {metrics.latestError.category} /{" "}
          {metrics.latestError.code} · {metrics.latestError.message}
        </p>
      )}
      <ol
        aria-label="Playback event timeline"
        className="max-h-40 overflow-auto rounded-lg bg-muted p-3 font-mono text-[10px] leading-5"
      >
        {metrics.events.map((event, i) => (
          <li key={`${event.at}-${i}`}>
            <span className="mr-3 text-muted-foreground">
              {number(event.at / 1000, "s")}
            </span>
            {event.event}
            {event.detail && ` · ${event.detail}`}
          </li>
        ))}
      </ol>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          className="min-h-11 rounded-lg border border-border px-3 text-xs focus-visible:outline-2 focus-visible:outline-ring"
          onClick={() => {
            void navigator.clipboard?.writeText(store.exportDiagnostics()).then(
              () => setCopied("Copied"),
              () => setCopied("Clipboard unavailable"),
            );
            if (!navigator.clipboard) setCopied("Clipboard unavailable");
          }}
        >
          Copy diagnostics
        </button>
        <span role="status" className="text-xs text-muted-foreground">
          {copied}
        </span>
      </div>
    </div>
  );
}
