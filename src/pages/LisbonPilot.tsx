import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GridBackground } from "@/components/shared/GridBackground";
import { VideoPlayer } from "@/components/shared/VideoPlayer";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { FaqJsonLd } from "@/components/shared/FaqJsonLd";
import { PilotSignupForm } from "@/features/pilotSignup/PilotSignupForm";
import { isTangoSignup } from "@/features/pilotSignup/pilotSignupFormUtils";
import { scrollToSection } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

const LISBON_FAQ_ITEMS = [
  { id: "eligibility", questionKey: "lisbonPilot.faq.eligibilityQuestion", answerKey: "lisbonPilot.faq.eligibilityAnswer" },
  { id: "sessions", questionKey: "lisbonPilot.faq.sessionsQuestion", answerKey: "lisbonPilot.faq.sessionsAnswer" },
  { id: "treatment", questionKey: "lisbonPilot.faq.treatmentQuestion", answerKey: "lisbonPilot.faq.treatmentAnswer" },
  { id: "signup", questionKey: "lisbonPilot.faq.signupQuestion", answerKey: "lisbonPilot.faq.signupAnswer" },
];

/** Lisbon movement pilot page — FreeBrain styles, tango workshops for Parkinson's. */
const LisbonPilot = () => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const isTangoProgram = isTangoSignup(search);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Helmet>
        <title>{t("lisbonPilot.seoTitle")}</title>
        <meta name="description" content={t("lisbonPilot.seoDescription")} />
        <link rel="canonical" href="https://www.freethebrains.com/lisbon-pilot" />
        <meta property="og:title" content={t("lisbonPilot.seoTitle")} />
        <meta property="og:description" content={t("lisbonPilot.seoDescription")} />
        <meta property="og:url" content="https://www.freethebrains.com/lisbon-pilot" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.freethebrains.com/medworkshopimg.jpeg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("lisbonPilot.seoTitle")} />
        <meta name="twitter:description" content={t("lisbonPilot.seoDescription")} />
        <meta name="twitter:image" content="https://www.freethebrains.com/medworkshopimg.jpeg" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t("lisbonPilot.seoTitle"),
            description: t("lisbonPilot.seoDescription"),
            url: "https://www.freethebrains.com/lisbon-pilot",
            primaryImageOfPage: {
              "@type": "ImageObject",
              url: "https://www.freethebrains.com/medworkshopimg.jpeg",
            },
            publisher: {
              "@type": "Organization",
              name: "FreeBrain",
              url: "https://www.freethebrains.com/",
            },
          })}
        </script>
      </Helmet>
      <FaqJsonLd items={LISBON_FAQ_ITEMS} />
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 md:py-32 z-0">
          <img
            src="/medworkshopimg.jpeg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-[50%_40%]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-background/85" />
          <GridBackground />
          <div className="container relative mx-auto px-4 md:px-6 z-10">
            <SectionHeading
              title={t("lisbonPilot.heroTitle")}
              subtitle={t("lisbonPilot.heroSubtitle")}
              headingLevel={1}
              className="!mb-8"
            />
            <div className="-mt-2 text-center">
              <Button
                asChild
                size="lg"
                className="h-12 border-0 bg-primary px-8 text-primary-foreground shadow-md hover:bg-primary/90"
              >
                <a
                  href="#next-step"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection("next-step");
                  }}
                >
                  {t("lisbonPilot.signUp")}
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-12">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-8">
            <div className="grid gap-8 md:grid-cols-2 md:items-start">
              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <h2 className="text-lg font-bold tracking-tight text-foreground md:text-xl">
                    {t("lisbonPilot.introTitle")}
                  </h2>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    {t("lisbonPilot.introBody")}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold tracking-tight text-foreground md:text-xl">
                    {t("lisbonPilot.whyTitle")}
                  </h4>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {t("lisbonPilot.whyBody")}
                  </p>
                </div>
              </div>

              <div className="flex justify-center md:justify-end">
                <VideoPlayer src="/tangoworkshop.mp4" poster="/tangoworkshop.png" />
              </div>
            </div>

            <div className="space-y-3 pb-4">
              <SectionHeading title={t("lisbonPilot.howTitle")} className="!mb-6" />
              <ol className="space-y-3">
                {[
                  { n: "1", label: t("lisbonPilot.step1") },
                  { n: "2", label: t("lisbonPilot.step2") },
                  { n: "3", label: t("lisbonPilot.step3") },
                ].map((step) => (
                  <li
                    key={step.n}
                    className="relative rounded-2xl bg-secondary border border-foreground/10 p-6 pl-16"
                  >
                    <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-foreground text-sm font-bold">
                      {step.n}
                    </span>
                    <span className="text-sm text-muted-foreground">{step.label}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-3 pb-4">
              <SectionHeading title={t("lisbonPilot.appTitle")} className="!mb-6" />
              <p className="text-muted-foreground leading-relaxed">{t("lisbonPilot.appBody")}</p>
            </div>

            <div className="space-y-3">
              <SectionHeading title={t("lisbonPilot.summitTitle")} className="!mb-6" />
              <p className="text-muted-foreground leading-relaxed">{t("lisbonPilot.summitBody")}</p>
              <img
                src="/aiGenerated_websummitfreebrainbooth.jpeg"
                alt={t("lisbonPilot.summitPhotoAlt")}
                loading="lazy"
                className="w-full aspect-video object-cover rounded-2xl border border-foreground/10"
              />
            </div>
          </div>
        </section>

        <section className="py-10 md:py-12">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl grid gap-8 md:grid-cols-2 md:items-start">
            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {t("lisbonPilot.offerTitle")}
              </h2>
              <div className="rounded-2xl bg-secondary border border-foreground/10 p-6">
                <ul className="space-y-2 text-sm text-muted-foreground list-disc marker:text-brand-accent pl-5">
                  <li>{t("lisbonPilot.offer1")}</li>
                  <li>{t("lisbonPilot.offer2")}</li>
                  <li>{t("lisbonPilot.offer3")}</li>
                  <li>{t("lisbonPilot.offer4")}</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {t("lisbonPilot.askTitle")}
              </h2>
              <div className="rounded-2xl bg-secondary border border-foreground/10 p-6">
                <ul className="space-y-2 text-sm text-muted-foreground list-disc marker:text-brand-accent pl-5">
                  <li>{t("lisbonPilot.ask1")}</li>
                  <li>{t("lisbonPilot.ask2")}</li>
                  <li>{t("lisbonPilot.ask3")}</li>
                  <li>{t("lisbonPilot.ask4")}</li>
                  <li>{t("lisbonPilot.ask5")}</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {t("lisbonPilot.safetyTitle")}
              </h2>
              <div className="rounded-2xl bg-secondary border border-foreground/10 p-6 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("lisbonPilot.safetyBody")}
                </p>
                <p className="text-sm text-muted-foreground">{t("lisbonPilot.safetyNote")}</p>
              </div>
            </div>

            <div
              id="next-step"
              className="md:col-span-2 rounded-2xl bg-secondary border border-foreground/10 p-8 space-y-4"
            >
              <h2 className="text-xl font-bold text-foreground">{t("lisbonPilot.nextTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t(isTangoProgram ? "lisbonPilot.nextBodyTango" : "lisbonPilot.nextBody")}
              </p>
              <PilotSignupForm isTangoProgram />
            </div>
          </div>
        </section>
        <section className="container mx-auto max-w-4xl px-4 pb-16 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {t("lisbonPilot.faq.title")}
          </h2>
          <FaqAccordion
            items={LISBON_FAQ_ITEMS.map(({ id, questionKey, answerKey }) => ({
              id,
              question: t(questionKey),
              answer: t(answerKey),
            }))}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LisbonPilot;
