import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Activity, ChevronDown, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const RESOURCES = [
  {
    href: "/movement-planner",
    icon: ClipboardList,
    titleKey: "header.movementPlanner",
    descriptionKey: "header.movementPlannerDescription",
  },
  {
    href: "/movements",
    icon: Activity,
    titleKey: "header.exerciseFinder",
    descriptionKey: "header.exerciseFinderDescription",
  },
];

const ResourceLinkContent = ({
  resource,
}: {
  resource: (typeof RESOURCES)[number];
}) => {
  const { t } = useTranslation();
  const Icon = resource.icon;

  return (
    <>
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <span className="min-w-0">
        <span className="block text-foreground">{t(resource.titleKey)}</span>
        <span className="mt-1 block text-xs leading-snug text-muted-foreground">
          {t(resource.descriptionKey)}
        </span>
      </span>
    </>
  );
};

export const ResourcesMenu = () => {
  const { t } = useTranslation();
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  return (
    <>
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="h-10 bg-transparent text-foreground hover:bg-foreground/10 hover:text-foreground focus:bg-foreground/10 data-[state=open]:bg-foreground/10">
              {t("header.resources")}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[min(90vw,420px)] gap-2 p-2">
                {RESOURCES.map((resource) => (
                  <li key={resource.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={resource.href}
                        className="flex gap-3 rounded-md border border-transparent p-3 transition-colors hover:border-foreground/20 hover:bg-background"
                      >
                        <ResourceLinkContent resource={resource} />
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="lg:hidden">
        <Button
          variant="ghost"
          className="w-full justify-between px-0 text-foreground hover:bg-transparent hover:text-primary"
          aria-expanded={isMobileExpanded}
          onClick={() => setIsMobileExpanded((isExpanded) => !isExpanded)}
        >
          {t("header.resources")}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isMobileExpanded ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </Button>
        {isMobileExpanded && (
          <div className="flex flex-col gap-3 border-l border-foreground/20 py-2 pl-4">
            {RESOURCES.map((resource) => (
              <Link
                key={resource.href}
                to={resource.href}
                className="flex gap-3 rounded-md border border-transparent p-3 transition-colors hover:border-foreground/20 hover:bg-background"
                onClick={() => setIsMobileExpanded(false)}
              >
                <ResourceLinkContent resource={resource} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
