"use client";

import { Fragment, useCallback, useRef } from "react";

import { clamp, useMotionAllowed, useScrub } from "@/lib/scroll";

/** "Text with [[the strong part]] inside" → segments. */
function parse(text: string) {
  return text.split(/(\[\[.+?\]\])/g).filter(Boolean).map((part) =>
    part.startsWith("[[") ? { strong: true, text: part.slice(2, -2) } : { strong: false, text: part }
  );
}

/**
 * The page's statement: its words turn from a faint grey to ink one by one as it crosses the middle
 * of the screen, scrubbed to the scrollbar (it runs back on the way up). The strong phrase turns gold.
 * Reduced motion and no script: the whole statement in ink, nothing hidden.
 */
export function WordHighlight({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const live = useMotionAllowed();
  const segments = parse(text);
  const lastOn = useRef(-1);

  const onProgress = useCallback((_: number, r: DOMRect) => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>(".wh-word");
    const vh = window.innerHeight;
    const start = vh * 0.85;
    const end = vh * 0.4;
    const t = clamp((start - r.top) / Math.max(1, start - end + r.height));
    const atPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    const on = atPageEnd ? words.length : Math.round(t * words.length);
    if (on === lastOn.current) return;
    lastOn.current = on;
    words.forEach((w, i) => w.classList.toggle("is-on", i < on));
  }, []);

  useScrub(ref, onProgress, { mode: "view", enabled: live });

  let index = 0;
  const words = (s: string) =>
    s.split(/(\s+)/).map((w, i) =>
      /^\s+$/.test(w) || !w ? (
        <Fragment key={i}>{w}</Fragment>
      ) : (
        <span key={i} className="wh-word" data-i={index++}>
          {w}
        </span>
      )
    );

  return (
    <p ref={ref} className={`wh ${className}`} data-live={live ? "" : undefined}>
      {segments.map((s, i) => (s.strong ? <strong key={i}>{words(s.text)}</strong> : <Fragment key={i}>{words(s.text)}</Fragment>))}
    </p>
  );
}
