import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Photos } from "./pages/Photos";
import { NotFound } from "./pages/NotFound";

/** Native window scrolling: go to the #hash target, or to the top on a new page. */
function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, key]);
  return null;
}

function DocumentTitle() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  useEffect(() => {
    const titles = { "/": t("meta.title"), "/photos": t("meta.photosTitle") };
    document.title = titles[pathname.replace(/\/+$/, "") || "/"] ?? `${t("notFound.title")} — Yangiyer Flour Trading`;
  }, [pathname, t, i18n.resolvedLanguage]);
  return null;
}

function Layout() {
  const { t } = useTranslation();
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-control bg-gold px-4 py-3 font-medium text-ink focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
      >
        {t("nav.skip")}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <ScrollManager />
      <DocumentTitle />
    </>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="photos" element={<Photos />} />
        {/* Sections of the old site that had only placeholder content: send visitors home, not to a 404. */}
        <Route path="news/*" element={<Navigate to="/" replace />} />
        <Route path="vacancies" element={<Navigate to="/" replace />} />
        <Route path="details/*" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
