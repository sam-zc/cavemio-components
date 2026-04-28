# Motion

Motion should show what changed, where it came from, and what the user can do next. The house style is immediate input feedback, a quick initial response, and a calm settle. The gesture and text remain legible when interrupted.

## Choose the mechanism by interaction

| Interaction                                        | Existing mechanism                                                         | Reference                                                                                                                  |
| -------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| A surface follows a drag and settles with momentum | Motion value while dragging; physical spring on release                    | [Answer Paper](../registry/components/cavemio-answer-paper.tsx)                                                            |
| A deforming perimeter propagates forces            | Fixed-step simulation, one sleeping `requestAnimationFrame` loop, SVG path | [useMembrane](../registry/components/use-membrane.ts)                                                                      |
| Text keeps shared words while changing length      | Measured word positions and WAAPI transforms                               | [Inline Rewrite](../registry/components/inline-rewrite.tsx), Answer Paper                                                  |
| A short status label changes                       | Glyph correspondence and width morph                                       | [TextMorph](../registry/components/text-morph.tsx)                                                                         |
| A value changes numerically                        | Digit columns with a plain accessible value                                | [NumberRoll](../registry/components/number-roll.tsx)                                                                       |
| An answer version enters/exits                     | WAAPI slide/blur and measured surface dimensions                           | [Message Edit](../registry/components/message-edit.tsx), [Response Versions](../registry/components/response-versions.tsx) |
| Intrinsic content folds away                       | CSS grid `1fr` ↔ `0fr`, inner `min-h-0 overflow-hidden`                    | [Clarifying Question](../registry/components/clarifying-question.tsx), drop-zone rows                                      |
| Attachment state/progress changes                  | Persistent layout, Motion presence for small parts, spring for the bar     | [MembraneAttachment](../registry/components/membrane-attachment.tsx)                                                       |
| Hover, focus, press, border/color feedback         | Scoped CSS transitions                                                     | Existing controls                                                                                                          |

Do not add Motion solely for a color change. Do not replace a physical gesture with a duration-based CSS transition. A measured height/width animation is appropriate when surrounding layout must move; compositor-only advice does not prohibit that deliberate use. Measure natural content outside the animated dimension to avoid feedback loops.

## Timing families

These are names used in the documentation, **not exported tokens or a new API**. Reuse the nearest component's implementation. Local constants preserve independently installable source; extract shared code only when it removes a real repeated behavior and can be bundled for every consumer.

| Family              | Observed values                                                                                  | Intended use                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Morph ease          | `cubic-bezier(0.16, 1, 0.3, 1)`                                                                  | Word/glyph movement, version changes, folding                                    |
| Control ease        | `cubic-bezier(0.23, 1, 0.32, 1)`                                                                 | Message editor resize and clarifying-row highlight                               |
| Attachment ease     | `[0.22, 1, 0.36, 1]`                                                                             | Attachment labels, icons, measured description height                            |
| Immediate feedback  | No interpolation under a drag; roughly 120–200ms for small control feedback                      | Handle engagement, hover/focus/press                                             |
| Exit                | 160–260ms, depending on the part                                                                 | Make room without leaving readable old content on top of new content             |
| Surface/text change | 380–480ms                                                                                        | Measured resizing, new words, directional entry, card folding                    |
| Numeric roll        | 220ms upload percentage; 500ms selection count; 600/700ms version counters; helper default 900ms | Local values are deliberate; do not normalize all digits to the longest duration |

Physical parameters are separate from duration:

| Behavior             | Parameters in current code                                                        |
| -------------------- | --------------------------------------------------------------------------------- |
| Answer Paper settle  | stiffness `440`, damping `42`, mass `0.8`; recent release velocity in px/s        |
| Attachment progress  | stiffness `300`, damping `35`, mass `0.8`, rest delta `0.001`                     |
| Membrane integration | step `1/240s`, spring `220`, neighbor tension `15000`, drag `6.5`, viscosity `58` |

Do not copy membrane constants into a UI spring: they describe a coupled perimeter simulation. `ui-interaction-motion.ts` also contains sampled-spring utilities; their presence does not mean every component uses them. Use source imports to establish actual ownership.

## Direct manipulation

