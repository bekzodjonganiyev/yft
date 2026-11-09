import type { Dictionary } from "@/i18n/dictionaries";
import { brands, contacts, primaryPhone } from "@/lib/site";
import { ContactForm } from "./ContactForm";

export function Contact({ t }: { t: Dictionary }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-steel py-20 md:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 id="contact-title" className="text-2xl md:text-3xl">
            {t.contact.title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-lg">{t.contact.lead}</p>

          <dl className="mt-10 space-y-6">
            <div>
              <dt className="text-sm text-ink-600">{t.contact.phones}</dt>
              {contacts.phones.map((p) => (
                <dd key={p.key} className="mt-1 flex flex-wrap items-baseline gap-x-3">
                  <a href={p.href} className="link text-lg font-medium text-silo tabular-nums" dir="ltr">
                    {p.display}
                  </a>
                  <span className="text-sm text-ink-600">{t.contact.phone[p.key]}</span>
                </dd>
              ))}
            </div>
            <div>
              <dt className="text-sm text-ink-600">{t.contact.email}</dt>
              <dd className="mt-1">
                <a href={`mailto:${contacts.email}`} className="link text-lg font-medium break-all text-silo">
                  {contacts.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink-600">{t.contact.address}</dt>
              <dd className="mt-1 max-w-[36ch]">
                {t.contact.addressValue}
                <br />
                <a href={contacts.mapLink} target="_blank" rel="noopener noreferrer" className="link mt-1 inline-block text-silo">
                  {t.contact.mapLink}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          <ContactForm
            labels={t.contact.form}
            brands={brands.map(({ id, name }) => ({ id, name }))}
            fallbackPhone={primaryPhone.display}
          />
        </div>
      </div>

      <div className="wrap mt-16">
        <iframe
          src={contacts.mapEmbed}
          title={t.contact.mapTitle}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-72 w-full rounded-photo border-0 bg-steel md:h-96"
        />
      </div>
    </section>
  );
}
