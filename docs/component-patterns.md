# Component interaction audit

Source review: **16 October 2026**. Values below describe current implementations. They are reference patterns for new work, not instructions to make every component share one duration or one rendering engine. Browser checks and remaining coverage gaps are listed in [verification](verification.md).

## Comparison

| Component           | Stable object                               | What moves                                                  | Text treatment                                                    | State owner                                                           |
| ------------------- | ------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| Answer Paper        | Paper, bottom grip, prepared content layers | Paper height, word positions, grip scale                    | Rich React content, word matching, no added-word highlight        | Controlled/uncontrolled level; caller supplies prepared versions      |
| Drop Zone Membrane  | Receiving surface, filename, remove action  | SVG perimeter, directional arrow, attachment parts/progress | Label glyph morph; stable file text; measured status descriptions | Component tracks files; caller implements upload                      |
| Inline Rewrite      | Dial and paragraph area                     | Thumb/badge, shared/new/removed words                       | Plain-text word matching, optional added-word highlight           | Controlled/uncontrolled selection; optional caller rewrite callback   |
| Message Edit        | Right-aligned message surface               | Bubble dimensions, editor reveal, version panes             | Preserved whitespace; native textarea; whole-message slide        | Local draft/edit state; caller owns committed text/history            |
| Response Versions   | Answer slot and toolbar                     | Answer height, outgoing/incoming panes                      | Caller-owned content; whole-answer slide                          | Caller owns index/count/content/generation                            |
| Clarifying Question | Question card and header                    | Active-row plate, fold, header reveal, check/count          | Stable row text, label glyph morph, compact receipt               | Local selection; answer may be controlled or remembered locally       |
| Command Palette     | Command button and modal surface            | Shell geometry, result height, highlight, nested panes      | Native search input; matched labels; glyph-morphed status         | Caller supplies commands/open state; local query/navigation/run state |

## Answer Paper

Sources: [component](../registry/components/cavemio-answer-paper.tsx), [demo](../preview/answer-paper-demo.tsx), [stories](../preview/stories/answer-paper.stories.tsx).

**Interaction.** A vertical drag selects progressively shorter/taller prepared answers. The 80×44px hit area surrounds a 56×22px pill. The grip is anchored at the paper's bottom center. Pointer capture and the original grab height preserve contact outside the handle. The grip scales to 1.06 over 120ms while dragging; its cursor distinguishes resize, grabbing, and disabled states. This is drag engagement, not a generic hover animation.

**Geometry and physics.** Content layers are measured with ResizeObserver. Drag height follows the pointer directly through a Motion value. Outside the allowed range, resistance is `(overflow * 0.18) / (1 + abs(overflow) / 100)`; reduced motion removes that elastic excess. Shortening crosses `min(52px, gap * .32)` below a level's height; expanding crosses `min(28px, gap * .16)` below the next height. Different thresholds prevent small reversals from repeatedly changing text. Release uses recent 80ms samples, discards stale velocity after 100ms, clamps it to ±1600px/s, and projects by 80ms capped at ±44px. The release spring is 440/42/0.8 (stiffness/damping/mass).

**Text.** React rich text is retained. Shared words follow their measured old positions over 480ms with the morph ease. New words rise 0.35em from blur 4px over 380ms, staggered 14ms with a 120ms cap. Removed words lift −0.2em, scale to .96, blur 4px, and leave over 240ms. Incoming/old presentations are measured before cancelling a reversal, including opacity/filter. Ghosts copy typography from the source word. There is no Inline Rewrite highlight wash.

**Identity and access.** Stable level IDs key the content layers. Inactive layers are inert and hidden from assistive technology; opacity avoids the previously observed inherited-visibility problem on animated words. Up/Left shorten, Down/Right expand, Home/End choose endpoints. Keyboard input takes over a drag immediately; cancellation restores its starting level. Reduced motion jumps to the selected height and clears word effects. The visual read-time label is decorative; the slider value contains the reading time.

