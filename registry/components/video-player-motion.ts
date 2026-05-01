"use client";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
// Slow departure, decisive middle, long settle. Geometry and icons use
// the same curve at different durations.
export const videoFullscreenMotion = {
  duration: 0.9,
  iconDuration: 0.45,
  ease: CustomEase.create("cavemio-video-fullscreen", "0.7,0,0.16,1"),
};
// Use the same 300ms curve for entry and exit, without a hover-out hold.
const timelineEase = CustomEase.create(
  "cavemio-video-timeline",
  "0.25,0.1,0.35,1",
);

/** Keep a single seek input while its measured slot opens into a separate row. */
export function useVideoTimeline(
  overlay: RefObject<HTMLDivElement | null>,
  dock: RefObject<HTMLDivElement | null>,
  slot: RefObject<HTMLDivElement | null>,
  timeline: RefObject<HTMLDivElement | null>,
  expanded: boolean,
  animated: boolean,
) {
  const state = useRef({ progress: 0 });
  useLayoutEffect(() => {
    const host = overlay.current,
      controls = dock.current,
      placeholder = slot.current,
      surface = timeline.current;
    if (!host || !controls || !placeholder || !surface) return;
    const geometry = {
      left: 0,
      top: 0,
      width: 0,
      fullLeft: 0,
      fullWidth: 0,
      lift: 44,
      height: 44,
      track: 28,
    };
    const render = () => {
      // Keep the rail's center anchored. Its
      // width, thickness and controls share exactly one progress value, with
      // no lead or delayed interval in either direction. Controls stay above
      // the decorative rail while their hit targets pass through its bounds.
      const p = state.current.progress;
      const mix = (a: number, b: number) => a + (b - a) * p;
      gsap.set(controls, {
        y: -geometry.lift * (1 - p),
      });
      gsap.set(surface, {
        autoRound: false,
        left: mix(geometry.left, geometry.fullLeft),
        top: geometry.top - geometry.lift + 16 - mix(32, geometry.height) / 2,
        width: mix(geometry.width, geometry.fullWidth),
        height: mix(32, geometry.height),
        "--timeline-progress": p,
        "--timeline-track-height": `${mix(4, geometry.track)}px`,
        "--timeline-radius": `${mix(2, 8)}px`,
        "--timeline-marker-height": `${mix(36, geometry.track + 24)}px`,
        "--timeline-label-offset": `${mix(32, geometry.track / 2 + 20)}px`,
      });
    };
    const measure = () => {
      const root = host.getBoundingClientRect(),
        row = controls.getBoundingClientRect(),
        gap = placeholder.getBoundingClientRect();
      const y = Number(gsap.getProperty(controls, "y")) || 0;
      Object.assign(geometry, {
        left: gap.left - root.left,
        top: gap.top - root.top - y,
        width: gap.width,
        fullLeft: row.left - root.left,
        fullWidth: row.width,
        // Idle rail and buttons share a center. Reserve enough travel for the
        // expanded half-height plus the existing 8px gap, at every viewport.
        lift: row.height / 2 + geometry.track / 2 + 8,
        height: 44,
        track: 28,
      });
      render();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    observer.observe(placeholder);
    if (host.parentElement) observer.observe(host.parentElement);
    const tween = gsap.to(state.current, {
      progress: expanded ? 1 : 0,
      duration: animated
        ? 0.3 * Math.abs((expanded ? 1 : 0) - state.current.progress)
        : 0,
      // Apply the forward curve toward either target. Playing its timeline
      // backward would start exit at the flat settling tail and feel delayed.
      ease: timelineEase,
      onUpdate: render,
    });
    return () => {
      tween.kill();
      observer.disconnect();
    };
  }, [overlay, dock, slot, timeline, expanded, animated]);
}

export function useVideoReducedMotion(force = false) {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return force || reduced;
}

const locks = new WeakMap<Document, { count: number; overflow: string }>();
function lockScroll(doc: Document) {
  const entry = locks.get(doc) ?? {
    count: 0,
    overflow: doc.documentElement.style.overflow,
  };
  entry.count++;
  locks.set(doc, entry);
  doc.documentElement.style.overflow = "hidden";
  return () => {
    if (--entry.count === 0) {
      doc.documentElement.style.overflow = entry.overflow;
      locks.delete(doc);
    }
  };
}

/** GSAP layout interpolation: animate geometry, never scale readable controls.
 * A manual top-layer popover keeps the same video node above transformed ancestors.
 */
export function useVideoExpansion(
  frame: RefObject<HTMLDivElement | null>,
  placeholder: RefObject<HTMLDivElement | null>,
  expanded: boolean,
  animated: boolean,
  close: () => void,
) {
  const animation = useRef<gsap.core.Tween | null>(null);
  const expandedRef = useRef(false);
  const closeRef = useRef(close);
  closeRef.current = close;
  const savedFocus = useRef<HTMLElement | null>(null);
  const release = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    const el = frame.current;
    const slot = placeholder.current;
    if (!el || !slot) return;
    const wasExpanded = expandedRef.current;
    if (!expanded && !wasExpanded && !animation.current) return;
    const rect = el.getBoundingClientRect(); // Capture before cancelling an interrupted tween.
    animation.current?.kill();
    expandedRef.current = expanded;
    if (expanded && !wasExpanded) {
      // A reversal still owns the original focus and scroll lock.
      if (!release.current) {
        savedFocus.current = el.ownerDocument.activeElement as HTMLElement;
        release.current = lockScroll(el.ownerDocument);
      }
      try {
        el.showPopover?.();
      } catch {
        /* fixed-position fallback */
      }
    }
    const inline = slot.getBoundingClientRect();
    const target = expanded
      ? {
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          borderRadius: 0,
          "--video-backdrop": 1,
        }
      : {
          x: inline.left,
          y: inline.top,
          width: inline.width,
          height: inline.height,
          borderRadius: 20,
          "--video-backdrop": 0,
        };
    gsap.set(el, {
      position: "fixed",
      inset: "auto",
      margin: 0,
      zIndex: 1000,
    });
    // Set the inset shorthand first: rendering it in the same GSAP set as
    // left/top can reset those longhands to auto and jump to the origin.
    gsap.set(el, {
      left: 0,
      top: 0,
      x: rect.left,
      y: rect.top,
      force3D: true,
      width: rect.width,
      height: rect.height,
    });
    const finish = () => {
      animation.current = null;
      if (!expandedRef.current) {
        try {
          el.hidePopover?.();
        } catch {
          /* no top-layer API */
        }
        gsap.set(el, {
          clearProps:
            "position,inset,margin,zIndex,left,top,width,height,transform,borderRadius,--video-backdrop",
        });
        release.current?.();
        release.current = null;
        savedFocus.current?.focus({ preventScroll: true });
      }
    };
    if (animated)
      animation.current = gsap.to(el, {
        ...target,
        duration: videoFullscreenMotion.duration,
        ease: videoFullscreenMotion.ease,
        overwrite: true,
        onComplete: finish,
      });
    else {
      gsap.set(el, target);
      finish();
    }
  }, [expanded, animated, frame, placeholder]);

  useEffect(() => {
    const el = frame.current;
    if (!el || !expanded) return;
    const doc = el.ownerDocument;
    // Inert siblings along the ancestor path without reparenting the video.
    const inert: { el: HTMLElement; value: boolean }[] = [];
    let branch: HTMLElement = el;
    while (branch.parentElement) {
      for (const sibling of Array.from(branch.parentElement.children)) {
        if (sibling !== branch && sibling instanceof HTMLElement) {
          inert.push({ el: sibling, value: sibling.inert });
          sibling.inert = true;
        }
      }
      branch = branch.parentElement;
      if (branch === doc.body) break;
    }
    const key = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key === "Tab") {
        const nodes = Array.from(
          el.querySelectorAll<HTMLElement>(
            'button:not(:disabled),input:not(:disabled),select:not(:disabled),[tabindex="0"]',
          ),
        ).filter(
          (node) =>
            !node.closest("[inert]") && node.getClientRects().length > 0,
        );
        const first = nodes[0],
          last = nodes.at(-1);
        if (
          event.shiftKey &&
          (doc.activeElement === first || doc.activeElement === el)
        ) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && doc.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const resize = () => {
      animation.current?.kill();
      animation.current = null;
      gsap.set(el, {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        borderRadius: 0,
        "--video-backdrop": 1,
      });
    };
    el.focus({ preventScroll: true });
    doc.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    return () => {
      doc.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
      inert.forEach(({ el, value }) => {
        el.inert = value;
      });
    };
  }, [expanded, frame]);
  useEffect(
    () => () => {
      animation.current?.kill();
      release.current?.();
      release.current = null;
      savedFocus.current?.focus({ preventScroll: true });
    },
    [],
  );
}
