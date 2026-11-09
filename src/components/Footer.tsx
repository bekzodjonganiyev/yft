import Image from "next/image";

import logo from "@/assets/logo.png";
import type { Dictionary } from "@/i18n/dictionaries";
import type { contacts as Contacts } from "@/lib/site";

export function Footer({ t, contacts }: { t: Dictionary; contacts: typeof Contacts }) {
  return (
    <footer className="on-dark bg-silo-700 text-white/85">
      <div className="wrap grid gap-10 py-14 md:grid-cols-3">
        <div className="flex items-start gap-3">
          <Image src={logo} alt="" width={40} height={40} className="h-10 w-10" />
          <div>
            <p className="font-semibold text-white">{t.footer.company}</p>
            <p className="mt-1 text-sm">{t.footer.since}</p>
          </div>
        </div>
        <ul className="space-y-1.5">
          {contacts.phones.map((p) => (
            <li key={p.key}>
              <a href={p.href} className="link text-white tabular-nums" dir="ltr">
                {p.display}
              </a>{" "}
              <span className="text-sm">{t.contact.phone[p.key]}</span>
            </li>
          ))}
          <li>
            <a href={`mailto:${contacts.email}`} className="link break-all text-white">
              {contacts.email}
            </a>
          </li>
        </ul>
        <p className="max-w-[36ch] text-sm">{t.contact.addressValue}</p>
      </div>
      <div className="border-t border-white/15">
        <p className="wrap py-5 text-sm text-white/70">
          © {new Date().getFullYear()} Yangiyer Flour Trading. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
