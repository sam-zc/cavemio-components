import { useId, useState } from "react";
import {
  VideoPlayer,
  useVideoState,
  type VideoSource,
} from "../registry/components/video-player";
import type { VideoEngine } from "../registry/components/video-player-types";
import { PrimitiveTabs } from "./primitive-tabs";

export const videoSamples: Record<string, VideoSource> = {
  mux: {
    src: "https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8",
    type: "hls",
    poster:
      "https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=20",
  },
  dash: {
    src: "https://storage.googleapis.com/shaka-demo-assets/sintel/dash.mpd",
    type: "dash",
    poster: "https://storage.googleapis.com/shaka-asset-icons/sintel.png",
  },
  hls: {
    src: "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8",
    type: "hls",
    poster: "https://storage.googleapis.com/shaka-asset-icons/angel_one.png",
  },
  mp4: {
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    type: "mp4",
  },
  widevine: {
    src: "https://storage.googleapis.com/shaka-demo-assets/sintel-widevine/dash.mpd",
    type: "dash",
    poster: "https://storage.googleapis.com/shaka-asset-icons/sintel.png",
    drm: {
      servers: {
        "com.widevine.alpha": "https://cwip-shaka-proxy.appspot.com/no_auth",
      },
    },
  },
  clearkey: {
    src: "https://storage.googleapis.com/shaka-demo-assets/angel-one-clearkey/dash.mpd",
    type: "dash",
    drm: {
      servers: {
        "org.w3.clearkey":
          "https://cwip-shaka-proxy.appspot.com/clearkey?_u3wDe7erb7v8Lqt8A3QDQ=ABEiM0RVZneImaq7zN3u_w",
      },
    },
  },
};
const demos = [
  { value: "animated", label: "Player" },
  { value: "formats", label: "Formats" },
  { value: "quality", label: "Quality" },
  { value: "diagnostics", label: "Diagnostics" },
  { value: "engines", label: "Engines" },
  { value: "motion", label: "Motion" },
  { value: "drm", label: "DRM" },
];
const field =
  "min-h-11 rounded-lg border border-border bg-background px-3 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-ring";
