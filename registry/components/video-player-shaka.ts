import shaka from "shaka-player";
import type {
  PlayerAdapter,
  PlayerEvent,
  VideoSource,
} from "./video-player-types";
import { finite, normalizeQualities, playerError } from "./video-player-utils";

/** Imported only after mount and only for the selected engine. No Shaka UI bundle. */
export class ShakaAdapter implements PlayerAdapter {
  readonly engine = "shaka" as const;
  readonly capabilities = {
    quality: true,
    audio: true,
    captions: true,
    drm: true,
  };
  private player: shaka.Player;
  private destroyed = false;
  constructor(
    private video: HTMLVideoElement,
    private emit: (event: PlayerEvent) => void,
  ) {
    shaka.polyfill.installAll();
    if (!shaka.Player.isBrowserSupported())
      throw new DOMException("Unsupported browser", "NotSupportedError");
    this.player = new shaka.Player();
    this.player.addEventListener("error", (event) => {
      const detail = (event as CustomEvent<shaka.util.Error>).detail;
      emit({
        type: "error",
        error: playerError(
          detail,
          detail.severity === shaka.util.Error.Severity.CRITICAL,
        ),
      });
    });
    this.player.addEventListener("buffering", (event) =>
      emit({
        type: "buffering",
        buffering: (event as unknown as { buffering: boolean }).buffering,
      }),
    );
    for (const name of ["adaptation", "variantchanged"])
      this.player.addEventListener(name, () => emit({ type: "quality" }));
    for (const name of [
      "trackschanged",
      "textchanged",
      "texttrackvisibility",
      "audiochanged",
    ])
      this.player.addEventListener(name, () => emit({ type: "tracks" }));
    this.player.addEventListener("retry", () => emit({ type: "recovery" }));
  }
  async load(source: VideoSource, startTime?: number) {
    this.emit({ type: "loading" });
    await this.player.attach(this.video);
    if (this.destroyed) return;
    const retry = {
      maxAttempts: 3,
      baseDelay: 1000,
      backoffFactor: 2,
      timeout: 20000,
    };
    this.player.configure({
      streaming: {
        bufferingGoal: 30,
        rebufferingGoal: 2,
        bufferBehind: 30,
        retryParameters: retry,
      },
      manifest: { retryParameters: retry },
      drm: {
        ...source.drm,
        retryParameters: { ...retry, ...source.drm?.retryParameters },
      },
    });
    await this.player.load(source.src, startTime);
    if (!this.destroyed) this.emit({ type: "manifest" });
  }
  getQualities() {
    const tracks = this.player.getVariantTracks();
    const active = tracks.find((t) => t.active);
    // Do not accidentally change language/audio role while selecting a resolution.
    return normalizeQualities(
      tracks
        .filter(
          (t) =>
            !active ||
            (t.language === active.language && t.audioId === active.audioId),
        )
        .map((t) => ({
          id: String(t.id),
          label: `${t.height ? `${t.height}p` : "Audio"} · ${(t.bandwidth / 1e6).toFixed(1)} Mbps`,
          width: t.width ?? 0,
          height: t.height ?? 0,
          bitrate: t.bandwidth,
          active: t.active,
        })),
    );
  }
  setQuality(id: string) {
    if (id === "auto") {
      this.player.configure({ abr: { enabled: true } });
      return;
    }
    const track = this.player
      .getVariantTracks()
      .find((t) => String(t.id) === id);
    if (!track) return;
    this.player.configure({ abr: { enabled: false } });
    this.player.selectVariantTrack(track, false);
  }
  getAudioTracks() {
    return this.player.getAudioTracks().map((t) => ({
      id: String(t.id),
      label: t.label || t.language || `Audio ${t.id}`,
      language: t.language,
      active: t.active,
    }));
  }
  setAudioTrack(id: string) {
    const track = this.player.getAudioTracks().find((t) => String(t.id) === id);
    if (track) this.player.selectAudioTrack(track);
  }
  getTextTracks() {
    return this.player.getTextTracks().map((t) => ({
      id: String(t.id),
      label: t.label || t.language || `Track ${t.id}`,
      language: t.language,
      active: t.active,
    }));
  }
  setTextTrack(id: string) {
    const track = this.player.getTextTracks().find((t) => String(t.id) === id);
    this.player.selectTextTrack(id === "off" ? null : track);
  }
  getSeekRange() {
    return { ...this.player.seekRange(), live: this.player.isLive() };
  }
  getStats() {
    const s = this.player.getStats();
    return {
      width: finite(this.video.videoWidth),
      height: finite(this.video.videoHeight),
      estimatedBandwidth: finite(s.estimatedBandwidth),
      variantBitrate: finite(s.streamBandwidth),
      droppedFrames: finite(s.droppedFrames),
      loadLatency: finite(s.loadLatency),
    };
  }
  async destroy() {
    this.destroyed = true;
    await this.player.destroy();
  }
}
