# Animated Video Player

`VideoPlayer` is canonical source in `registry/components/video-player.tsx`. The eleven-file registry item includes its adapters, store, controls, motion, diagnostics, types and utilities. The seven examples in `preview/video-player-demo.tsx` are shared by Storybook and the website's HTTP preview bundle.

## Install and use

Requires React 19, TypeScript and Tailwind CSS 4 with the existing shadcn semantic theme variables. No extra global component CSS is required. Register the local namespace as described in the repository README, then:

```sh
npx shadcn@4.21.5 add @cavemio/video-player
# Or use the direct local registry URL after build + serve:
npx shadcn@4.21.5 add http://127.0.0.1:4001/r/cavemio-video-player.json
```

This is a project-configured namespace, not a claim of a published npm package. The installer supplies GSAP 3.15, Shaka Player 5.3, HLS.js 1.7 and Lucide. Source is MIT; dependencies retain their own licenses, including the GSAP Standard License.

```tsx
import { VideoPlayer } from "@/components/video-player";

<VideoPlayer
  src="https://storage.googleapis.com/shaka-demo-assets/sintel/dash.mpd"
  type="dash"
  title="Sintel"
  poster="https://storage.googleapis.com/shaka-asset-icons/sintel.png"
  muted
/>;
```

The reusable component contains no demo URLs. `source` takes precedence over `src`, `type` and `poster`. Supply an explicit type for extensionless or signed manifest endpoints. URL extension detection ignores queries and fragments; unrecognized extensions default to MP4.

```tsx
import { useState } from "react";
import { VideoPlayer } from "@/components/video-player";

export function ControlledVideo() {
  const [playing, setPlaying] = useState(false);
  return (
    <VideoPlayer
      src="https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8"
      type="hls"
      playing={playing}
      onPlayingChange={setPlaying}
      muted
    />
  );
}
```

Without `playing`, media controls own play/pause. With it, button/shortcut requests notify the caller and the prop drives playback; actual media events also notify the caller. Browser autoplay rejection remains possible and is announced without claiming playback started. `muted` is an initial/browser media preference; volume and mute controls remain local to the session.

## Public API

The complete types ship in `video-player-types.ts`; the catalog's Props section lists every component prop.

| Prop                                         | Default         | Meaning                                                             |
| -------------------------------------------- | --------------- | ------------------------------------------------------------------- |
| `src`, `type`                                | empty, inferred | Media URL and `hls`, `dash` or `mp4` hint                           |
| `source`                                     | absent          | `{ src, type?, poster?, drm? }`; overrides individual source fields |
| `engine`                                     | `shaka`         | `shaka`, `hls`, or `native`                                         |
| `poster`, `title`                            | absent, `Video` | Image before playback and accessible player name                    |
| `autoPlay`, `muted`, `loop`                  | `false`         | Browser media preferences                                           |
| `playing`, `onPlayingChange`                 | uncontrolled    | Controlled intent and media-event notification                      |
| `controls`                                   | `true`          | Default controls; compose children for custom layouts               |
| `enableGooey`                                | `true`          | Filter decorative backgrounds only                                  |
| `enableAnimations`                           | `true`          | GSAP dock, icon, menu and cinematic motion                          |
| `reducedMotion`                              | `false`         | Force static motion; never overrides an OS reduction                |
| `enableDiagnostics`                          | `false`         | Lazy diagnostics panel                                              |
| `enablePictureInPicture`, `enableFullscreen` | `true`          | Browser API controls, disabled when unavailable                     |
| `onReady`                                    | absent          | Receives `VideoPlayerHandle` after manifest/metadata load           |
| `onError`                                    | absent          | Receives a sanitized `PlayerError`                                  |
| `className`, `style`, `children`             | absent          | Wrapper layout and composable overlay content                       |

