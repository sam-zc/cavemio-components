export default async function verifyDropZone(page) {
  const base = "/iframe.html?id=components-drop-zone-membrane--";
  const reports = [];
  const errors = [];
  const onError = (error) => errors.push(error.message);
  page.on("pageerror", onError);
  const check = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const zone = page.getByRole("button", { name: "Browse files", exact: true });
  const active = page.locator(
    "li[data-file]:not([inert]) [data-slot=attachment]",
  );
  const input = page.locator("input[type=file]");
  const visit = async (story, args = "") => {
    await page.goto(base + story + "&viewMode=story" + args);
    await zone.waitFor();
  };
  const select = async (name = "report.pdf") => {
    await input.setInputFiles({
      name,
      mimeType: "application/pdf",
      buffer: Buffer.alloc(109300),
    });
  };
  const transfer = async (files, kind = "drop", offset = 0) =>
    page.evaluate(
      ({ files, kind, offset }) => {
        const zone = document.querySelector("[data-slot=membrane-zone]");
        const rect = zone.getBoundingClientRect();
        const dt = new DataTransfer();
        for (const f of files)
          dt.items.add(
            new File([new Uint8Array(f.size || 12)], f.name, {
              type: f.type ?? "application/pdf",
              lastModified: 100,
            }),
          );
        if (kind === "paste") {
          zone.focus();
          zone.dispatchEvent(
            new ClipboardEvent("paste", {
              clipboardData: dt,
              bubbles: true,
              cancelable: true,
            }),
          );
        } else {
          const detail = {
            dataTransfer: dt,
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2 + offset,
            bubbles: true,
            cancelable: true,
          };
          zone.dispatchEvent(new DragEvent("dragover", detail));
          zone.dispatchEvent(new DragEvent("drop", detail));
        }
      },
      { files, kind, offset },
    );
  const count = async (n) => {
    await page.waitForFunction(
      (n) =>
        document.querySelectorAll("li[data-file]:not([inert])").length === n,
      n,
    );
  };
  const state = async (value) => {
    await active
      .first()
      .locator(':scope[data-state="' + value + '"]')
      .waitFor();
  };
  const visible = async () => {
    await page.waitForTimeout(1000);
    return active.evaluateAll((nodes) =>
      nodes.every((node) => {
        let el = node;
        while (el && el.tagName !== "BODY") {
          const css = getComputedStyle(el);
          if (Number(css.opacity) < 0.99 || css.visibility !== "visible")
            return false;
          el = el.parentElement;
        }
        return !!node.querySelector("[data-slot=attachment-title]")
          ?.textContent;
      }),
    );
  };
  try {
    await page.setViewportSize({ width: 1000, height: 850 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await visit("selection-only");
    const arrival = await page.evaluate(async () => {
      const zone = document.querySelector("[data-slot=membrane-zone]");
      const root = zone.parentElement;
      const rect = zone.getBoundingClientRect();
      const data = new DataTransfer();
      for (const name of ["first.pdf", "second.pdf"]) {
        data.items.add(new File(["pdf"], name, { type: "application/pdf" }));
      }
      const detail = {
        dataTransfer: data,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
        bubbles: true,
        cancelable: true,
      };
      zone.dispatchEvent(new DragEvent("dragover", detail));
      zone.dispatchEvent(new DragEvent("drop", detail));
      const began = performance.now();
      let chips = 0;
      let visibleCards = 0;
      await new Promise((resolve) => {
        const sample = () => {
          chips = Math.max(
            chips,
            root.querySelectorAll(':scope > div[aria-hidden="true"]').length,
          );
          visibleCards = [
            ...root.querySelectorAll("[data-slot=attachment]"),
          ].filter((card) => {
            let opacity = 1;
            for (let el = card; el && el !== root; el = el.parentElement)
              opacity *= Number(getComputedStyle(el).opacity);
            return opacity > 0.1 && card.getBoundingClientRect().height > 0;
          }).length;
          if (performance.now() - began < 250) requestAnimationFrame(sample);
          else resolve();
        };
        requestAnimationFrame(sample);
      });
      return { chips, visibleCards };
    });
    check(arrival.chips === 0, "Drop rendered an intermediate chip");
    check(
      arrival.visibleCards === 2,
      "Attachments waited for an intermediate animation before appearing",
    );
    reports.push(
      "Dropped files appear directly as attachment cards, with no intermediate chips",
    );

    await visit("demo");
    await select();
    await state("uploading");
    check(
      (await page.getByRole("progressbar").getAttribute("aria-valuenow")) !==
        null,
      "Upload progress is not exposed",
    );
    check(await visible(), "Attachment did not become visible");
    await state("processing");
    await state("done");
    await page
      .getByRole("button", { name: "Remove report.pdf", exact: true })
      .click();
    await count(0);
    check(
      await zone.evaluate((el) => el === document.activeElement),
      "Removal lost keyboard focus",
    );
    reports.push(
      "Picker selection → uploading → processing → uploaded; removal restores focus",
    );

    await visit("selection-only");
    const rect = await zone.boundingBox();
    const path = zone.locator("svg > path").first();
    const rest = await path.getAttribute("d");
    await page.evaluate(
      ({ x, y }) => {
        const data = new DataTransfer();
        data.items.add(
          new File(["pdf"], "native.pdf", { type: "application/pdf" }),
        );
        window.dispatchEvent(
          new DragEvent("dragover", {
            dataTransfer: data,
            clientX: x,
            clientY: y,
            cancelable: true,
          }),
        );
      },
      { x: rect.x - 10, y: rect.y + rect.height / 2 },
    );
    await page.waitForTimeout(150);
    check(
      (await path.getAttribute("d")) !== rest,
      "Membrane did not reach toward the file",
    );
    await page.evaluate(() => window.dispatchEvent(new Event("dragend")));
    await page.waitForFunction(
      () =>
        document
          .querySelector("[data-slot=membrane-zone] svg > path")
          .getAttribute("d").length < 500,
      null,
      { timeout: 5000 },
    );
    await transfer([
      { name: "native.pdf" },
      { name: "clipboard.png", type: "image/png" },
    ]);
    await count(2);
    check(await visible(), "Attachment cards did not become visible");
    check(
      (await active.locator(":scope[data-state=idle]").count()) === 2,
      "Selection without handler pretended to upload",
    );
    await transfer([{ name: "third.pdf" }]);
    await count(2);
    check(
      (await page.getByRole("status").textContent()).includes("Up to 2"),
      "File limit did not explain rejection",
    );
    reports.push(
      "Membrane reach, release and settling; two-file drop, visible cards and file limit",
    );

    await visit("selection-only");
    await transfer([
      { name: "wrong.exe", type: "application/octet-stream" },
      { name: "too-big.pdf", size: 10_000_001 },
    ]);
    await count(0);
    const rejected = await page.getByRole("status").textContent();
    check(
      rejected.includes("isn't accepted") && rejected.includes("over 10"),
      "Invalid type/size feedback missing",
    );
    await transfer([{ name: "empty-mime.PDF", type: "" }], "paste");
    await count(1);
    await transfer([{ name: "empty-mime.PDF", type: "" }], "paste");
    await count(1);
    check(
      (await page.getByRole("status").textContent()).includes("already added"),
      "Duplicate paste was not rejected",
    );
    await page
      .getByRole("button", { name: "Remove empty-mime.PDF", exact: true })
      .click();
    await transfer([{ name: "empty-mime.PDF", type: "" }], "paste");
    await count(1);
    check(await visible(), "Re-added file stayed hidden");
    reports.push(
      "Type/size rejection, focused paste, absent MIME, duplicates and re-selection",
    );

    await visit("manual-upload");
    await select();
    await state("idle");
    await page
      .getByRole("button", { name: "Upload report.pdf", exact: true })
      .click();
    await state("uploading");
    await page
      .getByRole("button", { name: "Cancel report.pdf", exact: true })
      .click();
    await count(0);
    await page.waitForTimeout(4000);
    await count(0);
    reports.push(
      "Manual upload and cancellation without late file resurrection",
    );

    await visit("error-and-retry");
    await select();
    await state("error");
    await page
      .getByRole("button", { name: "Retry report.pdf", exact: true })
      .click();
    await state("uploading");
    await state("done");
    check(await visible(), "Retry result is invisible");
    reports.push("Failure → retry → uploaded");

    await visit("single-file");
    await transfer([{ name: "first.pdf" }]);
    await transfer([{ name: "replacement.pdf" }]);
    await count(1);
    check(await visible(), "Replacement attachment did not become visible");
    check(
      (await active.textContent()).includes("replacement.pdf"),
      "Single-file replacement kept the old file",
    );
    await transfer([{ name: "outside.pdf" }], "drop", 1000);
    await count(1);
    reports.push("Rapid single-file replacement and dropping outside the zone");

    await visit("disabled");
    check(await zone.isDisabled(), "Disabled browse button is enabled");
    await transfer([{ name: "ignored.pdf" }]);
    await transfer([{ name: "ignored.pdf" }], "paste");
    await count(0);
    reports.push("Disabled browse, drag and paste");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 320, height: 700 });
    await visit("demo");
    await select("a-very-long-document-name-".repeat(7) + ".pdf");
    await state("uploading");
    check(await visible(), "Reduced-motion row is hidden");
    const mobile = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      flight: document.querySelectorAll(".will-change-transform:not(span)")
        .length,
      animated: [...document.querySelectorAll("[data-slot=attachment] *")].some(
        (el) => getComputedStyle(el).animationName !== "none",
      ),
    }));
    check(
      !mobile.overflow,
      "Long filename causes horizontal overflow on a 320px viewport",
    );
    check(!mobile.flight && !mobile.animated, "Reduced motion still animates");
    await page.goto(base + "attachment-states&viewMode=story");
    await page.getByRole("list", { name: "Attachment states" }).waitFor();
    check(
      (await page.locator("[data-slot=attachment]").count()) === 5,
      "Missing attachment state",
    );
    reports.push(
      "320px viewport, long filename, reduced motion, upload unmount, all five states",
    );

    check(errors.length === 0, "Browser errors: " + errors.join("; "));
    return { passed: reports, browserErrors: errors };
  } finally {
    page.off("pageerror", onError);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ width: 1000, height: 850 });
  }
}
