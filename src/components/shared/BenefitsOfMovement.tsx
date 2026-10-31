import { useTranslation } from "react-i18next";
import { Brain, Heart, Zap, Shield, Clock, Users } from "lucide-react";

const BENEFITS = [
  { icon: Brain, key: "movementPlanner.benefits.neuroplasticity" },
  { icon: Heart, key: "movementPlanner.benefits.balance" },
  { icon: Zap, key: "movementPlanner.benefits.energy" },
  { icon: Shield, key: "movementPlanner.benefits.safety" },
  { icon: Clock, key: "movementPlanner.benefits.consistency" },
  { icon: Users, key: "movementPlanner.benefits.caregiver" },
];

export const BenefitsOfMovement = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h3 className="text-xl font-bold text-foreground">{t("movementPlanner.benefitsTitle")}</h3>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {BENEFITS.map((b, i) => {
          const text = t(b.key);
          const parts = text.split("—");
          return (
            <div key={i} className="flex items-start gap-3 rounded-sm bg-secondary shadow-md p-4">
              <b.icon className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
              <p className="text-sm text-foreground/90">
                {parts.length > 1 ? (
                  <>
                    <strong>{parts[0]}—</strong>
                    {parts.slice(1).join("—")}
                  </>
                ) : (
                  text
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
