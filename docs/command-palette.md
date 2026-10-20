# Command Palette

## Component brief

Open a labeled command menu button with a click or Cmd/Ctrl+K, filter caller-supplied commands, then navigate or run an action. The trigger expands into one dialog surface. This extends the measured surface and moving highlight patterns in [the interaction audit](component-patterns.md), with modal focus ownership and nested result pages.

| State        | Content and actions                                     | Focus and exit                                                                                 |
| ------------ | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Closed       | Kbd shortcut; optional caller-owned trigger             | Click, hotkey, or controlled `open`                                                            |
| Opening/open | Native combobox, grouped results, one moving highlight  | Immediate typing; arrows/Home/End navigate; Tab cycles input, Close, chips, and footer actions |
| Nested       | Breadcrumb and a new result page                        | Backspace with an empty query or Escape returns                                                |
| Empty        | Readable no-results status                              | Editing the query restores matches                                                             |
| Running      | Pending indicator; duplicate commands disabled          | Close aborts the signal; stale completion is ignored                                           |
| Failed       | Announced failure; action becomes available again       | Retry the command or close                                                                     |
| Closing      | Dialog folds toward the trigger; background stays inert | Focus returns after the close completes                                                        |

The caller owns `items`, optional `open`/`onOpenChange`, navigation, and async operations. Internal state owns query, active row, nested pages, and visual transitions. IDs must be stable and unique within each result page. `onSelect({ signal })` may return a promise. Closing, resetting, or unmounting aborts that signal; callbacks should honor it. The palette also ignores stale results from callbacks that cannot be cancelled. `href` is ordinary browser navigation; router integration uses `onSelect`.

## API and motion

`CommandPalette` accepts `items`, `placeholder`, `searchLabel` (default “Search commands”), `hotkey` (default `k`, empty disables it), `open`, `defaultOpen`, `onOpenChange`, `showTrigger`, `triggerLabel` (default “Search...”), `triggerIcon`, `filters`, `filtersLabel` (default “Recent searches”), `onFilterRemove`, `footer`, and native div props. A `CommandItem` has `id`, `label`, optional `description`, `keywords`, `group`, `icon`, `shortcut`, `href`, `onSelect`, or nested `items`.

The closed trigger uses [Kbd](kbd.md) with a visible “Search...” label followed by a compact platform shortcut badge. The visible button is 32px tall with 10px left padding, 6px right padding, a 24px label-to-badge gap, and an 8px radius. An invisible extension preserves a 44px-tall hit area. Its `onTrigger` callback opens on click and toggles on the hotkey, with propagation suppressed; `triggerLabel` is its accessible name. `triggerIcon` defaults to a 16px search icon; pass `null` to omit it or a React node to replace it. Each item's `icon` also accepts React nodes, including caller-provided logos. Trigger labels use 14px regular text and inherit the host font; the demo uses Inter to match the website. The dialog is at most 640px wide with 20px content gutters (8px list inset plus 12px row padding) and a 14px corner radius. Compact section headings and chip spacing keep the six-command Demo around 535px tall on desktop while retaining 40px command rows and 32px chips. Filter chips wrap within the scrollable body; the footer measures its natural height and wraps on narrow screens so its controls stay available. Keyboard hints and caller footer content share a row when space permits.

`filters` is a caller-owned array of `{ id, label, icon? }`. `onFilterRemove(id)` asks the caller to remove a scope and supply the corresponding filtered `items`; the component does not infer category membership. Removal restores focus to the search input. Omit `onFilterRemove` for non-interactive scope badges. Filters appear on the root page, and remain caller-owned across close/reopen. `footer` accepts help text, links, or buttons. It is optional; the preview supplies Workspace help copy and a local help disclosure, while installed applications supply their destination.

```tsx
const [filters, setFilters] = useState([
  { id: "pages", label: "Pages" },
  { id: "accounts", label: "Accounts" },
]);

<CommandPalette
  items={commands.filter((command) =>
    filters.some((filter) => filter.id === command.category),
  )}
  filters={filters}
  onFilterRemove={(id) =>
    setFilters((current) => current.filter((filter) => filter.id !== id))
  }
  footer={
    <p>
      Not what you’re looking for? Try the <a href="/help">Help Center</a>
    </p>
  }
/>;
```

