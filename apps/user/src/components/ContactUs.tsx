'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { API_URL } from '@/lib/api';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const field =
  'block w-full rounded-md border border-white bg-slate-300 px-3 py-2 text-navy shadow-sm placeholder:text-navy/80 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm';

export function ContactUs({ image }: { image: string }) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (!(data.get('attachment') as File | null)?.size) data.delete('attachment');

    setStatus('sending');
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/inquiries`, { method: 'POST', body: data });
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
    <section id="contact" className="bg-white py-10">
      <div className="container flex flex-col items-center gap-8 lg:flex-row">
        <div className="relative aspect-square w-full lg:w-1/2">
          <Image src={image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>

        <div className="w-full bg-slate-800 px-6 py-8 sm:px-12 lg:w-1/2">
          <h3 className="mb-6 text-center text-2xl font-semibold text-white">{t.contact.title}</h3>

          {status === 'sent' ? (
            <div className="space-y-6 py-10 text-center text-white" role="status">
              <p className="text-lg">{t.contact.success}</p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="rounded bg-gold px-6 py-2.5 text-xs font-bold uppercase text-navy"
              >
                {t.contact.again}
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <label className="block">
                <span className="sr-only">{t.contact.name}</span>
                <input name="fullName" type="text" required maxLength={120} autoComplete="name" placeholder={t.contact.name} className={field} />
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
                  placeholder="+998 (__) ___-__-__"
                  className={field}
                />
              </label>
              <label className="block">
                <span className="sr-only">{t.contact.email}</span>
                <input name="email" type="email" autoComplete="email" placeholder={t.contact.email} className={field} />
              </label>
              <label className="block">
                <span className="sr-only">{t.contact.message}</span>
                <textarea name="message" required rows={8} maxLength={3000} placeholder={t.contact.message} className={field} />
              </label>
              <label className="block text-sm text-slate-300">
                {t.contact.file}
                <input
                  name="attachment"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                  className={`${field} mt-2 file:me-3 file:rounded file:border-0 file:bg-navy file:px-3 file:py-1 file:text-white`}
                />
              </label>

              {status === 'error' && (
                <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-800" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded bg-sky-900 px-6 py-3 text-xs font-medium uppercase leading-tight text-white shadow-md transition hover:bg-sky-800 hover:shadow-lg disabled:opacity-60"
              >
                {status === 'sending' ? t.contact.sending : t.contact.send}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
