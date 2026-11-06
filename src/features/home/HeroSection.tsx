import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";
import type { OpenModalFn } from "@/types";
import { scrollToSection } from "@/lib/navigation";
import { EXTERNAL_LINKS } from "@/lib/constants";
import { GridBackground } from "@/components/shared/GridBackground";

interface HeroSectionProps {
  onOpenModal: OpenModalFn;
}

/** Hero section with headline, subheadline, and dual CTAs. */
export const HeroSection = ({ onOpenModal }: HeroSectionProps) => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden py-20 md:py-32 lg:py-40 z-0">
      <GridBackground />
      <div className="container relative mx-auto px-4 md:px-6 text-center z-10">
        <div className="inline-flex items-center rounded-full border border-foreground bg-foreground/5 px-3 py-1 text-sm font-medium mb-8 text-foreground">
          {t("hero.presentedBy")}
        </div>
        {/* Single, keyword-bearing H1. The second line is part of the H1 so search
            engines and AI crawlers see "movement therapy" + condition keywords in
            the page's primary heading, not just the brand phrase. */}
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
          <span className="block">
            {t("hero.headlinePre")}{" "}
            <span className="text-brand-pink">{t("hero.headlineHighlight")}</span>
          </span>
          <span className="mt-4 block text-lg font-semibold text-muted-foreground sm:text-xl md:text-2xl">
            {t("hero.headlineDescriptor")}
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          {t("hero.subheadline")}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto h-12 px-8 border-0 bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
          >
            <Link to="/bunny-challenge#bunny-escape-challenge">{t("header.tryBunnyDemo")}</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto h-12 px-8 border-foreground/20 text-foreground hover:bg-foreground/10"
            onClick={() =>
              onOpenModal(
                t("modal.joinPilot.title"),
                t("modal.joinPilot.description"),
                Rocket,
                t("modal.joinPilot.cta"),
                EXTERNAL_LINKS.pilotForm,
              )
            }
          >
            {t("hero.joinPilot")}
          </Button>
        </div>
        <a
          href="#platform"
          onClick={(event) => {
            event.preventDefault();
            scrollToSection("platform");
          }}
          className="mt-5 inline-block text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        >
          {t("hero.learnMore")}
        </a>
      </div>
    </section>
  );
};
