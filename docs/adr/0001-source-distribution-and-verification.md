# ADR 0001: Source distribution and verification ownership

Status: accepted. Recorded 16 October 2026. Source distribution records the established design; verification scope was confirmed by the user during the architecture review.

## Context

Cavemio distributes editable React source through shadcn registry items. Several items bundle shared helpers and CSS. The website is an independent HTTP consumer. Recent regressions concern text geometry and interruption, which compilation and final-state checks cannot establish.

Combined installation checks can hide missing requirements when an earlier item supplies a helper. Manual browser-script orchestration makes the strongest regression evidence difficult to repeat.

## Decision

- Keep canonical source, demo fixtures, and generated artifacts distinct. Preserve catalog v2, relative artifact URLs, consumer aliases, and the primary-file meaning of `sourceSha256`.
- Keep prompt history and response history as separate modules. Preserve distinct motion families unless a demonstrated repeated behavior justifies sharing.
- Verify every registry item in an isolated consumer through the shadcn namespace and direct-URL paths, plus separate coexistence cases. Compile a usable example for every item.
- Validate each item's source imports against its shipped files and declared dependencies before installation. Test omitted-helper and undeclared-package failures without relying on external downloads; retain real installer checks for alias, package-resolution, and CSS behavior.
- Use Playwright Test to execute the existing real-browser assertions through one command. Own isolation, lifecycle, diagnostics, and cleanup in the runner; keep story-specific geometry assertions local.
- Run code/build and Chromium checks in CI. Keep network-heavy full source-install verification explicit/manual. A failed external download is not a source failure or a pass.
- During the initial verification refactor, leave sibling website source unchanged and document its Switch/single-file mismatch. A subsequent user-authorized follow-up in `cavemio-web` resolved this mismatch with catalog-driven routes, multi-file display, and real-registry browser checks; the distribution contract remains unchanged.

## Consequences

The full install matrix takes longer than two aggregate consumers, so targeted selection is available during diagnosis. Browser tooling becomes a pinned development dependency, not an installed-source dependency. Existing runtime motion and external HTTP interfaces remain unchanged. CI does not prove source installation unless the explicit install matrix has also run.

Revisit when distribution format, supported consumers, or actual verification cost changes. A full-item fingerprint needs coordinated schema/website work rather than silently changing an existing field.
