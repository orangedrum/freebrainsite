import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Modal } from "@/components/shared/Modal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GridBackground } from "@/components/shared/GridBackground";
import { HeroSection } from "@/features/home/HeroSection";
import { ConditionsMarquee } from "@/features/home/ConditionsMarquee";
import { WebSummitSection } from "@/features/home/WebSummitSection";
import { OnDemandTherapySection } from "@/features/home/OnDemandTherapySection";
import { BecomeFreeBrainerSection } from "@/features/home/BecomeFreeBrainerSection";
import { GetInvolvedSection } from "@/features/home/GetInvolvedSection";
import { SupportingEvidenceSection } from "@/features/home/SupportingEvidenceSection";
import { SocialFeedsSection } from "@/features/home/SocialFeedsSection";
import { useModalState } from "@/hooks/useModalState";

/** Home page — slim composition layer that orchestrates all sections. */
const Index = () => {
  const { t } = useTranslation();
  const { modalConfig, openModal, closeModal } = useModalState();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Helmet>
        <title>FreeBrain — Movement Therapy for Neurological Conditions</title>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "FreeBrain",
            "url": "https://www.freethebrains.com",
            "logo": "https://www.freethebrains.com/smoothlogo.png",
            "description": "On-demand movement therapy for neurological conditions. Free movement plans, exercise videos, and guided routines.",
            "sameAs": []
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "FreeBrain",
            "url": "https://www.freethebrains.com",
            "description": "Free movement therapy for neurological conditions. Movement plans, exercise videos, and guided routines for Parkinson's, MS, stroke recovery, and more.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.freethebrains.com/movements?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
        <meta name="description" content="FreeBrain is positively addicting on-demand movement therapy for your brain. Free movement plans, exercise videos, and guided routines for Parkinson's, MS, stroke recovery, and more." />
        <link rel="canonical" href="https://www.freethebrains.com/" />
        <meta property="og:title" content="FreeBrain — Movement Therapy for Neurological Conditions" />
        <meta property="og:description" content="FreeBrain is positively addicting on-demand movement therapy for your brain. Free movement plans, exercise videos, and guided routines." />
        <meta property="og:url" content="https://www.freethebrains.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FreeBrain — Movement Therapy for Neurological Conditions" />
        <meta name="twitter:description" content="Free movement plans, exercise videos, and guided routines for Parkinson's, MS, stroke recovery, and more." />
      </Helmet>
      <Header />

      <main className="flex-1">
        <HeroSection onOpenModal={openModal} />
        <WebSummitSection />
        <ConditionsMarquee />

        <section id="platform" className="relative overflow-hidden py-20 md:py-32 z-0">
          <GridBackground />
          <div className="container relative mx-auto px-4 md:px-6 z-10">
            <SectionHeading
              title={t("platform.title")}
              subtitle={t("platform.subtitle")}
            />
            <div className="max-w-4xl mx-auto">
              <OnDemandTherapySection onOpenModal={openModal} />
              <BecomeFreeBrainerSection onOpenModal={openModal} />
            </div>
          </div>
        </section>

        <GetInvolvedSection onOpenModal={openModal} />
        <SupportingEvidenceSection />
        <SocialFeedsSection />
      </main>

      <Footer />

      <Modal
        config={modalConfig}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
      />
    </div>
  );
};

export default Index;
