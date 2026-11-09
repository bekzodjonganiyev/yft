import { useTranslation } from "react-i18next";

import logo from "../data/logo";
import { contacts } from "../data/contacts";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="on-dark bg-silo-700 text-white/85">
      <div className="container grid gap-10 py-14 md:grid-cols-3">
        <div className="flex items-start gap-3">
          <img src={logo} alt="" width="40" height="40" className="h-10 w-10" />
          <div>
            <p className="font-semibold text-white">{t("footer.company")}</p>
            <p className="mt-1 text-sm">{t("footer.since")}</p>
          </div>
        </div>
        <ul className="space-y-1.5">
          {contacts.phones.map((p) => (
            <li key={p.key}>
              <a href={p.href} className="link tabular-nums text-white" dir="ltr">
                {p.display}
              </a>{" "}
              <span className="text-sm">{t(`contact.phone.${p.key}`)}</span>
            </li>
          ))}
          <li>
            <a href={`mailto:${contacts.email}`} className="link break-all text-white">
              {contacts.email}
            </a>
          </li>
        </ul>
        <p className="max-w-[36ch] text-sm">{t("contact.addressValue")}</p>
      </div>
      <div className="border-t border-white/15">
        <p className="container py-5 text-sm text-white/70">
          © {new Date().getFullYear()} Yangiyer Flour Trading. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
