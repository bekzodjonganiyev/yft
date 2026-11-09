"use client";

import { useEffect, useRef } from "react";

import { useMedia, useMotionAllowed } from "@/lib/scroll";

/**
 * Three blurred colour fields that drift over the hero photograph (CSS keyframes) and lean a
 * little toward the pointer. Mouse only, after hydration, never with reduced motion.
 */
export function HeroAtmosphere() {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useMedia("(hover: hover) and (pointer: fine)");
  const live = useMotionAllowed() && fine;

  useEffect(() => {
    const el = ref.current;
    if (!el || !live) return;
    const host = el.parentElement ?? el;
    let raf = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      raf = 0;
      el.style.setProperty("--mx", x.toFixed(1));
      el.style.setProperty("--my", y.toFixed(1));
    };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      x = ((e.clientX - r.left) / r.width - 0.5) * 36;
      y = ((e.clientY - r.top) / r.height - 0.5) * 36;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      x = 0;
      y = 0;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [live]);

  return (
    <div ref={ref} aria-hidden="true" className="h-bg -z-10">
      <i className="b1" />
      <i className="b2" />
      <i className="b3" />
    </div>
  );
}
