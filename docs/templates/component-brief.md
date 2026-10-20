# Component brief

Use this as a specification for a new component or substantial interaction change. Keep only relevant sections; record the answers in the change description or a component document. This template is not an extra approval step.

## User outcome

What action does the user take, what changes, and what should remain visibly stable? Name the closest existing [component pattern](../component-patterns.md) and explain meaningful differences.

## State and content

| State                                    | Trigger                 | Visible content/actions | Focus destination | Exit/cancel behavior |
| ---------------------------------------- | ----------------------- | ----------------------- | ----------------- | -------------------- |
| Initial                                  | Mount or supplied state | Define                  | Define            | Define               |
| Active                                   | User input              | Define                  | Define            | Define               |
| Complete / error / disabled, if relevant | Define                  | Define                  | Define            | Define               |

Describe caller-owned versus internal state, stable IDs, reset semantics, supported text type, and any async callback/abort contract.

## Motion and effects

| Part                  | Stable anchor | Animated property | Mechanism / timing family | Interruption | Reduced motion |
| --------------------- | ------------- | ----------------- | ------------------------- | ------------ | -------------- |
| Surface               | Define        | Define            | Select from motion guide  | Define       | Define         |
| Text / status         | Define        | Define            | Define                    | Define       | Define         |
| Hover / focus / press | Define        | Define            | Define                    | Define       | Define         |

Explain how text avoids reflow/clipping during geometry changes, how dimensions update after fonts/resize, and who cleans up outgoing content and temporary styles. List typography roles, token usage, any intentional literal colors, and touch/keyboard affordances.

## Distribution

Record canonical files, local helper files to bundle, npm/registry dependencies, required CSS, metadata slug/export, preview entry, stories, and source/license provenance. Keep application/demo content outside installed source.

## Evidence

List the user scenarios, intermediate-frame assertions, and applicable [checks](../verification.md). Record actual pass/fail results and any unverified coverage. For a bug, include the smallest failing reproduction and why the fix addresses it.
