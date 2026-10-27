# Browser comparison

Checked in Chromium on 28 October 2026. The current pass compares all 179 reference demo scenes and all 418 modes against the reference captures, with paired screenshots, accessibility snapshots, control inventories, and computed transition/animation declarations. Every pair loads without an uncaught browser error. The exact demo import supersedes the earlier comparison of simplified Cavemio fixtures.

## Demo parity

The scenes retain the original sample data, copy, nested controls, tabs, and simulated callbacks. They reuse canonical registry components. The [scene manifest](../../preview/reference/scenes.json) records canonical dependencies and local media paths for all 179 scenes. The same scene entry is used by Storybook, standalone previews, and the native website preview.

The comparison corrected font smoothing and the palette demo's typographic ellipsis. Earlier local checks corrected a pruned import alias that blanked three scenes and a malformed CSS custom property that broke preview positioning, mode controls, and clipped chart tables. Mention Menu was rechecked after its nested editor finished loading.

Most raw computed-style differences come from several elements sharing a class while having different stagger/digit/enter/leave timings. Compare the set of profiles for each class rather than assuming that a repeated class identifies one element. Number Roll's local implementation retains its regression fixes; transient chart digit profiles can differ. Drop Zone Membrane retains its explicit Browse files accessible name. Command Palette retains an explicit trigger label and spoken Kbd shortcut, while its visible Search… label matches. Log Stream contains live timestamps and event counts, so sequential captures can differ.

The [per-component audit](browser-audit.json) lists every checked mode. New captures can be generated during a browser comparison.

## Verification

- All 179 scenes and 418 modes pass at 1000px and 320px, covering mode selection, usable width, loaded images, overflow, and uncaught errors.
- All 183 native website previews pass source equality, asset loading, desktop/phone layout, and uncaught-error checks. All documentation routes and narrow props tables pass their route sweep.
- Website checks cover editing and sending, upload/remove, rewrite controls, clarifying answers, passive live keycaps, version navigation, sidebar motion/filtering, and preserving an unsent draft across unrelated settings.
- Focused browser checks confirm deployment failure/recovery, saving a sample crop, actual local voice playback, and synchronized icon/pill/segmented theme controls without changing the host document theme.
- Existing Theme Toggle and page-wipe regressions pass. The Command Palette highlight regression passed its isolated rerun after one intermittent interruption-frame failure during the broader run. Registry typecheck, lint, unit tests, build and schema/import/hash validation pass, as does the Storybook production build including local demo media. Website typecheck/build, unit tests, source sync, and format checks pass. Website lint retains two existing accessibility warnings in Kanban Board and Pill Select.
- Theme Toggle installs and compiles in fresh consumers through both direct JSON and namespace addressing, including the added variants and their Text Morph helper. The complete consumer-install matrix was not rerun for fixture-only changes.

## Scope and limits

This pass establishes the same original demo configurations and checks their controls, rendering, and declared motion. It does not certify pixel identity at every animation frame or every possible gesture, interruption, theme, locale, and browser. The eleven established Cavemio implementations retain local APIs and regression fixes; the newer Theme Toggle variants extend its API without replacing the original button behavior.

Reference media is cached only for local previews under the separate [media notices](../../preview/reference/MEDIA_NOTICES.md). No real account, payment, email, microphone, or upload service is exercised. The existing Next.js version emits a security-upgrade advisory; compilation and the requested retry succeed.

No files were staged and no commits were created.
