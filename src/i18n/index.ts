import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en/en.json";
import fr from "./locales/fr/fr.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "fr",
    supportedLngs: ["en", "fr"],
    defaultNS: "translation",

    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "ums_language",
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
