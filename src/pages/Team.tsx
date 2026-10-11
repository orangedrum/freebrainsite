import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Modal } from "@/components/shared/Modal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GridBackground } from "@/components/shared/GridBackground";
import { AdvisorsSection } from "@/components/shared/AdvisorsSection";
import { FounderSection } from "@/features/team/FounderSection";
import { TeamStatsSection } from "@/features/team/TeamStatsSection";
import { GetInvolvedSection } from "@/features/home/GetInvolvedSection";
import { useModalState } from "@/hooks/useModalState";

/** Team page — slim composition layer: founder spotlight + advisors. */
const Team = () => {
  const { t } = useTranslation();
  const { modalConfig, openModal, closeModal } = useModalState();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Header onOpenModal={openModal} />

      <main className="flex-1">
        <section className="relative overflow-hidden py-20 md:py-32 z-0">
          <img
            src="/disneydesignsprint.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-bottom md:object-[50%_75%]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-background/85" />
          <GridBackground />
          <div className="container relative mx-auto px-4 md:px-6 z-10">
            <SectionHeading title={t("team.title")} subtitle={t("team.subtitle")} />
          </div>
        </section>

        <AdvisorsSection onOpenModal={openModal} />
        <FounderSection />
        <TeamStatsSection />
        <GetInvolvedSection onOpenModal={openModal} />
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

export default Team;
