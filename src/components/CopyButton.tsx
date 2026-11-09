"use client";

import { toast } from "./Toaster";

/** Copies `text` to the clipboard and says so in a toast. */
export function CopyButton({ text, label, done }: { text: string; label: string; done: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast(done);
    } catch {
      // Clipboard blocked (insecure context, permissions): the text is still selectable beside the button.
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label}: ${text}`}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] text-muted transition-[background-color,color,transform] duration-150 hover:bg-flour hover:text-ink active:scale-90"
    >
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
        <rect x="6" y="6" width="8.5" height="8.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 6V4.5A2 2 0 0 0 9 2.5H4.5a2 2 0 0 0-2 2V9a2 2 0 0 0 2 2H6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  );
}