`VideoPlayerHandle` exposes `play(): Promise<void>`, `pause()`, `seek(seconds)`, `setQuality(id | "auto")`, `setAudioTrack(id)`, `setTextTrack(id | "off")`, `setVolume(0…1)`, `toggleMute()`, `setPlaybackRate(rate)` and `retry()`. Catch a rejected imperative `play()` promise. Errors have `code`, `category`, `message`, `fatal`, and `retryable` fields.

## Composition and architecture

- The React provider owns a stable video element and store. `VideoControls`, `VideoPlayButton`, `VideoSeekbar`, `VideoVolume` and `VideoSettings` are exported for composition under that provider.
- `useVideoState(selector)` subscribes to stable state fields. Avoid returning a newly allocated object from the selector. Time/progress updates are coalesced to roughly 5Hz; unrelated selectors do not re-render for every frame.
- `useVideoPlayer()` exposes normalized store actions and presentation controls. UI controls never access Shaka/HLS instances.
- The adapters own manifest loading, track selection, capabilities, engine errors, statistics and teardown. Browser play/pause, volume, rate and seeking are normalized by the store.
- Engine modules are dynamically imported only on the client. A code-splitting bundler loads only the selected engine. Diagnostics have a separate lazy import. No Shaka UI bundle is imported.
- Source changes and Strict Mode re-entry increment a generation. Old results cannot update current state. Engine destruction is serialized before a successor is attached; network loading does not block teardown.

```tsx
import { VideoPlayer, VideoControls } from "@/components/video-player";

<VideoPlayer src="/media/movie.mpd" type="dash" controls={false}>
  <VideoControls />
</VideoPlayer>;
```

`source.drm` is configuration identity: memoize it or define it outside rendering. Changing it intentionally reloads the source. Changing title, callbacks, motion flags, diagnostics or poster does not reload playback. Changing engines reloads media; time is restored for the same source where its seek window allows. Quality/audio/caption preferences are reset on a new engine. Cinematic mode changes none of those media settings.

## Streaming and quality

Shaka is the default for HLS, DASH and compatible MP4, using its native ABR, MSE, EME and retry APIs. Buffer goals are 30s ahead, 2s for rebuffering and 30s behind. Manifest/segment/license requests use three attempts, 1s initial backoff and a factor of 2; custom DRM retry settings can override license values. These are conservative defaults, not a latency guarantee or low-latency streaming certification.

Shaka 5.3 uses `selectTextTrack(track)` and `selectTextTrack(null)` for captions/Off. Audio uses `getAudioTracks` and `selectAudioTrack`. Manual quality disables ABR and selects a variant without clearing existing buffered segments. Auto re-enables ABR. The settings indicate the requested option and engine-active variant; actual rendered resolution is a browser measurement. The change may be visible later when buffered segments finish. Audio changes return to Auto to avoid a fixed variant paired with an incompatible audio track.

```tsx
<VideoPlayer src="/media/master.m3u8" type="hls" engine="hls" />
```

HLS.js has real manifest, track, level-switch and error subscriptions. Manual selection uses `nextLevel`; `-1` restores Auto. It permits at most two additional fatal network/media recovery attempts with backoff, then exposes a retryable error. Its own request retry policy also applies. A user Retry starts a new session; no unbounded application retry loop runs.

If HLS.js cannot use MSE but the video element can play HLS natively, the adapter explicitly reports `native`. Native playback cannot expose rendition selection or bandwidth estimates. HLS.js plus DASH/DRM returns an unsupported-source error rather than silently using Shaka. Browser codec support still constrains all engines.

The seek rail represents the engine's current seekable interval, including a moving live window. Buffered islands retain gaps and are clipped to the unplayed portion, so translucent buffer/played layers cannot create a fourth shade. Live streams offer Jump to live edge in settings. Playback speeds are 0.5×, 0.75×, 1×, 1.25×, 1.5× and 2×, with rejected browser assignments announced.

## Motion and behavioral brief

