import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import type { SignupFormValues } from "./pilotSignupFormUtils";

interface PilotSignupFieldsProps {
  values: SignupFormValues;
  updateValue: <K extends keyof SignupFormValues>(
    key: K,
    value: SignupFormValues[K],
  ) => void;
}

export const PilotSignupFields = ({ values, updateValue }: PilotSignupFieldsProps) => {
  const { t } = useTranslation();

  return (
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
        {t("pilotSignup.contactMethod")}
        <select
          required
          value={values.contactMethod}
          onChange={(event) => updateValue("contactMethod", event.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">{t("pilotSignup.contactMethodPlaceholder")}</option>
          <option value="whatsapp">{t("pilotSignup.contactMethods.whatsapp")}</option>
          <option value="text">{t("pilotSignup.contactMethods.text")}</option>
        </select>
      </label>
      <label className="space-y-2 text-sm font-medium text-foreground">
        {t("pilotSignup.phone")}
        <Input
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          minLength={7}
          maxLength={24}
          pattern="\\+?[0-9][0-9 ().-]*[0-9]"
          placeholder="+351 912 345 678"
          required
          value={values.phone}
          onChange={(event) => updateValue("phone", event.target.value)}
        />
      </label>
      <label className="space-y-2 text-sm font-medium text-foreground">
        {t("pilotSignup.title")}
        <Input
          autoComplete="organization-title"
          maxLength={120}
          value={values.title}
          onChange={(event) => updateValue("title", event.target.value)}
        />
      </label>
      <label className="space-y-2 text-sm font-medium text-foreground">
        {t("pilotSignup.institution")}
        <Input
          autoComplete="organization"
          maxLength={180}
          value={values.institution}
          onChange={(event) => updateValue("institution", event.target.value)}
        />
      </label>
    </div>
  );
};
