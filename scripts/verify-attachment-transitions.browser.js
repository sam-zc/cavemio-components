export default async function verifyAttachmentTransitions(page) {
  const story =
    "/iframe.html?id=components-drop-zone-membrane--attachment-transitions&viewMode=story";
  const check = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const errors = [];
  const onError = (error) => errors.push(error.message);
  page.on("pageerror", onError);
  const report = [];
  const states = [
    ["Ready", "idle"],
    ["Uploading", "uploading"],
    ["Processing", "processing"],
    ["Failed", "error"],
    ["Uploaded", "done"],
  ];
  const card = page.locator("[data-slot=attachment]");
  const button = (name) => page.getByRole("button", { name, exact: true });
  const waitState = (state) =>
    page
      .locator('[data-slot=attachment][data-state="' + state + '"]')
      .waitFor();
  const inspect = () =>
    page.evaluate(() => {
      const card = document.querySelector("[data-slot=attachment]");
      const rect = card.getBoundingClientRect();
      const title = card.querySelector("[data-slot=attachment-title]");
      const description = card.querySelector("[data-attachment-description]");
      const remove = card.querySelector(
        '[aria-label^="Remove "], [aria-label^="Cancel "]',
      );
      const icons = [...card.querySelectorAll("[data-attachment-icon]")];
      const descriptions = [
        ...card.querySelectorAll("[data-attachment-description]"),
      ];
      return {
        state: card.dataset.state,
        height: rect.height,
        iconCount: icons.length,
        descriptionCount: descriptions.length,
        visibleIcon: icons.some(
          (el) => Number(getComputedStyle(el).opacity) > 0.1,
        ),
        visibleDescription: descriptions.some(
          (el) => Number(getComputedStyle(el).opacity) > 0.1,
        ),
        titleX: title.getBoundingClientRect().left - rect.left,
        titleY: title.getBoundingClientRect().top - rect.top,
        removeRight: rect.right - remove.getBoundingClientRect().right,
        removeY: remove.getBoundingClientRect().top - rect.top,
        descriptionFits:
          description.getBoundingClientRect().bottom <= rect.bottom + 1,
        bar: new DOMMatrixReadOnly(
          getComputedStyle(card.querySelector("[data-attachment-progress]"))
            .transform,
        ).a,
        trayHeight: card
          .querySelector("[data-attachment-progress-tray]")
          .getBoundingClientRect().height,
      };
    });
  try {
    await page.setViewportSize({ width: 1000, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(story);
    await card.waitFor();
    await page.waitForTimeout(400);
    const title = await page
      .locator("[data-slot=attachment-title]")
      .elementHandle();
    const remove = await button("Remove design-system.pdf").elementHandle();
    const baseline = await inspect();

    for (const [label, state] of states) {
      await button(label).click();
      await page.waitForTimeout(550);
      const view = await inspect();
      check(
        view.state === state &&
          view.iconCount === 1 &&
          view.descriptionCount === 1,
        "State layers did not settle: " + JSON.stringify(view),
      );
      check(
        view.visibleIcon && view.visibleDescription && view.descriptionFits,
        "State content hidden or clipped: " + JSON.stringify(view),
      );
      for (const key of ["titleX", "titleY", "removeRight", "removeY"])
        check(
          Math.abs(view[key] - baseline[key]) < 1,
          key + " jumped during " + state,
        );
      check(
        await title.evaluate(
          (el) => el === document.querySelector("[data-slot=attachment-title]"),
        ),
        "Filename was remounted",
      );
      check(
        await remove.evaluate((el) => el.isConnected),
        "Remove button was remounted",
      );
    }
    report.push(
      "All five states settle visibly with stable filename and remove-button nodes/positions",
    );

    await button("Ready").click();
    await page.waitForTimeout(350);
    const start = (await inspect()).height;
    await button("Uploading").click();
    await page.waitForTimeout(50);
    const middle = (await inspect()).height;
    await page.waitForTimeout(450);
    const end = (await inspect()).height;
    check(
      middle > start && middle < end && Math.abs(end - start - 16) < 1,
      "Progress tray snapped instead of animating",
    );
    const icon = await page
      .locator("[data-attachment-icon=uploading]")
      .elementHandle();
    const slider = page.getByRole("slider", { name: "Upload progress" });
    await slider.press("Home");
    await page.waitForTimeout(600);
    await slider.press("End");
    await page.waitForTimeout(50);
    const filling = await inspect();
    check(filling.bar > 0 && filling.bar < 1, "Progress did not interpolate");
    await page.waitForTimeout(650);
    check(
      Math.abs((await inspect()).bar - 1) < 0.002,
      "Progress did not reach 100%",
    );
    for (let i = 0; i < 20; i++) await slider.press("ArrowLeft");
    check(
      await icon.evaluate(
        (el) =>
          el === document.querySelector("[data-attachment-icon=uploading]"),
      ),
      "Progress updates restarted the icon",
    );
    report.push(
      "Measured tray-height animation, spring progress and stable icon during percentage updates",
    );

    // Interrupt transitions on consecutive frames, including returning to a still-exiting state.
    const burst = await page.evaluate(async () => {
      const order = [
        "Ready",
        "Uploading",
        "Failed",
        "Processing",
        "Uploaded",
        "Uploading",
      ];
      let missing = 0,
        maxLayers = 0;
      for (let i = 0; i < 36; i++) {
        [...document.querySelectorAll("fieldset button")]
          .find((el) => el.textContent === order[i % order.length])
          .click();
        await new Promise(requestAnimationFrame);
        const card = document.querySelector("[data-slot=attachment]");
        const icons = [...card.querySelectorAll("[data-attachment-icon]")];
        const texts = [
          ...card.querySelectorAll("[data-attachment-description]"),
        ];
        if (
          !icons.some((el) => +getComputedStyle(el).opacity > 0.05) ||
          !texts.some((el) => +getComputedStyle(el).opacity > 0.05)
        )
          missing++;
        maxLayers = Math.max(maxLayers, icons.length, texts.length);
      }
      return { missing, maxLayers };
    });
    await page.waitForTimeout(650);
    const settled = await inspect();
    check(
      !burst.missing && burst.maxLayers <= 5,
      "Rapid changes blanked or accumulated layers: " + JSON.stringify(burst),
    );
    check(
      settled.iconCount === 1 &&
        settled.descriptionCount === 1 &&
        settled.visibleDescription,
      "Interrupted exit left stale content",
    );
    report.push(
      "36 rapid state reversals: no blank frames or lingering exit layers",
    );

    await button("Failed").click();
    await page.waitForTimeout(300);
    await button("Retry design-system.pdf").focus();
    await page.keyboard.press("Enter");
    await waitState("uploading");
    check(
      await button("Cancel design-system.pdf").evaluate(
        (el) => el === document.activeElement,
      ),
      "Retry lost keyboard focus",
    );
    await button("Ready").click();
    await page.waitForTimeout(300);
    await button("Upload design-system.pdf").focus();
    await page.keyboard.press("Enter");
    await waitState("uploading");
    check(
      await button("Cancel design-system.pdf").evaluate(
        (el) => el === document.activeElement,
      ),
      "Upload lost keyboard focus",
    );
    await button("Reset").click();
    await page.waitForTimeout(1000);
    await waitState("idle");
    report.push(
      "Keyboard upload/retry transfers focus; reset cancels pending playback",
    );

    await button("Play success").click();
    await waitState("uploading");
    await waitState("processing");
    await waitState("done");
    await button("Play failure + retry").click();
    await waitState("error");
    await waitState("uploading");
    await waitState("processing");
    await waitState("done");
    await button("Ready").click();
    await page.getByRole("checkbox", { name: "Disable file actions" }).check();
    check(
      (await button("Upload design-system.pdf").isDisabled()) &&
        (await button("Remove design-system.pdf").isDisabled()),
      "Disabled file actions remain active",
    );
    await page
      .getByRole("checkbox", { name: "Disable file actions" })
      .uncheck();
    await button("Play success").click();
    await waitState("uploading");
    await button("Cancel design-system.pdf").click();
    await page.waitForTimeout(1000);
    check(
      (await card.count()) === 0,
      "Cancelled playback resurrected a removed attachment",
    );
    await button("Reset").click();
    report.push(
      "Success and failure/retry playback, disabled actions, removal and restoration",
    );

    await page.setViewportSize({ width: 320, height: 900 });
    await page
      .getByRole("textbox", { name: "Filename" })
      .fill("a-long-document-name-".repeat(9) + ".pdf");
    await page.getByRole("checkbox", { name: "Long error message" }).check();
    await button("Failed").click();
    await page.waitForTimeout(500);
    check((await inspect()).descriptionFits, "Wrapped error text is clipped");
    check(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "Mobile layout overflows horizontally",
    );
    await button("Uploading").click();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await button("Uploaded").click();
    await page.waitForTimeout(80);
    const reduced = await inspect();
    check(
      reduced.iconCount === 1 &&
        reduced.descriptionCount === 1 &&
        reduced.trayHeight === 0,
      "Reduced motion retained exiting elements or tray",
    );
    check(
      await page
        .locator("[data-slot=attachment]")
        .evaluate(
          (el) =>
            el
              .getAnimations({ subtree: true })
              .filter((a) => a.playState === "running").length === 0,
        ),
      "Reduced motion is still animating",
    );
    await button("Uploading").click();
    await slider.press("Home");
    await slider.press("End");
    await page.waitForTimeout(80);
    check(
      Math.abs((await inspect()).bar - 1) < 0.002,
      "Reduced-motion progress is delayed",
    );
    await button("Ready").click();
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.waitForTimeout(600);
    check(
      await card.evaluate(
        (el) =>
          el
            .getAnimations({ subtree: true })
            .filter((a) => a.playState === "running").length === 0,
      ),
      "Idle card has ongoing animations",
    );
    report.push(
      "Wrapped errors and long filenames at 320px, live reduced-motion changes, idle animation cleanup",
    );
    check(errors.length === 0, errors.join("; "));
    return { passed: report, browserErrors: errors };
  } finally {
    page.off("pageerror", onError);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ width: 1000, height: 900 });
  }
}
