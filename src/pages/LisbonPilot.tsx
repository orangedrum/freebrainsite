import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Modal } from "@/components/shared/Modal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GridBackground } from "@/components/shared/GridBackground";
import { VideoPlayer } from "@/components/shared/VideoPlayer";
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
            />
          </div>
        </section>

        <section className="py-10 md:py-12">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-8">
            <div className="grid gap-8 md:grid-cols-2 md:items-start">
              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold tracking-tight text-foreground md:text-xl">
                    {t("lisbonPilot.introTitle")}
                  </h4>
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
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {t("lisbonPilot.offerTitle")}
              </h3>
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
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {t("lisbonPilot.askTitle")}
              </h3>
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
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {t("lisbonPilot.safetyTitle")}
              </h3>
              <div className="rounded-2xl bg-secondary border border-foreground/10 p-6 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("lisbonPilot.safetyBody")}
                </p>
                <p className="text-sm text-muted-foreground">{t("lisbonPilot.safetyNote")}</p>
              </div>
            </div>

            <div className="md:col-span-2 rounded-2xl bg-secondary border border-foreground/10 p-8 text-center space-y-4">
              <h3 className="text-xl font-bold text-foreground">{t("lisbonPilot.nextTitle")}</h3>
              <p className="text-muted-foreground">{t("lisbonPilot.nextBody")}</p>
              <button
                type="button"
                onClick={() => openExternalLink(EXTERNAL_LINKS.jeanWhatsapp)}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-brand-hover"
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
