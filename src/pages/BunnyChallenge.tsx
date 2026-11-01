import { useState } from "react";
import { Helmet } from "react-helmet-async";
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
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Modal } from "@/components/shared/Modal";
import { useModalState } from "@/hooks/useModalState";

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

            <section
              aria-labelledby="bunny-challenge-preview"
              className="rounded-2xl border border-foreground/10 bg-secondary p-6 md:p-8"
            >
              <h2 id="bunny-challenge-preview" className="text-xl font-bold text-foreground">
                {t("bunnyChallenge.previewTitle")}
              </h2>
              <p className="mt-2 text-foreground/90">{t("bunnyChallenge.simultaneousNotice")}</p>
              <div className="mt-6 grid grid-cols-2 gap-4 md:gap-8">
                <figure className="flex flex-col items-center gap-3 rounded-xl bg-background/70 p-4 text-center">
                  <img
                    src="/handgesture_bunny.svg"
                    alt={t("bunnyChallenge.pose1Alt")}
                    className="h-28 w-28 object-contain motion-safe:animate-pulse motion-reduce:animate-none md:h-36 md:w-36"
                  />
                  <figcaption className="font-semibold text-foreground">
                    {t("bunnyChallenge.pose1Label")}
                  </figcaption>
                </figure>
                <figure className="flex flex-col items-center gap-3 rounded-xl bg-background/70 p-4 text-center">
                  <img
                    src="/handgesture_gun.svg"
                    alt={t("bunnyChallenge.pose2Alt")}
                    className="h-28 w-28 object-contain motion-safe:animate-pulse motion-reduce:animate-none md:h-36 md:w-36"
                  />
                  <figcaption className="font-semibold text-foreground">
                    {t("bunnyChallenge.pose2Label")}
                  </figcaption>
                </figure>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">{t("bunnyChallenge.previewOnly")}</p>
            </section>

            <section id="challenge-facts" aria-labelledby="bunny-challenge-facts">
              <h2 id="bunny-challenge-facts" className="text-xl font-bold text-foreground">
                {t("bunnyChallenge.factsTitle")}
              </h2>
              <p className="mt-2 text-foreground/90">{t("bunnyChallenge.factsBody")}</p>
            </section>

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

            <section aria-labelledby="bunny-challenge-faq">
              <h2 id="bunny-challenge-faq" className="text-xl font-bold text-foreground">
                {t("bunnyChallenge.faqTitle")}
              </h2>
              <dl className="mt-4 space-y-4">
                {FAQ_ITEMS.map(({ questionKey, answerKey }) => (
                  <div key={questionKey} className="rounded-xl bg-secondary p-4">
                    <dt className="font-semibold text-foreground">{t(questionKey)}</dt>
                    <dd className="mt-1 text-sm text-foreground/90">{t(answerKey)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </section>
      </main>
      <Footer />
      <Modal config={modalConfig} onOpenChange={(open) => { if (!open) closeModal(); }} />
    </div>
  );
};

export default BunnyChallenge;
