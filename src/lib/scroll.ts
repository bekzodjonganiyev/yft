"use client";

import { useEffect, useSyncExternalStore, type RefObject } from "react";

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Calls `onProgress(p, rect)` once per frame while `ref` is near the screen.
 *  - mode "hold": 0 when the element's top reaches the viewport top, 1 when its bottom reaches the
 *    viewport bottom (a pinned stage's run).
 *  - mode "view": 0 when its top enters at the bottom edge, 1 when its bottom leaves at the top.
 * The page scrolls natively: nothing is captured, smoothed or prevented.
 */
export function useScrub<T extends Element>(
  ref: RefObject<T | null>,
  onProgress: (p: number, rect: DOMRect) => void,
  { mode = "hold", enabled = true }: { mode?: "hold" | "view"; enabled?: boolean } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let raf = 0;
    let last = -1;
    let near = true;

    const tick = () => {
      raf = 0;
      if (!near) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp(mode === "view" ? (vh - r.top) / (vh + r.height) : -r.top / Math.max(1, r.height - vh));
      if (p !== last) {
        last = p;
        onProgress(p, r);
      }
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        near = entries[entries.length - 1].isIntersecting;
        if (near) request();
      },
      { rootMargin: "25% 0px" }
    );
    io.observe(el);
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    request();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, onProgress, mode, enabled]);
}

/** Live media-query value; `false` on the server and during hydration. */
export function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");

/** `true` only after hydration — so server HTML always shows the finished, readable state. */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

/** Scroll effects run only in the browser, after hydration, without reduced motion. */
export function useMotionAllowed() {
  const hydrated = useHydrated();
  const reduced = useReducedMotion();
  return hydrated && !reduced;
}
