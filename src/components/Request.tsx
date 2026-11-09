import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { brands, contacts, primaryPhone } from "@/lib/site";
import { RequestForm } from "./RequestForm";

/** The page's action: the form on paper, the direct line beside it set large. */
export function Request({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="on-dark section-y bg-navy-950 text-white">
      <div className="wrap grid gap-x-16 gap-y-14 lg:grid-cols-12">
        <div className="flex flex-col lg:col-span-5">
          <h2 id="contact-title" className="text-h2">
            {t.contact.title}
          </h2>
          <p className="mt-5 max-w-[40ch] text-lead text-white/75">{t.contact.lead}</p>

          <div className="mt-12 lg:mt-auto">
            <p className="text-label text-white/60">{t.contact.direct}</p>
            <ul className="mt-4 space-y-3">
              {contacts.phones.map((p) => (
                <li key={p.key} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <a href={p.href} dir="ltr" className="ulink font-display text-h3 font-semibold tracking-[-0.015em] text-white tabular-nums hover:text-gold">
                    {p.display}
                  </a>
                  <span className="text-sm text-white/60">{t.contact.phone[p.key]}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-10 grid gap-6 border-t border-white/15 pt-6 sm:grid-cols-2">
              <div>
                <dt className="text-label text-white/60">{t.contact.email}</dt>
                <dd className="mt-1.5">
                  <a href={`mailto:${contacts.email}`} className="ulink break-all text-white">
                    {contacts.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-label text-white/60">{t.contact.address}</dt>
                <dd className="mt-1.5 text-white/90">
                  {t.contact.addressValue}
                  <br />
                  <a href={contacts.mapLink} target="_blank" rel="noopener noreferrer" className="ulink mt-1 inline-block text-gold">
                    {t.contact.mapLink}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="lg:col-span-7">
          <RequestForm
            labels={{ ...t.contact.form }}
            brands={brands.map(({ id, name }) => ({ id, name }))}
            fallbackPhone={primaryPhone.display}
            locale={locale}
          />
        </div>
      </div>
    </section>
  );
}
