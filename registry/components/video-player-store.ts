import type {
  PlayerAdapter,
  PlayerCapabilities,
  PlayerError,
  PlayerEvent,
  PlaybackStats,
  VideoEngine,
  VideoPlayerHandle,
  VideoQuality,
  VideoSource,
  VideoTrack,
} from "./video-player-types";
import {
  bufferAt,
  clampSeek,
  detectVideoFormat,
  playerError,
  readRanges,
  supportsSource,
  unsupportedError,
} from "./video-player-utils";

export interface VideoState {
  ready: boolean;
  paused: boolean;
  buffering: boolean;
  ended: boolean;
  time: number;
  duration: number;
  volume: number;
  muted: boolean;
  rate: number;
  range: { start: number; end: number; live: boolean };
  buffered: [number, number][];
  engine: VideoEngine | null;
  capabilities: PlayerCapabilities;
  qualities: VideoQuality[];
  audio: VideoTrack[];
  captions: VideoTrack[];
  selectedQuality: string;
  error: PlayerError | null;
  notice: string;
}
export interface VideoDiagnostics {
  stats: PlaybackStats | null;
  bufferAhead: number;
  bufferBehind: number;
  stalls: number;
  bufferingSeconds: number;
  startupSeconds: number | null;
  latestError: PlayerError | null;
  events: { at: number; event: string; detail?: string }[];
}
const initialState = (): VideoState => ({
  ready: false,
  paused: true,
  buffering: false,
  ended: false,
  time: 0,
  duration: 0,
  volume: 1,
  muted: false,
  rate: 1,
  range: { start: 0, end: 0, live: false },
  buffered: [],
  engine: null,
  capabilities: { quality: false, audio: false, captions: false, drm: false },
  qualities: [],
  audio: [],
  captions: [],
  selectedQuality: "auto",
  error: null,
  notice: "",
});

