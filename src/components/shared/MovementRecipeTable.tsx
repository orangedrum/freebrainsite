import { useTranslation } from "react-i18next";
import { Clock, Activity, Timer, Repeat } from "lucide-react";

const RECIPE_ROWS = [
  { mins: 3, nameKey: "movementPlanner.recipe.warmUp" },
  { mins: 5, nameKey: "movementPlanner.recipe.dance" },
  { mins: 2, nameKey: "movementPlanner.recipe.stretch" },
];

export const MovementRecipeTable = () => {
  const { t } = useTranslation();
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-2 flex flex-col overflow-x-auto">
        <table className="w-full flex-1 border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-secondary px-3 py-2 text-left font-semibold text-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {t("movementPlanner.recipe.howLong")}
                </span>
              </th>
              <th className="border border-secondary px-3 py-2 text-left font-semibold text-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Activity className="h-4 w-4" /> {t("movementPlanner.recipe.activityType")}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {RECIPE_ROWS.map((row, i) => (
              <tr key={i}>
                <td className="border border-secondary px-3 py-2 text-foreground/90">{row.mins} Mins</td>
                <td className="border border-secondary px-3 py-2 text-foreground/90">{t(row.nameKey)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:col-span-1 flex flex-col gap-3">
        <div className="flex flex-1 items-center gap-4 rounded-xl border border-secondary p-4">
          <Timer className="h-8 w-8 shrink-0 text-foreground" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
              {t("movementPlanner.recipe.totalTime")}
            </p>
            <p className="text-2xl font-bold text-foreground">10 Mins</p>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-4 rounded-xl border border-secondary p-4">
          <Repeat className="h-8 w-8 shrink-0 text-foreground" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
              {t("movementPlanner.recipe.frequency")}
            </p>
            <p className="text-2xl font-bold text-foreground">{t("movementPlanner.recipe.daily")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
