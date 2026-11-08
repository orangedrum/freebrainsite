import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { HeartHandshake } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GridBackground } from "@/components/shared/GridBackground";
import { StoryVideo } from "@/features/about/StoryVideo";
import {
  AnnouncementDialog,
  CentroAnnouncementCard,
} from "@/components/shared/Announcements";
import { MovementPageMeta } from "@/features/movements/MovementPageMeta";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { EXTERNAL_LINKS } from "@/lib/constants";

const PAGE_URL = "https://www.freethebrains.com/about";

/**
 * Every link on this page is white: `--background` is brand blue (#3F3CD5),
 * so the design system's `text-brand` blue renders blue-on-blue and vanishes.
 */
const LINK_CLASS =
  "font-medium text-foreground underline underline-offset-4 transition-colors hover:text-foreground/80";

const CITATIONS = [
  {
    href: "https://www.bmj.com/content/384/bmj-2023-075847",
    text: "Noetel et al., 2024 — Effect of exercise for depression: systematic review and network meta-analysis. The BMJ 384:e075847.",
  },
  {
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4636067/",
    text: "Lötzke, Ostermann & Büssing, 2015 — Argentine tango in Parkinson disease: a systematic review and meta-analysis. BMC Neurology 15:226.",
  },
];

/**
 * Closing CTA pair shared by both tabs: the white "Join Pilot" goes straight
 * to the participation form; the blue "Get Involved" lands on the home page's
 * get-involved section (the same target as the footer).
 */
const StoryCtas = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
      <Button asChild size="lg" className="h-12 px-8 shadow-md">
        <a
          href={EXTERNAL_LINKS.pilotForm}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("hero.joinPilot")}
        </a>
      </Button>
      <Button
        asChild
        size="lg"
        variant="secondary"
        className="h-12 border border-foreground/20 px-8 shadow-md"
      >
        <Link to="/#get-involved">{t("header.getInvolved")}</Link>
      </Button>
    </div>
  );
};

/**
 * About page — founder story in the founder's own words, with headlines and
 * metadata carrying the long-tail buckets from docs/growth-strategy.md.
 * Two tabs: "What is FreeBrain" (evidence, audiences, caregiver activities,
 * FAQs) and "Our Story" (the founder narrative). Both panels stay mounted so
 * crawlers and tests see the full page. Fully localized in en/es/de/pt.
 */
