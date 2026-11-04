export type SupportedLanguage = "en" | "es" | "de" | "pt";
export type ContactMethod = "whatsapp" | "text";

export interface PilotSignupSubmission {
  fullName: string;
  email: string;
  phone: string;
  contactMethod: ContactMethod;
  title: string;
  institution: string;
  termsAccepted: true;
  tangoOptIn: boolean;
  mediaConsent: boolean;
  brandingConsent: boolean;
  locale: SupportedLanguage;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === "string";

const isLanguage = (value: unknown): value is SupportedLanguage =>
  value === "en" || value === "es" || value === "de" || value === "pt";

const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";
const hasControlCharacter = (value: string): boolean => /\p{Cc}/u.test(value);
const isContactMethod = (value: unknown): value is ContactMethod =>
  value === "whatsapp" || value === "text";

export const isValidInternationalPhone = (phone: string): boolean => {
  const trimmedPhone = phone.trim();
  if (!/^\+?[0-9][0-9 ().-]*[0-9]$/.test(trimmedPhone)) return false;
  const digitCount = trimmedPhone.replace(/\D/g, "").length;
  return digitCount >= 7 && digitCount <= 15;
};

export const validatePilotSignup = (payload: unknown): PilotSignupSubmission | null => {
  if (!isRecord(payload)) return null;
  if (isString(payload.website) && payload.website.trim()) return null;
  if (
    !isString(payload.fullName) ||
    !isString(payload.email) ||
    !isString(payload.phone) ||
    !isContactMethod(payload.contactMethod) ||
    !isString(payload.title) ||
    !isString(payload.institution) ||
    payload.termsAccepted !== true ||
    !isBoolean(payload.tangoOptIn) ||
    !isBoolean(payload.mediaConsent) ||
    !isBoolean(payload.brandingConsent) ||
    !isLanguage(payload.locale)
  ) {
    return null;
  }

  const fullName = payload.fullName.trim();
  const email = payload.email.trim();
  const phone = payload.phone.trim();
  const title = payload.title.trim();
  const institution = payload.institution.trim();

  if (fullName.length < 1 || fullName.length > 120 || hasControlCharacter(fullName)) return null;
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (phone.length > 24 || !isValidInternationalPhone(phone)) return null;
  if (title.length < 1 || title.length > 120 || hasControlCharacter(title)) return null;
  if (
    institution.length < 1 ||
    institution.length > 180 ||
    hasControlCharacter(institution)
  ) {
    return null;
  }
  if (
    payload.tangoOptIn
      ? !payload.mediaConsent || !payload.brandingConsent
      : payload.mediaConsent || payload.brandingConsent
  ) {
    return null;
  }

  return {
    fullName,
    email,
    phone,
    contactMethod: payload.contactMethod,
    title,
    institution,
    termsAccepted: true,
    tangoOptIn: payload.tangoOptIn,
    mediaConsent: payload.mediaConsent,
    brandingConsent: payload.brandingConsent,
    locale: payload.locale,
  };
};
