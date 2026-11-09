import type { ReactNode } from "react";

import type { Dictionary } from "@/i18n/dictionaries";
import { contacts, primaryPhone } from "@/lib/site";
import { CopyButton } from "./CopyButton";

const Phone = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M6.6 3.2c.4-.4 1-.3 1.3.1l1.6 2.3c.3.4.2 1-.2 1.3l-1 .9c-.3.3-.4.7-.2 1a9.6 9.6 0 0 0 3.1 3.1c.3.2.7.1 1-.2l.9-1c.3-.4.9-.5 1.3-.2l2.3 1.6c.4.3.5.9.1 1.3l-1.2 1.3c-.9.9-2.2 1.2-3.4.7a16.5 16.5 0 0 1-7.7-7.7c-.5-1.2-.2-2.5.7-3.4l1.4-1.1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
const Telegram = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M16.8 3.6 2.9 9c-.9.4-.9 1 0 1.3l3.5 1.1 1.3 4.2c.2.5.4.6.8.3l2-1.6 3.6 2.7c.6.4 1.1.2 1.2-.6L17.7 4.6c.2-1-.2-1.4-.9-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M6.4 11.4 14 6.4l-5.6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Mail = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="m3.5 6 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

function Tile({ href, icon, label, value, external, copy }: { href: string; icon: ReactNode; label: string; value: string; external?: boolean; copy: { label: string; done: string } }) {
  return (
    <li className="flex items-center gap-2 rounded-ctl border border-line p-2 pe-2.5 transition-colors duration-150 hover:border-line-strong">
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="flex min-w-0 flex-1 items-center gap-3.5 rounded-[8px] p-1"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-flour text-navy">{icon}</span>
        <span className="min-w-0">
          <span className="block font-medium text-ink">{label}</span>
          <span className="block truncate text-sm text-muted tabular-nums" dir="ltr">
            {value}
          </span>
        </span>
      </a>
      <CopyButton text={value} label={copy.label} done={copy.done} />
    </li>
  );
}

/**
 * Five short answers in a native accordion (one open at a time), with the fastest ways to
 * reach a person beside them. Every answer repeats only what the site already states.
 */
export function Faq({ t }: { t: Dictionary }) {
  const items = t.faq.items as { q: string; a: string }[];
  const copy = { label: t.ui.copy, done: t.ui.copied };
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y bg-flour">
      <div className="wrap grid gap-x-16 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 id="faq-title" className="text-h2">
            {t.faq.title}
          </h2>
          <p className="mt-5 max-w-[48ch] text-lead text-muted">{t.faq.lead}</p>

          <div className="mt-10 border-t border-line">
            {items.map((item, i) => (
              <details key={i} name="faq" open={i === 0} className="faq group border-b border-line">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-start font-medium text-ink transition-colors duration-150 hover:text-navy">
                  <span className="text-[1.0625rem] sm:text-lg">{item.q}</span>
                  <span className="plus grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-strong text-ink group-open:border-ink group-open:bg-ink group-open:text-paper" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="max-w-[62ch] pb-6 text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-card border border-line bg-paper p-6 sm:p-8 lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
            <h3 id="faq-help-title" className="text-h3">
              {t.faq.help.title}
            </h3>
            <p className="mt-2 text-muted">{t.faq.help.text}</p>
            <ul className="mt-6 grid gap-3">
              <Tile href={primaryPhone.href} icon={<Phone />} label={t.faq.help.call} value={primaryPhone.display} copy={copy} />
              <Tile href={contacts.telegram} icon={<Telegram />} label={t.faq.help.telegram} value={primaryPhone.display} external copy={copy} />
              <Tile href={`mailto:${contacts.email}`} icon={<Mail />} label={t.faq.help.email} value={contacts.email} copy={copy} />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
