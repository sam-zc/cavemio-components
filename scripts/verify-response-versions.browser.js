export default async function verifyResponseVersions(page) {
  const story = (name) =>
    `/iframe.html?id=components-response-versions--${name}&viewMode=story`;
  const check = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const errors = [];
  const onError = (error) => errors.push(error.message);
  const onConsole = (message) => {
    if (message.type() === "error" && !message.text().includes("404"))
      errors.push(message.text());
  };
  page.on("pageerror", onError);
  page.on("console", onConsole);
  const button = (name) => page.getByRole("button", { name, exact: true });
  const answer = () => page.locator("p").last();
  const counter = () =>
    page.locator("[aria-live=polite] .sr-only").allTextContents();
  const report = [];

  try {
    await page.setViewportSize({ width: 1000, height: 800 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(story("demo"));
    await button("Regenerate").waitFor();
    check(
      await button("Previous version").isDisabled(),
      "Single: previous enabled",
    );
    check(await button("Next version").isDisabled(), "Single: next enabled");
    const original = await answer().innerText();
    await button("Regenerate").focus();
    await page.keyboard.press("Enter");
    check(
      await button("Regenerating").isDisabled(),
      "Duplicate generation enabled",
    );
    await button("Previous version").click();
    await button("Regenerate").waitFor();
    check(
      (await answer().innerText()) === original,
      "Streaming overwrote old answer",
    );
    check(
      (await counter()).join(" ") === "Version  1 of 2",
      "Counter is not accessible",
    );
    await button("Next version").focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(700);
    check(
      (await answer().innerText()).includes("Main Street"),
      "Generated answer missing",
    );
    check(await button("Next version").isDisabled(), "Last: next enabled");
    report.push(
      "Single version, keyboard regeneration, busy guard, preserved history while streaming, accessible counter",
    );

    await page.goto(story("versions"));
    await button("Previous version").waitFor();
    const before = await answer().evaluate(
      (el) => el.parentElement.parentElement.offsetHeight,
    );
    await button("Previous version").click();
    await page.waitForTimeout(60);
    const morph = await answer().evaluate((el) => {
      const box = el.parentElement.parentElement;
      return {
        height: box.getBoundingClientRect().height,
        target: el.parentElement.offsetHeight,
        leaving: box.querySelectorAll("[inert][aria-hidden=true]").length,
      };
    });
    check(
      morph.height > before && morph.height < morph.target,
      "Height snapped instead of easing",
    );
    check(morph.leaving === 1, "Outgoing answer is not inert and hidden");
    await page.waitForTimeout(700);
    await page.evaluate(async () => {
      for (let i = 0; i < 30; i++) {
        document
          .querySelector(
            `[aria-label="${i % 2 ? "Next" : "Previous"} version"]`,
          )
          .click();
        await new Promise(requestAnimationFrame);
      }
    });
    await page.waitForTimeout(700);
    check(
      (await page.locator("[inert][aria-hidden=true]").count()) === 0,
      "Outgoing panes lingered",
    );
    check(
      (await answer().innerText()).includes("Main Street"),
      "Rapid reversals lost selected answer",
    );
    report.push(
      "Measured height easing and inert exit panes; 30 rapid reversals without duplicate keys or stale content",
    );

    await button("Previous version").click();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(
      () => document.querySelectorAll("[inert][aria-hidden=true]").length === 0,
    );
    check(
      (await page.locator("[inert][aria-hidden=true]").count()) === 0,
      "Reduced motion retained exits",
    );
    const animations = await answer().evaluate(
      (el) =>
        el.parentElement.parentElement
          .getAnimations({ subtree: true })
          .filter((a) => a.playState === "running").length,
    );
    check(
      animations === 0,
      "Preference change did not cancel answer animations",
    );
    await button("Next version").click();
    check(
      (await answer().innerText()).includes("Main Street"),
      "Reduced motion did not swap immediately",
    );
    await page.setViewportSize({ width: 320, height: 700 });
    check(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "Mobile overflow",
    );
    await page.goto(story("regenerating"));
    check(
      await button("Regenerating").isDisabled(),
      "Busy story can regenerate",
    );
    check(
      await button("Regenerating").evaluate(
        (el) => el.getAnimations({ subtree: true }).length === 0,
      ),
      "Reduced motion spinner animates",
    );
    await page.goto(story("browse-only"));
    await button("Previous version").waitFor();
    check(
      (await button("Regenerate").count()) === 0,
      "Optional regenerate is still rendered",
    );
    report.push(
      "Live reduced motion cancels answer animations, static busy spinner, 320px layout, browse-only mode",
    );
    check(errors.length === 0, errors.join("; "));
    return { passed: report, browserErrors: errors };
  } finally {
    page.off("pageerror", onError);
    page.off("console", onConsole);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ width: 1000, height: 800 });
  }
}
