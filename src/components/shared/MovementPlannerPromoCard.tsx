import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MovementPlannerPromoCardProps {
  description: ReactNode;
  href: string;
}

export const MovementPlannerPromoCard = ({
  description,
  href,
}: MovementPlannerPromoCardProps) => {
  const { t } = useTranslation();

  return (
    <section className="rounded-3xl border border-primary/20 bg-primary/10 p-6 shadow-md md:p-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-9">
          <h2 className="text-xl font-bold text-primary">
            {t("movementPlanner.pickMovementTitle")}
          </h2>
          <p className="text-xs text-foreground/90">{description}</p>
        </div>
        <div className="md:col-span-3">
          <Button
            asChild
            variant="ghost"
            className="mt-4 w-full border border-primary bg-transparent text-primary shadow-none hover:bg-transparent hover:text-primary"
          >
            <Link to={href}>{t("movementPlanner.pickMovementCta")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
