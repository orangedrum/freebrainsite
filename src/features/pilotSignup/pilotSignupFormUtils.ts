import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/languages";

export interface SignupFormValues {
  fullName: string;
  email: string;
  phone: string;
  contactMethod: string;
  title: string;
  institution: string;
  termsAccepted: boolean;
  tangoOptIn: boolean;
  mediaConsent: boolean;
  brandingConsent: boolean;
  website: string;
}

export const getSignupLocale = (language: string): SupportedLanguage => {
  const shortLanguage = language.toLowerCase().split("-")[0];
  return SUPPORTED_LANGUAGES.find((supported) => supported === shortLanguage) ?? "en";
};

export const isTangoSignup = (search: string): boolean =>
  new URLSearchParams(search).get("program") === "tango";

export const getSignupErrorMessageKey = (error: string): string => {
  switch (error) {
    case "rate_limited":
      return "pilotSignup.errors.rateLimited";
    case "email_service_unavailable":
      return "pilotSignup.errors.emailServiceUnavailable";
    case "record_email_failed":
    case "email_delivery_failed":
      return "pilotSignup.errors.delivery";
    case "confirmation_email_failed_record_sent":
      return "pilotSignup.errors.partialDelivery";
    default:
      return "pilotSignup.errors.default";
  }
};

export const getSignupConsentErrorKey = (
  values: SignupFormValues,
  isTangoProgram: boolean,
): string | null => {
  if (!values.termsAccepted) return "pilotSignup.errors.termsRequired";
  if (
    isTangoProgram &&
    values.tangoOptIn &&
    (!values.mediaConsent || !values.brandingConsent)
  ) {
    return "pilotSignup.errors.consentsRequired";
  }
  return null;
};
