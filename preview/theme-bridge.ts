import { isThemeMode, isThemePalette } from "./theme-options";

function applyTheme(palette: unknown, mode: unknown) {
  if (!isThemePalette(palette) || !isThemeMode(mode)) return;
  document.documentElement.dataset.palette = palette;
  document.documentElement.dataset.theme = mode;
}
const query = new URLSearchParams(location.search);
applyTheme(query.get("palette"), query.get("mode"));
window.addEventListener("message", (event) => {
  if (event.source !== parent || event.data?.type !== "cavemio:theme") return;
  applyTheme(event.data.palette, event.data.mode);
});
