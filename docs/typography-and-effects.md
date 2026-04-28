# Typography and effects

Keep the existing calm hierarchy: readable text, quiet surfaces, small directional effects, and clear interaction feedback. Installed components inherit the host font and mostly use shadcn semantic colors. Demo styling is not a required consumer stylesheet.

## Text roles in the current components

| Role                        | Current treatment                                              | Reference                                     |
| --------------------------- | -------------------------------------------------------------- | --------------------------------------------- |
| Rich answer body            | 15px, weight 400, line-height 1.65, tracking −0.012em          | Answer Paper                                  |
| Rich answer heading         | 16px, weight 600, line-height 1.35                             | Answer Paper `h3`                             |
| Rewritten paragraph         | 14px, 15px at its `@md` container breakpoint, line-height 1.65 | Inline Rewrite                                |
| Sent message / editor       | 14px, relaxed line-height, preserved newlines                  | Message Edit                                  |
| Assistant response          | Caller-owned content styling; demo uses 14px/relaxed           | Response Versions                             |
| Question                    | 14px, medium, snug line-height                                 | Clarifying Question                           |
| Option / input              | 13.5px; descriptions 12px/snug; question detail 12.5px/relaxed | Clarifying Question                           |
| Receipt / helper / metadata | About 12–13px, muted unless it communicates the result         | Clarifying Question, drop zone, rewrite stats |
| Version counter             | 11px or 11.5px, mono, tabular numbers                          | Message Edit / Response Versions              |
| Drop label                  | 13.5px, medium, tracking −0.01em                               | Drop Zone Membrane                            |

Use these roles as starting points. Larger product text should scale its spacing and container with it. Do not force all roles to the same size, tracking, or weight. Do not turn a caller-styled response slot into an opinionated paragraph style.

Geist is the current six-component preview font. `preview/styles.css` loads normal and italic variable faces, uses weight 400, and disables synthesized faces. Inter/Inter Display and Instrument Serif belong to the lifecycle preview. Fonts and their notices are build inputs/assets, not mandatory dependencies of installed components. See [third-party notices](../THIRD_PARTY_NOTICES.md).

## Choose the text transition deliberately

| Content                                 | Pattern                                          | Avoid                                                      |
| --------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------- |
| A sentence or paragraph being rewritten | Word correspondence and measured positions       | Animating every letter or remounting the whole answer      |
| A status label                          | TextMorph glyph matching                         | Stretching letters as the container grows                  |
| A number or percentage                  | NumberRoll + a static accessible value           | Re-animating the whole status row for every tick           |
| A complete previous/next answer         | Directional pane transition                      | Pretending unrelated answers are the same sentence         |
| User input                              | Native field, caret, selection and composition   | Morphing the editable text or inserting demo typing delays |
| A streaming answer                      | Render caller-provided incremental content       | Replaying the full entrance on every token                 |
| A compact folded receipt                | One-line truncation with full accessible content | Losing the answer because only an ellipsis is announced    |

Prepared versions are not AI generation. The demo streaming intervals illustrate state changes; their cadence must not become component behavior.

## Wrapping and measurement

- Preserve meaningful whitespace: Message Edit uses `whitespace-pre-wrap`; Answer Paper preserves React rich-text structure. Inline Rewrite intentionally accepts plain text and splits words; it is not a Markdown renderer.
- Pair flex children that may shrink with `min-w-0`. Use `min-h-0` inside a folding grid. Keep label/description wrappers at a stable width through height changes.
- Do not use integer width measurements at word-wrap boundaries. Keep fractional widths and measure again when fonts, content, or container width change.
- Keep text unscaled. Animate the surface, text position, or opacity instead.
- Use truncation only for intentionally compact roles. Clarifying receipts retain full strings in `title` and a status region; important information needs an accessible full-text path. A browser title alone is not a touch-access solution.
- For long filenames/errors, retain the original filename and use controlled truncation or wrapping. Attachment error descriptions use `overflow-wrap:anywhere`; their height is measured independently of animation.
- Test a narrow viewport, larger text/zoom, long unbroken content, and a font swap. Include a wrapping description in the hover/focus highlight test.

