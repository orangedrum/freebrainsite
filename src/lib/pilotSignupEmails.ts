import type { PilotSignupSubmission } from "./pilotSignupValidation";
import type { SupportedLanguage } from "./pilotSignupValidation";
import { TERMS_VERSION } from "./terms";
import emailEn from "../locales/en/pilotSignupEmail.json";
import emailEs from "../locales/es/pilotSignupEmail.json";
import emailDe from "../locales/de/pilotSignupEmail.json";
import emailPt from "../locales/pt/pilotSignupEmail.json";

const SENDER = "FreeBrain <jean@freethebrains.com>";
const REPLY_TO = "jean@freethebrains.com";
const RECORD_RECIPIENT = "jean@freethebrains.com";
const TERMS_URL = "https://www.freethebrains.com/terms";
const CALENDLY_URL =
  "https://calendly.com/jean-kaluza/app-idea-day-1-facilitation-clone";
const emailTranslations = {
  en: emailEn,
  es: emailEs,
  de: emailDe,
  pt: emailPt,
} satisfies Record<SupportedLanguage, typeof emailEn>;

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => {
    const replacements: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return replacements[character];
  });

const getRecordDetails = (submission: PilotSignupSubmission): [string, string][] => [
  ["Full name", submission.fullName],
  ["Email", submission.email],
  ["Phone", submission.phone],
  ["Role", submission.role],
  ["Institution / clinic", submission.institution || "Not provided"],
  ["Notes", submission.notes || "Not provided"],
  ["Terms accepted", "Yes"],
  ["Terms version", TERMS_VERSION],
  ["4 free tango sessions", submission.tangoOptIn ? "Accepted" : "Not selected"],
  ["Photo / video consent", submission.mediaConsent ? "Accepted" : "Not selected"],
  ["Partner branding consent", submission.brandingConsent ? "Accepted" : "Not selected"],
  ["Signup language", submission.locale],
];

const getConfirmationDetails = (submission: PilotSignupSubmission): [string, string][] => {
  const copy = emailTranslations[submission.locale];
  return [
    [copy.fields.fullName, submission.fullName],
    [copy.fields.email, submission.email],
    [copy.fields.phone, submission.phone],
    [copy.fields.role, copy.roles[submission.role]],
    [copy.fields.institution, submission.institution || copy.notProvided],
    [copy.fields.notes, submission.notes || copy.notProvided],
    [copy.fields.termsAccepted, copy.yes],
    [copy.fields.termsVersion, TERMS_VERSION],
    [copy.fields.tangoOptIn, submission.tangoOptIn ? copy.accepted : copy.notSelected],
    [copy.fields.mediaConsent, submission.mediaConsent ? copy.accepted : copy.notSelected],
    [copy.fields.brandingConsent, submission.brandingConsent ? copy.accepted : copy.notSelected],
    [copy.fields.locale, submission.locale],
  ];
};

const renderDetailsAsText = (details: [string, string][]): string =>
  details
    .map(([label, value]) => `${label}: ${value.replace(/\p{Cc}/gu, " ")}`)
    .join("\n");

const renderDetailsAsHtml = (details: [string, string][]): string =>
  details
    .map(([label, value]) => `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`)
    .join("");

export const createPilotRecordEmail = (
  submission: PilotSignupSubmission,
  submittedAt: string,
  ipAddress: string,
) => ({
  from: SENDER,
  to: [RECORD_RECIPIENT],
  reply_to: REPLY_TO,
  subject: "Signed FreeBrain pilot signup record",
  text: [
    "New FreeBrain pilot signup record",
    "",
    renderDetailsAsText(getRecordDetails(submission)),
    `Submitted at (UTC): ${submittedAt}`,
    `IP address: ${ipAddress}`,
    `Terms URL: ${TERMS_URL}`,
  ].join("\n"),
  html: `<h1>New FreeBrain pilot signup record</h1><table>${renderDetailsAsHtml(getRecordDetails(submission))}</table><p>Submitted at (UTC): ${escapeHtml(submittedAt)}<br>IP address: ${escapeHtml(ipAddress)}<br>Terms URL: <a href="${TERMS_URL}">${TERMS_URL}</a></p>`,
});

export const createPilotConfirmationEmail = (submission: PilotSignupSubmission) => ({
  from: SENDER,
  to: [submission.email],
  reply_to: REPLY_TO,
  subject: emailTranslations[submission.locale].subject,
  text: [
    emailTranslations[submission.locale].greeting.replace("{{name}}", submission.fullName),
    "",
    emailTranslations[submission.locale].intro,
    "",
    renderDetailsAsText(getConfirmationDetails(submission)),
    "",
    `${emailTranslations[submission.locale].termsLink.replace("{{version}}", TERMS_VERSION)}: ${TERMS_URL}`,
    "",
    `${emailTranslations[submission.locale].nextStep}: ${CALENDLY_URL}`,
    emailTranslations[submission.locale].bookingLink,
    "",
    emailTranslations[submission.locale].schedulingNotice,
  ].join("\n"),
  html: `<h1>${escapeHtml(emailTranslations[submission.locale].subject)}</h1><p>${escapeHtml(emailTranslations[submission.locale].greeting.replace("{{name}}", submission.fullName))}</p><p>${escapeHtml(emailTranslations[submission.locale].intro)}</p><table>${renderDetailsAsHtml(getConfirmationDetails(submission))}</table><p><a href="${TERMS_URL}">${escapeHtml(emailTranslations[submission.locale].termsLink.replace("{{version}}", TERMS_VERSION))}</a></p><p><strong>${escapeHtml(emailTranslations[submission.locale].nextStep)}:</strong> <a href="${CALENDLY_URL}">${escapeHtml(emailTranslations[submission.locale].bookingLink)}</a></p><p>${escapeHtml(emailTranslations[submission.locale].schedulingNotice)}</p>`,
});

type PilotEmail = ReturnType<typeof createPilotRecordEmail> | ReturnType<typeof createPilotConfirmationEmail>;

export const sendPilotEmail = async (apiKey: string, email: PilotEmail): Promise<boolean> => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(email),
    signal: AbortSignal.timeout(10_000),
  });
  return response.ok;
};
