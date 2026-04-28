# Text Morph and Number Roll

These existing primitives now have separate registry items, standalone previews, and Storybook groups. Their reusable implementations are unchanged.

## Component brief

Text Morph changes a short label while preserving matching glyphs, animating arrivals/departures, and easing the inline width. Number Roll animates digit columns while keeping punctuation separate. The caller owns the string or number; neither component starts timers or fetches data. Existing consumers, including Inline Rewrite and Command Palette, continue using the same canonical files.

| Component   | Input                                                           | Motion                                                                                       | Reduced motion                                              |
| ----------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Text Morph  | String children, optional duration, direction, and animateWidth | Shared letters move to their new positions; new/leaving letters fade and blur; default 460ms | Settles to the current text and clears outgoing glyphs      |
| Number Roll | Numeric value, Intl locales/format, optional duration           | Digit columns roll; digit-count changes animate in/out; default 900ms                        | Displays the current formatted value without spatial motion |

Both expose one readable value to assistive technology and hide decorative copies. The host controls typography and colors. Focus remains on the demo control that initiated the change. Changing demo tabs resets their example value (1,248 for Try It/Currency, 9,400 for Compact, and 12,480 for Live); automatic headline/live examples pause when the page is hidden or reduced motion is preferred, and have an explicit Pause control.

## Examples

```tsx
import { TextMorph } from "@/components/compositions/text-morph";
import { NumberRoll } from "@/components/compositions/number-roll";

<TextMorph>{saving ? "Saving" : "Save"}</TextMorph>;
<NumberRoll value={1248} locales="en-US" />;
<NumberRoll
  value={49}
  locales="en-US"
  format={{ style: "currency", currency: "USD" }}
/>;
```

The actual installation path follows the consumer’s configured aliases.

## Distribution

- `cavemio-text-morph`: `registry/components/text-morph.tsx`, no added npm dependencies or keyframes. Preview entry `preview/entries/text-morph.tsx`; stories under **Components / Text Morph** cover Labels, Headline, Downward, and Slow Motion.
- `cavemio-number-roll`: `registry/components/number-roll.tsx`, no added npm dependencies. Registry CSS supplies `ui-col-in` and `ui-col-out`, the same animations bundled by its existing consumers. Preview entry `preview/entries/number-roll.tsx`; stories under **Components / Number Roll** cover Try It, Currency, Compact, Live, Digit Boundary, and Negative.
- Authored demo content lives in `preview/text-morph-demo.tsx` and `preview/number-roll-demo.tsx`. `registry.json` supplies optional documentation metadata for use cases, features, states, and props. Catalog v2 and primary-file hash semantics remain unchanged.
- Rebuild generated artifacts, then use the website’s HTTP `sync:previews --write` workflow to adopt the demos. Do not edit the website’s generated copies.

## Verification

`scripts/verify-primitives.browser.js`, run through `test:browser -- --grep primitives`, checks label selection and keyboard use, digit-boundary changes, currency/compact formatting, narrow layouts, live reduced motion, and pause behavior. Isolated install checks for each item cover both the shadcn namespace and direct-URL installation, consumer aliases, existing-file preservation, TypeScript, and a Vite production build.

The source remains independently installable; demo content stays outside the installed component.
