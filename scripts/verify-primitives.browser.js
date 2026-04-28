import { expect } from "@playwright/test";

export default async function verifyPrimitives(page) {
  await page.goto(
    "/iframe.html?id=components-text-morph--labels&viewMode=story",
  );
  const text = page.getByTestId("morph-value");
  await expect(text.locator(".sr-only")).toHaveText("Save");
  for (const label of ["Saving", "Saved", "Copy link", "Following", "Save"]) {
    await page.getByRole("button", { name: label, exact: true }).click();
    await expect(text.locator(".sr-only")).toHaveText(label);
  }
  await page.getByRole("button", { name: "Subscribe", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(text.locator(".sr-only")).toHaveText("Subscribe");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("tab", { name: "Headline", exact: true }).click();
  await page.getByRole("button", { name: "Next word" }).click();
  await expect(page.locator(".primitive-headline .sr-only")).toHaveText(
    "designers",
  );
  await page.goto(
    "/iframe.html?id=components-number-roll--digit-boundary&viewMode=story",
  );
  const number = page.getByTestId("roll-value").locator(".sr-only");
  await page.getByRole("button", { name: "+1", exact: true }).click();
  await expect(number).toHaveText("1,000");
  await page.getByRole("button", { name: "−1", exact: true }).click();
  await expect(number).toHaveText("999");
  await page.getByRole("tab", { name: "Currency", exact: true }).click();
  await expect(number).toHaveText("US$1,248");
  await page.getByRole("tab", { name: "Compact", exact: true }).click();
  await expect(number).toHaveText("9.4k");
  await page.getByRole("tab", { name: "Live", exact: true }).click();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Resume", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.setViewportSize({ width: 320, height: 700 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  return {
    labels: true,
    keyboard: true,
    digitBoundary: true,
    formats: true,
    pause: true,
    narrow: true,
  };
}
