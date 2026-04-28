import { expect } from "@playwright/test";

export default async function verifySelect(page) {
  await page.goto("/iframe.html?id=components-select--demo&viewMode=story");
  const plan = page.getByRole("button", {
    name: "Plan: Personal",
    exact: true,
  });
  await plan.focus();
  await plan.press("ArrowDown");
  const list = page.getByRole("listbox", { name: "Plan", exact: true });
  await expect(list).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("Selected plan: Team");
  await expect(
    page.getByRole("button", { name: "Plan: Team", exact: true }),
  ).toBeFocused();
  await expect(list).toHaveCount(0);
  await page
    .getByRole("button", { name: "Plan: Team", exact: true })
    .press("ArrowDown");
  await expect(list).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Plan: Team", exact: true }),
  ).toBeFocused();
  await expect(list).toHaveCount(0);

  await page.setViewportSize({ width: 320, height: 600 });
  const language = page.getByRole("button", {
    name: "Language: English",
    exact: true,
  });
  await language.click();
  const languages = page.getByRole("listbox", {
    name: "Language",
    exact: true,
  });
  await expect(languages).toBeFocused();
  await page.keyboard.type("tam");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Language: Tamil", exact: true }),
  ).toBeFocused();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page
    .getByRole("button", { name: "Language: Tamil", exact: true })
    .click();
  await expect(languages).toBeFocused();
  const surface = languages.locator("xpath=../../..");
  await expect(surface).toHaveCSS("transition-duration", "0s");
  const bounds = await surface.boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
  await page.keyboard.press("Home");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Language: Arabic", exact: true }),
  ).toBeFocused();

  await page.goto("/iframe.html?id=components-select--disabled&viewMode=story");
  await expect(
    page.getByRole("button", { name: "Plan: Personal", exact: true }),
  ).toBeDisabled();
  await page.goto("/iframe.html?id=components-select--error&viewMode=story");
  const invalid = page.getByRole("button", {
    name: "Plan: Personal",
    exact: true,
  });
  await expect(invalid).toHaveAttribute("data-invalid", "true");
  await expect(invalid).toHaveAttribute("aria-invalid", "true");
  await expect(invalid).toHaveAccessibleDescription(
    "Choose a plan to continue.",
  );
  await page.goto(
    "/iframe.html?id=components-select--live-disabled&viewMode=story",
  );
  const livePlan = page.getByRole("button", {
    name: "Plan: Personal",
    exact: true,
  });
  await livePlan.press("ArrowDown");
  const liveList = page.getByRole("listbox", { name: "Plan", exact: true });
  await expect(liveList).toBeFocused();
  // Change the prop while focus remains inside the portal; an outside click
  // would dismiss it anyway and conceal the disabled-state regression.
  await page.keyboard.press("F8");
  await expect(livePlan).toBeDisabled();
  await expect(liveList).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveText(
    "Selected: personal. Changes: 0.",
  );
  await page.getByRole("button", { name: "Enable select" }).click();
  await expect(livePlan).toBeEnabled();
  await expect(liveList).toHaveCount(0);
  await livePlan.press("ArrowDown");
  await expect(liveList).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText(
    "Selected: team. Changes: 1.",
  );
  return {
    keyboard: true,
    typeahead: true,
    narrow: true,
    reducedMotion: true,
    disabled: true,
    liveDisabled: true,
    validation: true,
  };
}
