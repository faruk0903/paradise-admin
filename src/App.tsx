import  { Fragment, Suspense } from "react";
import AppRouting from "./router/router";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
// import { SEOMeta } from "./utilities/SEOMeta";
import enTranslation from "./assets/data/locales/en.json";
import frTranslation from "./assets/data/locales/fr.json";

i18n.use(LanguageDetector).init({
  resources: {
    en: { translation: enTranslation },
    fr: { translation: frTranslation },
  },
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});
function App() {
  return (
    <Fragment>
      <Suspense
        fallback={
          <div className="bg-opacity-100 bg-transparent fixed inset-0 min-h-screen flex justify-center items-center z-50">
            Loading..
          </div>
        }
      >
        <I18nextProvider i18n={i18n}>
          <AppRouting />
        </I18nextProvider>
      </Suspense>
    </Fragment>
  );
}

export default App;
