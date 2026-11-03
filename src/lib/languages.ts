export const SUPPORTED_LANGUAGES = ["en", "es", "de", "pt"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
