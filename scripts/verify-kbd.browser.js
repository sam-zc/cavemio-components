import { expect } from "@playwright/test";

export default async function verifyKbd(page) {
  const visit = async (story = "demo") => {
    await page.goto(`/iframe.html?id=components-kbd--${story}&viewMode=story`);
    await page.getByRole("status").waitFor();
  };
  const trigger = page.getByRole("button", { name: "Run shortcut" });
  const status = page.getByRole("status");
  await visit();
  await trigger.click();
  await expect(status).toHaveText("Triggered 1 times; bubbled 0 times");
  await trigger.press("Enter");
  await trigger.press("Space");
  await expect(status).toHaveText("Triggered 3 times; bubbled 0 times");
  await page.getByRole("textbox").focus();
  await page.keyboard.press("Control+k");
  await page.keyboard.press("Meta+k");
  await expect(status).toHaveText("Triggered 5 times; bubbled 0 times");
  await page.keyboard.press("Control+Shift+k");
  await page.keyboard.press("k");
  await page.getByRole("textbox").evaluate((el) => {
    el.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        repeat: true,
        bubbles: true,
        cancelable: true,
      }),
    );
    el.ownerDocument.body.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        ctrlKey: true,
        isComposing: true,
        bubbles: true,
        cancelable: true,
      }),
    );
  });
  await expect(status).toHaveText("Triggered 5 times; bubbled 0 times");
  await page.getByRole("button", { name: "Change shortcut" }).click();
  await page.keyboard.press("Control+k");
  await expect(status).toHaveText("Triggered 5 times; bubbled 0 times");
  await page.keyboard.press("Control+j");
  await expect(status).toHaveText("Triggered 6 times; bubbled 0 times");
  await page.getByRole("button", { name: "Toggle shortcut" }).click();
  await page.keyboard.press("Control+j");
  await expect(status).toHaveText("Triggered 6 times; bubbled 0 times");
  await page.getByRole("button", { name: "Toggle shortcut" }).click();
  await page.keyboard.press("Control+j");
  await expect(status).toHaveText("Triggered 7 times; bubbled 0 times");
  await visit("propagation");
  await trigger.click();
  await expect(status).toHaveText("Triggered 1 times; bubbled 1 times");
  await trigger.press("Control+k");
  await expect(status).toHaveText("Triggered 2 times; bubbled 2 times");
  await visit("disabled");
  await expect(trigger).toBeDisabled();
  await page.keyboard.press("Control+k");
  await expect(status).toHaveText("Triggered 0 times; bubbled 0 times");
  await visit("passive");
  await expect(trigger).toHaveCount(0);
  await page.keyboard.press("Control+k");
  await expect(status).toHaveText("Triggered 0 times; bubbled 0 times");
  await visit();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await trigger.focus();
  await expect(trigger).toBeFocused();
  await trigger.press("Enter");
  await expect(status).toHaveText("Triggered 1 times; bubbled 0 times");
  return {
    click: true,
    nativeKeyboard: true,
    shortcuts: true,
    propagation: true,
    cleanup: true,
    disabled: true,
    passive: true,
  };
}
