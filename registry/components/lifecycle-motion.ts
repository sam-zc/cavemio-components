"use client";

import { useSyncExternalStore } from "react";

export const lifecycleEase = "cubic-bezier(0.22, 1, 0.36, 1)";
const query = "(prefers-reduced-motion: reduce)";
function subscribe(notify: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}
export function useLifecycleReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => true,
  );
}
