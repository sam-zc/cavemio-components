---
name: cavemio-browser-qa
description: Verify Cavemio components in a real browser, including Storybook interaction, transition frames, wrapping, focus, responsive layout, and reduced motion. Use for visual verification and motion regressions.
---

# Browser verification

Read [verification](../../../docs/verification.md) for the runner, committed scripts, coverage map, and review matrix. Read the relevant entry in [component patterns](../../../docs/component-patterns.md) to distinguish intentional motion from a defect.

Use `bun run test:browser` for the committed regressions, or `bun run test:browser --grep message-edit` for a focused run. Playwright Test discovers the exported `.browser.js` suites and owns isolated contexts, Storybook lifecycle, timeouts, traces, and screenshots. Use an interactive browser tool for investigation when helpful; the suites are no longer CLI function snippets.

The default runner reuses an existing local Storybook outside CI or starts one it owns. `STORYBOOK_URL` selects a caller-owned server. Keep story-specific actions and frame measurements in their suites; avoid adding broad runner configuration for every DOM detail. See the verification guide for browser installation, reports, and coverage limits.

For a transition change, inspect:

- The triggering pointer/keyboard action and the final state.
- Natural line breaks and bounds at intermediate frames, including just before temporary width/height styles clear.
- Reversal from the current visible geometry, rapid navigation, and reset/unmount while moving.
- Outgoing panes/letters becoming inert and being removed, with no duplicate keys or stale completion callbacks.
- Focus after editing, folding, removal, and upload/retry actions.
- Narrow layouts, long content, resize/font changes, and reduced motion on mount and enabled during motion.

Prefer assertions about visible behavior: text rectangles, line breaks, continuity, focus, or cleanup. Do not declare a transition healthy solely because its final text matches or the console is quiet. Keep screenshots and transient browser logs out of component source. Report the checks actually run and remaining coverage gaps; the current scripts do not certify every browser, theme, locale, or RTL layout.
