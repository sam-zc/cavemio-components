import { test, expect, type Locator, type Page } from "@playwright/test";

const fixture =
  "/iframe.html?id=components-video-player--fixture&viewMode=story";
async function open(page: Page) {
  await page.goto(fixture);
  await expect
    .poll(() =>
      page.locator("video").evaluate((v: HTMLVideoElement) => v.readyState),
    )
    .toBeGreaterThanOrEqual(2);
  return page.locator("[data-hover-tooltip-surface]");
}
function frames(surface: Locator, milliseconds = 500) {
  return surface.evaluate(async (el, duration) => {
    const result: { x: number; y: number; width: number; opacity: number }[] =
      [];
    const end = performance.now() + duration;
    do {
      const rect = el.getBoundingClientRect();
      result.push({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        opacity: Number(getComputedStyle(el.parentElement!).opacity),
      });
      await new Promise(requestAnimationFrame);
    } while (performance.now() < end);
    return result;
  }, milliseconds);
}

test.describe("video-player seek preview", () => {
  for (const width of [1000, 390])
    for (const fullscreen of [false, true]) {
      test(`stable control-row hover at ${width}px ${fullscreen ? "fullscreen" : "inline"}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 844 });
        await open(page);
        if (fullscreen) {
          await page
            .getByRole("button", { name: "Fullscreen", exact: true })
            .click();
          await expect
            .poll(
              async () =>
                (await page.locator("[data-expanded]").boundingBox())!.width,
            )
            .toBeCloseTo(width, 0);
        }
        const seek = page.getByRole("slider", { name: "Seek", exact: true });
        await seek.hover();
        await page.waitForTimeout(500);
        const dock = (await page.locator("[data-video-dock]").boundingBox())!;
        const initial = (await seek.boundingBox())!;
        await page.mouse.move(
          dock.x + dock.width / 2,
          dock.y + dock.height / 2,
        );
        const states = await page
          .locator("[data-timeline-expanded]")
          .evaluate(async (el) => {
            const rows: { expanded: string | null; width: number }[] = [];
            const until = performance.now() + 1000;
            do {
              rows.push({
                expanded: el.getAttribute("data-timeline-expanded"),
                width: el
                  .querySelector("[data-video-timeline]")!
                  .getBoundingClientRect().width,
              });
              await new Promise(requestAnimationFrame);
            } while (performance.now() < until);
            return rows;
          });
        expect(
          states.every(
            (s) =>
              s.expanded === "true" && Math.abs(s.width - initial.width) < 2,
          ),
        ).toBe(true);
        const frame = (await page.locator("[data-expanded]").boundingBox())!;
        const exit = page
          .locator("[data-video-timeline]")
          .evaluate(async (el) => {
            const rows: {
              t: number;
              width: number;
              dock: number;
              center: number;
            }[] = [];
            const until = performance.now() + 750;
            do {
              const track = el
                .querySelector("[data-seek-track]")!
                .getBoundingClientRect();
              rows.push({
                t: performance.now(),
                width: el.getBoundingClientRect().width,
                dock: el
                  .parentElement!.querySelector("[data-video-dock]")!
                  .getBoundingClientRect().y,
                center: track.y + track.height / 2,
              });
              await new Promise(requestAnimationFrame);
            } while (performance.now() < until);
            return rows;
          });
        await page.mouse.move(frame.x + frame.width / 2, frame.y + 20);
        const frames = await exit;
        const widthTravel = frames[0].width - frames.at(-1)!.width;
        const dockTravel = frames[0].dock - frames.at(-1)!.dock;
        expect(
          Math.max(...frames.map((s) => s.center)) -
            Math.min(...frames.map((s) => s.center)),
        ).toBeLessThan(1);
        expect(widthTravel).toBeGreaterThan(40);
        expect(dockTravel).toBeGreaterThan(20);
        // Entry and exit both use one progress value: neither may start or
        // finish its movement before the other, even at narrow/fullscreen sizes.
        for (const sample of frames) {
          const railProgress = (frames[0].width - sample.width) / widthTravel;
          const controlsProgress = (frames[0].dock - sample.dock) / dockTravel;
          expect(Math.abs(railProgress - controlsProgress)).toBeLessThan(0.03);
        }
        expect(
          frames
            .slice(1)
            .every(
              (row, i) =>
                row.t - frames[i].t >= 40 ||
                (Math.abs(row.width - frames[i].width) / widthTravel < 0.22 &&
                  Math.abs(row.dock - frames[i].dock) / dockTravel < 0.4),
            ),
        ).toBe(true);
        await expect(page.locator("[data-timeline-expanded]")).toHaveAttribute(
          "data-timeline-expanded",
          "false",
        );
      });
    }

  test("buffer shading never overlaps played progress", async ({ page }) => {
    await open(page);
    const seek = page.getByRole("slider", { name: "Seek", exact: true });
    await seek.press("ArrowRight");
    await expect
      .poll(async () => Number(await seek.inputValue()))
      .toBeGreaterThan(0);
    const layers = await page.locator("[data-seek-track]").evaluate((el) => {
      const played = el
        .querySelector("[data-seek-played]")!
        .getBoundingClientRect();
      return [...el.querySelectorAll("span:not([data-seek-played])")].map(
        (n) => ({
          start: n.getBoundingClientRect().left,
          width: n.getBoundingClientRect().width,
          playedEnd: played.right,
        }),
      );
    });
    expect(layers.length).toBeGreaterThan(0);
    expect(
      layers.every(
        (layer) => layer.width < 0.5 || layer.start >= layer.playedEnd - 0.5,
      ),
    ).toBe(true);
  });

  test("M and F work from buttons and sliders without taking over text fields", async ({
    page,
  }) => {
    await open(page);
    const play = page.getByRole("button", { name: "Play", exact: true });
    const video = page.locator("video");
    const muted = await video.evaluate((v: HTMLVideoElement) => v.muted);
    await play.press("m");
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.muted))
      .toBe(!muted);
    await play.press("f");
    await expect(page.locator("[data-expanded]")).toHaveAttribute(
      "data-expanded",
      "true",
    );
    await page.getByRole("slider", { name: "Seek", exact: true }).press("f");
    await expect(page.locator("[data-expanded]")).toHaveAttribute(
      "data-expanded",
      "false",
    );
    await page.getByLabel("Unrelated text field").fill("mf");
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.muted))
      .toBe(!muted);
    await page.locator("body").click({ position: { x: 1, y: 1 } });
    await page.locator("[data-expanded]").hover();
    await page.keyboard.press("m");
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.muted))
      .toBe(muted);
    await page.keyboard.press("f");
    await expect(page.locator("[data-expanded]")).toHaveAttribute(
      "data-expanded",
      "true",
    );
  });
  test("hover exit and rapid reversal never collapse most of the width in one frame", async ({
    page,
  }) => {
    await open(page);
    const seek = page.getByRole("slider", { name: "Seek", exact: true });
    await seek.hover();
    await page.waitForTimeout(500);
    const trace = page.locator("[data-video-timeline]").evaluate(async (el) => {
      const result: { t: number; width: number; x: number; dock: number }[] =
        [];
      const end = performance.now() + 800;
      do {
        const r = el.getBoundingClientRect();
        result.push({
          t: performance.now(),
          width: r.width,
          x: r.x,
          dock: el
            .parentElement!.querySelector("[data-video-dock]")!
            .getBoundingClientRect().y,
        });
        await new Promise(requestAnimationFrame);
      } while (performance.now() < end);
      return result;
    });
    await page.mouse.move(1, 1);
    const samples = await trace;
    const travel = samples[0].width - samples.at(-1)!.width;
    expect(travel).toBeGreaterThan(100);
    const steps = samples
      .slice(1)
      .map((s, i) => ({
        delta: Math.abs(s.width - samples[i].width) / travel,
        dt: s.t - samples[i].t,
      }))
      .filter((s) => s.dt < 40);
    expect(Math.max(...steps.map((s) => s.delta))).toBeLessThan(0.22);
    await seek.hover();
    await page.waitForTimeout(90);
    await page.mouse.move(1, 1);
    await page.waitForTimeout(30);
    const before = (await seek.boundingBox())!;
    const reversal = seek.evaluate(async (el) => {
      const values: { t: number; width: number }[] = [];
      const end = performance.now() + 200;
      do {
        values.push({
          t: performance.now(),
          width: el.getBoundingClientRect().width,
        });
        await new Promise(requestAnimationFrame);
      } while (performance.now() < end);
      return values;
    });
    // Locator.hover waits for motion to settle; a real pointer can reverse mid-flight.
    await page.mouse.move(
      before.x + before.width / 2,
      before.y + before.height / 2,
    );
    const reverseFrames = await reversal;
    expect(
      reverseFrames
        .slice(1)
        .every(
          (s, i) =>
            s.t - reverseFrames[i].t >= 40 ||
            Math.abs(s.width - reverseFrames[i].width) / travel < 0.22,
        ),
    ).toBe(true);
  });
  test("hover exit starts on the next frame and follows the 300ms timing", async ({
    page,
  }) => {
    await open(page);
    await page.getByRole("slider", { name: "Seek", exact: true }).hover();
    await page.waitForTimeout(400);
    await page.locator("[data-seek-control]").evaluate((el) => {
      (window as typeof window & { exitFrames: unknown }).exitFrames =
        new Promise((resolve) => {
          el.addEventListener(
            "pointerleave",
            () => {
              const rows: { t: number; width: number }[] = [];
              const start = performance.now();
              const frame = () => {
                rows.push({
                  t: performance.now() - start,
                  width: el.getBoundingClientRect().width,
                });
                if (performance.now() - start < 420)
                  requestAnimationFrame(frame);
                else resolve(rows);
              };
              frame();
            },
            { once: true },
          );
        });
    });
    // Remain inside the video so the overlay's separate exit fade cannot
    // interfere with measurements of timeline engagement.
    const player = (await page.locator("[data-expanded]").boundingBox())!;
    await page.mouse.move(player.x + player.width / 2, player.y + 20);
    const rows = await page.evaluate(
      () =>
        (
          window as typeof window & {
            exitFrames: Promise<{ t: number; width: number }[]>;
          }
        ).exitFrames,
    );
    const from = rows[0].width;
    const to = rows.at(-1)!.width;
    const travel = from - to;
    expect(travel).toBeGreaterThan(100);
    const first = rows.find((r) => from - r.width > travel * 0.01)!;
    expect(first.t).toBeLessThan(50);
    // Exit fractions: ~25% at 60ms, ~75% at 150ms,
    // ~97% at 240ms and settled by 300ms. Bound the actual rendered path.
    for (const [time, fraction] of [
      [60, 0.25],
      [150, 0.75],
      [240, 0.97],
      [320, 1],
    ]) {
      const nearest = rows.reduce((a, b) =>
        Math.abs(a.t - time) < Math.abs(b.t - time) ? a : b,
      );
      expect(Math.abs((from - nearest.width) / travel - fraction)).toBeLessThan(
        0.14,
      );
    }
    const settled = rows.find((r) => (from - r.width) / travel >= 0.995)!;
    expect(settled.t).toBeLessThan(340);
  });

  test("mouse play clicks allow the whole overlay to hide on leave, while keyboard focus keeps it available", async ({
    page,
    browser,
  }) => {
    await open(page);
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await expect
      .poll(() =>
        page.locator("video").evaluate((v: HTMLVideoElement) => v.paused),
      )
      .toBe(false);
    const overlay = page.locator("[data-timeline-expanded]");
    await page.mouse.move(1, 1);
    await expect(overlay).toHaveAttribute("aria-hidden", "true", {
      timeout: 1500,
    });
    await expect(overlay).toHaveCSS("opacity", "0");
    const frame = (await page.locator("[data-expanded]").boundingBox())!;
    await page.mouse.move(frame.x + frame.width / 2, frame.y + 50);
    await expect(overlay).toHaveAttribute("aria-hidden", "false");
    await page.waitForTimeout(2600);
    await expect(overlay).toHaveAttribute("aria-hidden", "false");
    await page.getByRole("button", { name: "Pause", exact: true }).press("Tab");
    await page.mouse.move(1, 1);
    await page.waitForTimeout(600);
    await expect(overlay).toHaveAttribute("aria-hidden", "false");
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const touch = await context.newPage();
    await touch.goto("http://127.0.0.1:6006" + fixture);
    await expect(
      touch.getByRole("button", { name: "Play", exact: true }),
    ).toBeEnabled();
    await expect
      .poll(() =>
        touch.locator("video").evaluate((v: HTMLVideoElement) => v.readyState),
      )
      .toBeGreaterThanOrEqual(2);
    await touch.getByRole("button", { name: "Play", exact: true }).tap();
    await touch.waitForTimeout(350);
    await expect(touch.locator("[data-timeline-expanded]")).toHaveAttribute(
      "aria-hidden",
      "false",
    );
    await expect(touch.locator("[data-timeline-expanded]")).toHaveAttribute(
      "aria-hidden",
      "true",
      { timeout: 4000 },
    );
    await context.close();
  });
  test("timeline widens and thickens around a fixed center as controls slide down", async ({
    page,
  }) => {
    await open(page);
    const seek = page.getByRole("slider", { name: "Seek", exact: true });
    const original = await seek.elementHandle();
    const dock = page.locator("[data-video-dock]");
    const track = page.locator("[data-seek-track]");
    const before = {
      dock: (await dock.boundingBox())!,
      track: (await track.boundingBox())!,
    };
    const trace = dock.evaluate(async (el) => {
      const samples: {
        dock: number;
        top: number;
        height: number;
        width: number;
      }[] = [];
      const track = el.parentElement!.querySelector("[data-seek-track]")!;
      const until = performance.now() + 600;
      do {
        const r = track.getBoundingClientRect();
        samples.push({
          dock: el.getBoundingClientRect().y,
          top: r.y,
          height: r.height,
          width: r.width,
        });
        await new Promise(requestAnimationFrame);
      } while (performance.now() < until);
      return samples;
    });
    await seek.hover();
    const samples = await trace;
    const after = {
      dock: (await dock.boundingBox())!,
      track: (await track.boundingBox())!,
    };
    expect(after.dock.y).toBeGreaterThan(before.dock.y + 20);
    const center = before.track.y + before.track.height / 2;
    expect(after.track.y + after.track.height / 2).toBeCloseTo(center, 0);
    expect(after.track.width).toBeGreaterThan(before.track.width + 100);
    expect(after.track.y + after.track.height).toBeLessThan(after.dock.y);
    expect(after.track.height).toBeGreaterThanOrEqual(24);
    expect(after.track.height).toBeLessThanOrEqual(32);
    expect(
      after.dock.y - after.track.y - after.track.height,
    ).toBeLessThanOrEqual(12);
    const material = await track.evaluate((el) => {
      const background = getComputedStyle(el).backgroundColor;
      const played = getComputedStyle(
        el.querySelector("[data-seek-played]")!,
      ).backgroundColor;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const context = canvas.getContext("2d")!;
      const rgba = (color: string) => {
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        return [...context.getImageData(0, 0, 1, 1).data];
      };
      return {
        background: rgba(background),
        played,
        playedRgba: rgba(played),
        blur: getComputedStyle(el).backdropFilter,
      };
    });
    expect(material.blur).toContain("blur(");
    expect(
      material.background.slice(0, 3).every((channel) => channel >= 250),
    ).toBe(true);
    expect(
      material.playedRgba.slice(0, 3).every((channel) => channel >= 250),
    ).toBe(true);
    expect(material.background[3]).toBeLessThan(64);
    expect(material.playedRgba[3]).toBeGreaterThan(material.background[3]);
    expect(material.playedRgba[3]).toBeLessThan(200);
    // A light/dark page foreground must never invert the video progress fill.
    await page
      .locator("[data-video-player]")
      .evaluate((el) =>
        (el as HTMLElement).style.setProperty("--foreground", "white"),
      );
    await expect(page.locator("[data-seek-played]")).toHaveCSS(
      "background-color",
      material.played,
    );
    await page
      .locator("[data-video-player]")
      .evaluate((el) =>
        (el as HTMLElement).style.removeProperty("--foreground"),
      );
    // The rail thickens around its existing center while widening. It must
    // share the controls' progress, including the very first moving frame.
    for (const sample of samples) {
      expect(sample.top + sample.height / 2).toBeCloseTo(center, 0);
      const widthProgress =
        (sample.width - before.track.width) /
        (after.track.width - before.track.width);
      const heightProgress =
        (sample.height - before.track.height) /
        (after.track.height - before.track.height);
      const controlsProgress =
        (sample.dock - before.dock.y) / (after.dock.y - before.dock.y);
      expect(Math.abs(widthProgress - heightProgress)).toBeLessThan(0.03);
      expect(Math.abs(widthProgress - controlsProgress)).toBeLessThan(0.03);
    }
    expect(
      samples.some(
        (s) =>
          s.dock > before.dock.y + 2 &&
          s.dock < after.dock.y - 2 &&
          s.height > before.track.height + 2 &&
          s.height < after.track.height - 2,
      ),
    ).toBe(true);
    expect(await seek.evaluate((el, old) => el === old, original)).toBe(true);
    await page.screenshot({
      path: "output/playwright/video-timeline-expanded.png",
    });
    await page.mouse.move(1, 1);
    await expect(page.locator("[data-timeline-expanded]")).toHaveAttribute(
      "data-timeline-expanded",
      "false",
    );
    await expect
      .poll(async () => (await track.boundingBox())!.height)
      .toBeCloseTo(before.track.height, 0);
    expect((await dock.boundingBox())!.y).toBeCloseTo(before.dock.y, 0);
  });

  test("timeline interruption, reduced motion, touch and focus tokens stay usable", async ({
    page,
    browser,
  }) => {
    await open(page);
    const seek = page.getByRole("slider", { name: "Seek", exact: true });
    await seek.hover();
    await page.waitForTimeout(80);
    await page.mouse.move(1, 1);
    await page.waitForTimeout(220);
    await seek.press("ArrowRight");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator("[data-expanded]")).toHaveAttribute(
      "data-motion",
      "reduced",
    );
    await expect(page.locator("[data-timeline-expanded]")).toHaveAttribute(
      "data-timeline-expanded",
      "true",
    );
    const settled = await page.locator("[data-video-timeline]").boundingBox();
    await page.waitForTimeout(100);
    expect(await page.locator("[data-video-timeline]").boundingBox()).toEqual(
      settled,
    );
    await page
      .locator("[data-video-player]")
      .evaluate((el) =>
        (el as HTMLElement).style.setProperty("--ring", "rgb(220, 45, 90)"),
      );
    await expect(page.locator("[data-seek-track]")).toHaveCSS(
      "outline-color",
      "rgb(220, 45, 90)",
    );
    await page.getByRole("button", { name: "Play", exact: true }).focus();
    expect(
      await page
        .getByRole("button", { name: "Play", exact: true })
        .evaluate((el) => getComputedStyle(el).boxShadow),
    ).toContain("rgb(220, 45, 90)");
    await page.getByRole("button", { name: "Unmount", exact: true }).click();
    await expect(seek).toHaveCount(0);
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const touch = await context.newPage();
    await touch.goto("http://127.0.0.1:6006" + fixture);
    const touchSeek = touch.getByRole("slider", { name: "Seek", exact: true });
    await expect(touchSeek).toBeEnabled();
    await touchSeek.tap();
    await expect
      .poll(() =>
        touch.locator("video").evaluate((v: HTMLVideoElement) => v.currentTime),
      )
      .toBeGreaterThan(1);
    await expect(touch.locator("[data-seek-control]")).toHaveAttribute(
      "data-scrubbing",
      "false",
    );
    await context.close();
  });
  test("marker follows the pointer without seeking; drag and keyboard keep preview aligned", async ({
    page,
  }) => {
    await open(page);
    const seek = page.getByRole("slider", { name: "Seek", exact: true });
    const video = page.locator("video");
    const marker = page.locator("[data-seek-marker]");
    const preview = page.locator("[data-seek-preview]");
    let bounds = (await seek.boundingBox())!;
    const duration = await video.evaluate((v: HTMLVideoElement) => v.duration);
    await page.mouse.move(
      bounds.x + bounds.width * 0.7,
      bounds.y + bounds.height / 2,
    );
    await page.waitForTimeout(500);
    bounds = (await seek.boundingBox())!;
    await page.mouse.move(
      bounds.x + bounds.width * 0.7,
      bounds.y + bounds.height / 2,
    );
    await expect(marker).toBeVisible();
    const cursor = (await marker.boundingBox())!;
    expect(cursor.x + cursor.width / 2).toBeCloseTo(
      bounds.x + bounds.width * 0.7,
      0,
    );
    expect(cursor.height).toBeGreaterThan(cursor.width * 20);
    await expect(seek).toHaveCSS("cursor", "grab");
    await expect(preview).toContainText(" / ");
    await expect(preview).toHaveCSS("backdrop-filter", "none");
    expect(await video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBe(
      0,
    );
    await page.mouse.down();
    await expect(seek).toHaveCSS("cursor", "grabbing");
    await page.mouse.move(bounds.x + bounds.width * 0.35, bounds.y - 40, {
      steps: 5,
    });
    await page.mouse.up();
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
      .toBeCloseTo(duration * 0.35, 0);
    await seek.press("Home");
    await seek.press("ArrowRight");
    await expect(preview).toContainText("00:05 / ");
    const keyboardMarker = (await marker.boundingBox())!;
    expect(keyboardMarker.x + keyboardMarker.width / 2).toBeCloseTo(
      bounds.x + (bounds.width * 5) / duration,
      0,
    );
    await expect(page.locator("[data-seek-track]")).toHaveCSS(
      "outline-style",
      "solid",
    );
    await page.getByLabel("Unrelated text field").focus();
    await page.mouse.move(1, 1);
    await expect(marker).toHaveCount(0);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("[data-expanded]").scrollIntoViewIfNeeded();
    const narrow = (await seek.boundingBox())!;
    await page.mouse.move(narrow.x + 2, narrow.y + narrow.height / 2);
    await page.waitForTimeout(500);
    const narrowExpanded = (await seek.boundingBox())!;
    await page.mouse.move(
      narrowExpanded.x + 2,
      narrowExpanded.y + narrowExpanded.height / 2,
    );
    const label = (await preview.boundingBox())!;
    expect(label.x).toBeGreaterThanOrEqual(narrowExpanded.x);
    expect(label.x + label.width).toBeLessThanOrEqual(
      narrowExpanded.x + narrowExpanded.width,
    );
    await page.screenshot({ path: "output/playwright/video-seek-mobile.png" });
  });
});

test.describe("video-player continuous hover", () => {
  test("tooltip text stays centered and complete after short and long label changes", async ({
    page,
  }) => {
    await open(page);
    for (const fullscreen of [false, true]) {
      if (fullscreen) {
        await page
          .getByRole("button", { name: "Fullscreen", exact: true })
          .click();
        await page.waitForTimeout(950);
      }
      for (const name of [
        "Play",
        "Playback settings",
        fullscreen ? "Exit fullscreen" : "Fullscreen",
        "Playback settings",
      ]) {
        const clipTrace = page
          .locator("[data-hover-tooltip-caption]")
          .evaluate(async (el) => {
            const clips: boolean[] = [];
            const until = performance.now() + 360;
            do {
              const r = el.getBoundingClientRect();
              const masked = getComputedStyle(el).overflowX !== "visible";
              clips.push(
                [...el.children].some((n) => {
                  const b = n.getBoundingClientRect();
                  return (
                    masked &&
                    Number(getComputedStyle(n).opacity) > 0.15 &&
                    (b.left < r.left - 1 || b.right > r.right + 1)
                  );
                }),
              );
              await new Promise(requestAnimationFrame);
            } while (performance.now() < until);
            return clips;
          });
        await page.getByRole("button", { name, exact: true }).hover();
        expect((await clipTrace).some(Boolean)).toBe(false);
        await page.waitForTimeout(500);
        const metrics = await page
          .locator("[data-hover-tooltip-caption]")
          .evaluate((el) => {
            const parent = el.getBoundingClientRect();
            const label = [...el.children].find(
              (n) => Number(getComputedStyle(n).opacity) > 0.98,
            )!;
            const r = label.getBoundingClientRect();
            return {
              left: r.left - parent.left,
              right: parent.right - r.right,
              text: label.textContent,
            };
          });
        expect(metrics.text).toBe(name);
        expect(metrics.left).toBeGreaterThanOrEqual(-1);
        expect(metrics.right).toBeGreaterThanOrEqual(-1);
        expect(Math.abs(metrics.left - metrics.right)).toBeLessThan(2);
      }
    }
  });
  test("one tooltip emerges once, then travels and resizes without disappearing or dropping", async ({
    page,
  }) => {
    const surface = await open(page);
    const pip = page.getByRole("button", {
      name: "Picture-in-picture",
      exact: true,
    });
    const full = page.getByRole("button", { name: "Fullscreen", exact: true });
    await pip.hover();
    await page.waitForTimeout(75);
    await page.screenshot({
      path: "output/playwright/video-tooltip-emerging.png",
    });
    await expect(page.locator("[data-tooltip-phase]")).toHaveAttribute(
      "data-tooltip-phase",
      "shown",
    );
    const original = await surface.elementHandle();
    const from = await surface.boundingBox();
    const trace = frames(surface);
    await full.hover();
    const samples = await trace;
    const to = await surface.boundingBox();
    expect(await surface.evaluate((el, old) => el === old, original)).toBe(
      true,
    );
    expect(Math.abs(to!.x - from!.x)).toBeGreaterThan(25);
    expect(Math.abs(to!.width - from!.width)).toBeGreaterThan(10);
    expect(
      samples.every((s) => s.opacity > 0.98 && Math.abs(s.y - from!.y) < 1),
    ).toBe(true);
    expect(samples.some((s) => s.x > from!.x + 3 && s.x < to!.x - 3)).toBe(
      true,
    );
    const button = await full.boundingBox();
    expect(to!.y + to!.height).toBeLessThan(button!.y);
    const visibleLabels = await page
      .locator("[data-hover-tooltip-caption] > span")
      .evaluateAll((nodes) =>
        nodes
          .filter((n) => Number(getComputedStyle(n).opacity) > 0.01)
          .map((n) => n.textContent),
      );
    expect(visibleLabels).toEqual(["Fullscreen"]);
    await page.screenshot({
      path: "output/playwright/video-tooltip-settled.png",
    });
  });

  test("short pointer gaps and interrupted travel retain the current surface", async ({
    page,
  }) => {
    const surface = await open(page);
    const settings = page.getByRole("button", { name: "Playback settings" });
    const full = page.getByRole("button", { name: "Fullscreen", exact: true });
    const pip = page.getByRole("button", {
      name: "Picture-in-picture",
      exact: true,
    });
    await settings.hover();
    await expect(page.locator("[data-tooltip-phase]")).toHaveAttribute(
      "data-tooltip-phase",
      "shown",
    );
    const before = await surface.boundingBox();
    const button = await settings.boundingBox();
    await page.mouse.move(button!.x, button!.y - 90);
    await page.waitForTimeout(50);
    await full.hover();
    await page.waitForTimeout(60);
    const trace = frames(surface);
    await pip.hover();
    const samples = await trace;
    expect(
      samples.every((s) => s.opacity > 0.98 && Math.abs(s.y - before!.y) < 1),
    ).toBe(true);
    const end = await surface.boundingBox();
    const target = await pip.boundingBox();
    expect(end!.x + end!.width / 2).toBeCloseTo(
      target!.x + target!.width / 2,
      0,
    );
    await page.mouse.move(1, 1);
    await page.waitForTimeout(210);
    const closing = await surface.boundingBox();
    expect(closing!.y).toBeGreaterThan(end!.y);
    expect(closing!.width).toBeLessThan(end!.width);
    await expect(page.locator("[data-tooltip-phase]")).toHaveAttribute(
      "data-tooltip-phase",
      "hidden",
    );
    expect(
      await page
        .locator("[data-hover-tooltip-caption]")
        .evaluate((el) => getComputedStyle(el).opacity),
    ).toBe("0");
  });

  test("keyboard focus, live reduced motion and unmount leave no ghosts", async ({
    page,
  }) => {
    const surface = await open(page);
    const full = page.getByRole("button", { name: "Fullscreen", exact: true });
    await full.focus();
    await page.waitForTimeout(60);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator("[data-tooltip-phase]")).toHaveAttribute(
      "data-tooltip-phase",
      "shown",
    );
    const first = await surface.boundingBox();
    await page.waitForTimeout(100);
    const second = await surface.boundingBox();
    expect(second).toEqual(first);
    expect(
      await page
        .locator("[data-gooey-layer]")
        .evaluate((el) => getComputedStyle(el).filter),
    ).toBe("none");
    await expect(full).toBeFocused();
    await page.getByLabel("Unrelated text field").focus();
    await expect(page.locator("[data-tooltip-phase]")).toHaveAttribute(
      "data-tooltip-phase",
      "hidden",
    );
    await page.getByRole("button", { name: "Unmount", exact: true }).click();
    await expect(surface).toHaveCount(0);
  });
});

test.describe("video-player glass volume", () => {
  test("vertical adjustment has no extra tooltip, preserves mute clicks and uses frosted surfaces", async ({
    page,
  }) => {
    const surface = await open(page);
    const volume = page.getByRole("slider", { name: "Volume", exact: true });
    const control = page.locator("[data-volume-control]");
    const button = control.getByRole("button");
    await button.hover();
    await page.waitForTimeout(90);
    await page.screenshot({
      path: "output/playwright/video-volume-emerging.png",
    });
    await expect(page.locator("[data-tooltip-phase]")).toHaveAttribute(
      "data-tooltip-phase",
      "hidden",
    );
    const sliderBox = await volume.boundingBox();
    const buttonBox = await button.boundingBox();
    expect(sliderBox!.height).toBeGreaterThan(sliderBox!.width);
    expect(sliderBox!.y + sliderBox!.height).toBeLessThan(buttonBox!.y);
    await volume.press("Home");
    await volume.press("ArrowUp");
    await expect(volume).toHaveValue("0.05");
    await expect(button).toHaveAttribute("aria-label", "Mute");
    await expect(page.locator("[data-hover-tooltip-caption]")).toHaveCSS(
      "opacity",
      "0",
    );
    await volume.press("End");
    await expect(volume).toHaveValue("1");
    await page.mouse.move(
      sliderBox!.x + sliderBox!.width / 2,
      sliderBox!.y + 10,
    );
    await page.mouse.down();
    await page.mouse.move(
      sliderBox!.x + 90,
      sliderBox!.y + sliderBox!.height - 10,
      { steps: 12 },
    );
    await expect(control).toHaveAttribute("data-volume-open", "true");
    expect(Number(await volume.inputValue())).toBeLessThan(0.3);
    await page.mouse.up();
    await button.click();
    await expect(button).toHaveAttribute("aria-label", "Unmute");
    await button.click();
    await expect(button).toHaveAttribute("aria-label", "Mute");
    const styles = await page
      .locator("[data-volume-surface], [data-hover-tooltip-surface]")
      .evaluateAll((nodes) =>
        nodes.map((el) => ({
          blur: getComputedStyle(el).backdropFilter,
          color: getComputedStyle(el).backgroundColor,
        })),
      );
    expect(
      styles.every((s) => s.blur.includes("blur(") && s.color.includes("0.15")),
    ).toBe(true);
    await page.waitForTimeout(450);
    await page.screenshot({ path: "output/playwright/video-volume-glass.png" });
    const old = await surface.elementHandle();
    await page.getByRole("button", { name: "Fullscreen", exact: true }).hover();
    expect(await surface.evaluate((el, previous) => el === previous, old)).toBe(
      true,
    );
    await page.getByLabel("Unrelated text field").focus();
    await page.mouse.move(1, 1);
    await expect(control).toHaveAttribute("data-volume-open", "false");
  });

  test("reduced motion settles the slider during emergence and cleans up on unmount", async ({
    page,
  }) => {
    await open(page);
    await page.locator("[data-volume-control] button").focus();
    await page.waitForTimeout(60);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const panel = page.locator("[data-volume-surface]");
    await expect(page.locator("[data-volume-gooey]")).toHaveCSS(
      "filter",
      "none",
    );
    const initial = await panel.boundingBox();
    await page.waitForTimeout(100);
    expect(await panel.boundingBox()).toEqual(initial);
    expect(initial!.height).toBeGreaterThan(100);
    expect(
      await page
        .locator("[data-volume-gooey]")
        .evaluate((el) => getComputedStyle(el).filter),
    ).toBe("none");
    await page
      .getByRole("slider", { name: "Volume", exact: true })
      .press("ArrowUp");
    await expect(
      page.getByRole("slider", { name: "Volume", exact: true }),
    ).toBeFocused();
    await page.getByRole("button", { name: "Unmount", exact: true }).click();
    await expect(panel).toHaveCount(0);
  });
});

test.describe("video-player fluid fullscreen", () => {
  test("primary control blends both corner icons and expands the existing video smoothly", async ({
    page,
  }) => {
    await open(page);
    const button = page.locator("[data-fullscreen-control]");
    const frame = page.locator("[data-expanded]");
    const originalButton = await button.elementHandle();
    const originalVideo = await page.locator("video").elementHandle();
    const inline = await frame.boundingBox();
    await button.click();
    const samples = await frame.evaluate(async (el) => {
      const result: {
        width: number;
        x: number;
        y: number;
        enter: number;
        exit: number;
        backdrop: number;
        elapsed: number;
      }[] = [];
      const start = performance.now();
      const until = start + 1020;
      while (performance.now() < until) {
        result.push({
          elapsed: performance.now() - start,
          width: el.getBoundingClientRect().width,
          x: el.getBoundingClientRect().x,
          y: el.getBoundingClientRect().y,
          enter: Number(
            getComputedStyle(
              el.querySelector(
                '[data-fullscreen-control] [data-fullscreen-state="enter"]',
              )!,
            ).opacity,
          ),
          exit: Number(
            getComputedStyle(
              el.querySelector(
                '[data-fullscreen-control] [data-fullscreen-state="exit"]',
              )!,
            ).opacity,
          ),
          backdrop: Number(
            getComputedStyle(el).getPropertyValue("--video-backdrop"),
          ),
        });
        await new Promise(requestAnimationFrame);
      }
      return result;
    });
    expect(samples.some((s) => s.x > 2 && s.x < inline!.x - 2)).toBe(true);
    expect(samples.some((s) => s.y > 1 && s.y < inline!.y - 1)).toBe(true);
    expect(samples[0].x).toBeGreaterThan(inline!.x * 0.8);
    expect(samples[0].y).toBeGreaterThan(inline!.y * 0.8);
    // Fullscreen keyframes: ~5% travel at 200ms, ~50% at 400ms,
    // then a long settle. This catches the old faster power3 transition.
    const at = (time: number) =>
      samples.reduce((a, b) =>
        Math.abs(a.elapsed - time) < Math.abs(b.elapsed - time) ? a : b,
      );
    expect(1 - at(180).x / inline!.x).toBeLessThan(0.13);
    expect(1 - at(380).x / inline!.x).toBeGreaterThan(0.3);
    expect(1 - at(380).x / inline!.x).toBeLessThan(0.7);
    expect(at(600).x).toBeGreaterThan(0.5);
    expect(at(180).enter).toBeGreaterThan(0.2);
    expect(at(180).exit).toBeLessThan(0.8);
    expect(samples.some((s) => s.enter > 0.05 && s.exit > 0.05)).toBe(true);
    expect(samples.every((s) => s.enter + s.exit > 0.5)).toBe(true);
    expect(
      samples.some((s) => s.width > inline!.width + 5 && s.width < 995),
    ).toBe(true);
    expect(samples.some((s) => s.backdrop > 0.05 && s.backdrop < 0.95)).toBe(
      true,
    );
    expect(
      await button.evaluate((el, before) => el === before, originalButton),
    ).toBe(true);
    expect(
      await page
        .locator("video")
        .evaluate((el, before) => el === before, originalVideo),
    ).toBe(true);
    await expect(button).toHaveAttribute("aria-label", "Exit fullscreen");
    await expect(button.locator('[data-fullscreen-state="exit"]')).toHaveCSS(
      "opacity",
      "1",
    );
    expect(await page.evaluate(() => document.fullscreenElement)).toBeNull();
    await page.screenshot({
      path: "output/playwright/video-fullscreen-expanded.png",
    });
    await button.click();
    await expect
      .poll(async () => (await frame.boundingBox())!.width)
      .toBeCloseTo(inline!.width, 0);
    await expect(frame).toHaveCSS("position", "absolute");
    await expect(button).toBeFocused();
    await expect(button.locator('[data-fullscreen-state="enter"]')).toHaveCSS(
      "opacity",
      "1",
    );
    expect(
      await page.evaluate(() => document.documentElement.style.overflow),
    ).not.toBe("hidden");
  });

  test("rapid reversal, F and reduced motion preserve focus, icon state and scroll restoration", async ({
    page,
  }) => {
    await open(page);
    const button = page.locator("[data-fullscreen-control]");
    const frame = page.locator("[data-expanded]");
    await button.click();
    await page.waitForTimeout(70);
    await button.click({ force: true });
    await page.waitForTimeout(60);
    await button.click({ force: true });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(frame).toHaveAttribute("data-motion", "reduced");
    await expect(button.locator('[data-fullscreen-state="exit"]')).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(button.locator('[data-fullscreen-state="enter"]')).toHaveCSS(
      "opacity",
      "0",
    );
    await frame.press("Escape");
    await expect(button).toBeFocused();
    expect(
      await page.evaluate(() => document.documentElement.style.overflow),
    ).not.toBe("hidden");
    await frame.focus();
    await frame.press("f");
    await expect(frame).toHaveAttribute("data-expanded", "true");
    await frame.press("f");
    await expect(frame).toHaveAttribute("data-expanded", "false");
    expect(
      await page.evaluate(() => document.documentElement.style.overflow),
    ).not.toBe("hidden");
  });

  test("browser fullscreen remains available in Settings and synchronizes both icon states", async ({
    page,
  }) => {
    await open(page);
    const video = await page.locator("video").elementHandle();
    await page.getByRole("button", { name: "Playback settings" }).click();
    const native = page.getByRole("menuitem", {
      name: "Browser fullscreen",
      exact: true,
    });
    await expect(native).toBeEnabled();
    await native.click();
    await expect
      .poll(() => page.evaluate(() => !!document.fullscreenElement))
      .toBe(true);
    const button = page.locator("[data-fullscreen-control]");
    await expect(button).toHaveAttribute("aria-label", "Exit fullscreen");
    await button.click();
    await expect
      .poll(() => page.evaluate(() => !!document.fullscreenElement))
      .toBe(false);
    await expect(button).toHaveAttribute("aria-label", "Fullscreen");
    expect(
      await page
        .locator("video")
        .evaluate((el, before) => el === before, video),
    ).toBe(true);
  });
});

test.describe("video-player responsive expansion", () => {
  for (const width of [540, 620]) {
    test(`crossing responsive thresholds from ${width}px keeps controls in place`, async ({
      page,
    }) => {
      await open(page);
      const frame = page.locator("[data-expanded]");
      await frame.evaluate((el, width) => {
        el.parentElement!.style.width = `${width}px`;
      }, width);
      const button = page.locator("[data-fullscreen-control]");
      const initial = await button.evaluate((el) => ({
        height: el.parentElement!.parentElement!.getBoundingClientRect().height,
        pip: getComputedStyle(
          el.parentElement!.querySelector(
            'button[aria-label="Picture-in-picture"]',
          )!,
        ).display,
      }));
      await button.click();
      const heights = await button.evaluate(async (el) => {
        const results = [];
        const until = performance.now() + 1020;
        while (performance.now() < until) {
          results.push(
            el.parentElement!.parentElement!.getBoundingClientRect().height,
          );
          await new Promise(requestAnimationFrame);
        }
        return results;
      });
      expect(heights.every((h) => Math.abs(h - initial.height) < 1)).toBe(true);
      expect(
        await button.evaluate(
          (el) =>
            getComputedStyle(
              el.parentElement!.querySelector(
                'button[aria-label="Picture-in-picture"]',
              )!,
            ).display,
        ),
      ).toBe(initial.pip);
      await expect(page.locator("video")).toHaveCSS("object-fit", "cover");
      await expect(frame).toHaveCSS("border-top-left-radius", "0px");
      await button.click();
      await expect(button).toBeFocused();
      await expect(frame).toHaveCSS("border-top-left-radius", "20px");
      expect(
        await button.evaluate(
          (el) =>
            el.parentElement!.parentElement!.getBoundingClientRect().height,
        ),
      ).toBeCloseTo(initial.height, 1);
    });
  }

  test("mobile fullscreen touch drag keeps the timeline open until release", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:6006" + fixture);
    await expect
      .poll(() =>
        page.locator("video").evaluate((v: HTMLVideoElement) => v.readyState),
      )
      .toBeGreaterThanOrEqual(2);
    const dockOffset = () =>
      page
        .locator("[data-video-dock]")
        .evaluate(
          (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42,
        );
    const inlineOffset = await dockOffset();
    await page.getByRole("button", { name: "Fullscreen", exact: true }).tap();
    await expect
      .poll(
        async () =>
          (await page.locator("[data-expanded]").boundingBox())!.width,
      )
      .toBeCloseTo(390, 0);
    expect(await dockOffset()).toBeCloseTo(inlineOffset, 1);
    const seek = page.getByRole("slider", { name: "Seek", exact: true });
    let r = (await seek.boundingBox())!;
    const cdp = await context.newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: r.x + r.width / 2, y: r.y + r.height / 2 }],
    });
    await page.waitForTimeout(600);
    await expect(page.locator("[data-timeline-expanded]")).toHaveAttribute(
      "data-timeline-expanded",
      "true",
    );
    await expect(page.locator("[data-seek-control]")).toHaveAttribute(
      "data-scrubbing",
      "true",
    );
    r = (await seek.boundingBox())!;
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: r.x + r.width * 0.7, y: r.y + r.height / 2 }],
    });
    await expect
      .poll(() =>
        page.locator("video").evaluate((v: HTMLVideoElement) => v.currentTime),
      )
      .toBeGreaterThan(10);
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect(page.locator("[data-seek-control]")).toHaveAttribute(
      "data-scrubbing",
      "false",
    );
    await expect(page.locator("[data-timeline-expanded]")).toHaveAttribute(
      "data-timeline-expanded",
      "false",
    );
    await context.close();
  });
});
