import { test, expect } from "@playwright/test";
import metadata from "../../preview/reference/metadata";

const registry = process.env.CAVEMIO_REGISTRY_URL ?? "http://127.0.0.1:4001/";

for (const item of metadata) {
  test(`reference demo modes: ${item.slug}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(
      new URL(`previews/cavemio-${item.slug}.html`, registry).href,
    );
    const preview = page.locator(".reference-demo");
    await expect(preview).toBeVisible();
    for (const width of [1000, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const mode of item.tabs.length ? item.tabs : [undefined]) {
        if (mode && item.tabs.length > 1) {
          const tabs = preview
            .locator(":scope > .absolute")
            .getByRole("tablist");
          await tabs.getByRole("tab", { name: mode, exact: true }).click();
          await expect(
            tabs.getByRole("tab", { name: mode, exact: true }),
          ).toHaveAttribute("aria-selected", "true");
        }
        const stage = preview.locator(":scope > div").first();
        await expect(stage.locator(":scope > *").first()).toBeVisible();
        expect(
          await stage.evaluate(
            (element) => element.getBoundingClientRect().width,
          ),
        ).toBeGreaterThan(200);
        await expect
          .poll(() =>
            stage
              .locator("img")
              .evaluateAll((images) =>
                images.every(
                  (image) =>
                    (image as HTMLImageElement).complete &&
                    (image as HTMLImageElement).naturalWidth > 0,
                ),
              ),
          )
          .toBe(true);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width);
        expect(
          errors,
          `${item.slug}: ${mode ?? "default"} at ${width}px`,
        ).toEqual([]);
      }
    }
  });
}