The stable object is the player frame and its one `HTMLVideoElement`. Caller-owned content/source and playback intent remain separate from local controls, menus and expanded state. Typography inherits the host; controls use 11–12px metadata with tabular times. A black scrim and white controls deliberately retain contrast in either host theme. Diagnostics use semantic theme tokens.

| State         | Trigger                                | Behavior / focus                                                                                                                          |
| ------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Loading       | Source load or real buffering          | Engine/media status, no simulated progress                                                                                                |
| Paused        | Initial state or pause                 | Thin control row remains visible; the initial video surface also starts playback                                                          |
| Playing       | Accepted play promise and media events | Mouse hover reveals controls; leaving hides them unless paused, keyboard-focused, in menus or scrubbing. Touch uses an inactivity timeout |
| Settings      | Pointer or keyboard activation         | Focused menu, directional navigation, native radio semantics, trigger restoration                                                         |
| Cinematic     | Cinematic mode in settings             | Existing frame enters the top layer, surrounding page is inert and scroll locked                                                          |
| Inline return | Escape or close                        | Current geometry animates back to the placeholder; focus returns                                                                          |
| Error         | Fatal engine event                     | Sanitized explanation and Retry when meaningful                                                                                           |

The thin control row reveals over 320ms. One persistent hover/focus tooltip pours out of the first control over 450ms, travels and resizes between controls over 320ms, and sinks into the last control over 290ms. A 120ms exit grace period preserves it across pointer gaps. A GSAP CustomEase gives the initial rise a soft start and slight overshoot; interruptions continue from the current geometry. Filtered background copies stretch a liquid neck that breaks before the tooltip settles 12px above the button surface. Tooltip labels keep their measured natural width and centered percentage translation; they crossfade without scaling, blurring or clipping against the changing surface width. Volume unfolds a vertical glass slider above its circular control, using the same 450ms emergence, 290ms return and 120ms exit grace. The volume control shows only its vertical slider, with no secondary tooltip below the video; its accessible Mute/Unmute label and M shortcut remain available. Pointer capture, vertical keyboard input, touch and visible focus are preserved. Settings retains its contextual menu.

There is no persistent pill background around the row. Menu surfaces emerge over 420ms. Only decorative backgrounds are filtered; video, text, captions, icons and focus rings are separate siblings. Translucent white surfaces use backdrop blur to pick up the video colors, with sharp foreground labels and slider rails. Disabling gooey filtering preserves the frosted glass surfaces. Live reduced motion settles the tooltip immediately and disables its filter. Hover listeners, exit timers, observers and tweens are cleaned up on unmount.

Cinematic mode uses a GSAP layout interpolation equivalent to a Flip transaction: measure current presentation, cancel previous motion, target viewport or placeholder geometry, then release temporary styles. Width/height and a GPU-composited translation animate over 900ms in both directions with a measured cubic curve (0.7, 0, 0.16, 1); readable controls are never scaled. Control-density queries use the stable inline slot, so crossing 560/640px during expansion cannot rearrange the controls. The video uses cover framing as the aspect ratio changes. Corners interpolate from 20px to square. The manual popover top layer avoids clipping by transformed ancestors without reparenting the video. A fixed-position fallback is used without that API; transformed/clipping ancestors can constrain that fallback. Use a modern top-layer-capable browser for the full effect.

The main fullscreen button and F shortcut use this fluid viewport expansion. Outward/inward corner icons stay mounted and crossfade with a 0.6→1 scale over 450ms; the backdrop fades with the frame, and Escape returns to the original button. Rapid reversal retains the original scroll lock and focus. Native browser fullscreen is available in Settings and reflects `fullscreenchange`; a rejected request is announced. It is disabled during cinematic mode to avoid overlapping top-layer owners. PiP uses browser APIs and reflects entry/exit events. Neither is faked on unsupported platforms.

