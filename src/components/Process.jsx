import { useTranslation } from "react-i18next";

import { processSteps } from "../data/media";
import { Picture } from "./Picture";

/** Production is a real sequence, so numbering here carries meaning (DESIGN.md §6). */
export function Process() {
  const { t } = useTranslation();
  return (
    <section id="process" aria-labelledby="process-title" className="bg-steel py-20 md:py-28">
      <div className="container">
        <h2 id="process-title" className="text-2xl md:text-3xl">
          {t("process.title")}
        </h2>
        <p className="mt-3 max-w-prose text-lg text-ink">{t("process.lead")}</p>

        <ol className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <li key={step.key}>
              <Picture
                pic={step.photo.pic}
                alt={t(step.photo.altKey)}
                sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
                imgClassName="aspect-[4/3] w-full rounded-photo object-cover"
              />
              <div className="mt-5 flex items-baseline gap-3">
                <span aria-hidden="true" className="text-xl font-semibold tabular-nums text-silo">
                  {i + 1}
                </span>
                <h3 className="text-lg">{t(`process.steps.${step.key}.title`)}</h3>
              </div>
              <p className="mt-2 text-ink-600">{t(`process.steps.${step.key}.text`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
