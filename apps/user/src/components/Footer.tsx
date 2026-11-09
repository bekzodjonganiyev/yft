'use client';

import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { DEFAULTS, socialLinks, telHref, type Settings } from '@/lib/api';
import { Brand } from './Navbar';
import { GlobeIcon, MailIcon, PhoneIcon, SocialIcon } from './icons';

/** Dark teal footer (version_2_1_0 Footer.jsx). */
export function Footer({ settings, logo }: { settings: Settings; logo: string }) {
  const { t } = useLanguage();
  const isHome = usePathname() === '/';
  const phone = settings.phone || DEFAULTS.phone;
  const email = settings.email || DEFAULTS.email;
  const website = settings.website || DEFAULTS.website;
  const socials = socialLinks(settings);
  const href = (hash: string) => (isHome ? `#${hash}` : `/#${hash}`);

  return (
    <footer className="w-full bg-secondary text-white">
      <div className="container mx-auto my-5 w-[90%]">
        <div className="flex items-center justify-between py-4">
          <Brand logo={logo} size={64} textClass="md:text-lg xl:text-2xl" />
          <nav aria-label="Footer" className="hidden items-center font-bold lg:flex">
            <a href={href('aboutus')} className="mx-3 hover:text-primary">
              {t.nav.about}
            </a>
            <a href={href('products')} className="mx-3 hover:text-primary">
              {t.nav.products}
            </a>
            <a href={href('partners')} className="mx-3 hover:text-primary">
              {t.nav.partners}
            </a>
            <a href={href('contactus')} className="mx-3 hover:text-primary">
              {t.nav.contact}
            </a>
          </nav>
        </div>
        <hr className="border-white/60" />

        <div className="flex items-end justify-between gap-4 py-6">
          <div className="flex flex-col gap-1">
            <a href={telHref(phone)} className="my-2 flex items-center gap-2" dir="ltr">
              <PhoneIcon /> {phone}
            </a>
            <a href={`mailto:${email}`} className="my-2 flex items-center gap-2 break-all">
              <MailIcon /> {email}
            </a>
            <a href={website} target="_blank" rel="noopener noreferrer" className="my-2 flex items-center gap-2">
              <GlobeIcon /> {website.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
            {socials.length > 0 && (
              <div className="mt-2 flex gap-6 lg:gap-4">
                {socials.map((s) => (
                  <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.key}>
                    <SocialIcon name={s.key} />
                  </a>
                ))}
              </div>
            )}
          </div>
          <p className="my-[55px] hidden w-[70%] text-[#F2F2F2] lg:block">{t.about.text}</p>
        </div>
        <p className="border-t border-white/15 py-4 text-center text-xs text-white/60">
          © {new Date().getFullYear()} Yangiyer Flour Trading. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
