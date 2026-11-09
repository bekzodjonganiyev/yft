"use client";

import { useSyncExternalStore, type MouseEvent } from "react";

import { useReducedMotion } from "@/lib/scroll";

export const THEME_KEY = "yft-theme";
type Theme = "light" | "dark";

/** Inline in <head>: applies the saved theme (or the OS one) before first paint. */
export const THEME_SCRIPT = `try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="dark"&&t!=="light")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`;

const subscribeScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  window.addEventListener("resize", cb);
  return () => {
    window.removeEventListener("scroll", cb);
    window.removeEventListener("resize", cb);
  };
};
const pastFirstScreen = () => window.scrollY > window.innerHeight * 0.9;

// The theme lives on <html data-theme>; this store mirrors it so the button can show the right icon.
const themeListeners = new Set<() => void>();
const subscribeTheme = (cb: () => void) => {
  themeListeners.add(cb);
  return () => {
    themeListeners.delete(cb);
  };
};
const readTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");
const writeTheme = (next: Theme) => {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {}
  themeListeners.forEach((cb) => cb());
};

const Sun = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="3.4" stroke="currentColor" strokeWidth="1.6" />
    <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M3.7 14.3l1.4-1.4M12.9 5.1l1.4-1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const Moon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M15.2 11.2A6.6 6.6 0 0 1 6.8 2.8a6.6 6.6 0 1 0 8.4 8.4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
const Up = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M9 14.5v-11M4.5 8 9 3.5 13.5 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Two round buttons at the foot of the page: back to top (once the hero has scrolled away)
 * and the night-mode switch. The switch is revealed as a circle growing from the button where
 * the browser has view transitions; elsewhere the colours simply change.
 */
export function Dock({ labels }: { labels: { top: string; dark: string; light: string } }) {
  const showTop = useSyncExternalStore(subscribeScroll, pastFirstScreen, () => false);
  const reduced = useReducedMotion();
  // null until hydration: the server does not know the visitor's choice.
  const theme = useSyncExternalStore<Theme | null>(subscribeTheme, readTheme, () => null);

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!doc.startViewTransition || reduced) {
      writeTheme(next);
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    doc.startViewTransition(() => writeTheme(next)).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 560, easing: "cubic-bezier(.23,1,.32,1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  };

  const btn =
    "dock-btn grid h-11 w-11 place-items-center rounded-full border border-line bg-paper/90 text-ink shadow-[0_10px_30px_-12px_rgb(2_27_39/0.45)] backdrop-blur-md hover:border-line-strong active:scale-95";

  return (
    <div className="fixed end-4 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-[45] flex flex-col gap-2.5 md:end-6">
      <button
        type="button"
        className={btn}
        data-show={showTop}
        aria-hidden={!showTop}
        tabIndex={showTop ? 0 : -1}
        aria-label={labels.top}
        onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
      >
        <Up />
      </button>
      <button
        type="button"
        className={btn}
        data-show={theme !== null}
        aria-label={theme === "dark" ? labels.light : labels.dark}
        aria-pressed={theme === "dark"}
        onClick={toggle}
      >
        {theme === "dark" ? <Sun /> : <Moon />}
      </button>
    </div>
  );
}
