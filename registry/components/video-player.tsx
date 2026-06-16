"use client";

import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { VideoPlayerContext } from "./video-player-context";
import { VideoPlayerStore } from "./video-player-store";
import { VideoControls, VideoStatus } from "./video-player-controls";
import {
  useVideoExpansion,
  useVideoReducedMotion,
} from "./video-player-motion";
import type { VideoPlayerProps } from "./video-player-types";

export type {
  VideoPlayerProps,
  VideoSource,
  VideoDrm,
  VideoQuality,
  VideoPlayerHandle,
  PlayerError,
} from "./video-player-types";
export { useVideoPlayer, useVideoState } from "./video-player-context";
export {
  VideoControls,
  VideoSeekbar,
  VideoPlayButton,
  VideoSettings,
  VideoVolume,
} from "./video-player-controls";
const Diagnostics = lazy(() => import("./video-player-diagnostics"));

export function VideoPlayer({
  src,
  source,
  type,
  engine = "shaka",
  poster,
  title = "Video",
  autoPlay = false,
  muted = false,
  loop = false,
  playing,
  onPlayingChange,
  controls = true,
  enableGooey = true,
  enableAnimations = true,
  enableDiagnostics = false,
  enablePictureInPicture = true,
  enableFullscreen = true,
  reducedMotion = false,
  onReady,
  onError,
  className = "",
  style,
  children,
}: VideoPlayerProps) {
  const [store] = useState(() => new VideoPlayerStore());
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const placeholder = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [pip, setPip] = useState(false);
  const [support, setSupport] = useState({ fullscreen: false, pip: false });
  const [browserNotice, setBrowserNotice] = useState("");
  const reduced = useVideoReducedMotion(reducedMotion);
  const animated = enableAnimations && !reduced;
  const ready = useSyncExternalStore(
    store.subscribe,
    () => store.getSnapshot().ready,
    () => false,
  );
  const callbacks = useRef({
    playing,
    autoPlay,
    onReady,
    onError,
    onPlayingChange,
  });
  callbacks.current = { playing, autoPlay, onReady, onError, onPlayingChange };
  store.callbacks = {
    onReady: (handle) => {
      callbacks.current.onReady?.(handle);
      if (callbacks.current.playing ?? callbacks.current.autoPlay)
        void handle.play().catch(() => {});
    },
    onError: (error) => callbacks.current.onError?.(error),
    onPlayingChange: (value) => callbacks.current.onPlayingChange?.(value),
  };
  const mediaSource = useMemo(
    () => ({
      src: source?.src ?? src ?? "",
      type: source?.type ?? type,
      drm: source?.drm,
    }),
    [source?.src, source?.type, source?.drm, src, type],
  );
  const previousSource = useRef<string | null>(null);
  useEffect(() => {
    if (video.current) store.bind(video.current);
    return () => store.unbind();
  }, [store]);
  useEffect(() => {
    const sameSource = previousSource.current === mediaSource.src;
    previousSource.current = mediaSource.src;
    void store.load(mediaSource, engine, sameSource);
  }, [store, mediaSource, engine]);
  useEffect(() => {
    if (!ready || playing === undefined) return;
    if (playing) void store.play().catch(() => {});
    else store.pause();
  }, [playing, ready, store]);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const doc = el.ownerDocument;
    setSupport({
      fullscreen: !!doc.fullscreenEnabled && !!frame.current?.requestFullscreen,
      pip: !!doc.pictureInPictureEnabled && !!el.requestPictureInPicture,
    });
    const full = () => setFullscreen(doc.fullscreenElement === frame.current);
    const picture = () => setPip(doc.pictureInPictureElement === el);
    const failure = () =>
      setBrowserNotice("Fullscreen was not available. Try cinematic mode.");
    doc.addEventListener("fullscreenchange", full);
    doc.addEventListener("fullscreenerror", failure);
    el.addEventListener("enterpictureinpicture", picture);
    el.addEventListener("leavepictureinpicture", picture);
    return () => {
      doc.removeEventListener("fullscreenchange", full);
      doc.removeEventListener("fullscreenerror", failure);
      el.removeEventListener("enterpictureinpicture", picture);
      el.removeEventListener("leavepictureinpicture", picture);
    };
  }, []);
  const closeExpanded = useCallback(() => setExpanded(false), []);
  useVideoExpansion(frame, placeholder, expanded, animated, closeExpanded);
  const togglePlayback = useCallback(() => {
    const next = store.getSnapshot().paused;
    if (callbacks.current.playing !== undefined)
      callbacks.current.onPlayingChange?.(next);
    else if (next) void store.play().catch(() => {});
    else store.pause();
  }, [store]);
  const toggleFullscreen = useCallback(() => {
    const el = frame.current;
    if (!el || !enableFullscreen || !support.fullscreen) return;
    setBrowserNotice("");
    void (
      el.ownerDocument.fullscreenElement === el
        ? el.ownerDocument.exitFullscreen()
        : el.requestFullscreen()
    ).catch(() =>
      setBrowserNotice("Fullscreen was not available. Try cinematic mode."),
    );
  }, [enableFullscreen, support.fullscreen]);
  const togglePip = useCallback(() => {
    const el = video.current;
    if (!el || !enablePictureInPicture || !support.pip) return;
    setBrowserNotice("");
    void (
      el.ownerDocument.pictureInPictureElement === el
        ? el.ownerDocument.exitPictureInPicture()
        : el.requestPictureInPicture()
    ).catch(() =>
      setBrowserNotice(
        "Picture-in-picture is unavailable for this video or browser.",
      ),
    );
  }, [enablePictureInPicture, support.pip]);
  const toggleExpanded = useCallback(() => {
    if (!fullscreen) setExpanded((value) => (value ? false : enableFullscreen));
  }, [fullscreen, enableFullscreen]);
  const context = useMemo(
    () => ({
      store,
      video,
      frame,
      animated,
      gooey: enableGooey && !reduced,
      expanded,
      fullscreen,
      pip,
      canExpand: enableFullscreen,
      canFullscreen: enableFullscreen && support.fullscreen,
      canPip: enablePictureInPicture && support.pip,
      togglePlayback,
      toggleExpanded,
      toggleFullscreen,
      togglePip,
    }),
    [
      store,
      animated,
      enableGooey,
      reduced,
      expanded,
      fullscreen,
      pip,
      enableFullscreen,
      enablePictureInPicture,
      support,
      togglePlayback,
      toggleExpanded,
      toggleFullscreen,
      togglePip,
    ],
  );
  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.nativeEvent.isComposing
    )
      return;
    const key = event.key.toLowerCase();
    const mediaShortcut = key === "m" || key === "f";
    if (event.target instanceof HTMLElement && event.target !== frame.current) {
      if (
        event.target.closest(
          'select,textarea,input:not([type="range"]),[contenteditable="true"]',
        )
      )
        return;
      if (!mediaShortcut && event.target.closest('input,button,[role="menu"]'))
        return;
    }
    if (mediaShortcut && event.repeat) {
      event.preventDefault();
      return;
    }
    const state = store.getSnapshot();
    switch (key) {
      case " ":
      case "k":
        togglePlayback();
        break;
      case "arrowleft":
        store.seek(state.time - 5);
        break;
      case "arrowright":
        store.seek(state.time + 5);
        break;
      case "arrowup":
        store.setVolume(state.volume + 0.05);
        break;
      case "arrowdown":
        store.setVolume(state.volume - 0.05);
        break;
      case "m":
        store.toggleMute();
        break;
      case "f":
        if (fullscreen) toggleFullscreen();
        else toggleExpanded();
        break;
      case "c":
        store.setTextTrack(
          state.captions.some((t) => t.active)
            ? "off"
            : (state.captions[0]?.id ?? "off"),
        );
        break;
      default:
        return;
    }
    event.preventDefault();
  };
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const doc = el.ownerDocument;
    const hoverShortcut = (event: globalThis.KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (
        (key !== "m" && key !== "f") ||
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.isComposing ||
        !el.matches(":hover")
      )
        return;
      // Focused controls use the React handler; only body focus needs hover routing.
      if (event.target !== doc.body && event.target !== doc.documentElement)
        return;
      event.preventDefault();
      if (event.repeat) return;
      if (key === "m") store.toggleMute();
      else if (fullscreen) toggleFullscreen();
      else toggleExpanded();
    };
    doc.addEventListener("keydown", hoverShortcut);
    return () => doc.removeEventListener("keydown", hoverShortcut);
  }, [store, fullscreen, toggleFullscreen, toggleExpanded]);
  return (
    <VideoPlayerContext.Provider value={context}>
      <div
        className={`w-full min-w-0 ${className}`}
        style={style}
        data-video-player=""
      >
        <div
          ref={placeholder}
          className="@container/player-layout relative aspect-video w-full"
        >
          <div
            ref={frame}
            popover="manual"
            tabIndex={0}
            role={expanded ? "dialog" : "region"}
            aria-modal={expanded || undefined}
            aria-label={`${title} video player`}
            onKeyDown={keyboard}
            className="@container absolute inset-0 isolate m-0 block h-full w-full overflow-visible rounded-[20px] border-0 bg-black p-0 text-white outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::backdrop]:bg-black/70 [&::backdrop]:opacity-[var(--video-backdrop,0)]"
            style={{ display: "block", containerType: "size" }}
            data-expanded={expanded}
            data-motion={animated ? "full" : "reduced"}
          >
            <video
              ref={video}
              poster={source?.poster ?? poster}
              muted={muted}
              loop={loop}
              playsInline
              preload="metadata"
              aria-label={title}
              className="absolute inset-0 h-full w-full rounded-[inherit] object-cover"
            />
            <VideoStatus title={title} controls={controls} />
            {controls && <VideoControls />}
            {children}
            {expanded && !controls && (
              <button
                type="button"
                onClick={closeExpanded}
                className="absolute right-4 top-4 rounded-full bg-white/15 backdrop-blur-xl px-4 py-3 focus-visible:outline-2 focus-visible:outline-ring"
              >
                Close cinematic mode
              </button>
            )}
            <p
              role="status"
              className={
                browserNotice
                  ? "absolute left-4 top-4 max-w-[80%] rounded-lg bg-white/15 backdrop-blur-xl px-3 py-2 text-xs"
                  : "sr-only"
              }
            >
              {browserNotice}
            </p>
          </div>
        </div>
        {enableDiagnostics && (
          <Suspense
            fallback={
              <p className="p-3 text-xs text-muted-foreground">
                Loading diagnostics…
              </p>
            }
          >
            <Diagnostics format={mediaSource.type} src={mediaSource.src} />
          </Suspense>
        )}
      </div>
    </VideoPlayerContext.Provider>
  );
}
