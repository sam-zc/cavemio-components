export default async function verifyClarifyingQuestion(page) {
  const story = (name) =>
    `/iframe.html?id=components-clarifying-question--${name}&viewMode=story`;
  const check = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const button = (name) => page.getByRole("button", { name, exact: true });
  const receipt = () => page.getByRole("status");
  const card = () => receipt().locator("..");
  const errors = [];
  const onError = (error) => errors.push(error.message);
  page.on("pageerror", onError);
  const report = [];
  try {
    await page.setViewportSize({ width: 1000, height: 800 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(story("keyboard"));
    const first = page.getByRole("radio", { name: /^Main Street/ });
    await first.waitFor();
    check(
      await first.evaluate((el) => el === document.activeElement),
      "Autofocus failed",
    );
    await page.keyboard.press("ArrowDown");
    check(
      await page
        .getByRole("radio", { name: /^Harbour Road/ })
        .evaluate((el) => el === document.activeElement),
      "Arrow navigation failed",
    );
    const expanded = await card().evaluate((el) => el.offsetHeight);
    await page.keyboard.press("2");
    await page.waitForTimeout(80);
    const folding = await card().evaluate(
      (el) => el.getBoundingClientRect().height,
    );
    await page.waitForTimeout(550);
    const folded = await card().evaluate((el) => el.offsetHeight);
    check(
      expanded > folding && folding > folded,
      "Card did not animate its height",
    );
    check(
      (await receipt().innerText()).endsWith("Harbour Road"),
      "Numeric answer incorrect",
    );
    check(
      await card().evaluate((el) => el === document.activeElement),
      "Number-key answer lost receipt focus",
    );
    check(
      (await page.getByRole("radio").count()) === 0,
      "Answered options remain accessible",
    );
    check(
      (await card().locator("[inert][aria-hidden=true]").count()) === 1,
      "Folded controls are not inert",
    );
    report.push(
      "Autofocus, arrow/number keys, animated folding, receipt focus and inert controls",
    );

    await button("Ask again").click();
    await page
      .getByRole("radio", { name: "Something else…", exact: true })
      .click();
    const field = page.getByRole("textbox", {
      name: "Something else",
      exact: true,
    });
    check(
      await field.evaluate((el) => el === document.activeElement),
      "Custom answer field not focused",
    );
    check(
      await button("Send answer").isDisabled(),
      "Empty custom answer can submit",
    );
    await field.fill("   ");
    await field.press("Enter");
    check(await field.isVisible(), "Whitespace answer submitted");
    await field.fill("A third shop at 123 Market Street");
    check(
      (await receipt().innerText()) === "",
      "Typing digits selected an option",
    );
    await field.press("Escape");
    // Escape restores the row's focus on the next animation frame.
    await page.waitForFunction(
      () =>
        document.activeElement?.getAttribute("role") === "radio" &&
        document.activeElement.textContent.includes("Something else"),
      undefined,
      { timeout: 1000 },
    );
    check(
      await page
        .getByRole("radio", { name: "Something else…", exact: true })
        .evaluate((el) => el === document.activeElement),
      "Escape did not restore focus",
    );
    await page.keyboard.press("Enter");
    await field.fill("  Market Street  ");
    await field.press("Enter");
    check(
      (await receipt().innerText()).endsWith(": Market Street"),
      "Custom answer was not trimmed/submitted",
    );
    await button("Ask again").click();
    await button("Skip").click();
    check(
      (await receipt().innerText()).includes("Skipped, the agent will decide"),
      "Skip receipt missing",
    );
    check(
      await card().evaluate((el) => el === document.activeElement),
      "Skip lost focus",
    );
    report.push(
      "Custom text, whitespace guard, digit typing, Escape, Enter, reset and Skip",
    );

    await page.goto(story("multiple"));
    const continueButton = page.getByRole("button", { name: /^Continue/ });
    check(
      await continueButton.isDisabled(),
      "Empty multiple selection can submit",
    );
    const events = page.getByRole("checkbox", { name: /^Local events/ });
    await events.click();
    await page.getByRole("checkbox", { name: /^Seasonal menu/ }).click();
    await events.click();
    check(
      (await events.getAttribute("aria-checked")) === "false",
      "Checkbox did not toggle off",
    );
    await events.click();
    await page
      .getByRole("checkbox", { name: "Something else…", exact: true })
      .click();
    await field.fill("A community tasting");
    check(
      (await continueButton.innerText()).includes("3 selected"),
      "Selection count did not include custom text",
    );
    await continueButton.click();
    check(
      (await receipt().innerText()).endsWith(
        "Seasonal menu, Local events, A community tasting",
      ),
      "Multi-answer order/custom text incorrect",
    );
    report.push(
      "Multiple selection, deselection, count, custom text and ordered receipt",
    );

    await page.goto(story("long-content"));
    await page.getByRole("radio", { name: /^Harbour Road/ }).focus();
    await page.setViewportSize({ width: 320, height: 700 });
    await page.waitForTimeout(350);
    const highlight = await page.getByRole("radiogroup").evaluate((group) => {
      const row = group.querySelector('[tabindex="0"]');
      const active = group.firstElementChild;
      return {
        rowHeight: row.offsetHeight,
        height: active.offsetHeight,
        rowTop: row.offsetTop,
        top: new DOMMatrixReadOnly(getComputedStyle(active).transform).m42,
      };
    });
    check(
      highlight.height === highlight.rowHeight &&
        Math.abs(highlight.top - highlight.rowTop) < 1,
      "Highlight missed resized row",
    );
    check(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "Mobile layout overflows",
    );
    report.push(
      "Wrapped descriptions and matching row highlight after resizing to 320px",
    );

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(story("demo"));
    await page.getByRole("radio", { name: /^Main Street/ }).waitFor();
    check(
      await card().evaluate(
        (el) =>
          el
            .getAnimations({ subtree: true })
            .filter((a) => a.playState === "running").length === 0,
      ),
      "Reduced-motion status is animating",
    );
    await page.getByRole("radio", { name: /^Main Street/ }).click();
    check(
      await card()
        .locator("[inert]")
        .evaluate((el) => getComputedStyle(el).transitionDuration === "0s"),
      "Reduced-motion fold is animated",
    );
    for (const [state, text] of [
      ["answered", "Main Street"],
      ["skipped", "Skipped, the agent will decide"],
    ]) {
      await page.goto(story(state));
      await receipt().waitFor({ state: "attached" });
      check(
        (await receipt().innerText()).includes(text),
        `${state} receipt missing`,
      );
    }
    await page.goto(story("options-only"));
    await page.getByRole("radio", { name: /^Main Street/ }).waitFor();
    check(
      (await button("Skip").count()) === 0 &&
        (await page
          .getByRole("radio", { name: "Something else…", exact: true })
          .count()) === 0,
      "Optional choices were not removed",
    );
    check(errors.length === 0, errors.join("; "));
    report.push(
      "Reduced motion, saved answer/skip receipts and options-only mode",
    );
    return { passed: report, browserErrors: errors };
  } finally {
    page.off("pageerror", onError);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ width: 1000, height: 800 });
  }
}
