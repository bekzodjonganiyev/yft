import type { Dictionary } from "@/i18n/dictionaries";

const SPEC = ["founded", "location", "product", "pack", "standard", "trade"] as const;

/** Prose on the left, a spec sheet on the right: the facts are key–value data, so they are a <dl>. */
export function About({ t }: { t: Dictionary }) {
  const spec = t.about.spec as Record<string, string>;
  return (
    <section id="about" aria-labelledby="about-title" className="py-20 md:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h2 id="about-title" className="text-2xl md:text-3xl">
            {t.about.title}
          </h2>
          <div className="mt-6 max-w-[68ch] space-y-5 text-lg">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>
        </div>

        <dl aria-label={t.about.specLabel} className="self-start border-t-2 border-silo lg:col-span-5 lg:mt-2">
          {SPEC.map((key) => (
            <div key={key} className="grid grid-cols-[minmax(8rem,40%)_1fr] gap-4 border-b border-steel py-3.5">
              <dt className="text-ink-600">{spec[key]}</dt>
              <dd className="font-medium tabular-nums">{spec[`${key}Value`]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
