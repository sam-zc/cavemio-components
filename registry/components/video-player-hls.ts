import Hls from "hls.js";
import type {
  PlayerAdapter,
  PlayerEvent,
  VideoSource,
} from "./video-player-types";
import { NativeAdapter } from "./video-player-native";
import { finite, normalizeQualities, playerError } from "./video-player-utils";

export function createHlsAdapter(
  video: HTMLVideoElement,
  emit: (event: PlayerEvent) => void,
): PlayerAdapter {
  if (Hls.isSupported()) return new HlsAdapter(video, emit);
  if (video.canPlayType("application/vnd.apple.mpegurl"))
    return new NativeAdapter(video, emit);
  throw new DOMException("HLS is unavailable", "NotSupportedError");
}
class HlsAdapter implements PlayerAdapter {
  readonly engine = "hls" as const;
  readonly capabilities = {
    quality: true,
    audio: true,
    captions: true,
    drm: false,
  };
  private hls: Hls;
  private recoveries = 0;
  private timer?: ReturnType<typeof setTimeout>;
  private cancelLoad?: () => void;
  private latency: number | null = null;
  constructor(
    private video: HTMLVideoElement,
    private emit: (event: PlayerEvent) => void,
  ) {
    this.hls = new Hls({
      maxBufferLength: 30,
      backBufferLength: 30,
      autoStartLoad: false,
    });
    this.hls.on(Hls.Events.LEVEL_SWITCHED, () => emit({ type: "quality" }));
    for (const name of [
      Hls.Events.AUDIO_TRACKS_UPDATED,
      Hls.Events.AUDIO_TRACK_SWITCHED,
      Hls.Events.SUBTITLE_TRACKS_UPDATED,
      Hls.Events.SUBTITLE_TRACK_SWITCH,
    ])
      this.hls.on(name, () => emit({ type: "tracks" }));
    this.hls.on(Hls.Events.ERROR, (_, data) => {
      const error = playerError(
        { category: data.type === Hls.ErrorTypes.NETWORK_ERROR ? 1 : 3 },
        data.fatal,
      );
      if (
        data.fatal &&
        this.recoveries < 2 &&
        [Hls.ErrorTypes.NETWORK_ERROR, Hls.ErrorTypes.MEDIA_ERROR].includes(
          data.type,
        )
      ) {
        this.recoveries++;
        emit({ type: "error", error: { ...error, fatal: false } });
        clearTimeout(this.timer);
        this.timer = setTimeout(
          () => {
            emit({ type: "recovery" });
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR)
              this.hls.startLoad();
            else this.hls.recoverMediaError();
          },
          1000 * 2 ** (this.recoveries - 1),
        );
      } else emit({ type: "error", error });
    });
  }
  load(source: VideoSource, startTime?: number): Promise<void> {
    this.emit({ type: "loading" });
    const start = performance.now();
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timeout);
        this.hls.off(Hls.Events.MANIFEST_PARSED, ready);
        this.hls.off(Hls.Events.ERROR, fail);
        this.cancelLoad = undefined;
      };
      const ready = () => {
        cleanup();
        this.latency = (performance.now() - start) / 1000;
        this.emit({ type: "manifest" });
        this.hls.startLoad(startTime ?? -1);
        resolve();
      };
      const fail = (_: unknown, data: { fatal: boolean }) => {
        if (data.fatal && this.recoveries >= 2) {
          cleanup();
          reject({ category: 1 });
        }
      };
      const timeout = setTimeout(() => {
        cleanup();
        reject({ category: 1 });
      }, 45000);
      this.cancelLoad = () => {
        cleanup();
        reject(new DOMException("Cancelled", "AbortError"));
      };
      this.hls.on(Hls.Events.MANIFEST_PARSED, ready);
      this.hls.on(Hls.Events.ERROR, fail);
      this.hls.attachMedia(this.video);
      this.hls.loadSource(source.src);
    });
  }
  getQualities() {
    return normalizeQualities(
      this.hls.levels.map((l, i) => ({
        id: String(i),
        label: `${l.height}p · ${(l.bitrate / 1e6).toFixed(1)} Mbps`,
        width: l.width,
        height: l.height,
        bitrate: l.bitrate,
        active: this.hls.currentLevel === i,
      })),
    );
  }
  setQuality(id: string) {
    this.hls.nextLevel = id === "auto" ? -1 : Number(id);
  }
  getAudioTracks() {
    return this.hls.audioTracks.map((t, i) => ({
      id: String(i),
      label: t.name || t.lang || `Audio ${i + 1}`,
      language: t.lang ?? "",
      active: this.hls.audioTrack === i,
    }));
  }
  setAudioTrack(id: string) {
    this.hls.audioTrack = Number(id);
  }
  getTextTracks() {
    return this.hls.subtitleTracks.map((t, i) => ({
      id: String(i),
      label: t.name || t.lang || `Track ${i + 1}`,
      language: t.lang ?? "",
      active: this.hls.subtitleTrack === i && this.hls.subtitleDisplay,
    }));
  }
  setTextTrack(id: string) {
    this.hls.subtitleTrack = id === "off" ? -1 : Number(id);
    this.hls.subtitleDisplay = id !== "off";
  }
  getSeekRange() {
    const ranges = this.video.seekable;
    return {
      start: ranges.length ? ranges.start(0) : 0,
      end: ranges.length ? ranges.end(ranges.length - 1) : 0,
      live: this.hls.levels[this.hls.currentLevel]?.details?.live ?? false,
    };
  }
  getStats() {
    return {
      width: this.video.videoWidth || null,
      height: this.video.videoHeight || null,
      estimatedBandwidth: finite(this.hls.bandwidthEstimate),
      variantBitrate: finite(this.hls.levels[this.hls.currentLevel]?.bitrate),
      droppedFrames: finite(
        this.video.getVideoPlaybackQuality?.().droppedVideoFrames,
      ),
      loadLatency: this.latency,
    };
  }
  destroy() {
    clearTimeout(this.timer);
    this.cancelLoad?.();
    this.hls.destroy();
    this.video.removeAttribute("src");
    this.video.load();
  }
}
