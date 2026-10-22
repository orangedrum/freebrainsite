import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Modal } from "@/components/shared/Modal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Pill } from "@/components/shared/Pill";
import { GridBackground } from "@/components/shared/GridBackground";
import { useModalState } from "@/hooks/useModalState";
import { EXTERNAL_LINKS } from "@/lib/constants";
import { openExternalLink } from "@/lib/navigation";

/** Lisbon movement pilot page — FreeBrain styles, tango workshops for Parkinson's. */
const LisbonPilot = () => {
  const { t } = useTranslation();
  const { modalConfig, openModal, closeModal } = useModalState();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Header onOpenModal={openModal} />
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 md:py-32 z-0">
          <GridBackground />
          <div className="container relative mx-auto px-4 md:px-6 z-10">
            <Pill>{t("lisbonPilot.eyebrow")}</Pill>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
              {t("lisbonPilot.title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              {t("lisbonPilot.lead")}
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="inline-flex items-center rounded-full border border-brand-accent bg-foreground/10 px-3 py-1 text-xs font-medium text-foreground">
                {t("lisbonPilot.tagFree")}
              </span>
              <span className="inline-flex items-center rounded-full border border-brand-accent bg-foreground/10 px-3 py-1 text-xs font-medium text-foreground">
                {t("lisbonPilot.tagDuration")}
              </span>
              <span className="inline-flex items-center rounded-full border border-brand-accent bg-foreground/10 px-3 py-1 text-xs font-medium text-foreground">
                {t("lisbonPilot.tagPaperwork")}
              </span>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-12">
            <div className="space-y-3">
              <SectionHeading title={t("lisbonPilot.whyTitle")} className="mb-6" />
              <p className="text-muted-foreground leading-relaxed">{t("lisbonPilot.whyBody")}</p>
            </div>

            <div className="space-y-3">
              <SectionHeading title={t("lisbonPilot.offerTitle")} className="mb-6" />
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
              <SectionHeading title={t("lisbonPilot.askTitle")} className="mb-6" />
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
              <SectionHeading title={t("lisbonPilot.howTitle")} className="mb-6" />
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

            <div className="space-y-3">
              <SectionHeading title={t("lisbonPilot.safetyTitle")} className="mb-6" />
              <div className="rounded-2xl bg-secondary border border-foreground/10 p-6 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("lisbonPilot.safetyBody")}
                </p>
                <p className="text-sm text-muted-foreground">{t("lisbonPilot.safetyNote")}</p>
              </div>
            </div>

            <div className="space-y-3">
              <SectionHeading title={t("lisbonPilot.appTitle")} className="mb-6" />
              <p className="text-muted-foreground leading-relaxed">{t("lisbonPilot.appBody")}</p>
            </div>

            <div className="space-y-3">
              <SectionHeading title={t("lisbonPilot.summitTitle")} className="mb-6" />
              <p className="text-muted-foreground leading-relaxed">{t("lisbonPilot.summitBody")}</p>
            </div>

            <div className="rounded-2xl bg-secondary border border-foreground/10 p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{t("lisbonPilot.nextTitle")}</h2>
              <p className="text-muted-foreground">{t("lisbonPilot.nextBody")}</p>
              <button
                type="button"
                onClick={() => openExternalLink("https://wa.me/573233284172")}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-primary/90"
              >
                {t("lisbonPilot.cta")}
              </button>
            </div>
          </div>
        </section>
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

export default LisbonPilot;
