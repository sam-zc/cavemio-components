import type { CSSProperties, ReactNode } from "react";
import type shaka from "shaka-player";

export type VideoFormat = "hls" | "dash" | "mp4";
export type VideoEngine = "shaka" | "hls" | "native";
/** Shaka's installed configuration types, with partial nested configuration. */
export type VideoDrm = Omit<
  Partial<shaka.extern.DrmConfiguration>,
  "advanced"
> & {
  advanced?: Record<string, Partial<shaka.extern.AdvancedDrmConfiguration>>;
};
export interface VideoSource {
  src: string;
  type?: VideoFormat;
  poster?: string;
  drm?: VideoDrm;
}
export interface VideoQuality {
  id: string;
  label: string;
  width: number;
  height: number;
  bitrate: number;
  active: boolean;
}
export interface VideoTrack {
  id: string;
  label: string;
  language: string;
  active: boolean;
}
export interface PlayerError {
  code: string;
  category:
    "network" | "media" | "drm" | "permission" | "unsupported" | "unknown";
  message: string;
  fatal: boolean;
  retryable: boolean;
}
export interface PlaybackStats {
  width: number | null;
  height: number | null;
  estimatedBandwidth: number | null;
  variantBitrate: number | null;
  droppedFrames: number | null;
  loadLatency: number | null;
}
export interface PlayerCapabilities {
  quality: boolean;
  audio: boolean;
  captions: boolean;
  drm: boolean;
}
export type PlayerEvent =
  | { type: "loading" | "manifest" | "tracks" | "quality" | "recovery" }
  | { type: "buffering"; buffering: boolean }
  | { type: "error"; error: PlayerError };
export interface PlayerAdapter {
  readonly engine: VideoEngine;
  readonly capabilities: PlayerCapabilities;
  load(source: VideoSource, startTime?: number): Promise<void>;
  getQualities(): VideoQuality[];
  setQuality(id: string): void;
  getAudioTracks(): VideoTrack[];
  setAudioTrack(id: string): void;
  getTextTracks(): VideoTrack[];
  setTextTrack(id: string): void;
  getStats(): PlaybackStats;
  getSeekRange(): { start: number; end: number; live: boolean };
  destroy(): Promise<void> | void;
}
export interface VideoPlayerHandle {
  play(): Promise<void>;
  pause(): void;
  seek(time: number): void;
  setQuality(id: string): void;
  setAudioTrack(id: string): void;
  setTextTrack(id: string): void;
  setVolume(volume: number): void;
  toggleMute(): void;
  setPlaybackRate(rate: number): void;
  retry(): void;
}
export interface VideoPlayerProps {
  src?: string;
  source?: VideoSource;
  type?: VideoFormat;
  engine?: VideoEngine;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  /** Controlled intent. Pair with onPlayingChange; actual state follows media events. */
  playing?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  controls?: boolean;
  enableGooey?: boolean;
  enableAnimations?: boolean;
  enableDiagnostics?: boolean;
  enablePictureInPicture?: boolean;
  enableFullscreen?: boolean;
  /** May force reduced motion, but never overrides the user's OS preference. */
  reducedMotion?: boolean;
  onReady?: (player: VideoPlayerHandle) => void;
  onError?: (error: PlayerError) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
