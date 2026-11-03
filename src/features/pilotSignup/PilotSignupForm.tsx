import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EXTERNAL_LINKS } from "@/lib/constants";
import {
  getSignupConsentErrorKey,
  getSignupErrorMessageKey,
  getSignupLocale,
  type SignupFormValues,
} from "./pilotSignupFormUtils";

interface PilotSignupFormProps {
  isTangoProgram: boolean;
}

type FormStatus =
  | { kind: "success"; message: string }
  | { kind: "error"; message: string; canContactJean?: boolean }
  | null;

const initialValues: SignupFormValues = {
  fullName: "",
  email: "",
  phone: "",
  role: "individual",
  institution: "",
  notes: "",
  termsAccepted: false,
  tangoOptIn: false,
  mediaConsent: false,
  brandingConsent: false,
  website: "",
};

export const PilotSignupForm = ({ isTangoProgram }: PilotSignupFormProps) => {
  const { t, i18n } = useTranslation();
  const [values, setValues] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>(null);
  const isInstitutionRequired = values.role === "clinician" || values.role === "institutionRep";

  const updateValue = <K extends keyof SignupFormValues>(
    key: K,
    value: SignupFormValues[K],
  ) => {
    if (status?.kind === "success") return;
    setValues((current) => {
      const updated = { ...current, [key]: value };
      return key === "tangoOptIn" && value === false
        ? { ...updated, mediaConsent: false, brandingConsent: false }
        : updated;
    });
    setStatus(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || status?.kind === "success") return;
    const consentErrorKey = getSignupConsentErrorKey(values, isTangoProgram);
    if (consentErrorKey) {
      setStatus({ kind: "error", message: t(consentErrorKey) });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);
    const submission = {
      ...values,
      locale: getSignupLocale(i18n.resolvedLanguage ?? i18n.language),
    };

    try {
      const response = await fetch("/api/pilot-signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(submission),
      });
      let result: unknown;
      try {
        result = await response.json();
      } catch {
        setStatus({
          kind: "error",
          message: t("pilotSignup.errors.endpointUnavailable"),
          canContactJean: true,
        });
        return;
      }

      if (!response.ok) {
        const error =
          typeof result === "object" && result !== null && "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "";
        setStatus({
          kind: "error",
          message: t(getSignupErrorMessageKey(error)),
          canContactJean:
            error === "confirmation_email_failed_record_sent" ||
            error === "email_service_unavailable",
        });
        return;
      }

      setStatus({ kind: "success", message: t("pilotSignup.success") });
    } catch {
      setStatus({
        kind: "error",
        message: t("pilotSignup.errors.network"),
        canContactJean: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCheckbox = (
    key: "termsAccepted" | "tangoOptIn" | "mediaConsent" | "brandingConsent",
    label: ReactNode,
    disabled = false,
    required = false,
  ) => (
    <label className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
      <Checkbox
        checked={values[key]}
        onCheckedChange={(checked) => updateValue(key, checked === true)}
        disabled={disabled}
        aria-required={required}
        className="mt-1"
      />
      <span>{label}</span>
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      <fieldset
        disabled={isSubmitting || status?.kind === "success"}
        className="space-y-5 border-0 p-0"
      >
        <legend className="sr-only">{t("lisbonPilot.nextTitle")}</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-foreground">
          {t("pilotSignup.fullName")}
          <Input
            autoComplete="name"
            maxLength={120}
            required
            value={values.fullName}
            onChange={(event) => updateValue("fullName", event.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-foreground">
          {t("pilotSignup.email")}
          <Input
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-foreground">
          {t("pilotSignup.phone")}
          <Input
            type="tel"
            autoComplete="tel"
            maxLength={40}
            required
            value={values.phone}
            onChange={(event) => updateValue("phone", event.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-foreground">
          {t("pilotSignup.role")}
          <select
            value={values.role}
            onChange={(event) => updateValue("role", event.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="individual">{t("pilotSignup.roles.individual")}</option>
            <option value="clinician">{t("pilotSignup.roles.clinician")}</option>
            <option value="institutionRep">{t("pilotSignup.roles.institutionRep")}</option>
            <option value="parentOrPOA">{t("pilotSignup.roles.parentOrPOA")}</option>
            <option value="other">{t("pilotSignup.roles.other")}</option>
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-foreground sm:col-span-2">
          {t("pilotSignup.institution")}
          {isInstitutionRequired && <span aria-hidden="true"> *</span>}
          <Input
            maxLength={180}
            required={isInstitutionRequired}
            value={values.institution}
            onChange={(event) => updateValue("institution", event.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-foreground sm:col-span-2">
          {t("pilotSignup.notes")}
          <Textarea
            maxLength={1000}
            value={values.notes}
            onChange={(event) => updateValue("notes", event.target.value)}
          />
        </label>
      </div>

      <div className="space-y-4 rounded-xl border border-foreground/10 p-4">
        {renderCheckbox(
          "termsAccepted",
          <>
            {t("pilotSignup.termsPrefix")}{" "}
            <Link to="/terms" className="font-semibold text-primary underline underline-offset-4">
              {t("pilotSignup.termsLink")}
            </Link>
            . {t("pilotSignup.termsSuffix")}
          </>,
          false,
          true,
        )}
        {isTangoProgram && (
          <div className="space-y-4 border-t border-foreground/10 pt-4">
            {renderCheckbox("tangoOptIn", t("pilotSignup.tangoOptIn"))}
            <p className="pl-7 text-xs text-muted-foreground">
              {t("pilotSignup.tangoConsentNote")}
            </p>
            {renderCheckbox(
              "mediaConsent",
              t("pilotSignup.mediaConsent"),
              !values.tangoOptIn,
              values.tangoOptIn,
            )}
            {renderCheckbox(
              "brandingConsent",
              t("pilotSignup.brandingConsent"),
              !values.tangoOptIn,
              values.tangoOptIn,
            )}
          </div>
        )}
      </div>

      <input
        aria-hidden="true"
        autoComplete="off"
        className="hidden"
        name="website"
        tabIndex={-1}
        value={values.website}
        onChange={(event) => updateValue("website", event.target.value)}
      />
      {status && (
        <p
          role={status.kind === "error" ? "alert" : "status"}
          className={status.kind === "error" ? "text-sm text-danger" : "text-sm text-success"}
        >
          {status.message}
        </p>
      )}
      {status?.kind === "success" && (
        <div className="flex flex-wrap gap-4 text-sm">
          <a
            href={EXTERNAL_LINKS.calendly}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-primary underline underline-offset-4"
          >
            {t("pilotSignup.successCalendly")}
          </a>
          <Link to="/terms" className="font-semibold text-primary underline underline-offset-4">
            {t("pilotSignup.successTerms")}
          </Link>
        </div>
      )}
      {status?.kind === "error" && status.canContactJean && (
        <a
          href={EXTERNAL_LINKS.jeanWhatsapp}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-sm font-medium text-primary underline underline-offset-4"
        >
          {t("pilotSignup.contactJean")}
        </a>
      )}
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? t("pilotSignup.submitting") : t("lisbonPilot.cta")}
      </button>
      </fieldset>
    </form>
  );
};
