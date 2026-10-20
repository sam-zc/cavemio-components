# Shared color themes

[`preview/theme.css`](../preview/theme.css) owns the preview and website color system. Import it after Tailwind CSS 4. [`preview/theme-options.ts`](../preview/theme-options.ts) owns the preset IDs and labels used by Storybook and the website.

The default is Cavemio Green. Blue, Violet, Rose, Amber, Teal, and Slate alias Tailwind's corresponding color scales. Set `data-palette` to a preset ID and `data-theme` to `light` or `dark` on the document's `html` element. Storybook exposes separate Palette and Appearance toolbar controls.

## Token layers

- `--color-cavemio-50` through `--color-cavemio-950` define the green scale.
- `--color-brand-50` through `--color-brand-950` alias the selected scale.
- Semantic colors such as `--primary`, `--accent`, `--accent-ink`, and `--ring` select shades for their purpose. Components use these semantic tokens.
- Surface, text, and border primitives preserve the paper theme independently of the selected accent. Their dark counterparts provide dark mode.
- Success, warning, and destructive colors retain their meanings across brand palettes. Avatar/image colors are content, not theme accents.

To define a custom palette, add an `@theme` block after the import and assign all eleven `--color-brand-*` shades. Omit `data-palette` when using custom default variables: named preset selectors override them. Custom neutral primitives can be overridden in `:root`.

Installed components continue to inherit the consumer's shadcn semantic variables; they do not import preview CSS. Optional extended tokens such as `--accent-ink`, `--success`, and `--warning` have local fallbacks where consumed by reusable source. The full theme is optional.

## Distribution

The registry build inlines this stylesheet into native preview styles and includes its authored contents in the additive `themeCss` property of `previews/native.json`. The website's explicit HTTP sync writes a downloadable `public/theme.css`; its documentation lives at `/components/theming`. Catalog versions and source hash semantics are unchanged.

Standalone previews import [`theme-bridge.ts`](../preview/theme-bridge.ts). They accept validated palette/mode IDs from their parent using `cavemio:theme` messages. The bridge rejects messages from other windows. The website preserves the `allow-scripts` iframe sandbox and changes variables without navigating the preview, so demo state survives. No CSS or script strings cross this channel.

## Verification

Website browser regressions cover all fourteen preset/mode combinations, primary/accent/supporting-text contrast, persistence before hydration, blocked storage, mobile layout, keyboard palette selection, downloaded CSS, native state preservation, portal inheritance, and iframe synchronization without reloading. Run component browser regressions after changes to shared tokens because all demos consume them.
