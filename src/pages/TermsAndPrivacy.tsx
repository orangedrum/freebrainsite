import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Modal } from "@/components/shared/Modal";
import { useModalState } from "@/hooks/useModalState";

const TermsAndPrivacy = () => {
  const { t } = useTranslation();
  const { modalConfig, openModal, closeModal } = useModalState();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Helmet>
        <title>{t("termsPrivacy.metaTitle")}</title>
        <meta name="description" content={t("termsPrivacy.intro")} />
        <link rel="canonical" href="https://www.freethebrains.com/terms-and-privacy" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Header onOpenModal={openModal} />
      <main className="flex-1">
        <section className="container mx-auto max-w-4xl space-y-8 px-4 py-12 md:px-6 md:py-20">
          <header className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              {t("termsPrivacy.title")}
            </h1>
            <p className="text-lg text-muted-foreground">{t("termsPrivacy.intro")}</p>
          </header>
          <article className="space-y-4 rounded-2xl border border-foreground/10 bg-secondary p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground">
              {t("termsPrivacy.recordingTitle")}
            </h2>
            <p className="text-foreground/90">{t("termsPrivacy.recordingOptional")}</p>
            <p className="text-foreground/90">{t("termsPrivacy.recordingPermission")}</p>
            <p className="text-foreground/90">{t("termsPrivacy.recordingStorage")}</p>
            <p className="text-foreground/90">{t("termsPrivacy.recordingControls")}</p>
          </article>
          <article className="space-y-4 rounded-2xl border border-foreground/10 bg-secondary p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground">
              {t("termsPrivacy.leaderboardTitle")}
            </h2>
            <p className="text-foreground/90">{t("termsPrivacy.leaderboardConsent")}</p>
            <p className="text-foreground/90">{t("termsPrivacy.leaderboardData")}</p>
          </article>
          <p className="text-sm text-muted-foreground">
            {t("termsPrivacy.fullPolicyNotice")}
          </p>
          <Link
            to="/bunny-challenge"
            className="inline-block text-foreground underline underline-offset-4 hover:text-primary"
          >
            {t("termsPrivacy.backToChallenge")}
          </Link>
        </section>
      </main>
      <Footer />
      <Modal config={modalConfig} onOpenChange={(open) => { if (!open) closeModal(); }} />
    </div>
  );
};

export default TermsAndPrivacy;
