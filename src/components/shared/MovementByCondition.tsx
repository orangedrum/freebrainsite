import { useTranslation } from "react-i18next";

const CONDITIONS = ["alzheimers", "essentialTremor", "cognitiveImpairments", "als", "cerebrovascularDisease", "huntingtonsDisease", "multipleSclerosis", "epilepsy", "spinaBifida", "dystonias", "dementia", "cerebralPalsy", "diabeticNeuropathy", "migraines", "parkinsonsDisease"];

export const MovementByCondition = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground">{t("movements.movementByConditionTitle")}</h2>
      <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CONDITIONS.map((c) => (
          <div key={c} className="rounded-xl border border-foreground/10 bg-secondary/20 p-4">
            <h3 className="text-sm font-semibold text-foreground">{t(`movementPlanner.conditions.${c}`)}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{t(`movements.conditionDescriptions.${c}`)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
