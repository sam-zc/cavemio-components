# Verification

Use checks that match the change. `bun run test` covers install-contract tests; `bun run test:browser` runs the real-browser regressions. Build success alone does not verify motion.

## Commands and order

Use Node 24+ and the Bun version in `package.json`. Commands here are tool-neutral; use the required RTK wrapper when your environment asks for it (`rtk proxy bun run typecheck`, for example).

```sh
bun install --frozen-lockfile
bun run dev
```

Storybook runs on port 6006. In another terminal, after implementation:

```sh
# Format the files you changed; avoid unrelated whole-repo rewrites.
bunx prettier --write path/to/changed-file.tsx
bun run typecheck
bun run lint
bun run test
bun run build
bun run format:check
bun run build-storybook
bun run validate
```

Finish `build` first. It cleans/recreates registry artifacts and fonts used by the other checks. Do not run a production Storybook build or installer against partially regenerated files. The existing runtime browser checks can run during authoring; avoid rebuilding static artifacts while those checks depend on them.

For the actual source-install contract:

```sh
# Separate terminal; reuse an existing server if it is already running.
bun run serve

# Main terminal. The explicit IPv4 URL matches the server's loopback binding.
CAVEMIO_REGISTRY_URL=http://127.0.0.1:4001/ npm run verify:install
```

Use **npm** for this last script: it intentionally creates npm consumers and requires npm's executable path. The default matrix has **15 fresh-consumer cases**: fourteen isolated items and one combined installation through the shadcn `@cavemio` namespace. `--installer official` checks direct registry URLs; `--installer both` runs both addressing modes (30 cases). Each case checks source/helpers, dependencies, CSS, consumer aliases, preservation of source/configuration, TypeScript, and a production build of its usage example. Temporary consumers are removed after each case and in `finally`.

```sh
# Inspect the matrix without installing anything.
npm run verify:install -- --list
# One item through the namespace.
npm run verify:install -- --item response-versions
# One item through one installer, for diagnosis.
npm run verify:install -- --item response-versions --installer official
# Combined coexistence cases only; this does not prove independent installation.
npm run verify:install -- --combined
```

`--installer` accepts `namespace` (default), `official` (direct URL), or `both`. `--item` uses the metadata slug; unknown values fail. New registry items need a usable example in [install-examples.ts](../scripts/install-examples.ts). Examples import installed source and render its actual public props; merely importing an unused symbol is insufficient.

Before npm runs, the command validates the selected HTTP items with [the install contract](../lib/install-contract.ts): imports can resolve only to shipped files or declared packages (plus host React/React DOM). Required keyframes come from the example's independent visual requirements. Registry build validation uses the same isolated-source check, and [negative regressions](../lib/install-contract.test.ts) prove missing helpers, undeclared packages, and preview imports fail. This checks the current self-contained item format; future items importing another registry item's files need explicit contract support, not a permissive workspace fallback.

The isolated-source check does not install npm packages, validate third-party package exports, or exercise shadcn alias/CSS rewriting. Those remain responsibilities of the real consumer matrix. Keep these results distinct when downloads are unavailable.

The matrix needs npm/shadcn network access and takes longer than an aggregate-only check. A phase has a bounded timeout; the child is terminated before its consumer is removed. Report an unavailable download as an external check failure, not a pass. Keep full install checks explicit/manual; CI's build and browser checks do not certify installation.

## Browser runner

Install the pinned development dependencies and the matching browser once:

```sh
bun install --frozen-lockfile
bunx playwright install chromium
bun run test:browser
```

[Playwright configuration](../playwright.config.ts) owns Storybook startup/readiness, isolated contexts, one worker, bounded timeouts, and failure evidence. Locally it reuses Storybook on `127.0.0.1:6006` when available; otherwise it starts an owned server. CI starts its own server. An explicit `STORYBOOK_URL` uses the caller's server and never stops it.

