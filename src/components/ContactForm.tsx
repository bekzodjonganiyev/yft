"use client";

import { Suspense, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import { format } from "@/i18n/config";

type Labels = {
  label: string;
  name: string;
  phone: string;
  phoneHint: string;
  brand: string;
  brandAny: string;
  quantity: string;
  message: string;
  messageHint: string;
  optional: string;
  submit: string;
  sending: string;
  sentTitle: string;
  sentText: string;
  again: string;
  nameRequired: string;
  phoneInvalid: string;
  failed: string;
};
type Brand = { id: string; name: string };
type FieldName = "name" | "phone";
type ControlProps = { id: string; "aria-describedby"?: string; "aria-invalid"?: true };

const digitsIn = (s: string) => (s.match(/\d/g) || []).length;

function Field({
  label,
  hint,
  optional,
  error,
  children,
}: {
  label: string;
  hint?: string;
  optional?: string;
  error?: string;
  children: (props: ControlProps) => ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="block font-medium">
        {label}
        {optional && <span className="font-normal text-ink-600"> ({optional})</span>}
      </label>
      <div className="mt-2">{children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}</div>
      {/* Hints sit under the control so inputs in the same row stay aligned. */}
      {hint && (
        <p id={hintId} className="mt-1.5 text-sm text-ink-600">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Reads ?brand= from the URL (set by the brand shelf) and hands it to the form. */
function BrandFromUrl({ onBrand }: { onBrand: (id: string) => void }) {
  const brand = useSearchParams().get("brand");
  useEffect(() => {
    if (brand) onBrand(brand);
  }, [brand, onBrand]);
  return null;
}

export function ContactForm({ labels, brands, fallbackPhone }: { labels: Labels; brands: readonly Brand[]; fallbackPhone: string }) {
  const nameRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef(0);
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [sentPhone, setSentPhone] = useState("");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Brand picked under a bag: preselect it and put the cursor in the first field.
  const [onBrand] = useState(() => (id: string) => {
    if (brands.some((b) => b.id === id)) setBrand(id);
    nameRef.current?.focus({ preventScroll: true });
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const found: Partial<Record<FieldName, string>> = {};
    if (!data.name?.trim()) found.name = labels.nameRequired;
    if (digitsIn(data.phone ?? "") < 9) found.phone = labels.phoneInvalid;
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
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
      setBrand("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div
        role="status"
        tabIndex={-1}
        // The submit button is gone, so move focus here instead of letting it drop to <body>.
        ref={(el) => el?.focus({ preventScroll: true })}
        className="rounded-control bg-steel p-6 outline-none md:p-10"
      >
        <h3 className="text-xl">{labels.sentTitle}</h3>
        <p className="mt-3 text-lg">{format(labels.sentText, { phone: sentPhone })}</p>
        <button
          type="button"
          className="btn mt-6 border border-silo text-silo hover:bg-flour"
          onClick={() => {
            startedAt.current = Date.now();
            setStatus("idle");
          }}
        >
          {labels.again}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-label={labels.label} className="grid gap-6 rounded-control bg-steel p-6 md:grid-cols-2 md:p-10">
      <Suspense fallback={null}>
        <BrandFromUrl onBrand={onBrand} />
      </Suspense>

      <Field label={labels.name} error={errors.name}>
        {(a) => <input {...a} ref={nameRef} name="name" type="text" autoComplete="name" maxLength={120} className="field" />}
      </Field>

      <Field label={labels.phone} hint={labels.phoneHint} error={errors.phone}>
        {(a) => <input {...a} name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={30} dir="ltr" className="field text-start" />}
      </Field>

      <Field label={labels.brand}>
        {(a) => (
          <select {...a} name="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="field">
            <option value="">{labels.brandAny}</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id} translate="no">
                {b.name}
              </option>
            ))}
          </select>
        )}
      </Field>

      <Field label={labels.quantity} optional={labels.optional}>
        {(a) => <input {...a} name="quantity" type="text" inputMode="numeric" autoComplete="off" maxLength={20} className="field" />}
      </Field>

      <div className="md:col-span-2">
        <Field label={labels.message} hint={labels.messageHint} optional={labels.optional}>
          {(a) => <textarea {...a} name="message" rows={4} maxLength={2000} autoComplete="off" className="field" />}
        </Field>
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="sr-only">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="md:col-span-2">
        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status === "sending"}>
          {status === "sending" ? labels.sending : labels.submit}
        </button>
        {status === "error" && (
          <p role="alert" className="mt-4 font-medium text-danger">
            {format(labels.failed, { phone: fallbackPhone })}
          </p>
        )}
      </div>
    </form>
  );
}
