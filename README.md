# Cavemio Components

Editable React components distributed through a shadcn-compatible registry. Components are copied into the consumer’s project; there is no Cavemio runtime UI package.

**Free and open source under the [MIT license](LICENSE).** Use, modify, and ship the components in personal or commercial projects without a Cavemio subscription or license key.

For development, start with [CONTRIBUTING.md](CONTRIBUTING.md) or [AGENTS.md](AGENTS.md). The [documentation index](docs/README.md) links the [six-component audit](docs/component-patterns.md), [motion guide](docs/motion.md), [typography and effects](docs/typography-and-effects.md), and [repo-local skills](docs/skills.md).

## Animated Video Player

An adaptive HLS/DASH player with a thin control row, individual gooey hover surfaces,
and cinematic expansion that preserves the same video element. Shaka is the default;
HLS.js and native playback are explicit alternatives. Seven examples cover formats,
quality, diagnostics, engines, motion and authorized DRM testing.

```tsx
import { VideoPlayer } from "@/components/video-player";

<VideoPlayer
  src="https://storage.googleapis.com/shaka-demo-assets/sintel/dash.mpd"
  type="dash"
  title="Sintel"
  muted
/>;
```

[Storybook](http://127.0.0.1:6006/?path=/story/components-video-player--default) ·
[Full API and integration guide](docs/video-player.md) ·
[Verification and limits](docs/video-player-verification.md).

Install `@cavemio/video-player` using the configured namespace described below.
The new dependencies are GSAP, Shaka Player and HLS.js; only the selected streaming
engine is initialized. Cavemio source is MIT; dependencies retain their own licenses.

## Storybook development

Use Node 24+ and Bun 1.4.3.

```sh
bun install --frozen-lockfile
bun run dev
```

Open <http://localhost:6006/?path=/story/components-answer-paper--demo>. **Answer Paper** matches the supplied video: drag the white pill upward to shorten the answer and downward to restore detail. **Inline Rewrite** includes Length and Tone examples plus a version without highlighting. **Message Edit** includes editing/resending, version navigation, and a disabled example. **Response Versions** includes single-answer, browsing, regenerating, and browse-only examples. Component, story, and Tailwind changes hot reload.

`bun run storybook` starts the same server. `bun run build-storybook` creates `storybook-static/`.

## Answer Paper

`registry/components/cavemio-answer-paper.tsx` is the canonical implementation. It uses `motion/react`, Pointer Events with capture, measured content heights, and an interruptible spring. The bottom handle has a 44px touch target and keyboard support: Up/Left shorten, Down/Right expand, Home selects the shortest answer, End selects the full answer. Inactive content is hidden from assistive technology and inert. Reduced motion disables the spring, word movement, blur, and scale transitions.

The demo uses locally served Geist (400 for body text, 600 for headings), with normal and italic font files and their license included in generated assets. The reusable component inherits its host app’s font.

Text uses Inline Rewrite’s word-by-word motion without highlight colors: shared words glide to their new positions in 480ms, removed words blur away, and added words rise in with a short stagger. Rich-text paragraphs, headings, lists, and emphasis remain intact. A reversal starts from the words’ current positions. The paper tracks the pointer directly, uses separate shortening and expanding thresholds to prevent flicker, and carries recent drag velocity into its release spring.

The component displays **prepared answer versions**. Supply summaries from your application or AI integration; it does not summarize text or make requests itself. The rice text and read times in `preview/answer-paper-demo.tsx` are local demo fixtures.

```tsx
import { CavemioAnswerPaper } from "@/components/cavemio-answer-paper";

<CavemioAnswerPaper
  paperColor="#fffdf8"
  paperRadius={26}
  levels={[
    {
      id: "brief",
      label: "Brief",
      readTime: 1,
      content: <p>The short answer.</p>,
    },
    {
      id: "full",
      label: "Full answer",
      readTime: 10,
      content: <p>The complete answer, with context and supporting details.</p>,
    },
  ]}
/>;
```

| Prop                 | Purpose                                                                                      | Default           |
| -------------------- | -------------------------------------------------------------------------------------------- | ----------------- |
| `levels`             | Nonempty array of `{ id, label, content, readTime }`, shortest to longest; unique stable IDs | Required          |
| `paperColor`         | Any CSS background color                                                                     | Translucent white |
| `paperRadius`        | CSS border radius; numbers are pixels                                                        | `14`              |
| `textColor`          | Answer text color                                                                            | `#29282c`         |
| `handleColor`        | Color of the pill’s grip line                                                                | `#b4b2bf`         |
| `level`              | Controlled level index; pair with `onLevelChange`                                            | Uncontrolled      |
| `defaultLevel`       | Initial uncontrolled level index                                                             | Longest answer    |
| `onLevelChange`      | Called as the selected answer length changes                                                 | —                 |
| `disabled`           | Disables pointer and keyboard interaction                                                    | `false`           |
| `ariaLabel`          | Accessible name for the handle                                                               | `Answer length`   |
| `className`, `style` | Wrapper layout customization                                                                 | Full width        |

Provide progressively taller content for each level. Actual heights are measured, including after container resizes. Rich text is supported; keep each version self-contained. The component expects React, Tailwind CSS 4, and Motion. The pastel page background and question bubble belong to the demo, so the reusable paper fits into other layouts.

## Kbd

Compact keycaps with an optional shortcut callback.

```tsx
import { Kbd } from "@/components/kbd";

<Kbd
  hotkey="k"
  onTrigger={() => setOpen(true)}
  stopPropagation
  aria-label="Open commands"
/>;
<Kbd>Esc</Kbd>;
```

Click, Enter/Space, or Cmd/Ctrl+K invokes `onTrigger`. Omit it for a passive label. `disabled` disables the action and shortcut. See [Kbd usage and propagation behavior](docs/kbd.md).

## Command Palette

[Open the Storybook demo](http://localhost:6006/?path=/story/components-command-palette--demo). Search grows from its pill into a keyboard-accessible dialog with fuzzy matching, grouped/nested commands, and a moving result highlight. It includes focus restoration, viewport sizing, and reduced-motion support.

```tsx
import { CommandPalette } from "@/components/command-palette";

<CommandPalette
  items={[
    { id: "home", label: "Home", href: "/" },
    {
      id: "save",
      label: "Save",
      onSelect: ({ signal }) => saveChanges(signal),
    },
  ]}
/>;
```

Use `open`/`onOpenChange` for controlled search and `showTrigger={false}` for an external opener. `searchLabel` names the field; `hotkey=""` disables Cmd/Ctrl+K. Callers supply results and navigation; the component makes no catalog requests. Closing aborts async commands and ignores late completions. See [the API, behavior brief, and checks](docs/command-palette.md).

## Clarifying Question

[Open the Storybook demo](http://localhost:6006/?path=/story/components-clarifying-question--demo). Includes the moving row highlight, drawn checks, rolling selection count, custom-answer field, and folding receipt. It reuses the existing Number Roll and Text Morph components and includes pulse keyframes.

```tsx
import { ClarifyingQuestion } from "@/components/clarifying-question";

<ClarifyingQuestion
  question="Which shop is this plan for?"
  detail="I’ll tailor the plan around your answer."
  options={[
    { id: "main", label: "Main Street" },
    { id: "harbour", label: "Harbour Road" },
  ]}
  onAnswer={handleAnswer}
  onSkip={handleSkip}
/>;
```

Single choices answer immediately. Set `multiple` to toggle options and confirm with Continue. `allowOther` defaults to true; the custom field submits with Enter and closes with Escape. Number keys 1–9 select options, and arrow keys move between rows. `onAnswer` receives `{ ids, labels, other? }`; connect it to your application or AI tool output. Without an `answer` prop, the component remembers its own answer; pass `answer={null}` while awaiting a controlled answer, then provide the result. `onSkip` enables Skip, and `skipped`/`skippedText` can render a saved skip receipt. Use a fresh React key for each new question.

The Storybook examples cover single/multiple choice, saved answers, skipped questions, options only, autofocus, and long descriptions. The demo’s Ask again button resets local state. Answered controls are inert, a status region announces the receipt, and reduced motion skips folding, the pulse, and text/counter movement. Local fixes retain receipt focus after a number-key answer and remeasure the row highlight when descriptions wrap after resizing or a font load. The component makes no network requests.

The shared Text Morph helper clears outgoing letters and cancels active text animations when reduced motion is enabled mid-transition. This prevents the old “Needs your answer” label from lingering over the folded receipt. Browser checks cover text layout throughout answer, skip, custom-answer and multiple-selection folds, plus reset during folding at desktop and mobile widths.

## Response Versions

[Open the Storybook demo](http://localhost:6006/?path=/story/components-response-versions--demo). Includes directional blur/slide transitions, animated height changes, rolling counters, and the regenerate-to-spinner transition.

Message Edit and Response Versions are separate components. Both import Number Roll; neither imports the other or a shared pager. They reuse the existing `number-roll.tsx`. Both components use unique outgoing-pane keys so rapid version reversals do not create duplicate React keys:

| Component          | Versions represent                                  | Actions                                              |
| ------------------ | --------------------------------------------------- | ---------------------------------------------------- |
| `MessageEdit`      | Edited user prompts and their conversation branches | Copy, edit/resend, browse prompt versions            |
| `ResponseVersions` | Assistant answers regenerated for the same prompt   | Browse answer versions, regenerate with a busy state |

Message Edit captures live fractional widths and holds each text layer at its own width while the bubble resizes. This prevents the previous message from rewrapping on exit and the incoming message’s final word from briefly wrapping and clipping. Interrupted animations are cancelled, and the text returns to responsive sizing when the transition finishes.

Response Versions preserves text width during navigation and measures the visible fractional height before switching answers. Reversing an arrow mid-transition continues from that height, avoiding a jump to the previous answer’s full height.

```tsx
import { ResponseVersions } from "@/components/response-versions";

<ResponseVersions
  count={versions.length}
  index={index}
  onIndexChange={setIndex}
  onRegenerate={regenerate}
  regenerating={busy}
>
  {versions[index]}
</ResponseVersions>;
```

The caller owns the answers, zero-based selected index, and generation requests. Keep prior answers when regenerating, render only when there is at least one version, and reset history for each prompt or branch. Omit `onRegenerate` for browsing alone. The demo simulates streaming locally, preserves earlier answers, and allows browsing during generation. Arrow buttons disable at either end; the current version is announced politely. Outgoing content is inert and hidden from assistive technology. Reduced motion swaps content without movement and disables the spinner animation. Local fixes give each outgoing pane a unique key during rapid reversals and cancel answer animations on navigation, unmount, or a reduced-motion preference change.

## Drop Zone Membrane

[Open the Storybook demo](http://localhost:6006/?path=/story/components-drop-zone-membrane--demo). The drop surface uses membrane physics and file-flight helpers. Accepted files appear directly below it in Attachment cards. Its Button uses Base UI.

Stories cover the five attachment states, failure/retry, manual upload, selection without an upload handler, single-file replacement, and disabled input. The preview simulates uploads locally. The reusable component makes no network requests itself:

```tsx
import {
  DropZoneMembrane,
  type DropZoneMembraneUpload,
} from "@/components/drop-zone-membrane";

const uploadFile: DropZoneMembraneUpload = async (
  file,
  { signal, progress, processing },
) => {
  // Connect your service here; report fractions between 0 and 1.
  await yourUploadService(file, { signal, onProgress: progress });
  processing();
  await yourProcessingService(file, { signal });
  // Resolve to mark uploaded, or throw Error(message) to show Retry.
};

<DropZoneMembrane
  accept="image/*,.pdf"
  maxSize={10_000_000}
  maxFiles={2}
  onUpload={uploadFile}
  onFilesChange={setFiles}
/>;
```

Defaults accept images/PDFs up to 10 MB, with two files total. Set `multiple={false}` to replace the previous selection. Set `autoUpload={false}` to show a ready state and per-file Upload action. Without `onUpload`, files stay ready for the caller to use. Customize `hint` when changing the accepted formats or size. The ref exposes `browse()`, `drag(x, y, types)`, `cancel()`, and `drop(files, coordinates?)` for application-owned drags.

Removing or replacing a file aborts its upload; unmounting aborts all uploads. A rejected file explains its type/size/count limit, and repeated copies of the same file are ignored. Enter/Space opens the picker, paste works while the drop surface is focused, and labelled file actions preserve focus on removal. Reduced motion disables bending, attachment entry motion, spinner/shimmer, and progress movement. The physics loop sleeps after settling and progress updates are coalesced at 0.5% increments.

[Attachment Transitions](http://localhost:6006/?path=/story/components-drop-zone-membrane--attachment-transitions) lets you select any state, scrub progress, play success or failure/retry, stop/reset playback, and test long filenames, wrapped errors, disabled actions, and removal. Playback is cancellable and stops when you use a manual control.

Each card keeps its filename and remove button mounted and anchored. Motion crossfades/scales the status icon, slides the status label by 4px, draws the completion checkmark, and springs the progress bar to its new value. Number Roll animates only the percentage digits. The progress tray and wrapped description animate their heights without scaling text; a ResizeObserver measures text reflow, with no measurement loop during animation. Icons are memoized across progress updates. Exiting actions are inert, Upload/Retry transfers keyboard focus to the remove button, and reduced motion switches state immediately. Drop Zone declares Motion and Number Roll in its own registry item.

## Step Timeline and Request Lifecycle Preview

Two independently installable components present a request lifecycle. `StepTimeline` is an expanding stage selector. `RequestLifecyclePreview` is a changing card composition. Their combined demo connects them through a controlled stage value.

```tsx
const [stage, setStage] = useState<RequestLifecycleStage>("asked");

<StepTimeline
  steps={steps}
  value={stage}
  onValueChange={(id) => setStage(id as RequestLifecycleStage)}
  autoPlay
/>
<RequestLifecyclePreview stage={stage} data={requestData} />
```

The preview has four complete scenes: Asked shows staggered activity pills and a rising vote count; Planned shows the roadmap label and emailed-voters notice; Shipped shows the completed request and linked changelog; Answered shows the notification email above the completed request. Its content comes from the typed `RequestLifecycleData` prop. Demo copy, avatar images, Inter, Inter Display, and Instrument Serif belong to the demos; installed components inherit the host font and have no bundled content or network service.

The request card persists across states. Standard content uses vertical anchors (84px, 0px, −100px, and 92px); longer content is centered to keep it visible. Activity pills animate when the preview enters the viewport. Supporting scenes fade and move over 500ms, the request moves over 700ms, and the status icon fills and changes color. These transitions use the `cubic-bezier(0.22, 1, 0.36, 1)` curve and can reverse during motion. ResizeObserver measures wrapped content so narrow screens and longer copy fit within the preview.

`StepTimeline` accepts unique step IDs, React-node descriptions, controlled `value`/`onValueChange` or `defaultValue`, `disabled`, `duration` (5500ms), and opt-in `autoPlay`. Enter/Space select a step; arrows, Home, and End select and focus another. Autoplay includes a pause button and pauses while hovering or focusing the steps, when offscreen, or in a hidden tab. The separate Play control resumes while it retains focus. Reduced motion disables autoplay, vote counting, and transitions. Inactive descriptions and scenes are inert and hidden from assistive technology. Both components accept `className` and `style`; the preview also accepts custom status labels.

Storybook includes separate demos, each preview state, autoplay, disabled navigation, long content, and a combined example. The avatar fixtures in `public/lifecycle/` are demo-only assets.

```sh
npx shadcn@4.21.5 add http://localhost:4001/r/cavemio-step-timeline.json
npx shadcn@4.21.5 add http://localhost:4001/r/cavemio-request-lifecycle-preview.json
```

## Install into a consumer

`inline-rewrite.tsx` includes the Number Roll and Text Morph dependencies; `message-edit.tsx` and `response-versions.tsx` each include Number Roll and install `lucide-react`. The preview theme lives in `preview/styles.css`; installed components use the consumer’s shadcn theme variables.

Build and serve the local registry in another terminal:

```sh
bun run build
bun run serve
```

Then initialize shadcn if needed (`npx shadcn@4.21.5 init`) and merge this namespace into your existing `components.json`, keeping the other fields:

```json
{
  "registries": {
    "@cavemio": "http://127.0.0.1:4001/r/cavemio-{name}.json"
  }
}
```

```sh
npx shadcn@4.21.5 add @cavemio/text-morph
npx shadcn@4.21.5 add @cavemio/number-roll
npx shadcn@4.21.5 add @cavemio/inline-rewrite
```

This is a project-configured shadcn namespace, not an npm import or a globally registered namespace. When deploying, replace the loopback root with your hosted registry root (including any subpath). The website generates this configuration from its configured registry URL. Direct registry JSON URLs remain supported.

The installer places source using `aliases.components` and installs each component's declared dependencies. Drop Zone Membrane includes the Attachment/Button helpers and installs Base UI, CVA, `cn`, and Lucide. Review overwrite prompts before replacing customized source; no default `--overwrite` is used.

The repository stays private and is a source registry, not a published runtime UI package. There is no custom Cavemio installer.

Registry index: <http://localhost:4001/r/registry.json>. Discovery: <http://localhost:4001/catalog.json>. Standalone demo: <http://localhost:4001/previews/cavemio-answer-paper.html>. The static server has no gallery or hot reload; use Storybook for authoring. `PORT` changes its port; it binds loopback.

## Add another component

1. Create canonical source in `registry/components/`.
2. Add a story under `preview/stories/` importing that source; Storybook discovers it automatically.
3. To distribute it, add a uniquely named `registry:component` item and `meta.cavemio` metadata to `registry.json`.
4. Add `preview/entries/<component>.tsx` exporting `Demo`, matching `meta.cavemio.component`. The registry builder uses this explicit entry, and it should import canonical source.
5. Declare real npm dependencies in the item’s `dependencies`, and shadcn dependencies only when used in `registryDependencies`.
6. Rebuild generated artifacts; never edit `public/r` or `public/previews` by hand.

Follow the full [component development guide](docs/component-development.md), starting with a [component brief](docs/templates/component-brief.md). See [CONTRIBUTING.md](CONTRIBUTING.md) for the contributor workflow and [verification](docs/verification.md) for checks matched to the change.

## Checks

```sh
bun run format:check
bun run typecheck
bun run lint
bun run test
bun run build
bun run build-storybook
bun run validate
# With the registry server running:
CAVEMIO_REGISTRY_URL=http://127.0.0.1:4001/ npm run verify:install
```

The install check discovers every registry item and installs each alone, plus one combined installation through the shadcn namespace. Use `--installer both` to also check direct URLs. It checks dependency/helper/CSS availability, aliases, preserved files/configuration, and compiled usage. It requires network access and removes owned temporary consumers. Use `npm run verify:install -- --item response-versions` for a focused run.

Browser regressions run through the pinned Playwright Test runner. It starts or reuses Storybook locally, isolates suites, and captures failure traces/screenshots:

```sh
bunx playwright install chromium
bun run test:browser
bun run test:browser --grep 'message-edit|response-versions'
```

The twelve suites cover the existing drag, text-frame, version, attachment, clarifying-question, and command-palette regressions. Inline Rewrite currently has no dedicated committed browser suite. See [verification](docs/verification.md) for exact coverage, install-case selection, server overrides, and CI behavior.

Inactive answer layers use opacity instead of inherited visibility: this avoids Chrome retaining `visibility: hidden` on animated words after a layer becomes active. Drag frames update Motion values directly; React updates only when the selected level or gesture state changes. Text measurements are batched per transition, and word matching uses cached strings.

Generated catalog v2 contains one item per component, dependencies, source hash, install URL, and preview URL. The independent website consumes these HTTP artifacts without importing sibling source.

The [workflow decisions](docs/ecosystem-review.md) describe authoring and verification choices. [Architecture](docs/architecture.md) records our HTTP contract and the sibling website’s current compatibility gap.

## Theme Toggle

A single circular sun/moon button. Install `@cavemio/theme-toggle`, then connect it to your theme provider:

```tsx
import { ThemeToggle } from "@/components/theme-toggle";

<ThemeToggle theme={theme} onThemeChange={setTheme} />;
```

Omit `theme` for local state. Add `pageTransition="circular"` for a page reveal and apply your theme synchronously in `onThemeChange`. The bundled helper handles styles, cancellation, and reduced-motion/unsupported-browser fallbacks; your app owns colors and persistence. [API, integration examples, and fallback cases](docs/theme-toggle.md) · [Storybook](http://localhost:6006/?path=/story/components-theme-toggle--default).
