# Component development

## Source ownership

| Path                                                                                                  | Responsibility                                                                                    |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `registry/components/`                                                                                | Canonical reusable components and their installable local helpers                                 |
| `registry.json`                                                                                       | Official registry item definitions, source files, dependencies, CSS, provenance, catalog metadata |
| `lib/catalog.ts`                                                                                      | Catalog/metadata validation schema                                                                |
| `preview/*-demo.tsx`                                                                                  | Prepared data, local async simulations, composition examples                                      |
| `preview/stories/`                                                                                    | Discoverable interaction/state examples importing canonical source                                |
| `preview/entries/`                                                                                    | Standalone preview entry points exporting `Demo`                                                  |
| `preview/styles.css`                                                                                  | Storybook theme, fonts and required preview CSS                                                   |
| `scripts/preview.css`                                                                                 | Standalone preview styling; keep required behavior aligned with Storybook and installable CSS     |
| `scripts/build.ts`, `scripts/validate.ts`                                                             | Registry preview/catalog build and source/hash/schema validation                                  |
| `scripts/verify-*.browser.js`, `tests/browser/`, `playwright.config.ts`                               | Browser interaction/geometry regression scenarios                                                 |
| `public/r/`, `public/previews/`, `public/catalog.json`, `public/fonts/`, `dist/`, `storybook-static/` | Generated output; regenerate through scripts, never hand-edit                                     |

Preview assets can be intentional authored inputs under `preview/assets/` or other source directories. Check `scripts/clean-generated.ts` before assuming that all of `public/` is disposable.

## Start from a behavioral brief

Use [the template](templates/component-brief.md) for a new component or a substantial interaction change. A small change can keep this information in its change description. Identify:

- The user's action, resulting states, and the stable object across those states.
- Which state belongs to the caller and which is local interaction state.
- The closest reference in [component patterns](component-patterns.md), plus intentional differences.
- Text type, layout constraints, focus behavior, async cancellation, and reduced-motion behavior.
- What will prove the interaction correct in intermediate frames, not just at rest.

Default to an existing mechanism from [motion](motion.md). Keep durations local to an independently installed component unless a shared helper has a real benefit. A shared helper must be included in every affected registry item.

## API and implementation

Use typed props and meaningful data rather than hardcoded fixture content. Support `className`/appropriate native props where useful. Document controlled versus uncontrolled state and reset behavior. IDs must be stable within a history; transition identities must also distinguish repeated visits.

Do not add a primitive library merely to render a native surface. Keep an existing primitive when it supplies the actual behavior/composition, as the membrane attachments do with shadcn/Base UI. Installed components must not import from `preview/`, Storybook, a sibling app, or a private workspace alias.

Async work enters through callbacks and abort signals where appropriate. Prevent stale results from overwriting current selection or restoring removed data. A visual busy state and disabled duplicate submission do not justify blocking unrelated navigation.

## Stories before packaging

Implement a demo using canonical source, then add stories for the states the API actually supports. Usually include default, disabled, reduced-motion inspection, long/wrapped content, narrow layout, and async busy/error/retry where applicable. Not every component needs an artificial loading state.

Exercise hover and focus, keyboard-only operation, pointer/touch, rapid reversals, resize/font changes, and reset. Keep fixture copy, simulated delays and service responses in the demo. A visual page background must not become an installed component dependency.

## Register and distribute

1. Add one `registry:component` item named `cavemio-<slug>` in [registry.json](../registry.json). Use a unique `meta.cavemio.component` slug.
2. List the canonical component first in `files`, followed by every required local helper. Omit `target` for component files so consumer `aliases.components` controls placement.
3. Add npm dependencies actually imported by installed source. Use `registryDependencies` only for real registry dependencies. Match tested versions where the repository pins them.
4. Include required keyframes/utilities/theme additions in the registry item; Storybook-only CSS is not an installation solution. Inspect how existing items declare `ui-col-in`, `ui-col-out`, `ui-fade-in`, `ui-ping`, and `ui-sheen` before adding a duplicate or incompatible name.
5. Fill all fields required by [the metadata schema](../lib/catalog.ts): `component`, `exportName`, `usage`, `accessibility`, and `previewNote`. Preserve source/license metadata for adaptations.
6. Add `preview/entries/<slug>.tsx` exporting `Demo`, importing the shared demo or canonical component. The builder resolves this exact filename from the metadata slug.
7. Add a usable installed example in [install-examples.ts](../scripts/install-examples.ts). [verify-install.ts](../scripts/verify-install.ts) discovers registry items and runs each independently through both shadcn addressing modes, plus combined cases. Update relevant catalog/install assertions when their expected entries change.
8. Build only after authored inputs are ready. The generated catalog is version 2 and contains one entry per component with relative URLs, dependencies and a source hash.

The website consumes the HTTP catalog/previews. Keep that boundary; do not introduce sibling source imports as a shortcut. A local successful build is not a publication, a public npm package, or a deployed registry.

## Documentation and review

Update the README's user-facing example and the relevant behavior audit. Add provenance and retained notices for new upstream code/assets. Use [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) to find where notices are kept.

For behavior changes, describe the trigger and before/after result, explain the chosen motion family, and link the relevant verification. Include a frame capture or small recording when it helps assess a visual change; screenshots of only the settled state cannot demonstrate an interruption fix.

Use the [verification guide](verification.md) to select checks. Avoid wholesale reformatting or unrelated cleanup. If the change only updates docs or skills, validate links, examples, frontmatter and formatting without rebuilding unchanged UI.

## Completion criteria

- The interaction works with its actual input/state model and preserves text/focus during transitions.
- Source, Storybook, registry preview, and installed consumer use the same implementation.
- All local helpers, CSS, dependencies, metadata and notices are packaged.
- Applicable checks pass, or a specific external blocker is reported with the failed command.
- Docs describe the final behavior and intentional differences. No placeholder code, invented export, broken local link, or personal absolute path remains in guidance.

For structural changes, read [architecture](architecture.md), [the glossary](../GLOSSARY.md), and [ADR 0001](adr/0001-source-distribution-and-verification.md). Preserve the website’s catalog v2 contract and primary-source fingerprint semantics.
