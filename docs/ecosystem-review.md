# Authoring and verification decisions

This document records the repository’s development workflow and its verification boundaries.

## Changes adopted here

- A delegating [CLAUDE.md](../CLAUDE.md), with [AGENTS.md](../AGENTS.md) remaining authoritative.
- A [domain glossary](../GLOSSARY.md), [architecture map](architecture.md), and [decision record](adr/0001-source-distribution-and-verification.md) to make source-install and web obligations discoverable.
- Independent consumer verification through both shadcn addressing modes, plus separate coexistence cases. Prior combined-only checks could mask omitted helpers and dependencies.
- Isolated-source import validation during build and install preflight, with negative tests for omitted helpers, undeclared packages, and leaked preview imports.
- One Playwright Test command for the existing browser assertions, with automatic discovery, isolated contexts, server lifecycle, and failure evidence.
- CI for code, registry build, Storybook build, and Chromium regressions; network-heavy install verification stays an explicit command.
- Skills and contributor guidance point to these executable checks and describe their coverage limits.

## Local findings that matter

The [architecture report](architecture.md) records the accepted verification directions. There was no git history to rank changed paths, so review scope followed the recent text glitches, shared helpers, source distribution, and browser checks.

The initial sibling website review found Switch-only and single-file assumptions. A later user-authorized website follow-up replaced these with catalog-driven routes and multi-file source browsing, verified against the available registry items. The [web contract](architecture.md#website-contract-and-current-gap) records the resolution without changing catalog v2. The website also adopted registry-driven search, browser lifecycle ownership, focused contract tests, and concise contributor documentation in its development workflow.
