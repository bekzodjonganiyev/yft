"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import Image, { type StaticImageData } from "next/image";

import { format } from "@/i18n/config";
import { clamp, easeOut, useMedia, useMotionAllowed, useScrub } from "@/lib/scroll";

export type Chapter = { key: string; title: string; text: string; facts?: string[]; image: StaticImageData; alt: string };

/** Two or three short figures a step is known by (standard limits, bag weight, transport). */
function Facts({ facts }: { facts?: string[] }) {
  if (!facts?.length) return null;
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {facts.map((f) => (
        <li key={f} className="rounded-full border border-line bg-paper px-3 py-1 text-sm font-medium text-ink tabular-nums">
          {f}
        </li>
      ))}
    </ul>
  );
}

const ZOOM = 1.08;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Production told in photographs, one large frame at a time (the page's scroll moment).
 * The section holds on screen while the page scrolls natively: each next photograph is uncovered
 * from its foot over the one before and settles from a slight zoom; the panel switches to its
 * chapter half way through the wipe. Scrubbed to the scrollbar, so it runs back on the way up.
 * At rest (server HTML, reduced motion, screens under 600px tall) the chapters stand side by side.
 */
export function PhotoChapters({
  id,
  title,
  lead,
  chapters,
  counter,
}: {
  id: string;
  title: string;
  lead: string;
  chapters: Chapter[];
  counter: string;
}) {
  const motion = useMotionAllowed();
  const tallEnough = useMedia("(min-height: 600px)");
  const live = motion && tallEnough;

  const sectionRef = useRef<HTMLElement>(null);
  const picRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const n = chapters.length;
  const hold = n <= 3 ? 2 : 3;

  const onProgress = useCallback(
    (p: number) => {
      const seg = 1 / n;
      let k = 0;
      picRefs.current.forEach((pic, i) => {
        if (!pic) return;
        const u = i === 0 ? 1 : clamp((p - (i - 0.25) * seg) / (0.45 * seg));
        const e = easeOut(u);
        pic.style.setProperty("--c", `${((1 - e) * 100).toFixed(2)}%`);
        pic.style.setProperty("--z", (ZOOM - (ZOOM - 1) * e).toFixed(4));
        if (u >= 0.5) k = i;
      });
      barRef.current?.style.setProperty("--p", p.toFixed(4));
      setActive((prev) => (prev === k ? prev : k));
    },
    [n]
  );

  useScrub(sectionRef, onProgress, { mode: "hold", enabled: live });

  const head = (
    <div className="max-w-[46ch]">
      <h2 id={`${id}-title`} className="text-h2">
        {title}
      </h2>
      <p className="mt-4 text-lead text-muted">{lead}</p>
    </div>
  );

  if (!live) {
    return (
      <section ref={sectionRef} id={id} aria-labelledby={`${id}-title`} className="ch-section section-y bg-flour">
        <div className="wrap">
          {head}
          <ol className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {chapters.map((c, i) => (
              <li key={c.key}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-photo bg-navy-950 sm:max-h-[48svh]">
                  <Image src={c.image} alt={c.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" placeholder="blur" className="object-cover" />
                </div>
                <p className="mt-5 text-label font-medium text-muted tabular-nums" aria-hidden="true">
                  {format(counter, { n: pad(i + 1), total: pad(n) })}
                </p>
                <h3 className="mt-2 text-h3">{c.title}</h3>
                <p className="mt-2 max-w-[40ch] text-muted">{c.text}</p>
                <Facts facts={c.facts} />
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={`${id}-title`}
      className="ch-section is-live bg-flour"
      style={{ "--ch-hold": hold } as CSSProperties}
    >
      <div className="ch-sticky wrap">
        {head}
        <div className="ch-stage">
          {chapters.map((c, i) => (
            <div
              key={c.key}
              ref={(el) => {
                picRefs.current[i] = el;
              }}
              className="ch-pic"
              style={i === 0 ? undefined : ({ "--c": "100%", "--z": ZOOM } as CSSProperties)}
            >
              <Image src={c.image} alt={i === active ? c.alt : ""} fill sizes="100vw" placeholder="blur" className="object-cover" />
            </div>
          ))}

          {/* Chapter panel: every chapter stays in the DOM for screen readers; only the one in hand shows. */}
          <div className="absolute start-3 end-3 bottom-3 z-10 grid gap-4 rounded-card bg-paper p-5 text-ink sm:end-auto sm:start-6 sm:bottom-6 sm:w-[min(440px,calc(100%-3rem))] sm:p-7">
            <div className="flex items-center gap-4">
              <p className="text-label font-medium text-muted tabular-nums" aria-hidden="true">
                {format(counter, { n: pad(active + 1), total: pad(n) })}
              </p>
              <span className="ch-bar block h-[2px] flex-1 overflow-hidden rounded bg-line" aria-hidden="true">
                <span ref={barRef} className="block h-full bg-navy" />
              </span>
            </div>
            <ol className="ch-panel grid">
              {chapters.map((c, i) => (
                <li key={c.key} className={`ch-words${i === active ? " is-on" : ""}`} aria-current={i === active ? "step" : undefined}>
                  <h3 className="text-h3">{c.title}</h3>
                  <p className="mt-2 max-w-[40ch] text-muted">{c.text}</p>
                  <Facts facts={c.facts} />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
