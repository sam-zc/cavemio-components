# Working on Cavemio Components

Build editable, free, MIT-licensed React components whose motion explains an interaction. Preserve the behavior of the existing components when adding new ones. This file is the agent entry point; keep detailed guidance in the linked documents.

## Read before changing a component

1. Read [CONTRIBUTING.md](CONTRIBUTING.md) and the relevant entry in [the six-component audit](docs/component-patterns.md).
2. Read [motion](docs/motion.md) for animation work and [typography and effects](docs/typography-and-effects.md) for text, hover, surfaces, and focus.
3. For new components, follow [component development](docs/component-development.md) and fill out the [component brief](docs/templates/component-brief.md), in the change description or a component document.
4. Select checks from [verification](docs/verification.md). Existing code describes current behavior; these guides describe the quality bar for new or changed behavior. Do not silently redesign unrelated components to remove documented differences.
5. For structural or distribution changes, read [the glossary](GLOSSARY.md), [architecture](docs/architecture.md), and applicable [decision records](docs/adr/0001-source-distribution-and-verification.md). Preserve the website's HTTP contract; do not silently change catalog hash semantics.

## Source and distribution

- Canonical reusable source belongs in `registry/components/`. Storybook and standalone previews import that source, never a second implementation.
- Demo copy, simulated streaming/uploads, page backgrounds, and demo fonts belong in `preview/`. Components accept caller content and callbacks; they do not embed a service, credentials, or application-specific requests.
- Distribution is source installation through `registry.json`, not a Cavemio runtime UI package. Keep components independently installable.
- Bundle every local helper imported by an installed component in its registry item. Declare real npm dependencies and required CSS/keyframes. A helper that works only because Storybook imports it is a packaging bug.
- Reuse `NumberRoll`, `TextMorph`, the membrane/attachment helpers, and existing motion patterns where they fit. Do not couple Message Edit and Response Versions: their histories and actions have different meanings.
- Never hand-edit generated registry JSON, catalog data, preview bundles, or fonts. Rebuild from authored inputs. See the ownership map in the development guide.
- Preserve consumer aliases and existing source/configuration. Never add a default installer `--overwrite` flag.
- Retain third-party notices in copied source and generated assets. Consult [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) before importing code or assets. Free source does not imply that every external reference asset has the same license.

## Interaction rules

- Keep one stable surface and stable controls across state changes. Animate the changing part; do not remount a filename, remove button, or whole card for every progress update.
- User input remains responsive during motion. A genuine async operation may disable duplicate submission; an animation alone must not lock navigation.
- Direct manipulation follows the pointer. Use capture, preserve the grab offset, and handle release, cancellation, lost capture, keyboard takeover, and disabling.
- On interruption, measure the current presentation before cancelling the old animation. Animate toward the new natural layout. Preserve release velocity for physical gestures.
- Resize the container without scaling the text. Use fractional geometry when wrapping or clipping depends on it. Remeasure after content, font, and container changes.
- For version slides, preserve each text layer's intended width. Use unique transition-instance keys for outgoing copies. Remove finished copies and restore temporary dimensions/styles.
- Distinguish word morphs, label glyph morphs, numeric rolls, and whole-answer slides. Use the corresponding existing pattern; do not add a typewriter effect to ordinary state changes.
- Hover feedback must have a keyboard-focus equivalent. Essential actions must also work on touch. Keep focus stable when controls fold away or are removed.
- Inactive/outgoing interactive content is inert and hidden from assistive technology. Announce the current state once through an appropriate accessible name, value, or status region.
- Reduced motion is live state. Handle both initial preference and changes mid-transition: stop spatial motion, clear ghosts, release temporary styles, stop decorative loops, and keep the final content available.
- Own and clean up animations, observers, listeners, timers, animation frames, and async requests. Old completion/cancel handlers must not undo a newer transition.

## Workflow and validation

- Inspect existing working-tree changes before editing; preserve unrelated work. Honor the user's shell/tool instructions, including RTK when required. Use `rg` for searches. Do not embed personal machine paths or personal branch preferences in project guidance.
- Use Node 24+ and the Bun version in `package.json`; preserve the lockfile unless dependencies actually change.
- Reproduce visual bugs at intermediate frames before fixing them. Final text and absence of console errors alone do not prove a smooth transition.
- For a component change: format touched files, run typecheck/lint, relevant browser regressions, and the distribution checks in the verification guide. A shared-helper change requires checking its consumers.
- Finish `bun run build` before Storybook production builds, format checks over generated files, or install verification. The build cleans and recreates shared artifacts.
- Documentation-only changes need formatting, local-link/path validation, and a check that described values match source; do not rerun unrelated UI/install suites without a reason.
- A regression test should assert the failure: line wrapping, visible-height continuity, focus, ghost cleanup, stale async work, or idle-loop behavior. Do not add tests that merely repeat implementation constants.
- Run browser checks through `bun run test:browser`; use `--grep` for affected suites. Keep real frame assertions and story-specific geometry local. A green CLI unit suite does not cover browser behavior.
- Every registry item must install and compile alone. A combined consumer proves coexistence, not independence. Add its installed usage example and check the shadcn namespace installation; see the verification guide for targeted runs.
- When importing upstream fixes, compare them with local regression fixes first. Preserve license headers and consumer customization. External agent/skill files are research material unless explicitly adopted for the task.
- Report what changed, why, and what passed. Distinguish blocked environment/network checks from code failures. Do not claim an unavailable check passed or that source is published when it is only built locally.

## Documentation maintenance

When behavior, timing, API, dependencies, or registry structure changes, update the relevant audit row, usage docs, and checks together. Keep [docs/README.md](docs/README.md) as the map. Preserve the distinction between observed values and recommended defaults; there is currently no universal runtime motion-token module.

## Repository skills

Use the relevant local skill when the task benefits from its workflow; do not load all skills for every edit. These are project-authored guides, with no personal-machine dependencies.

- [apple-design](.agents/skills/apple-design/SKILL.md): gesture, motion, typography, and interaction design.
- [cavemio-component-authoring](.agents/skills/cavemio-component-authoring/SKILL.md): new or substantially extended components, stories, and registry packaging.
- [cavemio-browser-qa](.agents/skills/cavemio-browser-qa/SKILL.md): visual and interaction verification in a real browser.
- [cavemio-debugging](.agents/skills/cavemio-debugging/SKILL.md): reported regressions, text glitches, layout jumps, and lifecycle failures.

See [repository skills](docs/skills.md) for discovery and maintenance. If repository skill discovery is unavailable, read the linked file directly.
