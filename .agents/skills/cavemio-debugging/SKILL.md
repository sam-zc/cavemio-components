---
name: cavemio-debugging
description: Diagnose and fix reported Cavemio component bugs, especially text glitches, interrupted animations, layout jumps, stale async work, and focus failures. Use when behavior is broken or regressed.
---

# Diagnose component regressions

Read the affected component's [audit entry](../../../docs/component-patterns.md) and [verification guidance](../../../docs/verification.md). Preserve unrelated working-tree changes.

1. Reproduce the user's sequence in the actual story and record viewport, content, state, and timing. If the description is incomplete, investigate plausible paths while requesting only the missing detail that matters.
2. Inspect the owning source and the changing geometry/state. For subtle text failures, compare natural line breaks with intermediate rendered frames. Check fractional widths, visible height at interruption, outgoing identity, and temporary styles before changing easing.
3. For a non-obvious failure, test a small set of hypotheses. Inspect capture/cancel order, stale completion callbacks, reduced-motion cleanup, observers, and async ownership where relevant.
4. Fix the layer that owns the failure. A shared-helper change requires checking its consumers; consult the regression map. Avoid rewriting all motion families to solve one component's defect.
5. Add or refine a focused regression that fails for the observed behavior, then run relevant checks. Confirm reversal, cancellation, and cleanup when the fix affects animation lifecycle.

Use `bun run test:browser --grep <suite>` for motion failures and `npm run verify:install -- --item <slug>` for isolated packaging failures. Check [architecture](../../../docs/architecture.md) before changing a shared module or the catalog contract; the sibling website has a documented compatibility gap that predates this verification work.

Do not hide a defect by delaying input, disabling navigation during animation, or leaving text permanently fixed-width. Distinguish component failures from runner/server/network failures; retry transient external failures only a bounded number of times and report unresolved checks accurately.
