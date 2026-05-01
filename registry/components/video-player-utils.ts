import type {
  PlayerError,
  VideoEngine,
  VideoFormat,
  VideoQuality,
} from "./video-player-types";

export function formatVideoTime(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const seconds = Math.floor(value);
  const minutes = Math.floor(seconds / 60);
  return minutes >= 60
    ? `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`
    : `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}
export function detectVideoFormat(
  src: string,
  explicit?: VideoFormat,
): VideoFormat {
  if (explicit) return explicit;
  const path = src.split(/[?#]/)[0].toLowerCase();
  if (path.endsWith(".mpd")) return "dash";
  if (path.endsWith(".m3u8")) return "hls";
  return "mp4";
}
export function supportsSource(
  engine: VideoEngine,
  format: VideoFormat,
  drm = false,
) {
  if (drm && engine !== "shaka") return false;
  return (
    engine === "shaka" ||
    (engine === "hls" ? format === "hls" : format !== "dash")
  );
}
export function readRanges(ranges: TimeRanges): [number, number][] {
  return Array.from({ length: ranges.length }, (_, i) => [
    ranges.start(i),
    ranges.end(i),
  ]);
}
export function bufferAt(
  ranges: readonly (readonly [number, number])[],
  time: number,
) {
  const range = ranges.find(([start, end]) => time >= start && time <= end);
  return {
    ahead: range ? range[1] - time : 0,
    behind: range ? time - range[0] : 0,
  };
}
export function clampSeek(time: number, start: number, end: number) {
  return Number.isFinite(time) && end > start
    ? Math.min(end, Math.max(start, time))
    : start;
}
export function normalizeQualities(qualities: VideoQuality[]): VideoQuality[] {
  return [...qualities].sort(
    (a, b) => b.height - a.height || b.bitrate - a.bitrate,
  );
}
export function finite(value: number | undefined): number | null {
  return value !== undefined && Number.isFinite(value) ? value : null;
}
/** Deliberately discard engine messages, URLs, payloads and stack traces. */
export function playerError(error: unknown, fatal = true): PlayerError {
  const e = (
    typeof error === "object" && error !== null ? error : {}
  ) as Record<string, unknown>;
  const category =
    e.name === "NotAllowedError"
      ? "permission"
      : e.name === "NotSupportedError"
        ? "unsupported"
        : e.category === 1
          ? "network"
          : e.category === 6
            ? "drm"
            : e.category === 3 || e.category === 4 || e.category === 5
              ? "media"
              : "unknown";
  const messages = {
    permission: "Playback was blocked. Press play to try again.",
    unsupported: "This browser or playback engine cannot play this source.",
    network:
      "The video could not be downloaded. Check your connection and retry.",
    drm: "Protected playback could not start. Check device support and license configuration.",
    media: "This video could not be decoded or its manifest is invalid.",
    unknown: "The video could not start. Please try again.",
  };
  return {
    code: typeof e.code === "number" ? String(e.code) : category.toUpperCase(),
    category,
    message: messages[category],
    fatal,
    retryable: category !== "unsupported" && category !== "permission",
  };
}
export function unsupportedError(message: string): PlayerError {
  return {
    code: "UNSUPPORTED",
    category: "unsupported",
    message,
    fatal: true,
    retryable: false,
  };
}
