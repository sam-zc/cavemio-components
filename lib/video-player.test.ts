import { test } from "node:test";
import assert from "node:assert/strict";
import {
  formatVideoTime,
  detectVideoFormat,
  bufferAt,
  clampSeek,
  normalizeQualities,
  playerError,
  supportsSource,
} from "../registry/components/video-player-utils.ts";

test("video time handles live/invalid values and hour boundaries", () => {
  assert.equal(formatVideoTime(Infinity), "0:00");
  assert.equal(formatVideoTime(-1), "0:00");
  assert.equal(formatVideoTime(59.99), "0:59");
  assert.equal(formatVideoTime(3661), "1:01:01");
});
test("source detection ignores signed query parameters and respects explicit format", () => {
  assert.equal(detectVideoFormat("https://host/FILE.MPD?key=.m3u8"), "dash");
  assert.equal(detectVideoFormat("https://host/live#fragment", "hls"), "hls");
  assert.equal(detectVideoFormat("/movie.m3u8"), "hls");
  assert.equal(detectVideoFormat("/movie.mp4"), "mp4");
});
test("buffer calculations preserve holes and live seek clamps", () => {
  assert.deepEqual(
    bufferAt(
      [
        [10, 20],
        [30, 40],
      ],
      25,
    ),
    { ahead: 0, behind: 0 },
  );
  assert.deepEqual(
    bufferAt(
      [
        [10, 20],
        [30, 40],
      ],
      35,
    ),
    { ahead: 5, behind: 5 },
  );
  assert.equal(clampSeek(5, 20, 70), 20);
  assert.equal(clampSeek(100, 20, 70), 70);
  assert.equal(clampSeek(NaN, 20, 70), 20);
});
test("quality order retains identity, bitrate and active state", () => {
  const base = { width: 640, active: false };
  const result = normalizeQualities([
    { ...base, id: "1", label: "A", height: 360, bitrate: 100 },
    { ...base, id: "2", label: "B", height: 720, bitrate: 200, active: true },
  ]);
  assert.equal(result[0].id, "2");
  assert.equal(result[0].active, true);
});
test("engine capability selection never disguises DASH/DRM as HLS.js", () => {
  assert.equal(supportsSource("hls", "dash"), false);
  assert.equal(supportsSource("hls", "hls", true), false);
  assert.equal(supportsSource("native", "dash"), false);
  assert.equal(supportsSource("shaka", "dash", true), true);
  assert.equal(supportsSource("hls", "hls"), true);
});
test("errors distinguish fatal/retryable and discard credentials, URL and raw payload", () => {
  const error = playerError(
    {
      code: 1001,
      category: 1,
      message: "https://user:secret@host/?token=private",
      data: ["secret"],
    },
    false,
  );
  assert.equal(error.category, "network");
  assert.equal(error.fatal, false);
  assert.equal(error.retryable, true);
  assert.ok(!JSON.stringify(error).includes("secret"));
  assert.ok(!JSON.stringify(error).includes("private"));
  assert.equal(playerError({ name: "NotAllowedError" }).category, "permission");
  assert.equal(playerError({ name: "NotSupportedError" }).retryable, false);
  assert.equal(playerError({ category: 6 }).category, "drm");
});
