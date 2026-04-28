# Contributing

Cavemio Components is free and open source under [MIT](LICENSE). Contributions should keep the installed source editable, independently usable, and consistent with the existing interactions.

Use Node 24+ and Bun 1.4.3. Start Storybook with `bun run dev`. Read [AGENTS.md](AGENTS.md) when working with an agent and use [the documentation index](docs/README.md) to find focused guidance.

## Component workflow

1. Read the closest examples in [the six-component audit](docs/component-patterns.md). For new components or substantial changes, describe the API, states, stable surface, input paths, and motion in a [component brief](docs/templates/component-brief.md).
2. Implement typed canonical source in `registry/components/`. Keep demo copy, fonts, application-specific requests, and simulated uploads/generation in `preview/`. Components receive caller content and callbacks.
3. Add stories in `preview/stories/` importing canonical source. Cover meaningful states and long content. Apply [motion](docs/motion.md) and [typography and effects](docs/typography-and-effects.md) guidance, including interruption, text geometry, hover/focus, and live reduced motion.
4. Register a uniquely named `registry:component` in `registry.json`. Include all imported local helpers, required CSS/keyframes, actual npm dependencies, and shadcn dependencies. Omit component targets so consumer `aliases.components` controls placement.
5. Fill in `meta.cavemio` and add `preview/entries/<component>.tsx` exporting `Demo`. Reuse the Storybook demo where useful; both previews must import canonical source.
6. Run checks matched to the change, update usage and behavior docs, and regenerate distribution artifacts when their inputs change. Never manually edit generated JSON or bundles.

The [component development guide](docs/component-development.md) contains the ownership map and packaging details. [Repository skills](docs/skills.md) provide focused workflows for design, authoring, browser verification, and debugging.

## Validation

Use [verification](docs/verification.md) for commands, runner setup, and the browser regression map. Format touched files and run typecheck/lint for code changes. Run `bun run test:browser --grep <suite>` for changed interactions and shared-helper consumers. Confirm intermediate frames, rapid reversals, text wrapping, focus, cancellation, and reduced motion when relevant.

For distribution changes, run install-contract tests, build the registry, then run formatting/validation and the Storybook production build. Complete the registry build before consumers read regenerated artifacts. Run the npm install verification with the local registry server available; it needs network access and verifies each item alone as well as combined installs. Report an external install failure accurately rather than treating it as a pass.

Documentation-only changes need formatting, local-link/path checks, and verification against source. They do not require unrelated UI or network install suites. Add regressions for meaningful failures rather than tests that repeat implementation constants.

## Ownership and scope

Consumers own installed source. Preserve their aliases, files, and configuration; never add a default `--overwrite` flag. Keep the website and registry independent: the website consumes the versioned HTTP catalog.

Keep changes within the requested component or bug. Authentication, databases, hosting, deployment, and publication are separate tasks. Preserve unrelated working-tree changes.

## Licenses

Retain required notices for copied source and assets. See [third-party notices](THIRD_PARTY_NOTICES.md) before importing code, fonts, or reference fixtures. Include source headers and generated bundle notices when distributing adaptations.