**Preserve.** Keep the bottom edge attached to the gesture, rich-text semantics, natural content measurements, bounded velocity, and immediate re-grab. Do not replace the physical settle with a fixed-duration ease, or move the demo question/background into the reusable paper.

## Drop Zone Membrane

Sources: [component](../registry/components/drop-zone-membrane.tsx), [physics](../registry/components/use-membrane.ts), [attachment state composition](../registry/components/membrane-attachment.tsx), [interaction helpers](../registry/components/ui-interaction-motion.ts), [stories](../preview/stories/drop-zone-membrane.stories.tsx).

**Interaction.** File drag proximity bends the inner drop surface. It is not ordinary mouse-hover decoration. The arrow turns toward an approaching file, points inward once accepted over the surface, and rests pointing up. Valid/invalid drag, accepted files, and rejection have distinct labels/icons. The same input can arrive through the picker, focused paste, native file drag, or caller-owned imperative drag/drop methods.

**Physics.** A ring of 48–360 samples, about 5px apart, displaces along its normals. Goals attract/recoil/carry; neighboring samples share tension and damping. Integration steps at 1/240s, with each frame's elapsed time capped at 50ms. Reach is 200px, pull goal 44px, carry slip 32px, and the component's held-drop tolerance is 16px. Entering the zone releases stored tension as a ripple. Arrow orientation smooths with an 80ms time constant and a maximum 4px lean. The loop stops when displacement/velocity settle; it must not run continuously at rest.

**Attachment state changes.** Accepted files appear directly in attachment cards—there is no intermediate chip stage. Rows open/fold with a 420ms grid transition and 200ms opacity ease. Within a row, filename/media/remove anchors persist. Status icon changes use a 200ms fade and .85 scale; success draws over 250ms. Status descriptions move ±4px over 200ms, with their natural wrapping height measured independently. Percentage digits roll over 220ms. The progress bar uses a 300/35/.8 spring; its 16px tray closes over 240ms, delayed 120ms when entering processing. Only the bar scales, not the surrounding text.

**State and access.** Ready (`idle`), uploading, processing, uploaded (`done`), and error have separate actions. Upload/Retry preserves focus on the persistent remove control; removal restores a useful focus target. Exiting actions/rows are inert. Progress updates are monotonic and coalesced at 0.5% increments. Abort controllers prevent removed/replaced files from returning after late completion. Type/size/count rejection is explicit. Reduced motion flattens the membrane and replaces state changes with static content/progress, including spinner/shimmer suppression.

**Preserve.** Keep real file state distinct from visual presence. Retain the Attachment composition, error wrapping, progress semantics, cancellation, focus, and the sleeping simulation. Do not remount an entire card for each progress tick.

## Inline Rewrite

Sources: [component](../registry/components/inline-rewrite.tsx), [fixtures and async demo](../preview/inline-rewrite-demo.tsx), [stories](../preview/stories/inline-rewrite.stories.tsx).

**Interaction.** A horizontal track, circular thumb, and floating label select prepared or generated text. Dragging follows the pointer without CSS interpolation. On release/keyboard selection, position/track/badge changes use 420ms with the morph ease. The badge is measured, clamped within the track, and kept clear of the heading. Its small arrow points toward the thumb. `touch-pan-y` permits vertical page scrolling. The info tooltip opens on both hover and focus. Arrow keys and Home/End select stops; a single stop disables the dial.

**Text.** The paragraph is plain text split into words. Longest-common-subsequence matching preserves shared word identity. Paragraph height and kept-word positions animate over 480ms. New words rise .35em from 4px blur over 380ms; delays start at 90ms, add 14ms per word, and cap at 420ms. Removed words lift −.2em/scale .96/blur 4px over 240ms. Added-word highlights join neighboring new words on the same line and fade over 1800ms. `highlight={false}` preserves movement without the wash. Label/status glyphs use TextMorph; counts use NumberRoll.

**Async behavior.** Prepared text is immediately available. Missing text invokes the supplied `onRewrite` after a settled selection; the caller receives an abort signal. A busy thumb/status and a 1.4s sheen communicate the request. Existing text remains while waiting. Cached results and checks against the current selection prevent an older answer from replacing a newer choice. Unmount aborts requests. This is not simulated typing built into the component.

