export default async function verifyClarifyingQuestionText(page) {
  const reports = [];
  const story = (name) =>
    `/iframe.html?id=components-clarifying-question--${name}&viewMode=story`;
  const custom =
    "A community tasting with local families at our new waterfront shop";
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [1000, 320]) {
    await page.setViewportSize({ width, height: 800 });
    for (const action of ["answer", "skip", "custom", "multiple"]) {
      await page.goto(
        story(action === "multiple" ? "multiple" : "long-content"),
      );
      await page.getByRole("button", { name: "Ask again" }).waitFor();
      await page.evaluate(() => document.fonts.ready);
      if (action === "custom") {
        await page
          .getByRole("radio", { name: "Something else…", exact: true })
          .click();
        await page
          .getByRole("textbox", { name: "Something else", exact: true })
          .fill(custom);
      }
      if (action === "multiple") {
        for (const label of ["Seasonal menu", "Local events", "Social media"])
          await page
            .getByRole("checkbox", { name: new RegExp(`^${label}`) })
            .click();
      }
      const result = await page.evaluate(async (action) => {
        const card = document.querySelector('[role="status"]').parentElement;
        const body = card.lastElementChild;
        const text = [
          ...body.querySelectorAll("p, button[role] > span:last-child"),
        ];
        const measure = (element) => {
          const range = document.createRange();
          range.selectNodeContents(element);
          return {
            width: element.getBoundingClientRect().width,
            lines: new Set(
              [...range.getClientRects()].map(
                (r) => Math.round(r.y * 100) / 100,
              ),
            ).size,
          };
        };
        const before = text.map(measure);
        const target =
          action === "answer"
            ? card.querySelector('[role="radio"]')
            : action === "custom"
              ? card.querySelector('[aria-label="Send answer"]')
              : [...card.querySelectorAll("button")].find((el) =>
                  el.textContent.startsWith(
                    action === "skip" ? "Skip" : "Continue",
                  ),
                );
        target.click();
        await new Promise(requestAnimationFrame);
        const animations = card.getAnimations({ subtree: true });
        animations.forEach((a) => a.pause());
        const frames = [0, 40, 100, 180, 280, 459, 461, 650].map((time) => {
          animations.forEach((a) => {
            a.currentTime = time;
          });
          const header = card.firstElementChild;
          return {
            time,
            text: text.map(measure),
            headerLines: [...header.children]
              .slice(1)
              .map((el) => el.getBoundingClientRect().height),
            overflow: document.documentElement.scrollWidth > innerWidth,
          };
        });
        animations.forEach((a) => a.finish());
        return {
          before,
          frames,
          receipt: card.querySelector('[role="status"]').textContent,
        };
      }, action);
      for (const frame of result.frames) {
        if (
          frame.overflow ||
          frame.text.some(
            (text, i) =>
              text.lines !== result.before[i].lines ||
              Math.abs(text.width - result.before[i].width) > 0.1,
          ) ||
          frame.headerLines.some((height) => height > 18.1)
        )
          throw new Error(
            `${width}px ${action}: text rewrapped or overflowed during fold: ${JSON.stringify({ before: result.before, frame })}`,
          );
      }
      if (action === "custom" && !result.receipt.endsWith(custom))
        throw new Error("Custom receipt lost its full accessible answer");
      await page.waitForTimeout(100);
      const ghosts = await page
        .locator('[role="status"]')
        .locator("..")
        .locator(".pointer-events-none")
        .count();
      if (ghosts) throw new Error("Completed fold retained outgoing letters");
    }
    reports.push(
      `${width}px: answer, skip, long custom answer and multiple-selection folds preserve text layout`,
    );
    await page.getByRole("button", { name: "Ask again" }).click();
    await page.getByRole("checkbox", { name: /^Seasonal menu/ }).click();
    await page.getByRole("button", { name: /^Continue/ }).click();
    await page.getByRole("button", { name: "Ask again" }).click();
    if (
      (await page.getByRole("status").innerText()) !== "" ||
      !(await page
        .getByRole("checkbox", { name: /^Seasonal menu/ })
        .isVisible())
    )
      throw new Error("Rapid reset retained the previous receipt");
    reports.push(`${width}px: reset during folding restores the asking state`);
  }
  await page.goto(story("demo"));
  await page.getByRole("radio", { name: /^Main Street/ }).click();
  // Pin the real text animations early in the fold so this interruption is deterministic.
  await page.evaluate(() => {
    const card = document.querySelector('[role="status"]').parentElement;
    card.getAnimations({ subtree: true }).forEach((a) => {
      a.pause();
      a.currentTime = 20;
    });
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(50);
  const reduced = await page.evaluate(() => {
    const header =
      document.querySelector('[role="status"]').parentElement.firstElementChild;
    return {
      ghosts: [...header.querySelectorAll(".pointer-events-none")]
        .map((el) => el.textContent)
        .join(""),
      animations: header.getAnimations({ subtree: true }).length,
    };
  });
  if (reduced.ghosts || reduced.animations)
    throw new Error(
      `Reduced motion retained animated receipt text: ${JSON.stringify(reduced)}`,
    );
  reports.push(
    "Enabling reduced motion during a fold removes outgoing letters and cancels text animations",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1000, height: 800 });
  return { passed: reports };
}
