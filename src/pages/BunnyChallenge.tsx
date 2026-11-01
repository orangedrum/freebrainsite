import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, FlaskConical, X } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Modal } from "@/components/shared/Modal";
import { ExercisesForCondition } from "@/components/shared/ExercisesForCondition";
import { useModalState } from "@/hooks/useModalState";
import { BunnyChallengeGame } from "@/features/bunnyChallenge/BunnyChallengeGame";

const FAQ_ITEMS = [
  { questionKey: "bunnyChallenge.faq.q1", answerKey: "bunnyChallenge.faq.a1" },
  { questionKey: "bunnyChallenge.faq.q2", answerKey: "bunnyChallenge.faq.a2" },
  { questionKey: "bunnyChallenge.faq.q3", answerKey: "bunnyChallenge.faq.a3" },
  { questionKey: "bunnyChallenge.faq.q4", answerKey: "bunnyChallenge.faq.a4" },
];

const BunnyChallenge = () => {
  const { t } = useTranslation();
  const { modalConfig, openModal, closeModal } = useModalState();
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);

  const faqStructuredData = FAQ_ITEMS.map(({ questionKey, answerKey }) => ({
    "@type": "Question",
    name: t(questionKey),
    acceptedAnswer: { "@type": "Answer", text: t(answerKey) },
  }));

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
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqStructuredData,
          })}
        </script>
      </Helmet>
      <Header onOpenModal={openModal} />
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
                        to="/movement-planner#"
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

            <header className="space-y-2">
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

            <section className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-secondary p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {t("bunnyChallenge.pickMovementTitle")}
                </h2>
                <p className="mt-2 max-w-3xl text-sm text-foreground/90">
                  {t("bunnyChallenge.pickMovementBody")}
                </p>
              </div>
              <Button asChild className="shrink-0">
                <Link to="/movements">
                  {t("bunnyChallenge.pickMovementCta")}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </section>

            <section
              aria-labelledby="bunny-challenge-science"
              className="rounded-2xl border border-foreground/10 bg-secondary p-5 sm:p-6"
            >
              <div className="flex items-center gap-3">
                <FlaskConical className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                <h2 id="bunny-challenge-science" className="text-xl font-bold text-foreground">
                  {t("bunnyChallenge.scienceTitle")}
                </h2>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {t("bunnyChallenge.scienceMechanismTitle")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                {t("bunnyChallenge.scienceMechanismBody")}
              </p>
            </section>

            <section aria-labelledby="bunny-challenge-faq">
              <h2 id="bunny-challenge-faq" className="text-xl font-bold text-foreground">
                {t("bunnyChallenge.faqTitle")}
              </h2>
              <Accordion type="multiple" className="mt-2 w-full">
                {FAQ_ITEMS.map(({ questionKey, answerKey }, index) => (
                  <AccordionItem
                    key={questionKey}
                    value={`bunny-challenge-faq-${index + 1}`}
                    className="mb-2 overflow-hidden rounded-sm bg-secondary shadow-md transition-colors hover:bg-secondary/70"
                  >
                    <AccordionTrigger className="px-4 text-left text-base font-semibold text-foreground hover:no-underline">
                      {t(questionKey)}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 text-sm text-foreground/90">
                      {t(answerKey)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <ExercisesForCondition />
          </div>
        </section>
      </main>
      <Footer />
      <Modal config={modalConfig} onOpenChange={(open) => { if (!open) closeModal(); }} />
    </div>
  );
};

export default BunnyChallenge;