/** One store per persistent video. All engine ownership changes pass through queue. */
export class VideoPlayerStore implements VideoPlayerHandle {
  private state = initialState();
  private diagnostics: VideoDiagnostics = {
    stats: null,
    bufferAhead: 0,
    bufferBehind: 0,
    stalls: 0,
    bufferingSeconds: 0,
    startupSeconds: null,
    latestError: null,
    events: [],
  };
  private listeners = new Set<() => void>();
  private metricsListeners = new Set<() => void>();
  private adapter: PlayerAdapter | null = null;
  private video: HTMLVideoElement | null = null;
  private queue: Promise<void> = Promise.resolve();
  private generation = 0;
  private source?: VideoSource;
  private requestedEngine: VideoEngine = "shaka";
  private previousVolume = 1;
  private lastTick = 0;
  private loadStarted = 0;
  private bufferStarted: number | null = null;
  private played = false;
  private metricsTimer?: ReturnType<typeof setInterval>;
  private removeMediaListeners?: () => void;
  callbacks: {
    onReady?: (handle: VideoPlayerHandle) => void;
    onError?: (error: PlayerError) => void;
    onPlayingChange?: (playing: boolean) => void;
  } = {};
  getSnapshot = () => this.state;
  getDiagnostics = () => this.diagnostics;
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
  subscribeDiagnostics = (fn: () => void) => {
    this.metricsListeners.add(fn);
    if (!this.metricsTimer)
      this.metricsTimer = setInterval(() => {
        if (typeof document !== "undefined" && !document.hidden) this.sample();
      }, 1000);
    return () => {
      this.metricsListeners.delete(fn);
      if (!this.metricsListeners.size) {
        clearInterval(this.metricsTimer);
        this.metricsTimer = undefined;
      }
    };
  };
  private patch(patch: Partial<VideoState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((fn) => fn());
  }
  private log(event: string, detail?: string) {
    this.diagnostics = {
      ...this.diagnostics,
      events: [
        ...this.diagnostics.events.slice(-59),
        {
          at: Math.round(performance.now() - this.loadStarted),
          event,
          ...(detail ? { detail } : {}),
        },
      ],
    };
    this.metricsListeners.forEach((fn) => fn());
  }
  private setBuffering(buffering: boolean) {
    if (buffering === this.state.buffering) return;
    if (buffering) {
      this.bufferStarted = performance.now();
      if (this.played && !this.video?.paused && !this.video?.seeking)
        this.diagnostics = {
          ...this.diagnostics,
          stalls: this.diagnostics.stalls + 1,
        };
    } else if (this.bufferStarted !== null) {
      this.diagnostics = {
        ...this.diagnostics,
        bufferingSeconds:
          this.diagnostics.bufferingSeconds +
          (performance.now() - this.bufferStarted) / 1000,
      };
      this.bufferStarted = null;
    }
    this.patch({ buffering });
    this.log(buffering ? "Buffering started" : "Buffering ended");
  }
  private fail(error: PlayerError) {
    this.diagnostics = { ...this.diagnostics, latestError: error };
    this.log(
      error.fatal
        ? "Fatal playback error"
        : error.category === "network"
          ? "Network error"
          : "Playback warning",
      error.code,
    );
    if (error.fatal) {
      this.setBuffering(false);
      this.patch({ error });
    }
    this.callbacks.onError?.(error);
  }
  private refreshTracks() {
    if (!this.adapter) return;
    this.patch({
      qualities: this.adapter.getQualities(),
      audio: this.adapter.getAudioTracks(),
      captions: this.adapter.getTextTracks(),
    });
  }
  private engineEvent = (event: PlayerEvent) => {
    if (event.type === "error") {
      this.fail(event.error);
      return;
    }
    if (event.type === "buffering") {
      this.setBuffering(event.buffering);
      return;
    }
    if (event.type === "loading") this.log("Manifest loading");
    if (event.type === "manifest") this.log("Manifest parsed");
    if (event.type === "recovery") this.log("Recovery attempted");
    if (["manifest", "tracks", "quality"].includes(event.type))
      this.refreshTracks();
    if (event.type === "quality")
      this.log(
        "Quality switched",
        this.state.qualities.find((q) => q.active)?.label,
      );
  };
  bind(video: HTMLVideoElement) {
    this.video = video;
    const update = () => {
      const range = this.adapter?.getSeekRange() ?? {
        start: 0,
        end: 0,
        live: false,
      };
      this.patch({
        time: video.currentTime,
        duration: Number.isFinite(video.duration) ? video.duration : 0,
        paused: video.paused,
        ended: video.ended,
        volume: video.volume,
        muted: video.muted,
        rate: video.playbackRate,
        buffered: readRanges(video.buffered),
        range,
      });
    };
    const tick = () => {
      if (performance.now() - this.lastTick > 200) {
        this.lastTick = performance.now();
        update();
      }
    };
    const played = () => {
      this.setBuffering(false);
      if (!this.played)
        this.diagnostics = {
          ...this.diagnostics,
          startupSeconds: (performance.now() - this.loadStarted) / 1000,
        };
      this.played = true;
      this.patch({ error: null, notice: "" });
      this.log("Playback started");
      update();
    };
    const onPlay = () => {
      update();
      this.callbacks.onPlayingChange?.(true);
    };
    const onPause = () => {
      this.setBuffering(false);
      update();
      this.callbacks.onPlayingChange?.(false);
    };
    const listeners: [string, EventListener][] = [
      ["timeupdate", tick],
      ["progress", tick],
      ["durationchange", update],
      ["loadedmetadata", update],
      ["volumechange", update],
      ["ratechange", update],
      ["play", onPlay],
      ["pause", onPause],
      ["playing", played],
      ["ended", onPause],
      ["waiting", () => this.setBuffering(true)],
      [
        "seeking",
        () => {
          update();
          if (!video.paused) this.setBuffering(true);
        },
      ],
      [
        "seeked",
        () => {
          update();
          if (video.readyState >= 3) this.setBuffering(false);
        },
      ],
      [
        "canplay",
        () => {
          this.setBuffering(false);
          update();
        },
      ],
      [
        "error",
        () => {
          if (video.error && this.adapter?.engine === "native")
            this.fail(playerError({ category: 3, code: video.error.code }));
        },
      ],
    ];
    listeners.forEach(([name, fn]) => video.addEventListener(name, fn));
    this.removeMediaListeners = () =>
      listeners.forEach(([name, fn]) => video.removeEventListener(name, fn));
    update();
  }
  async load(source: VideoSource, engine: VideoEngine, resume = false) {
    const generation = ++this.generation;
    const position = resume ? this.video?.currentTime : undefined;
    const wasPlaying = resume && !this.video?.paused;
    this.source = source;
    this.requestedEngine = engine;
    this.queue = this.queue
      .then(async () => {
        // Teardown must settle before a different engine is constructed/attached.
        if (this.adapter) {
          const old = this.adapter;
          this.adapter = null;
          await old.destroy();
        }
        if (generation !== this.generation || !this.video) return;
        this.state = {
          ...initialState(),
          volume: this.video.volume,
          muted: this.video.muted,
          rate: this.video.playbackRate,
        };
        this.loadStarted = performance.now();
        this.played = false;
        this.bufferStarted = null;
        this.diagnostics = {
          stats: null,
          bufferAhead: 0,
          bufferBehind: 0,
          stalls: 0,
          bufferingSeconds: 0,
          startupSeconds: null,
          latestError: null,
          events: [],
        };
        this.patch({ buffering: true });
        this.bufferStarted = performance.now();
        if (
          !source.src.trim() ||
          !supportsSource(
            engine,
            detectVideoFormat(source.src, source.type),
            !!source.drm,
          )
        ) {
          this.fail(
            unsupportedError(
              "Choose Shaka for DASH or protected content; HLS.js accepts HLS sources only.",
            ),
          );
          return;
        }
        const emit = (event: PlayerEvent) => {
          if (generation === this.generation) this.engineEvent(event);
        };
        let factory: () => PlayerAdapter;
        if (engine === "shaka") {
          const { ShakaAdapter } = await import("./video-player-shaka");
          factory = () => new ShakaAdapter(this.video!, emit);
        } else if (engine === "hls") {
          const { createHlsAdapter } = await import("./video-player-hls");
          factory = () => createHlsAdapter(this.video!, emit);
        } else {
          const { NativeAdapter } = await import("./video-player-native");
          factory = () => new NativeAdapter(this.video!, emit);
        }
        if (generation !== this.generation || !this.video) return;
        const adapter = factory();
        this.adapter = adapter;
        this.patch({
          engine: adapter.engine,
          capabilities: adapter.capabilities,
        });
        // Do not block teardown behind network loading. destroy() cancels load().
        void adapter
          .load(source, position)
          .then(() => {
            if (generation !== this.generation) return;
            this.refreshTracks();
            this.patch({ ready: true });
            this.callbacks.onReady?.(this);
            if (wasPlaying) void this.play().catch(() => {});
          })
          .catch((error: unknown) => {
            if (generation === this.generation) this.fail(playerError(error));
          });
      })
      .catch((error: unknown) => {
        if (generation === this.generation) this.fail(playerError(error));
      });
    await this.queue;
  }
  unbind() {
    ++this.generation;
    this.removeMediaListeners?.();
    this.removeMediaListeners = undefined;
    this.video = null;
    clearInterval(this.metricsTimer);
    this.metricsTimer = undefined;
    this.queue = this.queue.then(async () => {
      if (this.adapter) {
        const old = this.adapter;
        this.adapter = null;
        await old.destroy();
      }
    });
    // Observe cleanup rejections; the queue stays rejected to prevent unsafe reattachment.
    void this.queue.catch(() => {});
  }
  async play() {
    if (!this.video) return;
    const generation = this.generation;
    try {
      await this.video.play();
    } catch (error) {
      if (generation !== this.generation) return;
      const normalized = playerError(error, false);
      this.patch({ notice: normalized.message });
      this.fail(normalized);
      throw error;
    }
  }
  pause() {
    this.video?.pause();
  }
  seek(time: number) {
    if (!this.video || !this.adapter) return;
    const { start, end } = this.adapter.getSeekRange();
    if (end > start) this.video.currentTime = clampSeek(time, start, end);
  }
  setVolume(volume: number) {
    if (!this.video || !Number.isFinite(volume)) return;
    try {
      this.video.volume = Math.min(1, Math.max(0, volume));
      this.video.muted = volume === 0;
      if (volume > 0) this.previousVolume = volume;
    } catch {
      this.patch({ notice: "Use your device volume buttons." });
    }
    if (Math.abs(this.video.volume - Math.min(1, Math.max(0, volume))) > 0.01)
      this.patch({ notice: "Use your device volume buttons." });
  }
  toggleMute() {
    if (!this.video) return;
    if (this.video.muted || this.video.volume === 0) {
      this.setVolume(this.previousVolume);
      this.video.muted = false;
    } else {
      this.previousVolume = this.video.volume;
      this.video.muted = true;
    }
  }
  setPlaybackRate(rate: number) {
    if (!this.video || ![0.5, 0.75, 1, 1.25, 1.5, 2].includes(rate)) return;
    try {
      this.video.playbackRate = rate;
    } catch {
      this.patch({ notice: "This playback speed is unavailable." });
    }
  }
  setQuality(id: string) {
    if (
      !this.adapter?.capabilities.quality ||
      (id !== "auto" && !this.state.qualities.some((q) => q.id === id))
    )
      return;
    this.adapter.setQuality(id);
    this.patch({ selectedQuality: id });
    this.refreshTracks();
    this.log(
      "Quality requested",
      id === "auto"
        ? "Auto"
        : this.state.qualities.find((q) => q.id === id)?.label,
    );
  }
  setAudioTrack(id: string) {
    this.adapter?.setAudioTrack(id);
    this.refreshTracks();
    this.setQuality("auto");
  }
  setTextTrack(id: string) {
    this.adapter?.setTextTrack(id);
    this.refreshTracks();
  }
  retry() {
    if (this.source) {
      this.log("Recovery attempted");
      void this.load(this.source, this.requestedEngine, true);
    }
  }
  private sample() {
    if (!this.video) return;
    const buffer = bufferAt(
      readRanges(this.video.buffered),
      this.video.currentTime,
    );
    this.diagnostics = {
      ...this.diagnostics,
      stats: this.adapter?.getStats() ?? null,
      bufferAhead: buffer.ahead,
      bufferBehind: buffer.behind,
    };
    this.metricsListeners.forEach((fn) => fn());
  }
  exportDiagnostics() {
    this.sample();
    // Whitelist only normalized values. Never serialize source/config/raw engine errors.
    return JSON.stringify(
      {
        version: 1,
        engine: this.state.engine,
        format: this.source
          ? detectVideoFormat(this.source.src, this.source.type)
          : null,
        playbackRate: this.state.rate,
        abr: this.state.capabilities.quality
          ? this.state.selectedQuality === "auto"
          : null,
        ...this.diagnostics,
        bufferingSeconds: this.bufferingSeconds(),
      },
      null,
      2,
    );
  }
  bufferingSeconds() {
    return (
      this.diagnostics.bufferingSeconds +
      (this.bufferStarted !== null
        ? (performance.now() - this.bufferStarted) / 1000
        : 0)
    );
  }
}
