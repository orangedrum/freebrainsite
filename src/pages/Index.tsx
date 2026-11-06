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
        {/* Organization JSON-LD lives statically in index.html (non-JS fallback for
            crawlers) — do not duplicate it here or crawlers see two Organizations. */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "FreeBrain",
            "url": "https://www.freethebrains.com",
            "description": "FreeBrain offers movement therapy, guided exercises, and personalized plans for Parkinson's, MS, stroke recovery, and other neurological conditions."
          })}
        </script>
        <meta name="description" content="FreeBrain offers movement therapy, guided exercises, and personalized plans for Parkinson's, MS, stroke recovery, and other neurological conditions." />
        <link rel="canonical" href="https://www.freethebrains.com/" />
        <meta property="og:title" content="FreeBrain — Movement Therapy for Neurological Conditions" />
        <meta property="og:description" content="FreeBrain offers movement therapy, guided exercises, and personalized plans for Parkinson's, MS, stroke recovery, and other neurological conditions." />
        <meta property="og:url" content="https://www.freethebrains.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://vibe.filesafe.space/1782179753705442134/assets/de6cc338-aff0-4728-a0d5-b16baa753da7.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FreeBrain — Movement Therapy for Neurological Conditions" />
        <meta name="twitter:description" content="FreeBrain offers movement therapy, guided exercises, and personalized plans for Parkinson's, MS, stroke recovery, and other neurological conditions." />
        <meta name="twitter:image" content="https://vibe.filesafe.space/1782179753705442134/assets/de6cc338-aff0-4728-a0d5-b16baa753da7.png" />
      </Helmet>
      <Header />

      <main className="flex-1">
        <HeroSection onOpenModal={openModal} />
        <WebSummitSection />
        <ConditionsMarquee />

        <section id="platform" className="relative scroll-mt-24 overflow-hidden py-20 md:py-32 z-0">
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
