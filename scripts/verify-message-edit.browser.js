export default async function verifyMessageEdit(page) {
  const story = (name) =>
    `/iframe.html?id=components-message-edit--${name}&viewMode=story`;
  const check = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const button = (name) => page.getByRole("button", { name, exact: true });
  const field = () =>
    page.getByRole("textbox", { name: "Edit message", exact: true });
  const errors = [];
  const onError = (error) => errors.push(error.message);
  const onConsole = (message) => {
    if (message.type() === "error" && !message.text().includes("404"))
      errors.push(message.text());
  };
  page.on("pageerror", onError);
  page.on("console", onConsole);
  const report = [];
  try {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ width: 1000, height: 800 });
    await page.goto(story("versions"));
    await button("Previous version").waitFor();
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
    check(errors.length === 0, errors[0]);
    check(
      (await page.locator("[aria-hidden=true].pointer-events-none").count()) ===
        0,
      "Stale outgoing version",
    );
    check(
      await page
        .getByText("Keep it short and focus on real ingredients", {
          exact: true,
        })
        .isVisible(),
      "Rapid navigation lost selected text",
    );
    check(
      await button("Next version").isDisabled(),
      "Last version next button enabled",
    );
    report.push(
      "30 rapid version reversals: unique keys, selected text preserved, no stale panes",
    );

    await page.goto(story("demo"));
    await button("Edit message").focus();
    await page.keyboard.press("Enter");
    check(
      await field().evaluate((el) => el === document.activeElement),
      "Edit did not focus textarea",
    );
    check(await button("Send").isDisabled(), "Unchanged message can be sent");
    await field().fill("   ");
    check(await button("Send").isDisabled(), "Blank message can be sent");
    await field().fill("A draft");
    await field().press("Shift+Enter");
    check(
      (await field().inputValue()).includes("\n"),
      "Shift+Enter did not insert newline",
    );
    await field().press("Escape");
    check(
      await button("Edit message").evaluate(
        (el) => el === document.activeElement,
      ),
      "Escape lost focus",
    );
    check(
      await page
        .getByText("Write a two-line tagline for our ice cream shop", {
          exact: true,
        })
        .isVisible(),
      "Cancelled draft replaced message",
    );
    await button("Edit message").click();
    await field().fill("  A warmer tagline for both shops  ");
    await field().press("Enter");
    await page.waitForFunction(
      () =>
        document
          .querySelector('[aria-label="Edit message"]')
          .getAttribute("aria-disabled") !== "true",
    );
    check(
      await page
        .getByText("A warmer tagline for both shops", { exact: true })
        .isVisible(),
      "Edited message missing or not trimmed",
    );
    await button("Previous version").click();
    await page.waitForTimeout(700);
    check(
      await page
        .getByText("Write a two-line tagline for our ice cream shop", {
          exact: true,
        })
        .isVisible(),
      "Resend lost original version",
    );
    await page.evaluate(() =>
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async (text) => {
            window.copiedMessage = text;
          },
        },
      }),
    );
    await button("Copy message").click();
    check(
      await page.evaluate(
        () =>
          window.copiedMessage ===
          "Write a two-line tagline for our ice cream shop",
      ),
      "Copy used wrong version",
    );
    check(
      (await page.getByRole("status").innerText()) === "Copied",
      "Copy status missing",
    );
    report.push(
      "Edit, blank/unchanged guards, multiline entry, cancel/refocus, resend history and copy",
    );

    await page.goto(story("disabled"));
    await button("Edit message").focus();
    await page.keyboard.press("Enter");
    check(
      (await field().count()) === 0 &&
        (await button("Edit message").getAttribute("aria-disabled")) === "true",
      "Disabled edit opened",
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(story("versions"));
    await button("Previous version").focus();
    await page.keyboard.press("Enter");
    check(
      await page
        .getByText("Make it warmer and mention Main Street", { exact: true })
        .isVisible(),
      "Reduced-motion navigation failed",
    );
    check(
      (await page.locator("[aria-hidden=true].pointer-events-none").count()) ===
        0,
      "Reduced motion created outgoing pane",
    );
    check(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "Mobile horizontal overflow",
    );
    report.push("Disabled edit, reduced-motion navigation and 320px layout");
    check(errors.length === 0, errors[0]);
    return { passed: report, browserErrors: errors };
  } finally {
    page.off("pageerror", onError);
    page.off("console", onConsole);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ width: 1000, height: 800 });
  }
}
