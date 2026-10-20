export default async function verifyResponseVersionsText(page) {
  const reports = [];
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [1000, 320]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(
      "/iframe.html?id=components-response-versions--versions&viewMode=story",
    );
    await page.getByRole("button", { name: "Previous version" }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    for (const direction of ["Previous", "Previous", "Next", "Next"]) {
      const result = await page.evaluate(async (direction) => {
        const box = [...document.querySelectorAll("p")].at(-1).parentElement
          .parentElement;
        const measure = (pane) => {
          const range = document.createRange();
          range.selectNodeContents(pane);
          return {
            width: pane.getBoundingClientRect().width,
            lines: new Set([...range.getClientRects()].map((rect) => rect.y))
              .size,
          };
        };
        const before = measure(box.lastElementChild);
        document.querySelector(`[aria-label="${direction} version"]`).click();
        await new Promise(requestAnimationFrame);
        const animations = box
          .getAnimations({ subtree: true })
          .filter((a) => a.constructor.name === "Animation");
        animations.forEach((a) => a.pause());
        const leaving = measure(box.querySelector("[inert]"));
        const resize = box.getAnimations()[0];
        const target = resize
          ? Number.parseFloat(resize.effect.getKeyframes().at(-1).height)
          : null;
        const natural = box.lastElementChild.getBoundingClientRect().height;
        const frames = [0, 60, 120, 240, 419, 421, 480].map((time) => {
          animations.forEach((a) => {
            a.currentTime = time;
          });
          return measure(box.lastElementChild);
        });
        animations.forEach((a) => a.finish());
        return { before, leaving, frames, target, natural };
      }, direction);
      if (
        result.target !== null &&
        Math.abs(result.target - result.natural) > 0.1
      )
        throw new Error(
          `${width}px ${direction}: resize rounded the text height: ${JSON.stringify(result)}`,
        );
      if (
        JSON.stringify(result.before) !== JSON.stringify(result.leaving) ||
        result.frames.some(
          (frame) =>
            frame.lines !== result.frames.at(-1).lines ||
            Math.abs(frame.width - result.frames.at(-1).width) > 0.1,
        )
      )
        throw new Error(
          `${width}px ${direction}: text rewrapped during transition: ${JSON.stringify(result)}`,
        );
      await page.waitForTimeout(100);
    }
    reports.push(
      `${width}px: both text layers retain their widths and line breaks through all arrow transitions`,
    );
    const reversal = await page.evaluate(async () => {
      const box = [...document.querySelectorAll("p")].at(-1).parentElement
        .parentElement;
      document.querySelector('[aria-label="Previous version"]').click();
      await new Promise(requestAnimationFrame);
      const first = box.getAnimations()[0];
      first.pause();
      first.currentTime = 40;
      const before = box.getBoundingClientRect().height;
      document.querySelector('[aria-label="Next version"]').click();
      await new Promise(requestAnimationFrame);
      const next = box.getAnimations()[0];
      next.pause();
      next.currentTime = 0;
      const after = box.getBoundingClientRect().height;
      const target = Number.parseFloat(
        next.effect.getKeyframes().at(-1).height,
      );
      const natural = box.lastElementChild.getBoundingClientRect().height;
      box.getAnimations({ subtree: true }).forEach((a) => a.finish());
      return { before, after, target, natural };
    });
    if (
      Math.abs(reversal.before - reversal.after) > 0.1 ||
      Math.abs(reversal.target - reversal.natural) > 0.1
    )
      throw new Error(
        `${width}px: interrupted transition jumped: ${JSON.stringify(reversal)}`,
      );
    reports.push(
      `${width}px: arrow reversal continues from the visible height without jumping`,
    );
  }
  await page.setViewportSize({ width: 1000, height: 800 });
  return { passed: reports };
}