```sh
bun run test:browser --list
bun run test:browser --grep 'message-edit|response-versions'
bun run test:browser --grep clarifying-question --headed
STORYBOOK_URL=http://127.0.0.1:6007 bun run test:browser
bunx playwright show-report
```

The runner discovers exported `scripts/verify-*.browser.js` suites through [components.spec.js](../tests/browser/components.spec.js). They retain the existing interaction and intermediate-frame assertions. They are **no longer Playwright CLI `run-code` snippets**. Each suite gets an isolated context and reports its scenario results as an attachment. Retries default to zero so a flake is visible.

The tested engine is Chromium. Answer Paper's touch scenario uses Chromium's CDP input dispatch; a different browser matrix requires deliberate adaptation. `PLAYWRIGHT_CHANNEL=chrome` may select installed Chrome for local investigation, but CI uses the pinned Playwright Chromium build. Do not claim other-engine coverage from that option.

Do not format watched files or run Storybook production builds during a dev-server browser run. HMR can reset a live upload or transition; inspect traces for navigation/reload before weakening an assertion. Run builds first, then the browser suite against a stable server.

HTML reports and failure screenshots/traces live in ignored `playwright-report/` and `test-results/`. Open reports only when needed; avoid checking disposable output into source. An interactive browser tool remains useful for reproducing a new problem, but committed regressions run through the repository command.

## Continuous integration

[Check workflow](../.github/workflows/check.yml) installs locked dependencies, runs format/type/lint/install-contract checks, builds the registry, builds Storybook, and runs Chromium regressions. It uploads browser evidence on failure, has read-only repository permissions, and does not commit, push, or publish artifacts. A successful local run verifies the same commands, not that the hosted workflow has executed.

## Regression map

| Changed area                          | Committed checks                                                                                                                                                                                                                                                                                |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Answer Paper                          | [verify-answer-paper.browser.js](../scripts/verify-answer-paper.browser.js): drag/keyboard levels, reversals, re-grab, cancel, takeover, mobile/touch, disabled/reduced motion                                                                                                                  |
| Drop Zone Membrane / physics / upload | [verify-drop-zone.browser.js](../scripts/verify-drop-zone.browser.js): picker/drop/paste, acceptance, cancellation, retry, replacement, focus, reduced motion                                                                                                                                   |
| Attachment state transitions          | [verify-attachment-transitions.browser.js](../scripts/verify-attachment-transitions.browser.js): stable anchors, state changes, wrapping, progress, rapid switching, idle behavior                                                                                                              |
| Message Edit                          | [behavior](../scripts/verify-message-edit.browser.js) and [text frames](../scripts/verify-message-edit-text.browser.js): editor/copy/history, unique keys, fixed text layout, live reduced motion                                                                                               |
| Response Versions                     | [behavior](../scripts/verify-response-versions.browser.js) and [text frames](../scripts/verify-response-versions-text.browser.js): generation/history, inert exits, line breaks, reversal-height continuity                                                                                     |
| Clarifying Question                   | [behavior](../scripts/verify-clarifying-question.browser.js) and [text frames](../scripts/verify-clarifying-question-text.browser.js): keyboard/focus, custom/multiple/skip, highlight resize, folding/reset, glyph cleanup                                                                     |
| Command Palette                       | [verify-command-palette.browser.js](../scripts/verify-command-palette.browser.js): button/dialog text geometry, equal gutters, chips/removal, icons, responsive help footer, search/nesting, focus, async retry/stale completion, controlled/default-open, narrow viewport, live reduced motion |
| Inline Rewrite                        | No dedicated committed suite yet. Exercise Length/Tone/WithoutHighlight stories; add a focused regression for a changed behavior                                                                                                                                                                |
| TextMorph                             | Clarifying Question text regression, plus Inline Rewrite label/status and drop-zone label scenarios                                                                                                                                                                                             |
| NumberRoll                            | Version counters, clarifying multi-select count, attachment percentage, Inline Rewrite count/labels as applicable                                                                                                                                                                               |