The idle timeline shares one row with stable controls. Hover, keyboard focus or touch scrubbing expands it around its existing vertical center over 300ms. Width, thickness and the controls' 44px downward slide use exactly the same eased progress with cubic easing (0.25, 0.1, 0.35, 1). All start and finish together with no clearance lead, delayed interval or hover-out hold. Apply the forward easing toward either target, so exit starts promptly instead of playing the entrance's flat settling tail backward. Controls remain above the decorative rail during the transition. The expanded input remains 44px tall, with an 8px visual gap between the track and controls. Fractional geometry keeps the center steady throughout. Reversals start from the current visible progress and shorten the remaining duration proportionally. One geometric hover region includes the whole control row and the space below the expanded rail, so the empty middle cannot trigger repeated collapse/re-entry. Dismissal checks that region after the current pointer event in a microtask, without an exit timer. Touch release clears sticky hover/focus state. Drag coordinates are remapped against the current geometry during expansion. Live reduced motion settles the layout immediately. The rail uses the same translucent white/15 backdrop blur as the other glass controls. Its played section stays brighter and translucent in either page theme, avoiding foreground-color inversion. The marker uses `primary`, and every player focus ring uses `ring`.

Desktop controls remain visible while the pointer is inside the video. A 120ms exit grace starts the shared overlay fade; paused video, keyboard focus, an open menu or active scrubbing keep controls available. Mouse focus alone does not pin them open. Touch interaction uses a 2400ms inactivity timeout. The same overlay carries the timeline and buttons, preserving their shared fade and translation.

## Accessibility

The seek track uses a thin translucent rail with separate buffered/played fills. A grab cursor and vertical preview line follow the pointer without seeking until activation; plain position/duration text sits above it. Dragging changes the cursor to grabbing and retains pointer capture; keyboard seeking moves the same marker, and keyboard focus outlines the rail with the theme’s `ring` token. Preview text stays inside the track at either edge.

Click or tap anywhere on the video image to toggle play/pause, including after playback starts and in cinematic mode. A persistent, labeled surface button also supports Enter/Space. The control row and menus handle their own actions without toggling playback; decorative gradient padding lets clicks reach the video. With `controls={false}`, callers own the interaction surface.

Buttons are semantic, labeled and at least 44px tall. Range inputs support pointer, touch and keyboard use. Menus provide arrow navigation, Home/End, Escape, checked options and return focus. Cinematic mode contains Tab navigation, marks outside ancestors' siblings inert, restores scrolling and focus, and supports Escape. Native fullscreen/PiP are browser-controlled.

Frame shortcuts: Space/K play/pause, Left/Right seek five seconds, Up/Down volume, M mute, F fullscreen, C toggle captions. M/F work from focused buttons and sliders, or while hovering the video when the document body has focus; holding a key does not repeat-toggle. Other shortcuts apply only within the player and preserve control activation/navigation. Text fields, selects, composition and modified shortcuts are not intercepted. Hover shortcuts never act on unrelated focused fields or buttons.

OS reduced motion is live state: it disables spatial/icon/filter motion and settles an in-progress expansion. Touch opens controls without hover. Narrow layouts move secondary controls into a scrollable settings menu. A native range's visible track has a keyboard focus outline. Directional menu navigation is provided; actual Tizen/webOS device support is untested.

## Diagnostics and privacy

Enable diagnostics in the demo or through `enableDiagnostics`. The panel samples at 1Hz while open and pauses polling in hidden documents. Time, buffering and track events are separate from metric sampling. The event timeline retains only the latest 60 entries.

Measurements include engine/format, rendered resolution, estimated bandwidth, selected stream bitrate, contiguous buffer ahead/behind, post-start rebuffer count, buffering duration, manifest/load latency, first-play latency, dropped frames, playback rate, ABR, latest error and quality events. First-play latency includes time waiting for the user; load latency semantics differ between Shaka and HLS.js. User seeks are excluded from rebuffer counts where the browser identifies them. Browser/engine overlap is deduplicated by buffering state. Unsupported measurements show N/A.

Copy diagnostics whitelists normalized scalar values and fixed event names. It excludes manifest URLs, DRM configuration, headers, license responses, stacks and raw engine error data. Callers should likewise avoid logging their own secret configuration. Clipboard access requires browser permission/secure context and can fail in sandboxed frames.

