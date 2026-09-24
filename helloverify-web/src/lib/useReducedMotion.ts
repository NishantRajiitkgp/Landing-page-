"use client";

import { useSyncExternalStore } from "react";

/** `prefers-reduced-motion: reduce`, live. TRUE on the server and through
 *  hydration, so an island's server HTML is its still, end-state rendering
 *  and motion only starts once the browser has said it may. */
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => true);
}
