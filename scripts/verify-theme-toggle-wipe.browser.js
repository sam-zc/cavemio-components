import assert from "node:assert/strict";

export default async function verify(page, baseURL) {
  const open = async (story = "circular-page") => {
    await page.goto(
      `${baseURL}/iframe.html?id=components-theme-toggle--${story}&viewMode=story`,
    );
    await page.locator("[data-page-theme]").waitFor();
  };
  const root = page.locator("html");
  const surface = page.locator("[data-page-theme]");
  const buttons = page.locator("[data-theme-toggle]");
  const settled = async () => {
    await page.waitForFunction(
      () => !document.documentElement.hasAttribute("data-theme-wipe"),
    );
    assert.equal(
      await page.evaluate(
        () =>
          document
            .getAnimations()
            .filter((animation) => animation.effect?.pseudoElement).length,
      ),
      0,
      "No retained snapshot animations",
    );
    assert.equal(
      await page
        .locator("style")
        .evaluateAll(
          (styles) =>
            styles.filter((style) =>
              style.textContent.includes("html[data-theme-wipe]"),
            ).length,
        ),
      0,
      "Temporary stylesheet is released",
    );
  };
  await open();
  for (const theme of ["dark", "light"]) {
    await buttons.first().click();
    await page.waitForFunction(() =>
      document
        .getAnimations()
        .some((animation) => animation.effect?.pseudoElement),
    );
    assert.equal(await surface.getAttribute("data-page-theme"), theme);
    const midpoint = await page.evaluate(() => {
      const animation = document
        .getAnimations()
        .find(
          (item) =>
            item.effect?.pseudoElement === "::view-transition-new(root)",
        );
      animation.pause();
      animation.currentTime = 310;
      return animation.effect.getKeyframes().map((frame) => frame.clipPath);
    });
    assert.match(midpoint[0], /circle\(0px/);
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    assert.notEqual(
      await root.evaluate(
        (element) =>
          getComputedStyle(element, "::view-transition-new(root)").clipPath,
      ),
      midpoint[0],
      "The circular reveal has visible intermediate frames",
    );
    await page.evaluate(() =>
      document.getAnimations().forEach((animation) => animation.play()),
    );
    await settled();
    assert(
      await buttons
        .first()
        .evaluate((button) => button === document.activeElement),
    );
  }
  // Separate instances must coordinate the same document transition.
  await buttons.first().press("Space");
  await page.waitForFunction(
    () =>
      document.querySelector("[data-page-theme]").dataset.pageTheme === "dark",
  );
  await buttons.last().press("Space");
  await settled();
  assert.equal(await surface.getAttribute("data-page-theme"), "light");
  assert.match(await page.getByRole("status").textContent(), /4 changes/);

  await buttons.first().click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await settled();
  assert.equal(await surface.getAttribute("data-page-theme"), "dark");
  await buttons.first().click();
  await settled();
  assert.equal(await surface.getAttribute("data-page-theme"), "light");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await buttons.first().click();
  await page.setViewportSize({ width: 700, height: 700 });
  await settled();

  await open();
  await buttons.first().click();
  await page.getByRole("button", { name: "Unmount toggles" }).click();
  await settled();

  await open();
  await buttons.evaluateAll((elements) => {
    elements[0].click();
    elements[1].click();
  });
  await settled();
  await page.waitForTimeout(700);
  assert.equal(await surface.getAttribute("data-page-theme"), "light");
  assert.match(
    await page.getByRole("status").textContent(),
    /1 changes/,
    "A cancelled pre-capture callback cannot apply a stale theme",
  );

  for (const fallback of ["unsupported", "throws", "skipped", "hidden"]) {
    await open();
    await page.evaluate((kind) => {
      const start = document.startViewTransition.bind(document);
      if (kind === "hidden") {
        Object.defineProperty(document, "visibilityState", {
          configurable: true,
          value: "hidden",
        });
      } else {
        Object.defineProperty(document, "startViewTransition", {
          configurable: true,
          value:
            kind === "unsupported"
              ? undefined
              : (callback) => {
                  if (kind === "throws") throw new Error("Unavailable");
                  const transition = start(callback);
                  transition.skipTransition();
                  return transition;
                },
        });
      }
    }, fallback);
    await buttons.first().click();
    await settled();
    await page.waitForFunction(
      () =>
        document.querySelector("[data-page-theme]").dataset.pageTheme ===
        "dark",
    );
    assert.match(
      await page.getByRole("status").textContent(),
      /1 changes/,
      `${fallback}: callback runs once`,
    );
  }
  await open("without-page-transition");
  await buttons.first().click();
  await settled();
  assert.equal(await surface.getAttribute("data-page-theme"), "dark");
  return {
    circular: true,
    sharedInstances: true,
    cleanup: true,
    fallbacks: true,
  };
}