## DRM / EME

```tsx
import type { VideoSource } from "@/components/video-player";

const protectedSource: VideoSource = {
  src: "https://your-media-host.example/movie.mpd",
  type: "dash",
  drm: {
    servers: {
      "com.widevine.alpha": "https://your-license-host.example/license",
    },
    advanced: {
      "com.widevine.alpha": {
        // Obtain a short-lived header at runtime; never commit real credentials.
        headers: { Authorization: "Bearer runtime-token" },
      },
    },
  },
};
```

`VideoDrm` derives from the installed Shaka DRM configuration, with partial advanced configuration per key system. Shaka handles cryptography and license exchange. HTTPS (or localhost), compatible encrypted packaging/codecs, a supported CDM and an authorized license server are required. CORS must permit the license request and any application headers.

- Widevine: generally Chrome/Chromium-based browsers and compatible Firefox installations, subject to CDM availability and content robustness requirements. Headless/bundled Chromium may lack the commercial CDM.
- PlayReady: use the appropriate supported Windows/Edge/device environment and PlayReady packaging/license service. Not verified by the demo's Widevine/Clear Key tests.
- FairPlay: Safari/Apple environments require suitable HLS encryption, certificates and potentially license payload transforms. Supply the appropriate Shaka configuration and extend the adapter's networking integration for a license service that requires request/response wrapping. This implementation does not promise arbitrary FairPlay license-service compatibility.
- Clear Key: the optional public example exercises EME and a real license endpoint without commercial CDM certification.

The default demo uses the public Mux HLS stream for Sprite Fright. DASH Sintel, HLS Angel One and MP4 remain selectable in Formats. The DRM tab explicitly loads Shaka's public Sintel/Widevine or Angel One/Clear Key test configurations and reports success only when playback progresses. A successful Clear Key test does not imply Widevine, PlayReady or FairPlay certification. No private license credentials are included.

Official references: [Shaka DRM](https://shaka-project.github.io/shaka-player/docs/api/tutorial-drm-config.html), [license authentication and public test endpoint](https://shaka-project.github.io/shaka-player/docs/api/tutorial-license-server-auth.html), [EME](https://developer.mozilla.org/en-US/docs/Web/API/Encrypted_Media_Extensions_API).

## Troubleshooting and tests

- Inspect diagnostics for a network, manifest/media, permission, DRM or unsupported error. Check CORS on every manifest/segment/subtitle/license resource, not only the first request.
- If play is blocked, activate Play directly and try muted playback. In embedded previews, host permission policy may block fullscreen, PiP, clipboard or EME; use the native website/Storybook example.
- If a quality choice appears delayed, wait for the current buffer to finish. This player deliberately avoids clearing buffered media on every quality change.
- A native HLS fallback has fewer measurable capabilities. N/A is intentional.
- A protected source failing with an unsupported CDM is not a UI success. Verify the exact target browser, device, codec, license and robustness configuration.

```sh
bun run typecheck
bun run lint
bun run test
bun run test:browser --grep video-player
VIDEO_PUBLIC_SMOKE=1 bun run test:browser --grep 'video-player public smoke'
bun run build
bun run build-storybook
CAVEMIO_REGISTRY_URL=http://127.0.0.1:4001/ npm run verify:install -- --item video-player --installer both
```

Deterministic media fixtures are locally generated test patterns and sine audio in `tests/fixtures/video`, with two renditions and finite duration. They exercise real engine decoding, not a fake progress timer. See the fixture README for generation. Public-stream smoke tests are opt-in because networking and third-party endpoint availability are external dependencies. Browser assertions cover controls, quality, cinematic geometry and identity, reduced motion, source/engine switching, multiple instances, failure/retry, mobile and controlled playback.

Verification results and remaining platform limits are recorded in [video-player verification](video-player-verification.md).
