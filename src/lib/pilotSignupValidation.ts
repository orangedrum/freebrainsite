const ROLE_LABELS = {
  individual: "Individual",
  clinician: "Clinician",
  institutionRep: "Institution representative",
  parentOrPOA: "Parent or power of attorney",
  other: "Other",
} as const;

export type PilotRole = keyof typeof ROLE_LABELS;
export type SupportedLanguage = "en" | "es" | "de" | "pt";

export interface PilotSignupSubmission {
  fullName: string;
  email: string;
  phone: string;
  role: PilotRole;
  institution: string;
  notes: string;
  termsAccepted: true;
  tangoOptIn: boolean;
  mediaConsent: boolean;
  brandingConsent: boolean;
  locale: SupportedLanguage;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === "string";

const isRole = (value: unknown): value is PilotRole =>
  isString(value) && Object.prototype.hasOwnProperty.call(ROLE_LABELS, value);

const isLanguage = (value: unknown): value is SupportedLanguage =>
  value === "en" || value === "es" || value === "de" || value === "pt";

const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";
const hasLineBreak = (value: string): boolean => /[\r\n]/.test(value);

export const validatePilotSignup = (payload: unknown): PilotSignupSubmission | null => {
  if (!isRecord(payload)) return null;
  if (isString(payload.website) && payload.website.trim()) return null;
  if (
    !isString(payload.fullName) ||
    !isString(payload.email) ||
    !isString(payload.phone) ||
    !isRole(payload.role) ||
    !isString(payload.institution) ||
    !isString(payload.notes) ||
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
  const institution = payload.institution.trim();
  const notes = payload.notes.trim();

  if (fullName.length < 1 || fullName.length > 120 || hasLineBreak(fullName)) return null;
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (
    phone.length > 40 ||
    !/^[+\d(). -]+$/.test(phone) ||
    phone.replace(/\D/g, "").length < 6
  ) {
    return null;
  }
  if (
    institution.length > 180 ||
    hasLineBreak(institution) ||
    notes.length > 1000
  ) {
    return null;
  }
  if (
    (payload.role === "clinician" || payload.role === "institutionRep") &&
    institution.length === 0
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
    role: payload.role,
    institution,
    notes,
    termsAccepted: true,
    tangoOptIn: payload.tangoOptIn,
    mediaConsent: payload.mediaConsent,
    brandingConsent: payload.brandingConsent,
    locale: payload.locale,
  };
};

export const getPilotRoleLabel = (role: PilotRole): string => ROLE_LABELS[role];