**Preserve.** Keep drag tracking distinct from request timing, preserve the current readable paragraph during async work, and keep the label within bounds. Do not substitute glyph animation for paragraph morphing. A retained word must remain visible after repeated reversals. The shared TextMorph fix also clears outgoing labels when reduced motion is enabled mid-morph.

## Message Edit

Sources: [component](../registry/components/message-edit.tsx), [branch/stream demo](../preview/message-edit-demo.tsx), [stories](../preview/stories/message-edit.stories.tsx).

**Sent to editor.** The sent bubble is right-aligned, fit-content, at most 85% wide, with a 14px radius. Editing makes the same surface full-width with a background/border treatment. It captures the old rect, sets the textarea to auto height then `scrollHeight`, measures the destination, and animates width/height over 380ms with the control ease. Editor/sent content uses a 220ms opacity entrance after 100ms. Background/shadow changes use 300ms. The right edge is the anchor; text is never stretched. Typing updates the native textarea height, capped at `max-h-60`; it does **not** currently spring-animate every keystroke.

**Input.** Start copies the current text into the draft, focuses the textarea, and puts the caret at the end. Enter sends trimmed changed text; Shift+Enter inserts a newline; Escape cancels; composition is guarded. Blank and unchanged drafts cannot send. Focus returns to Edit. Disabled editing preserves access to its explanation. Copy writes the selected message and announces success; the copy/check swap uses opacity/blur/scale, with a drawn check and a 1600ms copied state.

**Hover and versions.** The action toolbar reveals over 200ms on group hover/focus-within and stays discoverable on non-hover devices. Small buttons use 150ms feedback and .94 press scale (Send .96). The version counter rolls over 700ms. Message versions are edited **user prompts**, not regenerated assistant answers.

**Text integrity.** Version panes slide ±16px with 6px blur: incoming 420ms after 60ms, outgoing 240ms; the surface resizes over 420ms. Capture the live fractional outgoing width. Hold the incoming text at its natural destination width, right-aligned, while the bubble changes size; release the temporary width/margin when finished or cancelled. Transition-instance keys prevent duplicates during repeated routes. Outgoing content is inert. These details fix the stale-width and rounded-width final-word glitches.

**Preserve.** Keep native input/caret behavior, the same surface, the right edge, focus return, whitespace, trimmed validation, and independently owned prompt history. Do not animate editable glyphs or replace the bubble with an unrelated modal editor.

## Response Versions

Sources: [component](../registry/components/response-versions.tsx), [generation demo](../preview/response-versions-demo.tsx), [stories](../preview/stories/response-versions.stories.tsx).

**Interaction.** Previous/Next browses **assistant answers for one prompt**; optional Regenerate asks the caller for another. Boundary arrows disable and the counter announces the selected version. The toolbar is visible, with rounded-md accent/color hover and focus rings. It intentionally differs from Message Edit's hover-only round toolbar. Busy regeneration disables duplicate regeneration while the caller can allow browsing.

**Motion.** Incoming content slides ±24px out of 6px blur over 420ms after a 60ms delay. Outgoing content leaves the opposite way over 260ms. The answer box resizes over 420ms using the visible fractional height captured before the swap, including an in-progress resize. On interruption, cleanup restores overflow synchronously so an old cancel event cannot break the new transition. The text slot's width remains stable; there is no bubble-width morph. Counters roll over 600ms; regeneration swaps its icon to a spinner.

**Content and ownership.** `children` is caller-owned React content; the component does not impose paragraph typography or store versions. Index/count and generation are controlled. The demo appends a new answer at generation start, streams into it, and preserves earlier answers while browsing. Outgoing panes are inert and receive unique transition-instance keys. Reduced motion removes old panes, cancels resize/entry, and keeps a static busy indication.

**Preserve.** Retain natural width, presentation-height continuity, generation semantics, and the content slot. Do not combine its state model with Message Edit just because both have arrows and a counter.

## Clarifying Question

