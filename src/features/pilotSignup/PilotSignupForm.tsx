import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { EXTERNAL_LINKS } from "@/lib/constants";
import { PilotSignupFields } from "./PilotSignupFields";
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
  | { kind: "error"; message: string }
  | null;

const initialValues: SignupFormValues = {
  fullName: "",
  email: "",
  phone: "",
  contactMethod: "",
  title: "",
  institution: "",
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
        });
        return;
      }

      setStatus({ kind: "success", message: t("pilotSignup.success") });
    } catch {
      setStatus({
        kind: "error",
        message: t("pilotSignup.errors.network"),
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
        <PilotSignupFields values={values} updateValue={updateValue} />
        <div className="space-y-4 rounded-xl border border-foreground/10 p-4">
        {renderCheckbox(
          "termsAccepted",
          <>
            {t("pilotSignup.termsPrefix")}{" "}
            <Link
              to="/terms"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primary underline underline-offset-4"
            >
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
          <Link
            to="/terms"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-primary underline underline-offset-4"
          >
            {t("pilotSignup.successTerms")}
          </Link>
        </div>
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
