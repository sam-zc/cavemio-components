import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("a clean registry checkout contains every local demo media asset", async () => {
  const manifest = JSON.parse(
    await readFile(
      new URL("../preview/reference/scenes.json", import.meta.url),
      "utf8",
    ),
  ) as { assets: string[] };
  assert.ok(
    manifest.assets.length > 0,
    "The demo manifest must list its media",
  );
  for (const asset of manifest.assets) {
    assert.match(asset, /^\/demos\/cavemio\//);
    const bytes = await readFile(new URL(`../public${asset}`, import.meta.url));
    assert.ok(bytes.length > 0, `Missing demo media: ${asset}`);
  }
});
