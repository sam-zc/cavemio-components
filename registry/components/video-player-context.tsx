"use client";
import {
  createContext,
  useContext,
  useSyncExternalStore,
  type RefObject,
} from "react";
import { VideoPlayerStore, type VideoState } from "./video-player-store";

export interface VideoPlayerContextValue {
  store: VideoPlayerStore;
  video: RefObject<HTMLVideoElement | null>;
  frame: RefObject<HTMLDivElement | null>;
  animated: boolean;
  gooey: boolean;
  expanded: boolean;
  fullscreen: boolean;
  pip: boolean;
  canFullscreen: boolean;
  canExpand: boolean;
  canPip: boolean;
  togglePlayback(): void;
  toggleExpanded(): void;
  toggleFullscreen(): void;
  togglePip(): void;
}
export const VideoPlayerContext = createContext<VideoPlayerContextValue | null>(
  null,
);
export function useVideoPlayer() {
  const context = useContext(VideoPlayerContext);
  if (!context)
    throw new Error("Video controls must be rendered inside VideoPlayer.");
  return context;
}
/** Select a stable value/field; time updates do not re-render unrelated controls. */
export function useVideoState<T>(selector: (state: VideoState) => T): T {
  const { store } = useVideoPlayer();
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getSnapshot()),
    () => selector(store.getSnapshot()),
  );
}
