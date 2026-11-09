"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import { format, type Locale } from "@/i18n/config";
import { useMedia, useMotionAllowed } from "@/lib/scroll";

type Brand = { id: string; name: string; image: StaticImageData; kazakhWheat: boolean; bakery: boolean };
type Labels = {
  title: string;
  lead: string;
  pick: string;
  spec: string;
  specGrade: string;
  specWeight: string;
  specWheat: string;
  specUse: string;
  grade: string;
  weight: string;
  kazakhWheat: string;
  bakery: string;
  standard: string;
  ctaFor: string;
  bagAlt: string;
};

const Arrow = () => (
  <svg className="btn-arrow" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M3.5 9h11m0 0L10 4.5M14.5 9 10 13.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TILT_DEG = 6;
const LERP = 0.12;

/** Leans the stage toward a fine pointer, a few degrees, eased frame by frame. Mouse only. */
function useTilt(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const step = () => {
      const t = target.current;
      const c = current.current;
      c.x += (t.x - c.x) * LERP;
      c.y += (t.y - c.y) * LERP;
      el.style.setProperty("--ry", `${(c.x * TILT_DEG).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${(-c.y * TILT_DEG).toFixed(2)}deg`);
      raf.current = Math.abs(t.x - c.x) + Math.abs(t.y - c.y) > 0.002 ? requestAnimationFrame(step) : 0;
    };
    const kick = () => {
      if (!raf.current) raf.current = requestAnimationFrame(step);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.current = { x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 };
      kick();
    };
    const onLeave = () => {
      target.current = { x: 0, y: 0 };
      kick();
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
    };
  }, [enabled]);

  return ref;
}

/**
 * The product, big. Four bags share one stage; a swatch row changes the bag in place
 * (a short blur crossfade). A spec card rides on the stage's corner with only what is printed
 * on that bag; on a mouse the whole stage leans toward the pointer.
 */
export function BrandShowcase({ brands, labels, locale }: { brands: readonly Brand[]; labels: Labels; locale: Locale }) {
  const [current, setCurrent] = useState(0);
  const swatchRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const brand = brands[current];
  const fine = useMedia("(hover: hover) and (pointer: fine)");
  const tiltRef = useTilt(useMotionAllowed() && fine);

  const pick = (i: number, focus = false) => {
    const next = (i + brands.length) % brands.length;
    setCurrent(next);
    if (focus) swatchRefs.current[next]?.focus();
  };

  // Radio-group keys: arrows move and select, Home/End jump.
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const rtl = document.documentElement.dir === "rtl";
    const map: Record<string, number> = {
      ArrowRight: rtl ? i - 1 : i + 1,
      ArrowLeft: rtl ? i + 1 : i - 1,
      ArrowDown: i + 1,
      ArrowUp: i - 1,
      Home: 0,
      End: brands.length - 1,
    };
    if (e.key in map) {
      e.preventDefault();
      pick(map[e.key], true);
    }
  };

  const facts = [
    { label: labels.specGrade, value: labels.grade },
    brand.kazakhWheat && { label: labels.specWheat, value: labels.kazakhWheat },
    brand.bakery && { label: labels.specUse, value: labels.bakery },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <section id="brands" aria-labelledby="brands-title" className="on-dark section-y relative overflow-hidden bg-navy text-white">
      {/* Three blocks: heading, stage, controls. On a phone they stack in that order, so the bag
          sits right above the swatches that change it; on desktop the stage spans both rows. */}
      <div className="wrap grid gap-x-12 gap-y-10 lg:min-h-[calc(100svh-2*var(--section-y))] lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
        <div className="lg:col-span-5 lg:self-end">
          <h2 id="brands-title" className="text-h2">
            {labels.title}
          </h2>
          <p className="mt-5 max-w-[40ch] text-lead text-white/75">{labels.lead}</p>
        </div>

        <div className="max-lg:order-2 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-start">
          <div role="radiogroup" aria-label={labels.pick} className="grid grid-cols-2 gap-2.5">
            {brands.map((b, i) => {
              const on = i === current;
              return (
                <button
                  key={b.id}
                  ref={(el) => {
                    swatchRefs.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => pick(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`group flex min-h-16 items-center gap-3 rounded-ctl border px-3 py-2 text-start transition-[background-color,border-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.98] ${
                    on ? "border-gold bg-white/10" : "border-white/15 hover:border-white/40"
                  }`}
                >
                  <span className="relative h-11 w-7 shrink-0">
                    <Image src={b.image} alt="" fill sizes="28px" className="object-contain" />
                  </span>
                  <span className="font-display text-sm font-semibold tracking-normal" translate="no">
                    {b.name}
                  </span>
                </button>
              );
            })}
          </div>

          <Link href={`/${locale}?brand=${brand.id}#contact`} className="btn mt-10">
            {format(labels.ctaFor, { name: brand.name })}
            <Arrow />
          </Link>
        </div>

        {/* The stage: the bag in hand, its name set large behind it, the spec card on its corner. */}
        <div className="relative max-lg:order-1 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:self-center">
          <div ref={tiltRef} className="tilt relative mx-auto w-full max-w-[620px]">
            <div className="relative aspect-[4/5] max-h-[min(78svh,46rem)] w-full max-lg:max-h-[56svh] [container-type:inline-size]">
              {/* The name set across the stage, sized to the stage's width so the longest name still fits. */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
                {brands.map((b, i) => (
                  <span
                    key={b.id}
                    data-on={i === current}
                    className="bag-name col-start-1 row-start-1 font-display text-[14cqw] leading-none font-bold tracking-[-0.04em] whitespace-nowrap text-white/[0.07]"
                    translate="no"
                  >
                    {b.name}
                  </span>
                ))}
              </div>
              <div className="bag-frame tilt-up absolute inset-[6%_12%] [--z:24px]">
                {brands.map((b, i) => (
                  <Image
                    key={b.id}
                    src={b.image}
                    alt={i === current ? format(labels.bagAlt, { name: b.name }) : ""}
                    aria-hidden={i === current ? undefined : true}
                    data-on={i === current}
                    fill
                    sizes="(min-width: 1024px) 34vw, 70vw"
                    className="object-contain drop-shadow-[0_40px_50px_rgb(2_27_39/0.55)]"
                  />
                ))}
              </div>
            </div>

            {/* Spec card: what is printed on this bag, nothing more. */}
            <div
              aria-live="polite"
              className="tilt-up mt-6 rounded-card bg-paper p-5 text-ink shadow-[0_30px_60px_-24px_rgb(2_27_39/0.65)] [--z:56px] lg:absolute lg:end-0 lg:bottom-2 lg:mt-0 lg:w-[280px]"
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-label text-muted">{labels.spec}</p>
                <p className="font-display font-semibold tracking-normal" translate="no">
                  {brand.name}
                </p>
              </div>
              <dl className="mt-3 border-t border-line">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 text-sm">
                    <dt className="text-muted">{f.label}</dt>
                    <dd className="text-end font-medium">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-3 flex items-end justify-between gap-4">
                <p className="font-display text-2xl leading-none font-semibold tabular-nums">
                  <span className="sr-only">{labels.specWeight}: </span>
                  {labels.weight}
                </p>
                <p className="text-label text-muted" dir="ltr">
                  {labels.standard}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
