# Developer documentation

- [Animated Video Player](video-player.md): API, adapters, DRM, motion, accessibility, diagnostics, and installation.
- [Video player verification](video-player-verification.md): measured results and platform limits.

Start with [AGENTS.md](../AGENTS.md) for agent instructions or [CONTRIBUTING.md](../CONTRIBUTING.md) for the contributor workflow. [The main README](../README.md) covers usage and installation.

For structural work, start with [architecture](architecture.md), [domain terms](../GLOSSARY.md), and [ADR 0001](adr/0001-source-distribution-and-verification.md). The [workflow decisions](ecosystem-review.md) record authoring and verification choices.

| Document                                                 | Use it for                                                                                                                       |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [Component patterns](component-patterns.md)              | Source-based audit of Answer Paper, Drop Zone Membrane, Inline Rewrite, Message Edit, Response Versions, and Clarifying Question |
| [Motion](motion.md)                                      | Engine choice, timing families, interruption, geometry, cleanup, and reduced motion                                              |
| [Typography and effects](typography-and-effects.md)      | Text roles, wrapping, hover/focus, surfaces, shadows, blur, and progress effects                                                 |
| [Component development](component-development.md)        | Source ownership, API design, stories, registry packaging, and completion criteria                                               |
| [Verification](verification.md)                          | Commands, test selection, frame-level checks, and failure diagnosis                                                              |
| [Repository skills](skills.md)                           | Local design, authoring, browser verification, and debugging workflows                                                           |
| [Component brief template](templates/component-brief.md) | A small specification for a new component or substantial interaction change                                                      |
| [Research and decisions](research.md)                    | Documentation structure and local architectural decisions                                                                        |
| [Distribution](../THIRD_PARTY_NOTICES.md)                | Project license reference                                                                                                        |

The audit was checked against local source on **16 October 2026**. It records implementation details, not a promise that every edge case has been certified. The motion and typography guides are the standard for new work. Existing differences are documented explicitly rather than hidden behind a claim that all six components share identical values.

The library also contains Step Timeline and Request Lifecycle Preview. They follow the same contribution and verification process; the six-component audit focuses on the components named above. Their separate `lifecycle-motion.ts` family remains intact.

- [Command Palette](command-palette.md): public API, component brief, motion, source distribution, and browser coverage.

- [Kbd](kbd.md): keyboard keycaps, shortcut callbacks, propagation, and command menu integration.

- [Text Morph and Number Roll](text-and-number-primitives.md): standalone registry entries, demos, APIs, motion, and isolated install checks.

- [Theming](theming.md): brand scales, semantic colors, Storybook controls, and theme distribution.

## Select

See [Select](select.md) for the expanding pill, labeled fields, keyboard listbox behavior, and distribution contract.

## Theme Toggle

See [Theme Toggle](theme-toggle.md) for the sun/moon control, optional circular page wipe, synchronous theme integration, fallback cases, and installation checks.
