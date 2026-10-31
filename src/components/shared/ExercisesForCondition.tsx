import { useTranslation } from "react-i18next";
import { Home, Brain, Rocket, Building2 } from "lucide-react";

const CONDITIONS = [
  { id: "alzheimers", icon: Home, key: "movementPlanner.conditions.alzheimers" },
  { id: "essentialTremor", icon: Brain, key: "movementPlanner.conditions.essentialTremor" },
  { id: "cognitiveImpairments", icon: Rocket, key: "movementPlanner.conditions.cognitiveImpairments" },
  { id: "als", icon: Building2, key: "movementPlanner.conditions.als" },
  { id: "cerebrovascularDisease", icon: Home, key: "movementPlanner.conditions.cerebrovascularDisease" },
  { id: "huntingtonsDisease", icon: Brain, key: "movementPlanner.conditions.huntingtonsDisease" },
  { id: "multipleSclerosis", icon: Rocket, key: "movementPlanner.conditions.multipleSclerosis" },
  { id: "epilepsy", icon: Building2, key: "movementPlanner.conditions.epilepsy" },
  { id: "spinaBifida", icon: Home, key: "movementPlanner.conditions.spinaBifida" },
  { id: "dystonias", icon: Brain, key: "movementPlanner.conditions.dystonias" },
  { id: "dementia", icon: Rocket, key: "movementPlanner.conditions.dementia" },
  { id: "cerebralPalsy", icon: Building2, key: "movementPlanner.conditions.cerebralPalsy" },
  { id: "diabeticNeuropathy", icon: Home, key: "movementPlanner.conditions.diabeticNeuropathy" },
  { id: "migraines", icon: Brain, key: "movementPlanner.conditions.migraines" },
  { id: "parkinsonsDisease", icon: Rocket, key: "movementPlanner.conditions.parkinsonsDisease" },
];

export const ExercisesForCondition = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h3 className="text-xl font-bold text-foreground">{t("movementPlanner.exercisesForConditionTitle")}</h3>
      <div className="mt-2 flex gap-3 overflow-x-auto pb-2">
        {CONDITIONS.map((c) => (
          <div key={c.id} className="flex shrink-0 items-stretch rounded-xl border border-white bg-secondary/30 overflow-hidden">
            <div className="flex items-center justify-center px-3">
              <c.icon className="h-6 w-6 text-foreground" />
            </div>
            <div className="flex flex-col justify-center px-4 py-2">
              <span className="whitespace-nowrap text-sm font-bold text-foreground">{t(c.key)}</span>
              <span className="text-xs text-muted-foreground">{t("movementPlanner.exercise")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
