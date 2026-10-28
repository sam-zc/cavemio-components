# Component catalog

The collection contains 183 independently installable components with reusable source, local previews, and complete installation metadata.

## Categories

The registry supplies navigation order and primary categories. The website renders Buttons and actions; Inputs and forms; Overlays and feedback; Display and navigation; Motion and landing; Data and app UI; AI and agents; Charts. The 21 blocks appear separately. Cavemio's four extra components bring the library count to 162. Counts describe real local entries rather than copying the reference's total.

## Source, composition, and packaging

Reusable source belongs in `registry/components/`. Each new item bundles the complete local import graph and required CSS/keyframes and npm dependencies. Registry dependencies are resolved into local source; installed components use local source files. Shared imported helpers have one canonical implementation. Every item remains independently installable through the Cavemio namespace or its JSON URL.

The shared interaction, field, pill-select, and membrane helpers use `imported-` filenames to preserve different established Cavemio helper APIs. New components reuse existing Text Morph and Number Roll where imported. Compatibility edits include the typed Action Receipts label lookup, PointerEvent timestamps in Sortable List, removal of unused imports/constants, and removal of lint directives for plugins not used by this registry. Filter Bar retains its heterogeneous field-accessor boundary so caller-specific row types remain accepted. Diff Review and the shared confirmation helper clip folded action content so invisible buttons cannot widen the preview. Morphing Nav and Mode Switcher use narrower demo gutters at phone widths; reusable component motion is unchanged. Gesture and effect timings are retained.

## Preview brief

The 179 scene-based components use local demo scenes: 418 modes with the same sample content, mode labels/order, supporting controls, async simulations, and callbacks. The four Cavemio additions retain their own previews. The website, standalone previews, and reference Storybook stories share `preview/entries/` and `preview/reference/`. Replay resets the current scene while preserving the selected mode. No real sign-ins, payments, emails, uploads, or account operations occur.

Demo scenes are standalone ESM fixtures that import canonical registry components. Typed declarations define each React entry boundary. The host supplies React, React DOM, and icons. [Scene metadata](../../preview/reference/scenes.json) records canonical bindings and media paths.

Font licenses accompany font files. Twelve versioned media files are served locally for image cropping and audio playback, including in clean checkouts and deployments. Demo media is excluded from installable components.

## Verification scope

Typecheck, lint, unit tests, build, and validate cover source, contracts, metadata, and packaging. `bun run test:browser --grep 'catalog preview renders'` opens every standalone preview in Chromium and checks mounted content and uncaught errors. Existing interaction suites retain frame, focus, interruption, and reduced-motion checks. `STORYBOOK_URL=http://127.0.0.1:4001 bun run test:browser tests/browser/reference-demo-modes.spec.ts` checks all 418 modes at desktop and phone widths against the built registry server, including tab selection, usable content, image loading, overflow, and uncaught errors. This sweep does not certify every possible interaction state.

`npm run verify:install -- --item button --installer both` and the equivalent Agent Composer case exercise fresh consumers, aliases, preservation, dependency/CSS closure, TypeScript, and production builds. The complete 368-case consumer matrix remains a separate check.

The final [browser comparison](browser-audit.md) records all 179 reference pairs, the layout and motion corrections, and remaining differences.
