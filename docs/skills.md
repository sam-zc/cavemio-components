# Repository skills

These project-authored skills live in `.agents/skills/` and travel with the repository. They use the project's MIT license and link to the maintained guides instead of duplicating them. They do not depend on a contributor's home directory or a paid service.

| Skill                                                                                 | Use it for                                                                                         |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [apple-design](../.agents/skills/apple-design/SKILL.md)                               | Fluid interaction design, gesture continuity, text geometry, surfaces, and hover/focus feedback    |
| [cavemio-component-authoring](../.agents/skills/cavemio-component-authoring/SKILL.md) | Public API, canonical source, stories, packaging, and documentation for new or extended components |
| [cavemio-browser-qa](../.agents/skills/cavemio-browser-qa/SKILL.md)                   | Real-browser transition frames, text layout, accessibility interactions, and regression evidence   |
| [cavemio-debugging](../.agents/skills/cavemio-debugging/SKILL.md)                     | Reproducing and fixing a reported behavior or performance regression                               |

Agents that support repository skill discovery can load them directly. Otherwise, read the linked `SKILL.md` when its task applies. Where supported, explicit invocations are `$apple-design`, `$cavemio-component-authoring`, `$cavemio-browser-qa`, and `$cavemio-debugging`. If a personal skill has the same name, use the repository path for this project's conventions.

The local `apple-design` skill documents Cavemio's interaction principles; concrete behavior and values come from the six-component audit. The other skills cover recurring authoring, verification, and debugging work in this library. No remote skill installer is required.

Add another skill when a recurring task needs specialized decisions that the existing guides do not cover. Keep its trigger narrow, link shared guidance, and validate frontmatter and relative links. Avoid importing unrelated deployment, orchestration, or document-production workflows into ordinary component development.

The [workflow decisions](ecosystem-review.md) describe the checks used by these skills. Browser QA now uses the repository’s Playwright Test command, authoring includes isolated installed-source examples, and debugging distinguishes website compatibility from runtime regressions. `CLAUDE.md` delegates to the shared guide; there is no second maintained skill implementation.
