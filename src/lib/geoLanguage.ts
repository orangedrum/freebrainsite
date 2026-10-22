import type { SupportedLanguage } from "@/i18n";

/** Maps ISO 3166-1 alpha-2 country codes to our supported languages. */
const COUNTRY_LANGUAGE_MAP: Record<string, SupportedLanguage> = {
  PT: "pt",
  BR: "pt",
  DE: "de",
  AT: "de",
  ES: "es",
  AR: "es",
  MX: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  VE: "es",
  EC: "es",
  GT: "es",
  CR: "es",
  PA: "es",
  PY: "es",
  BO: "es",
  UY: "es",
  DO: "es",
  CU: "es",
  HN: "es",
  NI: "es",
  SV: "es",
  GQ: "es",
};

const GEO_TIMEOUT_MS = 5000;

/**
 * Determines the visitor's language from their IP country via ipapi.co.
 * Returns null on failure, timeout, or an unmapped country.
 */
export const fetchLanguageByIp = async (): Promise<SupportedLanguage | null> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);
    const response = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) return null;

    const data = (await response.json()) as { country_code?: string; error?: boolean };
    if (data.error || !data.country_code) return null;

    return COUNTRY_LANGUAGE_MAP[data.country_code.toUpperCase()] ?? null;
  } catch {
    return null;
  }
};
