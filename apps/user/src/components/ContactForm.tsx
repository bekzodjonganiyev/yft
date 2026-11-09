'use client';

import { useState, type FormEvent } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { API_URL } from '@/lib/api';
import { Reveal } from './Reveal';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const field =
  'block w-full rounded-md border border-[#082A58] bg-white px-3 py-2 text-navy shadow-sm placeholder:text-[#082A58] focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm';

/** Form on the left, Google map on the right (version_2_1_0 ContactForm.jsx). */
export function ContactForm({ mapUrl }: { mapUrl: string }) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/inquiries`, { method: 'POST', body: new FormData(form) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || t.contact.error);
      form.reset();
      setStatus('sent');
    } catch (err) {
      setError(err instanceof TypeError ? t.contact.error : (err as Error).message || t.contact.error);
      setStatus('error');
    }
  };

  return (
    <section className="mb-10 bg-white">
      <div className="container mx-auto flex w-[90%] justify-between gap-8 max-lg:flex-col">
        <Reveal className="w-1/2 max-lg:w-full">
          <h2 id="contactus" className="my-5 text-5xl font-bold text-navy max-md:text-4xl">
            {t.contact.title}
          </h2>

          {status === 'sent' ? (
            <div className="space-y-6 rounded-md border border-[#082A58] p-8 text-center" role="status">
              <p className="text-lg text-navy">{t.contact.success}</p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="rounded bg-primary px-10 py-3 text-xs font-medium uppercase text-white"
              >
                {t.contact.again}
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <label className="block">
                <span className="sr-only">{t.contact.name}</span>
                <input name="fullName" required maxLength={120} autoComplete="name" placeholder={t.contact.name} className={field} />
              </label>
              <label className="block">
                <span className="sr-only">{t.contact.phone}</span>
                <input
                  name="phone"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  pattern="[0-9+()\s-]{7,20}"
                  placeholder="+(998) --- -- --"
                  className={field}
                  dir="ltr"
                />
              </label>
              <label className="block">
                <span className="sr-only">{t.contact.email}</span>
                <input name="email" type="email" autoComplete="email" placeholder={t.contact.email} className={field} />
              </label>
              <label className="block">
                <span className="sr-only">{t.contact.message}</span>
                <textarea name="message" required rows={10} maxLength={3000} placeholder={t.contact.message} className={field} />
              </label>
              {status === 'error' && (
                <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-800" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="rounded bg-primary px-10 py-3 text-xs font-medium uppercase leading-tight text-white shadow-md transition hover:bg-primary-dark hover:shadow-lg disabled:opacity-60"
              >
                {status === 'sending' ? t.contact.sending : t.contact.send}
              </button>
            </form>
          )}
        </Reveal>

        <iframe
          src={mapUrl}
          className="h-[450px] w-full border-0 lg:w-[600px]"
          title="Yangiyer Flour Trading — map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
