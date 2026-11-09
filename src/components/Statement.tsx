import type { Dictionary } from "@/i18n/dictionaries";
import { WordHighlight } from "./WordHighlight";

/** The one sentence the page stands on, lit word by word as it crosses the screen. */
export function Statement({ t }: { t: Dictionary }) {
  return (
    <section className="section-y bg-paper">
      <div className="wrap flex min-h-[min(80svh,52rem)] items-center">
        <WordHighlight
          text={t.statement}
          className="max-w-[22ch] font-display text-statement font-semibold tracking-[-0.025em] text-ink [:lang(ar)_&]:tracking-normal"
        />
      </div>
    </section>
  );
}
