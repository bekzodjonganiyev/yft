"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";

/**
 * A photograph with a play button; the player loads only when someone presses it,
 * so the page ships no third-party script until then.
 */
export function VideoPoster({
  poster,
  alt,
  embedUrl,
  title,
  playLabel,
}: {
  poster: StaticImageData;
  alt: string;
  embedUrl: string;
  title: string;
  playLabel: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-photo bg-navy-950">
      {playing ? (
        <iframe
          src={`${embedUrl}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={playLabel} className="group zoom absolute inset-0 block w-full text-start">
          <Image src={poster} alt={alt} fill sizes="(min-width: 1024px) 56vw, 100vw" placeholder="blur" className="object-cover" />
          <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-950/70 via-navy-950/10 to-transparent" />
          <span className="absolute inset-x-5 bottom-5 flex items-center gap-4 text-white sm:inset-x-7 sm:bottom-7">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gold text-navy-950 transition-transform duration-150 ease-[var(--ease-out)] group-hover:scale-105 group-active:scale-95 sm:h-16 sm:w-16">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor" aria-hidden="true" className="translate-x-[2px]">
                <path d="M6 3.5v15l12-7.5z" />
              </svg>
            </span>
            <span className="font-medium">{playLabel}</span>
          </span>
        </button>
      )}
    </div>
  );
}
