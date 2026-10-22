import type {
  PlayerAdapter,
  PlayerEvent,
  PlaybackStats,
  VideoSource,
  VideoTrack,
} from "./video-player-types";
import { detectVideoFormat, finite, readRanges } from "./video-player-utils";

export class NativeAdapter implements PlayerAdapter {
  readonly engine = "native" as const;
  readonly capabilities = {
    quality: false,
    audio: false,
    captions: true,
    drm: false,
  };
  private cancelLoad?: () => void;
  constructor(
    private video: HTMLVideoElement,
    private emit: (event: PlayerEvent) => void,
  ) {}
  load(source: VideoSource, startTime?: number): Promise<void> {
    const type = detectVideoFormat(source.src, source.type);
    if (
      source.drm ||
      type === "dash" ||
      (type === "hls" &&
        !this.video.canPlayType("application/vnd.apple.mpegurl"))
    ) {
      return Promise.reject(
        new DOMException("Unsupported source", "NotSupportedError"),
      );
    }
    this.emit({ type: "loading" });
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        this.video.removeEventListener("loadedmetadata", ready);
        this.video.removeEventListener("error", fail);
        clearTimeout(timeout);
        this.cancelLoad = undefined;
      };
      const ready = () => {
        cleanup();
        if (startTime && Number.isFinite(this.video.duration))
          this.video.currentTime = Math.min(startTime, this.video.duration);
        this.emit({ type: "manifest" });
        resolve();
      };
      const fail = () => {
        cleanup();
        reject({ category: 3, code: this.video.error?.code });
      };
      const timeout = setTimeout(() => {
        cleanup();
        reject({ category: 1 });
      }, 30000);
      this.cancelLoad = () => {
        cleanup();
        reject(new DOMException("Cancelled", "AbortError"));
      };
      this.video.addEventListener("loadedmetadata", ready);
      this.video.addEventListener("error", fail);
      this.video.src = source.src;
      this.video.load();
    });
  }
  getQualities() {
    return [];
  }
  setQuality() {}
  getAudioTracks() {
    return [];
  }
  setAudioTrack() {}
  getTextTracks(): VideoTrack[] {
    return Array.from(this.video.textTracks).map((t, i) => ({
      id: String(i),
      language: t.language,
      label: t.label || t.language || `Track ${i + 1}`,
      active: t.mode === "showing",
    }));
  }
  setTextTrack(id: string) {
    Array.from(this.video.textTracks).forEach((t, i) => {
      t.mode = String(i) === id ? "showing" : "disabled";
    });
    this.emit({ type: "tracks" });
  }
  getStats(): PlaybackStats {
    return {
      width: this.video.videoWidth || null,
      height: this.video.videoHeight || null,
      estimatedBandwidth: null,
      variantBitrate: null,
      loadLatency: null,
      droppedFrames: finite(
        this.video.getVideoPlaybackQuality?.().droppedVideoFrames,
      ),
    };
  }
  getSeekRange() {
    const ranges = readRanges(this.video.seekable);
    return {
      start: ranges[0]?.[0] ?? 0,
      end: ranges.at(-1)?.[1] ?? 0,
      live: this.video.duration === Infinity,
    };
  }
  destroy() {
    this.cancelLoad?.();
    this.video.pause();
    this.video.removeAttribute("src");
    this.video.load();
  }
}
