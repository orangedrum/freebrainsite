import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FlaskConical, X } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ExercisesForCondition } from "@/components/shared/ExercisesForCondition";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { FaqJsonLd } from "@/components/shared/FaqJsonLd";
import { ResearchCitation } from "@/components/shared/ResearchCitation";
import { MovementPlannerPromoCard } from "@/components/shared/MovementPlannerPromoCard";
import { BunnyChallengeGame } from "@/features/bunnyChallenge/BunnyChallengeGame";

const FAQ_ITEMS = [
  { questionKey: "bunnyChallenge.faq.q1", answerKey: "bunnyChallenge.faq.a1" },
  { questionKey: "bunnyChallenge.faq.q2", answerKey: "bunnyChallenge.faq.a2" },
  { questionKey: "bunnyChallenge.faq.q3", answerKey: "bunnyChallenge.faq.a3" },
  { questionKey: "bunnyChallenge.faq.q4", answerKey: "bunnyChallenge.faq.a4" },
];

const BunnyChallenge = () => {
  const { t } = useTranslation();
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Helmet>
        <title>{t("bunnyChallenge.metaTitle")}</title>
        <meta name="description" content={t("bunnyChallenge.metaDescription")} />
        <link rel="canonical" href="https://www.freethebrains.com/bunny-challenge" />
        <meta property="og:title" content={t("bunnyChallenge.metaTitle")} />
        <meta property="og:description" content={t("bunnyChallenge.metaDescription")} />
        <meta property="og:url" content="https://www.freethebrains.com/bunny-challenge" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={t("bunnyChallenge.metaTitle")} />
        <meta name="twitter:description" content={t("bunnyChallenge.metaDescription")} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t("bunnyChallenge.title"),
            url: "https://www.freethebrains.com/bunny-challenge",
            description: t("bunnyChallenge.metaDescription"),
          })}
        </script>
      </Helmet>
      <FaqJsonLd items={FAQ_ITEMS} />
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden py-10 md:py-16">
          <div className="container mx-auto space-y-8 px-4 md:px-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">{t("breadcrumb.home")}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{t("bunnyChallenge.title")}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {!isAlertDismissed && (
              <div className="relative">
                <Alert className="border-warning bg-background shadow-md">
                  <AlertDescription className="pr-10 text-sm text-foreground/90">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <p>{t("movementPlanner.disclaimer")}</p>
                      <Link
                        to="/terms"
                        className="relative z-10 ml-auto text-[0.7em] font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
                      >
                        {t("movementPlanner.disclaimerFull")}
                      </Link>
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

            <ResearchCitation />

            <header id="bunny-escape-challenge" className="scroll-mt-24 space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("bunnyChallenge.title")}
              </h1>
              <p className="text-lg text-muted-foreground">{t("bunnyChallenge.subtitle")}</p>
            </header>

            <BunnyChallengeGame />

            <section aria-labelledby="bunny-challenge-how-to" className="space-y-3">
              <h2 id="bunny-challenge-how-to" className="text-xl font-bold text-foreground">
                {t("bunnyChallenge.howToTitle")}
              </h2>
              <ol className="list-decimal space-y-2 pl-6 text-foreground/90">
                {[1, 2, 3].map((step) => (
                  <li key={step}>{t(`bunnyChallenge.howToStep${step}`)}</li>
                ))}
              </ol>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
              <article className="rounded-2xl border border-foreground/10 p-6">
                <h2 className="text-lg font-bold text-foreground">
                  {t("bunnyChallenge.timerTitle")}
                </h2>
                <p className="mt-2 text-sm text-foreground/90">{t("bunnyChallenge.timerBody")}</p>
              </article>
              <article className="rounded-2xl border border-foreground/10 p-6">
                <h2 className="text-lg font-bold text-foreground">
                  {t("bunnyChallenge.recordingTitle")}
                </h2>
                <p className="mt-2 text-sm text-foreground/90">
                  {t("bunnyChallenge.recordingBody")}
                </p>
              </article>
            </section>

            <MovementPlannerPromoCard
              href="/#platform"
              description={t("bunnyChallenge.pickMovementBody")}
            />

            <section
              aria-labelledby="bunny-challenge-science"
              className="space-y-3"
            >
              <div className="flex items-center gap-3">
                <FlaskConical className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                <h2 id="bunny-challenge-science" className="text-xl font-bold text-foreground">
                  {t("bunnyChallenge.scienceMechanismTitle")}
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                <a
                  href="https://en.wikipedia.org/wiki/Neurobiological_effects_of_physical_exercise"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("bunnyChallenge.citationLabel", { number: 1 })}
                  className="underline underline-offset-2"
                >
                  [1]
                </a>{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Neuroplasticity"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("bunnyChallenge.citationLabel", { number: 2 })}
                  className="underline underline-offset-2"
                >
                  [2]
                </a>{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Brain-derived_neurotrophic_factor"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("bunnyChallenge.citationLabel", { number: 3 })}
                  className="underline underline-offset-2"
                >
                  [3]
                </a>
              </p>
              <p className="text-sm leading-relaxed text-foreground/90">
                {t("bunnyChallenge.scienceMechanismBody")}
              </p>
              <h3 className="pt-2 text-lg font-semibold text-foreground">
                {t("bunnyChallenge.neuroplasticityTitle")}
              </h3>
              <p className="text-sm leading-relaxed text-foreground/90">
                {t("bunnyChallenge.neuroplasticityBody")}
              </p>
            </section>

            <section aria-labelledby="bunny-challenge-faq">
              <h2 id="bunny-challenge-faq" className="text-xl font-bold text-foreground">
                {t("bunnyChallenge.faqTitle")}
              </h2>
              <FaqAccordion
                items={FAQ_ITEMS.map(({ questionKey, answerKey }, index) => ({
                  id: `bunny-challenge-faq-${index + 1}`,
                  question: t(questionKey),
                  answer: t(answerKey),
                }))}
              />
            </section>

            <ExercisesForCondition />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BunnyChallenge;