const About = () => {
  const { t } = useTranslation();
  const [storyAnnouncementOpen, setStoryAnnouncementOpen] = useState(false);

  const pageTitle = t("about.title");
  const pageDescription = t("about.description");

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jean",
    jobTitle: t("about.personJobTitle"),
    description: t("about.personDescription"),
    worksFor: {
      "@type": "Organization",
      name: "FreeBrain",
      url: "https://www.freethebrains.com/",
    },
    url: PAGE_URL,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("about.what.faq.q1"),
        acceptedAnswer: {
          "@type": "Answer",
          text: `${t("about.what.faq.q1a1")} ${t("about.what.faq.q1link")} ${t("about.what.faq.q1a2")}`,
        },
      },
      {
        "@type": "Question",
        name: t("about.what.faq.q2"),
        acceptedAnswer: {
          "@type": "Answer",
          text: `${t("about.what.faq.q2a1")} ${t("about.what.faq.q2link")} ${t("about.what.faq.q2a2")}`,
        },
      },
      {
        "@type": "Question",
        name: t("about.what.faq.q3"),
        acceptedAnswer: {
          "@type": "Answer",
          text: `${t("about.what.faq.q3a1")} ${t("about.what.faq.q3link1")}${t("about.what.faq.q3a2")} ${t("about.what.faq.q3link2")} ${t("about.what.faq.q3a3")}`,
        },
      },
      {
        "@type": "Question",
        name: t("about.what.faq.q4"),
        acceptedAnswer: {
          "@type": "Answer",
          text: `${t("about.what.faq.q4a1")} ${t("about.what.faq.q4link1")} ${t("about.what.faq.q4a2")} ${t("about.what.faq.q4link2")} ${t("about.what.faq.q4a3")}`,
        },
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <Header />

      <main className="flex-1">
        {/* Page header shared by both tabs: breadcrumb, medical alert, research
            byline and sources — the same header the Movement Planner and
            Exercise Finder use — then the tab bar directly below it. */}
        <Tabs defaultValue="what">
          <div className="container mx-auto max-w-5xl px-4 pb-4 pt-8 md:pt-10">
            <MovementPageMeta
              breadcrumbTitle={t("header.about")}
              researchHref="/team"
            />

            {/* The two studies live here, never inside the prose. */}
            <ol className="mt-2 space-y-1 text-xs text-muted-foreground">
              {CITATIONS.map((citation) => (
                <li key={citation.href}>
                  <a
                    href={citation.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground/90 underline underline-offset-4 hover:text-foreground"
                  >
                    {citation.text}
                  </a>
                </li>
              ))}
            </ol>

            {/* Tab bar, with the Santa Casa announcement directly across */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <TabsList className="rounded-full border border-foreground/20 bg-muted p-1">
                <TabsTrigger
                  value="what"
                  className="rounded-full px-5 text-sm font-semibold text-foreground/80 hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  {t("about.tabs.what")}
                </TabsTrigger>
                <TabsTrigger
                  value="story"
                  className="rounded-full px-5 text-sm font-semibold text-foreground/80 hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  {t("about.tabs.story")}
                </TabsTrigger>
              </TabsList>

              <button
                type="button"
                onClick={() => setStoryAnnouncementOpen(true)}
                aria-haspopup="dialog"
                className="inline-flex items-center gap-2 rounded-full border border-brand-pink/60 bg-brand-pink/10 px-4 py-2 text-sm font-semibold text-brand-pink transition-colors hover:bg-brand-pink/20"
              >
                <HeartHandshake className="h-4 w-4" />
                {t("announcementBanner.storyCta")}
              </button>
            </div>
          </div>

          {/* ── Tab 1 — Our Story ─────────────────────────────────────── */}
          <TabsContent
            value="story"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            {/* Hero */}
            <section className="relative overflow-hidden py-14 md:py-20">
              <GridBackground />
              <div className="container relative mx-auto px-4 md:px-6">
                <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  {t("about.title")}
                </h1>

                {/* Image column is exactly as tall as the copy beside it */}
                <div className="mt-8 grid items-stretch gap-6 md:grid-cols-3">
                  <figure className="aspect-[3/4] overflow-hidden rounded-2xl md:col-span-1 md:aspect-auto">
                    <img
                      src="/media/founder_snare1.jpg"
                      width={281}
                      height={424}
                      loading="eager"
                      decoding="async"
                      alt={t("about.story.altSnare")}
                      className="h-full w-full object-cover"
                    />
                  </figure>
                  <div className="flex flex-col justify-center gap-4 md:col-span-2">
                    <p className="text-xl font-medium text-foreground">
                      {t("about.story.heroLead")}
                    </p>
                    <p className="text-muted-foreground">
                      {t("about.story.heroBody")}
                    </p>
                  </div>
                </div>

                {/* Same grid background as the rows above — one continuous section */}
                <div className="mt-12 grid items-stretch gap-8 md:grid-cols-3">
                  <div className="space-y-4 text-foreground/90 md:col-span-2">
                    <p>{t("about.story.heroPara1")}</p>
                    <p>{t("about.story.heroPara2")}</p>
                    <p>{t("about.story.heroPara3")}</p>
                  </div>
                  <figure className="aspect-[4/3] overflow-hidden rounded-2xl md:col-span-1 md:aspect-auto">
                    <img
                      src="/media/founder_dystonia.jpg"
                      width={1080}
                      height={1080}
                      loading="lazy"
                      decoding="async"
                      alt={t("about.story.altDystonia")}
                      className="h-full w-full object-cover"
                    />
                  </figure>
                </div>
              </div>
            </section>

            {/* Chapter 1 — the diagnosis headline + the reinvention */}
            <section className="border-t border-foreground/10 py-14 md:py-20">
              <div className="container mx-auto max-w-5xl px-4 md:px-6">
                <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {t("about.story.chapterOneTitle")}
                </h2>

                {/* Row 1: disney photo | the reinvention copy */}
                <div className="grid items-stretch gap-6 md:grid-cols-3">
                  <figure className="aspect-[3/4] overflow-hidden rounded-2xl md:col-span-1 md:aspect-auto">
                    <img
                      src="/media/founder_disney.jpg"
                      width={960}
                      height={1200}
                      loading="lazy"
                      decoding="async"
                      alt={t("about.story.altDisney")}
                      className="h-full w-full object-cover"
                    />
                  </figure>
                  <div className="flex flex-col justify-center space-y-4 text-foreground/90 md:col-span-2">
                    <p>{t("about.story.disneyPara1")}</p>
                    <p>{t("about.story.disneyPara2")}</p>
                  </div>
                </div>

                {/* Row 2: the diagnosis runs on | movement loop on the right */}
                <div className="mt-8 grid items-stretch gap-6 md:grid-cols-3">
                  <div className="flex flex-col justify-center space-y-4 text-foreground/90 md:col-span-2">
                    <p>{t("about.story.progressPara1")}</p>
                    <p>{t("about.story.progressPara2")}</p>
                    <p>{t("about.story.progressPara3")}</p>
                  </div>
                  <figure className="aspect-[3/4] overflow-hidden rounded-2xl md:col-span-1 md:aspect-auto">
                    <video
                      src="/media/founder_dystonia_loop.mp4"
                      poster="/media/founder_dystonia_loop_poster.jpg"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                      tabIndex={-1}
                      className="h-full w-full object-cover"
                    />
                    <figcaption className="sr-only">
                      {t("about.story.rehabCaption")}
                    </figcaption>
                  </figure>
                </div>
              </div>
            </section>

            {/* Chapter 2 — movement as medicine */}
            <section className="border-t border-foreground/10 py-14 md:py-20">
              <div className="container mx-auto max-w-3xl px-4 md:px-6">
                {/* Title lands here — immediately before the Buenos Aires turn */}
                <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {t("about.story.chapterTwoTitle")}
                </h2>

                <div className="mt-5 space-y-4 text-foreground/90">
                  <p>{t("about.story.buenosPara")}</p>

                  {/* Full-width Buenos Aires turn — silent loop, no GIF payload */}
                  <figure className="overflow-hidden rounded-2xl">
                    <video
                      src="/media/founder_tango_loop.mp4"
                      poster="/media/founder_tango_poster.jpg"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                      tabIndex={-1}
                      className="w-full"
                    />
                    <figcaption className="sr-only">
                      {t("about.story.tangoCaption")}
                    </figcaption>
                  </figure>

                  <p>{t("about.story.neurologistIntro")}</p>
                  <blockquote className="rounded-2xl border-l-4 border-foreground bg-secondary p-6 text-lg font-medium italic text-foreground">
                    {t("about.story.quote")}
                    <footer className="mt-3 text-sm font-normal not-italic text-muted-foreground">
                      {t("about.story.quoteBy")}
                    </footer>
                  </blockquote>

                  <p>{t("about.story.hardlyPara")}</p>
                  <p>{t("about.story.missionPara")}</p>
                </div>

                <StoryCtas />
              </div>
            </section>
          </TabsContent>

          {/* ── Tab 2 — What is FreeBrain ─────────────────────────────── */}
          <TabsContent
            value="what"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            {/* Who FreeBrain is for — audiences with supporting photos */}
            <section className="py-14 md:py-20">
              <div className="container mx-auto max-w-4xl px-4 md:px-6">
                <div className="space-y-4 text-foreground/90">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {t("about.what.appTitle")}
                  </h2>

                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    {t("about.what.forPublicTitle")}
                  </h3>
                  {/* Copy left, photo right — photo matches the text height */}
                  <div className="grid items-stretch gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                      <p>
                        {t("about.what.forPublicBody1")}{" "}
                        <Link to="/bunny-challenge" className={LINK_CLASS}>
                          {t("about.what.forPublicLink")}
                        </Link>
                        {t("about.what.forPublicBody2")}
                      </p>
                      {/* Same blue CTA the header's mobile nav uses */}
                      <Button
                        asChild
                        className="mt-4 border border-foreground/20 bg-brand text-white shadow-md hover:bg-brand-hover"
                      >
                        <Link to="/bunny-challenge#bunny-escape-challenge">
                          {t("header.tryBunnyDemo")}
                        </Link>
                      </Button>
                    </div>
                    <figure className="aspect-[3/4] overflow-hidden rounded-2xl md:col-span-1 md:aspect-auto">
                      <img
                        src="/whatis_grandmatiktok.png"
                        width={212}
                        height={377}
                        loading="lazy"
                        decoding="async"
                        alt={t("about.what.altGrandmaTiktok")}
                        className="h-full w-full object-cover"
                      />
                    </figure>
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    {t("about.what.forNursingTitle")}
                  </h3>
                  {/* Photo left, copy right — photo matches the text height */}
                  <div className="grid items-stretch gap-6 md:grid-cols-3">
                    <figure className="aspect-[3/4] overflow-hidden rounded-2xl md:col-span-1 md:aspect-auto">
                      <img
                        src="/whatis_nursingstaff.png"
                        width={692}
                        height={1228}
                        loading="lazy"
                        decoding="async"
                        alt={t("about.what.altNursingStaff")}
                        className="h-full w-full object-cover"
                      />
                    </figure>
                    <div className="md:col-span-2">
                      <p>{t("about.what.forNursingBody")}</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    {t("about.what.forTrainersTitle")}
                  </h3>
                  <p>{t("about.what.forTrainersBody")}</p>
                </div>

                {/* First clinic partnership — right below the audiences */}
                <div className="mt-10">
                  <CentroAnnouncementCard />
                </div>
              </div>
            </section>

            {/* Why movement therapy matters — the 43% reach, above the
                caregiver guide and below the clinic partnership */}
            <section className="relative overflow-hidden border-t border-foreground/10 py-14 md:py-20">
              <GridBackground lineOpacity={0.12} glowOpacity={0.1} />
              <div className="container relative mx-auto max-w-3xl px-4 md:px-6">
                <div className="space-y-4 text-center text-foreground/90">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {t("about.what.reachTitle")}
                  </h2>
                  <p>{t("about.what.reachPara1")}</p>
                  <p>{t("about.what.reachPara2")}</p>
                  <p className="text-xl font-semibold text-foreground">
                    {t("about.what.reachPara3")}
                  </p>
                </div>
              </div>
            </section>

            {/* Caregiver activities */}
            <section className="border-t border-foreground/10 py-14 md:py-20">
              <div className="container mx-auto max-w-5xl px-4 md:px-6">
                <div className="space-y-4 text-foreground/90">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {t("about.what.caregiverTitle")}
                  </h2>
                  <p>{t("about.what.caregiverPara1")}</p>
                  <p>{t("about.what.caregiverPara2")}</p>
                  <p>{t("about.what.caregiverPara3")}</p>
                </div>

                {/* Half-size gallery: 4 across at half the column width on desktop */}
                <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4 lg:max-w-lg">
                  <StoryVideo
                    src="/media/about_babydance.mp4"
                    poster="/media/about_babydance_poster.jpg"
                    caption={t("about.what.captions.early")}
                  />
                  <StoryVideo
                    src="/media/about_grandmadance.mp4"
                    poster="/media/about_grandmadance_poster.jpg"
                    caption={t("about.what.captions.grandma")}
                  />
                  <StoryVideo
                    src="/media/about_boxingclinicians.mp4"
                    poster="/media/about_boxingclinicians_poster.jpg"
                    caption={t("about.what.captions.boxing")}
                  />
                  <StoryVideo
                    src="/media/about_movementchallenge.mp4"
                    poster="/media/about_movementchallenge_poster.jpg"
                    caption={t("about.what.captions.challenge")}
                  />
                </div>
              </div>
            </section>

            {/* The evidence — the two studies are listed in the page header */}
            <section className="border-t border-foreground/10 py-14 md:py-20">
              <div className="container mx-auto max-w-4xl px-4 md:px-6">
                <div className="space-y-4 text-foreground/90">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {t("about.what.exerciseTitle")}
                  </h2>
                  <p>{t("about.what.exercisePara1")}</p>
                  <p>{t("about.what.exercisePara2")}</p>
                </div>
              </div>
            </section>

            {/* FAQ — long-tail questions from docs/growth-strategy.md */}
            <section className="border-t border-foreground/10 py-14 md:py-20">
              <div className="container mx-auto max-w-4xl px-4 md:px-6">
                <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {t("about.what.faqTitle")}
                </h2>
                <FaqAccordion
                  items={[
                    {
                      id: "about-faq-1",
                      question: t("about.what.faq.q1"),
                      answer: (
                        <>
                          {t("about.what.faq.q1a1")}{" "}
                          <a
                            href="https://www.bmj.com/content/384/bmj-2023-075847"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={LINK_CLASS}
                          >
                            {t("about.what.faq.q1link")}
                          </a>{" "}
                          {t("about.what.faq.q1a2")}
                        </>
                      ),
                    },
                    {
                      id: "about-faq-2",
                      question: t("about.what.faq.q2"),
                      answer: (
                        <>
                          {t("about.what.faq.q2a1")}{" "}
                          <Link to="/movement-planner" className={LINK_CLASS}>
                            {t("about.what.faq.q2link")}
                          </Link>{" "}
                          {t("about.what.faq.q2a2")}
                        </>
                      ),
                    },
                    {
                      id: "about-faq-3",
                      question: t("about.what.faq.q3"),
                      answer: (
                        <>
                          {t("about.what.faq.q3a1")}{" "}
                          <Link to="/movement-planner" className={LINK_CLASS}>
                            {t("about.what.faq.q3link1")}
                          </Link>
                          {t("about.what.faq.q3a2")}{" "}
                          <Link to="/movements" className={LINK_CLASS}>
                            {t("about.what.faq.q3link2")}
                          </Link>{" "}
                          {t("about.what.faq.q3a3")}
                        </>
                      ),
                    },
                    {
                      id: "about-faq-4",
                      question: t("about.what.faq.q4"),
                      answer: (
                        <>
                          {t("about.what.faq.q4a1")}{" "}
                          <Link to="/bunny-challenge" className={LINK_CLASS}>
                            {t("about.what.faq.q4link1")}
                          </Link>{" "}
                          {t("about.what.faq.q4a2")}{" "}
                          <Link to="/movements" className={LINK_CLASS}>
                            {t("about.what.faq.q4link2")}
                          </Link>{" "}
                          {t("about.what.faq.q4a3")}
                        </>
                      ),
                    },
                  ]}
                />

                <StoryCtas />
              </div>
            </section>
          </TabsContent>
        </Tabs>

        {/* Santa Casa announcement, opened from the button across the tabs */}
        <AnnouncementDialog
          open={storyAnnouncementOpen}
          onOpenChange={setStoryAnnouncementOpen}
          variant="santaCasa"
        />
      </main>

      <Footer />
    </div>
  );
};

export default About;