The 440px maximum result area includes the chips and shrinks to fit the visual viewport. The button/dialog geometry transition takes 440ms to open and 320ms to close, using `cubic-bezier(0.16,1,0.3,1)`. On taller screens, the shell settles at 16% of the viewport height (capped at 160px), reserving room for the full result area and footer; short screens retain the compact anchor and viewport fit. Reserving the maximum list height keeps the anchor stable during searches and nested navigation. Content stays at its destination width while the shell grows, so text is clipped rather than scaled. It fades in over 240ms after 60ms, overlapping the expansion, and fades out over 100ms. The trigger face fades out over 100ms and returns over 140ms after a 160ms delay, finishing just before the closing overlay is removed and focus returns. The veil and close cleanup use the same 320ms duration. Results resize over 300ms, the 40px active-row plate moves over 200ms, and nested pages enter over 360ms after 40ms and leave over 240ms. Outgoing copies are inert, hidden, uniquely keyed, and removed. The highlight is positioned inside the incoming pane, so it shares row coordinates and the slide transform. A new page initializes the plate without animating from the previous page’s position; later selections retain the 200ms glide. Scroll calculations separately include the pane inset. The list measures its content and fits the visual viewport; long row content intentionally truncates. Live reduced motion settles spatial effects and clears outgoing copies without clearing the query.

The labeled trigger is transparent while its shortcut badge retains the semantic background fill. The closing shell fades to transparent to match the trigger; the open dialog keeps its popover fill. The dialog portals to the document body and inherits the consumer's global shadcn semantic theme, including `popover` and `popover-foreground`. Font and demo colors belong to the preview. No service or catalog request is embedded in the component.

## Distribution and checks

Canonical source: [command-palette.tsx](../registry/components/command-palette.tsx), bundled with [Text Morph](../registry/components/text-morph.tsx) and [Kbd](../registry/components/kbd.tsx). React/React DOM and Tailwind CSS 4 are host requirements; there are no additional package dependencies or custom keyframes. The component includes focus restoration, viewport sizing, and reduced-motion handling.

Registry slug: `command-palette`; export: `CommandPalette`; item: `cavemio-command-palette`. [The Demo story](../preview/stories/command-palette.stories.tsx) and the [standalone entry](../preview/entries/command-palette.tsx) share [demo fixtures](../preview/command-palette-demo.tsx). Demo presents a design workspace: Website redesign, Brand guidelines, appearance choices, creating a brief, syncing shared files, and exporting project assets. “Search in” chips scope Projects, Documents, and Actions. Original project/document thumbnail illustrations live in the preview; action icons describe their purpose. Demo callbacks report local outcomes rather than calling a service. Demo is the only Command Palette story; browser regressions use its args to exercise controlled, initially open, empty, long-content, and chip-free states. The `simulateSyncFailure` arg enables a first-attempt sync failure for retry regression coverage; normal Demo sync succeeds. The website installs the HTTP item into its own source and supplies catalog results and routing callbacks.

[Browser checks](../scripts/verify-command-palette.browser.js) inspect intermediate shell/text geometry, nested navigation, keyboard/focus, async retry and stale completion, controlled/default-open modes, empty content, a 320px short viewport, live reduced motion, compact trigger bounds and aligned dialog gutters, visible chips, scope removal/focus, and footer keyboard access/wrapping. [Install verification](verification.md) checks the item alone through both adapters. Website search/navigation and catalog discovery are checked in the website repository.

[Highlight regression](../scripts/verify-command-palette-highlight.browser.js) measures visible highlight bounds on every animation frame through opening, root/nested closing, Escape/Backspace navigation, interrupted open/close, narrow-layout reversals, and live reduced motion. It also checks row alignment during and after nested entry, hover, and keyboard navigation.
