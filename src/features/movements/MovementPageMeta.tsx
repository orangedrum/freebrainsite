import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ResearchCitation } from "@/components/shared/ResearchCitation";

export const MovementPageMeta = () => {
  const { t } = useTranslation();
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">{t("breadcrumb.home")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("movements.title")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {!isAlertDismissed && (
        <div className="relative">
          <Alert className="border-warning bg-background shadow-md">
            <AlertDescription className="pr-10 text-sm text-foreground/90">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <p>{t("movementPlanner.disclaimer")}</p>
                <a
                  href="/movement-planner#"
                  className="relative z-10 ml-auto text-[0.7em] font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  {t("movementPlanner.disclaimerFull")}
                </a>
              </div>
            </AlertDescription>
          </Alert>
          <button
            type="button"
            onClick={() => setIsAlertDismissed(true)}
            aria-label={t("movementPlanner.alert.close")}
            className="absolute right-3 top-3 rounded-full p-1 text-foreground transition-colors hover:bg-foreground/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <ResearchCitation href="#movement-research" />
    </div>
  );
};
