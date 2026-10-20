// Run against the local Storybook with playwright-cli run-code --filename.
// This browser-level regression covers inherited visibility after interrupted
// word animations, plus real pointer tracking across controlled story updates.
export default async function verifyAnswerPaper(page, baseURL) {
  const story = "/iframe.html?id=components-answer-paper--demo&viewMode=story";
  const check = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const errors = [];
  const onError = (error) => errors.push(error.message);
  page.on("pageerror", onError);
  const reports = [];
  await page.setViewportSize({ width: 1000, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(story);
  const slider = page.getByRole("slider", { name: "Answer length" });
  await slider.waitFor();
  const visibleAnswer = async () =>
    page.evaluate(() => {
      const handle = document.querySelector('[role="slider"]');
      const layer = document.getElementById(
        handle.getAttribute("aria-controls"),
      );
      const paper = layer.parentElement.getBoundingClientRect();
      const words = [...layer.querySelectorAll("[data-answer-word]")];
      return {
        level: Number(handle.getAttribute("aria-valuenow")),
        total: words.length,
        hidden: words
          .filter((word) => {
            const css = getComputedStyle(word);
            const rect = word.getBoundingClientRect();
            return (
              css.visibility !== "visible" ||
              Number(css.opacity) < 0.99 ||
              rect.top < paper.top ||
              rect.bottom > paper.bottom + 1
            );
          })
          .map((word) => word.textContent),
        activeLayers: layer.parentElement.querySelectorAll(
          '[aria-hidden="false"]',
        ).length,
        height: paper.height,
        contentHeight: layer.offsetHeight,
        highlights: words.some(
          (word) =>
            getComputedStyle(word).backgroundColor !== "rgba(0, 0, 0, 0)",
        ),
      };
    });
  const settled = async (expected) => {
    await page.waitForTimeout(750);
    const answer = await visibleAnswer();
    check(
      answer.total > 0 && answer.hidden.length === 0,
      "Settled answer contains invisible/clipped words: " +
        JSON.stringify(answer),
    );
    check(
      answer.activeLayers === 1 && !answer.highlights,
      "Incorrect active layer or unexpected word highlight",
    );
    check(
      Math.abs(answer.height - answer.contentHeight) <= 1,
      "Paper did not settle at content height",
    );
    if (expected !== undefined)
      check(
        answer.level === expected,
        `Expected level ${expected}, got ${answer.level}`,
      );
    return answer;
  };
  try {
    await slider.press("End");
    await settled(3);
    const bounds = await page.evaluate(() =>
      [...document.querySelectorAll("[data-answer-layer]")].map(
        (el) => el.offsetHeight,
      ),
    );
    const initial = await slider.boundingBox();
    const x = initial.x + initial.width / 2;
    const y = initial.y + initial.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    let maxTrackingError = 0;
    const visited = new Set([3]);
    const travel = bounds[3] - bounds[0];
    for (const delta of [12, 60, 120, 180, 250, travel, 250, 120, 60, 0]) {
      await page.mouse.move(x, y - delta, { steps: 4 });
      await page.waitForTimeout(35);
      const rect = await slider.boundingBox();
      const error = Math.abs(rect.y + rect.height / 2 - (y - delta));
      maxTrackingError = Math.max(maxTrackingError, error);
      check(
        error < 1.5,
        `Drag detached from pointer by ${error}px at delta ${delta}`,
      );
      visited.add(Number(await slider.getAttribute("aria-valuenow")));
    }
    await page.mouse.up();
    await settled(3);
    check(visited.size === 4, "Drag did not reach all four answer levels");
    reports.push({
      scenario: "drag down and back up",
      maxTrackingError,
      visited: [...visited],
    });

    // Repeated real key input, including interruptions before a morph finishes.
    for (let cycle = 0; cycle < 6; cycle++) {
      for (const key of [
        "Home",
        "End",
        "ArrowUp",
        "ArrowUp",
        "ArrowDown",
        "Home",
      ]) {
        await slider.press(key);
        await page.waitForTimeout(45);
      }
      await settled(0);
    }
    for (const [key, expected] of [
      ["ArrowDown", 1],
      ["ArrowRight", 2],
      ["End", 3],
      ["ArrowLeft", 2],
      ["ArrowUp", 1],
      ["Home", 0],
    ]) {
      await slider.press(key);
      await settled(expected);
    }
    reports.push({
      scenario: "42 keyboard transitions and rapid reversals",
      passed: true,
    });

    await slider.press("End");
    await settled(3);
    let box = await slider.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 - 80, {
      steps: 5,
    });
    await page.mouse.up();
    await page.waitForTimeout(40);
    box = await slider.boundingBox();
    const grabY = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width / 2, grabY);
    await page.mouse.down();
    const grabbedStart = await slider.boundingBox();
    await page.mouse.move(box.x + box.width / 2, grabY - 30, { steps: 4 });
    await page.waitForTimeout(30);
    const grabbed = await slider.boundingBox();
    check(
      Math.abs(grabbed.y - (grabbedStart.y - 30)) < 2,
      `Re-grab jumped during spring settling: ${JSON.stringify({ grabbedStart, grabbed })}`,
    );
    await slider.press("Home");
    await page.mouse.up();
    await settled(0);
    reports.push({
      scenario: "re-grab spring and keyboard takeover",
      passed: true,
    });

    await slider.press("End");
    await settled(3);
    await page.evaluate(() =>
      document.querySelector('[role="slider"]').addEventListener(
        "pointerdown",
        (e) => {
          window.testPointerId = e.pointerId;
        },
        { once: true },
      ),
    );
    box = await slider.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y - 110, { steps: 6 });
    await slider.dispatchEvent("pointercancel", {
      pointerId: await page.evaluate(() => window.testPointerId),
    });
    await page.mouse.up();
    await settled(3);
    reports.push({ scenario: "pointer cancellation", passed: true });

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    await slider.waitFor();
    await slider.press("Home");
    await settled(0);
    const animations = await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((a) => a.effect?.target?.hasAttribute("data-answer-word"))
          .length,
    );
    check(animations === 0, "Reduced motion still animates answer words");
    reports.push({ scenario: "reduced motion", wordAnimations: animations });

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ width: 360, height: 900 });
    await page.reload();
    await slider.waitFor();
    for (const key of ["End", "ArrowUp", "ArrowUp", "Home"]) {
      await slider.press(key);
      await settled();
    }
    check(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "Horizontal overflow on mobile",
    );
    reports.push({ scenario: "360px responsive content", passed: true });

    const context = await page
      .context()
      .browser()
      .newContext({
        baseURL,
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      });
    const mobile = await context.newPage();
    try {
      await mobile.goto(
        "/iframe.html?id=components-answer-paper--demo&viewMode=story",
      );
      const handle = mobile.getByRole("slider", { name: "Answer length" });
      await handle.waitFor();
      await mobile.waitForTimeout(700);
      const box = await handle.boundingBox();
      const x = box.x + box.width / 2,
        y = box.y + box.height / 2;
      const heights = await mobile
        .locator("[data-answer-layer]")
        .evaluateAll((nodes) => nodes.map((n) => n.offsetHeight));
      const distance = heights[3] - heights[0];
      const cdp = await context.newCDPSession(mobile);
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x, y }],
      });
      let maxError = 0;
      const levels = new Set();
      for (let i = 1; i <= 24; i++) {
        const pointerY = y - (distance * i) / 24;
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [{ x, y: pointerY }],
        });
        await mobile.waitForTimeout(20);
        const rect = await handle.boundingBox();
        maxError = Math.max(
          maxError,
          Math.abs(rect.y + rect.height / 2 - pointerY),
        );
        levels.add(await handle.getAttribute("aria-valuenow"));
      }
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
      await mobile.waitForTimeout(750);
      const result = await mobile.evaluate(() => ({
        level: document
          .querySelector("[role=slider]")
          .getAttribute("aria-valuenow"),
        hidden: [
          ...document.querySelectorAll(
            "[aria-hidden=false] [data-answer-word]",
          ),
        ].filter(
          (w) =>
            getComputedStyle(w).visibility !== "visible" ||
            +getComputedStyle(w).opacity < 0.99,
        ).length,
        scrollY,
      }));
      if (
        maxError > 1.5 ||
        result.level !== "0" ||
        result.hidden ||
        result.scrollY
      )
        throw new Error(JSON.stringify({ maxError, result }));
      reports.push({
        scenario: "touch drag",
        maxTrackingError: maxError,
        levels: [...levels],
        ...result,
      });
    } finally {
      await context.close();
    }

    await page.goto(story + "&args=disabled:true");
    await slider.waitFor();
    const disabledLevel = await slider.getAttribute("aria-valuenow");
    await slider.press("Home");
    box = await slider.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y - 100, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(100);
    check(
      (await slider.getAttribute("aria-valuenow")) === disabledLevel,
      "Disabled component responded to input",
    );
    reports.push({ scenario: "disabled pointer and keyboard", passed: true });
    check(errors.length === 0, "Browser errors: " + errors.join("; "));
    return reports;
  } finally {
    page.off("pageerror", onError);
    await page.mouse.up();
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ width: 1000, height: 900 });
  }
}
