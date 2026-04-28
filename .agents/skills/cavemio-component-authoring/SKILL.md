---
name: cavemio-component-authoring
description: Add or substantially extend a Cavemio React component, including its public API, stories, shadcn registry packaging, and usage documentation. Use for component development rather than unrelated application features.
---

# Component authoring

Read [AGENTS.md](../../../AGENTS.md), [component development](../../../docs/component-development.md), and the closest pattern in [the component audit](../../../docs/component-patterns.md). Use the [component brief](../../../docs/templates/component-brief.md) for a new component or substantial interaction change; it can live in the change description.

- Establish caller-owned content, state, and async work before designing the API. Keep prepared answers, simulated generation/uploads, fonts, and demo fixtures in previews.
- Implement in `registry/components/`. Storybook and `preview/entries/<component>.tsx` must import canonical source; the latter exports `Demo`.
- Reuse helpers when their behavior fits. Message Edit and Response Versions remain independent components despite sharing Number Roll.
- Include imported local helpers, required keyframes/CSS, actual npm dependencies, and valid `meta.cavemio` metadata in the registry item. Preserve consumer aliases and customized files.
- Add a usable installed-source example in `scripts/install-examples.ts`. Verify the item in an isolated consumer through both shadcn addressing modes; combined installation can mask missing helpers. Preserve the [web/catalog contract](../../../docs/architecture.md).
- Add stories for meaningful states and a focused regression for changed behavior. Follow [verification](../../../docs/verification.md); complete the registry build before checks that consume regenerated artifacts.
- Update usage docs and the relevant motion/audit guidance. Preserve source and asset notices according to [third-party notices](../../../THIRD_PARTY_NOTICES.md).

The requested component determines scope. A component contribution does not by itself call for hosting, authentication, a database, deployment, or publication.
