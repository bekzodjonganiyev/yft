"use client";

import { useEffect, useState } from "react";

const EVENT = "yft:toast";

/** Show a short confirmation at the foot of the screen (e.g. "Copied"). */
export function toast(message: string) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: message }));
}

export function Toaster() {
  const [item, setItem] = useState<{ id: number; text: string } | null>(null);

  useEffect(() => {
    let timer = 0;
    const onToast = (e: Event) => {
      const text = (e as CustomEvent<string>).detail;
      setItem({ id: Date.now(), text });
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setItem(null), 2600);
    };
    window.addEventListener(EVENT, onToast);
    return () => {
      window.removeEventListener(EVENT, onToast);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-[70] flex justify-center">
      {item && (
        <p
          key={item.id}
          className="toast absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium whitespace-nowrap text-paper shadow-[0_12px_32px_-12px_rgb(2_27_39/0.5)]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-gold">
            <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {item.text}
        </p>
      )}
    </div>
  );
}
