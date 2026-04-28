import { rm } from "node:fs/promises";
// Only these owned, generated paths are disposable. Never remove canonical source.
for (const path of [
  "dist/cli.js",
  "public/r",
  "public/previews",
  "public/catalog.json",
  "public/fonts",
]) {
  await rm(path, { recursive: true, force: true });
}
