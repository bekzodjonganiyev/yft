import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/logo.png";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { contacts } from "@/lib/site";

const SECTIONS = [
  { hash: "#brands", key: "brands" },
  { hash: "#process", key: "process" },
  { hash: "#about", key: "about" },
  { hash: "#photos", key: "photos" },
  { hash: "#faq", key: "faq" },
  { hash: "#contact", key: "quote" },
] as const;

/** The close: the name set across the page, then the directory on one ground. */
export function Footer({ t, locale }: { t: Dictionary; locale: Locale }) {
  const nav = t.nav as Record<string, string>;
  return (
    <footer className="on-dark bg-navy-900 text-white">
      <div className="wrap pt-[clamp(4rem,3rem+4vw,7rem)]">
        <div className="flex items-end justify-between gap-8 border-b border-white/15 pb-10">
          <p
            className="font-display text-[clamp(2.4rem,0.8rem+7.2vw,7.5rem)] leading-[0.92] font-semibold tracking-[-0.035em] text-white"
            lang="en"
            dir="ltr"
            translate="no"
          >
            Yangiyer
            <br />
            <span className="text-white/45">Flour Trading</span>
          </p>
          <Image src={logo} alt="" width={96} height={96} className="hidden h-24 w-24 shrink-0 md:block" />
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-medium">{t.footer.company}</p>
            <p className="mt-2 text-sm text-white/65">{t.footer.since}</p>
          </div>
          <nav aria-label={t.footer.sections}>
            <p className="text-label text-white/55">{t.footer.sections}</p>
            <ul className="mt-4 space-y-2.5">
              {SECTIONS.map((s) => (
                <li key={s.key}>
                  <Link href={`/${locale}${s.hash}`} className="ulink text-white/85 hover:text-white">
                    {nav[s.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-label text-white/55">{t.footer.contacts}</p>
            <ul className="mt-4 space-y-2.5">
              {contacts.phones.map((p) => (
                <li key={p.key}>
                  <a href={p.href} dir="ltr" className="ulink text-white tabular-nums">
                    {p.display}
                  </a>{" "}
                  <span className="text-sm text-white/55">{t.contact.phone[p.key]}</span>
                </li>
              ))}
              <li>
                <a href={`mailto:${contacts.email}`} className="ulink break-all text-white">
                  {contacts.email}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-label text-white/55">{t.footer.address}</p>
            <p className="mt-4 max-w-[30ch] text-white/85">{t.contact.addressValue}</p>
            <a href={contacts.mapLink} target="_blank" rel="noopener noreferrer" className="ulink mt-2 inline-block text-gold">
              {t.contact.mapLink}
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/15 py-6 text-sm text-white/55">
          <p>
            © {new Date().getFullYear()} Yangiyer Flour Trading. {t.footer.rights}
          </p>
          <a href="#main" className="ulink text-white/75 hover:text-white">
            {t.nav.top}
          </a>
        </div>
      </div>
    </footer>
  );
}
