export default async function verifyMessageEditText(page) {
  const reports = [];
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [1000, 320]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(
      "/iframe.html?id=components-message-edit--versions&viewMode=story",
    );
    await page.getByRole("button", { name: "Previous version" }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    for (const direction of ["Previous", "Previous", "Next", "Next"]) {
      const report = await page.evaluate(async (direction) => {
        const root = document.querySelector(".group\\/message");
        const surface = root.firstElementChild;
        const pane = () => surface.firstElementChild.lastElementChild;
        const lines = (el) => {
          const range = document.createRange();
          range.selectNodeContents(el);
          return [...new Set([...range.getClientRects()].map((r) => r.y))]
            .length;
        };
        const before = {
          width: pane().getBoundingClientRect().width,
          lines: lines(pane()),
        };
        root.querySelector(`[aria-label="${direction} version"]`).click();
        await new Promise(requestAnimationFrame);
        const animations = surface
          .getAnimations({ subtree: true })
          .filter((a) => a.constructor.name === "Animation");
        animations.forEach((a) => a.pause());
        const outgoing = surface.querySelector("[aria-hidden=true]");
        const leaving = {
          width: outgoing.getBoundingClientRect().width,
          lines: lines(outgoing),
        };
        // Scrub the actual animations, including the instant before their fill ends.
        const frames = [0, 60, 120, 240, 419, 421, 480].map((time) => {
          animations.forEach((a) => {
            a.currentTime = time;
          });
          return {
            time,
            width: pane().getBoundingClientRect().width,
            lines: lines(pane()),
            height: pane().getBoundingClientRect().height,
            surfaceHeight: surface.getBoundingClientRect().height,
          };
        });
        animations.forEach((a) => a.finish());
        return { before, leaving, frames };
      }, direction);
      if (
        Math.abs(report.before.width - report.leaving.width) > 0.1 ||
        report.before.lines !== report.leaving.lines
      )
        throw new Error(
          `${width}px ${direction}: previous text rewrapped on exit: ${JSON.stringify(report)}`,
        );
      const settled = report.frames.at(-1);
      if (
        report.frames.some(
          (frame) =>
            frame.lines !== settled.lines ||
            Math.abs(frame.width - settled.width) > 0.1,
        )
      )
        throw new Error(
          `${width}px ${direction}: incoming text rewrapped during resize: ${JSON.stringify(report)}`,
        );
      reports.push(
        `${width}px ${direction}: previous and incoming text retain their line breaks`,
      );
      await page.waitForTimeout(100);
      const released = await page.evaluate(() => {
        const pane =
          document.querySelector(".group\\/message").firstElementChild
            .firstElementChild.lastElementChild;
        return !pane.style.width && !pane.style.marginLeft;
      });
      if (!released)
        throw new Error("Text width remained locked after the transition");
    }
  }
  // Interrupt a transition, then change the motion preference while it runs.
  await page.getByRole("button", { name: "Previous version" }).click();
  await page.getByRole("button", { name: "Next version" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(50);
  const cancelled = await page.evaluate(() => {
    const surface =
      document.querySelector(".group\\/message").firstElementChild;
    const pane = surface.firstElementChild.lastElementChild;
    return (
      !surface.querySelector("[aria-hidden=true]") &&
      !pane.style.width &&
      !pane.style.marginLeft &&
      !surface
        .getAnimations({ subtree: true })
        .some((a) => a.constructor.name === "Animation")
    );
  });
  if (!cancelled)
    throw new Error(
      "Reduced motion did not release interrupted version animations",
    );
  reports.push(
    "Interrupted transition cancels cleanly when reduced motion is enabled",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1000, height: 800 });
  return { passed: reports };
}
