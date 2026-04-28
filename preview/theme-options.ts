export const themePalettes = [
  { id: "cavemio", name: "Cavemio Green" },
  { id: "blue", name: "Blue" },
  { id: "violet", name: "Violet" },
  { id: "rose", name: "Rose" },
  { id: "amber", name: "Amber" },
  { id: "teal", name: "Teal" },
  { id: "slate", name: "Slate" },
] as const;
export type ThemePalette = (typeof themePalettes)[number]["id"];
export const themeModes = ["light", "dark"] as const;
export type ThemeMode = (typeof themeModes)[number];
export function isThemePalette(value: unknown): value is ThemePalette {
  return themePalettes.some((palette) => palette.id === value);
}
export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark";
}
