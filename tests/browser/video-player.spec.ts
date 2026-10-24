import { test, expect, type Page } from "@playwright/test";

async function expand(page: Page) {
  await page.getByRole("button", { name: "Playback settings" }).first().click();
  await page
    .getByRole("menuitem", { name: "Cinematic mode", exact: true })
    .click();
}
const fixture =
  "/iframe.html?id=components-video-player--fixture&viewMode=story";
async function ready(page: Page) {
  await expect
    .poll(
      () =>
        page
          .locator("video")
          .first()
          .evaluate((v: HTMLVideoElement) => v.readyState),
      { timeout: 30000 },
    )
    .toBeGreaterThanOrEqual(2);
}
async function start(page: Page) {
  await ready(page);
  await page.getByRole("button", { name: "Play", exact: true }).first().click();
  await expect
    .poll(() =>
      page
        .locator("video")
        .first()
        .evaluate((v: HTMLVideoElement) => v.currentTime),
    )
    .toBeGreaterThan(0.2);
}
test.describe("video-player", () => {
  test("video surface toggles repeatedly without control clicks toggling playback", async ({
    page,
  }) => {
    await page.goto(fixture);
    await ready(page);
    const frame = page.locator("[data-expanded]");
    const video = page.locator("video");
    const paused = () => video.evaluate((v: HTMLVideoElement) => v.paused);
    await frame.click({ position: { x: 30, y: 30 } });
    await expect.poll(paused).toBe(false);
    // This click used to stop working as soon as playback began.
    await frame.click({ position: { x: 150, y: 100 } });
    await expect.poll(paused).toBe(true);
    const bounds = await frame.boundingBox();
    // Empty space below the raised idle controls still belongs to the video.
    await frame.click({
      position: { x: bounds!.width / 2, y: bounds!.height - 20 },
    });
    await expect.poll(paused).toBe(false);
    await page.getByRole("button", { name: "Pause", exact: true }).click();
    await expect.poll(paused).toBe(true);
    await page.getByRole("button", { name: "Playback settings" }).click();
    await page.getByRole("menuitem", { name: /Playback speed/ }).click();
    await page
      .getByRole("menuitemradio", { name: "1.5×", exact: true })
      .click();
    await page.getByRole("slider", { name: "Seek", exact: true }).click();
    await expect.poll(paused).toBe(true);
    await page.getByRole("button", { name: "Fullscreen", exact: true }).click();
    await expect(frame).toHaveCSS("width", "1000px");
    await frame.click({ position: { x: 250, y: 200 } });
    await expect.poll(paused).toBe(false);
    await frame.click({ position: { x: 350, y: 250 } });
    await expect.poll(paused).toBe(true);
  });
  test("native MP4 playback and diagnostics export use real, sanitized values", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(fixture);
    await ready(page);
    await page.getByLabel("Fixture format").selectOption("mp4");
    await page.getByLabel("Fixture engine").selectOption("native");
    await start(page);
    await expect(page.getByText("native / MP4", { exact: true })).toBeVisible();
    const resolution = await page
      .locator("video")
      .evaluate((v: HTMLVideoElement) => `${v.videoWidth} × ${v.videoHeight}`);
    expect(resolution).not.toBe("0 × 0");
    await expect(page.getByText(resolution, { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Copy diagnostics" }).click();
    const exported = await page.evaluate(() => navigator.clipboard.readText());
    expect(() => JSON.parse(exported)).not.toThrow();
    expect(exported).not.toMatch(
      /https?:|video-fixtures|license|authorization/i,
    );
    await page.getByRole("button", { name: "Playback settings" }).click();
    await expect(
      page.getByRole("menuitem", { name: /Quality/ }),
    ).toBeDisabled();
  });
  test("StrictMode engine changes never overlap open MediaSources and unmount closes them", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const probe = { active: 0, peak: 0, created: 0 };
      Object.assign(window, { mediaSourceProbe: probe });
      window.MediaSource = new Proxy(window.MediaSource, {
        construct(target, args) {
          const source = Reflect.construct(target, args) as MediaSource;
          probe.created++;
          let open = false;
          source.addEventListener("sourceopen", () => {
            if (!open) probe.active++;
            open = true;
            probe.peak = Math.max(probe.peak, probe.active);
          });
          source.addEventListener("sourceclose", () => {
            if (open) probe.active--;
            open = false;
          });
          return source;
        },
      });
    });
    const probe = () =>
      page.evaluate(
        () =>
          (
            window as unknown as {
              mediaSourceProbe: {
                active: number;
                peak: number;
                created: number;
              };
            }
          ).mediaSourceProbe,
      );
    await page.goto(fixture);
    await ready(page);
    await page.getByLabel("Fixture format").selectOption("hls");
    await ready(page);
    for (const engine of ["hls", "shaka", "hls"]) {
      await page.getByLabel("Fixture engine").selectOption(engine);
      await expect(
        page.getByText(`${engine} / HLS`, { exact: true }),
      ).toBeVisible();
      await start(page);
      await page.getByRole("button", { name: "Pause", exact: true }).click();
    }
    expect((await probe()).created).toBeGreaterThanOrEqual(4);
    expect((await probe()).peak).toBe(1);
    const oldVideo = await page.locator("video").elementHandle();
    await page.getByRole("button", { name: "Unmount", exact: true }).click();
    await expect.poll(async () => (await probe()).active).toBe(0);
    expect(
      await oldVideo!.evaluate(
        (v: HTMLVideoElement) => v.paused && !v.getAttribute("src"),
      ),
    ).toBe(true);
  });
  test("DASH controls, keyboard, manual quality, captions availability and diagnostics", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(fixture);
    await start(page);
    await page.getByRole("button", { name: "Pause", exact: true }).click();
    await expect
      .poll(() =>
        page.locator("video").evaluate((v: HTMLVideoElement) => v.paused),
      )
      .toBe(true);
    const seek = page.getByRole("slider", { name: "Seek", exact: true });
    await seek.focus();
    await seek.press("ArrowRight");
    await expect
      .poll(() =>
        page.locator("video").evaluate((v: HTMLVideoElement) => v.currentTime),
      )
      .toBeGreaterThan(5);
    await page.getByRole("button", { name: "Unmute", exact: true }).click();
    await expect
      .poll(() =>
        page.locator("video").evaluate((v: HTMLVideoElement) => v.muted),
      )
      .toBe(false);
    await page.getByRole("button", { name: "Playback settings" }).click();
    await page.getByRole("menuitem", { name: /Quality/ }).click();
    await page.getByRole("menuitemradio", { name: /180p/ }).click();
    await expect(page.getByText("Manual", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Playback settings" }),
    ).toBeFocused();
    await page.getByRole("button", { name: "Playback settings" }).click();
    await page.getByRole("menuitem", { name: /Quality/ }).click();
    await expect(
      page.getByRole("menuitemradio", { name: /180p/ }),
    ).toHaveAttribute("aria-checked", "true");
    await page.getByRole("menuitemradio", { name: "Auto · adaptive" }).click();
    await expect(page.getByText("Enabled", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Playback settings" }).click();
    await expect(
      page.getByRole("menuitem", { name: /Captions/ }),
    ).toBeDisabled();
    await page.getByRole("menuitem", { name: /Playback speed/ }).click();
    await page
      .getByRole("menuitemradio", { name: "1.5×", exact: true })
      .click();
    await expect
      .poll(() =>
        page.locator("video").evaluate((v: HTMLVideoElement) => v.playbackRate),
      )
      .toBe(1.5);
    await page.getByLabel("Unrelated text field").fill("kmfc");
    await expect
      .poll(() =>
        page.locator("video").evaluate((v: HTMLVideoElement) => v.paused),
      )
      .toBe(true);
    expect(errors).toEqual([]);
  });
  test("cinematic layout preserves video, buffer, playback, focus and inline geometry", async ({
    page,
  }) => {
    let manifests = 0;
    page.on("request", (req) => {
      if (req.url().endsWith("sample.mpd")) manifests++;
    });
    await page.goto(fixture);
    await start(page);
    const video = page.locator("video");
    const original = await video.elementHandle();
    const frame = page.locator('[data-expanded="false"]');
    const initial = await frame.boundingBox();
    const time = await video.evaluate((v: HTMLVideoElement) => v.currentTime);
    const loads = manifests;
    await expand(page);
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.waitForTimeout(200);
    const midway = await page.getByRole("dialog").boundingBox();
    expect(midway!.width).toBeGreaterThan(initial!.width);
    await expect
      .poll(() =>
        page
          .getByRole("dialog")
          .evaluate((el) => el.getBoundingClientRect().width),
      )
      .toBeCloseTo(1000, 0);
    await expect(page.locator("video")).toHaveCount(1);
    expect(
      await video.evaluate((v, original) => v === original, original),
    ).toBe(true);
    expect(
      await video.evaluate((v: HTMLVideoElement) => v.currentTime),
    ).toBeGreaterThan(time);
    expect(manifests).toBe(loads);
    await page.getByRole("dialog").press("Escape");
    await expect
      .poll(async () => (await frame.boundingBox())!.width)
      .toBeCloseTo(initial!.width, 0);
    await expect(
      page.getByRole("button", { name: "Playback settings" }),
    ).toBeFocused();
    expect(
      await page.evaluate(() => document.documentElement.style.overflow),
    ).not.toBe("hidden");
    expect(manifests).toBe(loads);
  });
  test("rapid cinematic reversal and live reduced motion settle without reload", async ({
    page,
  }) => {
    await page.goto(fixture);
    await ready(page);
    await expand(page);
    await page.waitForTimeout(80);
    await page
      .getByRole("button", { name: "Exit fullscreen" })
      .click({ force: true });
    await page.waitForTimeout(80);
    await expand(page);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.getByRole("dialog")).toHaveAttribute(
      "data-motion",
      "reduced",
    );
    await expect
      .poll(() =>
        page
          .getByRole("dialog")
          .evaluate((el) => el.getBoundingClientRect().width),
      )
      .toBeCloseTo(1000, 0);
    await page.getByRole("dialog").press("Escape");
    await expect(page.locator("[data-expanded]")).toHaveAttribute(
      "data-expanded",
      "false",
    );
    await expect(page.locator("video")).toHaveCount(1);
    expect(
      await page.locator("[data-expanded]").evaluate((el) => el.style.position),
    ).toBe("");
  });
  test("HLS plays through both engines and switching releases old MediaSource", async ({
    page,
  }) => {
    await page.goto(fixture);
    await ready(page);
    await page.getByLabel("Fixture format").selectOption("hls");
    await start(page);
    await page.getByRole("button", { name: "Pause", exact: true }).click();
    await page
      .getByRole("slider", { name: "Seek", exact: true })
      .press("ArrowRight");
    const time = await page
      .locator("video")
      .evaluate((v: HTMLVideoElement) => v.currentTime);
    await page.getByLabel("Fixture engine").selectOption("hls");
    await expect(page.getByText("hls / HLS", { exact: true })).toBeVisible();
    await ready(page);
    await expect
      .poll(() =>
        page.locator("video").evaluate((v: HTMLVideoElement) => v.currentTime),
      )
      .toBeGreaterThanOrEqual(time - 0.2);
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await expect
      .poll(() =>
        page.locator("video").evaluate((v: HTMLVideoElement) => v.currentTime),
      )
      .toBeGreaterThan(time + 0.2);
    await page.getByRole("button", { name: "Playback settings" }).click();
    await page.getByRole("menuitem", { name: /Quality/ }).click();
    await page.getByRole("menuitemradio", { name: /180p/ }).click();
    await expect(page.getByText("Manual", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Unmount", exact: true }).click();
    await expect(page.locator("video")).toHaveCount(0);
    await page.getByRole("button", { name: "Mount", exact: true }).click();
    await ready(page);
    await expect(page.locator("video")).toHaveCount(1);
  });
  test("multiple instances use unique filters and maintain independent state", async ({
    page,
  }) => {
    await page.goto(fixture);
    await ready(page);
    await page.getByRole("button", { name: "Toggle second player" }).click();
    await expect(page.locator("video")).toHaveCount(2);
    const ids = await page
      .locator("filter")
      .evaluateAll((filters) => filters.map((el) => el.id));
    expect(new Set(ids).size).toBe(ids.length);
    await page
      .getByRole("button", { name: "Play", exact: true })
      .first()
      .click();
    await expect
      .poll(() =>
        page
          .locator("video")
          .first()
          .evaluate((v: HTMLVideoElement) => v.paused),
      )
      .toBe(false);
    expect(
      await page
        .locator("video")
        .nth(1)
        .evaluate((v: HTMLVideoElement) => v.paused),
    ).toBe(true);
  });
  test("unsupported combinations, failed manifest and user retry", async ({
    page,
  }) => {
    await page.goto(fixture);
    await ready(page);
    await page.getByLabel("Fixture engine").selectOption("hls");
    await expect(page.getByRole("alert")).toContainText("Choose Shaka");
    await page.getByLabel("Fixture engine").selectOption("shaka");
    await ready(page);
    let failed = true;
    await page.route("**/video-fixtures/sample.mpd", async (route) => {
      if (failed) await route.fulfill({ status: 503, body: "Unavailable" });
      else await route.continue();
    });
    await page.getByRole("button", { name: "Unmount", exact: true }).click();
    await page.getByRole("button", { name: "Mount", exact: true }).click();
    await expect(page.getByRole("alert")).toBeVisible({ timeout: 30000 });
    failed = false;
    await page.getByRole("button", { name: "Retry video" }).click();
    await ready(page);
    await expect(page.getByRole("alert")).toHaveCount(0);
  });
  test("mobile controls fit and touch can open the scrollable settings", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:6006" + fixture);
    await ready(page);
    const surface = page.locator("[data-expanded]");
    await surface.tap({ position: { x: 100, y: 30 } });
    await expect
      .poll(() =>
        page.locator("video").evaluate((v: HTMLVideoElement) => v.paused),
      )
      .toBe(false);
    await surface.tap({ position: { x: 150, y: 40 } });
    await expect
      .poll(() =>
        page.locator("video").evaluate((v: HTMLVideoElement) => v.paused),
      )
      .toBe(true);
    await expect(
      page.getByRole("button", { name: "Picture-in-picture", exact: true }),
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Playback settings" }).tap();
    await expect(page.getByRole("menu")).toBeVisible();
    await page.getByRole("menuitem", { name: /Playback speed/ }).tap();
    await page.getByRole("menuitemradio", { name: "2×", exact: true }).tap();
    expect(
      await page
        .locator("video")
        .evaluate((v: HTMLVideoElement) => v.playbackRate),
    ).toBe(2);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(390);
    await context.close();
  });
  test("controlled playback follows caller intent", async ({ page }) => {
    await page.goto(fixture);
    await ready(page);
    await page
      .getByRole("button", { name: "Toggle controlled playback" })
      .click();
    await page
      .locator("[data-expanded]")
      .click({ position: { x: 150, y: 100 } });
    await expect
      .poll(() =>
        page.locator("video").evaluate((v: HTMLVideoElement) => v.paused),
      )
      .toBe(false);
    await page
      .locator("[data-expanded]")
      .click({ position: { x: 150, y: 100 } });
    await expect
      .poll(() =>
        page.locator("video").evaluate((v: HTMLVideoElement) => v.paused),
      )
      .toBe(true);
  });
});

test.describe("video-player public smoke", () => {
  test.skip(
    !process.env.VIDEO_PUBLIC_SMOKE,
    "Opt in to external streams with VIDEO_PUBLIC_SMOKE=1",
  );
  for (const [story, format, engine] of [
    ["diagnostics", "dash", "shaka"],
    ["engines", "hls", "shaka"],
    ["hls", "hls", "hls"],
    ["default", "hls", "shaka"],
  ]) {
    test(`${story}: ${engine} ${format} decodes real media`, async ({
      page,
    }) => {
      await page.goto(
        `/iframe.html?id=components-video-player--${story}&viewMode=story`,
      );
      await start(page);
      await expect
        .poll(
          () =>
            page
              .locator("video")
              .evaluate((v: HTMLVideoElement) => v.videoWidth),
          { timeout: 30000 },
        )
        .toBeGreaterThan(0);
      if (story === "default") {
        await expect(
          page.getByText("Blender Foundation · Mux HLS", { exact: true }),
        ).toHaveCount(0);
        await expect(
          page.getByText("Sprite Fright", { exact: true }),
        ).toHaveCount(0);
        expect(
          await page.evaluate(() =>
            performance
              .getEntriesByType("resource")
              .some((entry) =>
                entry.name.startsWith(
                  "https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8",
                ),
              ),
          ),
        ).toBe(true);
      } else {
        await expect(
          page.getByText(`${engine} / ${format.toUpperCase()}`, {
            exact: true,
          }),
        ).toBeVisible();
      }
    });
  }
  test("authorized Clear Key EME playback", async ({ page }) => {
    await page.goto(
      "/iframe.html?id=components-video-player--drm&viewMode=story",
    );
    await page.getByLabel("DRM test system").selectOption("clearkey");
    await page.getByRole("button", { name: "Load protected test" }).click();
    await start(page);
    await expect(
      page.getByText("Protected stream is playing", { exact: true }),
    ).toBeVisible();
    expect(
      await page
        .locator("video")
        .evaluate((v: HTMLVideoElement) => v.mediaKeys !== null),
    ).toBe(true);
  });
  test("player layout and hover surfaces stay sharp across sizes", async ({
    page,
  }) => {
    await page.goto(
      "/iframe.html?id=components-video-player--default&viewMode=story",
    );
    await start(page);
    await page.locator("video").evaluate((v: HTMLVideoElement) => {
      v.currentTime = 90;
      v.pause();
    });
    await expect
      .poll(() =>
        page.locator("video").evaluate((v: HTMLVideoElement) => v.seeking),
      )
      .toBe(false);
    const tabs = page.getByRole("tablist", { name: "Video player examples" });
    expect((await tabs.boundingBox())!.width).toBeGreaterThan(300);
    await page.mouse.move(10, 10);
    await page.screenshot({
      path: "output/playwright/video-player-desktop.png",
      fullPage: true,
    });
    await page.locator("[data-volume-control] button").click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: "output/playwright/video-player-volume-glass.png",
      fullPage: true,
    });
    await page.getByRole("button", { name: "Fullscreen", exact: true }).hover();
    await page.waitForTimeout(450);
    await page.screenshot({
      path: "output/playwright/video-player-hover.png",
      fullPage: true,
    });
    const filters = await page
      .locator("video, [data-expanded] button, [data-expanded] button svg")
      .evaluateAll((elements) =>
        elements.map((el) => {
          let current: Element | null = el;
          while (current) {
            if (getComputedStyle(current).filter !== "none")
              return current.tagName;
            current = current.parentElement;
          }
          return null;
        }),
      );
    expect(filters.every((value) => value === null)).toBe(true);
    await page.getByRole("button", { name: "Playback settings" }).click();
    await page.waitForTimeout(450);
    await page.screenshot({
      path: "output/playwright/video-player-settings.png",
      fullPage: true,
    });
    await page
      .getByRole("menuitem", { name: "Cinematic mode", exact: true })
      .click();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: "output/playwright/video-player-expanding.png",
    });
    await page.getByRole("dialog").press("Escape");
    await expect(page.locator("[data-expanded]")).toHaveCSS(
      "position",
      "absolute",
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: "output/playwright/video-player-mobile.png",
      fullPage: true,
    });
  });
});