## Surfaces and hierarchy

Cards, dialogs, upload surfaces, and lifecycle panels use 14px outer corners. Keep smaller inset controls, circular icons, and pill controls at their existing radii. Answer Paper still accepts a caller-provided `paperRadius`; the membrane's drawn outline and hit surface share the same 14px radius.

| Surface                          | Existing shape/material                                                                 | Why it stays distinct                                |
| -------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Answer Paper                     | Default 14px radius, soft paper shadow/inset light; customizable paper/text/grip colors | A physical reading surface                           |
| Message bubble / clarifying card | 14px radius; muted bubble or bordered background                                        | A stable conversational object                       |
| Membrane / attachment            | 14px radius, quiet border; attachment media 10px                                        | A receiving surface followed by file records         |
| Clarifying active row            | 14px radius, semantic accent fill                                                       | Shows navigation without committing selection        |
| Small actions                    | Rounded full for Message Edit; rounded-md for Response Versions                         | Preserve the source component's established controls |

New standard controls should use `background`, `foreground`, `muted`, `muted-foreground`, `accent`, `primary`, `border`, and `ring`. The demo palette uses warm ivory surfaces, lime primary fills, and charcoal text; `accent-ink` supplies readable olive text on light surfaces and lime text in the website's dark mode. Inline Rewrite uses a muted-to-primary gradient. Answer Paper defaults to host card/foreground colors and still accepts custom paper/text/grip colors. Keep demo colors local; do not copy literal preview colors into unrelated components.

Shadows describe a raised surface or grip, not every element. Use border/background change for ordinary hover. Avoid new glass, glow, gradients, or large blur layers unless they explain the component's purpose and remain legible in the consumer theme.

Step Timeline uses semantic border tracks and muted foreground for inactive labels, keeping them legible in both modes without reducing text opacity. Request Lifecycle uses semantic borders and muted inset surfaces; its raised-card shadows are neutral. Website-specific white/black cards and neutral muted values belong to the website's surface stylesheet, not these components.

## Hover, active row, press, and focus

- Clarifying Question has **one moving accent plate** behind its rows. Pointer movement and keyboard focus update the same active index; selection is a separate concept. Measure both offset and height, and keep the plate behind text so it never affects wrapping.
- Message Edit reveals Copy/Edit/version controls on group hover **and** focus-within, with a non-hover-device fallback. A new hover toolbar needs the same access paths.
- Inline Rewrite's information tooltip opens on hover or focus; its value badge stays anchored to the slider and within the available width.
- The membrane follows file drag proximity, not decorative mouse hover. Do not start its simulation on unrelated pointer movement just to add motion.
- Press feedback is local and small: existing buttons use scales around 0.94–0.96, while the Answer Paper grip grows to 1.06 during dragging. For new controls, suppress spatial press feedback under reduced motion and keep a color/opacity cue.
- Focus rings must remain visible against the host surface. Avoid global `outline: none`; replace it only with a visible focus treatment. Keep focus on the card when its selected control becomes inert, and return focus after editing/cancel/removal.
- Prefer at least a 44px hit area for new primary touch interactions, even if the visible icon is smaller. Current pager icons are 28px and the Inline Rewrite thumb is 22px; these are recorded compact-control exceptions, not a claim of universal 44px targets.

## Effects budget

Use blur to connect a brief replacement, not to obscure stable content: 3px for small icon/receipt reveals, 4px for word/glyph changes, 6px for whole version slides. Keep the blur local, bounded, and removed when settled. Avoid lingering `will-change` on a whole page.

Progress is actual progress. Upload percentages are monotonic within a request; processing has a separate state. Success/check, failure/error text, and available Retry/Remove actions remain distinguishable without motion or color alone. Pulse, shimmer, and spinner indicate a current state and stop when it ends or reduced motion is enabled.

Existing decorative differences are documented in [component patterns](component-patterns.md). Consistency means matching behavior, text integrity, and feedback for the same job; it does not mean applying every effect to every component.