1. Capture the pointer and its grab position. Start from the currently displayed value; stop an existing settle without jumping to its target.
2. Follow pointer deltas directly. Keep high-frequency geometry in Motion values or refs; React state should reflect meaningful selections and gesture state.
3. Use bounded resistance at edges where the existing gesture calls for it. Use separate thresholds when moving up/down through discrete content to prevent boundary flicker.
4. Sample recent movement, not the average of the entire drag. Respect the unit expected by the chosen engine: Answer Paper uses px/s, while `releaseVelocity` in `ui-interaction-motion.ts` returns px/ms for its sampled-frame helper.
5. Release into a spring using recent velocity. On cancel, restore the component's documented state without treating cancellation as successful submission.
6. Allow another grab, keyboard input, or disabling to take over immediately. Release capture and clean up on lost capture/unmount.

## The geometry transaction

For a discrete state change:

1. Read the outgoing **presentation** rect and, for text morphs, current opacity/filter/word positions before cancelling old motion.
2. Cancel the old animation and synchronously restore its temporary styles.
3. Commit/measure the incoming natural layout. Batch reads, then writes; avoid per-word read/write alternation.
4. Animate the same surface from the captured rect toward the new rect. Hold text at its intended layout width where the surface width changes.
5. On completion, release fixed widths/heights and overflow locks so responsive sizing resumes. On interruption, do the same cleanup before starting the next animation.

Use fractional `getBoundingClientRect()` dimensions when a fraction can change wrapping. `offsetWidth` rounding caused Message Edit's final word to wrap, clip, and pop back. Reading a cached target height caused Response Versions to jump on a rapid reversal. A ResizeObserver should watch natural content or its stable container, not the animated outer box every frame.

For horizontally moving versions, the previous answer keeps its old width and the new answer uses its destination width. Clip at the intended surface; never use `scaleX` or `scaleY` to make text fit. The progress bar may use `scaleX` because it contains no text.

## Text and icon choreography

- Shared words move to their new positions; new words rise about `0.35em` from `blur(4px)`; departing words lift about `0.2em` and fade. Preserve whitespace and rich-text structure when the component supports it.
- Keep the entrance stagger bounded. Answer Paper caps it at 120ms; Inline Rewrite's current new-word delay starts at 90ms and caps at 420ms. These are different reading interactions, not a reason to add a delay to input handling.
- Whole-answer entry uses ±16px for Message Edit and ±24px for Response Versions, `blur(6px)`, 420ms duration and 60ms delay. Their exits are 240ms and 260ms respectively. Preserve direction when reversing.
- Small icon swaps use opacity, `scale(0.6)`, and `blur(3px)`; attachment icons use `scale(0.85)` without blur. Keep icon boxes stable so adjacent text never changes position because the icon changed.
- Draw checkmarks with path length/dash offset. Only animate state changes; do not replay success on unrelated progress renders.

## Ownership, cancellation, and reduced motion

Every effect owns its animations, observers, timers, and listeners. Cancel on replacement and unmount. Remove outgoing glyphs/words/panes. Use a monotonically increasing transition identity when content can revisit the same index before its old copy leaves.

Handle finish and cancel separately when necessary. In particular, an asynchronously delivered old `oncancel` must not clear a new transition's overflow protection. Restore layout synchronously in cleanup; guard callbacks from stale operations.

Reduced motion must work **when switched on during motion**, not just on mount:

- Stop springs, slides, glyph/word movement, scale, blur, spinning, shimmer, and pulse.
- Render the selected content immediately, clear ghosts, and remove fixed sizing/temporary whitespace.
- Keep focus, status, selection, progress, and cancellation usable.
- Do not wait for an `animationend`/`onfinish` that cancellation prevents.
- Switching the preference off should allow future interactions to animate normally.

TextMorph's empty-label case is a regression reference: a target-text equality check used to return before cleaning up outgoing letters. Preference cleanup must run even when no text change is pending.

## Acceptance

Inspect start, intermediate, just-before-completion, and settled frames. Reverse while moving. Test after fonts load and after resizing. No transient word reflow caused by animated dimensions, clipped final word, duplicate-key warning, stale ghost, focus loss, or jump to a previous target is acceptable. Use the [verification guide](verification.md) to turn the failure into a browser assertion.
