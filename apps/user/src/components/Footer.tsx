'use client';

import { useLanguage } from '@/context/LanguageContext';
import { DEFAULTS, socialLinks, type Settings } from '@/lib/api';
import { Brand, NAV_ITEMS } from './Header';
import { BulletIcon, SocialIcon } from './icons';

const Square = ({ children }: { children: React.ReactNode }) => (
  <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-gold text-navy">{children}</span>
);

const PhoneGlyph = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z" />
  </svg>
);
const MailGlyph = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
  </svg>
);
const ClockGlyph = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 10.4 3.5 2.1-.8 1.3L11 13V7h2v5.4Z" />
  </svg>
);

export function Footer({ settings, logo }: { settings: Settings; logo: string }) {
  const { t } = useLanguage();
  const phone = settings.phone || DEFAULTS.phone;
  const email = settings.email || DEFAULTS.email;
  const socials = socialLinks(settings);

  return (
    <footer className="mt-5 bg-navy py-10 text-white">
      <div className="container grid gap-10 md:grid-cols-2 xl:grid-cols-4 xl:items-start">
        <div>
          <Brand logo={logo} light />
          <p className="mb-4 mt-3 text-sm">{t.footer.address}</p>
          {socials.length > 0 && (
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.key}
                  className="flex h-10 w-10 items-center justify-center bg-gold"
                >
                  <SocialIcon name={s.key} />
                </a>
              ))}
            </div>
          )}
        </div>

        <nav aria-label="Footer" className="font-bold">
          {NAV_ITEMS.map((item) => (
            <a key={item.key} href={item.href} className="my-2 flex items-center gap-3 hover:text-gold">
              <BulletIcon className="rtl:rotate-180" />
              {t.nav[item.key]}
            </a>
          ))}
        </nav>

        <ul className="space-y-3 font-bold">
          <li className="flex items-center gap-4">
            <Square>
              <PhoneGlyph />
            </Square>
            <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="hover:text-gold" dir="ltr">
              {phone}
            </a>
          </li>
          <li className="flex items-center gap-4">
            <Square>
              <MailGlyph />
            </Square>
            <a href={`mailto:${email}`} className="break-all hover:text-gold">
              {email}
            </a>
          </li>
          <li className="flex items-center gap-4">
            <Square>
              <ClockGlyph />
            </Square>
            <span>{t.footer.hours}</span>
          </li>
        </ul>

        <iframe
          className="h-[200px] w-full border-0"
          src={settings.map_embed_url || DEFAULTS.mapEmbed}
          title="Yangiyer Flour Trading — map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <p className="container mt-8 border-t border-white/15 pt-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Yangiyer Flour Trading. {t.footer.rights}
      </p>
    </footer>
  );
}
