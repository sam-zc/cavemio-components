# Theme Toggle

One circular button changes between a sun and a crescent moon. The surface stays in place; rays retract as a moving SVG mask reveals the moon. This is one visual variant with light and dark states.

## State and ownership

```tsx
import { ThemeToggle } from "@/components/theme-toggle";

<ThemeToggle theme={theme} onThemeChange={setTheme} />;
```

The caller owns the document theme, storage, and any provider integration. With no `theme`, the button keeps local state starting from `defaultTheme="light"`. `onThemeChange` receives the next mode in either configuration. A controlled value only changes when the caller supplies it. A prevented native `onClick` cancels activation; `disabled` blocks activation.

The accessible name describes the destination, `aria-pressed` indicates dark mode, and Enter/Space use native button activation. Focus stays on the button. `aria-label`, `className`, `style`, and other native button props can be supplied. `size` defaults to 48px with a minimum 44px hit area.

## Motion and surfaces

The ray group rotates 45 degrees, shrinks, and fades over 420ms using `cubic-bezier(0.16, 1, 0.3, 1)`. A translating mask and expanding center disk form the crescent. CSS transitions reverse from their current presentation, with no timers, outgoing copies, or animation lock. Media-query utilities settle motion immediately when reduced motion is enabled, including during a transition. Every instance has its own React-generated mask ID.

The button deliberately uses white/black surfaces and opposite glyph colors, independent of brand colors. Focus uses the host ring token. The preview shows the default 48px button on a full white/black surface, with With wipe selected initially and a Without wipe tab. The website binds the demo to its shared theme store, so the entire site and header change together and the choice persists. Standalone/Storybook demos retain local state unless a host supplies controlled theme props; the installed component does not define your theme colors or persist settings.

## Optional circular page wipe

Set `pageTransition="circular"` to reveal the updated document from the button center. The default is `"none"`, which retains the icon morph without a page transition. Circular mode holds button scale stable to avoid a jump when snapshots hand back to the live page.

```tsx
"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppearanceToggle() {
  // Match this initial value to your server/bootstrap theme in a real app.
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return (
    <ThemeToggle
      theme={theme}
      pageTransition="circular"
      onThemeChange={(next) => {
        document.documentElement.dataset.theme = next;
        setTheme(next);
        // Persist here if your app needs it.
      }}
    />
  );
}
```

Your stylesheet must define colors for `[data-theme="light"]` and `[data-theme="dark"]`. For Tailwind's class-based dark variant, use `document.documentElement.classList.toggle("dark", next === "dark")` instead. The wipe does not depend on Cavemio palettes. React state-driven surfaces work too: the helper flushes the callback's synchronous updates before the browser captures the new view.

Use **onThemeChange**, not onClick, to apply the new theme. Updating colors in onClick happens before the old snapshot. Pass the resolved light/dark value from a provider, not `"system"`. OS preference changes and external updates do not automatically trigger a wipe: only this button's activation does.

The callback must apply the theme synchronously. An async callback, `startTransition`, a provider that defers its root attribute update, or styles applied later in an effect may miss capture. Use `pageTransition="none"` until your integration has a synchronous theme commit; no provider-specific adapter is bundled. Avoid simultaneously starting a router transition. When the browser exposes an existing active transition, the helper switches immediately without starting another; older browsers cannot reliably detect another owner's transition.

| Case                                                        | Behavior                                                                                                                                     |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Supported browser and synchronous theme change              | 620ms circular reveal with `cubic-bezier(0.65, 0, 0.35, 1)`; sun/moon keeps morphing                                                         |
| Missing API, hidden document, failed/skipped capture        | Theme still changes once; no wipe                                                                                                            |
| Reduced motion                                              | Immediate theme change and settled icon                                                                                                      |
| Resize, tab hiding, or reduced motion enabled during reveal | Reveal cancels and selected theme stays applied                                                                                              |
| Rapid activation, including another toggle in the document  | Previous wipe cancels; latest choice applies immediately                                                                                     |
| Unmount                                                     | Owned animation, stylesheet, attribute, and listeners are released; pending old callbacks cannot mutate the next run                         |
| Storybook or an iframe                                      | Only that document is revealed; its parent is unaffected                                                                                     |
| Hardcoded colors or missing theme CSS                       | Those colors do not change                                                                                                                   |
| Strict style CSP                                            | Pass an allowed server-generated `nonce`; otherwise the browser may block the temporary stylesheet and the component switches without a wipe |

The bundled helper installs a temporary, attribute-scoped stylesheet only during the reveal and removes it afterward. No global CSS copy/paste, extra animation library, or website hook is needed. Sites that define custom named view-transition elements should validate their composition; the root reveal is intended for ordinary document theming.

## Distribution and checks

- Canonical source: [theme-toggle.tsx](../registry/components/theme-toggle.tsx).
- React and React DOM are host dependencies. The registry bundles [use-theme-wipe.ts](../registry/components/use-theme-wipe.ts), including its scoped styles; no extra animation package or custom keyframes.
- Registry item: `@cavemio/theme-toggle`.
- [Stories](../preview/stories/theme-toggle.stories.tsx): default, dark, disabled, uncontrolled, multiple instances, circular page, and no page transition.
- [Browser regression](../scripts/verify-theme-toggle.browser.js): input, stable dimensions, intermediate motion, reversal, mask isolation, and live reduced motion.
- Installation example is registered in [install-examples.ts](../scripts/install-examples.ts).

The [wipe regression](../scripts/verify-theme-toggle-wipe.browser.js) covers real intermediate frames, multiple instances, callback counts, resize, unmount, reduced motion, hidden documents, unsupported APIs, and skipped/failed captures. Browser coverage is Chromium; other engines use feature detection but have not been certified by this suite.
