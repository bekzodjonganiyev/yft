"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";

export type SelectOption = { value: string; label: string; hint?: string; lang?: string };

type Props = {
  /** Form field name: a hidden input carries the value, so the form posts it like a native select. */
  name?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Accessible name when there is no visible <label for> (e.g. the header language switch). */
  ariaLabel?: string;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  variant?: "field" | "compact";
  /** "light": the compact trigger sits on a dark photograph (the header over the hero). */
  tone?: "default" | "light";
  /** Rendered before the trigger label (e.g. a globe icon). */
  icon?: ReactNode;
  className?: string;
};

const Chevron = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="sel-chev shrink-0 transition-transform duration-200 ease-[var(--ease-out)]">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Check = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * A listbox select built on the WAI-ARIA "select-only combobox" pattern.
 * Keyboard: ↑/↓ open and move, Home/End, type to jump, Enter/Space choose, Esc closes, Tab leaves.
 * The popover scales in from the trigger (160ms ease-out) and opens upward when there is no room below.
 */
export function Select({
  name,
  options,
  value,
  onChange,
  placeholder,
  ariaLabel,
  id,
  variant = "field",
  tone = "default",
  icon,
  className = "",
  ...aria
}: Props) {
  const autoId = useId();
  const triggerId = id ?? `${autoId}-trigger`;
  const listId = `${autoId}-list`;
  const optId = (i: number) => `${autoId}-opt-${i}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const selectedIndex = options.findIndex((o) => o.value === value);
  const [active, setActive] = useState(Math.max(0, selectedIndex));
  const typed = useRef({ text: "", at: 0 });

  const selected = options[selectedIndex];

  const openList = (at = Math.max(0, selectedIndex)) => {
    setActive(at);
    setOpen(true);
  };
  const close = (focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };
  const choose = (i: number) => {
    const option = options[i];
    if (option) onChange(option.value);
    close();
  };

  // Flip upward when the popover would run off the bottom of the screen.
  useLayoutEffect(() => {
    if (!open || !rootRef.current || !listRef.current) return;
    const r = rootRef.current.getBoundingClientRect();
    const h = Math.min(listRef.current.scrollHeight, 320);
    setUp(r.bottom + h + 12 > window.innerHeight && r.top > h + 12);
  }, [open]);

  // Keep the active option in view; close on outside press.
  useEffect(() => {
    if (!open) return;
    document.getElementById(optId(active))?.scrollIntoView({ block: "nearest" });
  });
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const typeahead = (key: string) => {
    const now = Date.now();
    typed.current.text = now - typed.current.at > 600 ? key : typed.current.text + key;
    typed.current.at = now;
    const q = typed.current.text.toLocaleLowerCase();
    const start = open ? active + 1 : 0;
    const order = [...options.slice(start), ...options.slice(0, start)];
    const hit = order.find((o) => o.label.toLocaleLowerCase().startsWith(q));
    return hit ? options.indexOf(hit) : -1;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openList();
        else setActive((a) => Math.min(last, a + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) openList();
        else setActive((a) => Math.max(0, a - 1));
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setActive(last);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) choose(active);
        else openList();
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          close();
        }
        break;
      case "Tab":
        if (open) setOpen(false);
        break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const i = typeahead(e.key);
          if (i < 0) return;
          if (open) setActive(i);
          else onChange(options[i].value);
        }
    }
  };

  const compact = variant === "compact";

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? optId(active) : undefined}
        aria-label={ariaLabel}
        aria-describedby={aria["aria-describedby"]}
        aria-invalid={aria["aria-invalid"]}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={onKeyDown}
        data-open={open}
        className={
          compact
            ? `group inline-flex h-11 items-center gap-2 rounded-ctl border px-3 text-sm font-medium transition-colors duration-300 [&[data-open=true]_.sel-chev]:rotate-180 ${
                tone === "light"
                  ? "border-white/30 text-white hover:border-white/60 data-[open=true]:border-gold [&_.sel-icon]:text-white/70"
                  : "border-line text-ink hover:border-line-strong data-[open=true]:border-navy [&_.sel-icon]:text-muted"
              }`
            : "field group flex items-center justify-between gap-3 text-start aria-[invalid=true]:border-danger data-[open=true]:border-navy [&[data-open=true]_.sel-chev]:rotate-180"
        }
      >
        {icon}
        <span className={`truncate ${selected ? "" : "text-muted"}`} lang={selected?.lang}>
          {selected ? selected.label : placeholder}
        </span>
        <Chevron />
      </button>

      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        aria-labelledby={ariaLabel ? undefined : triggerId}
        aria-label={ariaLabel}
        tabIndex={-1}
        data-open={open}
        style={{ "--origin": up ? "bottom" : "top", "--dy": up ? "4px" : "-4px" } as CSSProperties}
        className={`sel-pop absolute z-50 max-h-80 overflow-auto rounded-card border border-line bg-paper p-1.5 text-ink shadow-[0_18px_40px_-12px_rgb(2_27_39/0.28),0_2px_6px_rgb(2_27_39/0.08)] ${
          up ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]"
        } ${compact ? "end-0 min-w-44" : "inset-x-0"}`}
      >
        {options.map((o, i) => {
          const isSelected = i === selectedIndex;
          return (
            <li
              key={o.value}
              id={optId(i)}
              role="option"
              aria-selected={isSelected}
              lang={o.lang}
              onPointerMove={() => setActive(i)}
              onClick={() => choose(i)}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-[10px] px-3 py-2.5 text-[0.9375rem] ${
                i === active ? "bg-flour" : ""
              } ${isSelected ? "font-semibold text-navy" : ""}`}
            >
              <span className="min-w-0">
                <span className="block truncate">{o.label}</span>
                {o.hint && <span className="block text-sm font-normal text-muted">{o.hint}</span>}
              </span>
              <span className={isSelected ? "text-navy" : "invisible"}>
                <Check />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
