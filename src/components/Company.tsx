import type { Dictionary } from "@/i18n/dictionaries";
import { aboutVideo, companyPhoto, photoImage } from "@/lib/site";
import { VideoPoster } from "./VideoPoster";

const SPEC = ["founded", "location", "product", "pack", "standard", "trade"] as const;

/** The company film beside the facts: the staff photograph is its poster until it plays. */
export function Company({ t }: { t: Dictionary }) {
  const spec = t.about.spec as Record<string, string>;
  const alt = t.photos.alt as Record<string, string>;
  return (
    <section id="about" aria-labelledby="about-title" className="section-y bg-flour">
      <div className="wrap grid items-center gap-x-16 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <VideoPoster poster={photoImage(companyPhoto)} alt={alt[companyPhoto]} embedUrl={aboutVideo.embedUrl} title={aboutVideo.title} playLabel={t.about.watch} />
        </div>

        <div className="lg:col-span-5">
          <h2 id="about-title" className="text-h2">
            {t.about.title}
          </h2>
          <div className="mt-6 max-w-[56ch] space-y-4 text-lead text-muted">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>

          <dl aria-label={t.about.specLabel} className="mt-10 grid grid-cols-2 border-t border-line">
            {SPEC.map((key, i) => (
              <div key={key} className={`border-b border-line py-4 ${i % 2 === 0 ? "pe-6" : "border-s ps-6"}`}>
                <dt className="text-label text-muted">{spec[key]}</dt>
                <dd className="mt-1.5 font-medium text-ink tabular-nums">{spec[`${key}Value`]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
