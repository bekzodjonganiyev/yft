'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

export const ContactUs = () => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    subject: 'Oliy Navli Bug\'doy Uni (Buyurtma so\'rovi)',
    quantity: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        subject: formData.subject + (formData.quantity ? ` - Hajm: ${formData.quantity}` : ''),
        message: formData.message,
      };

      const res = await fetch('http://localhost:5000/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => null);

      if (res && !res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Xatolik yuz berdi');
      }

      setSubmitted(true);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        subject: 'Oliy Navli Bug\'doy Uni (Buyurtma so\'rovi)',
        quantity: '',
        message: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Murojaat yuborishda xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-milledCream-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-wheat-100 text-wheat-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <MessageSquare className="h-4 w-4 text-wheat-600" />
            <span>{t.contact.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slateIron-950 tracking-tight leading-tight">
            {t.contact.title}
          </h2>
          <p className="mt-3 text-lg text-slate-600 font-normal leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        {/* Contact Form & Information Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl">
            <h3 className="text-2xl font-bold text-slateIron-950 mb-2">
              {t.contact.formTitle}
            </h3>
            <p className="text-sm text-slate-500 mb-8">
              Barcha maydonlarni to'ldiring, tijorat bo'limi 30 daqiqa ichida siz bilan bog'lanadi.
            </p>

            {submitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4 animate-fade-in">
                <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold text-emerald-900">
                  Murojaatingiz qabul qilindi!
                </h4>
                <p className="text-sm text-emerald-700 max-w-md mx-auto leading-relaxed">
                  {t.contact.successMessage}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Yana boshqa xabar yuborish
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      F.I.SH yoki Tashkilot *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder={t.contact.namePlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-wheat-500 text-sm transition-all text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Telefon raqami *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+998 90 123 45 67"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-wheat-500 text-sm transition-all text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Elektron pochta (ixtiyoriy)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nomi@kompaniya.uz"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-wheat-500 text-sm transition-all text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Un navi
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-wheat-500 text-sm transition-all text-slate-900"
                    >
                      <option value="Oliy Navli Bug'doy Uni (Premium)">Oliy Navli Bug'doy Uni (Premium)</option>
                      <option value="1-Navli Bug'doy Uni (Birinchi Nav)">1-Navli Bug'doy Uni (Birinchi Nav)</option>
                      <option value="2-Navli Bug'doy Uni (Ikkinchi Nav)">2-Navli Bug'doy Uni (Ikkinchi Nav)</option>
                      <option value="Bug'doy Kepagi (Ozuqabop)">Bug'doy Kepagi (Ozuqabop)</option>
                      <option value="Eksport va Distribyutsiya">Eksport va Hamkorlik</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Kutilayotgan hajm (Tonna yoki qop)
                  </label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="Masalan: 10 tonna yoki 500 qop"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-wheat-500 text-sm transition-all text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Xabar yoki qo'shimcha talablar *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t.contact.messagePlaceholder}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-wheat-500 text-sm transition-all text-slate-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-wheat-500 hover:bg-wheat-600 disabled:opacity-70 text-slateIron-950 font-bold py-4 px-6 rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-wheat-500/30"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? t.contact.submitting : t.contact.submitBtn}</span>
                </button>
              </form>
            )}
          </div>

          {/* Contact Details & Map Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Info Cards */}
            <div className="bg-slateIron-950 text-white rounded-3xl p-8 shadow-xl space-y-6">
              <h4 className="text-xl font-bold text-wheat-400">
                {t.contact.directContactTitle}
              </h4>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-wheat-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-white/60 block font-semibold uppercase tracking-wider">
                      {t.contact.addressLabel}
                    </span>
                    <span className="text-white/90 leading-relaxed font-medium">
                      {t.contact.addressVal}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-wheat-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-white/60 block font-semibold uppercase tracking-wider">
                      {t.contact.phoneLabel}
                    </span>
                    <a href="tel:+998718756456" className="text-wheat-300 hover:underline font-mono text-base block font-bold">
                      +998 71 875 64 56
                    </a>
                    <a href="tel:+998901234567" className="text-white/80 hover:underline font-mono text-sm block">
                      +998 90 123 45 67
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-wheat-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-white/60 block font-semibold uppercase tracking-wider">
                      {t.contact.emailLabel}
                    </span>
                    <a href="mailto:Yangiyerflour@gmail.com" className="text-wheat-300 hover:underline font-medium">
                      {t.contact.emailVal}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-wheat-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-white/60 block font-semibold uppercase tracking-wider">
                      {t.contact.hoursLabel}
                    </span>
                    <span className="text-white/90 font-medium">
                      {t.contact.hoursVal}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Container */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md h-72 relative">
              <iframe
                title="Yangiyer Flour Trading Location"
                className="w-full h-full border-0"
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2997.971617605521!2d69.2168139758326!3d41.287722171312694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDE3JzE1LjgiTiA2OcKwMTMnMDkuOCJF!5e0!3m2!1sru!2s!4v1682497109753!5m2!1sru!2s"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