Sources: [component](../registry/components/clarifying-question.tsx), [demo](../preview/clarifying-question-demo.tsx), [stories](../preview/stories/clarifying-question.stories.tsx).

**Asking and navigation.** A 14px-radius bordered card holds a question, optional detail, and minimum-44px rows. The header pulse runs at 1.6s while asking. A single 14px-radius accent plate tracks the active row with 200ms control-ease translation and height. Pointer movement and keyboard focus share the active index. A ResizeObserver remeasures wrapped row height and offset after container/font changes. The plate sits behind text and is separate from committed selection.

**Answering.** Single choice submits immediately; multiple choice toggles checked rows and confirms through Continue. Number keys 1–9 pick; arrows move through rows. Digit shortcuts do not intercept typing in a field. Something else replaces its row label with a native input using a 200ms fade; Enter submits trimmed content, Escape closes it and restores row focus on the next frame. Multi-selection count rolls over 500ms and its slot opens over 380ms. Checks draw over 320ms after 60ms.

**Fold and receipt.** The header's padding shifts from `14px 16px 0` to `13px 16px`; the body folds from grid row 1fr to 0fr over 460ms. Body opacity leaves in 180ms. “Needs your answer” departs through TextMorph while question/answer columns open over 460ms, with opacity/blur reveals. The answer column is capped at 55%; both receipt parts truncate intentionally. Full content remains in the status text and titles. The icon trades pulse for a check. Focus moves to the card before the controls become inert.

**State.** The answer can be controlled or locally remembered; Skip has its own state and optional callback. Give each new question a fresh React key to reset local selection/input/skip state, as the demo's Ask again does. A reset is a new question mount, not a promised animated undo of the answered state. Reduced motion removes fold/reveal movement and pulse. TextMorph now clears old letters and its width animation even when the target label is already empty at the moment the preference changes.

**Preserve.** Keep one active plate, stable row typography, distinct navigation and selection, focus on the receipt, full accessible answer text, and a field that never triggers numeric shortcuts while typing.

## Command Palette

Source: [component](../registry/components/command-palette.tsx). The [component brief](command-palette.md) records its API, states, distribution, and checks. A stable transparent “Search...” command button with a default 16px search icon and a 14px regular label with a filled trailing Kbd shortcut badge expands into a 640px-wide, 14px-radius modal surface over 440ms and closes over 320ms while its input/results retain their target width. On taller viewports, its anchor moves down toward 16% of viewport height (up to 160px) only when the full list and footer still fit, reducing travel without shrinking content. The anchor remains stable across result changes. Content fades in over 240ms after 60ms and out over 100ms; the trigger returns over 140ms after 160ms, just before the 320ms closing veil and focus cleanup complete. The result list resizes over 300ms and one 40px highlight moves over 200ms. Nested pages slide with inert outgoing copies. The highlight lives inside the positioned incoming pane and shares its slide transform. It initializes in the new page’s coordinates without gliding across chips or headers; subsequent within-page selections still glide. Scroll calculations separately include the pane inset. The caller supplies commands, navigation and abortable async work; stale completion cannot close a later session. Compact headings and chip spacing retain 40px rows within a result area capped at 440px. Caller-owned filter chips wrap inside the scrollable body; leading item/trigger icons accept custom logos. A measured footer aligns keyboard hints with optional help actions and wraps at narrow widths. The palette traps focus across the search, Close, removable chips, and footer actions, keeps the background inert through closing, restores the opener, fits the visual viewport, and settles live reduced motion without losing the query.

## Shared helpers and boundaries

