import { expect } from "@playwright/test";

export default async function verifyCommandPaletteHighlight(page) {
  await page.goto(
    "/iframe.html?id=components-command-palette--demo&viewMode=story",
  );
  const record = async (action) => {
    await page.evaluate(() => {
      window.paletteBoundsFrames = [];
      const sample = () => {
        const dialog = document.querySelector('[role="dialog"]');
        const highlight = dialog?.querySelector("[data-command-highlight]");
        const rows = Array.from(
          dialog?.querySelectorAll('[role="listbox"] [role="option"]') ?? [],
        );
        if (highlight && rows.length) {
          let opacity = 1;
          let visible = highlight.getBoundingClientRect().toJSON();
          for (
            let parent = highlight.parentElement;
            parent;
            parent = parent.parentElement
          ) {
            const style = getComputedStyle(parent);
            opacity *= Number(style.opacity);
            if (
              /(hidden|auto|scroll|clip)/.test(
                `${style.overflowX} ${style.overflowY}`,
              )
            ) {
              const box = parent.getBoundingClientRect();
              visible = {
                top: Math.max(visible.top, box.top),
                bottom: Math.min(visible.bottom, box.bottom),
                left: Math.max(visible.left, box.left),
                right: Math.min(visible.right, box.right),
              };
            }
          }
          if (
            opacity > 0.01 &&
            visible.bottom > visible.top &&
            visible.right > visible.left
          ) {
            const boxes = rows.map((row) => row.getBoundingClientRect());
            window.paletteBoundsFrames.push({
              phase: dialog.parentElement.dataset.phase,
              overflow: Math.max(
                0,
                Math.min(...boxes.map((box) => box.top)) - visible.top,
                visible.bottom - Math.max(...boxes.map((box) => box.bottom)),
                Math.min(...boxes.map((box) => box.left)) - visible.left,
                visible.right - Math.max(...boxes.map((box) => box.right)),
              ),
            });
          }
        }
        window.paletteBoundsRaf = requestAnimationFrame(sample);
      };
      sample();
    });
    await action();
    await page.waitForTimeout(650);
    return page.evaluate(() => {
      cancelAnimationFrame(window.paletteBoundsRaf);
      return window.paletteBoundsFrames;
    });
  };
  const checkBounds = (frames, name) => {
    expect(frames.length, `${name}: sampled visible highlight`).toBeGreaterThan(
      0,
    );
    expect
      .soft(
        Math.max(...frames.map((frame) => frame.overflow)),
        `${name}: ${JSON.stringify(frames)}`,
      )
      .toBeLessThan(0.75);
  };
  const opening = await record(() =>
    page.getByRole("button", { name: "Search..." }).click(),
  );
  checkBounds(opening, "opening");
  const entering = await record(async () => {
    await page.getByRole("option", { name: /Change appearance/ }).click();
    await page.mouse.move(0, 0);
  });
  checkBounds(entering, "nested entry");
  const back = await record(() => page.getByRole("combobox").press("Escape"));
  checkBounds(back, "back to root");
  const closing = await record(() =>
    page.getByRole("button", { name: "Close search" }).click(),
  );
  checkBounds(closing, "closing");
  const interruptedOpenClose = await record(async () => {
    await page.keyboard.press("Control+k");
    await page.waitForTimeout(60);
    await page.keyboard.press("Control+k");
    await page.waitForTimeout(60);
    await page.keyboard.press("Control+k");
  });
  checkBounds(interruptedOpenClose, "interrupted open/close/reopen");
  await page.getByRole("option", { name: /Change appearance/ }).click();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(450);
  const backspace = await record(() =>
    page.getByRole("combobox").press("Backspace"),
  );
  checkBounds(backspace, "Backspace to root");
  await page.getByRole("option", { name: /Change appearance/ }).click();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(450);
  const nestedClose = await record(() =>
    page.getByRole("button", { name: "Close search" }).click(),
  );
  checkBounds(nestedClose, "closing nested page");
  await page.getByRole("button", { name: "Search..." }).click();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  await page.getByRole("option", { name: /Change appearance/ }).click();
  await page.mouse.move(0, 0);
  const frames = await page.getByRole("dialog").evaluate(async (dialog) => {
    const samples = [];
    const start = performance.now();
    while (performance.now() - start < 650) {
      const row = dialog.querySelector(
        '[role="listbox"] [aria-selected="true"]',
      );
      const highlight = dialog.querySelector("[data-command-highlight]");
      const bounds = row.getBoundingClientRect();
      const plate = highlight.getBoundingClientRect();
      samples.push({
        elapsed: performance.now() - start,
        delta: plate.top - bounds.top,
      });
      await new Promise(requestAnimationFrame);
    }
    return samples;
  });
  // Once the plate has glided to the row, it stays aligned through the
  // remaining pane animation and after the transform is released.
  const settledFrames = frames.filter((frame) => frame.elapsed >= 240);
  expect(settledFrames.length).toBeGreaterThan(0);
  expect(
    Math.max(...settledFrames.map((frame) => Math.abs(frame.delta))),
    JSON.stringify(frames),
  ).toBeLessThan(0.5);
  await page.getByRole("option", { name: "Dark", exact: true }).hover();
  await page.getByRole("option", { name: "Light", exact: true }).hover();
  await page.waitForTimeout(250);
  const hoverDelta = await page.getByRole("dialog").evaluate((dialog) => {
    const row = dialog.querySelector('[role="listbox"] [aria-selected="true"]');
    return (
      dialog.querySelector("[data-command-highlight]").getBoundingClientRect()
        .top - row.getBoundingClientRect().top
    );
  });
  expect(Math.abs(hoverDelta)).toBeLessThan(0.5);
  const input = page.getByRole("combobox", { name: "Search commands" });
  const expectAligned = async () => {
    await expect
      .poll(async () =>
        page.getByRole("dialog").evaluate((dialog) => {
          const row = dialog.querySelector(
            '[role="listbox"] [aria-selected="true"]',
          );
          return Math.abs(
            dialog
              .querySelector("[data-command-highlight]")
              .getBoundingClientRect().top - row.getBoundingClientRect().top,
          );
        }),
      )
      .toBeLessThan(0.5);
  };
  await input.press("ArrowDown");
  await expect(
    page.getByRole("option", { name: "Dark", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expectAligned();
  await input.press("Escape");
  await expectAligned();
  await page.setViewportSize({ width: 320, height: 480 });
  const narrowInterrupted = await record(async () => {
    await page.getByRole("option", { name: /Change appearance/ }).click();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(60);
    await input.press("Escape");
    await page.waitForTimeout(60);
    await page.getByRole("option", { name: /Change appearance/ }).click();
    await page.mouse.move(0, 0);
    await page.emulateMedia({ reducedMotion: "reduce" });
  });
  checkBounds(narrowInterrupted, "narrow reversal and live reduced motion");
  await expectAligned();
  await expect(page.getByRole("dialog").locator("[inert]")).toHaveCount(0);
  await input.press("Escape");
  await expectAligned();
  await page.getByRole("option", { name: /Change appearance/ }).click();
  await page.mouse.move(0, 0);
  await expectAligned();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const narrowBack = await record(() => input.press("Escape"));
  checkBounds(narrowBack, "narrow back to root");
  await input.press("End");
  await expectAligned();
  const scrolledClose = await record(() =>
    page.getByRole("button", { name: "Close search" }).click(),
  );
  checkBounds(scrolledClose, "closing after scrolling to the final row");
  const bounds = {
    opening,
    entering,
    back,
    closing,
    interruptedOpenClose,
    backspace,
    nestedClose,
    narrowInterrupted,
    narrowBack,
    scrolledClose,
  };
  return {
    bounds: Object.fromEntries(
      Object.entries(bounds).map(([name, samples]) => [
        name,
        {
          frameCount: samples.length,
          maxOverflow: Math.max(...samples.map((frame) => frame.overflow)),
        },
      ]),
    ),
    frames,
    hoverDelta,
    keyboard: true,
    interrupted: true,
    reducedMotion: true,
  };
}
