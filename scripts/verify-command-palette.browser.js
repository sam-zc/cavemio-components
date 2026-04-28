import { expect } from "@playwright/test";

export default async function verifyCommandPalette(page) {
  // Exercise optional states through Demo args without additional sidebar stories.
  const visit = async (
    args = { showcase: false, simulateSyncFailure: true },
  ) => {
    const query = new URLSearchParams({
      id: "components-command-palette--demo",
      viewMode: "story",
      args: Object.entries(args)
        .map(([key, value]) => `${key}:${value}`)
        .join(";"),
    });
    await page.goto(`/iframe.html?${query}`);
    await page.locator("[data-demo-result]").waitFor();
    await page.evaluate(() => document.fonts.ready);
  };
  const input = page.getByRole("combobox", { name: "Search commands" });
  const dialog = page.getByRole("dialog");
  const trigger = page.getByRole("button", { name: "Search...", exact: true });
  const close = page.getByRole("button", { name: "Close search" });
  await visit();
  await expect(trigger.locator("kbd")).toBeVisible();
  await expect(trigger).toContainText("Search...");
  const triggerLayout = await trigger.evaluate((el) => {
    const label = el.firstElementChild.getBoundingClientRect();
    const badge = el.querySelector("kbd").getBoundingClientRect();
    return {
      gap: badge.left - label.right,
      hitTarget: [-21, 21].every((offset) => {
        const rect = el.getBoundingClientRect();
        return (
          document
            .elementFromPoint(
              rect.x + rect.width / 2,
              rect.y + rect.height / 2 + offset,
            )
            ?.closest("button") === el
        );
      }),
    };
  });
  expect(triggerLayout.gap).toBeGreaterThan(0);
  expect(triggerLayout.hitTarget).toBe(true);
  await trigger.focus();
  await page.keyboard.press("Control+k");
  await expect(input).toBeFocused();
  await page.keyboard.down("Control");
  await page.keyboard.down("k");
  await page.keyboard.down("k");
  await page.keyboard.up("k");
  await page.keyboard.up("Control");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  // The compact surface retains a usable hit area beyond its visible top edge.
  const triggerBox = await trigger.boundingBox();
  await page.mouse.click(triggerBox.x + triggerBox.width / 2, triggerBox.y - 5);
  await expect(input).toBeFocused();
  // Pin actual intermediate geometry: the surface grows, while content keeps its target width.
  await page.waitForTimeout(40);
  const frames = await dialog.evaluate((el) => {
    const content = el.querySelector("input").parentElement.parentElement;
    const animations = [...el.getAnimations(), ...content.getAnimations()];
    animations.forEach((animation) => animation.pause());
    const result = [80, 220, 439, 441].map((time) => {
      animations.forEach((animation) => {
        animation.currentTime = time;
      });
      return {
        shell: el.getBoundingClientRect().width,
        content: content.getBoundingClientRect().width,
        opacity: Number(getComputedStyle(content).opacity),
      };
    });
    animations.forEach((animation) => animation.finish());
    return result;
  });
  expect(frames[0].shell).toBeLessThan(frames.at(-1).shell);
  // Content joins the expansion instead of leaving an empty growing shell.
  expect(frames[0].opacity).toBeGreaterThan(0.05);
  expect(frames[1].opacity).toBeGreaterThan(0.75);
  expect(frames[1].opacity).toBeLessThan(1);
  expect(
    frames.every((frame) => Math.abs(frame.content - frames[0].content) < 0.1),
  ).toBe(true);
  await input.fill("brand");
  await expect(page.getByRole("option")).toHaveCount(1);
  await input.press("Enter");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator("[data-demo-result]")).toHaveText(
    "Opened Brand guidelines",
  );
  await trigger.click();
  await page.getByRole("option", { name: /Change appearance/ }).click();
  await expect(
    page.getByRole("option", { name: "Light", exact: true }),
  ).toBeVisible();
  await input.press("Backspace");
  await expect(
    page.getByRole("option", { name: /Website redesign/ }),
  ).toBeVisible();
  await input.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Workspace help" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(input).toBeFocused();
  await input.fill("Sync shared files");
  await input.press("Enter");
  await expect(dialog.getByRole("status")).toContainText("failed");
  await input.press("Enter");
  await expect(dialog).toHaveCount(0);
  await expect(page.locator("[data-demo-result]")).toHaveText(
    "Shared files are up to date",
  );
  await trigger.click();
  await input.fill("Export project");
  await input.press("Enter");
  await expect(dialog.getByRole("status")).toContainText("Running");
  await close.click();
  await expect(dialog).toHaveCount(0);
  await trigger.click();
  await input.fill("project");
  await page.waitForTimeout(2200);
  await expect(input).toHaveValue("project");
  await expect(dialog).toBeVisible();
  await close.click();
  await expect(dialog).toHaveCount(0);
  expect(
    await page.locator("main").evaluate((el) => !!el.closest("[inert]")),
  ).toBe(false);

  await visit({ controlled: true, showcase: false });
  const opener = page.getByRole("button", { name: "Open commands" });
  await opener.click();
  await expect(input).toBeFocused();
  await close.click();
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
  await page.keyboard.press("Control+k");
  await expect(input).toBeFocused();
  await page.keyboard.press("Control+k");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
  await visit({ defaultOpen: true });
  await expect(input).toBeFocused();
  await expect(
    page.getByRole("option", { name: /Website redesign/ }),
  ).toBeVisible();

  await page.setViewportSize({ width: 320, height: 480 });
  await visit({ longContent: true, showcase: false });
  await trigger.click();
  await expect
    .poll(async () => {
      const box = await dialog.boundingBox();
      return (
        box &&
        box.x >= 0 &&
        box.x + box.width <= 320 &&
        box.y + box.height <= 480
      );
    })
    .toBe(true);
  await input.fill("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(input).toHaveValue("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
  await expect(dialog.getByRole("status")).toContainText("No results");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await close.click();
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await visit({ empty: true, showcase: false });
  await trigger.click();
  await expect(dialog.getByRole("status")).toMatchAriaSnapshot(
    "- status: Nothing here yet",
  );
  // Reference layout: compact trigger, aligned content, removable scopes and a usable footer.
  await page.setViewportSize({ width: 1100, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await visit({});
  const triggerContentsFit = await trigger.evaluate((el) => {
    const outer = el.getBoundingClientRect();
    return [...el.children].every((child) => {
      const box = child.getBoundingClientRect();
      return (
        box.left > outer.left &&
        box.right < outer.right &&
        box.top >= outer.top &&
        box.bottom <= outer.bottom
      );
    });
  });
  expect(triggerContentsFit).toBe(true);
  await trigger.click();
  await expect(dialog.getByText("Search in", { exact: true })).toBeVisible();
  await page.getByRole("option", { name: /Change appearance/ }).click();
  await expect(
    page.getByRole("option", { name: "Light", exact: true }),
  ).toBeVisible();
  await expect(dialog.locator("[data-command-filters]")).toHaveCount(0);
  await input.press("Escape");
  await expect(dialog.locator("[data-command-filters] button")).toHaveCount(3);
  await expect(dialog.getByRole("option")).toHaveCount(6);
  await expect(
    dialog.locator('[role="option"] > [aria-hidden="true"] svg'),
  ).toHaveCount(6);
  await page.waitForTimeout(500);
  const geometry = await dialog.evaluate((el) => {
    const bounds = el.getBoundingClientRect();
    const inputRow = el.querySelector("input").parentElement;
    const footer = el.querySelector("[data-command-footer]").parentElement;
    const firstOption = el.querySelector('[role="option"]');
    const filter = el.querySelector("[data-command-filters]");
    const style = getComputedStyle(inputRow);
    const footerStyle = getComputedStyle(footer);
    return {
      headerPadding: [style.paddingLeft, style.paddingRight],
      footerPadding: [footerStyle.paddingLeft, footerStyle.paddingRight],
      rowInsets: [
        firstOption.getBoundingClientRect().left - bounds.left,
        bounds.right - firstOption.getBoundingClientRect().right,
      ],
      chipsVisible:
        filter.getBoundingClientRect().top >=
        inputRow.getBoundingClientRect().bottom,
      footerAligned:
        Math.abs(
          footer.children[0].getBoundingClientRect().top -
            footer.children[1].getBoundingClientRect().top,
        ) < 2,
    };
  });
  expect(geometry.headerPadding[0]).toBe(geometry.headerPadding[1]);
  expect(geometry.footerPadding).toEqual(geometry.headerPadding);
  expect(Math.abs(geometry.rowInsets[0] - geometry.rowInsets[1])).toBeLessThan(
    0.5,
  );
  expect(geometry.chipsVisible).toBe(true);
  expect(geometry.footerAligned).toBe(true);
  await input.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Remove Projects filter" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(input).toBeFocused();
  await expect(
    dialog.getByRole("option", { name: /Website redesign/ }),
  ).toHaveCount(0);
  await expect(dialog.locator("[data-command-filters] button")).toHaveCount(2);
  await input.press("Shift+Tab");
  const help = page.getByRole("button", { name: "Workspace help" });
  await expect(help).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(dialog.getByRole("status")).toContainText("Search “brand”");
  await page.setViewportSize({ width: 320, height: 480 });
  await expect
    .poll(async () => {
      const box = await dialog.boundingBox();
      const footerBox = await dialog
        .locator("[data-command-footer]")
        .boundingBox();
      return (
        box &&
        box.x >= 0 &&
        box.x + box.width <= 320 &&
        box.y + box.height <= 480 &&
        footerBox.y + footerBox.height <= box.y + box.height
      );
    })
    .toBe(true);
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Remove Actions filter" }).click();
  await expect(input).toBeFocused();
  await expect(
    dialog.getByRole("option", { name: /Create a design brief/ }),
  ).toHaveCount(0);
  await close.click();
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await visit({});
  await trigger.click();
  await input.fill("Sync shared files");
  await input.press("Enter");
  await expect(dialog).toHaveCount(0);
  await expect(page.locator("[data-demo-result]")).toHaveText(
    "Shared files are up to date",
  );
  return {
    passed: [
      "Opening frames preserve text width",
      "Equal side padding, visible filter chips, leading icons and aligned responsive footer",
      "Keyboard chip removal filters results and restores input focus; Workspace help stays reachable",
      "Search, nested navigation, focus trap/return, default-open and controlled modes",
      "Async failure/retry and stale completion isolation",
      "320px short viewport, empty/long results, live reduced motion",
    ],
  };
}
