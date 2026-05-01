/* ─────────────────────────────────────────────────────────
 * CAST SPRITE: play a strip of animation frames on an element
 *
 * A strip is a row of frames in one image. Playing it
 * is one Web Animation of background-position in steps(), so
 * a looping idle costs no frame loop and no React renders;
 * reduced motion shows the first frame and nothing moves.
 * ───────────────────────────────────────────────────────── */

export interface StripPlay {
  /** The strip, as an image URL. */
  src: string;
  frames: number;
  fps: number;
  /** One frame's size on screen, in px (height defaults to width). */
  size: number;
  height?: number;
  /** Loop forever (an idle), or play once and hold the last frame. */
  loop?: boolean;
  /** Play a one-shot strip backwards, ending on its first frame. */
  reverse?: boolean;
  reduced?: boolean;
  /** Called once a one-shot strip has played. */
  onEnd?: () => void;
}

/** Show `play` on `el`, replacing whatever it was playing. Returns the animation, if any. */
export function playStrip(
  el: HTMLElement | null,
  play: StripPlay,
): Animation | null {
  if (!el) return null;
  el.getAnimations().forEach((a) => a.cancel());
  const {
    src,
    frames,
    fps,
    size,
    height = size,
    loop = true,
    reverse = false,
    reduced = false,
    onEnd,
  } = play;
  const width = frames * size;
  if (el.dataset.strip !== src) {
    el.dataset.strip = src;
    el.style.backgroundImage = `url("${src}")`;
  }
  el.style.backgroundSize = `${width}px ${height}px`;
  el.style.backgroundRepeat = "no-repeat";
  const end = -(frames - 1) * size;
  const rest = loop || reverse ? 0 : end;
  el.style.backgroundPosition = `${rest}px 0px`;
  if (reduced || frames < 2) {
    onEnd?.();
    return null;
  }
  // steps(end) shows the start value first and lands on the end value as it finishes (the resting style then holds it)
  const keys =
    reverse && !loop
      ? [
          { backgroundPosition: `${end}px 0px` },
          { backgroundPosition: "0px 0px" },
        ]
      : [
          { backgroundPosition: "0px 0px" },
          { backgroundPosition: `${loop ? -width : end}px 0px` },
        ];
  const a = el.animate(keys, {
    duration: ((loop ? frames : frames - 1) * 1000) / fps,
    iterations: loop ? Infinity : 1,
    easing: `steps(${loop ? frames : frames - 1}, end)`,
  });
  if (!loop && onEnd) a.onfinish = () => onEnd();
  return a;
}

/** Decode strips up front, so the first frame of each is there the moment it plays. */
export function preloadStrips(srcs: string[]) {
  for (const src of srcs) {
    const img = new Image();
    img.src = src;
    void img.decode?.().catch(() => {});
  }
}
