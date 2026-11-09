"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";

import type { Locale } from "@/i18n/config";
import { useMotionAllowed } from "@/lib/scroll";
import { timeZone } from "@/lib/site";

export type Figure = { key: string; value: string; unit?: string; label: string };

// A one-second tick shared by every clock on the page; nothing on the server.
const subscribeSecond = (cb: () => void) => {
  const id = window.setInterval(cb, 1000);
  return () => window.clearInterval(id);
};
const nowSeconds = () => Math.floor(Date.now() / 1000);

/** Live local time at the mill, ticking once a second after hydration. */
function Clock({ locale }: { locale: Locale }) {
  const seconds = useSyncExternalStore(subscribeSecond, nowSeconds, () => 0);
  if (!seconds) return <span className="inline-block w-[5.5ch]" aria-hidden="true" />;
  const now = new Date(seconds * 1000);
  const parts = new Intl.DateTimeFormat(locale, { timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return (
    <time dateTime={now.toISOString()} className="font-display text-xl font-semibold text-gold tabular-nums" dir="ltr">
      {get("hour")}:{get("minute")}
      <span className="ms-0.5 text-[0.7em] text-gold/85">:{get("second")}</span>
    </time>
  );
}

/** Each character in its own span so they can flip in one after another. */
function Flap({ text, from }: { text: string; from: number }) {
  return (
    <span className="flap-word">
      {Array.from(text).map((ch, i) => (
        <span key={i} className="flap" style={{ "--d": from + i } as CSSProperties}>
          {ch}
        </span>
      ))}
    </span>
  );
}

/**
 * A dark board of six figures on the light page. Plain in the server HTML; once on screen the
 * digits flip into place like a station board. The clock shows the mill's local time.
 */
export function Figures({ title, lead, clockLabel, figures, locale }: { title: string; lead: string; clockLabel: string; figures: Figure[]; locale: Locale }) {
  const motion = useMotionAllowed();
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motion || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [motion, seen]);

  const phase = !motion ? "rest" : seen ? "in" : "armed";

  return (
    <section id="figures" aria-labelledby="figures-title" className="section-y bg-paper">
      <div className="wrap">
        <div ref={ref} data-phase={phase} className="figs on-dark overflow-hidden rounded-card bg-navy-950 text-white shadow-[0_40px_80px_-40px_rgb(2_27_39/0.6)] dark:bg-navy-900">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b border-white/12 px-6 py-5 sm:px-8">
            <div>
              <h2 id="figures-title" className="text-h3">
                {title}
              </h2>
              <p className="mt-1 text-sm text-white/60">{lead}</p>
            </div>
            <p className="flex items-center gap-3">
              <span className="live-dot h-2 w-2 rounded-full bg-gold" aria-hidden="true" />
              <span className="text-sm text-white/60">{clockLabel}</span>
              <Clock locale={locale} />
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-px bg-white/10 md:grid-cols-3 lg:grid-cols-6">
            {figures.map((f, i) => (
              <div key={f.key} className="flex flex-col-reverse bg-navy-950 px-6 py-7 sm:px-8 dark:bg-navy-900">
                <dt className="mt-3 text-sm text-white/65">{f.label}</dt>
                <dd className="font-display text-[clamp(2.25rem,1.5rem+2.6vw,3.5rem)] leading-none font-semibold tabular-nums" dir="ltr">
                  <Flap text={f.value} from={i * 3} />
                  {f.unit && <span className="ms-1.5 text-[0.42em] font-medium text-white/60">{f.unit}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