export function VideoPlayerDemo({
  initialDemo = "animated",
  initialFormat = "mux",
  initialEngine = "shaka",
}: {
  initialDemo?: string;
  initialFormat?: string;
  initialEngine?: VideoEngine;
}) {
  const [demo, setDemo] = useState(initialDemo),
    [format, setFormat] = useState(initialFormat),
    [engine, setEngine] = useState<VideoEngine>(initialEngine);
  const [gooey, setGooey] = useState(true),
    [motion, setMotion] = useState(true),
    [reduced, setReduced] = useState(false),
    [drm, setDrm] = useState("widevine"),
    [testDrm, setTestDrm] = useState(false);
  const [mounted, setMounted] = useState(true);
  const id = useId();
  const protectedDemo = demo === "drm" && testDrm;
  const sample = videoSamples[protectedDemo ? drm : format];
  const name = protectedDemo
    ? drm === "widevine"
      ? "Sintel · Widevine test"
      : "Angel One · Clear Key test"
    : format === "mux"
      ? "Sprite Fright"
      : format === "dash"
        ? "Sintel"
        : format === "hls"
          ? "Angel One"
          : "Big Buck Bunny";
  return (
    <div className="cavemio-demo flex w-full flex-col items-center gap-5 px-3 py-8 sm:px-6">
      <div className="video-player-demo-tabs relative flex h-11 max-w-full shrink-0 items-center overflow-x-auto">
        <PrimitiveTabs
          items={demos}
          value={demo}
          onChange={(next) => {
            setDemo(next);
            if (next !== "drm") setTestDrm(false);
          }}
          label="Video player examples"
          panelId={id}
        />
      </div>
      <div
        id={id}
        role="tabpanel"
        aria-labelledby={`${id}-${demo}`}
        className="w-full max-w-[900px]"
      >
        {mounted && (
          <VideoPlayer
            source={sample}
            engine={protectedDemo ? "shaka" : engine}
            title={name}
            muted
            enableGooey={gooey}
            enableAnimations={motion}
            reducedMotion={reduced}
            enableDiagnostics={[
              "quality",
              "diagnostics",
              "engines",
              "drm",
            ].includes(demo)}
          >
            {protectedDemo && <DrmStatus />}
          </VideoPlayer>
        )}
        {!["animated", "motion"].includes(demo) && (
          <span className="mt-4 inline-block rounded-full border border-border px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            {protectedDemo ? "Shaka" : engine === "hls" ? "HLS.js" : engine} /{" "}
            {sample.type}
          </span>
        )}
        {["formats", "quality", "engines"].includes(demo) && (
          <div className="mt-5 flex flex-wrap items-end gap-3 rounded-xl border border-border p-4">
            <label className="flex flex-col gap-2 text-[11px] text-muted-foreground">
              Source format
              <select
                aria-label="Source format"
                className={field}
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="mux">HLS · Sprite Fright</option>
                <option value="dash">MPEG-DASH · Sintel</option>
                <option value="hls">HLS · Angel One</option>
                <option value="mp4">MP4 · Big Buck Bunny</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-[11px] text-muted-foreground">
              Playback engine
              <select
                aria-label="Playback engine"
                className={field}
                value={engine}
                onChange={(e) => setEngine(e.target.value as VideoEngine)}
              >
                <option value="shaka">Shaka Player</option>
                <option value="hls">HLS.js · HLS only</option>
                <option value="native">Browser native</option>
              </select>
            </label>
            <p className="basis-full text-xs leading-relaxed text-muted-foreground">
              Use Playback settings → Quality to compare Auto with a fixed
              rendition. The engine reloads when changed and restores the
              timestamp when the source is unchanged. HLS.js cannot play DASH or
              this DRM example. Native HLS depends on the browser and reports
              limited metrics.
            </p>
          </div>
        )}
        {demo === "motion" && (
          <div className="mt-5 flex flex-wrap gap-5 rounded-xl border border-border p-4 text-xs">
            {(
              [
                ["Liquid surfaces", gooey, setGooey],
                ["GSAP motion", motion, setMotion],
                ["Reduced-motion preview", reduced, setReduced],
              ] as const
            ).map(([label, checked, set]) => (
              <label key={label} className="flex min-h-11 items-center gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => set(e.target.checked)}
                  className="accent-foreground"
                />
                {label}
              </label>
            ))}
            <p className="basis-full text-muted-foreground">
              Cinematic mode keeps the same video element. With motion off,
              expansion is immediate. The OS reduced-motion preference always
              takes precedence.
            </p>
          </div>
        )}
        {demo === "diagnostics" && (
          <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
            <button
              className={field}
              type="button"
              onClick={() => setMounted(!mounted)}
            >
              {mounted ? "Unmount player" : "Mount player"}
            </button>
            <span>
              Unmount to exercise cleanup. Hidden diagnostics stop metric
              polling.
            </span>
          </div>
        )}
        {demo === "drm" && (
          <div className="mt-5 space-y-3 rounded-xl border border-border p-4 text-xs leading-relaxed">
            <p>
              Optional EME test, using Shaka’s documented public assets.
              Widevine requires a compatible browser/CDM. Clear Key tests EME
              without a commercial CDM; it does not validate Widevine,
              PlayReady, or FairPlay.
            </p>
            <div className="flex flex-wrap gap-3">
              <select
                aria-label="DRM test system"
                className={field}
                value={drm}
                onChange={(e) => {
                  setDrm(e.target.value);
                  setTestDrm(false);
                }}
              >
                <option value="widevine">Widevine</option>
                <option value="clearkey">Clear Key</option>
              </select>
              <button
                type="button"
                className={field}
                onClick={() => setTestDrm(!testDrm)}
              >
                {testDrm ? "Return to clear video" : "Load protected test"}
              </button>
            </div>
            <p className="text-muted-foreground">
              HTTPS or localhost is required. Press play after loading. License
              endpoint availability and device support vary. No private
              credentials are bundled.
            </p>
          </div>
        )}
        <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground">
          {format !== "hls" && (
            <>
              <a
                href={
                  format === "mux"
                    ? "https://studio.blender.org/projects/sprite-fright/pages/about/"
                    : "https://studio.blender.org/films/"
                }
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
              >
                Film: Blender Foundation
              </a>{" "}
              · {format === "mux" ? "CC BY" : "CC BY 3.0"} ·{" "}
            </>
          )}
          Public test streams are requested from their original hosts.{" "}
          <a
            href="https://shaka-player-demo.appspot.com/demo/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            Shaka test catalog
          </a>
        </p>
      </div>
    </div>
  );
}
function DrmStatus() {
  const paused = useVideoState((s) => s.paused),
    time = useVideoState((s) => s.time),
    error = useVideoState((s) => s.error);
  return (
    <p
      role="status"
      className="absolute left-4 top-4 rounded-lg bg-black/80 px-3 py-2 text-[10px] text-white"
    >
      {error
        ? "Protected playback failed"
        : !paused && time > 0
          ? "Protected stream is playing"
          : "Protected playback has not been verified"}
    </p>
  );
}
