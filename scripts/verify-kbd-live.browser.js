import { expect } from "@playwright/test";

export default async function verifyKbdLive(page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "platform", {
      get: () =>
        new URL(location.href).searchParams.get("platform") ?? "MacIntel",
    });
  });
  let platformName = "MacIntel";
  const visit = async (story = "live-keys") => {
    await page.goto(
      `/iframe.html?id=components-kbd--${story}&viewMode=story&platform=${platformName}`,
    );
    await page.getByRole("region", { name: "Live keys" }).waitFor();
  };
  for (const [platform, modifier, label] of [
    ["MacIntel", "Meta", "⌘"],
    ["Win32", "Control", "Ctrl"],
  ]) {
    platformName = platform;
    await visit();
    const key = (name) => page.locator(`[data-kbd-key="${name}"]`);
    await expect(key("mod").locator("span:visible")).toHaveText(label);
    for (const name of ["mod", "k", "shift", "enter"]) {
      const fit = await key(name).evaluate((element) => {
        const style = getComputedStyle(element);
        const visible = [...element.querySelectorAll("span")].find(
          (span) => getComputedStyle(span).visibility !== "hidden",
        );
        const range = document.createRange();
        range.selectNodeContents(visible);
        return {
          actual: element.getBoundingClientRect().width,
          expected: Math.max(
            parseFloat(style.minWidth),
            range.getBoundingClientRect().width +
              parseFloat(style.paddingLeft) +
              parseFloat(style.paddingRight),
          ),
        };
      });
      expect(
        fit.actual,
        `${platform}: ${name} fits its visible label, not a hidden alternate`,
      ).toBeCloseTo(fit.expected, 0);
    }
    const badgeFit = await page
      .locator('[aria-label="Run shortcut"]')
      .evaluate((element) => {
        const style = getComputedStyle(element);
        const labels = [
          ...element.querySelectorAll('[aria-hidden="true"] span'),
        ].filter(
          (span) =>
            !span.children.length &&
            getComputedStyle(span).visibility !== "hidden",
        );
        const first = labels[0].getBoundingClientRect();
        const last = labels.at(-1).getBoundingClientRect();
        return {
          actual: element.getBoundingClientRect().width,
          expected:
            last.right -
            first.left +
            parseFloat(style.paddingLeft) +
            parseFloat(style.paddingRight),
        };
      });
    expect(badgeFit.actual).toBeCloseTo(badgeFit.expected, 0);
    await page.getByRole("textbox").focus();
    const bounds = await key("shift").boundingBox();
    const raisedShadow = await key("shift").evaluate(
      (el) => getComputedStyle(el).boxShadow,
    );
    await page.keyboard.down("Shift");
    await expect(key("shift")).toHaveAttribute("data-pressed", "true");
    await expect
      .poll(async () => (await key("shift").boundingBox()).y - bounds.y)
      .toBeCloseTo(1, 1);
    await expect(key("shift")).not.toHaveCSS("box-shadow", raisedShadow);
    await page.keyboard.up("Shift");
    await expect(key("shift")).toHaveAttribute("data-pressed", "false");
    await expect
      .poll(async () => (await key("shift").boundingBox()).y - bounds.y)
      .toBeCloseTo(0, 1);

    await page.keyboard.down(modifier);
    await page.keyboard.down("k");
    await expect(key("mod")).toHaveAttribute("data-pressed", "true");
    await expect(key("k")).toHaveAttribute("data-pressed", "true");
    await page.keyboard.up("k");
    await expect(key("k")).toHaveAttribute("data-pressed", "false");
    await expect(key("mod")).toHaveAttribute("data-pressed", "true");
    await page.keyboard.up(modifier);
    await expect(key("mod")).toHaveAttribute("data-pressed", "false");
    await expect(page.getByRole("status")).toHaveText(
      "Triggered 0 times; bubbled 1 times",
    );

    await page.keyboard.down("ArrowUp");
    await expect(key("arrowup")).toHaveAttribute("data-pressed", "true");
    await page.evaluate(() => window.dispatchEvent(new Event("blur")));
    await expect(key("arrowup")).toHaveAttribute("data-pressed", "false");
    await page.keyboard.up("ArrowUp");

    await page.keyboard.down("Enter");
    await expect(key("enter")).toHaveAttribute("data-pressed", "true");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(key("enter")).toHaveCSS("translate", "0px");
    await expect(key("enter")).toHaveCSS("transition-property", "none");
    await page.keyboard.up("Enter");
    await expect(key("enter")).toHaveAttribute("data-pressed", "false");
    await page.emulateMedia({ reducedMotion: "no-preference" });
  }
  for (const story of ["static-keys", "disabled"]) {
    await visit(story);
    await page.keyboard.down("Shift");
    await expect(page.locator('[data-kbd-key="shift"]')).toHaveAttribute(
      "data-pressed",
      "false",
    );
    await page.keyboard.up("Shift");
  }
  return {
    platforms: true,
    heldGeometry: true,
    release: true,
    blur: true,
    passive: true,
    reducedMotion: true,
  };
}
