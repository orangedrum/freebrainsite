import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en/common.json";
import es from "./locales/es/common.json";
import de from "./locales/de/common.json";
import pt from "./locales/pt/common.json";
import { fetchLanguageByIp } from "./lib/geoLanguage";

export const SUPPORTED_LANGUAGES = ["en", "es", "de", "pt"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// Read BEFORE init — i18next caches the detected language on init,
// so post-init reads cannot distinguish a manual choice from an automatic one.
const hasStoredLanguageChoice =
  typeof localStorage !== "undefined" && Boolean(localStorage.getItem("i18nextLng"));

/** Initializes i18next with browser language detection and all supported translations. */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      de: { translation: de },
      pt: { translation: pt },
    },
    fallbackLng: "en",
    supportedLngs: [...SUPPORTED_LANGUAGES],
    nonExplicitSupportedLngs: true,
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });

/**
 * Language priority:
 * 1. Manual switcher choice (localStorage)
 * 2. Browser language, when supported (English included)
 * 3. IP geolocation (Lisbon → pt, Germany → de, Spain/LatAm → es)
 * 4. English fallback
 */
if (!hasStoredLanguageChoice) {
  const browserLanguage = (typeof navigator !== "undefined" ? navigator.language : "").split(
    "-",
  )[0];
  const isBrowserLanguageSupported = SUPPORTED_LANGUAGES.includes(
    browserLanguage as SupportedLanguage,
  );

  if (!isBrowserLanguageSupported) {
    void fetchLanguageByIp().then((language) => {
      if (language) void i18n.changeLanguage(language);
    });
  }
}

export default i18n;
