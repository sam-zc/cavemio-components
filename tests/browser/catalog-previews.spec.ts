import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

const catalog = JSON.parse(
  await readFile(new URL("../../public/catalog.json", import.meta.url), "utf8"),
) as {
  items: { component: string; name: string; preview: string }[];
};
const registry = process.env.CAVEMIO_REGISTRY_URL ?? "http://127.0.0.1:4001/";
for (const item of catalog.items) {
  test("catalog preview renders: " + item.component, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(new URL(item.preview, registry).href);
    await expect(page.locator("#root > *")).toBeVisible();
    // Let layout effects, initial animation frames, and lazy imports complete.
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    expect(errors).toEqual([]);
    // Icon-only controls and an empty composer have accessible names rather
    // than visible text. They still need real rendered content in their shell.
    expect(
      await page.locator("#root").evaluate((root) => {
        return (
          !!root.textContent?.trim() ||
          !!root.querySelector(
            "button, input, textarea, [contenteditable], svg, video, img",
          )
        );
      }),
    ).toBe(true);
  });
}
