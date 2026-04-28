# Kbd

Platform-aware keycaps with optional held-key feedback and shortcut behavior.

```tsx
import { Kbd } from "@/components/kbd";

<Kbd
  hotkey="k"
  onTrigger={() => setOpen(true)}
  stopPropagation
  aria-label="Open commands"
/>;
<Kbd>Esc</Kbd>;
<Kbd keys="mod+shift+p" live />;
<Kbd keys={["up", "down", "enter"]} size="sm" live />;
```

## API and component brief

`hotkey` is a single `KeyboardEvent.key` value combined with Cmd or Ctrl, such as `k` or `j`. Empty or omitted disables the global shortcut. The displayed modifier follows the platform; both Cmd and Ctrl work. Server rendering hides the unknown modifier in a compact placeholder. After hydration, the badge fits only the detected platform’s label; longer Windows labels may expand it once. Hidden alternate labels do not reserve space. Additional Shift/Alt modifiers do not match. Plain typing, composition, already-handled events, and held-key repeats do not invoke the callback.

`label` optionally adds a visible action label beside the keycap, inside a transparent 32px-tall surface with an inset border, 10px left padding, 6px right padding, and a 24px label-to-badge gap. Interactive labeled surfaces extend their hit area to 44px tall without enlarging the visible button. The label uses 14px text at weight 400 and inherits the host font. The host background shows through the outer surface; the shortcut badge keeps its semantic `background` fill. For example, `label="Search..."` displays the action followed by the shortcut badge.

`onTrigger(event)` receives a native keyboard event or React click event. Supplying it renders a native button: click, touch, Enter, Space, and the global hotkey call the same action. Without it, Kbd renders a passive semantic `kbd` and registers no action listener. Opt-in `live` tracking observes keys without claiming their events. The caller owns the resulting action and state. `children` can supply passive key text or content before the shortcut. Supply an `aria-label` describing an interactive action.

`stopPropagation` defaults to false. When true, clicks stop at the button and matching shortcuts are intercepted during document capture, before target and ancestor handlers. It does not stop unrelated keys or earlier capture listeners. Matching active shortcuts always prevent the browser's default action. `disabled` prevents both pointer and shortcut activation. Standard button props, `className`, and a button `ref` are supported in interactive mode; `onClick` may prevent default to cancel the click callback.

The stable keycap is 20px tall with a subtle inset border, 6px horizontal padding, 11px text, and inherited font. An interactive keycap extends its pointer target vertically to 44px without enlarging the visible surface. Focus has a visible ring; hover changes text color. Legacy badges remain static. Individual live keycaps transition their translate, shadow, and color over 100ms; reduced motion removes translation and transitions while retaining pressed color/shadow feedback. Changing the key/callback or unmounting cleans up the listener. Avoid mounting multiple active Kbd components for the same shortcut; the first handler that prevents default claims it.

## Command menu integration

Command Palette uses a labeled Kbd surface for its closed trigger and its inert transition copy: “Search...” followed by the compact shortcut badge. Its callback opens the menu on click and toggles it on Cmd/Ctrl+K, preserving the existing close shortcut. The same listener remains available with `showTrigger={false}`; `hotkey=""` disables it and leaves the trigger label visible without an empty badge. `triggerLabel` supplies the accessible name. Display-only Kbd instances also render result and footer hints without binding shortcuts.

## Distribution and evidence

Canonical source: [kbd.tsx](../registry/components/kbd.tsx). Registry item: `cavemio-kbd`; slug: `kbd`; export: `Kbd`. No added packages, helpers, or keyframes are required. Command Palette bundles the same file. [Stories](../preview/stories/kbd.stories.tsx) cover interactive, disabled, passive, and propagating modes; the [standalone entry](../preview/entries/kbd.tsx) shares their demo.

[Browser regression](../scripts/verify-kbd.browser.js) checks click/Enter/Space, Cmd/Ctrl activation, repeat/composition suppression, propagation, changing shortcuts, unmount/remount cleanup, disabled and passive modes, focus, and reduced motion. [Command Palette checks](../scripts/verify-command-palette.browser.js) retain intermediate morph frames and focus restoration, including shortcuts with a hidden trigger. Both items have independently compiled [installation examples](../scripts/install-examples.ts).

## Live keys

`keys` accepts an array or a plus-separated string. It displays individual keycaps; it does not register a shortcut action. `mod` follows the platform (Command on Apple keyboards, Control elsewhere). Modifier names, Enter/Return, Esc/Escape, Space, and arrow names/symbols are normalized. Screen readers receive words instead of decorative symbols, and each key fits its visible platform label after hydration. `size="sm"` uses 20px keycaps; the default `md` uses 24px keycaps. Both use 4px side padding and a minimum width equal to their height, so single glyphs are compact squares while longer labels expand naturally. Legacy keycaps keep their existing dimensions.

`live` defaults to false. When enabled, each held key sinks 1px and loses its raised bottom shadow until released. Capture-phase observation still sees keys when a shortcut handler stops propagation; it never prevents default, triggers an action, or stops another listener. Repeats do not retrigger feedback. Window blur, hidden documents, and Command release clear stale held keys. Composition is ignored. Disabling, changing the key list, toggling live mode, and unmounting reset tracking and clean up listeners. With `live` and `hotkey` but no `keys`, the displayed keys default to `mod` plus that hotkey.

The stable objects are the individual keycaps. The component owns only held-key state; callers own shortcut actions and labels. [Live-key regression](../scripts/verify-kbd-live.browser.js) checks Apple/Windows detection, held/released geometry, passive events, blur cleanup, disabled/static states, and live reduced motion. The shared demo exposes Live keys in Storybook and on the website.
