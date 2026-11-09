'use client';

import { useLanguage } from '@/context/LanguageContext';
import { DEFAULTS, socialLinks, type Settings } from '@/lib/api';
import { SocialIcon } from './icons';

const tel = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

export function TopHeader({ settings }: { settings: Settings }) {
  const { t } = useLanguage();
  const phone = settings.phone || DEFAULTS.phone;
  const email = settings.email || DEFAULTS.email;
  const socials = socialLinks(settings);

  return (
    <div className="bg-gold py-3 text-navy">
      <div className="container flex flex-col items-center gap-3 xl:flex-row xl:justify-between">
        {socials.length > 0 && (
          <div className="flex items-center gap-4">
            {socials.map((s) => (
              <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.key}>
                <SocialIcon name={s.key} />
              </a>
            ))}
          </div>
        )}

        <div className="flex w-full flex-wrap justify-center gap-x-10 gap-y-1 text-sm font-semibold lg:text-base xl:justify-between">
          <p>
            <span className="opacity-80">{t.top.call}: </span>
            <a href={tel(phone)} className="font-bold hover:underline">
              {phone}
            </a>
          </p>
          <p>
            <span className="opacity-80">{t.top.email}: </span>
            <a href={`mailto:${email}`} className="font-bold hover:underline">
              {email}
            </a>
          </p>
          <p className="hidden sm:block">
            <span className="opacity-80">{t.top.hours}: </span>
            <span className="font-bold">{t.footer.hours}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
