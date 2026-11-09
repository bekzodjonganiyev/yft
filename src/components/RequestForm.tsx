"use client";

import { Suspense, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import { format, type Locale } from "@/i18n/config";
import { Select } from "./Select";

export type RequestLabels = {
  label: string;
  name: string;
  phone: string;
  phoneHint: string;
  brand: string;
  brandAny: string;
  country: string;
  countryAny: string;
  countries: Record<"uz" | "kz" | "ru" | "other", string>;
  quantity: string;
  decrease: string;
  increase: string;
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
  privacy: string;
  errorsCount: string;
  summary: { title: string; volume: string; transport: string; bags: string; tonnes: string; trucks: string; wagons: string; empty: string };
};
type Brand = { id: string; name: string };
type FieldName = "name" | "phone";
type ControlProps = { id: string; "aria-describedby"?: string; "aria-invalid"?: true };

const STEP = 10;
const MAX_BAGS = 100000;
const BAG_KG = 50;
const TRUCK_T = 20;
const WAGON_T = 68;
const digitsIn = (s: string) => (s.match(/\d/g) || []).length;

function Field({
  label,
  hint,
  optional,
  error,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  optional?: string;
  error?: string;
  className?: string;
  children: (props: ControlProps) => ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-sm font-medium text-ink">
        {label}
        {optional && <span className="font-normal text-muted">{optional}</span>}
      </label>
      {children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
      {error ? (
        <p id={errorId} className="mt-2 flex items-center gap-1.5 text-sm font-medium text-danger">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4" />
            <path d="M7 3.8v3.7M7 9.6v.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="mt-2 text-sm text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

/** Bags: type a number or step by ten. */
function QuantityField({
  id,
  describedBy,
  labels,
  value,
  onChange,
}: {
  id: string;
  describedBy?: string;
  labels: Pick<RequestLabels, "decrease" | "increase">;
  value: string;
  onChange: (v: string) => void;
}) {
  const n = Number(value) || 0;
  const set = (v: number) => onChange(v <= 0 ? "" : String(Math.min(MAX_BAGS, v)));
  const stepBtn =
    "grid w-12 shrink-0 place-items-center self-stretch text-navy transition-[background-color,transform] duration-150 hover:bg-flour active:scale-90 disabled:text-line-strong disabled:active:scale-100";
  return (
    <div className="field flex items-stretch gap-0 p-0 focus-within:border-navy focus-within:shadow-[0_0_0_3px_var(--ring)]">
      <button type="button" className={`${stepBtn} rounded-s-[inherit] border-e border-line`} onClick={() => set(n - STEP)} disabled={n <= 0} aria-label={labels.decrease}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3.5 8h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      <input
        id={id}
        name="quantity"
        inputMode="numeric"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        aria-describedby={describedBy}
        placeholder="0"
        className="min-w-0 flex-1 bg-transparent text-center tabular-nums outline-none"
      />
      <button type="button" className={`${stepBtn} rounded-e-[inherit] border-s border-line`} onClick={() => set(n + STEP)} disabled={n >= MAX_BAGS} aria-label={labels.increase}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3.5 8h9M8 3.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

/**
 * The request, read back as it is typed: brand, volume in bags and tonnes, and roughly how
 * much transport that is (20 t trucks up to a wagon's worth, 68 t wagons beyond).
 */
function Summary({ labels, locale, brandName, bags }: { labels: RequestLabels; locale: Locale; brandName: string; bags: string }) {
  const n = Number(bags) || 0;
  const tonnes = (n * BAG_KG) / 1000;
  const fmt = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const volume = n ? `${format(labels.summary.bags, { n: fmt.format(n) })} · ${format(labels.summary.tonnes, { t: fmt.format(tonnes) })}` : labels.summary.empty;
  const transport = !n ? "—" : tonnes >= WAGON_T ? format(labels.summary.wagons, { n: fmt.format(Math.ceil(tonnes / WAGON_T)) }) : format(labels.summary.trucks, { n: fmt.format(Math.ceil(tonnes / TRUCK_T)) });
  const cells = [
    { k: labels.brand, v: brandName || "—" },
    { k: labels.summary.volume, v: volume },
    { k: labels.summary.transport, v: transport },
  ];
  return (
    <dl aria-label={labels.summary.title} className="col-span-6 grid gap-px overflow-hidden rounded-ctl border border-line bg-line sm:grid-cols-3">
      {cells.map((c) => (
        <div key={c.k} className="bg-flour px-4 py-3">
          <dt className="text-label text-muted">{c.k}</dt>
          <dd key={c.v} className="tick-val mt-1 font-medium text-ink tabular-nums">
            {c.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Reads ?brand= (set by the brand section) and preselects it. */
function BrandFromUrl({ onBrand }: { onBrand: (id: string) => void }) {
  const brand = useSearchParams().get("brand");
  useEffect(() => {
    if (brand) onBrand(brand);
  }, [brand, onBrand]);
  return null;
}

export function RequestForm({ labels, brands, fallbackPhone, locale }: { labels: RequestLabels; brands: readonly Brand[]; fallbackPhone: string; locale: Locale }) {
  const nameRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef(0);
  const [brand, setBrand] = useState("");
  const [country, setCountry] = useState("");
  const [bags, setBags] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [sentPhone, setSentPhone] = useState("");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

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
    } catch {
      setStatus("error");
    }
  };

  const errorCount = Object.keys(errors).length;

  if (status === "sent") {
    return (
      <div
        role="status"
        tabIndex={-1}
        ref={(el) => el?.focus({ preventScroll: true })}
        className="grid min-h-[28rem] content-center justify-items-start gap-5 rounded-card bg-paper p-8 text-ink outline-none md:p-12 dark:bg-navy-900"
      >
        <span className="grid h-14 w-14 place-items-center rounded-full bg-gold text-navy-950" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M6.5 13.5l4.5 4.5 8.5-10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="text-h3">{labels.sentTitle}</h3>
        <p className="max-w-[40ch] text-lead text-muted">{format(labels.sentText, { phone: sentPhone })}</p>
        <button
          type="button"
          className="btn btn-outline mt-2 text-navy"
          onClick={() => {
            startedAt.current = Date.now();
            setErrors({});
            setBags("");
            setStatus("idle");
          }}
        >
          {labels.again}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-label={labels.label} className="grid grid-cols-6 gap-x-4 gap-y-6 rounded-card bg-paper p-6 text-ink md:p-10 dark:bg-navy-900">
      <Suspense fallback={null}>
        <BrandFromUrl onBrand={onBrand} />
      </Suspense>

      <Field label={labels.name} error={errors.name} className="col-span-6 sm:col-span-3">
        {(a) => <input {...a} ref={nameRef} name="name" type="text" autoComplete="name" maxLength={120} className="field" />}
      </Field>

      <Field label={labels.phone} hint={labels.phoneHint} error={errors.phone} className="col-span-6 sm:col-span-3">
        {(a) => <input {...a} name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={30} dir="ltr" className="field text-start" />}
      </Field>

      <Field label={labels.brand} className="col-span-6 sm:col-span-3">
        {(a) => (
          <Select
            id={a.id}
            name="brand"
            value={brand}
            onChange={setBrand}
            placeholder={labels.brandAny}
            options={[{ value: "", label: labels.brandAny }, ...brands.map((b) => ({ value: b.id, label: b.name }))]}
          />
        )}
      </Field>

      <Field label={labels.country} className="col-span-6 sm:col-span-3">
        {(a) => (
          <Select
            id={a.id}
            name="country"
            value={country}
            onChange={setCountry}
            placeholder={labels.countryAny}
            options={(["uz", "kz", "ru", "other"] as const).map((c) => ({ value: c, label: labels.countries[c] }))}
          />
        )}
      </Field>

      <Field label={labels.quantity} optional={labels.optional} className="col-span-6 sm:col-span-2">
        {(a) => <QuantityField id={a.id} describedBy={a["aria-describedby"]} labels={labels} value={bags} onChange={setBags} />}
      </Field>

      <Field label={labels.message} hint={labels.messageHint} optional={labels.optional} className="col-span-6 sm:col-span-4">
        {(a) => <textarea {...a} name="message" rows={1} maxLength={2000} autoComplete="off" className="field field-sizing-content min-h-[3.25rem] max-h-48 resize-none" />}
      </Field>

      <Summary labels={labels} locale={locale} brandName={brands.find((b) => b.id === brand)?.name ?? ""} bags={bags} />

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="sr-only">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="col-span-6 grid gap-4">
        <button type="submit" className="btn swap w-full" disabled={status === "sending"}>
          <span data-on={status !== "sending"}>{labels.submit}</span>
          <span data-on={status === "sending"} aria-hidden={status !== "sending"}>
            {labels.sending}
          </span>
        </button>
        <p role="status" className="min-h-5 text-sm">
          {status === "error" ? (
            <span className="font-medium text-danger">{format(labels.failed, { phone: fallbackPhone })}</span>
          ) : errorCount > 0 ? (
            <span className="font-medium text-danger">{format(labels.errorsCount, { count: errorCount })}</span>
          ) : (
            <span className="text-muted">{labels.privacy}</span>
          )}
        </p>
      </div>
    </form>
  );
}
