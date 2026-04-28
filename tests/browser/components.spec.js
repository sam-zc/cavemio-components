import { readdir } from "node:fs/promises";
import { test, expect } from "@playwright/test";

// Keep story-specific actions and geometry assertions in their owned suites.
// The runner owns discovery, isolated contexts, timeouts, and failure evidence.
const scripts = new URL("../../scripts/", import.meta.url);
const suites = (await readdir(scripts))
  .filter((name) => /^verify-.*\.browser\.js$/.test(name))
  .sort();

for (const filename of suites) {
  test(
    filename.replace(/^verify-|\.browser\.js$/g, ""),
    async ({ page, baseURL }, testInfo) => {
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      const { default: verify } = await import(new URL(filename, scripts).href);
      const report = await verify(page, baseURL);
      await testInfo.attach("scenarios", {
        body: JSON.stringify(report, null, 2),
        contentType: "application/json",
      });
      expect(errors, "Unexpected browser errors").toEqual([]);
    },
  );
}
