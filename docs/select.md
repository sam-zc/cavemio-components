# Select

Select expands a stable pill into a portalled list. Callers supply options and
either control `value` with `onValueChange` or set `defaultValue`. Open state,
highlight, typeahead, viewport placement, and focus belong to the component.
Labels, hints, errors, and demo content belong to the caller.

```tsx
import { Select } from "@/components/select";

<Select
  label="Plan"
  options={[
    { value: "personal", label: "Personal", description: "For your next idea" },
    { value: "team", label: "Team", description: "Build together" },
  ]}
  defaultValue="personal"
/>;
```

The surface changes width, height, and radius over 420ms with the morph ease.
Text is never scaled. Compact pills (`block={false}`) reuse TextMorph; the active
option has a moving highlight and the chosen option a drawn check. Arrows,
Home/End, PageUp/PageDown, and typeahead move the highlight. Enter/Space selects,
Escape cancels and restores trigger focus; outside clicks dismiss without stealing
focus. Long lists scroll, and the popup opens upward when space is limited.
Reduced motion disables surface, highlight, and check transitions.

Labels target the trigger; hint/error IDs are associated through
`aria-describedby`. Closing option content is inert. Disabled controls do not open.

The registry item includes Select, Field, PillSelect, TextMorph, and the interaction
motion helper. It needs React/React DOM and host Tailwind semantic theme tokens;
there are no additional packages or keyframes.

Storybook covers default, disabled, error, and narrow layouts. The standalone
preview uses the same demo. The install example verifies source compilation in
isolation; the browser suite exercises selection, typeahead, focus restoration,
scrolling, popup bounds, and reduced motion.