## A visual failure must have a visual assertion

1. Reproduce the user's action on the real story, not an isolated mock that bypasses its layout.
2. Wait for font readiness when measuring stable typography. Also test font/resize changes when that is the failure trigger.
3. Inspect natural text bounds and line breaks at the start, during motion, just before fill ends, and after temporary styles are released. `Range.getClientRects()` can expose a word falling onto another line. Compare with a small subpixel tolerance rather than strict float equality.
4. Pause/scrub the real animations for deterministic frame assertions. For live preference tests, pin an active transition early and then enable reduced motion; verify cancellation, removed ghosts, and clean temporary styles.
5. Reverse while still moving. Compare the new animation's start with the previous visible position/height, not its previous target.
6. Verify both actual user gestures and final state: correct text, no duplicate keys, stale panes, hidden active words, or trapped/lost focus.

Expected clipping/reveal is different from accidental wrapping. A folding body intentionally becomes clipped; its text should retain its layout while it fades. A receipt intentionally truncates; its complete accessible answer must remain. A transitioning text width must not move the last word onto a hidden line before snapping back.

## New-component review matrix

| Dimension     | Inspect                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| Input         | Pointer, touch where supported, keyboard, focus-within, disabled, cancellation                           |
| Text          | Short/long/multiline/unbroken strings, empty states, rich text if supported, font load, larger text/zoom |
| Layout        | Wide and 320px viewports, resize during motion, bounds/overflow, stable anchors                          |
| Timing        | Rapid reversals, reset/unmount mid-transition, late async results, actual progress                       |
| Preferences   | Reduced motion on mount and enabled mid-transition; future motion after disabling it                     |
| Accessibility | Names/values/status, inert outgoing content, focus restoration, full answer access                       |
| Performance   | Idle simulation sleeps, observers avoid animation-frame loops, progress does not remount stable content  |
| Packaging     | Canonical imports, standalone preview, aliases/dependencies/CSS, preserved notices                       |

Use additional browser engines, RTL/localized content, or interactive children when the changed API claims to support them. Do not report those as covered by the existing Chromium scripts.

## Documentation and skill changes

Run `bun run format:check`, check every new/changed local Markdown target and code path, and verify described commands/values against source. For skills, validate required `name`/`description` frontmatter, matching folder names, readable relative links, no unresolved scaffolds, and realistic task routing. An available skill-creator validator can help; no personal tool path is required by this repository. Do not run network installers for prose-only changes.

Kbd live keys: [held-key regression](../scripts/verify-kbd-live.browser.js) checks platform detection, 1px hold/release geometry, passive events, blur, disabled/static modes, and reduced motion.

Kbd: [browser regression](../scripts/verify-kbd.browser.js) covers shortcut callbacks, native activation, propagation, repeat/composition suppression, disabled/passive modes, and listener cleanup. Run `bun run test:browser --grep 'kbd|command-palette'` for Kbd and its menu consumer; install each through both adapters with `--item kbd` and `--item command-palette`.

Command Palette highlight geometry: [nested-page regression](../scripts/verify-command-palette-highlight.browser.js) checks visible highlight bounds on every frame of opening, closing, returning from nested pages, interrupted toggles, scrolling, and reduced motion, plus entry/hover alignment and keyboard navigation. Run `bun run test:browser --grep command-palette` for both palette suites.

Theme Toggle: run `bun run test:browser --grep theme-toggle` for the icon and optional document wipe. The [wipe regression](../scripts/verify-theme-toggle-wipe.browser.js) checks intermediate frames, shared instances, pre-capture reversal, callback counts, unmount cleanup, resize, live reduced motion, and unavailable/skipped/failed transitions. Verify the bundled helper in fresh consumers with `npm run verify:install -- --item theme-toggle --installer both`.
