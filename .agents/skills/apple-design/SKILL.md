---
name: apple-design
description: Design or review Cavemio gestures, animation continuity, hover and focus feedback, typography, and surface transitions using the repository's existing motion families. Use for interaction design and motion work.
---

# Cavemio interaction design

This guide covers Cavemio's fluid interactions, text geometry, and motion continuity.

Read [motion](../../../docs/motion.md), then the relevant component in [the audit](../../../docs/component-patterns.md). Read [typography and effects](../../../docs/typography-and-effects.md) when changing text, surfaces, or feedback.

- Identify what persists across the interaction: paper, message bubble, attachment, answer region, or question shell. Keep that object and its stable controls mounted.
- Choose the existing mechanism that fits: direct pointer tracking plus a release spring, measured geometry, word matching, label glyphs, numeric rolls, or directional panes. Preserve the relevant component family's timing; there is no universal spring or timing token module.
- Make gestures track input directly. Preserve grab offset and velocity. On interruption, capture the current presentation before cancelling previous animation work.
- Grow containers without scaling text. Measure natural layout and preserve each exiting text layer's width. Release temporary styles after settling; remeasure after wrapping, font, and container changes.
- Make hover feedback available through keyboard focus. Check touch, disabled state, cancellation, and reduced motion, including preference changes while moving.
- Verify intermediate frames and rapid reversals using [the browser checks](../../../docs/verification.md). A correct endpoint does not establish continuity.

Use these principles to preserve Cavemio's established character. Add surface effects, motion, and typography changes only when they support the interaction. Implementation values come from this repository.