| Helper                                                                   | Consumers in this audit                                                                    | Review consequence                                                                                   |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| [NumberRoll](../registry/components/number-roll.tsx)                     | Inline Rewrite, Message Edit, Response Versions, Clarifying Question, membrane attachments | Check digit boundaries, counter widths, accessible values, reduced motion; preserve caller durations |
| [TextMorph](../registry/components/text-morph.tsx)                       | Inline Rewrite, Clarifying Question, drop-zone labels, Command Palette                     | Check short/empty labels, width changes, outgoing glyph cleanup, live reduced motion                 |
| [ui-interaction-motion](../registry/components/ui-interaction-motion.ts) | Membrane/drop-zone/attachment family                                                       | Keep helpers bundled; do not infer that all exports are used everywhere                              |
| [useMembrane](../registry/components/use-membrane.ts)                    | Drop Zone Membrane                                                                         | Check drag forces, resize, reset and idle frame loop                                                 |
| [MembraneAttachment](../registry/components/membrane-attachment.tsx)     | Drop Zone Membrane                                                                         | Check all five states, persistent anchors, progress and action focus                                 |

## Differences to preserve and gaps to track

- This is a behavioral family, not one shared runtime motion-token package. Springs, WAAPI, CSS grid transitions, and Motion presence serve different jobs.
- Compact pager/slider controls are smaller than the recommended hit area for new primary touch controls. Do not claim all current controls meet a 44px target.
- Some existing press-scale classes are not explicitly guarded by reduced-motion utilities. New controls should gate spatial press feedback; changing existing hit areas or press styling is a separate targeted change with visual checks.
- Answer Paper has customizable literal paper/text/grip colors; Inline Rewrite uses a gradient. Other components mainly inherit semantic theme tokens. A uniform dark-theme certification is not implied by this audit.
- Response Versions accepts arbitrary children; Message Edit supports display children but edits its `text` prop; Inline Rewrite accepts plain text; Answer Paper accepts rich content. Do not erase these API distinctions.
- Existing browser scripts target the demonstrated scenarios. Inline Rewrite currently has no dedicated committed browser suite; manual/smoke checks from earlier work are not a substitute when changing it again.
- Large text/zoom, translated/RTL content, complex interactive answer children, and additional browser engines need explicit testing when relevant. Record coverage instead of assuming it from a 320px Chromium check.

## Kbd

[Canonical source](../registry/components/kbd.tsx) and [API/brief](kbd.md). Passive semantic keycaps become native buttons when `onTrigger` is supplied. Cmd/Ctrl plus `hotkey`, click, Enter, and Space share the callback. Optional `stopPropagation` intercepts matching shortcuts before ancestor handlers; disabled, repeating, composing, and already-handled events do not trigger. Listener cleanup follows key/callback changes and unmount. A 20px keycap has an expanded 44px pointer target, a visible focus ring, and static legacy styling. Opt-in `keys`/`live` renders platform-aware individual keys that sink 1px while held, with a 100ms color/shadow/translate transition. Reduced motion suppresses translation and interpolation; release, blur, and hidden documents clear held state. Labeled surfaces are 32px tall with 10px left/6px right padding and a 24px label-to-badge gap; interactive labeled surfaces retain a 44px hit area. Labels use 14px/400 text and inherit the host font. Platform detection reveals a single fitted label after hydration. Unknown modifiers use a hidden compact placeholder; longer Windows labels may expand once, while Mac symbols no longer inherit hidden Windows widths. Surfaces are transparent with an inset border; their shortcut badges retain the semantic background fill. Command Palette bundles this helper for its trigger, transition copy, result shortcuts, and footer hints, and its closing shell fades to transparent to match the trigger.

## Select

See [Select](select.md) for the expanding pill, labeled fields, keyboard listbox behavior, and distribution contract.

## Theme Toggle

[Canonical source](../registry/components/theme-toggle.tsx) and [component brief](theme-toggle.md). One stable native button contains a masked disk and eight rays. CSS transitions retract/rotate the rays and move a circular cutout over 420ms, reversing from current presentation on interruption. Button dimensions remain fixed, each SVG mask has a unique ID, and live reduced motion settles immediately. Controlled and uncontrolled appearance are supported; the host owns global theming and persistence.

Theme Toggle’s opt-in `pageTransition="circular"` uses the bundled document wipe helper: a 620ms root clip-path reveal, synchronous caller theme commit, per-document coordination, and cleanup on finish/cancel/unmount. Missing APIs, reduced motion, hidden documents, and capture failures switch immediately. Theme colors and persistence remain caller-owned.
