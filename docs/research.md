# Implementation decisions

The [component audit](component-patterns.md) describes the current implementations. [Architecture](architecture.md) documents source ownership, distribution, and website integration.

## Local architecture decisions

- **Source installation:** official shadcn registry items copy editable source into the consumer's project. A component may include multiple helper files. Catalog v2 exposes one discoverable item per component, with dependencies, hashes, and install/preview URLs. Installation uses shadcn with the @cavemio namespace or manual source copying; no Cavemio runtime UI package is published.
- **Canonical previews:** Storybook stories and explicit `preview/entries/<component>.tsx` demo exports use the same canonical source. The build does not embed component-specific props. Storybook now covers multiple components and meaningful states.
- **Application ownership:** prepared answers, generated response history, uploads, and persistence belong to the caller. Demo fixtures and simulated async work stay outside installed components.
- **Separate histories:** Message Edit versions represent edited user prompts; Response Versions represent assistant answers for a prompt. They remain independent, sharing Number Roll where appropriate.
- **Several motion families:** Answer Paper and Inline Rewrite match words; Text Morph handles changing labels; Number Roll handles numeric text; Message Edit and Response Versions move panes; Clarifying Question folds a shell and moves an active-row plate; the membrane uses a physical simulation. Consistency comes from continuity, stable text layout, focus, cleanup, and reduced motion rather than replacing these with one animation.
- **Regression preservation:** local fixes preserve fractional text width in version transitions, capture visible height before interruption, use unique outgoing identities, and clean up glyph animations when reduced motion changes. Future changes must retain those properties.

This document supersedes earlier notes describing Answer Paper as a simple opacity blend and Storybook as a single-story preview. Use the current audit for implementation details and the linked source when behavior changes.
