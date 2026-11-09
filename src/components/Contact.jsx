import { forwardRef, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { brands } from "../data/media";
import { contacts, primaryPhone } from "../data/contacts";

const digitsIn = (s) => (s.match(/\d/g) || []).length;

function Field({ label, hint, optional, error, children }) {
  const { t } = useTranslation();
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="block font-medium">
        {label}
        {optional && <span className="font-normal text-ink-600"> ({t("contact.form.optional")})</span>}
      </label>
      <div className="mt-2">{children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}</div>
      {/* Hints sit under the control so inputs in the same row stay aligned. */}
      {hint && (
        <p id={hintId} className="mt-1.5 text-sm text-ink-600">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 text-sm font-medium text-[#B42318]">
          {error}
        </p>
      )}
    </div>
  );
}

export const Contact = forwardRef(function Contact({ brand, onBrandChange }, nameInputRef) {
  const { t } = useTranslation();
  const startedAt = useRef(Date.now());
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errors, setErrors] = useState({});
  const [sentPhone, setSentPhone] = useState("");

  const validate = (data) => {
    const next = {};
    if (!data.name.trim()) next.name = t("contact.form.nameRequired");
    if (digitsIn(data.phone) < 9) next.phone = t("contact.form.phoneInvalid");
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      form.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, startedAt: startedAt.current }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSentPhone(data.phone.trim());
      setStatus("sent");
      form.reset();
      onBrandChange("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-steel py-20 md:py-28">
      <div className="container grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 id="contact-title" className="text-2xl md:text-3xl">
            {t("contact.title")}
          </h2>
          <p className="mt-3 max-w-prose text-lg">{t("contact.lead")}</p>

          <dl className="mt-10 space-y-6">
            <div>
              <dt className="text-sm text-ink-600">{t("contact.phones")}</dt>
              {contacts.phones.map((p) => (
                <dd key={p.key} className="mt-1 flex flex-wrap items-baseline gap-x-3">
                  <a href={p.href} className="link text-lg font-medium tabular-nums text-silo" dir="ltr">
                    {p.display}
                  </a>
                  <span className="text-sm text-ink-600">{t(`contact.phone.${p.key}`)}</span>
                </dd>
              ))}
            </div>
            <div>
              <dt className="text-sm text-ink-600">{t("contact.email")}</dt>
              <dd className="mt-1">
                <a href={`mailto:${contacts.email}`} className="link break-all text-lg font-medium text-silo">
                  {contacts.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink-600">{t("contact.address")}</dt>
              <dd className="mt-1 max-w-[36ch]">
                {t("contact.addressValue")}
                <br />
                <a href={contacts.mapLink} target="_blank" rel="noopener noreferrer" className="link mt-1 inline-block text-silo">
                  {t("contact.mapLink")}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          {status === "sent" ? (
            <div
              role="status"
              tabIndex={-1}
              // The submit button is gone, so move focus here instead of letting it drop to <body>.
              ref={(el) => el?.focus({ preventScroll: true })}
              className="rounded-control bg-steel p-6 outline-none md:p-10"
            >
              <h3 className="text-xl">{t("contact.form.sentTitle")}</h3>
              <p className="mt-3 text-lg">
                {t("contact.form.sentText", { phone: sentPhone })}
              </p>
              <button
                type="button"
                className="btn mt-6 border border-silo text-silo hover:bg-flour"
                onClick={() => {
                  startedAt.current = Date.now();
                  setStatus("idle");
                }}
              >
                {t("contact.form.again")}
              </button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              noValidate
              aria-label={t("contact.form.label")}
              className="grid gap-6 rounded-control bg-steel p-6 md:grid-cols-2 md:p-10"
            >
              <Field label={t("contact.form.name")} error={errors.name}>
                {(a) => <input {...a} ref={nameInputRef} name="name" type="text" autoComplete="name" maxLength={120} className="field" />}
              </Field>

              <Field label={t("contact.form.phone")} hint={t("contact.form.phoneHint")} error={errors.phone}>
                {(a) => (
                  <input {...a} name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={30} dir="ltr" className="field text-start" />
                )}
              </Field>

              <Field label={t("contact.form.brand")}>
                {(a) => (
                  <select {...a} name="brand" value={brand} onChange={(e) => onBrandChange(e.target.value)} className="field">
                    <option value="">{t("contact.form.brandAny")}</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id} translate="no">
                        {b.name}
                      </option>
                    ))}
                  </select>
                )}
              </Field>

              <Field label={t("contact.form.quantity")} optional>
                {(a) => <input {...a} name="quantity" type="text" inputMode="numeric" autoComplete="off" maxLength={20} className="field" />}
              </Field>

              <div className="md:col-span-2">
                <Field label={t("contact.form.message")} hint={t("contact.form.messageHint")} optional>
                  {(a) => <textarea {...a} name="message" rows={4} maxLength={2000} autoComplete="off" className="field" />}
                </Field>
              </div>

              {/* Honeypot: hidden from people and assistive tech, bots tend to fill it. */}
              <div aria-hidden="true" className="sr-only">
                <label>
                  Website
                  <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div className="md:col-span-2">
                <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === "sending"}>
                  {status === "sending" ? t("contact.form.sending") : t("contact.form.submit")}
                </button>
                {status === "error" && (
                  <p role="alert" className="mt-4 font-medium text-[#B42318]">
                    {t("contact.form.failed", { phone: primaryPhone.display })}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="container mt-16">
        <iframe
          src={contacts.mapEmbed}
          title={t("contact.mapTitle")}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-72 w-full rounded-photo border-0 bg-steel md:h-96"
        />
      </div>
    </section>
  );
});
