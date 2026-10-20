import assert from "node:assert/strict";

export default async function verify(page, baseURL) {
  const open = async (story) => {
    await page.goto(
      `${baseURL}/iframe.html?id=components-theme-toggle--${story}&viewMode=story`,
    );
    await page.locator("[data-theme-toggle]").first().waitFor();
  };
  await open("without-wipe");
  const button = page.locator("[data-theme-toggle]");
  const rays = button.locator("[data-theme-toggle-rays]");
  const footprint = (element) => [element.offsetWidth, element.offsetHeight];
  const bounds = await button.evaluate(footprint);
  assert.equal(await button.getAttribute("aria-pressed"), "false");
  await button.click();
  assert.equal(await button.getAttribute("aria-pressed"), "true");
  assert.equal(await button.getAttribute("aria-label"), "Switch to light mode");
  const intermediate = await rays.evaluate((element) => {
    const animation = element
      .getAnimations()
      .find((item) => item.transitionProperty === "opacity");
    if (!animation) return null;
    animation.pause();
    animation.currentTime = 210;
    const opacity = Number(getComputedStyle(element).opacity);
    animation.play();
    return opacity;
  });
  assert(
    intermediate > 0 && intermediate < 1,
    "Rays interpolate between states",
  );
  await button.click();
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector("[data-theme-toggle-rays]"))
        .opacity === "1",
  );
  assert.equal(await button.getAttribute("aria-pressed"), "false");
  assert.deepEqual(
    await button.evaluate(footprint),
    bounds,
    "Toggle preserves its footprint",
  );
  await button.press("Enter");
  assert.equal(await button.getAttribute("aria-pressed"), "true");
  await button.press("Space");
  assert.equal(await button.getAttribute("aria-pressed"), "false");
  assert(
    await button.evaluate((element) => element === document.activeElement),
    "Focus stays on the toggle",
  );
  await button.click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector("[data-theme-toggle-rays]"))
        .opacity === "0",
  );
  assert.equal(
    await rays.evaluate(
      (element) => getComputedStyle(element).transitionProperty,
    ),
    "none",
  );
  await button.press("Space");
  assert.equal(
    await rays.evaluate((element) => getComputedStyle(element).opacity),
    "1",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await open("disabled");
  assert(await button.isDisabled());
  await button.evaluate((element) => element.click());
  assert.equal(await button.getAttribute("aria-pressed"), "false");
  await open("uncontrolled");
  await button.click();
  assert.equal(await button.getAttribute("aria-pressed"), "true");
  await open("multiple");
  const ids = await page
    .locator("mask")
    .evaluateAll((elements) => elements.map((element) => element.id));
  assert.equal(new Set(ids).size, 2, "Each instance owns its mask");
  await page.locator("[data-theme-toggle]").first().click();
  assert.equal(
    await page
      .locator("[data-theme-toggle]")
      .last()
      .getAttribute("aria-pressed"),
    "true",
  );
  return {
    keyboard: true,
    reversal: true,
    stableSize: true,
    reducedMotion: true,
    disabled: true,
    isolatedMasks: true,
  };
}
